class Touch {
  static init() {
    document.addEventListener("touchstart",   this.touchStart.bind(this),   false)
    document.addEventListener("touchend",     this.touchEnd.bind(this),     false)
    document.addEventListener("touchcancel",  this.touchCancel.bind(this),  false)
    document.addEventListener("touchmove",    this.touchMove.bind(this),    false)
    console.log("Touch initiated. 👇")
  }

  static touchStart(/** @type TouchEvent */ e) {
    if(e.touches.length > 1) return

    /* FIND IF THERE IS A TARGET */
    if(e.target.closest(".carousel-image")) {
      this.target = Carousel.getByImage(e.target.closest(".carousel-image"))
      this.active = true
    } else
    if(e.target.closest(".lightbox")) {
      this.target = Lightbox.getByElement(e.target.closest(".lightbox"))
      this.active = true
    }
    else {
      this.target = null
    }

    this.direction = null
    this.start.set(e.touches[0].pageX, e.touches[0].pageY)

    if(this.active) {
      this.target?.touchStart(e)
    }
  }
  static touchEnd(/** @type TouchEvent */ e) {
    if(!this.active) return
    if(!this.target) return

    const angle = radToDeg(this.start.angleTo(this.end))

    if(angle >= 360 - 45 || angle < 45) {
      this.target.touchEnd("right")
    } else
    if(angle >= 45 && angle < 180 - 45) {
      this.target.touchEnd("down")
    } else
    if(angle >= 180 - 45 && angle < 180 + 45) {
      this.target.touchEnd("left")
    } else
    if(angle >= 180 + 45 && angle < 360 - 45) {
      this.target.touchEnd("up")
    }
  }
  static touchCancel(/** @type TouchEvent */ e) {
    if(!this.active) return

    this.target.touchCancel()
  }
  static touchMove(/** @type TouchEvent */ e) {
    if(!this.active) return

    this.end.set(e.touches[0].pageX, e.touches[0].pageY)
    this.target?.touchMove()
  }
  static active = false

  /** @type Object - which object will handle the touch. It must support all 4 event handlers. */
  static target = null
  static direction = null
  static start = new Vector2()
  static end = new Vector2()
}