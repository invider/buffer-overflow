class EnergyRain {

    evo(dt) {
        if (rnd() < env.tune.energyRain * dt) {
            const w = lab.world

            const x = RND(w.w)
            const y = RND(w.h)

            lab.world.mob.spawn(dna.EnergyDroplet, {
                x: x,
                y: y,
            })
        }
    }

}
