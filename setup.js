function setup() {
    const world = lab.spawn(dna.World, {
        Z: 1,
        name: 'world',
        x: 0,
        y: 0,
        zoomOnPlusMinus: true,
    })
    //world.zoom(1)

    const b1 = world.spawn(dna.Bot, {
        team: 1,
        x: 0, 
        y: 0,
    })

    const b2 = world.spawn(dna.Bot, {
        x: 20,
        y: 20,
    })

    lab.control.player.bind(0, b1)
    lab.control.player.bind(1, b1)
    lab.control.player.bind(2, b1)
}
