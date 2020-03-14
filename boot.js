'use strict'

// boot config values
let base = hsl(.1, 0, 0)
let content = hsl(.54, 1, .5)
let contentLow = hsl(.1, 0, 0)
let contentErr = hsl(.01, 1, .55) // collider orange
let fadeBase = hsl(.1, 0, 0)
//let content = hsl(.1, 1, .5) // collider orange
//const COLOR = hsl(.54, 1, .5)
//const COLOR = hsl(.98, 1, .6)
//const COLOR = hsl(.1, 1, .5)
//const COLOR = hsl(.3, 1, .5)
//const COLOR = hsl(.35, 1, .5)

let power = 2
let hold = 5
let fade = 1
let wait = 0.5

// boot state
let time = 0
let state = 'loading'
let label = ''


// boot implementation values
const BASE = width() > height()? height() : width()
const FBASE = BASE * .05

let labelFont = FBASE+'px moon'
let lowFont = FBASE*.75 + 'px moon'

const R3 = ry(.4)
const POWERED_BY = 'Powered by Collider.JAM'
const ERROR = 'Error'
let poweredByFont = FBASE+'px zekton'

const ACTIVE = 0
const FADING = 1
const STABLE = 5

const RING = 0
const CONNECTOR = 1
const LABEL = 3

const DEAD = 11

const FQ = 5
const DIR = 0

let x = rx(.5)
let y = ry(.5)
const R1 = BASE * .1
const R2 = BASE * .25

const SPEED = BASE * 5
const RSPEED = TAU*2
const TSPEED = BASE * .5
const STEP = (R2-R1)/15
const STEPV = 2
const W = BASE * .004

const FADE = 1.2
const TEXT_FADEOUT = 2

const MIN_ANGLE = 0.2
const MAX_ANGLE = PI/2

const worms = []
const targets = []




function init() {
    if (env.config.boot) {
        const bt = env.config.boot
        hold = bt.hold || hold
        fade = bt.fade || fade
        wait = bt.wait || wait
        base = bt.base || base
        content = bt.content || content
        contentLow = bt.contentLow || contentLow
        fadeBase = bt.fadeBase || fadeBase
    }
    if (env.config.fast) hold = 0
}

function evoWorm(dt) {
    let activeSegments = 0
    this.sg.forEach(segment => {
        segment.evo(dt)
        if (segment.state < DEAD) activeSegments ++
    })
    if (activeSegments === 0) {
        this.state = DEAD
    }
}

function drawWorm() {
    this.sg.forEach(segment => segment.draw())
}

let outerRingWorms = 0

/*
function showPoweredBy(s) {
    const len = rnd(BASE*.05, BASE*.2)

    const line = spawnLineSegment(s.worm,
        x, y + R1,
        x, y + R3,
        function(t) {
            const pwrd = spawnTextSegment(t.worm,
                t.x2, t.y2 + BASE * .02,
                0, POWERED_BY)
            pwrd.font = poweredByFont
            pwrd.state = STABLE
        }
    )
    line.targetTime *= 2

    const sh = BASE*.02

    const l2 = spawnLineSegment(s.worm, x-sh,  y+R1, x-sh, y + R3)
    l2.targetTime *= 3

    const l3 = spawnLineSegment(s.worm, x+sh, y+R1, x+sh, y + R3)
    l3.targetTime *= 3
}
*/

function spawnTextSegment(worm, x, y, dir, msg, delay) {
    const sg = {
        state: ACTIVE,
        time: -delay,
        x: x,
        y: y,
        dir: dir,
        msg: msg,
        delay: delay,

        evo: function(dt) {
            if (this.state === DEAD) return

            this.time += dt
            if (this.state === ACTIVE && this.time >= this.delay) this.state = DEAD
        },
        draw: function(dt) {
            if (this.state === DEAD) return

            save()
            if (this.time < 0) alpha(1 - abs(this.time)/this.delay)
            else if (this.state === STABLE) alpha(1)
            else alpha(1 - this.time/ this.delay)

            if (this.font) font(this.font)
            else font(lowFont)
            fill(content)
            baseMiddle()
            if (this.dir < 0) alignLeft()
            else if (this.dir > 0) alignRight()
            else alignCenter()

            text(this.msg, this.x, this.y)
            restore()
        },
    }

    worm.sg.push(sg)
    return sg
}

