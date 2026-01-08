let minecraftItems = [];

async function loadMinecraftItems() {
    const materialInput = document.getElementById('material-id');
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
    } catch (e) { console.error("データ取得失敗"); }
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

    if (minecraftItems.includes(materialValue)) {
        selectedSlot.querySelectorAll('img').forEach(i => i.remove());
        const img = document.createElement('img');
        const lowerId = materialValue.toLowerCase();

        // 解決策：画像URLの優先順位を「一番綺麗に出る場所」に変更
        const urls = [
            `https://minecraft.wiki/images/${materialValue}_JE3_BE3.png`, // Wikiの直リンク（高画質・コンパス等に強い）
            `https://mc-heads.net/item/${lowerId}`, // 予備
            `https://minecraft-api.vercel.app/images/items/${lowerId}.png` // 最終予備
        ];

        let idx = 0;
        img.src = urls[idx];
        img.onerror = () => {
            idx++;
            if (idx < urls.length) img.src = urls[idx];
        };

        selectedSlot.appendChild(img);
    } else { alert("アイテムIDが違います"); }
});

window.addEventListener('DOMContentLoaded', () => {
    initInventory();
    loadMinecraftItems();
});
