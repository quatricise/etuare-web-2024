class Tooltip {
  /** @type Boolean */
  static ready = false

  /** @type Vector2 */  
  static position = new Vector2()

  /** @type Vector2 */  
  static mouseOffset = new Vector2(20, 20)

  /** @type string */  
  static text = ""

  /** @type HTMLElement */
  static lastTrigger = null

  static elements = {
    /** @type HTMLDivElement */ container: null,
    /** @type HTMLDivElement */ text: null,
  }

  static updateOnMouse(/** @type MouseEvent */ e) {
    if(this.ready === false) return

    if(e.target.closest(".tooltip") == null || e.target.dataset.blocktooltip === "true") {
      this.hide()
      return
    }
    else if(e.target.closest(".tooltip") !== this.lastTrigger) {
      this.show()
    }

    if(e.target.closest(".tooltip") !== this.lastTrigger) {
      this.elements.text.innerText = e.target.closest(".tooltip").dataset.tooltip
    }

    this.lastTrigger = e.target.closest(".tooltip")
  }

  static updateOnFrame() {
    if(this.ready === false) return
    if(this.hidden) return

    /* position update */
    const difference = this.position.copy.sub(Mouse.position)
    .mult(0.08)
    this.position.sub(difference)

    this.elements.container.style.left = this.position.x + this.mouseOffset.x + "px"
    this.elements.container.style.top =  this.position.y + this.mouseOffset.y + "px"
  }

  static hide() {
    if(this.ready === false) return
    if(this.hidden) return

    this.elements.container.remove()
    this.lastTrigger = null

    this.elements.container.animate([
      {filter: "opacity(1)"},
      {filter: "opacity(0)"},
    ],{
      duration: 500,
      easing: "ease-out"
    })

    this.hidden = true
  }
  static show() {
    if(this.ready === false) return
    if(!this.hidden) return
    
    this.position.set_from(Mouse.position)
    document.body.append(this.elements.container)

    this.elements.container.animate([
      {backgroundColor: "var(--dark-1)",    filter: "opacity(0)", transform: "scale(0.95)"},
      {backgroundColor: "var(--c-light-0)", filter: "opacity(1)", transform: "scale(1.0)"},
    ],{
      duration: 500,
      easing: "ease-out"
    })

    this.hidden = false
  }

  static init() {
    const container = Create("div", {c: "tooltip-container"})
    const text =      Create("div", {c: "tooltip-text", t: "Missing text!"})
    container.append(text)

    this.elements.container = container
    this.elements.text = text

    this.ready = true
  }
}