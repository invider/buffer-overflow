// @depends(lib/arch/op)

const HALT = 0

const LOAD = 1
const STORE = 2

const DUP = 3
const DROP = 4
const SWAP = 5
const OVER = 6

const RANDOM = 11
const INC = 12
const DEC = 13
const ADD = 14
const SUB = 15
const MUL = 16
const DIV = 17
const MOD = 18
const ABS = 19
const NEG = 20
const MIN = 21
const MAX = 22

const CALL = 31

const CORE = 98
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
        this.subs = []
    }

    flush(name, code) {
        if (!code) {
            // erasing
            const code = this.subroutine[name]
            delete this.subroutine[name]
            // TODO what can we do with the addressing issue?
            //      should we left subs intact?
            return code

        } else {
            this.subroutine[name] = code
            this.subs.push(code)
            code.id = name
            return code
        }
    }

    // flush an opcode to the subroutine
    // create subroutine if missing
    extend(name, op) {
        let sub = this.subroutine[name]
        if (!sub) {
            sub = []
            this.subroutine[name] = sub
            this.subs.push(sub)
            sub.id = name
        }
        sub.push(op)
    }

    callByName(cpu, name, stack) {
        const code = this.subroutine[name]
        return this.call(cpu, code, stack)
    }

    call(cpu, code, stack) {
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

        /*
        // TODO setup stack variables
        switch(sub) {
        }
        */

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

                // memory manipulation
                case LOAD:
                    push( cpu.load( pop() ) )
                    break

                // stack manipulation
                case DUP:
                    push( peek() )
                    break

                case STORE:
                    cpu.store( pop(), pop() )
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

                case ABS:
                    push( abs( pop() ) )
                    break

                case NEG:
                    push( pop() * -1 )
                    break

                case MIN:
                    push( min( pop(), pop() ) )
                    break

                case MAX:
                    push( max( pop(), pop() ) )
                    break


                // flow
                case CALL:
                    ax = pop()
                    const nextSub = this.subs[ax]
                    if (nextSub) {
                        this.call(cpu, nextSub, stack)

                    } else {
                        log.err(`no subroutine #${ax}`)
                    }
                    break


                // debug
                case CORE:
                    log.raw(cpu.dumpMemory())
                    break

                case DUMP:
                    log.raw(`${code.id}.${i}: `
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

    }

    next(cpu) {

        let curDir = 0
        let maxWeight = 0
        let subroutine = 'none'

        for (let i = 0; i < handlers.length; i++) {
            const handler = handlers[i]

            const stack = []
            const res = this.callByName(cpu, handler, stack)

            const weight = stack.pop()
            const dir = stack.pop()

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

        LOAD,
        STORE,
        DUP,
        DROP,
        SWAP,
        OVER,

        RANDOM,
        INC,
        DEC,
        ADD,
        SUB,
        MUL,
        DIV,
        MOD, 
        ABS,
        NEG,
        MIN,
        MAX,

        CALL,

        CORE,
        DUMP,
    })
}
