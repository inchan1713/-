const inventory = document.getElementById('inventory');
const matInput = document.getElementById('mat');

// 1. スロットを54個作成
for (let i = 0; i < 54; i++) {
    const slot = document.createElement('div');
    slot.classList.add('slot');
    slot.dataset.slot = i;
    
    // スロットの中に画像を入れる「入れ物」をあらかじめ作る
    const img = document.createElement('img');
    img.classList.add('item-icon');
    img.style.display = 'none'; // 最初は隠しておく
    slot.appendChild(img);

    slot.addEventListener('click', () => {
        document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        
        // すでにアイテムがあれば、そのIDを入力欄に表示
        if (img.dataset.id) {
            matInput.value = img.dataset.id;
        }
    });
    inventory.appendChild(slot);
}

// 2. マテリアルID入力時の画像表示
matInput.addEventListener('input', (e) => {
    const val = e.target.value.toUpperCase().trim();
    const selected = document.querySelector('.slot.selected');

    if (!selected) return;
    const img = selected.querySelector('img');

    if (val !== "") {
        // 画像を表示（APIを使用）
        img.src = `https://minecraft-api.com/api/items/${val.toLowerCase()}/64.png`;
        img.style.display = 'block';
        img.dataset.id = val;
        
        // 存在しないIDの場合は画像を非表示にする
        img.onerror = () => { img.style.display = 'none'; };
    } else {
        img.style.display = 'none';
        img.dataset.id = "";
    }
});
