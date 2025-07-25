// B2B Calculator Logic
const NETO_TO_BRUTO_II = 1.6244;

class B2BCalculator {
    constructor() {
        this.taxRate = 0.14;
    }

    setTaxRate(rate) {
        this.taxRate = rate;
    }

    calculate(netoPlata, freelancerSharePercent) {
        const brutoII = netoPlata * NETO_TO_BRUTO_II;
        const ustedaTotal = brutoII - netoPlata;
        const freelancerShare = freelancerSharePercent / 100;
        const companyShare = 1 - freelancerShare;

        // Freelancer calculations
        const freelancerBenefit = ustedaTotal * freelancerShare;
        const b2bBruto = netoPlata + freelancerBenefit;
        const porezIznos = b2bBruto * this.taxRate;
        const b2bNeto = b2bBruto - porezIznos;
        const netoPovecanje = b2bNeto - netoPlata;
        const netoPovecanjeProcenat = netoPlata > 0 ? (netoPovecanje / netoPlata) * 100 : 0;

        // Company calculations
        const noviTrosakFirme = b2bBruto;
        const ustedaFirme = brutoII - noviTrosakFirme;
        const ustedaFirmeProcenat = brutoII > 0 ? (ustedaFirme / brutoII) * 100 : 0;

        return {
            brutoII,
            ustedaTotal,
            freelancerShare,
            companyShare,
            b2bBruto,
            porezIznos,
            b2bNeto,
            netoPovecanje,
            netoPovecanjeProcenat,
            noviTrosakFirme,
            ustedaFirme,
            ustedaFirmeProcenat,
            shouldShowWarning: this.taxRate === 0 ? false : netoPovecanje < 0
        };
    }
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { B2BCalculator, NETO_TO_BRUTO_II };
}