let minecraftItems = [];

// 1. アイテムデータの読み込み
async function loadMinecraftItems() {
    const materialInput = document.getElementById('material-id');
    if (!materialInput) return;

    const url = 'https://raw.githubusercontent.com/PrismarineJS/minecraft-data/master/data/pc/1.21.4/items.json';

    try {
        const response = await fetch(url);
        const data = await response.json();
        minecraftItems = data.map(item => item.name.toUpperCase());

        let dataList = document.getElementById('item-suggestions') || document.createElement('datalist');
        dataList.id = 'item-suggestions';
        document.body.appendChild(dataList);
        
        materialInput.setAttribute('list', 'item-suggestions');
        dataList.innerHTML = minecraftItems.map(id => `<option value="${id}">`).join('');
        console.log("✅ アイテム読み込み完了: " + minecraftItems.length + "種類");
    } catch (e) {
        console.error("読み込み失敗", e);
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
        slot.innerHTML = `<span>${i}</span>`;
        
        slot.addEventListener('click', () => {
            document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
        });
        inventory.appendChild(slot);
    }
}

// 3. 保存ボタンの動作（コンパス・ポーション対応版）
document.getElementById('save-btn')?.addEventListener('click', () => {
    const materialValue = document.getElementById('material-id').value.toUpperCase().trim();
    const selectedSlot = document.querySelector('.slot.selected');

    if (!selectedSlot) {
        alert("スロットを選択してください");
        return;
    }

    if (minecraftItems.includes(materialValue)) {
        const oldImg = selectedSlot.querySelector('img');
        if (oldImg) oldImg.remove();

        const img = document.createElement('img');
        const lowerId = materialValue.toLowerCase();

        // 画像取得の優先順位設定
        const providers = [
            `https://minecraft-api.vercel.app/images/items/${lowerId}.png`,
            `https://raw.githubusercontent.com/PrismarineJS/minecraft-assets/master/data/1.21/items/${lowerId}.png`,
            `https://mc-heads.net/item/${lowerId}`
        ];

        let currentProvider = 0;
        img.src = providers[currentProvider];

        // 読み込み失敗時に次のプロバイダーを試す
        img.onerror = () => {
            currentProvider++;
            if (currentProvider < providers.length) {
                img.src = providers[currentProvider];
            }
        };

        img.alt = materialValue;
        selectedSlot.appendChild(img);
        console.log(`スロット ${selectedSlot.dataset.index} に ${materialValue} を配置`);
    } else {
        alert("無効なアイテムIDです");
    }
});

window.addEventListener('DOMContentLoaded', () => {
    initInventory();
    loadMinecraftItems();
});
