const { B2BCalculator, NETO_TO_BRUTO_II } = require('./calculator.js');

describe('B2B Calculator Tests', () => {
    let calculator;

    beforeEach(() => {
        calculator = new B2BCalculator();
    });

    describe('Basic Calculations', () => {
        test('should calculate correct Bruto II from Neto', () => {
            const netoPlata = 100000;
            const result = calculator.calculate(netoPlata, 50);
            expect(result.brutoII).toBeCloseTo(netoPlata * NETO_TO_BRUTO_II, 2);
            expect(result.brutoII).toBe(162440);
        });

        test('should handle zero neto plata', () => {
            const result = calculator.calculate(0, 50);
            expect(result.brutoII).toBe(0);
            expect(result.netoPovecanje).toBe(0);
            expect(result.netoPovecanjeProcenat).toBe(0);
        });

        test('should calculate correct split shares', () => {
            const result = calculator.calculate(100000, 75);
            expect(result.freelancerShare).toBe(0.75);
            expect(result.companyShare).toBe(0.25);
        });
    });

    describe('Tax Rate Calculations', () => {
        test('should use default tax rate of 14%', () => {
            const netoPlata = 100000;
            const result = calculator.calculate(netoPlata, 50);
            const expectedTax = result.b2bBruto * 0.14;
            expect(result.porezIznos).toBeCloseTo(expectedTax, 2);
        });

        test('should calculate correctly with 0% tax rate', () => {
            calculator.setTaxRate(0);
            const netoPlata = 100000;
            const result = calculator.calculate(netoPlata, 50);
            
            expect(result.porezIznos).toBe(0);
            expect(result.b2bNeto).toBe(result.b2bBruto);
            expect(result.netoPovecanje).toBeGreaterThan(0);
        });

        test('should calculate correctly with custom tax rates', () => {
            const testCases = [
                { rate: 0.10, netoPlata: 100000 },
                { rate: 0.20, netoPlata: 100000 },
                { rate: 0.25, netoPlata: 100000 }
            ];

            testCases.forEach(({ rate, netoPlata }) => {
                calculator.setTaxRate(rate);
                const result = calculator.calculate(netoPlata, 50);
                expect(result.porezIznos).toBeCloseTo(result.b2bBruto * rate, 2);
            });
        });
    });

    describe('Warning Logic', () => {
        test('should never show warning when tax rate is 0%', () => {
            calculator.setTaxRate(0);
            
            // Test with various split percentages
            const splits = [10, 30, 50, 70, 90];
            splits.forEach(split => {
                const result = calculator.calculate(100000, split);
                expect(result.shouldShowWarning).toBe(false);
            });
        });

        test('should show warning when net income decreases', () => {
            calculator.setTaxRate(0.14);
            
            // With low freelancer share and 14% tax, net income might decrease
            const result = calculator.calculate(100000, 10);
            if (result.netoPovecanje < 0) {
                expect(result.shouldShowWarning).toBe(true);
            }
        });

        test('should not show warning when net income increases', () => {
            calculator.setTaxRate(0.14);
            
            // With high freelancer share, net income should increase
            const result = calculator.calculate(100000, 90);
            expect(result.netoPovecanje).toBeGreaterThan(0);
            expect(result.shouldShowWarning).toBe(false);
        });
    });

    describe('Edge Cases', () => {
        test('should handle 100% freelancer share', () => {
            const netoPlata = 100000;
            const result = calculator.calculate(netoPlata, 100);
            
            expect(result.freelancerShare).toBe(1);
            expect(result.companyShare).toBe(0);
            expect(result.ustedaFirme).toBe(0);
        });

        test('should handle 0% freelancer share', () => {
            const netoPlata = 100000;
            const result = calculator.calculate(netoPlata, 0);
            
            expect(result.freelancerShare).toBe(0);
            expect(result.companyShare).toBe(1);
            expect(result.b2bBruto).toBe(netoPlata);
        });

        test('should handle very high tax rates', () => {
            calculator.setTaxRate(0.50); // 50% tax
            const result = calculator.calculate(100000, 50);
            
            expect(result.porezIznos).toBe(result.b2bBruto * 0.5);
            expect(result.b2bNeto).toBe(result.b2bBruto * 0.5);
        });
    });

    describe('Company Savings', () => {
        test('should calculate correct company savings', () => {
            const netoPlata = 100000;
            const result = calculator.calculate(netoPlata, 50);
            
            const expectedSavings = result.brutoII - result.b2bBruto;
            expect(result.ustedaFirme).toBeCloseTo(expectedSavings, 2);
        });

        test('should have positive company savings percentage', () => {
            const result = calculator.calculate(100000, 50);
            expect(result.ustedaFirmeProcenat).toBeGreaterThan(0);
        });
    });

    describe('Break-even Analysis', () => {
        test('should find approximate break-even point', () => {
            calculator.setTaxRate(0.14);
            const netoPlata = 100000;
            
            // Find the split where net increase is approximately 0
            let breakEvenSplit = 0;
            for (let split = 1; split <= 100; split++) {
                const result = calculator.calculate(netoPlata, split);
                if (result.netoPovecanje >= 0) {
                    breakEvenSplit = split;
                    break;
                }
            }
            
            // With 14% tax, break-even should be around 20-25%
            expect(breakEvenSplit).toBeGreaterThan(20);
            expect(breakEvenSplit).toBeLessThan(30);
        });
    });
});

// Run tests if this file is executed directly
if (require.main === module) {
    console.log('Running B2B Calculator Tests...');
    console.log('Install Jest to run these tests: npm install --save-dev jest');
    console.log('Then run: npm test');
}