const Z = 11

function draw() {

    let label = 'test'

    const target = lab.world.pickOne(mouse.x, mouse.y)
    if (target) {
        label = 'bot at '
            + round(target.x)
            + ':'
            + round(target.y)
    }

    font('32px coolville')
    alignLeft()
    baseBottom()
    fill('#909000')
    text(label, 20, ry(1) - 20)
}
