
const Z = 13

const H = 64

const H2 = H/2

function drawBackground() {
    fill(env.style.pane)
    rect(0, 0, rx(1), H)
}

function drawEnergyLevels() {
    const w = rx(1)
    const h = env.style.energyBarWidth
    const y = H
    let x = 0

    const neutral = floor(env.stat.energy[0])
    const total = floor(env.stat.energy[env.tune.teams + 1]) - neutral

    fill(env.style.teams[0])
    rect(x, y, w, h)

    for (let team = 1; team <= env.tune.teams; team ++) {
        
        const energy = floor(env.stat.energy[team])
        const share = energy/total
        const ew = w * share

        fill(env.style.teams[team])
        rect(x, y, ew, h)
        x += ew
    }
}

function drawContent() {

    alignCenter()
    baseMiddle()

    let ax = .15
    let sx = (1 - 2*ax)/env.tune.teams

    let controller = 0
    const target = lab.control.player.target()
    if (target) controller = target.team

    for (let team = 1; team <= env.tune.teams; team++) {
        const name = env.loc.teamName[team]
        const pop = env.stat.population[team]
        const lead = env.stat.leader === team? '!' : ''

        if (team === controller) {
            font(env.style.fontBig)
            fill(env.style.sneeze[team])
        } else {
            font(env.style.font)
            fill(env.style.teams[team])
        }

        const tag = `${name}: ${pop}${lead}`
        text(tag, rx(ax), H2)
        ax += sx
    }

    // time
    font(env.style.font)
    fill(env.style.text)
    const time = floor(env.stat.time)
    const min = floor(time / 60)
    const sec = time % 60
    text(`${env.loc.time}: ${min}:${sec}`, rx(ax), H2)
}

function draw() {
    this.drawBackground()
    this.drawContent()
    this.drawEnergyLevels()
}
