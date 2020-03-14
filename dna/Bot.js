// @depends(dna/Body)

const defaults = {
    Z: 1,
    solid: true,
    team: 0,
    speed: 120,
}

let id = 0

class Bot extends dna.Body {

    constructor(st, df) {
        super(st, augment( augment({}, df), defaults) )
        this.name = 'bot' + (++id)
    }

    act(id, dt) {
        switch(id) {
            case 0: this.y -= this.speed * dt; break;
            case 1: this.x -= this.speed * dt; break;
            case 2: this.y += this.speed * dt; break;
            case 3: this.x += this.speed * dt; break;
        }
    }

    hit(source) {
        log(this.name + ' is hit by ' + source.name)
    }

    draw() {
        fill(env.style.teams[this.team])
        rect(this.x - this.r, this.y - this.r, this.r * 2, this.r * 2)
    }

    evo(dt) {
        super.evo(dt)
    }
}
