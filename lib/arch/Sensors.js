const dict = [
    'up',
    'left',
    'down',
    'right',
]

class Sensors {

    constructor(bot) {
        this.bot = bot
        this.trigger = {}
    }

    scanEnergy(bot, energy, dist) {
        const wide = 5

        if (bot.x >= energy.x - wide
                && bot.x <= energy.x + wide
                && bot.y > energy.y) {
            if (!this.trigger['up'] || this.trigger['up'] > dist) {
                this.trigger['up'] = dist
            }
        }

        if (bot.x >= energy.x - wide
                && bot.x <= energy.x + wide
                && bot.y < energy.y) {
            if (!this.trigger['down'] || this.trigger['down'] > dist) {
                this.trigger['down'] = dist
            }
        }

        if (bot.y >= energy.y - wide
                && bot.y <= energy.y + wide
                && bot.x > energy.x) {
            if (!this.trigger['left'] || this.trigger['left'] > dist) {
                this.trigger['left'] = dist
            }
        }

        if (bot.y >= energy.y - wide
                && bot.y <= energy.y + wide
                && bot.x > energy.x) {
            if (!this.trigger['right'] || this.trigger['right'] > dist) {
                this.trigger['right'] = dist
            }
        }
    }

    scan() {
        const ls = this.bot.__._ls

        for (let j = 0; j < dict.length; j++) {
            this.trigger[dict[j]] = 0
        }

        const bot = this.bot

        for (let i = 0; i < ls.length; i++) {
            const target = ls[i]

            if (bot !== target) {
                const dist = round(this.bot.distTo(target))

                if (dist < 128 && target instanceof dna.EnergyDroplet) {
                    this.scanEnergy(bot, target, dist)
                }
            }
        }
    }
}

