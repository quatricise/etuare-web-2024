class Person {
  static list = {
    "Zbyněk Trvaj": {
      role: "employee",
      filename: "zbynek.jpg",
      description: "Grafika, obalový design, DTP, marketing",
      portfolioLink: "",
    },
    "Štěpán Trvaj": {
      role: "employee",
      filename: "stepan.jpg",
      description: "Grafika, obaly, web design, programování, ilustrace",
      portfolioLink: "https://www.quatricise.com",
    },
    "Tomáš Novosád": {
      role: "employee",
      filename: "tomas.jpg",
      description: "Fotografie, fotografická post-produkce",
      portfolioLink: "https://www.tomas-novosad.com",
    },
    "Ivana Kotásková": {
      role: "employee",
      filename: "iva.jpg",
      description: "Ilustrace, malba",
      portfolioLink: "https://www.instagram.com/ivana.kotaskova/",
    },
  }
}

class PersonCard {
  constructor(name) {
    this.title = name

    /* Map list contents onto properties of the "this" */
    for(let key of ["role", "filename", "description", "portfolioLink"]) {
      if(Person.list[name][key] === undefined) {
        throw "Missing key '" + key +  "' in person: " + name
      }
      this[key] = Person.list[name][key]
    }

    /* Create HTML */
    const container =     Create("div", {c: "person-card--container"})
    const title =         Create("div", {c: "person-card--title", t: this.title})
    const description =   Create("div", {c: "person-card--description", t: this.description})
    const image =         Create("img", {c: "person-card--image", a: `src=../images/people/${Person.list[name].filename}`})
    const borderTop =     Create("div", {c: "person-card--border-top"})
    const borderBottom =  Create("div", {c: "person-card--border-bottom"})

    const plc = placeholder.cloneNode(true)
    plc.classList.add("person-card--image")
    image.onload = () => plc.replaceWith(image)

    container.append(plc, title, description, borderTop, borderBottom)

    this.elements = {
      container,
      title,
      description,
      image,
    }

    /* INTERACTIVITY */

    if(this.portfolioLink) {
      container.onclick = () => window.open(this.portfolioLink, "_blank")
      container.classList.add("has-portfolio")
      
      container.onmouseenter = () => {
        let height = container.getBoundingClientRect().height
        container.style.height = height + "px"

        description.classList.add("is-portfolio-link")
        description.innerHTML = "<b>Portfolio</b>"
        description.append(Create("div", {c: "button-arrow"}))
        description.animate([
          {left: "-150px"},
          {left: "0px"},
        ],{
          duration: 450,
          easing: "cubic-bezier(0.6, 0.0, 0.1, 0.9)"
        })
        description.animate([
          {filter: "opacity(0)"},
          {filter: "opacity(1)"},
        ],{
          duration: 800,
          easing: "cubic-bezier(0.5, 0.0, 0.1, 1.0)"
        })
      }
      container.onmouseleave = () => {
        description.classList.remove("is-portfolio-link")
        description.innerHTML = this.description

        container.style.height = ""
      }
    }

    Q(".about--people-container--" + this.role).append(container)
  }
}