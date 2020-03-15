// @depends(lib/arch/op)

const NUMBER_SHIFT = 100

const HALT = 0
const RANDOM = 11

const handlers = [
    'energy',
    'bumper',
]

class Chip {

    constructor() {
        this.subroutine = {}
        this.handlers = []
    }

    flush(name, code) {
        if (!code) {
            // erasing
            const code = this.subroutine[name]
            const i = this.handlers[code]
            if (i >= 0) {
                this.handlers.splice(i, 1)
            }
            delete this.subroutine[name]
        } else {
            this.subroutine[name] = code
            this.handlers.push(code)
        }
    }

    call(cpu, sub) {
        const code = this.subroutine[sub]
        if (!code) return 0

        const stack = []
        function pop() {
            if (stack.length === 0) return 0
            else return stack.pop()
        }

        switch(sub) {
            // TODO setup stack variables
        }

        let i = 0
        let exec = true
        while(exec) {
            const op = code[i++]
            switch(op) {
                case HALT:
                    exec = false
                    break

                case RANDOM:
                    const val = pop()
                    stack.push(RND(val))
                    break

                case undefined:
                    exec = false
                    break

                default:
                    // a number?
                    stack.push(op - NUMBER_SHIFT)
            }
        }

        const weight = pop()
        const dir = pop()

        return weight*10 + dir
    }

    next(cpu) {

        let curDir = 0
        let maxWeight = 0
        let subroutine = 'none'

        for (let i = 0; i < handlers.length; i++) {
            const handler = handlers[i]
            const res = this.call(cpu, handler)
            const weight = floor(res / 10)
            const dir = floor(res % 10)

            if (weight > maxWeight) {
                curDir = dir
                maxWeight = weight
                subroutine = handler
            }
        }

        if (cpu.bot.name === 'bot2') {
            log(`dir: ${curDir}(${maxWeight})`)
        }
        cpu.bot.move(curDir)
        cpu.bot.lastSubroutine = subroutine
    }
}

Chip.init = function() {
    lib.arch.op.setOpCodes({
        HALT: HALT,
        RANDOM: RANDOM,
    })
}
