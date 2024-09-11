class Carousel {
  constructor(/** @type Array<string> */ imageSources, parent, options = {}) {
    /**
     * @type number
     * @description Current slide index
    */
    this.current = 0

    /** @type Array<HTMLImageElement> */
    this.images = []

    imageSources.forEach(src => {
      this.images.push(Create("img", {c: "carousel-image tooltip", d: "tooltip=Prohlédnout projekt", a: `src=${src.src}`}))
    })

    /** @type HTMLElement */
    this.parent = parent

    this.width =  options.width ?? "100%"
    this.height = options.height ?? "100%"

    /* Create HTML */

    const container =   Create("div", {c: "carousel-container", s: `width=${this.width} height=${this.height}`})
    const arrows =      Create("div", {c: "arrow-container"})
    const arrowBg =     Create("div", {c: "arrow-container--background"})
    const arrowLeft =   Create("div", {c: "button-arrow rotate-180"})
    const arrowRight =  Create("div", {c: "button-arrow"})
    const bubbles =     Create("div", {c: "carousel--bubble-container"})
    
    for(let i = 0; i < this.images.length; ++i) {
      bubbles.append(Create("div", {c: "carousel--bubble" + (i === 0 ? " active" : " ")}))
    }

    arrows.append(arrowBg, arrowLeft, bubbles, arrowRight)
    container.append(arrows)
    this.parent.append(container)


    /* images will slide from sides, so it works on mobile */
    
    this.images.forEach(img => container.append(img))

    /** @type Map<string, HTMLElement> */
    this.elements = new Map()
    this.elements.set("container",  container)
    this.elements.set("arrows",     arrows)
    this.elements.set("arrowBg",    arrowBg)
    this.elements.set("arrowLeft",  arrowLeft)
    this.elements.set("arrowRight", arrowRight)
    this.elements.set("bubbles",    bubbles)

    Carousel.list.push(this)
  }
  next() {
    if(this.current === this.images.length - 1) return
  }
  prev() {
    if(this.current === 0) return
  }
  updateGlowOnMouse(e) {
    let x = e.clientX
    let containerLeft = this.elements.get("container").getBoundingClientRect().left
    let width = this.elements.get("arrowBg").getBoundingClientRect().width

    this.elements.get("arrowBg").style.left = x - (width/2) - containerLeft + "px"
  }
  updateGlowOnFrame() {
    
  }

  /** @type Array<Carousel> */
  static list = []
}