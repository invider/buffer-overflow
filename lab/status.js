const Z = 11

function tab(src, targetLength) {
    while(src.length < targetLength) {
        src += ' '
    }
    return src
}

function botStat(t) {
    const receiver = round(t.receiver)
    const transponder = round(t.transponder)
    const energy = round(t.receiver + t.transponder)

    let out = `${t.name} ${energy}[${receiver}:${transponder}]`

    if (t.cpu.activeChip) {
        out = tab(out, 12)

        const sub = t.lastSubroutine || ''
        out += ` [${t.cpu.activeChip.title}/${sub}]`
    }

    return out
}

function energyStat(e) {
    const energy = round(e.charge)
    return `[${energy}] energy`
}

function bodyStat(e) {
    if (!e) return 'undef'
    if (e.dead) return 'dead ' + e.name
    if (e instanceof dna.Bot) return botStat(e)
    if (e instanceof dna.EnergyDroplet) return energyStat(e)
    return ''
}

function selectedTarget() {
    return this.selected || lab.control.player.target()
}

function select(target) {
    if (this.selected) this.selected.selected = false
    this.selected = target
    if (target) target.selected = true
}

function draw() {

    let label = ''

    // current under the cursor
    let target
    //let target = lab.world.pickOne(mouse.x, mouse.y)
    //if (!target instanceof dna.Body) target = null

    if (!target) {
        target = this.selected || lab.control.player.target()
    }
    label += bodyStat(target)

    font('32px coolville')
    alignLeft()
    baseBottom()
    fill('#909000')
    text(label, 20, ry(1) - 20)
}
