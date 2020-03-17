
const MEM_SIZE = 64

class CPU {

    constructor() {
        this.cycle = 0
        this.memory = []
        this.chipset = []
        this.activeId = -1
    }

    activate() {
        const nextChip = this.chipset[this.activeId]
        if (this.activeChip !== nextChip) {
            this.activeChip = this.chipset[this.activeId]
            this.lastSubroutine = false
        }
    }

    install(chip) {
        this.chipset.push(chip)
        if (!this.activeChip) {
            this.activeId = this.chipset.length - 1
            this.activate()
        }
    }

    installAndRun(chip) {
        this.install(chip)
        this.activeId = this.chipset.length - 1
        this.activate()
    }

    nextChip() {
        if (this.activeId < 0) {
            if (this.chipset.length > 0) {
                this.activeId = 0
                this.activate()
            }

        } else {
            this.activeId ++
            if (this.activeId >= this.chipset.length) {
                this.activeId = 0
            }
            this.activate()
        }
    }

    replace(chipset) {
        this.chipset = chipset.slice()
        this.activeChip = this.chipset[0]
        this.activeId = 0
    }

    store(addr, val) {
        if (addr < 0 || addr >= MEM_SIZE) return
        this.memory[addr] = val
    }

    load(addr) {
        return this.memory[addr] || 0
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

    dumpMemory() {
        let out = ''
        for (let i = 0; i < this.memory.length; i++) {
            const val = this.memory[i]
            if (val !== undefined) {
                out += `@${i}: ${val}\n`
            }
        }
        return out
    }
}

