// @depends(lib/arch/op)

const HALT = 0

const DUP = 1
const DROP = 2
const SWAP = 3
const OVER = 4

const RANDOM = 11
const INC = 12
const DEC = 13
const ADD = 14
const SUB = 15
const MUL = 16
const DIV = 17
const MOD = 18

const DUMP = 99

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

    call(cpu, sub, stack) {
        const code = this.subroutine[sub]
        if (!code) return 0

        function pop() {
            if (stack.length === 0) {
                log.warn('stack is empty!')
                return 0
            }
            else return stack.pop()
        }

        function push(val) {
            stack.push(val)
        }

        function peek() {
            return stack[stack.length - 1]
        }

        switch(sub) {
            // TODO setup stack variables
        }

        let i = 0
        let ax = 0
        let bx = 0
        let exec = true
        while(exec) {
            const op = code[i++]
            switch(op) {
                case HALT:
                    exec = false
                    break

                // stack manipulation
                case DUP:
                    push( peek() )
                    break

                case DROP:
                    pop()
                    break

                case SWAP:
                    ax = pop()
                    bx = pop()
                    push(ax)
                    push(bx)
                    break

                case OVER:
                    ax = stack[stack.length - 2]
                    push(ax)
                    break

                // math
                case RANDOM:
                    push(RND( pop() ))
                    break

                case INC:
                    push( pop() + 1 )
                    break

                case DEC:
                    push( pop() - 1 )
                    break

                case ADD:
                    push( pop() + pop() )
                    break

                case SUB:
                    ax = pop()
                    bx = pop()
                    push( bx - ax )
                    break

                case MUL:
                    push( pop() * pop() )
                    break

                case DIV:
                    ax = pop()
                    bx = pop()
                    push( round(bx / ax) )
                    break

                case MOD:
                    ax = pop()
                    bx = pop()
                    push( bx % ax )
                    break


                case DUMP:
                    log.raw(`${sub}.${i}: `
                        + this.dumpSub(code)
                        + '\n'
                        + this.dumpStack(stack)
                    )

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
            const res = this.call(cpu, handler, [])
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
        cpu.lastSubroutine = subroutine
    }

    disasm(code, st) {
        let out = ''
        let lineMark = 0

        const df = {
            lineTab: 2,
            separator: '\n',
            showAddresses: false,
        }
        augment(df, st)

        function tab(str, targetLength) {
            while(str.length - lineMark < targetLength) {
                str += ' '
            }
            return str
        }

        for (let i = 0; i < code.length; i++) {
            out = tab(out, df.lineTab)
            if (df.showAddresses) {
                out += `${i}:`
                out = tab(out, 6)
            }

            const val = code[i]
            const mnemonic = lib.arch.op.match(val)

            if (mnemonic) out += mnemonic.toLowerCase()
            else out += (val - lib.arch.op.NUMBER_EDGE)
            out += df.separator
            lineMark = out.length
        }

        return out
    }

    dumpStack(stack) {
        let out = '['
        for (let i = stack.length; i > 0;) {
            out += stack[--i]
            if (i > 0) out += ','
        }
        out += ']'

        return out
    }

    dumpSub(code) {
        return this.disasm(code, {
            lineTab: 0,
            separator: ' ',
        })
    }

    dump() {
        let out = `.chip "${this.title}"\n`
        let chip = this

        Object.keys(this.subroutine).forEach(k => {
            const code = chip.subroutine[k]
            out += '\n' + k + ':' + '\n'
            out += chip.disasm(code)
        })

        return out
    }

    toString() {
        let out = `Chip [${this.title}]\n`
        let chip = this

        Object.keys(this.subroutine).forEach(k => {
            const code = chip.subroutine[k]
            out += '\n' + k + ':' + '\n'
            out += chip.disasm(code, {
                showAddresses: true,
            })
        })

        return out
    }
}

Chip.init = function() {
    lib.arch.op.setOpCodes({
        HALT,

        DUP,
        DROP,
        SWAP,
        OVER,

        RANDOM,
        DUMP,
        INC,
        DEC,
        ADD,
        SUB,
        MUL,
        DIV,
        MOD, 
    })
}
