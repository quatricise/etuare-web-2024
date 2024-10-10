class Services {
  static list = {
    "Obalový design": {
      key: "obalovy_design",
      blurb: "",
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
      blurb: "",
      description: `
      • logo či jeho redesign
      • firemní identita
      • grafický logomanuál
      • firemní tiskoviny - nabídkové listy, katalogy, vizitky atd.
      • inzeráty pro tištěná média, 
      • bannery pro internet, billboardy, plakáty...
      `,
      examples: [
        {src: "../images/carousel/graf_1.jpg", projectName: "adria_gold", hasBrightBG: false, hasBrightSubject: true},
        {src: "../images/carousel/graf_2.jpg", projectName: "napacider",  hasBrightBG: true, hasBrightSubject: true},
        {src: "../images/carousel/graf_3.jpg", projectName: "kovacs",     hasBrightBG: true, hasBrightSubject: true},
      ]
    },
    "Logo design": {
      key: "logo_design",
      blurb: "",
      description: `
      • Navrhneme vám nové logo
      • Zmodernizujeme vaše staré logo
      • Vytvoříme varianty loga pro nové produkty
      `,
      examples: [
        {src: "../images/carousel/logo_1.png", projectName: "adria_gold", hasBrightBG: true, hasBrightSubject: true},
        {src: "../images/carousel/logo_2.jpg", projectName: "adria_gold", hasBrightBG: true, hasBrightSubject: true},
        {src: "../images/carousel/logo_5.jpg", projectName: "adria_gold", hasBrightBG: true, hasBrightSubject: true},
      ]
    },
    "Produkce": {
      key: "produkce",
      blurb: "",
      description: `
      Dokážeme pro vás zajistit kompletní produkci, rychle a spolehlivě dodáme všechny navržené materiály.
      
      • tiskoviny - katalogy, vizitky, plakáty
      • roll-upy, ochutnávkové stolky, displeje, polepy
      • fotografie vašich výrobků či firmy
      • polepy firemních vozidel, prodejen
      • navigační prvky - směrovky, cedule...
      `,
      examples: [
        {src: "../images/carousel/prod_3.jpg", projectName: "$out", url: "https://inzlin.info", hasBrightBG: true, hasBrightSubject: true},
        {src: "../images/carousel/prod_1.jpg", projectName: "adria_gold", tooltip: "Velké zmrzlinové kornouty před curkárnu."},
        {src: "../images/carousel/prod_5.jpg", projectName: "adria_gold"},
        {src: "../images/carousel/prod_6.jpg", projectName: "adria_gold"},
        {src: "../images/carousel/prod_7.jpg", projectName: "adria_gold", tooltip: "Stojánky na zmrzlinové kornouty do cukráren."},
        {src: "../images/carousel/prod_4.jpg", projectName: "kovacs", hasBrightBG: true },
      ]
    },
    "Digitální design": {
      key: "digitalni_design",
      blurb: "",
      description: `
      • navrhneme design a prototyp webu
      • pomůžeme vám navrhnout obsahovou strukturu
      • vytvoříme obsah pro internetovou reklamní kampaň
      • navrhneme a naprogramujeme prezentační weby
      • zařídíme SEO optimalizaci
      `,
      examples: [
        {src: "images/carousel/digi_3.jpg",    projectName: "napacider"},
        {src: "images/carousel/napacider.jpg", projectName: "$out", url: "https://napacider.cz", hasBrightBG: true, hasBrightSubject: true},
      ]
    },
    "3D vizualizace": {
      key: "3d_vizualizace",
      blurb: "",
      description: `
      Vytvoříme vizualizace:
      • do katalogů, 
      • pro web,
      • na polepy aut
      ...vlastně na cokoliv, co potřebujete
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
      key: "ilustrace",
      blurb: "",
      description: `
      • vytvoříme vám originální ilustrace pro váš projekt
      • navrhneme ilustrovaný plakát
      • digitální ilustrace v různých stylech (lineart, airbrush, vektor...)
      • akvarel, tužka, perokresba či pastelová ilustrace
      `,
      examples: [
        {src: "images/carousel/ilu_1.jpg", projectName: "corston_and_william"},
        {src: "images/carousel/ilu_2.jpg", projectName: "brela"},
        {src: "images/carousel/ilu_3.jpg", projectName: "", hasBrightBG: true, hasBrightSubject: true},
      ]
    },
  }

  static testDataValidity() {
    const validKeys = [
      "key",
      "blurb",
      "description",
      "examples",
    ]
    const requiredExampleKeys = [
      "src", "projectName"
    ]
    const allowedExampleKeys = [
      "src", "projectName", "hasBrightBG", "hasBrightSubject", "url", "tooltip"
    ]
    for(let service in Services.list) {

      for(let key in Services.list[service]) {

        if(validKeys.find(k => k == key) == undefined)  throw `Invalid key in service ${service}: ${key}.`

        for(let [exampleIndex, example] of Services.list[service].examples.entries()) {

          for(let [index, reqKey] of requiredExampleKeys.entries()) {
            if(reqKey in example != true) {
              throw `Missing required key in ${service}, example index ${index}: ${reqKey}.`
            }
          }
          const exampleKeys = Object.keys(example)
          for(let exampleKey of exampleKeys) {
            if(!allowedExampleKeys.find(k => k === exampleKey)) throw `Service ${service} contains invalid key '${exampleKey}' in examples[${exampleIndex}].`

            if(exampleKey === "hasBrightBG" && example[exampleKey] !== undefined && typeof example[exampleKey] !== "boolean") {
              throw "hasBrightBG has to be of type boolean"
            }
            if(exampleKey === "hasBrightSubject" && example[exampleKey] !== undefined && typeof example[exampleKey] !== "boolean") {
              throw "hasBrightSubject has to be of type boolean"
            }
          }
        }
      }
    }
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

    container.append(carouselContainer, textContainer, borderRight, borderLeft, borderTop)
    textContainer.append(title, description, backgroundImg)


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

class ServiceCardSmall {
  constructor(/** @type string */ serviceName) {
    this.data = Services.list[serviceName]
    this.title = serviceName
    this.description = this.data.description ?? "MISSING!"

    this.elements = {card, glow}
  }
  updateGlowOnMouse(e) {
    let x = e.clientX
    let cardLeft = this.elements.card.getBoundingClientRect().left
    let width = this.elements.glow.getBoundingClientRect().width

    this.elements.glow.style.left = x - (width/2) - cardLeft + "px"
  }
}