function spawnLineSegment(worm, x1, y1, x2, y2, onTarget) {
    const length = lib.math.distance(x1, y1, x2, y2)
    const targetTime = length/TSPEED

    const sg = {
        state: ACTIVE,
        time: 0,
        worm: worm,
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        length: length,
        targetTime: targetTime,
        onTarget: onTarget,

        evo: function(dt) {
            this.time += dt
            if (this.state === ACTIVE && this.time >= this.targetTime) {
                this.time = 0
                this.state = FADING
                if (this.onTarget) this.onTarget(this)
            }
            if (this.state === FADING && this.time >= FADE) {
                this.state = DEAD
            }
        },

        draw: function() {
            if (this.state === DEAD) return

            save()
            if (this.state === FADING) {
                alpha(1 - this.time/FADE)
            }

            const a = lib.math.targetAngle(this.x1, this.y1, this.x2, this.y2)

            let l = this.length
            if (this.state === ACTIVE) l = this.time/this.targetTime * this.length

            lineWidth(W)
            stroke(content)
            line(this.x1, this.y1, this.x1 + sin(a)*l, this.y1 + cos(a)*l)

            restore()
        },
    }
    worm.sg.push(sg)
    return sg
}

function spawnSegment(worm, type, orbit, angle, target) {
    let dir = DIR
    if (dir === 0) dir = ~~(Math.random() * 2 + 1) - 2

    const sg = {
        state: ACTIVE,
        time: 0,
        worm: worm,
        type: type,
        orbit: orbit,
        dir: dir,
        angle: angle,
        shift: 0,
        target: target,

        onTarget: function() {
            this.state = FADING

            // spawn next segment
            switch(this.type) {
            case RING:
                if (this.orbit >= R2) {
                    // end of the ring
                    outerRingWorms ++
                    /*
                    if (outerRingWorms === 1) {
                        showPoweredBy(this)
                        return 
                    }
                    */

                    //targets.push('/hero-' + outerRingWorms + '.png')

                    if (targets.length > 0) {
                        const label = targets.pop()
                        const a = this.angle
                        const len = this.orbit + rnd(BASE*.1, BASE*.2)

                        spawnLineSegment(this.worm,
                            x + cos(a) * this.orbit,
                            y + sin(a) * this.orbit,
                            x + cos(a) * len,
                            y + sin(a) * len,
                            function(t) {
                                let len = rnd(rx(.05), rx(.4)-R2)
                                if (t.x1 > t.x2) len *= -1

                                spawnLineSegment(t.worm,
                                    t.x2, t.y2,
                                    t.x2 + len, t.y2,
                                    function(t) {
                                        let dir = 0
                                        let sx = 0
                                        if (len < 0) {
                                            dir = 1
                                            sx -= BASE*.01
                                        } else {
                                            dir = -1
                                            sx += BASE*.01
                                        }
                                        const sg = spawnTextSegment(t.worm,
                                            t.x2 + sx, t.y2, dir, label, TEXT_FADEOUT)
                                    })
                            }
                        )
                    }
                    return
                }

                if (this.dir < 0) {
                    spawnSegment(this.worm, CONNECTOR, this.orbit,
                        this.angle - this.shift, STEP * RND(1, STEPV))
                } else {
                    spawnSegment(this.worm, CONNECTOR, this.orbit,
                        this.angle + this.shift, STEP * RND(1, STEPV))
                }
                break;

            case CONNECTOR:
                spawnSegment(this.worm, RING, this.orbit + this.target, this.angle,
                        rnd(MIN_ANGLE, MAX_ANGLE))
                break;
            }

            this.target = 1
        },

        evo: function(dt) {
            if (this.state === DEAD) return

            this.time += dt
            if (this.state === FADING) {
                this.target -= dt/FADE
                if (this.target <= 0) this.state = DEAD
                return
            }

            switch (this.type) {
            case RING: this.shift += RSPEED * dt; break;
            case CONNECTOR: this.shift += SPEED * dt; break;
            case LABEL:
                if (!this.state === STABLE && this.time > this.target) this.state = DEAD
                break;
            }

            if (this.shift >= this.target) {
                this.shift = this.target
                this.onTarget()
            }
        },

        draw: function() {
            if (this.state === DEAD) return

            save()
            if (this.state === FADING) {
                alpha(this.target)
            }

            lineWidth(W)
            stroke(content)

            switch(this.type) {
            case RING:
                if (this.dir < 0) {
                    arc(x, y, this.orbit, this.angle-this.shift, this.angle)
                } else {
                    arc(x, y, this.orbit, this.angle, this.angle + this.shift)
                }
                break;

            case CONNECTOR:
                line(
                    x + cos(this.angle) * this.orbit,
                    y + sin(this.angle) * this.orbit,
                    x + cos(this.angle) * (this.orbit + this.shift),
                    y + sin(this.angle) * (this.orbit + this.shift)
                )
                break;

            case LABEL:
                if (this.state === STABLE) {
                    alpha(max(this.time/FADE, 1))
                } else {
                    let a = this.time/this.target
                    if (a < .5) a *= 2
                    else a = min(1 - (a-0.5)*2, 0)
                    alpha(a)
                }

                if (this.font) font(this.font)
                else font(lowFont)
                fill(content)
                baseMiddle()
                if (this.dir < 0) alignLeft()
                else if (this.dir > 0) alignRight()
                else alignCenter()

                text(this.label, this.orbit, this.angle)
                break;
            }
            restore()
        },
    }
    worm.sg.push(sg)
    return sg
}

