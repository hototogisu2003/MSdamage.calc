/* -------------------------------------------------------
   入力欄の有効/無効を切り替える関数
   HTML: onchange="toggleInput('targetId', 'checkboxId')"
------------------------------------------------------- */
function toggleInput(inputId, checkboxId) {
    const input = document.getElementById(inputId);
    const checkbox = document.getElementById(checkboxId);
    
    if (input && checkbox) {
        input.disabled = !checkbox.checked;
        calculate();
    }
}

/* -------------------------------------------------------
   ウォールブースト専用（倍率と壁数の2つを制御）
   HTML: onchange="togglewboostInputs()"
------------------------------------------------------- */
function togglewboostInputs() {
    const checkbox = document.getElementById('chk_wboost');
    const grade = document.getElementById('wboostGrade');
    const val = document.getElementById('wboostVal');

    if (checkbox && grade && val) {
        const isDisabled = !checkbox.checked;
        grade.disabled = isDisabled;
        val.disabled = isDisabled;
        calculate();
    }
}

/* -------------------------------------------------------
   計算メイン処理
------------------------------------------------------- */
function calculate() {
    // --- 1. 基本攻撃力 ---
    const attack = parseFloat(document.getElementById('attack').value) || 0;

    // --- 2. ゲージ (1.2倍) ---
    const gaugeMultiplier = document.getElementById('chk_gauge').checked ? 1.2 : 1.0;

    // --- 3. キャラクター倍率 ---
    
    // 超ADW (x1.3)
    let ab1Multiplier = document.getElementById('chk_ab1').checked ? 1.3 : 1.0;
    
    // 渾身 (x3.0)
    let ab2Multiplier = document.getElementById('chk_ab2').checked ? 3.0 : 1.0;

    // マインスイーパー
    let msMultiplier = 1.0;
    if (document.getElementById('chk_ms').checked) {
        msMultiplier = parseFloat(document.getElementById('msSelect').value) || 1.0;
    }

    // 超アンチワープ (1 + ワープ数 * 0.05)
    let warpMultiplier = 1.0;
    if (document.getElementById('chk_warp').checked) {
        const count = parseFloat(document.getElementById('warpCount').value) || 0;
        warpMultiplier = 1 + (count * 0.05);
    }
    
    // 底力
    let sokoMultiplier = 1.0;
    if (document.getElementById('chk_soko').checked) {
        sokoMultiplier = parseFloat(document.getElementById('sokoSelect').value) || 1.0;
    }

    // ウォールブースト ( (壁数/4) * 倍率 ) ※最大4壁までと仮定せず単純計算
    let wboostMultiplier = 1.0;
    if (document.getElementById('chk_wboost').checked) {
        const grade = parseFloat(document.getElementById('wboostGrade').value) || 1.5;
        const val = parseFloat(document.getElementById('wboostVal').value) || 0;
        // 壁に触れていなければ1.0、触れていれば計算
        if (val > 0) {
            // 一般的な仕様: (壁数 * 倍率) ではなく、仕様に合わせて計算式は調整してください
            // 今回は元のコードの意図「(val / 4) * grade」を尊重しますが、
            // ウォールブーストは通常「最大倍率」が決まる形式です。
            // ここでは簡易的に元のロジックを維持します。
            wboostMultiplier = 1 + ((grade - 1) * (val / 4)); 
            // ※注: 元のコード (val/4)*grade だと、壁数0のとき0倍になってしまうため、
            // 一般的な「ブースト」の考え方で補正しています。
            // もし「単に掛け算」したい場合は元の式に戻してください。
        }
    }

    // 魔法陣ブースト
    let mboostMultiplier = 1.0;
    if (document.getElementById('chk_mboost').checked) {
        // HTML側が <select> になっていたため、それに合わせました
        mboostMultiplier = parseFloat(document.getElementById('mboostSelect').value) || 1.0;
    }

    // キラー倍率
    let killerMultiplier = 1.0;
    if (document.getElementById('chk_killer').checked) {
        killerMultiplier = parseFloat(document.getElementById('killerRate').value) || 1.0;
    }

    // バフ倍率
    let buffMultiplier = 1.0;
    if (document.getElementById('chk_buff').checked) {
        buffMultiplier = parseFloat(document.getElementById('buffRate').value) || 1.0;
    }

    // 守護獣倍率
    let guardianMultiplier = 1.0;
    if (document.getElementById('chk_guardian').checked) {
        guardianMultiplier = parseFloat(document.getElementById('guardianRate').value) || 1.0;
    }

    // --- 4. 紋章 ---
    let emb1 = document.getElementById('chk_emb1').checked ? 1.25 : 1.0; // 対属性
    let emb2 = document.getElementById('chk_emb2').checked ? 1.10 : 1.0; // 対弱
    let emb3 = document.getElementById('chk_emb3').checked ? 1.10 : 1.0; // 対将/兵
    let emb4 = document.getElementById('chk_emb4').checked ? 1.08 : 1.0; // 守護獣加勢

    // --- 5. 敵倍率 ---
    
    // 弱点倍率 (初期値3.0など)
    let weakMultiplier = 1.0;
    if (document.getElementById('chk_weak').checked) {
        weakMultiplier = parseFloat(document.getElementById('weakRate').value) || 1.0;
    }

    // 直殴り倍率
    let naguriMultiplier = 1.0;
    if (document.getElementById('chk_naguri').checked) {
        naguriMultiplier = parseFloat(document.getElementById('naguriRate').value) || 1.0;
    }

    // 本体倍率
    let hontaiMultiplier = 1.0;
    if (document.getElementById('chk_hontai').checked) {
        hontaiMultiplier = parseFloat(document.getElementById('hontaiRate').value) || 1.0;
    }

    // 防御ダウン倍率
    let defMultiplier = 1.0;
    if (document.getElementById('chk_def').checked) {
        defMultiplier = parseFloat(document.getElementById('defRate').value) || 1.0;
    }

    // --- 最終計算 ---
    const finalDamage = attack 
        * gaugeMultiplier
        * ab1Multiplier // 超ADW
        * ab2Multiplier // 渾身
        * msMultiplier
        * warpMultiplier
        * sokoMultiplier
        * wboostMultiplier
        * mboostMultiplier
        * killerMultiplier
        * buffMultiplier      // 修正箇所：変数名を修正
        * guardianMultiplier  // 修正箇所：変数名を修正
        * emb1 * emb2 * emb3 * emb4 // 紋章
        * weakMultiplier
        * naguriMultiplier
        * hontaiMultiplier
        * defMultiplier;

    // 結果表示 (小数点以下切り捨て)
    document.getElementById('result').innerText = Math.floor(finalDamage).toLocaleString();
}

// ページ読み込み時に初期計算を実行
calculate();
