class CPU {

    constructor() {
        this.cycle = 0
        this.chipset = []
    }

    install(chip) {
        this.chipset.push(chip)
    }

    replace(chipset) {
        this.chipset = chipset.slice()
    }

    next() {
        this.cycle ++
        log('#' + this.cycle + ' for ' + this.bot.name)
        if (this.activeChip) {
            this.activeChip.next(this, this.cycle)
        }
    }

    simulate() {
        // highlight current slot
        log('sim for ' + this.bot.name)
    }
}
