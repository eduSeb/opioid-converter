const referenceData = [
    { nom: "Morphine (Morphine HCL®, Stellorphine®)", forme: "Amp (Inj. SC/IV)", dosage: "10 mg / 1 mL", delai: "5-10 min (IV), 10-30 min (SC)", duree: "4-6 h", remarques: "Sans conservateur" },
    { nom: "Morphine (MS Direct®)", forme: "CO (Effet direct)", dosage: "10 mg", delai: "30 min", duree: "4 h", remarques: "Effet direct" },
    { nom: "Morphine (MS Contin®)", forme: "CO (Lib. lente)", dosage: "10, 30, 60, 100 mg", delai: "2 h", duree: "12 h", remarques: "Libération lente" },
    { nom: "Morphine (Kapanol®)", forme: "Capsules (Lib. lente)", dosage: "20, 50, 100 mg", delai: "2 h", duree: "12 h", remarques: "Sonde gastrique possible" },
    { nom: "Morphine (Oramorph®)", forme: "Gttes / Sol orale", dosage: "16 gttes=20mg / 10-30mg/5mL", delai: "30-60 min", duree: "4-6 h", remarques: "Sirop de morphine" },
    { nom: "Dihydrocodéine (Codicontin®)", forme: "CO (Lib. lente)", dosage: "60 mg", delai: "2 h", duree: "12 h", remarques: "Libération lente 12h" },
    { nom: "Oxycodone (Oxycontin®)", forme: "CO (Lib. lente)", dosage: "5, 10, 20, 40, 80 mg", delai: "30 min", duree: "12 h", remarques: "Libération lente 12h" },
    { nom: "Oxycodone (OxyNorm instant®)", forme: "CO (Effet direct)", dosage: "5, 10, 20 mg", delai: "30 min", duree: "4 h", remarques: "Effet direct" },
    { nom: "Oxycodone (Targinact®)", forme: "CO (Lib. lente)", dosage: "10, 20 mg (+Naloxone)", delai: "1-2 h", duree: "12 h", remarques: "Avec naloxone" },
    { nom: "Hydromorphone (Palladone®)", forme: "CO (Effet direct)", dosage: "1.3, 2.6 mg", delai: "30 min", duree: "4 h", remarques: "Effet direct" },
    { nom: "Hydromorphone (Palladone®)", forme: "CO (Lib. lente)", dosage: "4, 8, 16, 24 mg", delai: "2-3 h", duree: "12 h", remarques: "Libération lente 12h" },
    { nom: "Méthadone (Méphénon®)", forme: "CO / Amp", dosage: "5 mg / 10mg/mL", delai: "20-30 min", duree: "24 h", remarques: "Titration complexe" },
    { nom: "Fentanyl (Durogesic®)", forme: "Patch TTS", dosage: "12.5, 25, 50, 75, 100 µg/h", delai: "8-16 h", duree: "72 h", remarques: "Changement /72h" },
    { nom: "Fentanyl (Matrifen®)", forme: "Patch TTS (Sécable)", dosage: "12, 25, 50, 75, 100 µg/h", delai: "12 h", duree: "72 h", remarques: "Système MATRIX sécable" },
    { nom: "Buprénorphine (Temgésic®, Subutex®, Suboxone®)", forme: "CO SL / Amp", dosage: "0.2, 0.3, 2, 8 mg", delai: "30 min", duree: "6-8 h", remarques: "Sublingual ou Inj." },
    { nom: "Buprénorphine (Transtec®)", forme: "Patch TTS (Sécable)", dosage: "35, 52.5, 70 µg/h", delai: "18-24 h", duree: "72 h", remarques: "Sécables" },
    { nom: "Codéine (Dafalgan Codéine®, Klipal®...)", forme: "PO (CO/Eff.)", dosage: "30-60 mg", delai: "30 min", duree: "4-6 h", remarques: "Palier 2" },
    { nom: "Tramadol (Contramal®, Tradonal®, Topalgic®...)", forme: "PO (Gell./Gttes)", dosage: "50-100 mg", delai: "30-60 min", duree: "4-6 h", remarques: "Lib. immédiate" },
    { nom: "Tramadol (Contramal Retard®, Tradonal Retard®...)", forme: "PO (CO Lib. lente)", dosage: "50, 100, 150, 200 mg", delai: "2 h", duree: "12 h", remarques: "Lib. prolongée" }
];

