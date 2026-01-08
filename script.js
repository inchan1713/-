const inventory = document.getElementById('inventory');
const matInput = document.getElementById('mat');
const nameInput = document.getElementById('name');
const loreInput = document.getElementById('lore');
const saveBtn = document.getElementById('save-btn');

// 1. 54個のスロットを生成
for (let i = 0; i < 54; i++) {
    const slot = document.createElement('div');
    slot.classList.add('slot');
    slot.dataset.slot = i;
    
    const img = document.createElement('img');
    img.classList.add('item-icon');
    img.style.display = 'none';
    slot.appendChild(img);

    slot.addEventListener('click', () => {
        document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        
        // スロットがデータを持っていれば入力欄に反映
        matInput.value = img.dataset.id || "";
    });
    inventory.appendChild(slot);
}

// 2. 「スロットに保存」ボタンを押した時にアイコンを確定させる
saveBtn.addEventListener('click', () => {
    const selected = document.querySelector('.slot.selected');
    if (!selected) {
        alert("スロットを選択してください！");
        return;
    }

    const val = matInput.value.toUpperCase().trim();
    const img = selected.querySelector('img');

    if (val !== "") {
        // 画像を更新して表示
        img.src = `https://minecraft-api.com/api/items/${val.toLowerCase()}/64.png`;
        img.style.display = 'block';
        img.dataset.id = val; // スロット自体にIDを保存
        
        img.onerror = () => { 
            img.style.display = 'none'; 
            alert("アイテムIDが正しくない可能性があります。");
        };
    } else {
        img.style.display = 'none';
        img.dataset.id = "";
    }
});
