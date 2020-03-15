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
        if (w.gx(this.x) < 0) this.x = w.lx(rx(1))
        if (w.gx(this.x) > rx(1)) this.x = w.lx(0)
        if (w.gy(this.y) < 0) this.y = w.ly(ry(1))
        if (w.gy(this.y) > ry(1)) this.y = w.ly(0)
    }

    kill() {
        this.__.detach(this)
    }
}
