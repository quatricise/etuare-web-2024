class Ticker {
  static tick() {
    Tooltip.updateOnFrame()

    window.requestAnimationFrame(Ticker.tick.bind(this))
  }
  static start() {
    this.tick()
  }
}