const Z = 11

function draw() {

    let label = 'test'

    const target = lab.world.pickOne(mouse.x, mouse.y)
    if (target) {
        label = 'bot at '
            + round(target.x)
            + ':'
            + round(target.y)
    } else {
        const t = lab.control.player.target()
        if (t) {
            const receiver = round(t.receiver*10)/10
            const transponder = round(t.transponder*10)/10
            label = `${t.name} @${round(t.x)}:${round(t.y)}`
                + ` - ${receiver}:${transponder}`
        }
    }

    font('32px coolville')
    alignLeft()
    baseBottom()
    fill('#909000')
    text(label, 20, ry(1) - 20)
}
