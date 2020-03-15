// @depends(dna/Body)

const defaults = {
    Z: 1,
    solid: true,
    team: 0,
    timer: 0,
    receiver: 5,
    transponder: 0,
    speed: 120,
}

let id = 0

class Bot extends dna.Body {

    constructor(st, df) {
        super(st, augment( augment({}, df), defaults) )
        this.name = 'bot' + (++id)
        this.fq = .8 + rnd(.4)
        this.charger = 2 - this.fq
        this.cpu = new lib.arch.CPU()
        this.cpu.bot = this
    }

    hit(source) {
    }

    draw() {
        fill(env.style.teams[this.team])
        rect(this.x - this.r, this.y - this.r, this.r * 2, this.r * 2)
    }

    next() {
        if (this.player) this.cpu.simulate()
        else this.cpu.next()
    }

    act(dir, dt) {
        switch(dir) {
            case 1: this.y -= this.speed * dt; break;
            case 2: this.x -= this.speed * dt; break;
            case 3: this.y += this.speed * dt; break;
            case 4: this.x += this.speed * dt; break;
        }
        this.moveFlag = dir
    }

    move(dir) {
        this.dir = dir
    }

    charge(dt) {
        if (this.moveFlag) {
            // transfer to receiver
            let q = this.charger * dt
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
        if (!this.player) this.act(this.dir, dt)
        this.charge(dt)

        this.timer -= dt
        if (this.timer <= 0) {
            this.next()
            this.timer = this.fq
        }

        this.moveFlag = 0
    }
}
