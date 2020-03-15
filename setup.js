function setup() {
    const world = lab.spawn(dna.World, {
        Z: 1,
        name: 'world',
        x: 0,
        y: 0,
        zoomOnPlusMinus: true,
    })
    //world.zoom(1)

    const b1 = world.mob.spawn(dna.Bot, {
        team: 1,
        x: 0, 
        y: 0,
    })

    const b2 = world.mob.spawn(dna.Bot, {
        x: 20,
        y: 20,
    })

    const op = lib.arch.op.code
    const c1 = new lib.arch.Chip()
    c1.flush('energy', [
        104,
        op.RANDOM,
        101,
    ])

    b2.cpu.install(c1)

    lab.control.player.bind(1, b1)
    lab.control.player.bind(2, b1)
    lab.control.player.bind(3, b1)
}
