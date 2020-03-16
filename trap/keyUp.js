
function handleControl(e) {
    switch(e.code) {
        case 'Minus':
            lab.world.stopZoom()
            break
        case 'Equal':
            lab.world.stopZoom()
            break
    }
}

function keyUp(e) {


    const action = env.bind.keyMap[e.code]
    if (!e.metaKey && !e.altKey && !e.ctrlKey) {

        if (action) lab.control.player.stop(action.id, action.player)
        else handleControl(e)
    }
}
