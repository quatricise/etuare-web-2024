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
      const img = Create("img", {c: "carousel-image", a: `src=${src.src}`})

      if(src.projectName && src.projectName === "$out") {
        img.onclick = () => window.open(src.url, "_blank")
        img.classList.add("tooltip", "interactable")
        img.dataset.tooltip = "☍ Prohlédnout v novém okně"
      } else

      if(src.projectName) {
        const title = Project.data[src.projectName]?.titleShort || Project.data[src.projectName]?.title
        img.classList.add("tooltip", "interactable")
        img.dataset.tooltip = "Prohlédnout projekt"
        img.dataset.title = title
        img.dataset.project = src.projectName
      } else {

      }

      if(src.brightenOnHover !== false) {
        img.classList.add("brighten-on-hover")
      }

      this.images.push(img)
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

    const container =                Create("div", {c: "carousel-container", s: `width=${this.width} \f height=${this.height}`})
    const arrows =                   Create("div", {c: "arrow-container"})
    const images =                   Create("div", {c: "carousel--image-container"})
    const arrowBg =                  Create("div", {c: "arrow-container--background"})
    const arrowLeft =                Create("div", {c: "button-arrow \f rotate-180", a: "title=Previous"})
    const arrowRight =               Create("div", {c: "button-arrow", a: "title=Next"})
    const bubbles =                  Create("div", {c: "carousel--bubble-container"})

    const currentSlideName =         Create("div", {c: "carousel--current-slide-name \f hidden"})
    const currentSlideNameText =     Create("div", {c: "carousel--current-slide-name--text", t: Project.data[imageSources[0].projectName]?.titleShort})
    const currentSlideBorderTop =    Create("div", {c: "carousel--current-slide-name--border--top"})
    const currentSlideBorderBottom = Create("div", {c: "carousel--current-slide-name--border--bottom"})
    
    arrowLeft.style.mixBlendMode = "difference"
    arrowRight.style.mixBlendMode = "difference"


    for(let index = 0; index < this.images.length; ++index) {
      const bubble = Create("div", {c: "carousel--bubble" + (index === 0 ? " \f active" : ""), d: `index=${index}`})
      bubble.onclick = () => {
        const direction = index - this.current
        if(direction > 0) {
          for(let i = 0; i < direction; ++i) this.slide(1)
        } else
        if(direction < 0) {
          for(let i = 0; i > direction; --i) this.slide(-1)
        }
      }
      bubbles.append(bubble)
    }



    /* append */
    
    currentSlideName.append(currentSlideNameText, currentSlideBorderTop, currentSlideBorderBottom)
    arrows.append(arrowBg, arrowLeft, bubbles, currentSlideName, arrowRight)
    container.append(images, arrows)
    this.parent.append(container)

    container.onwheel = (e) => {
      e.preventDefault()
    }
    this.images.forEach(img => images.append(img))



    /* functionality */

    arrowLeft.onclick =  () => this.slide(-1)
    arrowRight.onclick = () => this.slide(1)
    this.images.forEach(img => {
      if(!img.dataset.title) return

      img.onmouseenter = () => {
        currentSlideName.classList.remove("hidden")
        currentSlideName.getAnimations().forEach(anim => anim.cancel())

        currentSlideName.animate([
          {bottom: "-60px"},
          {bottom: "0"},
        ],{
          duration: 400,
          easing: "cubic-bezier(0.7, 0.0, 0.25, 0.9)"
        })

        currentSlideNameText.innerText = img.dataset.title
      }

      img.onmouseleave = () => {
        currentSlideName.classList.add("hidden")
      }

      img.onclick = () => Project.open(img.dataset.project)

    })



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
  slide(direction /* -1 OR 1 */) {
    if(this.busy) {
      this.queueSlide(direction)
      return
    }
    if(direction === 1)  this.next()
    if(direction === -1) this.prev()

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