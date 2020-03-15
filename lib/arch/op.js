const code = {}

const mnemonic = []

function setOpCodes(def) {

    Object.keys(def).forEach(m => {
        code[m] = def[m]
    })

    Object.keys(code).forEach(m => {
        const c = code[m]
        mnemonic[c] = m
    })
}