function spawnWorm() {
    // find a fossil
    let worm = false
    worms.forEach(w => {
        if (w.state === DEAD) worm = w
    })

    if (!worm) {
        worm = {
            evo: evoWorm,
            draw: drawWorm,
        }
        worms.push(worm)
    }

    augment(worm, {
        state: ACTIVE,
        sg: [],
    })

    spawnSegment(worm, RING, R1, 1, 2)
    return worm
}

let spawnedPoweredBy = false
function evoContent(dt) {
    if (state !== 'loading' && state !== 'holding') return

    worms.forEach(w => {
        if (w.state < DEAD) w.evo(dt)
    })

    // spawn
    if (rnd() < FQ * dt) {
        spawnWorm()
    }
    

    // spawn powered by
    if (!spawnedPoweredBy && time > power) {
        const w = spawnWorm()
        spawnTextSegment(w, rx(.5), ry(.9), 0, POWERED_BY)
        spawnedPoweredBy = true
    }

    //loading += dt/10
}

function drawContent() {
    background(base)

    x = rx(.5)
    y = ry(.5)

    ctx.lineCap = 'round'
    worms.forEach(w => {
        if (w.state < DEAD) w.draw()
    })

    font(labelFont)
    fill(content)
    alignCenter()
    baseMiddle()
    text(label, x, y)
}


// ************************
// generic bootloader logic

function updateLoadingStatus() {
    let loaded = this._.___.res._loaded
    let included = this._.___.res._included

    let amount = 1
    if (state === 'loading' || state === 'holding') {
        // we are faking percentage to include time left to hold
        if (hold === 0) amount = min(loaded/included, 1)
        else {
            const holdRate = min(time/hold, 1)
            amount = min((loaded/included + holdRate)/2, 1)
        }
    }

    const percent = Math.floor(amount * 100)
    label = `${percent}%`

    if (res._errors) {
        label = ERROR
        content = contentErr
    }
}

function evoBoot(dt) {
    time += dt

    switch (state) {
    case 'loading':
        if (env._started) {
            state = 'holding'
        }
        break;

    case 'holding':
        if (time >= hold) {
            time = 0
            state = 'fading'
        }
        break;

    case 'fading':
        if (time >= fade) {
            time = 0
            state = 'waiting'
        }
        break;

    case 'waiting':
        if (time >= wait) {
            state = 'self-destruct'
        }
        break;

    case 'self-destruct':
        kill(this)
        break;
    }
}

function evo(dt) {
    this.evoBoot(dt)
    //if (!this.canvasFixed) return
    this.evoContent(dt)
}

function draw() {
    if (state === 'waiting' || state === 'self-destruct') {
        background(fadeBase)
        return
    }

    background(base)
    //if (!this.canvasFixed) return

    ctx.save()

    this.updateLoadingStatus()

    drawContent()

    if (state === 'fading') {
        ctx.globalAlpha = time/fade
        background(fadeBase)
    }

    ctx.restore()
}
