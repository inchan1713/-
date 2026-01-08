let minecraftItems = [];

// 1. 予測変換の初期化 (絶対に消えないように実行順序を整理)
async function setupItemData() {
    const materialInput = document.getElementById('material-id');
    const dataList = document.getElementById('item-suggestions');
    
    const url = 'https://raw.githubusercontent.com/PrismarineJS/minecraft-data/master/data/pc/1.21.4/items.json';
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // アイテムIDを抽出
        minecraftItems = data.map(item => item.name.toUpperCase());

        // datalistの中身を構築
        dataList.innerHTML = minecraftItems.map(id => `<option value="${id}">`).join('');
        
        // インプットにdatalistを強制紐付け
        materialInput.setAttribute('list', 'item-suggestions');
        
        console.log("✅ 予測変換リスト構築完了");
    } catch (e) {
        console.error("データ取得失敗:", e);
    }
}

// 2. インベントリ生成
function createInventory() {
    const grid = document.getElementById('inventory');
    grid.innerHTML = '';
    for (let i = 0; i < 54; i++) {
        const slot = document.createElement('div');
        slot.classList.add('slot');
        slot.innerHTML = `<span>${i}</span>`;
        slot.onclick = () => {
            document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
        };
        grid.appendChild(slot);
    }
}

// 3. 画像配置処理 (Wiki制限を回避する最強ルート)
document.getElementById('save-btn')?.addEventListener('click', () => {
    const val = document.getElementById('material-id').value.toUpperCase().trim();
    const slot = document.querySelector('.slot.selected');

    if (!slot || !val) return;
    if (!minecraftItems.includes(val)) return alert("有効なIDではありません");

    slot.querySelectorAll('img, .no-img').forEach(el => el.remove());

    const lowId = val.toLowerCase();
    
    // 【決定版】取得URLリスト (Wikiの制限を回避できる順序)
    const urls = [
        `https://mc-heads.net/item/${lowId}`, // 1. コンパス、時計、ポーションに最強（Wikiのコピー）
        `https://minecraft-api.vercel.app/images/items/${lowId}.png`, // 2. 高速バックアップ
        `https://raw.githubusercontent.com/PrismarineJS/minecraft-assets/master/data/1.21/items/${lowId}.png` // 3. 最終手段
    ];

    const img = document.createElement('img');
    let attempt = 0;

    const tryNext = () => {
        if (attempt < urls.length) {
            img.src = urls[attempt];
            attempt++;
        } else {
            const err = document.createElement('div');
            err.className = 'no-img';
            err.innerText = '無';
            slot.appendChild(err);
        }
    };

    img.onerror = tryNext;
    slot.appendChild(img);
    tryNext();
});

// 実行
document.addEventListener('DOMContentLoaded', () => {
    setupItemData();
    createInventory();
});
