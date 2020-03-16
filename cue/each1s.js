
function resetStat() {
    for (let i = 0; i < env.tune.teams + 2; i++) {
        env.stat.population[i] = 0
        env.stat.energy[i] = 0
        env.stat.droplets = 0
    }
}

module.exports = function() {

    const mobs = lab.world.mob._ls
    const stat = env.stat
    const total = env.tune.teams + 1

    resetStat()
    for (let i = 0; i < mobs.length; i++) {
        const m = mobs[i]
        if (m.dead) continue

        if (m instanceof dna.Bot) {
            const energy = m.getEnergy()
            stat.energy[m.team] += energy
            stat.energy[total] += energy
            stat.population[m.team] ++
            stat.population[total] ++
        } else if (m instanceof dna.EnergyDroplet) {
            stat.droplets ++
        }
    }
}
