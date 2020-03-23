
const Z = 21

function init() {
    this.daemon = true
    this.hidden = true
}

function show() {
    this.hidden = false
}

function draw() {
    font('64px pixel-operator-mono8-bold')
    alignCenter()
    baseMiddle()

    fill(env.style.content)
    text(env.loc.gameover, rx(.5), ry(.4))

    fill(env.style.teams[env.winner])
    font('32px pixel-operator-mono8-bold')
    text(env.loc.teamName[env.winner] + env.loc.teamWins, rx(.5), ry(.55))
}
