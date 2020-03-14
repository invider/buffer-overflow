function keyUp(e) {
    const action = env.bind.keyMap[e.code]
    if (action && !e.metaKey && !e.altKey && !e.ctrlKey) {
        lab.control.player.stop(action.id, action.player)
    }
}
