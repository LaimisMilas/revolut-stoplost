export class TrailingSellBot {
    constructor({ trailingActivateRSI = 60, trailingPercent = 5 }) {
        this.trailingActivateRSI = trailingActivateRSI;
        this.trailingPercent = trailingPercent;

        this.isTrailingActive = false;
        this.trailingPoint = 0;
        this.trailingDistance = 0;
        this.sellSignal = false;
    }

    reset() {
        this.isTrailingActive = false;
        this.trailingPoint = 0;
        this.trailingDistance = 0;
        this.sellSignal = false;
    }

    updateRSI(currentRSI) {
        this.sellSignal = false;

        if (currentRSI > this.trailingActivateRSI) {
            if (!this.isTrailingActive) {
                this.activateTrailing(currentRSI);
            }

            const threshold = this.trailingPoint - this.trailingDistance;

            if (currentRSI > this.trailingPoint) {
                this.trailingPoint = currentRSI;
            } else if (currentRSI < threshold) {
                this.sellSignal = true;
                this.reset();
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

    shouldSell() {
        return this.sellSignal;
    }
}