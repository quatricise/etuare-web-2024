class Services {
  static list = {
    "Obalový design": {
      key: "obalovy_design",
      description: `
      • Grafické návrhy obalů
      • Redesign stávajících obalů
      • Návrhy krabiček a prodejních kartonů
      • Přípravu tiskových podkladů pro výrobu
      • 3D vizualizace či produktové fotografie vašich výrobků
      `,
      examples: [
        {src: "../images/carousel/3d_1.jpg", projectName: "kralovske_marmelady"},
        {src: "../images/carousel/3d_2.jpg", projectName: "karima"},
        {src: "../images/carousel/3d_3.jpg", projectName: "henna"},
        {src: "../images/carousel/3d_4.jpg", projectName: "agro_jesenice"},
        {src: "../images/carousel/3d_5.jpg", projectName: "vest"},
      ]
    },
    "Grafický design": {
      key: "graficky_design",
      description: `
      • logo či jeho redesign
      • firemní identita
      • grafický logomanuál
      • firemní tiskoviny - nabídkové listy, katalogy, vizitky atd.
      • inzeráty pro tištěná média, 
      • bannery pro internet, billboardy, plakáty...
      `,
      examples: [
        {src: "../images/carousel/graf_1.jpg", projectName: "adria_gold", brightenOnHover: false},
        {src: "../images/carousel/graf_2.jpg", projectName: "napacider", brightenOnHover: false},
      ]
    },
    "Logo design": {
      key: "logo_design",
      description: `
      • Navrhneme vám nové logo
      • Zmodernizujeme vaše staré logo
      • Vytvoříme varianty loga pro nové produkty
      `,
      examples: [
        {src: "../images/carousel/logo_1.png", projectName: "adria_gold", brightenOnHover: false},
        {src: "../images/carousel/logo_2.jpg", projectName: "adria_gold", brightenOnHover: false},
        {src: "../images/carousel/logo_3.jpg", projectName: "adria_gold", brightenOnHover: false},
        {src: "../images/carousel/logo_4.jpg", projectName: "adria_gold", brightenOnHover: false},
      ]
    },
    "Produkce": {
      key: "produkce",
      description: `
      Dokážeme pro vás zajistit kompletní produkci, rychle a spolehlivě dodáme všechny navržené materiály.
      
      • tiskoviny - katalogy, vizitky, plakáty
      • roll-upy, ochutnávkové stolky, displeje, polepy
      • fotografie vašich výrobků či firmy
      • polepy firemních vozidel, prodejen
      • navigační prvky - směrovky, cedule...
      `,
      examples: [
        {src: "../images/carousel/prod_1.jpg", projectName: "adria_gold", brightenOnHover: false},
        {src: "../images/carousel/prod_3.jpg", projectName: "$out", url: "https://inzlin.info", brightenOnHover: false},
      ]
    },
    "Digitální design": {
      key: "digitalni_design",
      description: `
      • navrhneme design a prototyp webu
      • pomůžeme vám navrhnout obsahovou strukturu
      • vytvoříme obsah pro internetovou reklamní kampaň
      • navrhneme a naprogramujeme prezentační weby
      • zařídíme SEO optimalizaci
      `,
      examples: [
        {src: "images/carousel/digi_3.jpg", projectName: "napacider"},
      ]
    },
    "3D vizualizace": {
      key: "3d_vizualizace",
      description: `
      Vytvoříme vizualizace:
      • do katalogů, 
      • pro web,
      • na polepy aut atd. \n
      Váš produkt ještě nemusí být ve výrobě a může se stát, že potřebujete vizualizace do katalogů. Vytvoříme vám model obalu na jakýkoli produkt, a nebo vám pomůžeme vytvořit lepší vizualizace, pokud modely svých produktů už máte.
      `,
      examples: [
        {src: "images/carousel/3d_6.jpg", projectName: ""},
        {src: "images/carousel/3d_1.jpg", projectName: "kralovske_marmelady"},
        {src: "images/carousel/3d_2.jpg", projectName: "karima"},
        {src: "images/carousel/3d_3.jpg", projectName: "henna"},
        {src: "images/carousel/3d_4.jpg", projectName: "agro_jesenice"},
        {src: "images/carousel/3d_5.jpg", projectName: "vest"},
      ]
    },
    "Ilustrace": {
      key: "ilustrace",
      description: `
      • vytvoříme vám originální ilustrace pro váš projekt
      • navrhneme ilustrovaný plakát
      • digitální ilustrace v různých stylech (lineart, airbrush, vektor...)
      • akvarel, tužka, perokresba či pastelová ilustrace
      `,
      examples: [
        {src: "images/carousel/ilu_1.jpg", projectName: "corston_and_william"},
        {src: "images/carousel/ilu_2.jpg", projectName: "brela"},
        {src: "images/carousel/ilu_3.jpg", projectName: ""},
      ]
    },
  }
}

class ServiceCard {
  constructor(/** @type string */ serviceName) {
    this.data = Services.list[serviceName]
    
    this.title = serviceName
    this.description = this.data.description ?? "MISSING!"



    /* Create HTML */

    const container =         Create("div", {c: "service-card"})
    const carouselContainer = Create("div", {c: "service-card--carousel-container"})

    const textContainer =     Create("div", {c: "service-card--text-container"})
    const title =             Create("h2",  {c: "service-card--title",              t: this.title})
    const description =       Create("p",   {c: "service-card--description",        t: this.description})
    const backgroundImg =     Create("img", {c: "service-card--background-image-v2", a:`src=../images/services_icons/${this.data.key}.png`})

    const borderTop =         Create("div", {c: "service-card--border-top"})
    const borderRight =       Create("div", {c: "service-card--border-right"})
    const borderLeft =        Create("div", {c: "service-card--border-left"})



    /* append */

    container.append(carouselContainer, textContainer, backgroundImg, borderRight, borderLeft, borderTop)
    textContainer.append(title, description)


    autoShy(description)
    addNBSP(description, false)


    /** @type Map<string, HTMLElement> */

    this.elements = new Map()
    this.elements.set("container", container)
    this.elements.set("carouselContainer", carouselContainer)
    this.elements.set("textContainer", textContainer)
    this.elements.set("borderRight", borderRight)
    this.elements.set("borderLeft", borderLeft)
    this.elements.set("borderTop", borderTop)



    Q(".services--section--cards").append(container)
    this.carousel = new Carousel(Services.list[serviceName].examples, carouselContainer)

    ServiceCard.list.set(serviceName, this)
  }

  /** @type Map<string, ServiceCard> */
  static list = new Map()

  static navigateToCard(name) {
    Page.set("services")
    const card = this.list.get(name)
    card.elements.get("container").scrollIntoView({block: "center", behavior: "smooth"})
  }
}
