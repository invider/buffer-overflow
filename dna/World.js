// optimized attach version
function attach(e) {
    let islot = -1
    for (let i = 0; i < this._ls.length; i++) {
        if (this._ls[i].dead) {
            islot = i
            break
        }
    }

    if (islot >= 0) {
        this._ls[islot] = e
    } else {
        this._ls.push(e)
    }

    if (e.name) {
        this._dir[e.name] = e
        this[e.name] = e
    }
    e.__ = this

    this.onAttached(e, e.name, this)
    if (isFun(e.init)) e.init()
}

class World extends dna.SlideCamera {

    constructor(st) {
        super(st)
    }

    init() {
        this.touch('mob')
        this.touch('fx')
        this.touch('ghost')

        // inject optimized attach
        this.mob.attach = attach
        this.fx.attach = attach
    }

    zoomIn() {
        this.zoomFactor = 1
    }

    zoomOut() {
        this.zoomFactor = -1
    }

    stopZoom() {
        this.zoomFactor = 0
    }

    bind(target) {
        if (!target || !(target instanceof dna.Bot)) return

        this.release()

        // attach controls
        lab.control.player.bind(1, target)
        lab.control.player.bind(2, target)
        lab.control.player.bind(3, target)
        this.setTarget(target)
    }

    release() {
        if (this.target) {
            lab.control.player.release(1)
            lab.control.player.release(2)
            lab.control.player.release(3)
        }

        lab.control.player.bind(1, lab.control.flow)
        lab.control.player.bind(2, lab.control.flow)
        lab.control.player.bind(3, lab.control.flow)
    }

    nextBot(prevBot, fn) {
        const ls = this.mob._ls
        let i = ls.indexOf(prevBot)

        i++
        const mark = i
        // look in the current span
        while(i < ls.length) {
            const bot = ls[i++]
            if (bot && !bot.dead && bot instanceof dna.Bot) {
                if (!fn) return bot
                if (fn(bot)) return bot
            }
        }

        // try from the start
        i = 0
        while (i < ls.length && i < mark) {
            const bot = ls[i++]
            if (bot && !bot.dead && bot instanceof dna.Bot) {
                if (!fn) return bot
                if (fn(bot)) return bot
            }
        }
    }

	lx(x) {
		return (x-ctx.width/2)/this.scale + this.x
	}

	ly(y) {
		return (y-ctx.height/2)/this.scale + this.y
	}

	gx(x) {
		return (x - this.x)*this.scale + ctx.width/2
	}

	gy(y) {
		return (y - this.y)*this.scale + ctx.height/2
	}

	getViewport = function() {
		return [
			this.lx(0),
			this.ly(0),
			this.lx(ctx.width),
			this.ly(ctx.height)
		]
	}

	inView(x, y, b) {
		let sx = this.gx(x)
		let sy = this.gy(y)
        if (!b) b = 0
		return (sx >= b && sx <= ctx.width-b && sy >= b && sy <= ctx.height-b)
	}

	pick(gx, gy) {
		let wx = this.lx(gx)
		let wy = this.ly(gy)

		let res = []
		this.mob._ls.forEach( e => {
			if (e.draw && !e.dead && !e.hidden
					&& e.x - e.r <= wx
					&& e.x + e.r >= wx
					&& e.y - e.r <= wy
					&& e.y + e.r >= wy) {
				res.push(e)
			}
		})
		return res
	}

	pickOne(gx, gy) {
		let wx = this.lx(gx)
		let wy = this.ly(gy)

        for (let i = 0; i < this.mob._ls.length; i++) {
            const e = this.mob._ls[i]
			if (e.draw && !e.dead && !e.hidden
					&& e.x - e.r <= wx
					&& e.x + e.r >= wx
					&& e.y - e.r <= wy
					&& e.y + e.r >= wy) {
                return e
			}
        }
	}

    getTarget() {
        return this.target
    }

    setTarget(target) {
        if (this.target) this.target.focus = false

        let type = 'teleport'
        if (this.target === target) type = 'selectLow'

        this.target = target
        target.focus = true

        sfx.play(type, .8)
    }

    follow(dt) {
        let dx = this.target.x - this.x
        let dy = this.target.y - this.y

        const precision = this.targetingPrecision * this.scale
        if (dx < precision && dx > -precision && dy < precision && dy > -precision) {
            this.fastForward = false
            return
        }

        let fi = Math.atan2(dy, dx);

        if (!this.inView(this.target.x, this.target.y)) {
            this.fastForward = true
        }

        let speed
        if (this.fastForward) {
            speed = this.highSpeed * this.scale
        } else {
            speed = this.speed * this.scale
        }

        this.x += Math.cos(fi) * speed / this.scale * dt
        this.y += Math.sin(fi) * speed / this.scale * dt
    }

    handleZoom(dt) {
        if (this.zoomFactor > 0) {
            this.scale *= 1 + env.tune.zoomSpeed*dt
        } else if (this.zoomFactor < 0) {
            this.scale *= 1 - env.tune.zoomSpeed*dt
        }
    }

    evoElements(ls, dt) {
        for (let i = 0; i < ls.length; i++) {
            const e = ls[i]
            if (!e.dead) e.evo(dt)
        }
    }

    evo(dt) {
        if (this.paused) return
        env.stat.time += dt
        this.handleZoom(dt)

        this.evoElements(this.ghost._ls, dt)
        this.evoElements(this.mob._ls, dt)
        this.evoElements(this.fx._ls, dt)

        if (this.target) this.follow(dt)
    }

    drawElements(ls, vp) {
        for (let i = 0; i < ls.length; i++) {
            const e = ls[i]
            if (e.draw && !e.dead && !e.hidden) {
                // culling
                if (e.x+e.r >= vp[0]
                        && e.x-e.r <= vp[2]
                        && e.y+e.r >= vp[1]
                        && e.y-e.r <= vp[3]) {
                    e.draw()
                }
            }
        }
    }

    draw() {
        ctx.save()
        let sw = ctx.width
        let sh = ctx.height
        let sw2 = sw/2
        let sh2 = sh/2
        let vp = this.getViewport()
        
        ctx.translate(sw2, sh2)
        ctx.scale(this.scale, this.scale);
        ctx.translate(-this.x, -this.y)

        // world border
        lineWidth(1)
        stroke(env.style.border)
        rect(0, 0, this.w, this.h)

        this.drawElements(this.mob._ls, vp)
        this.drawElements(this.fx._ls, vp)

        ctx.restore()
    }

    getVolume(target) {
        const d = dist(target.x, target.y, this.x, this.y)
        const vol = max(1 - d/env.tune.soundDist, 0)
        return vol
    }

    getViewVolume(target) {
        if (!this.inView(target.x, target.y)) {
            return 0
        }
        return this.getVolume(target)
    }
}
