
const Z = 21

function init() {
    this.daemon = true
    this.hidden = true
}

function show() {
    this.hidden = false
}

function draw() {
    fill(env.style.text)
    font('64px pixel-operator-mono8-bold')
    alignCenter()
    baseMiddle()

    text(env.loc.gameover, rx(.5), ry(.4))


    font('32px pixel-operator-mono8-bold')
    text(env.loc.teamName[env.winner] + env.loc.teamWins, rx(.5), ry(.55))
}
