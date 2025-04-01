class Carousel {
  constructor(/** @type Array<string> */ imageSources, parent, options = {}) {
    /**
     * @type number
     * @description Current slide index
    */
    this.current = 0

    /* Images filled with placeholders at the start. */
    /** @type Array<HTMLImageElement> */
    this.images = imageSources.map(() => {
      const plc = placeholder.cloneNode(true)
      plc.classList.add("carousel-image")
      return plc
    })

    imageSources.forEach((src, index) => {
      const img = Create("img", {c: "carousel-image", a: `src=${src.src}`})



      /* placeholder clones are replaced with the right image when it is loaded */
      img.onload = () => {
        this.images[index].replaceWith(img)
        this.images[index] = img

        /* add functionality to the image */
        if(img.dataset.title) {
          img.onmouseenter = () => this._showSlideInfo(img)
    
          img.onmouseleave = () => this._hideSlideInfo(img)
    
          if(src.projectName != "$out" && src.projectName) {
            img.onclick = () => this._queueClick(() => Page.applyState({page: "project", project: img.dataset.project}))
          }
        }
        if(index === 0) {
          this._updateControlsColor()
        }
        if(state.mobile) {
          this._showSlideInfo()
        }
      }



      if(src.projectName && src.projectName === "$out") {
        img.onclick = () => window.open(src.url, "_blank")
        img.classList.add("tooltip", "interactable")
        img.dataset.tooltip = "☍ Prohlédnout v novém okně"
        img.dataset.title = src.tooltip ?? ""
      } else

      if(src.projectName) {
        const title = Project.data[src.projectName]?.titleShort || Project.data[src.projectName]?.title
        img.classList.add("tooltip", "interactable")
        img.dataset.tooltip = /* ${title} –  */ `Prohlédnout projekt`
        img.dataset.title = src.tooltip ?? title
        img.dataset.project = src.projectName
      } else 
      
      if(src.tooltip) {
        img.dataset.title = src.tooltip
      } else {
        
      }



      if(src.hasBrightSubject === true) {
        img.classList.add("has-bright-subject")
      }

      if(src.hasBrightBG === true) {
        img.dataset.hasBrightBG = "true"
      }
      else {
        img.classList.add("brighten-on-hover")
      }
    })

    /** @type HTMLElement */
    this.parent = parent

    /** @type string */
    this.width =  options.width ?? "100%"
    
    /** @type string */
    this.height = options.height ?? "100%"

    /** @type Array<number>  -1 means back, 1 means forward. These are the only valid values. */
    this.queuedSlides = []

    /** @type Function | null */
    this.onclick = null
    /* Create HTML */

    const container =                Create("div", {c: "carousel-container", s: `width=${this.width} \f height=${this.height}`})
    const arrows =                   Create("div", {c: "arrow-container"})
    const images =                   Create("div", {c: "carousel--image-container"})
    const arrowBg =                  Create("div", {c: "arrow-container--background"})
    const arrowLeft =                Create("div", {c: "button-arrow \f rotate-180", a: "title=Previous"})
    const arrowRight =               Create("div", {c: "button-arrow", a: "title=Next"})
    const bubbles =                  Create("div", {c: "carousel--bubble-container"})

    const currentSlideName =         Create("div", {c: "carousel--current-slide-name"})
    const currentSlideNameText =     Create("div", {c: "carousel--current-slide-name--text", t: Project.data[imageSources[0].projectName]?.titleShort})
    const currentSlideBorderTop =    Create("div", {c: "carousel--current-slide-name--border--top"})
    const currentSlideBorderBottom = Create("div", {c: "carousel--current-slide-name--border--bottom"})

    if(!state.mobile) {
      currentSlideName.classList.add("hidden")
    }
    
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
      if(!state.mobile && debug) e.preventDefault()
    }

    /* append placeholder first */
  
    this.images.forEach(img => images.append(img))

    /* functionality */

    arrowLeft.onclick =  () => this.slide(-1)
    arrowRight.onclick = () => this.slide(1)


    this.elements = {
      container,
      images,
      arrows,
      arrowBg,
      arrowLeft,
      arrowRight,
      bubbles,
      currentSlideName,
      currentSlideNameText,
    }

    Carousel.list.push(this)
  }
  _showSlideInfo() {
    const name = this.elements.currentSlideName
    const text = this.elements.currentSlideNameText

    name.classList.remove("hidden")
    text.innerText = this.images[this.current].dataset.title
    if(!state.mobile) {
      name.getAnimations().forEach(a => a.cancel())
      name.animate([
        {bottom: "-60px"},
        {bottom: "0"},
      ],{
        duration: 400,
        easing: "cubic-bezier(0.7, 0.0, 0.25, 0.9)"
      })
    }
  }
  _hideSlideInfo() {
    if(state.mobile) return //return because the info is never hidden on mobile

    const name = this.elements.currentSlideName
    const anims = name.getAnimations()
    if(anims.length) {
      anims.forEach((a, index) => {
        if(index !== anims.length - 1) a.cancel()
      })
      anims[anims.length - 1].onfinish = () => animate()
    }
    else {
      animate()
    }
    
    function animate() {
      name.animate([
        {bottom: "0"},
        {bottom: "-60px"},
      ],{
        duration: 400,
        easing: "cubic-bezier(0.7, 0.0, 0.25, 0.9)"
      }).onfinish = () => {
        name.classList.add("hidden")
      }
    }
  }
  _queueClick(fn) { //only queues one click
    if(this.busy) {
      this.onclick = fn
    }
    else {
      fn()
    }
  }
  _queueSlide(dir) {
    this.queuedSlides.push(dir)
  }
  _processQueue() {
    if(this.onclick !== null) {
      this.onclick()
      this.onclick = null
      return
    }
    if(this.queuedSlides.length === 0){
      return
    }
    this.slide(this.queuedSlides.shift())
  }
  _setAsBusy() {
    this.busy = true
    let isScrolling
    
    const unsetBusy = () => {
      window.clearTimeout(isScrolling);
      isScrolling = setTimeout(() => {
          this.busy = false
          this._processQueue()
      }, 90)
    }

    unsetBusy()

    this.elements.images.onscroll = unsetBusy
  }
  slide(direction /* -1 OR 1 */) {
    if(this.busy) {
      this._queueSlide(direction)
      return
    }
    if(direction === 1)  this._next()
      else
    if(direction === -1) this._prev()
      else 
    throw "Wrong direction."

    this._setAsBusy()
  }
  _resetQueue() {
    this.queuedSlides = []
  }
  _next() {
    if(this.current === this.images.length - 1) {
      this._resetQueue() 
      return
    }

    this.elements.images.scrollBy({left: //the images overflow a lil sometimes, i know how to fix it but im disinterested
      Math.round(this.images[0].getBoundingClientRect().width)
    , behavior: "smooth"})
    this.current++

    this._updateBubbles()

    if(state.mobile) {
      this._showSlideInfo()
    }
  }
  _prev() {
    if(this.current === 0) {
      this._resetQueue() 
      return
    }

    this.elements.images.scrollBy({left: //the images overflow a little sometimes, i know how to fix it but im disinterested to do so
      Math.round(-this.images[0].getBoundingClientRect().width)
    , behavior: "smooth"})
    this.current--

    this._updateBubbles()

    if(state.mobile) {
      this._showSlideInfo()
    }
  }
  _updateBubbles() {
    Array.from(this.elements.bubbles.children).forEach((bubble, index) => {
      if(index === this.current) {
        bubble.classList.add("active")
      }
      else {
        bubble.classList.remove("active")
      }
    })
    this._updateControlsColor()
  }
  _updateControlsColor() {
    if(this.images[this.current].dataset.hasBrightBG === "true") {
      if(!state.mobile) {
        this.elements.arrowLeft.classList.add("dark")
        this.elements.arrowRight.classList.add("dark")
        this.elements.arrowBg.classList.add("dark")
      }
      this.elements.bubbles.classList.add("dark")
    }
    else {
      if(!state.mobile) {
        this.elements.arrowLeft.classList.remove("dark")
        this.elements.arrowRight.classList.remove("dark")
        this.elements.arrowBg.classList.remove("dark")
      }
      this.elements.bubbles.classList.remove("dark")
    }
  }
  updateGlowOnMouse(e) {
    let x = e.clientX
    let containerLeft = this.elements.container.getBoundingClientRect().left
    let width = this.elements.arrowBg.getBoundingClientRect().width

    this.elements.arrowBg.style.left = x - (width/2) - containerLeft + "px"
  }
  updateGlowOnFrame() {
    
  }

  touchStart(e) {
    
  }
  touchMove() {

  }
  touchEnd(direction) {
    switch(direction) {
      case "left": {
        this.slide(1)
        break
      }
      case "right": {
        this.slide(-1)
        break
      }
      case "up": {

        break
      }
      case "down": {

        break
      }
    }
  }
  touchCancel() {

  }
  /** @returns Carousel || null */
  static getByImage(img) {
    for(let carousel of this.list) {
      if(carousel.images.find(i => i === img)) return carousel
    }

    return null
  }

  /** @type Array<Carousel> */
  static list = []
}