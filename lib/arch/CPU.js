class CPU {

    constructor() {
        this.cycle = 0
        this.chipset = []
    }

    install(chip) {
        this.chipset.push(chip)
        this.activeChip = this.activeChip || chip
    }

    installAndRun(chip) {
        this.install(chip)
        this.activeChip = chip
    }

    replace(chipset) {
        this.chipset = chipset.slice()
        this.activeChip = this.chipset[0]
    }

    next() {
        this.cycle ++
        //log('#' + this.cycle + ' for ' + this.bot.name)
        if (this.activeChip) {
            this.activeChip.next(this, this.cycle)
        } else {
            this.bot.move(0)
        }
    }

    simulate() {
        // highlight current slot
        //log('sim for ' + this.bot.name)
    }
}

