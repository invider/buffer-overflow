class EnergyRain {

    evo(dt) {
        if (rnd() < env.tune.energyRain * dt) {
            const w = lab.world

            const x = RND(1000) - 500
            const y = RND(1000) - 500

            lab.world.mob.spawn(dna.EnergyDroplet, {
                x: x,
                y: y,
            })
        }
    }

}
