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

    matchDir(src, target, wide) {
        if (src.x >= target.x - wide
                && src.x <= target.x + wide
                && src.y > target.y) {
            return 1
        }
        if (src.x >= target.x - wide
                && src.x <= target.x + wide
                && src.y < target.y) {
            return 3
        }
        if (src.y >= target.y - wide
                && src.y <= target.y + wide
                && src.x > target.x) {
            return 2
        }
        if (src.y >= target.y - wide
                && src.y <= target.y + wide
                && src.x < target.x) {
            return 4
        }
        return 0
    }

    matchQuadrant(src, target) {
        const x = target.x - src.x
        const y = target.y - src.y

        if (x > 0 && y > 0) {
            if (x > y) return 4
            else return 1
        } else if (x < 0 && y > 0) {
            if (x * -1 > y) return 2
            else return 1
        } else if (x < 0 && y < 0) {
            if (x * -1 > y * -1) return 2
            else return 3
        } else if (x > 0 && y < 0) {
            if (x > y * -1) return 4
            else return 3
        }
        return 0
    }

    scanEnergy(bot, energy, dist) {
        const wide = 5
        const dir = this.matchQuadrant(bot, energy)
        //const dir = this.matchDir(bot, energy, wide)
        if (!dir) return 

        const name = lib.util.dirName(dir)

        if (!this.trigger[name] || this.trigger[name] > dist) {
            this.trigger[name] = dist
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

                if (dist < 48 && target instanceof dna.EnergyDroplet) {
                    this.scanEnergy(bot, target, dist)
                }
            }
        }
    }
}

