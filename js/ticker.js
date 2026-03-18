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

    if(Page.current === "services") {
      this.El.Services_Top.style.top = (top/6) + "px"
      this.El.Services_Top.style.opacity = clamp(1 - top/680, 0, 1)
    } else
    if(Page.current === "about") {
      this.El.About_Top.style.top = (top/6) + "px"
      this.El.About_Top.style.opacity = clamp(1 - top/1200, 0, 1)
    }

    window.requestAnimationFrame(Ticker.tick.bind(this))
  }
  static start() {
    this.El["Services_Top"] = Q(".services--intro-image")
    this.El["About_Top"] = Q(".about--intro--image-container")
    this.tick()
  }
}