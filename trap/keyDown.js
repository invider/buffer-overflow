function handleControl(e) {
    switch(e.code) {
        /*
        case 'Minus':
            lab.textMode.zoomOut()
            break
        case 'Equal':
            lab.textMode.zoomIn()
            break
        */

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
