
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

	inView(x, y) {
		let sx = this.lx(x)
		let sy = this.ly(y)
		return (sx >= 0 && sx <= ctx.width && sy >= 0 && sy <= ctx.height)
	}

	pick(gx, gy) {
		let wx = this.lx(gx)
		let wy = this.ly(gy)

		let res = []
		this._ls.forEach( e => {
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

        for (let i = 0; i < this._ls.length; i++) {
            const e = this._ls[i]
			if (e.draw && !e.dead && !e.hidden
					&& e.x - e.r <= wx
					&& e.x + e.r >= wx
					&& e.y - e.r <= wy
					&& e.y + e.r >= wy) {
                return e
			}
        }
	}

    follow(dt) {
        let dx = this.target.x - this.x
        let dy = this.target.y - this.y
        if (dx < this.targetingPrecision
                && dx > -this.targetingPrecision
                && dy < this.targetingPrecision
                && dy > -this.targetingPrecision) {
            // close enough
            return
        }
        let fi = Math.atan2(dy, dx);
        this.x += Math.cos(fi) * this.speed / this.scale * dt
        this.y += Math.sin(fi) * this.speed / this.scale * dt
    }

    evoElements(ls, dt) {
        for (let i = 0; i < ls.length; i++) {
            const e = ls[i]
            if (!e.dead) e.evo(dt)
        }
    }

    evo(dt) {
        if (this.paused) return

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

        lineWidth(1)
        stroke('#505054')
        rect(0, 0, this.w, this.h)

        this.drawElements(this.mob._ls, vp)
        this.drawElements(this.fx._ls, vp)

        ctx.restore()
    }
}
