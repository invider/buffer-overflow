function setup() {

    const world = lab.spawn(dna.World, {
        Z: 1,
        name: 'world',
        x: 0,
        y: 0,
        w: env.tune.worldWidth,
        h: env.tune.worldHeight,
        speed: env.tune.cameraSpeed,
        highSpeed: env.tune.cameraSpeed * 8,
        zoomOnPlusMinus: true,
        targetingPrecision: 100,
    })
    //world.zoom(1)

    /*
    // program some chips
    const op = lib.arch.op.code
    const c1 = new lib.arch.Chip()
    c1.flush('energy', [
        104,
        op.RANDOM,
        101,
    ])
    */

    const b1 = world.mob.spawn(dna.Bot, {
        team: 1,
        x: 200, 
        y: 200,
    })

    for (let i = 0; i < 120; i++) {
        const nextBot = world.mob.spawn(dna.Bot, {
            x: RND(world.w),
            y: RND(world.h),
        })
        nextBot.cpu.install(lib.chip.randomWalker)
    }

    world.ghost.spawn(dna.EnergyRain)

    // attach controls
    lab.control.player.bind(1, b1)
    lab.control.player.bind(2, b1)
    lab.control.player.bind(3, b1)
    world.target = b1
}
