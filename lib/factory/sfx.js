const CHANNELS = 16

module.exports = function () {
    res.touch('msfx')

    res.sfx._ls.forEach(s => {
        const msfx = {
            name: s.name,
            sfx: [],
            cur: 0,
            play: function(vol, pan) {
                sfx(this.sfx[this.cur], vol, pan)
                this.cur ++
                if (this.cur >= this.sfx.length) this.cur = 0
            }
        }

        for (let i = 0; i < CHANNELS; i++) {
            msfx.sfx.push(new Audio(s.src))
        }
        res.msfx.attach(msfx)
        //console.dir(msfx)
    })

    sfx.play = function(id, vol, pan) {
        if (vol === 0) return
        const msfx = res.msfx[id]
        if (msfx) {
            msfx.play(vol, pan)
        } else {
            log.warn(`unable to locate sfx [${id}]`)
        }
    }
}
