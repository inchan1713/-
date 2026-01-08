const inventory = document.getElementById('inventory');
const nameInput = document.getElementById('name');
const matInput = document.getElementById('mat');
const loreInput = document.getElementById('lore');

// 54個のスロットを自動生成
for (let i = 0; i < 54; i++) {
    const slot = document.createElement('div');
    slot.classList.add('slot');
    slot.dataset.slot = i; // スロット番号を記録
    
    // クリックした時の動き
    slot.addEventListener('click', () => {
        // すでに選ばれているスロットの選択を解除
        document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
        // クリックしたスロットを選択状態にする
        slot.classList.add('selected');
        
        // 右側の入力欄に今の情報を入れる（あとで拡張）
        console.log(`スロット ${i} が選択されました`);
    });

    inventory.appendChild(slot);
}
