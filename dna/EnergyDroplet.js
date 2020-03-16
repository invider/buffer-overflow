// @depends(dna/Body)

class EnergyDroplet extends dna.Body {

    constructor(st) {
        super(st)
        this.solid = true
        this.charge = env.tune.minEnergyDrop
            + RND(env.tune.maxEnergyDrop - env.tune.minEnergyDrop)
        this.r = 2
    }

    draw() {
        fill(.2, .4, .5)
        let r = this.r + (this.charge - env.tune.minEnergyDrop)/2
        quad(
            this.x - r, this.y,
            this.x,          this.y - r,
            this.x + r, this.y,
            this.x,          this.y + r
            )
    }

}
