let minecraftItems = [];

// 1. アイテムデータの読み込み
async function loadMinecraftItems() {
    const materialInput = document.getElementById('material-id');
    if (!materialInput) return;

    const url = 'https://raw.githubusercontent.com/PrismarineJS/minecraft-data/master/data/pc/1.21.4/items.json';

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('データ取得失敗');
        const data = await response.json();
        
        minecraftItems = data.map(item => item.name.toUpperCase());

        let dataList = document.getElementById('item-suggestions');
        if (!dataList) {
            dataList = document.createElement('datalist');
            dataList.id = 'item-suggestions';
            document.body.appendChild(dataList);
        }
        
        materialInput.setAttribute('list', 'item-suggestions');
        dataList.innerHTML = minecraftItems.map(id => `<option value="${id}">`).join('');
        
        console.log("✅ アイテム読み込み完了: " + minecraftItems.length + "種類");
    } catch (error) {
        console.error("❌ アイテム読み込みエラー:", error);
    }
}

// 2. 54スロットを生成
function initInventory() {
    const inventory = document.getElementById('inventory');
    if (!inventory) return;
    inventory.innerHTML = '';

    for (let i = 0; i < 54; i++) {
        const slot = document.createElement('div');
        slot.classList.add('slot');
        slot.dataset.index = i;
        
        const span = document.createElement('span');
        span.innerText = i;
        slot.appendChild(span);

        slot.addEventListener('click', () => {
            document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
        });
        inventory.appendChild(slot);
    }
}

// 3. 保存ボタンの動作
document.getElementById('save-btn')?.addEventListener('click', () => {
    const materialInput = document.getElementById('material-id');
    const materialValue = materialInput.value.toUpperCase().trim();
    const selectedSlot = document.querySelector('.slot.selected');

    if (!selectedSlot) {
        alert("編集したいスロットを先にクリックしてください！");
        return;
    }

    if (minecraftItems.includes(materialValue)) {
        // 既存の画像を削除
        const oldImg = selectedSlot.querySelector('img');
        if (oldImg) oldImg.remove();

        const img = document.createElement('img');
        const lowerId = materialValue.toLowerCase();

        // 画像取得URL
        img.src = `https://minecraft-api.vercel.app/images/items/${lowerId}.png`;
        
        // 読み込み失敗時のバックアップ
        img.onerror = () => {
            img.src = `https://mc-heads.net/item/${lowerId}`;
        };

        img.alt = materialValue;
        selectedSlot.appendChild(img);
        
        console.log(`スロット ${selectedSlot.dataset.index} に ${materialValue} を配置`);
    } else {
        alert(`⚠️ アイテムID '${materialValue}' は存在しません。`);
    }
});

// 起動
window.addEventListener('DOMContentLoaded', () => {
    initInventory();
    loadMinecraftItems();
});
