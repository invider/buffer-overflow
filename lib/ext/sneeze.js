// .sneeze file parser

// @depends(lib/arch/op)

const SYM = 1
const NUM = 2
const STR = 3
const LABEL = 4
const DIRECTIVE = 5

const DEF = {
    WAIT: 0,
    UP: 1,
    LEFT: 2,
    DOWN: 3,
    RIGHT: 4,
}

let TAB = 4

function isSpace(c) {
    return c === ' ' || c === '\t'
}

function isNewLine(c) {
    return c === '\r' || c === '\n'
}

function isSeparator(c) {
    return isSpace(c) || isNewLine(c)
}

function isSpecial(c) {
    return c === ':'
}

function isDigit(c) {
    const code = c.charCodeAt(0) - 48
    return code >= 0 && code < 10
}

function toDec(c) {
    const code = c.charCodeAt(0) - 48
    if (code >= 0 && code < 10) return code
    else return -1
}

function isHex(c) {
    const code = c.toUpperCase().charCodeAt(0) - 48
    return (code >= 0 && code < 10) || (code >= 17 && code < 23)
}

function toHex(c) {
    const code = c.toUpperCase().charCodeAt(0) - 48
    if (code >= 0 && code < 10) return code
    else if (code >= 17 && code < 23) return code - 7
    else return -1
}

function isAlpha(c) {
    return !isSeparator(c) && !isDigit(c) && !isSpecial(c)
}

function isAlphaNum(c) {
    return !isSeparator(c) && !isSpecial(c)
}


function makeStream(src) {
    let pos = 0
    let buf = false
    let bufc

    function cur() {
        if (buf) return pos-1
        else return pos
    }

    function getc() {
        if (buf) buf = false
        else bufc = src.charAt(pos++)
        return bufc
    }

    function retc() {
        if (buf) throw "stream buffer overflow"
        buf = true
    }

    function aheadc() {
        const c = getc()
        retc()
        return c
    }

    function expectc(c) {
        if (getc() !== c) throw `${c} is expected`
    }

    function eatc(c) {
        let i = 0
        while(getc() === c) i++
        retc()
        return i
    }

    function notc(c) {
        if (getc() === c) throw `${c} is not expected`
    }

    return {
        cur: cur,
        getc: getc,
        retc: retc,
        eatc: eatc,
        aheadc: aheadc,
        expectc: expectc,
        notc: notc,
    }
}

