const defaults = {
    x: 0,
    y: 0,
    r: 8,
}

let id = 0

class Body {

    constructor(st, df) {
        this.id = ++id
        augment(this, defaults)
        augment(this, df)
        augment(this, st)
    }

    draw() {
        //lineWidth(.1)
        //stroke(.3, .5, .5)
        fill(.2, .4, .5)
        rect(this.x - this.r, this.y - this.r, this.r * 2, this.r * 2)
    }

    evo(dt) {
        // warp the world
        const w = lab.world
        if (this.x < 0) this.x = w.w
        if (this.x > w.w) this.x = 0
        if (this.y < 0) this.y = w.h
        if (this.y > w.h) this.y = 0
    }

    kill() {
        this.dead = true
    }
}
