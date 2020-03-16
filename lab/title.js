
const Z = 13

function drawBackground() {
    const h = 72
    fill(env.style.pane)
    rect(0, 0, rx(1), h)
}

function drawContent() {

    font('32px coolville')
    alignCenter()
    baseTop()

    let ax = .15
    let sx = (1 - 2*ax)/env.tune.teams

    for (let team = 1; team <= env.tune.teams; team++) {
        const name = env.loc.teamName[team]
        const pop = env.stat.population[team]
        const energy = floor(env.stat.energy[team])

        const tag = `${name}: ${pop} [${energy}]`

        fill(env.style.teams[team])
        text(tag, rx(ax), 20)

        ax += sx
    }

    fill(env.style.text)
    const time = floor(env.stat.time)
    const min = floor(time / 60)
    const sec = time % 60
    text(`${env.loc.time}: ${min}:${sec}`, rx(ax), 20)
}

function draw() {
    this.drawBackground()
    this.drawContent()
}