// Ratios vers Morphine PO (Calcul du Total MME)
const conversionToMorphine = {
    "morphine_po": 1,
    "morphine_sc": 2,          // SC = PO/2 => 1mg SC = 2mg PO
    "morphine_iv": 3,          // IV = PO/3 => 1mg IV = 3mg PO
    "oxycodone_po": 1.5,       // SFAP/Opioconvert: 1mg Oxy = 1.5mg Morphine PO
    "hydromorphone_po": 7.5,   // SFAP/Opioconvert: 8mg HM = 60mg Morphine PO => Ratio 7.5
    "fentanyl_patch": 2.4,     // 25 µg/h = 60mg Morphine PO => Ratio 2.4
    "buprenorphine_patch": 1.71, 
    "buprenorphine_sl": 75,
    "codeine_po": 1/10,        // Selon la table: Ratio 10:1 => Diviser par 10
    "tramadol_po": 1/10,       // Selon la table: Ratio 10:1 => Diviser par 10
    "tramadol_iv": 1/10,       // Conservé de l'instruction précédente
    "dihydrocodeine_po": 1/3   
};

// Ratios depuis Morphine PO (Calcul de la Cible)
// Les ratios asymétriques (ex: Oxy) permettent d'intégrer une sécurité.
const conversionFromMorphine = {
    "morphine_po": 1,
    "morphine_sc": 2,
    "morphine_iv": 3,
    "oxycodone_po": 2,         // SFAP/Opioconvert: 60mg Morphine = 30mg Oxy => Ratio 2 (sécurité intégrée)
    "hydromorphone_po": 7.5,
    "fentanyl_patch": 2.4,
    "buprenorphine_patch": 1.71,
    "buprenorphine_sl": 75,
    "codeine_po": 1/10,
    "tramadol_po": 1/10,
    "tramadol_iv": 1/10,
    "dihydrocodeine_po": 1/3
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Peupler la table de référence
    const tableBody = document.querySelector('#reference-table tbody');
    referenceData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${row.nom}</strong></td>
            <td>${row.forme}</td>
            <td>${row.dosage}</td>
            <td>${row.delai}</td>
            <td>${row.duree}</td>
            <td>${row.remarques || "-"}</td>
        `;
        tableBody.appendChild(tr);
    });

    // 2. Logique Calculateur Multi-Sources
    const sourcesContainer = document.getElementById('sources-container');
    const btnAddSource = document.getElementById('add-source-btn');
    const template = document.getElementById('source-row-template');
    
    // Cibles
    const targetDrugSelect = document.getElementById('target-drug');
    const targetUnit = document.getElementById('target-unit');
    const totalMmeDisplay = document.getElementById('total-mme');
    const targetDoseDisplay = document.getElementById('target-dose');
    const btdCalc = document.getElementById('btd-calc');

    // Mettre à jour l'unité cible
    function updateTargetUnit() {
        const tgtSelected = targetDrugSelect.options[targetDrugSelect.selectedIndex];
        targetUnit.textContent = tgtSelected.getAttribute('data-unit');
    }

    // Calcul Principal
    function calculate() {
        let totalMorphineEquiv = 0;
        let justificationSteps = [];

        // Boucle sur chaque opiacé source ajouté
        const rows = sourcesContainer.querySelectorAll('.source-row');
        rows.forEach(row => {
            const select = row.querySelector('.source-drug-select');
            const input = row.querySelector('.source-dose-input');
            const dose = parseFloat(input.value);

            if (!isNaN(dose) && dose > 0) {
                const drugName = select.options[select.selectedIndex].text;
                const rate = conversionToMorphine[select.value];
                const equiv = dose * rate;
                totalMorphineEquiv += equiv;

                let logicStr = "";
                if (rate === 1) logicStr = "(Base 1:1)";
                else if (select.value === "morphine_sc") logicStr = "(Dose × 2, selon M+ SC = PO/2)";
                else if (select.value === "morphine_iv") logicStr = "(Dose × 3, selon M+ IV = PO/3)";
                else if (select.value === "fentanyl_patch") logicStr = "(Dose × 2.4, car 25µg/h = 60mg PO)";
                else if (select.value === "buprenorphine_patch") logicStr = "(Dose × ~1.71, car 35µg/h = 60mg PO)";
                else if (select.value === "codeine_po") logicStr = "(Dose ÷ 10)";
                else if (select.value === "tramadol_po") logicStr = "(Dose ÷ 10)";
                else if (select.value === "tramadol_iv") logicStr = "(Dose ÷ 10)";
                else if (select.value === "dihydrocodeine_po") logicStr = "(Dose ÷ 3)";
                else logicStr = `(Dose × ${rate})`;

                justificationSteps.push(`Source : <strong>${drugName} à ${dose}</strong> -> MME PO = <strong>${Math.round(equiv*100)/100} mg</strong> ${logicStr}`);
            }
        });

        // 3. Ajouter les Entre-doses (PRN) consommées
        const prnDoseVal = parseFloat(document.getElementById('prn-dose-val').value);
        const prnCount = parseFloat(document.getElementById('prn-count').value);

        if (!isNaN(prnDoseVal) && !isNaN(prnCount) && prnDoseVal > 0 && prnCount > 0) {
            const prnTotal = prnDoseVal * prnCount;
            totalMorphineEquiv += prnTotal;
            justificationSteps.push(`Consommation PRN : <strong>${prnCount} prises de ${prnDoseVal} mg</strong> -> MME PO = <strong>${prnTotal} mg</strong>`);
        }

        const justifContainer = document.getElementById('justification-container');
        const justifList = document.getElementById('justification-list');

        // Afficher Total MME
        totalMmeDisplay.textContent = Math.round(totalMorphineEquiv * 100) / 100;

        if (totalMorphineEquiv <= 0) {
            targetDoseDisplay.textContent = '0';
            btdCalc.textContent = '0 mg PO';
            if (justifContainer) justifContainer.style.display = 'none';
            return;
        }

        justificationSteps.push(`<strong>Somme globale (Total MME) : ${Math.round(totalMorphineEquiv*100)/100} mg/24h</strong>`);

        // Conversion vers opiacé Cible
        const targetDrug = targetDrugSelect.options[targetDrugSelect.selectedIndex].text;
        const targetRate = conversionFromMorphine[targetDrugSelect.value];
        let equivalentTarget = totalMorphineEquiv / targetRate;
        targetDoseDisplay.textContent = Math.round(equivalentTarget * 100) / 100;

        let tgtLogicStr = "";
        if (targetRate === 1) tgtLogicStr = "(MME inchangé = 1:1)";
        else if (targetDrugSelect.value === "morphine_sc") tgtLogicStr = "(MME ÷ 2)";
        else if (targetDrugSelect.value === "morphine_iv") tgtLogicStr = "(MME ÷ 3)";
        else if (targetDrugSelect.value === "fentanyl_patch") tgtLogicStr = "(MME ÷ 2.4)";
        else if (targetDrugSelect.value === "codeine_po") tgtLogicStr = "(MME × 10)";
        else if (targetDrugSelect.value === "tramadol_po") tgtLogicStr = "(MME × 10)";
        else if (targetDrugSelect.value === "tramadol_iv") tgtLogicStr = "(MME × 10)";
        else if (targetDrugSelect.value === "dihydrocodeine_po") tgtLogicStr = "(MME × 3)";
        else tgtLogicStr = `(MME ÷ ${targetRate})`;

        justificationSteps.push(`Rotation vers <strong>${targetDrug}</strong> : Total MME ${tgtLogicStr} = <strong>${Math.round(equivalentTarget * 100) / 100}</strong>`);
        
        // 5. Calcul de l'Entredose (Breakthrough dose)
        const targetValue = parseFloat(targetDoseDisplay.textContent);
        const targetUnitText = targetUnit.textContent.split('/')[0]; // mg ou µg
        const targetDrugKey = targetDrugSelect.value;
        
        let btdValue = 0;
        let btdLogic = "";
        let btdUnit = targetUnitText;

        // Cas spécifique Morphine SC selon "Calcul pratique"
        if (targetDrugKey === "morphine_sc") {
            if (targetValue < 15) {
                btdValue = 5; // Bas de fourchette 5-10
                btdLogic = "Dose < 15mg SC -> Palier 5-10mg";
            } else if (targetValue >= 15 && targetValue <= 50) {
                btdValue = 10; // Bas de fourchette 10-15
                btdLogic = "Dose 15-50mg SC -> Palier 10-15mg";
            } else {
                btdValue = targetValue * 0.25;
                btdLogic = "Dose > 50mg SC -> 25% de la dose journalière";
            }
        } else {
            // Règle conventionnelle 10-15% (on prend 10% par sécurité/défaut)
            btdValue = targetValue * 0.10;
            btdLogic = "Règle conventionnelle : 10% de la dose journalière";
        }

        btdCalc.innerHTML = `${Math.round(btdValue * 10) / 10} ${btdUnit} ${targetDrug.split('(')[0].trim()}`;
        
        justificationSteps.push(`Calcul Entredose : <strong>${Math.round(btdValue * 10) / 10} ${btdUnit}</strong> (${btdLogic})`);

        // Alerte Titration si > 3 entredoses
        if (prnCount > 3) {
            justificationSteps.push(`<span style="color:var(--warning-text)">⚠️ Patient sous-dosé (> 3 entredoses/24h) : Envisager majoration de la dose de fond de 30 à 50%.</span>`);
        }

        if (justifContainer) {
            justifList.innerHTML = justificationSteps.map(step => `<li>${step}</li>`).join('');
            justifContainer.style.display = 'block';
        }
    }

    // Créer une nouvelle ligne de source
    function createSourceRow() {
        // Cloner le template
        const clone = template.content.cloneNode(true);
        const row = clone.querySelector('.source-row');
        
        const select = row.querySelector('.source-drug-select');
        const input = row.querySelector('.source-dose-input');
        const unitDisplay = row.querySelector('.source-unit-display');
        const removeBtn = row.querySelector('.btn-remove');

        // Mettre à jour l'unité lors du changement
        select.addEventListener('change', () => {
            const selectedOpt = select.options[select.selectedIndex];
            unitDisplay.textContent = selectedOpt.getAttribute('data-unit').split('/')[0]; // Ex: mg
            calculate();
        });

        // Calculer quand on tape un chiffre
        input.addEventListener('input', calculate);

        // Bouton supprimer
        removeBtn.addEventListener('click', () => {
            row.remove();
            calculate();
        });

        // Init la première unité
        const selectedOpt = select.options[select.selectedIndex];
        unitDisplay.textContent = selectedOpt.getAttribute('data-unit').split('/')[0];

        // Ajouter au DOM
        sourcesContainer.appendChild(row);
    }

    // Event listeners pour les Entredoses (PRN)
    document.getElementById('prn-dose-val').addEventListener('input', calculate);
    document.getElementById('prn-count').addEventListener('input', calculate);

    // Events
    btnAddSource.addEventListener('click', createSourceRow);
    targetDrugSelect.addEventListener('change', () => {
        updateTargetUnit();
        calculate();
    });

    // Bouton d'impression
    const printBtn = document.getElementById('print-btn');
    if(printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // Init
    updateTargetUnit();
    createSourceRow(); // Ajouter une première ligne par défaut
});
