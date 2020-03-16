const Z = 11

const H = 72
const H2 = H/2

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
        out = tab(out, 18)

        let sub = ''
        if (t.lastSubroutine) sub = '/' + t.lastSubroutine
        out += ` [${t.cpu.activeChip.title}${sub}]`
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

function drawBackground() {
    fill(env.style.pane)
    rect(0, ry(1) - H, rx(1), H)
}

function drawEnergyLevel(bot) {
    const energy = bot.getEnergy()/env.tune.energyLimit
    const charge = bot.transponder/env.tune.energyLimit
    const w = rx(1)
    const h = env.style.energyBarWidth
    const x = 0
    const y = ry(1) - H - h

    fill(env.style.energyLow)
    rect(x, y, w, h)

    fill(env.style.teams[bot.team])
    rect(x, y, w * energy, h)

    fill(env.style.energyHi)
    rect(x + w*(energy-charge), y, w * charge, h)
}

function draw() {
    this.drawBackground()

    let label = ''
    let target

    // current target under the cursor
    //let target = lab.world.pickOne(mouse.x, mouse.y)
    //if (!target instanceof dna.Body) target = null

    if (!target) {
        target = this.selected || lab.control.player.target()
    }
    label += bodyStat(target)

    font('32px coolville')
    alignLeft()
    baseMiddle()
    fill(env.style.text)
    text(label, 20, ry(1) - H2)

    drawEnergyLevel(target)
}
