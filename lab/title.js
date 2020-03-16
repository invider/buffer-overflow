
const Z = 13

const H = 72

const H2 = H/2

function drawBackground() {
    fill(env.style.pane)
    rect(0, 0, rx(1), H)
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
        const energy = floor(env.stat.energy[team])
        const lead = env.stat.leader === team? '!' : ''

        if (team === controller) {
            font('40px coolville')
            fill(env.style.sneeze[team])
        } else {
            font('32px coolville')
            fill(env.style.teams[team])
        }

        const tag = `${name}: ${pop}/${energy}${lead}`

        text(tag, rx(ax), H2)

        ax += sx
    }

    fill(env.style.text)
    const time = floor(env.stat.time)
    const min = floor(time / 60)
    const sec = time % 60
    text(`${env.loc.time}: ${min}:${sec}`, rx(ax), H2)
}

function draw() {
    this.drawBackground()
    this.drawContent()
}
