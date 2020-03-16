function populate(world) {
    let toCreate = env.tune.population

    // create teams
    for (let team = 1; team < 5; team++) {
        for (let i = 0; i < env.tune.teamSize; i++) {
            const bot = world.mob.spawn(dna.Bot, {
                team: team,
                x: RND(world.w), 
                y: RND(world.h),
            })
            if (team === 1 && i === 0) {
                world.bind(bot)
            } else {
                bot.cpu.install(lib.chip.randomWalker)
            }
            toCreate --
        }
    }

    // create neutrals
    while(toCreate > 0) {
        const bot = world.mob.spawn(dna.Bot, {
            x: RND(world.w),
            y: RND(world.h),
        })
        bot.cpu.install(lib.chip.randomWalker)
        toCreate --
    }
}

function rain(world) {
    world.ghost.spawn(dna.EnergyRain)
}

function genesis() {

    const world = lab.spawn(dna.World, {
        Z: 1,
        name: 'world',
        x: 0,
        y: 0,
        w: env.tune.worldWidth,
        h: env.tune.worldHeight,
        speed: env.tune.cameraSpeed,
        highSpeed: env.tune.cameraSpeed * 16,
        zoomOnPlusMinus: true,
        targetingPrecision: 20,
    })
    world.zoom(2)
    populate(world)
    rain(world)
}
