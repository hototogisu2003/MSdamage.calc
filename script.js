/* -------------------------------------------------------
   入力欄の有効/無効を切り替える関数
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
   ウォールブースト専用
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
    const attackElem = document.getElementById('attack');
    const attack = attackElem ? (parseFloat(attackElem.value) || 0) : 0;

    // --- 2. ゲージ (1.2倍) ---
    const gaugeElem = document.getElementById('chk_gauge');
    const gaugeMultiplier = (gaugeElem && gaugeElem.checked) ? 1.2 : 1.0;

    // --- 3. キャラクター倍率 ---
    
    // 超ADW (x1.3)
    const ab1Elem = document.getElementById('chk_ab1');
    let ab1Multiplier = (ab1Elem && ab1Elem.checked) ? 1.3 : 1.0;
    
    // 渾身 (x3.0)
    const ab2Elem = document.getElementById('chk_ab2');
    let ab2Multiplier = (ab2Elem && ab2Elem.checked) ? 3.0 : 1.0;

    // マインスイーパー
    let msMultiplier = 1.0;
    const msCheck = document.getElementById('chk_ms');
    const msSelect = document.getElementById('msSelect');
    if (msCheck && msCheck.checked && msSelect) {
        msMultiplier = parseFloat(msSelect.value) || 1.0;
    }

    // 超アンチワープ
    let warpMultiplier = 1.0;
    const warpCheck = document.getElementById('chk_warp');
    const warpInput = document.getElementById('warpCount');
    if (warpCheck && warpCheck.checked && warpInput) {
        const count = parseFloat(warpInput.value) || 0;
        warpMultiplier = 1 + (count * 0.05);
    }
    
    // 底力
    let sokoMultiplier = 1.0;
    const sokoCheck = document.getElementById('chk_soko');
    const sokoSelect = document.getElementById('sokoSelect');
    if (sokoCheck && sokoCheck.checked && sokoSelect) {
        sokoMultiplier = parseFloat(sokoSelect.value) || 1.0;
    }

    // ウォールブースト
    let wboostMultiplier = 1.0;
    const wbCheck = document.getElementById('chk_wboost');
    const wbGrade = document.getElementById('wboostGrade');
    const wbVal = document.getElementById('wboostVal');
    if (wbCheck && wbCheck.checked && wbGrade && wbVal) {
        const grade = parseFloat(wbGrade.value) || 1.5;
        const val = parseFloat(wbVal.value) || 0;
        if (val > 0) {
            wboostMultiplier = 1 + ((grade - 1) * (val / 4)); 
        }
    }

    // 魔法陣ブースト
    let mboostMultiplier = 1.0;
    const mbCheck = document.getElementById('chk_mboost');
    const mbSelect = document.getElementById('mboostSelect');
    if (mbCheck && mbCheck.checked && mbSelect) {
        mboostMultiplier = parseFloat(mbSelect.value) || 1.0;
    }

    // キラー倍率
    let killerMultiplier = 1.0;
    const killerCheck = document.getElementById('chk_killer');
    const killerInput = document.getElementById('killerRate');
    if (killerCheck && killerCheck.checked && killerInput) {
        killerMultiplier = parseFloat(killerInput.value) || 1.0;
    }

    // バフ倍率
    let buffMultiplier = 1.0;
    const buffCheck = document.getElementById('chk_buff');
    const buffInput = document.getElementById('buffRate');
    if (buffCheck && buffCheck.checked && buffInput) {
        buffMultiplier = parseFloat(buffInput.value) || 1.0;
    }

    // 守護獣倍率
    let guardianMultiplier = 1.0;
    const guardCheck = document.getElementById('chk_guardian');
    const guardInput = document.getElementById('guardianRate');
    if (guardCheck && guardCheck.checked && guardInput) {
        guardianMultiplier = parseFloat(guardInput.value) || 1.0;
    }

    // SS倍率
    let SSMultiplier = 1.0;
    const ssCheck = document.getElementById('chk_SS');
    const ssInput = document.getElementById('SSRate');
    if (ssCheck && ssCheck.checked && ssInput) {
        SSMultiplier = parseFloat(ssInput.value) || 1.0;
    }

    // --- 4. 紋章 ---
    const e1 = document.getElementById('chk_emb1');
    const e2 = document.getElementById('chk_emb2');
    const e3 = document.getElementById('chk_emb3');
    const e4 = document.getElementById('chk_emb4');
    let emb1 = (e1 && e1.checked) ? 1.25 : 1.0;
    let emb2 = (e2 && e2.checked) ? 1.10 : 1.0;
    let emb3 = (e3 && e3.checked) ? 1.10 : 1.0;
    let emb4 = (e4 && e4.checked) ? 1.08 : 1.0;

    // --- 5. 敵倍率 ---
    
    // 弱点倍率
    let weakMultiplier = 1.0;
    const weakCheck = document.getElementById('chk_weak');
    const weakInput = document.getElementById('weakRate');
    if (weakCheck && weakCheck.checked && weakInput) {
        weakMultiplier = parseFloat(weakInput.value) || 1.0;
    }

    // 直殴り倍率
    let naguriMultiplier = 1.0;
    const naguriCheck = document.getElementById('chk_naguri');
    const naguriInput = document.getElementById('naguriRate');
    if (naguriCheck && naguriCheck.checked && naguriInput) {
        naguriMultiplier = parseFloat(naguriInput.value) || 1.0;
    }

    // 本体倍率
    let hontaiMultiplier = 1.0;
    const hontaiCheck = document.getElementById('chk_hontai');
    const hontaiInput = document.getElementById('hontaiRate');
    if (hontaiCheck && hontaiCheck.checked && hontaiInput) {
        hontaiMultiplier = parseFloat(hontaiInput.value) || 1.0;
    }

    // 防御ダウン倍率
    let defMultiplier = 1.0;
    const defCheck = document.getElementById('chk_def');
    const defInput = document.getElementById('defRate');
    if (defCheck && defCheck.checked && defInput) {
        defMultiplier = parseFloat(defInput.value) || 1.0;
    }

    // ギミック倍率 (ここもエラー原因の可能性大：存在確認を追加)
    let gimmickMultiplier = 1.0;
    const gimCheck = document.getElementById('chk_gimmick');
    const gimInput = document.getElementById('gimmickRate');
    if (gimCheck && gimCheck.checked && gimInput) {
        gimmickMultiplier = parseFloat(gimInput.value) || 1.0;
    }

    // --- 【新規追加】ステージ倍率 ---
    const stageSelect = document.getElementById('stageEffectSelect');
    const stageCheck = document.getElementById('chk_stageSpecial');
    
    let stageMultiplier = 1.0;
    
    // ステージ倍率要素が存在する場合のみ計算
    if (stageSelect && stageCheck) {
        const stageBase = parseFloat(stageSelect.value) || 1.0;
        const isStageSpecial = stageCheck.checked;
        stageMultiplier = stageBase;

        // 超バランス型計算
        if (isStageSpecial && stageBase !== 1.0) {
            stageMultiplier = ((stageBase - 1) / 0.33) * 0.596 + 1;
        }

        // 画面上の実質倍率表示を更新
        const displayElem = document.getElementById('stageRealRate');
        if (displayElem) {
            displayElem.innerText = Math.floor(stageMultiplier * 100000) / 100000;
        }
    }

    // --- 最終計算 ---
    const finalDamage = attack 
        * gaugeMultiplier
        * ab1Multiplier 
        * ab2Multiplier
        * msMultiplier
        * warpMultiplier
        * sokoMultiplier
        * wboostMultiplier
        * mboostMultiplier
        * killerMultiplier
        * buffMultiplier      
        * guardianMultiplier
        * SSMultiplier      
        * emb1 * emb2 * emb3 * emb4 
        * weakMultiplier
        * naguriMultiplier
        * hontaiMultiplier
        * defMultiplier
        * gimmickMultiplier
        * stageMultiplier;
    
    // 結果表示
    const resultElem = document.getElementById('result');
    if (resultElem) {
        resultElem.innerText = Math.floor(finalDamage).toLocaleString();
    }
}

// ページ読み込み時に初期計算を実行
calculate();
