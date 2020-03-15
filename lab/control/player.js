const ON = 1
const OFF = 0

const ctrl = []

const targetMap = []

function bind(player, target) {
    target.player = player
    player = player - 1

    targetMap[player] = target
    if (!ctrl[player]) ctrl[player] = []
}

function target(player) {
    if (!player) player = 0
    else player = player - 1

    return targetMap[player]
}

function act(action, player) {
    if (!player) player = 0
    else player = player - 1

    if (ctrl[player] && !ctrl[player][action]) {
        ctrl[player][action] = ON

        const target = targetMap[player]
        if (target && target.activate) {
            target.activate(action + 1)
        }
    }
}

function stop(action, player) {
    if (!player) player = 0
    else player = player - 1

    if (ctrl[player]) {
        if (ctrl[player][action]) {
            const target = targetMap[player]
            if (target && target.activate) {
                target.deactivate(action + 1)
            }
        }
        ctrl[player][action] = OFF
    }
}

function evo(dt) {

    for (let p = 0; p < ctrl.length; p++) {
        for (let a = 0; a < ctrl[p].length; a++) {
            if (ctrl[p][a]) {
                const target = targetMap[p]
                if (target && target.act) target.act(a + 1, dt)
            }
        }
    }
}