function makeLex(getc, retc, eatc, aheadc, expectc, notc, cur) {
    let mark = 0
    let lineNum = 1
    let lineShift = 0
    let tab = 0
    let lead = true // beginning of a string

    function err(msg) {
        throw 'syntax error @' + lineNum + ':' + (mark-lineShift) + ' - ' + msg
    }

    function xerr (msg) {
        throw 'lexical error @' + lineNum + ':' + (mark-lineShift) + ' - ' + msg
    }

    function markLine () {
        lineNum ++
        lineShift = cur()
        tab = 0
        lead = true
    }

    function skipLine() {
        let c = getc()
        while (c && !isNewLine(c)) c = getc()
        if (isNewLine(c)) markLine()
    }

    function afterLineComment() {
        skipLine()
        return parseNext()
    }

    function afterMultiComment(cc, len) {
        skipLine()

        while (isSpace(aheadc())) getc()

        const i = eatc(cc)
        if (i === len) {
            // end of multiline
            skipLine()
            return parseNext()
        }
        return afterMultiComment(cc, len)
    }

    function parseNext() {

        let c = getc()
        if (!c) return false

        // skip spaces
        while (isSpace(c)) {
            c = getc()
            if (lead) {
                if (c === '\t') tab += TAB - ((cur()-lineShift)%TAB)
                else tab ++
            }
        }
        lead = false

        // next line
        if (isNewLine(c)) {
            const n = getc()
            if (c === '\n' && n !== '\r') {
                retc()
            }
            markLine()
            return parseNext()
        }

        if (c === '#') return afterLineComment()

        // skip -- and multiline ---- comments
        if (c === '-' || c === '=') {
            const cc = c
            if (aheadc() === cc) {
                getc()

                if (aheadc() === cc) {
                    let len = eatc(cc) + 2
                    return afterMultiComment(cc, len)

                } else {
                    return afterLineComment()
                }
            }
        }

        // got to an actual token
        mark = cur()

        // string
        if (c === '"') {
            let s = ''
            c = getc()
            while (c && c !== '"' && !isNewLine(c)) {
                s += c
                c = getc()
            }

            if (c != '"') xerr('unexpected end of string')

            return {
                type: STR,
                tab: tab,
                val: s,
            }
        }

        let sign = 1
        if (c === '-') {
            sign = -1
            c = getc()
        }

        if (isDigit(c)) {
            let n = 0
            if (c === '0' && getc() === 'x') {
                if (sign < 0) xerr("hex value can't be negative")

                let d = toHex(getc())
                if (d < 0) {
                    xerr('wrong number format')
                }
                while (d >= 0) {
                    n = n*16 + d
                    d = toHex(getc())
                }
                retc()

                return {
                    type: NUM,
                    tab: tab,
                    val: n
                }
            } else if (c === '0') {
                retc()
                c = getc()
                if (!isSeparator(c)) xerr('wrong number format')

                retc()
                return {
                    type: NUM,
                    tab: tab,
                    val: 0,
                }

            } else {
                let d = 0
                while ((d = toDec(c)) >= 0) {
                    n = n*10 + d
                    c = getc()
                }
                retc()

                return {
                    type: NUM,
                    tab: tab,
                    val: sign * n,
                }
            }

        } else if (sign < 0) {
            xerr('wrong number format')
        }

        let directive = false
        if (c === '.') {
            directive = true
            c = getc()
        }

        let sym = ''
        while ( isAlphaNum(c) ) {
            sym += c
            c = getc() 
        }

        if (directive) {
            return {
                type: DIRECTIVE,
                tab: tab,
                val: sym,
            }
        }

        if (c === ':') {
            return {
                type: LABEL,
                tab: tab,
                val: sym,
            }

        } else {
            retc()
            return {
                type: SYM,
                tab: tab,
                val: sym,
            }
        }
    }

    let lastToken
    let isBuffered = false
    function next() {
        if (isBuffered) isBuffered = false
        else lastToken = parseNext()
        return lastToken
    }

    function ahead() {
        if (!isBuffered) {
            lastToken = parseNext()
            isBuffered = true
        }
        return lastToken
    }

    function ret() {
        if (isBuffered) throw 'token buffer overflow'
        isBuffered = true
    }

    return {
        next: next,
        ahead: ahead,
        ret: ret,
        err: err,
    }
}

function parse(src) {
    const stream = makeStream(src)
    const lex = makeLex(
                    stream.getc,
                    stream.retc,
                    stream.eatc,
                    stream.aheadc,
                    stream.expectc,
                    stream.notc,
                    stream.cur)
    const chip = new lib.arch.Chip()
    const op = lib.arch.op

    function subroutine(sub) {
        let token
        while(token = lex.next()) {
            switch(token.type) {
                case NUM:
                    if (token.val < 0) {
                        chip.extend(sub, token.val)
                    } else {
                        chip.extend(sub,
                            token.val + op.NUMBER_EDGE)
                    }
                    break

                case SYM:
                    const mnemonic = token.val.toUpperCase()
                    let c = op.code[mnemonic]
                    if (c === undefined) {
                        // predefined constants
                        c = DEF[mnemonic]
                        if (c === undefined) {
                            throw 'unknown mnemonics:'
                                        + token.val
                        }
                        c += op.NUMBER_EDGE
                    } 
                    chip.extend(sub, c)
                    break

                case LABEL:
                    lex.ret()
                    return
            }
        }
    }

    function expectString() {
        let token = lex.next()
        if (token.type !== STR) lex.err('string expected')
        else return token.val
    }

    function global() {

        let token
        while(token = lex.next()) {
            if (token.type === LABEL) {
                subroutine(token.val)
            } else if (token.type == DIRECTIVE) {
                switch(token.val) {
                    case 'chip':
                        chip.title = expectString()
                        break

                    default:
                        lex.err(`unrecognized directive [${token.val}]`)
                }

            } else {
                lex.err('unexpected token: ' + token.val)
            }
        }
    }

    global()
    return chip
}

function sneeze(src) {
    return parse(src)
}
