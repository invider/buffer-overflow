// 
// released flow controller
//

function jumpNext() {
    const next = lab.world.nextBot(lab.world.getTarget())

    if (next && next instanceof dna.Bot) {
        lab.world.setTarget(next)
    }
}

function bind() {
    const target = lab.world.getTarget()
    if (target) lab.world.bind(target)
}

function activate(action) {
    switch(action) {
        case 5:
        case 6:
            this.jumpNext()
            break

        case 7:
            this.bind()
            break
    }
}
