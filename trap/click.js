function click(e) {
    const target = lab.world.pickOne(mouse.x, mouse.y)

    if (target && target instanceof dna.Bot) {
        lab.status.select(target)
    } else {
        lab.status.select()
    }
}
