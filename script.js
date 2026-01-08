let minecraftItems = [];
const SPRITE_SIZE = 32; // アイテム1つのサイズ
const SHEET_WIDTH = 32; // 横に並んでいるアイテム数

async function loadMinecraftItems() {
    // 1.21対応のアイテムリストを取得
    const url = 'https://raw.githubusercontent.com/PrismarineJS/minecraft-data/master/data/pc/1.21.4/items.json';
    try {
        const response = await fetch(url);
        minecraftItems = await response.json();
        const dataList = document.getElementById('item-suggestions') || document.createElement('datalist');
        dataList.id = 'item-suggestions';
        document.body.appendChild(dataList);
        document.getElementById('material-id').setAttribute('list', 'item-suggestions');
        dataList.innerHTML = minecraftItems.map(item => `<option value="${item.name.toUpperCase()}">`).join('');
    } catch (e) { console.error("データ読み込み失敗"); }
}

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

document.getElementById('save-btn')?.addEventListener('click', () => {
    const materialValue = document.getElementById('material-id').value.toUpperCase().trim();
    const selectedSlot = document.querySelector('.slot.selected');

    if (!selectedSlot) return alert("スロットを選択してください");
    
    // アイテムを探す（IDまたは名前）
    const itemData = minecraftItems.find(item => item.name.toUpperCase() === materialValue);
    
    if (itemData) {
        selectedSlot.querySelectorAll('.item-icon, .no-img').forEach(el => el.remove());

        // スプライト上の位置を計算 (indexを利用)
        const iconIndex = itemData.id; 
        const x = (iconIndex % SHEET_WIDTH) * SPRITE_SIZE;
        const y = Math.floor(iconIndex / SHEET_WIDTH) * SPRITE_SIZE;

        const icon = document.createElement('div');
        icon.className = 'item-icon';
        icon.style.backgroundPosition = `-${x}px -${y}px`;
        
        selectedSlot.appendChild(icon);
    } else {
        alert("無効なアイテムIDです。候補から選んでください。");
    }
});

window.addEventListener('DOMContentLoaded', () => {
    initInventory();
    loadMinecraftItems();
});
