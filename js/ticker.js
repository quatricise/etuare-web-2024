class Ticker {
  static dt = 0
  static lastTime = 0

  /** Object with HTML elements */
  static El = {}

  static tick() {
    /*=========*/
    const curr = Date.now()
    this.dt = (curr - this.lastTime) / 1000
    this.lastTime = curr
    /*=========*/

    Tooltip.updateOnFrame()
    
    const top = window.scrollY

    // we could easily do some dragging behavior by storing the desired value and halving our distance to it

    if(Page.current === "services") {
      this.El.Services_Top.style.top = (top/6) + "px"
      this.El.Services_Top.style.opacity = clamp(1 - top/680, 0, 1)
      this.El.Services_Top.style.scale = clamp(1 + top/6000, 1, 1.15)
    } else
    if(Page.current === "about") {
      this.El.About_Top.style.top = (top/6) + "px"
      this.El.About_Top.style.opacity = clamp(1 - top/1200, 0, 1)
      this.El.About_Top.style.scale = clamp(1 + top/8000, 1, 1.15)
    }

    window.requestAnimationFrame(Ticker.tick.bind(this))
  }
  static start() {
    this.El["Services_Top"] = Q(".services--intro-image")
    this.El["About_Top"] = Q(".about--intro--image-container")

    for(let key in this.El) {
      this.El[key].customData = {};
    }

    this.El["Services_Top"].customData.top = 0;
    this.El["Services_Top"].customData.opacity = 1;
    this.El["Services_Top"].customData.scale = 1;
    this.El["About_Top"].customData.top = 0;
    this.El["About_Top"].customData.opacity = 1;
    this.El["About_Top"].customData.scale = 1;

    this.tick()
  }
}