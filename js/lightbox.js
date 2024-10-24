/** Simple lightbox - Only for phones probably. */
class Lightbox {
  constructor(parent = document.body) {
    
    this.parent = parent

    const lightbox = Create("div", {c: "lightbox \f hidden \f tooltip", d: "tooltip=Zavřít lightbox"})
    const image =    Create("img", {d: "blocktooltip=true"})

    document.addEventListener("click", (e) => {
      if(e.target.closest(".lightbox") === this.elements.lightbox) {
        this.close()
      }
    })
    parent.append(lightbox)
    lightbox.append(image)
    this.elements = {
      lightbox,
      image
    }

  }
  open() {
    this.elements.lightbox.classList.remove("hidden")
  }
  openImage(imageSrc, options = {}) {
    this.elements.image.src = imageSrc

    new Animate(this.elements.image)
    .animate([
      {transform: "scale(0.9)", filter: "brightness(0.2) opacity(0.0)"},
      {transform: "scale(1.0)", filter: "brightness(1.0) opacity(1.0)"},
    ], {duration: 250, easing: "cubic-bezier(0.3, 0.0, 0.2, 1.0"})

    this.open()
  }
  close() {
    this.elements.lightbox.classList.add("hidden")
  }
}
