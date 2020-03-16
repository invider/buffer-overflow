const HIDDEN = 0
const WAIT = 1
const FADE_IN = 2
const KEEP = 3
const FADE_OUT = 4

const defaults = {
    wait: 0,
    fadein: 1,
    keep: 1,
    fadeout: 1,
    state: WAIT,
    backgroundColor: '#000000',
}

class Transition {
  state = HIDDEN;
  fader = 1;

  constructor(st) {
    augment(this, defaults)
    augment(this, st);
    // set the timer to wait
    this.time = this.wait
  }

  evo(dt) {
    if (this.state === HIDDEN) return;

    this.fader = this.fader - dt / this.time;

    if (this.fader <= 0) {
      this.fader = 1;

      switch(this.state) {
      case WAIT:
              this.state = FADE_IN;
              this.time = this.fadein;
              break;
      case FADE_IN:
              this.state = KEEP;
              this.time = this.keep;
          if (this.onKeep) this.onKeep()
              break;
      case KEEP:
              this.state = FADE_OUT;
              this.time = this.fadeout;
              if (this.onFadeout) this.onFadeout()
              break;
      case FADE_OUT:
              if (this.onHidden) this.onHidden()
              this.state = HIDDEN;
              break;
      }
    /*
      if (this.state === FADE_OUT) {
        this.state = HIDDEN;
      } else {
        this.state = this.state + 1;
      }
  */
    }
  }

  draw() {
    if (this.state === HIDDEN
        || this.state === WAIT) return;

    save()
    switch (this.state) {
      case FADE_IN:
        alpha(1 - this.fader);
        break;
      case KEEP:
        alpha(1);
        break;
      case FADE_OUT:
        alpha(this.fader);
        break;
    }

      blocky();
      if (this.backgroundImage) {
        image(this.backgroundImage, 0, 0,
            this.__.rx(1), this.__.ry(1))
    } else {
        background(this.backgroundColor)
    }
    restore()
  }
}
