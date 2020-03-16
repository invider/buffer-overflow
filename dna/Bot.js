// @depends(dna/Body)

const defaults = {
    Z: 1,
    solid: true,
    team: 0,
    timer: 0,
    receiver: 0,
    transponder: 0,
}

let id = 0

class Bot extends dna.Body {

    constructor(st, df) {
        super(st, augment( augment({}, df), defaults) )
        this.name = 'bot' + (++id)
        this.fq = .8 + rnd(.4)
        this.charger = env.tune.chargePower
        this.recharger = env.tune.rechargePower
        this.receiver = env.tune.energyLimit * env.tune.startEnergy
        this.speed = env.tune.botSpeed
        this.cpu = new lib.arch.CPU()
        this.cpu.bot = this
    }

    hit(source) {
        if (source instanceof dna.EnergyDroplet) {
            this.receiver += source.charge
            if ((this.receiver+ this.transponder) > env.tune.energyLimit) {
                this.receiver = env.tune.energyLimit - this.transponder
            }
            // log(`${this.name} energy: +${source.charge}(${round(this.receiver)})`)
            source.kill()
        }
    }

    infect(bot, force) {
        if (this.player) return

        if (force > this.receiver) {

            const infected = this

            setTimeout(() => {
                this.dir = 0
                this.team = bot.team
                this.cpu.replace(bot.cpu.chipset)
                this.__.__.fx.spawn('Emitter', {
                    Z: this.Z+1,
                    x: this.x,
                    y: this.y,
                    r: 100,
                    color: '#ff6000',
                    lifespan: .04,
                    force: 10000,
                    radius: 10,
                    size: 1, vsize: 0,
                    speed: 150, vspeed: 0,
                    angle: 0, spread: TAU,
                    minLifespan: 0.2, vLifespan: 0,
                })

            }, 1000 + RND(1000))
            return true
        }
    }

    sneeze() {
        // determine force
        const force = this.transponder
        if (force === 0) return 0
        this.transponder = 0

        for (let i = 0; i < this.__._ls.length; i++) {
            const bot = this.__._ls[i]
            if (bot instanceof dna.Bot && !bot.dead && bot !== this) {
                const dist = this.distTo(bot)
                if (dist < force) {
                    bot.infect(this, force - dist)
                }
            }
        }

        // fx
        const speed = 100
        const estLife = force / speed
        this.__.__.fx.spawn('Emitter', {
            Z: this.Z+1,
            x: this.x,
            y: this.y,
            r: 200,
            color: '#ff0000',
            lifespan: .04,
            force: 15000,
            radius: 10,
            size: 1, vsize: 0,
            speed: speed, vspeed: 0,
            angle: 0, spread: TAU,
            minLifespan: 0.2, vLifespan: estLife,
        })

        return force
    }

    next() {
        if (this.player) this.cpu.simulate()
        else this.cpu.next()
    }

    jumpNext() {
        const team = this.team
        let next = lab.status.selectedTarget()
        if (!next || next === this || next.team !== this.team) {
            next = lab.world.nextBot(next, (b) => b.team === team)
        }

        if (next && next instanceof dna.Bot) {
            lab.world.bind(next)
        }
    }

    selectNext() {
        const selected = lab.status.selectedTarget()
        const next = lab.world.nextBot(selected, (b) => lab.world.inView(b.x, b.y))
        if (next && next instanceof dna.Bot) {
            lab.status.select(next)
        }
    }

    release() {
        lab.world.release()
    }

    activate(dir) {
        switch(dir) {
            case 5: this.jumpNext(); break;
            case 6: this.selectNext(); break;
            case 7: this.sneeze(); break;
            case 8: this.release(); break;
        }
    }

    deactivate(dir) {
    }

    handleSneezeTrigger() {
        if (this.dir === 5) {
            this.dir = 0
            this.sneeze()
        }
    }

    act(dir, dt) {
        const boost = this.player? env.tune.playerBoost : 1
        const delta = this.speed * boost * dt
        switch(dir) {
            case 1: this.y -= delta; break;
            case 2: this.x -= delta; break;
            case 3: this.y += delta; break;
            case 4: this.x += delta; break;
        }
        this.moveFlag = dir
    }

    move(dir) {
        this.dir = dir
    }

    charge(dt) {
        if (this.moveFlag) {
            // transfer to receiver
            let q = this.recharger * dt
            if (this.transponder < q) q = this.transponder
            this.transponder -= q
            this.receiver += q

        } else {
            // transfer to transponder
            let q = this.charger * dt
            if (this.receiver < q) q = this.receiver
            this.receiver -= q
            this.transponder += q
        }
    }

    evo(dt) {
        super.evo(dt)
        if (!this.player) {
            this.handleSneezeTrigger()
            this.act(this.dir, dt)
        }
        this.charge(dt)

        this.timer -= dt
        if (this.timer <= 0) {
            this.next()
            this.timer = this.fq
        }

        this.moveFlag = 0
    }

    draw() {
        fill(env.style.teams[this.team])
        rect(this.x - this.r, this.y - this.r, this.r * 2, this.r * 2)

        const r = this.r + 2
        lineWidth(env.style.lineWidth)
        if (this.player) {
            stroke(env.style.control)
            rect(this.x - r, this.y - r, 2*r, 2*r)
        } else if (this.focus) {
            stroke(env.style.focus)
            rect(this.x - r, this.y - r, 2*r, 2*r)
        } else if (this.selected) {
            stroke(env.style.selection)
            rect(this.x - r, this.y - r, 2*r, 2*r)
        }
    }

    distTo(target) {
        return dist(this.x, this.y, target.x, target.y)
    }
}
