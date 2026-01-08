let minecraftItems = [];

// Wiki形式のデータを含む最新リストを取得
async function loadMinecraftItems() {
    const url = 'https://raw.githubusercontent.com/PrismarineJS/minecraft-data/master/data/pc/1.21.4/items.json';
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // 予測変換用のリストを作成 (例: DIAMOND_SWORD)
        minecraftItems = data.map(item => item.name.toUpperCase());

        // 予測変換(datalist)を復活させる
        const materialInput = document.getElementById('material-id');
        let dataList = document.getElementById('item-suggestions');
        
        if (materialInput && dataList) {
            dataList.innerHTML = minecraftItems.map(id => `<option value="${id}">`).join('');
            materialInput.setAttribute('list', 'item-suggestions'); // 紐付け
            console.log("✅ 予測変換を有効化しました");
        }
    } catch (e) { console.error("データ読み込み失敗", e); }
}

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

// Wikiの画像名ルールに変換する関数
function getWikiFileName(id) {
    // 例: DIAMOND_SWORD -> Diamond_Sword
    return id.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('_');
}

document.getElementById('save-btn')?.addEventListener('click', () => {
    const materialValue = document.getElementById('material-id').value.toUpperCase().trim();
    const selectedSlot = document.querySelector('.slot.selected');

    if (!selectedSlot || !materialValue) return;

    // 既存の画像を削除
    selectedSlot.querySelectorAll('img, .no-img').forEach(el => el.remove());

    const lowerId = materialValue.toLowerCase();
    const wikiName = getWikiFileName(materialValue);
    
    // 画像取得の優先順位を「Wiki」と「MC-Heads」に絞る
    const urls = [
        `https://mc-heads.net/item/${lowerId}`, // コンパス、時計、ポーションに非常に強い
        `https://minecraft.wiki/images/Invicon_${wikiName}.png`, // Wikiのアイコン形式
        `https://minecraft-api.vercel.app/images/items/${lowerId}.png` // 予備
    ];

    const img = document.createElement('img');
    let attempt = 0;

    const tryLoad = () => {
        img.src = urls[attempt];
    };

    img.onerror = () => {
        attempt++;
        if (attempt < urls.length) {
            tryLoad();
        } else {
            const err = document.createElement('div');
            err.className = 'no-img';
            err.innerText = '無';
            err.style.fontSize = '12px';
            selectedSlot.appendChild(err);
        }
    };

    selectedSlot.appendChild(img);
    tryLoad();
});

window.onload = () => {
    loadMinecraftItems();
    initInventory();
};
