/** Simple lightbox - Only for phones probably. */
class Lightbox {
  constructor(parent = document.body, position = "fixed") {
    
    this.parent = parent
    this.position = position

    const lightbox = Create("div", {c: "lightbox", s: `position=${position}`})

    document.addEventListener("click", (e) => {
      if(e.target.closest(".lightbox") === this.elements.lightbox) {
        this.close()
      }
    })
    parent.append(lightbox)

    this.elements = {
      lightbox
    }

  }
  open() {
    this.elements.lightbox.classList.remove("hidden")
  }
  openImage(imageSrc, options = {}) {
    const img = Create("img", {a: `src=${imageSrc}`})
    this.elements.lightbox.append(img)
  }
  close() {
    this.elements.lightbox.classList.add("hidden")
  }
}
