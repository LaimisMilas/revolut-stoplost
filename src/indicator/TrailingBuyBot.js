export class TrailingBuyBot {
    constructor({ trailingActivateRSI = 40, trailingPercent = 5 }) {
        this.trailingActivateRSI = trailingActivateRSI;
        this.trailingPercent = trailingPercent;

        this.isTrailingActive = false;
        this.trailingPoint = 0;
        this.trailingDistance = 0;
        this.buySignal = false;
    }

    reset() {
        this.isTrailingActive = false;
        this.trailingPoint = 0;
        this.trailingDistance = 0;
        this.buySignal = false;
        this.trailingActivateRSI = 100;
    }

    updateRSI(currentRSI) {
        this.buySignal = false; // reset every update

        if (currentRSI < this.trailingActivateRSI) {
            if (!this.isTrailingActive) {
                this.activateTrailing(currentRSI);
            }

            const threshold = this.trailingPoint - this.trailingDistance;

            if (currentRSI < this.trailingPoint) {
                if (currentRSI < threshold) {
                    this.trailingPoint = currentRSI;
                }
            } else if (currentRSI > this.trailingPoint) {
                this.buySignal = true;
                //this.reset();
            }

        } else {
            if (this.isTrailingActive) {
                this.reset();
            }
        }
    }

    activateTrailing(currentRSI) {
        this.isTrailingActive = true;
        this.trailingPoint = currentRSI;
        this.trailingDistance = (currentRSI * this.trailingPercent) / 100;
    }

    shouldBuy() {
        return this.buySignal;
    }
}