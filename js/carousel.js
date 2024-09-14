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
      const title = Project.data[src.projectName].titleShort || Project.data[src.projectName].title
      this.images.push(Create("img", {c: "carousel-image \f tooltip", d: `tooltip=Prohlédnout projekt \f project=${src.projectName} \f title=${title}`, a: `src=${src.src}`}))
    })

    /** @type HTMLElement */
    this.parent = parent

    /** @type string */
    this.width =  options.width ?? "100%"
    
    /** @type string */
    this.height = options.height ?? "100%"

    /** @type Array<number>  -1 means back, 1 means forward. These are the only valid values. */
    this.queuedSlides = []


    /* Create HTML */

    const container =           Create("div", {c: "carousel-container", s: `width=${this.width} \f height=${this.height}`})
    const arrows =              Create("div", {c: "arrow-container"})
    const images =              Create("div", {c: "carousel--image-container"})
    const arrowBg =             Create("div", {c: "arrow-container--background"})
    const arrowLeft =           Create("div", {c: "button-arrow \f rotate-180", a: "title=Previous"})
    const arrowRight =          Create("div", {c: "button-arrow", a: "title=Next"})
    const bubbles =             Create("div", {c: "carousel--bubble-container"})
    const currentSlideName =    Create("div", {c: "carousel--current-slide-name \f hidden", t: Project.data[imageSources[0].projectName].titleShort})
    
    for(let index = 0; index < this.images.length; ++index) {
      const bubble = Create("div", {c: "carousel--bubble" + (index === 0 ? " \f active" : ""), d: `index=${index}`})
      bubble.onclick = () => {
        this.slide(index - this.current)
      }
      bubbles.append(bubble)
    }


    /* append */
    arrows.append(arrowBg, arrowLeft, bubbles, currentSlideName, arrowRight)
    container.append(images, arrows)
    this.parent.append(container)

    container.onwheel = (e) => {
      e.preventDefault()
    }


    /* functionality */

    arrowLeft.onclick =  () => this.slide(-1)
    arrowRight.onclick = () => this.slide(1)
    this.images.forEach(img => {
      img.onmouseover = () => {
        bubbles.classList.add("hidden")
        currentSlideName.classList.remove("hidden")

        currentSlideName.innerText = img.dataset.title
      }
      img.onmouseleave = () => {
        bubbles.classList.remove("hidden")
        currentSlideName.classList.add("hidden")
      }
    })



    /* images will slide from sides, so it works on mobile */
    this.images.forEach(img => images.append(img))

    /** @type Map<string, HTMLElement> */
    this.elements = new Map()
    this.elements.set("container",  container)
    this.elements.set("images",     images)
    this.elements.set("arrows",     arrows)
    this.elements.set("arrowBg",    arrowBg)
    this.elements.set("arrowLeft",  arrowLeft)
    this.elements.set("arrowRight", arrowRight)
    this.elements.set("bubbles",    bubbles)

    Carousel.list.push(this)
  }
  queueSlide(dir) {
    this.queuedSlides.push(dir)
  }
  processQueue() {
    if(this.queuedSlides.length === 0) return

    this.slide(this.queuedSlides.shift())
  }
  setAsBusy() {
    this.busy = true
    let isScrolling = setTimeout(() => {
      this.busy = false
      this.processQueue()
    }, 80)

    this.elements.get("images").onscroll = () => {
      window.clearTimeout(isScrolling);

      isScrolling = setTimeout(() => {
          this.busy = false
          this.processQueue()
      }, 80)
    }
  }
  slide(direction) {
    if(this.busy) {
      this.queueSlide(direction)
      return
    }
    if(direction > 0) {
      for(let i = 0; i < direction; ++i) this.next()
    } else
    if(direction < 0) {
      for(let i = 0; i > direction; --i) this.prev()
    }
    this.setAsBusy()
  }
  resetQueue() {
    this.queuedSlides = []
    this.setAsBusy()
  }
  next() {
    if(this.current === this.images.length - 1) {
      this.resetQueue() 
      return
    }

    this.elements.get("images").scrollBy({left: //the images overflow a lil sometimes, i know how to fix it but im disinterested
      Math.round(this.images[0].getBoundingClientRect().width)
    , behavior: "smooth"})
    this.current++

    this.updateBubbles()
  }
  prev() {
    if(this.current === 0) {
      this.resetQueue() 
      return
    }

    this.elements.get("images").scrollBy({left: //the images overflow a lil sometimes, i know how to fix it but im disinterested
      Math.round(-this.images[0].getBoundingClientRect().width)
    , behavior: "smooth"})
    this.current--

    this.updateBubbles()
  }
  updateBubbles() {
    Array.from(this.elements.get("bubbles").children).forEach((bubble, index) => {
      if(index === this.current) {
        bubble.classList.add("active")
      }
      else {
        bubble.classList.remove("active")
      }
    })
  }
  updateGlowOnMouse(e) {
    let x = e.clientX
    let containerLeft = this.elements.get("container").getBoundingClientRect().left
    let width = this.elements.get("arrowBg").getBoundingClientRect().width

    this.elements.get("arrowBg").style.left = x - (width/2) - containerLeft + "px"
  }
  updateGlowOnFrame() {
    
  }

  dragBegin() {

  }
  dragConfirm() {

  }
  dragCancel() {

  }

  /** @type Array<Carousel> */
  static list = []
}