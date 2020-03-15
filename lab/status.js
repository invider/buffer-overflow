const Z = 11

function botStat(t) {
    if (!t) return ''

    const receiver = round(t.receiver*10)/10
    const transponder = round(t.transponder*10)/10

    return `${t.name} @${round(t.x)}:${round(t.y)}`
        + ` - ${receiver}:${transponder}`
}

function draw() {

    let label = 'test'

    let target = lab.world.pickOne(mouse.x, mouse.y)
        || lab.control.player.target()
    label = botStat(target)

    font('32px coolville')
    alignLeft()
    baseBottom()
    fill('#909000')
    text(label, 20, ry(1) - 20)
}
