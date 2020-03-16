// @depends(lib/arch/op)

const HALT = 0
const RANDOM = 11

const handlers = [
    'energy',
    'bumper',
]

let id = 0
class Chip {

    constructor() {
        this.title = 'chip Mk' + (++id)
        this.subroutine = {}
        this.handlers = []
    }

    flush(name, code) {
        if (!code) {
            // erasing
            const code = this.subroutine[name]
            delete this.subroutine[name]
            return code

        } else {
            this.subroutine[name] = code
            this.handlers.push(code)
        }
    }

    // flush an opcode to the subroutine
    // create subroutine if missing
    extend(name, op) {
        let sub = this.subroutine[name]
        if (!sub) {
            sub = []
            this.subroutine[name] = sub
        }
        sub.push(op)
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
                    stack.push(op - lib.arch.op.NUMBER_EDGE)
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

        //log(`dir: ${curDir}(${maxWeight})`)
        cpu.bot.move(curDir)
        cpu.bot.lastSubroutine = subroutine
    }

    disasm(code) {
        let out = ''
        let lineMark = 0

        function tab(str, targetLength) {
            while(str.length - lineMark < targetLength) {
                str += ' '
            }
            return str
        }

        for (let i = 0; i < code.length; i++) {
            out = tab(out, 2)
            out += `${i}:`
            out = tab(out, 6)

            const val = code[i]
            const mnemonic = lib.arch.op.match(val)

            if (mnemonic) out += mnemonic.toLowerCase()
            else out += (val - lib.arch.op.NUMBER_EDGE)
            out += '\n'
            lineMark = out.length
        }

        return out
    }

    toString() {
        let out = `Chip [${this.title}]\n`
        let chip = this

        Object.keys(this.subroutine).forEach(k => {
            const code = chip.subroutine[k]
            out += k + ':' + '\n'
            out += chip.disasm(code)
        })

        return out
    }
}

Chip.init = function() {
    lib.arch.op.setOpCodes({
        HALT: HALT,
        RANDOM: RANDOM,
    })
}
