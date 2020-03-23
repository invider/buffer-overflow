
const Z = 21

function init() {
    this.daemon = true
    this.hidden = true
}

function show() {
    this.hidden = false

    const spash = this
    lab.spawn(dna.Transition, {
        Z: 1001,
        wait: 3,
        fadein: 1,
        keep: .5,
        fadeout: 1,

        onFadeout: function() {
            lib.util.show()
            spash.hidden = true
        }
    })
}

function draw() {
    fill(env.style.content)
    font('48px pixel-operator-mono8-bold')
    alignCenter()
    baseMiddle()

    text(env.loc.title, rx(.5), ry(.5))

    const x = rx(1) - 40
    let y = ry(.8)
    font('24px pixel-operator-mono8-bold')
    alignRight()
    text(env.loc.subtitle, x, y)
    y += 72
    text(env.loc.special, x, y)
}
