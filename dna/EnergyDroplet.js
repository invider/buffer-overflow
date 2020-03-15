// @depends(dna/Body)

let id = 0
class EnergyDroplet extends dna.Body {

    constructor(st) {
        super(st)
        this.solid = true
        this.name = 'drop' + (++id)
        this.charge = 25 + RND(75)
        this.r = 4
    }

    draw() {
        fill(.2, .4, .5)
        quad(
            this.x - this.r, this.y,
            this.x,          this.y - this.r,
            this.x + this.r, this.y,
            this.x,          this.y + this.r
            )
    }

}
