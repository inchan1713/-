let minecraftItems = [];

// 1. アイテムリスト読み込み & 予測変換の強制有効化
async function loadMinecraftItems() {
    const url = 'https://raw.githubusercontent.com/PrismarineJS/minecraft-data/master/data/pc/1.21.4/items.json';
    try {
        const response = await fetch(url);
        const data = await response.json();
        minecraftItems = data.map(item => item.name.toUpperCase());

        // datalistを確実に生成して紐付ける
        const input = document.getElementById('material-id');
        let dl = document.getElementById('item-suggestions');
        
        // もしHTMLにdatalistがなければ作る
        if (!dl) {
            dl = document.createElement('datalist');
            dl.id = 'item-suggestions';
            document.body.appendChild(dl);
        }
        
        dl.innerHTML = minecraftItems.map(id => `<option value="${id}">`).join('');
        input.setAttribute('list', 'item-suggestions');
        
        console.log("✅ 予測変換リストを同期しました");
    } catch (e) { console.error("データ取得失敗"); }
}

// 2. インベントリ生成
function initInventory() {
    const inventory = document.getElementById('inventory');
    if (!inventory) return;
    inventory.innerHTML = '';
    for (let i = 0; i < 54; i++) {
        const slot = document.createElement('div');
        slot.classList.add('slot');
        slot.innerHTML = `<span>${i}</span>`;
        slot.onclick = () => {
            document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
        };
        inventory.appendChild(slot);
    }
}

// Wiki用ファイル名変換 (例: DIAMOND_SWORD -> Diamond_Sword)
function toWikiName(id) {
    return id.toLowerCase().split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('_');
}

// 3. アイテム配置処理 (デバッグ済)
document.getElementById('save-btn')?.addEventListener('click', () => {
    const val = document.getElementById('material-id').value.toUpperCase().trim();
    const slot = document.querySelector('.slot.selected');

    if (!slot || !val) return;
    if (!minecraftItems.includes(val)) return alert("無効なアイテムIDです");

    slot.querySelectorAll('img, .no-img').forEach(el => el.remove());

    const wikiName = toWikiName(val);
    const lowId = val.toLowerCase();

    // 【デバッグ】Wikiを最優先にし、ダメならバックアップ
    const urls = [
        `https://minecraft.wiki/images/Invicon_${wikiName}.png`, // Wikiの標準アイコン
        `https://minecraft.wiki/images/${wikiName}.png`,        // Wikiの直ファイル名
        `https://mc-heads.net/item/${lowId}`,                   // バックアップ1 (コンパスに強い)
        `https://minecraft-api.vercel.app/images/items/${lowId}.png` // バックアップ2
    ];

    const img = document.createElement('img');
    let idx = 0;

    const tryLoad = () => {
        img.src = urls[idx];
    };

    img.onerror = () => {
        idx++;
        if (idx < urls.length) {
            tryLoad();
        } else {
            const err = document.createElement('div');
            err.className = 'no-img';
            err.innerText = '無';
            slot.appendChild(err);
        }
    };

    slot.appendChild(img);
    tryLoad();
});

// 初期起動
window.onload = () => {
    loadMinecraftItems();
    initInventory();
};
