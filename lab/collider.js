/*
function testWall(obj, x, y) {
    let collision = false
    let w = obj.aw
    let h = obj.ah
    
    lab.world._ls.forEach(t => {
        if (t !== obj
                && t.solid
                && !t.either
                && (t instanceof dna.levelWall
                    || t instanceof dna.Mob
                    || t instanceof dna.mob.Master)
                // test on collision
                && x+w/2 >= t.x-t.aw/2
                && x-w/2 <= t.x+t.aw/2
                && y+h/2 >= t.y-t.ah/2
                && y-h/2 <= t.y+t.ah/2) {
            // got a hit
            collision = true
        }
    })
    return collision
}
*/

function touch(x, y) {
    let res = []
    lab.world._ls.forEach(e => {
        if (e._sizable
                && e.x+e.r >= x
                && e.x-e.r <= x
                && e.y+e.r >= y
                && e.y-e.r <= y) {
            res.push(e)
        }
    })
    return res
}

function evo (dt) {
    // go over all entities under the camera
    // and test for collisions
    let i = lab.world.mob.collide(function(s, t) {
            if (!s.dead && !t.dead && sys.isFun(s.hit)
                        && t.solid
                        && s.x+s.r >= t.x-t.r
                        && s.x-s.r <= t.x+t.r
                        && s.y+s.r >= t.y-t.r
                        && s.y-s.r <= t.y+t.r) {
                s.hit(t, dt)
            }
        }
    )
}
