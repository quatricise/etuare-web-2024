const services = {
  "Obalový design": {
    description: `Some HTML-capable text.`,
    examples: [
      {src: "images/carousel/adria_gold.png", projectName: "adria_gold"},
      {src: "images/carousel/adria_gold.png", projectName: "adria_gold"},
      {src: "images/carousel/adria_gold.png", projectName: "adria_gold"},
      {src: "images/carousel/adria_gold.png", projectName: "adria_gold"},
    ]
  },
  "Grafický design": {

  },
  "Logo design": {

  },
  "Produkce": {

  },
  "Digitální design": {

  },
  "3D Vizualizace": {

  },
  "Ilustrace": {

  },
}

class ServiceCard {
  constructor(/** @type string */ serviceName) {
    this.title
    this.description //HTML


    /* Create HTML */
    const container =         Create("div", {c: "service-card"})
    const carouselContainer = Create("div", {c: "service-card--carousel-container"})
    const textContainer =     Create("div", {c: "service-card--text-container"})
    const borderRight =       Create("div", {c: "service-card--border-right"})

    container.append(carouselContainer, textContainer, borderRight)
    
    Q(".services--section--cards").append(container)
    
    this.carousel = new Carousel(services[serviceName].examples, carouselContainer)
  }
}
