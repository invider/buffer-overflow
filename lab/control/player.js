const ON = 1
const OFF = 0

const ctrl = []

const targetMap = []

function bind(player, target) {
    targetMap[player] = target
    if (!ctrl[player]) ctrl[player] = []
}

function act(action, player) {
    if (!player) player = 0
    if (ctrl[player] && !ctrl[player][action]) {
        ctrl[player][action] = ON

        const target = targetMap[player]
        if (target && target.activate) {
            target.activate(action)
        }
    }
}

function stop(action, player) {
    if (!player) player = 0
    if (ctrl[player]) {
        ctrl[player][action] = OFF
    }
}

function evo(dt) {

    for (let p = 0; p < ctrl.length; p++) {
        for (let a = 0; a < ctrl[p].length; a++) {
            if (ctrl[p][a]) {
                const target = targetMap[p]
                if (target) target.act(a, dt)
            }
        }
    }
}
