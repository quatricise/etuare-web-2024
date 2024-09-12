class Services {
  static list = {
    "Obalový design": {
      description: `
      • Grafické návrhy obalů
      • Redesign stávajících obalů
      • Návrhy krabiček a prodejních kartonů
      • Přípravu tiskových podkladů pro výrobu
      • 3D vizualizace či produktové fotografie vašich výrobků
      `,
      examples: [
        {src: "images/assistant.png", projectName: "adria_gold"},
        {src: "images/assistant_2.png", projectName: "adria_gold"},
        {src: "images/assistant_3.png", projectName: "adria_gold"},
        {src: "images/assistant_4.png", projectName: "adria_gold"},
      ]
    },
    "Grafický design": {
      examples: [
      ]
    },
    "Logo design": {
      examples: [
      ]
    },
    "Produkce": {
      examples: [
      ]
    },
    "Digitální design": {
      examples: [
      ]
    },
    "3D Vizualizace": {
      examples: [
      ]
    },
    "Ilustrace": {
      examples: [
      ]
    },
  }
}

class ServiceCard {
  constructor(/** @type string */ serviceName) {
    this.title = serviceName
    this.description = Services.list[serviceName].description ?? "MISSING!"

    /* Create HTML */
    const container =         Create("div", {c: "service-card"})
    const carouselContainer = Create("div", {c: "service-card--carousel-container"})

    const textContainer =     Create("div", {c: "service-card--text-container"})
    const title =             Create("h2",  {c: "service-card--title", t: this.title})
    const description =       Create("p",   {c: "service-card--description", t: this.description})

    const borderRight =       Create("div", {c: "service-card--border-right"})
    const borderLeft =        Create("div", {c: "service-card--border-left"})

    /** @type Map<string, HTMLElement> */
    this.elements = new Map()
    this.elements.set("container", container)
    this.elements.set("carouselContainer", carouselContainer)
    this.elements.set("textContainer", textContainer)
    this.elements.set("borderRight", borderRight)
    this.elements.set("borderLeft", borderLeft)

    container.append(carouselContainer, textContainer, borderRight, borderLeft)
    textContainer.append(title, description)
    
    Q(".services--section--cards").append(container)
    
    this.carousel = new Carousel(Services.list[serviceName].examples, carouselContainer)
  }
}
