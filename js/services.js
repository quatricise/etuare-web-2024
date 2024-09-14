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
        {src: "images/carousel/3d_1.jpg", projectName: "kralovske_marmelady"},
        {src: "images/carousel/3d_2.jpg", projectName: "karima"},
        {src: "images/carousel/3d_3.jpg", projectName: "henna"},
        {src: "images/carousel/3d_4.jpg", projectName: "agro_jesenice"},
        {src: "images/carousel/3d_5.jpg", projectName: "vest"},
      ]
    },
    "Grafický design": {
      description: `
      Firemní materiály
      • logo či jeho redesign
      • firemní identita
      • grafický logomanuál
      • firemní tiskoviny - nabídkové listy, katalogy, vizitky atd.
      Propagační materiály
      • inzeráty pro tištěná média, 
      • bannery pro internet, billboardy, plakáty...
      `,
      examples: [
        
      ]
    },
    "Logo design": {
      description: `
      • Zajistíme kompletní produkci
      • rychlé a spolehlivé dodání všech navržených materiálů - tiskoviny, POS (roll-upy, ochutnávkové stolky, displeje), polepy atd.
      • fotografie vašich výrobků či firmy
      • polepy firemních vozidel, prodejen aj.
      • navigační prvky - směrovky, cedule ...
      `,
      examples: [
      ]
    },
    "Produkce": {
      description: `
      • vytvoříme vám originální ilustrace pro váš projekt
      • navrhneme ilustrovaný plakát
      • digitální ilustrace v různých stylech
      • akvarel, tužka, perokresba či pastelová ilustrace
      `,
      examples: [
      ]
    },
    "Digitální design": {
      description: `
      • navrhneme prototyp
      • pomůžeme vám navrhnout obsah
      • zrealizujeme pro vás webové prezentace
      • zařídíme SEO optimalizaci
      `,
      examples: [
      ]
    },
    "3D Vizualizace": {
      description: `
      Vytvoříme 3D vizualizace produktů:
      • do katalogů, 
      • pro web, 
      • na polepy atd.
      `,
      examples: [
        {src: "images/carousel/3d_1.jpg", projectName: "kralovske_marmelady"},
        {src: "images/carousel/3d_2.jpg", projectName: "karima"},
        {src: "images/carousel/3d_3.jpg", projectName: "henna"},
        {src: "images/carousel/3d_4.jpg", projectName: "agro_jesenice"},
        {src: "images/carousel/3d_5.jpg", projectName: "vest"},
      ]
    },
    "Ilustrace": {
      description: `
      • vytvoříme vám originální ilustrace pro váš projekt
      • navrhneme ilustrovaný plakát
      • digitální ilustrace v různých stylech
      • akvarel, tužka, perokresba či pastelová ilustrace
      `,
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
    const title =             Create("h2",  {c: "service-card--title",              t: this.title})
    const description =       Create("p",   {c: "service-card--description",        t: this.description})

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
