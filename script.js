let minecraftItems = [];

// アイテムデータの読み込み
async function loadMinecraftItems() {
    const url = 'https://raw.githubusercontent.com/PrismarineJS/minecraft-data/master/data/pc/1.21.4/items.json';
    try {
        const response = await fetch(url);
        const data = await response.json();
        minecraftItems = data.map(item => item.name.toUpperCase());
        const dataList = document.getElementById('item-suggestions') || document.createElement('datalist');
        dataList.id = 'item-suggestions';
        document.body.appendChild(dataList);
        document.getElementById('material-id').setAttribute('list', 'item-suggestions');
        dataList.innerHTML = minecraftItems.map(id => `<option value="${id}">`).join('');
    } catch (e) { console.error("アイテムデータ取得失敗"); }
}

// インベントリの初期化
function initInventory() {
    const inventory = document.getElementById('inventory');
    inventory.innerHTML = '';
    for (let i = 0; i < 54; i++) {
        const slot = document.createElement('div');
        slot.classList.add('slot');
        slot.innerHTML = `<span>${i}</span>`;
        slot.addEventListener('click', () => {
            document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
        });
        inventory.appendChild(slot);
    }
}

// 保存ボタン（アイテム配置）の処理
document.getElementById('save-btn')?.addEventListener('click', () => {
    const materialValue = document.getElementById('material-id').value.toUpperCase().trim();
    const selectedSlot = document.querySelector('.slot.selected');

    if (!selectedSlot) return alert("スロットを選択してください");
    if (!minecraftItems.includes(materialValue)) return alert("有効なアイテムIDを入力してください");

    const lowerId = materialValue.toLowerCase();
    
    // 【解決】コンパス等が出ない問題への対策URLリスト
    const urls = [
        `https://mc-heads.net/item/${lowerId}`, // 拡張子なしリクエスト（コンパスに最強）
        `https://raw.githubusercontent.com/PrismarineJS/minecraft-assets/master/data/1.21/items/${lowerId}.png`,
        `https://minecraft-api.vercel.app/images/items/${lowerId}.png`
    ];

    selectedSlot.querySelectorAll('img').forEach(i => i.remove());
    selectedSlot.querySelectorAll('.no-img').forEach(i => i.remove());

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
            const errLabel = document.createElement('div');
            errLabel.className = 'no-img';
            errLabel.innerText = '無';
            errLabel.style.fontSize = '10px';
            selectedSlot.appendChild(errLabel);
        }
    };

    selectedSlot.appendChild(img);
    tryLoad();
    console.log(`スロットに ${materialValue} を配置`);
});

window.addEventListener('DOMContentLoaded', () => {
    initInventory();
    loadMinecraftItems();
});
