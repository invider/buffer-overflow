function handleControl(e) {
    switch(e.code) {
        case 'Minus':
            lab.world.zoomOut()
            break
        case 'Equal':
            lab.world.zoomIn()
            break

        case 'KeyP':
            lab.world.paused = !lab.world.paused
            break

        case 'Backslash':
            if (lab.textMode.sidePanel.hidden) {
                lab.textMode.sidePanel.show()
            } else {
                lab.textMode.sidePanel.hide()
            }
            break

        case 'F3':
            lib.util.loadChip()
            break

        case 'F7':
            const bot = lab.status.selectedTarget()
            if (bot && bot.cpu.activeChip) {
                lib.util.saveChip(bot.cpu.activeChip)
            }
            break

        case 'F8':
            lib.img.screenshot('infected-island')
            break
    }
}

function keyDown(e) {
    if (e.repeat) return

    const action = env.bind.keyMap[e.code]

    if (e.metaKey || e.altKey || e.ctrlKey) {
        // handleOpt(e)
        return
    }

    if (action) {
        if (lab.world && lab.world.paused) lab.world.paused = false
        lab.control.player.act(action.id, action.player)

    } else {
        handleControl(e)
    }
}
