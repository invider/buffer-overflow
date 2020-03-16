function click(e) {
    const target = lab.world.pickOne(mouse.x, mouse.y)

    if (target && target instanceof dna.Bot) {
        lab.status.selected = target
    } else {
        lab.status.selected = null
    }
}
