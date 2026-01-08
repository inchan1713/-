// 1. グローバル変数
let minecraftItems = [];

/**
 * アイテムデータを取得する（URLを修正しました）
 */
async function initItemAutocomplete() {
    const materialInput = document.getElementById('material-id');
    if (!materialInput) return;

    // 複数のソースを試すようにして安定性を高めます
    const urls = [
        'https://raw.githubusercontent.com/PrismarineJS/minecraft-data/master/data/pc/1.21/items.json',
        'https://unpkg.com/minecraft-data@latest/data/pc/1.21/items.json'
    ];

    for (const url of urls) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            minecraftItems = data.map(item => item.name.toUpperCase());

            // datalistの作成
            let dataList = document.getElementById('item-suggestions');
            if (!dataList) {
                dataList = document.createElement('datalist');
                dataList.id = 'item-suggestions';
                document.body.appendChild(dataList);
            }
            materialInput.setAttribute('list', 'item-suggestions');
            dataList.innerHTML = minecraftItems.map(id => `<option value="${id}">`).join('');
            
            console.log("成功: " + minecraftItems.length + " 種類のアイテムを読み込みました。");
            return; // 成功したらループを抜ける
        } catch (error) {
            console.warn("URL " + url + " からの取得に失敗しました。次の候補を試します。");
        }
    }
    console.error("すべてのソースからアイテムデータを取得できませんでした。");
}

/**
 * 54スロットを生成
 */
function createInventory() {
    const inventory = document.getElementById('inventory');
    if (!inventory) return;
    inventory.innerHTML = ''; // 重複防止

    for (let i = 0; i < 54; i++) {
        const slot = document.createElement('div');
        slot.classList.add('slot');
        slot.dataset.index = i;
        slot.innerText = i; // 番号を表示（任意）
        inventory.appendChild(slot);
    }
}

// 起動時に実行
window.addEventListener('DOMContentLoaded', () => {
    createInventory();
    initItemAutocomplete();
});

// 保存ボタン
document.getElementById('save-btn')?.addEventListener('click', () => {
    const val = document.getElementById('material-id').value.toUpperCase();
    if (minecraftItems.length > 0 && !minecraftItems.includes(val)) {
        alert("アイテムID '" + val + "' が見つかりません。正確に入力してください。");
    } else {
        alert("保存完了: " + val);
    }
});
