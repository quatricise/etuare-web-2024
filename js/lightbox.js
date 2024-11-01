/** Simple lightbox. */
class Lightbox {
  constructor(parent = document.body) {
    
    this.parent = parent

    this.flags = {
      open: false
    }

    /** @type Array<string> */
    this.images = []

    /** @type number | Index inside .images */
    this.current = 0

    const lightbox = Create("div", {c: "lightbox \f hidden \f tooltip", d: "tooltip=Zavřít lightbox"})

    /** @type HTMLImageElement */
    const image =    Create("img", {c: "lightbox-image", d: "blocktooltip=true"})

    document.addEventListener("click", (e) => {
      if(e.target.closest(".lightbox") === this.elements.lightbox && Mouse.movedFromClick.length() < 5) {
        this.close()
      }
    })

    parent.append(lightbox)
    lightbox.append(image)

    this.elements = {
      lightbox,
      image
    }
    Lightbox.list.push(this)
  }
  open() {
    this.elements.lightbox.classList.remove("hidden")
    Q("html").style.overflowY = "hidden"
    this.flags.open = true
  }
  openImage(imageSrc, options = {}) {
    this.elements.image.src = imageSrc

    new Animate(this.elements.image)
    .animate([
      {transform: "scale(0.9)", filter: "brightness(0.2) opacity(0.0)"},
      {transform: "scale(1.0)", filter: "brightness(1.0) opacity(1.0)"},
    ], {duration: 250, easing: "cubic-bezier(0.3, 0.0, 0.2, 1.0"})

    this.current = this.images.indexOf(imageSrc)
    // console.log(this.current)

    this.open()
  }
  loadImageSet(/** @type Array<string> */sources) {
    this.images = [...sources]
  }
  close() {
    this.elements.lightbox.classList.add("hidden")
    Q("html").style.overflowY = ""
    this.flags.open = false
  }
  next() {
    if(this.current === this.images.length - 1) return

    this.current++
    this.elements.image.src = this.images[this.current]
  }
  prev() {
    if(this.current === 0) return

    this.current--
    this.elements.image.src = this.images[this.current]
  }



  /* TOUCH SUPPORT */
  touchStart() {

  }
  touchMove() {

  }
  touchCancel() {

  }
  touchEnd(/** @type string */ direction) {
    switch(direction) {
      case "left": {
        this.next()
        break
      }
      case "right": {
        this.prev()
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


  /** @type Array<Lightbox> */
  static list = []

  static getByElement(element) {
    for(let lightbox of this.list) {
      if(lightbox.elements.lightbox === element) return lightbox
    }

    return null
  }
}
