// 1. グローバル変数でアイテムリストを保持
let minecraftItems = [];

/**
 * APIからMinecraftのアイテム一覧を取得し、入力候補(datalist)を作成する
 */
async function initItemAutocomplete() {
    const materialInput = document.getElementById('material-id');
    if (!materialInput) return;

    try {
        // PrismarineJSのデータ（1.21）を取得
        const response = await fetch('https://raw.githubusercontent.com/PrismarineJS/minecraft-data/master/data/pc/1.21/items.json');
        const data = await response.json();
        
        // 全アイテム名(name)を大文字にして配列に格納
        minecraftItems = data.map(item => item.name.toUpperCase());

        // HTMLにdatalist要素（候補を表示する箱）を作成
        let dataList = document.getElementById('item-suggestions');
        if (!dataList) {
            dataList = document.createElement('datalist');
            dataList.id = 'item-suggestions';
            document.body.appendChild(dataList);
        }
        
        // 入力欄とdatalistを紐付ける
        materialInput.setAttribute('list', 'item-suggestions');

        // datalistの中に全アイテムをoptionタグとして流し込む
        dataList.innerHTML = minecraftItems.map(id => `<option value="${id}">`).join('');
        
        console.log("全 " + minecraftItems.length + " 種類のアイテムIDを読み込みました。");
    } catch (error) {
        console.error("アイテムデータの読み込みに失敗しました:", error);
    }
}

/**
 * インベントリ（54スロット）を生成する処理
 */
function createInventory() {
    const inventory = document.getElementById('inventory');
    if (!inventory) return;

    for (let i = 0; i < 54; i++) {
        const slot = document.createElement('div');
        slot.classList.add('slot');
        slot.dataset.index = i;
        // スロットクリック時の処理（必要に応じて実装）
        slot.addEventListener('click', () => {
            console.log("スロット " + i + " が選択されました");
            // 選択中のスロットを強調する処理などをここに追加
        });
        inventory.appendChild(slot);
    }
}

// ページが読み込まれたら実行
window.addEventListener('DOMContentLoaded', () => {
    createInventory();     // インベントリ枠の生成
    initItemAutocomplete(); // アイテムID補完の有効化
});

// 保存ボタン（id="save-btn"）が押された時の処理
document.getElementById('save-btn')?.addEventListener('click', () => {
    const materialValue = document.getElementById('material-id').value.toUpperCase();
    
    if (minecraftItems.length > 0 && !minecraftItems.includes(materialValue)) {
        alert("【警告】\n'" + materialValue + "' は正しいアイテムIDではない可能性があります。\nスペルを確認してください。");
    } else {
        alert("設定を保存しました！\nID: " + materialValue);
    }
});
