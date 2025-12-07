// --- 倍率設定 ---
const BUTTON_VALUES = {
    ab1: 1.3, ab2: 3.0,
    emb1: 1.25, emb2: 1.10, emb3: 1.10, emb4: 1.08
};

let activeStates = {
    ab1: false, ab2: false,
    emb1: false, emb2: false, emb3: false, emb4: false
};

function toggleButton(id) {
    if (activeStates[id] === undefined) activeStates[id] = false;
    activeStates[id] = !activeStates[id];
    const btn = document.getElementById(id);
    if (activeStates[id]) {
        btn.classList.add('active');
    } else {
        btn.classList.remove('active');
    }
    calculate();
}

// 通常の入力欄切り替え
function toggleInput(inputId, checkboxId) {
    const input = document.getElementById(inputId);
    const checkbox = document.getElementById(checkboxId);
    input.disabled = !checkbox.checked;
    calculate();
}

// 等級と数値の2つを切り替える関数
function toggleComplexInputs() {
    const isChecked = document.getElementById('chk_complex').checked;
    document.getElementById('complexGrade').disabled = !isChecked;
    document.getElementById('complexVal').disabled = !isChecked;
    calculate();
}

// 計算メイン処理
function calculate() {
    // 1. 攻撃力
    const attack = parseFloat(document.getElementById('attack').value) || 0;

    // 2. ゲージ
    let gaugeMultiplier = 1.0;
    if (document.getElementById('chk_gauge').checked) {
        gaugeMultiplier = 1.2;
    }

    // 3. ボタン倍率
    let buttonMultiplier = 1.0;
    for (const [id, isActive] of Object.entries(activeStates)) {
        if (isActive) buttonMultiplier *= BUTTON_VALUES[id];
    }

    // 4. マインスイーパー
    let msMultiplier = 1.0;
    if (document.getElementById('chk_ms').checked) {
        msMultiplier = parseFloat(document.getElementById('msSelect').value);
    }
    
    // 5. 底力
    let sokoMultiplier = 1.0;
    if (document.getElementById('chk_soko').checked) {
        sokoMultiplier = parseFloat(document.getElementById('sokoSelect').value);
    }

    // 6. キラー倍率
    let customMultiplier = 1.0;
    if (document.getElementById('chk_custom').checked) {
        const val = parseFloat(document.getElementById('customRate').value);
        if (!isNaN(val)) customMultiplier = val;
    }

    // 7. ワープ数
    let enemyMultiplier = 1.0;
    if (document.getElementById('chk_warp').checked) {
        const count = parseFloat(document.getElementById('warpCount').value) || 0;
        enemyMultiplier = 1 + (count * 0.05);
    }

    // 8. ブースト(等級計算)
    let complexMultiplier = 1.0;
    if (document.getElementById('chk_complex').checked) {
        const grade = parseFloat(document.getElementById('complexGrade').value);
        const val = parseFloat(document.getElementById('complexVal').value);
        if (!isNaN(val)) {
            complexMultiplier = (val / 4) * grade;
        }
    }

    // 最終計算
    const finalDamage = attack 
        * gaugeMultiplier   // ゲージ
        * buttonMultiplier  // ボタン補正
        * msMultiplier      // マインスイーパー
        * sokoMultiplier    // 底力
        * customMultiplier  // キラー
        * enemyMultiplier   // ワープ数
        * complexMultiplier // ブースト
        ;

    // 結果表示
    document.getElementById('result').innerText = Math.floor(finalDamage).toLocaleString();
}

// 初期化
calculate();
