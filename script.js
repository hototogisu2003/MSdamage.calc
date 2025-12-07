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
function togglewboostInputs() {
    const isChecked = document.getElementById('chk_wboost').checked;
    document.getElementById('wboostGrade').disabled = !isChecked;
    document.getElementById('wboostVal').disabled = !isChecked;
    calculate();
}

// 計算メイン処理
function calculate() {
    // 攻撃力
    const attack = parseFloat(document.getElementById('attack').value) || 0;

    // ゲージ
    let gaugeMultiplier = 1.0;
    if (document.getElementById('chk_gauge').checked) {
        gaugeMultiplier = 1.2;
    }

    // ボタン倍率
    let buttonMultiplier = 1.0;
    for (const [id, isActive] of Object.entries(activeStates)) {
        if (isActive) buttonMultiplier *= BUTTON_VALUES[id];
    }

    // マインスイーパー
    let msMultiplier = 1.0;
    if (document.getElementById('chk_ms').checked) {
        msMultiplier = parseFloat(document.getElementById('msSelect').value);
    }
    
    // 底力
    let sokoMultiplier = 1.0;
    if (document.getElementById('chk_soko').checked) {
        sokoMultiplier = parseFloat(document.getElementById('sokoSelect').value);
    }

    // ワープ数
    let enemyMultiplier = 1.0;
    if (document.getElementById('chk_warp').checked) {
        const count = parseFloat(document.getElementById('warpCount').value) || 0;
        enemyMultiplier = 1 + (count * 0.05);
    }

    // ウォールブースト
    let wboostMultiplier = 1.0;
    if (document.getElementById('chk_wboost').checked) {
        const grade = parseFloat(document.getElementById('wboostGrade').value);
        const val = parseFloat(document.getElementById('wboostVal').value);
        if (!isNaN(val)) {
            wboostMultiplier = (val / 4) * grade;
        }
    }

    //  魔法陣ブースト
    let mboostMultiplier = 1.0;
    if (document.getElementById('chk_mboost').checked) {
        const grade = parseFloat(document.getElementById('mboostGrade').value);
        const val = parseFloat(document.getElementById('mboostVal').value);
        if (!isNaN(val)) {
            mboostMultiplier = (val / 4) * grade;
        }
    }

    // キラー倍率
    let killerMultiplier = 1.0;
    if (document.getElementById('chk_killer').checked) {
        const val = parseFloat(document.getElementById('killerRate').value);
        if (!isNaN(val)) killerMultiplier = val;
    }

    // バフ倍率
    let killerMultiplier = 1.0;
    if (document.getElementById('chk_buff').checked) {
        const val = parseFloat(document.getElementById('buffRate').value);
        if (!isNaN(val)) buffMultiplier = val;
    }

    // 守護獣倍率
    let killerMultiplier = 1.0;
    if (document.getElementById('chk_guardian').checked) {
        const val = parseFloat(document.getElementById('guardianRate').value);
        if (!isNaN(val)) guardianMultiplier = val;
    }

    // 弱点倍率
    let weakMultiplier = 1.0;
    if (document.getElementById('chk_weak').checked) {
        const val = parseFloat(document.getElementById('weakRate').value);
        if (!isNaN(val)) weakMultiplier = val;
    }

    // 直殴り倍率
    let naguriMultiplier = 1.0;
    if (document.getElementById('chk_naguri').checked) {
        const val = parseFloat(document.getElementById('naguriRate').value);
        if (!isNaN(val)) naguriMultiplier = val;
    }

    // 本体倍率
    let hontaiMultiplier = 1.0;
    if (document.getElementById('chk_hontai').checked) {
        const val = parseFloat(document.getElementById('hontaiRate').value);
        if (!isNaN(val)) hontaiMultiplier = val;
    }

    // 防御ダウン倍率
    let defMultiplier = 1.0;
    if (document.getElementById('chk_def').checked) {
        const val = parseFloat(document.getElementById('defRate').value);
        if (!isNaN(val)) defMultiplier = val;
    }

    // 最終計算
    const finalDamage = attack 
        * gaugeMultiplier   // ゲージ
        * buttonMultiplier  // ボタン補正
        * msMultiplier      // マインスイーパー
        * sokoMultiplier    // 底力
        * enemyMultiplier   // 超AW
        * wboostMultiplier // ウォールブースト
        * mboostMultiplier // 魔法陣ブースト
        * killerMultiplier  // キラー
        * buffMultiplier  // バフ
        * guardianMultiplier  // 守護獣
        * weakMultiplier // 弱点
        * naguriMultiplier // 直殴り
        * hontaiMultiplier // 本体倍率
        * defMultiplier // 防御ダウン倍率
        ;

    // 結果表示
    document.getElementById('result').innerText = Math.floor(finalDamage).toLocaleString();
}

// 初期化
calculate();
