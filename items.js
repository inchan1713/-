// items.js
// 外部から最新のアイテムリストを取得する専用ファイル
let MC_ITEMS = [];

async function fetchMinecraftItems() {
    try {
        // PrismarineJSが公開している1.21のデータを取得
        const response = await fetch('https://raw.githubusercontent.com/PrismarineJS/minecraft-data/master/data/pc/1.21/items.json');
        const data = await response.json();
        
        // IDを大文字に変換して配列に格納
        MC_ITEMS = data.map(item => item.name.toUpperCase());
        console.log("アイテムリスト完了:", MC_ITEMS.length, "種類読み込みました");
    } catch (error) {
        console.error("データの取得に失敗しました。");
        MC_ITEMS = ["STONE", "DIAMOND_SWORD", "APPLE"]; // 最低限の予備
    }

let MC_ITEMS = [];

async function fetchMinecraftItems() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/PrismarineJS/minecraft-data/master/data/pc/1.21/items.json');
        const data = await response.json();
        // IDを大文字に変換して配列に格納
        MC_ITEMS = data.map(item => item.name.toUpperCase());
        console.log("アイテムリスト完了:", MC_ITEMS.length, "種類読み込みました");
    } catch (error) {
        console.error("データの取得に失敗しました。");
        MC_ITEMS = ["STONE", "DIAMOND_SWORD", "APPLE"]; 
    }
}

// ★これがないと動かない：関数を実行する
fetchMinecraftItems();
