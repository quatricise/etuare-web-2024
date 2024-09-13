class Project {

  constructor(name) {

    /* reference data for easier access */
    this.data = Project.data[name]

    /* Create HTML */
    const heading =     Create("h1",  {c: "page-heading--project", t: this.data.title})
    const description = Create("p",   {c: "project--description", t: this.data.description})
    const bannerImage = Create("img", {c: "project--banner--image", a: `src=../projects/${name}/banner.jpg`})
    const content =     Create("div", {c: "section project--section--content"})

    autoShy(description)
    description.innerText = addNBSPToString(description.innerText)

    const tagLexicon = {
      t: "type",
      h: "text",
      f: "filename",
      l: "label",
    }

    /* Create HTML Content (the remaining project data that's very variable) */
    for(let object of this.data.content) {

      /* elements which might not be used always */

      const flex_vert =   Create("div", {c: "flex column"})
      const label =       Create("div", {c: "project--image--label", t: object.l})
      const labelBorder = Create("div", {c: "project--image--label--border"})

      label.append(labelBorder)



      if(object.t === "heading") {
        const h = Create("h3", {c: "project--sub-heading", t: object.h})
        content.append(h)
      } else
      
      if(object.t === "image") {
        const i = Create("img", {c: "project--image--single", a: `src=../projects/${name}/${object.f}`})
        if(object.l) {
          flex_vert.append(i, label)
          content.append(flex_vert)
        }
        else {
          content.append(i)
        }
      } else
      
      if(object.t === "image_2") {
        const dir = object.d ?? "row"
        const flex =  Create("div",   {c: "project--image--flex " + dir})
        const i =     Create("img",   {c: "project--image--one-of-two", a: `src=../projects/${name}/${object.f[0]}`})
        const i_2 =   Create("img",   {c: "project--image--one-of-two", a: `src=../projects/${name}/${object.f[1]}`})

        flex.append(i, i_2)

        if(object.l) {
          flex_vert.append(flex, label)
          content.append(flex_vert)
        }
        else {
          content.append(flex)
        }
      }

      if(object.t === "paragraph") {
        const para = Create("div", {c: "project--description", t: object.h})
        autoShy(para)
        content.append(para)
      }

    }

    this.elements = {
      heading,
      description,
      bannerImage,
      content,
    }
  }

  open() {
    Q(".project--banner").append(this.elements.bannerImage)
    Q(".project--section--intro").append(this.elements.heading, this.elements.description, this.elements.content)
  }
  close() {
    for(const key in this.elements) {
      this.elements[key].remove()
    }
  }


  static testDataValidity() {
    const acceptedProps = [
      "titleShort",
      "title",
      "description",
      "content",
    ]
    const acceptedContentTypes = [
      "heading",
      "paragraph",
      "image",
      "image_2",
      "image_3",
      "image_grid_2",
      "image_grid_3",
    ]

    for(let key in this.data) {

      /* top-level */

      for(let prop of acceptedProps) {
        if(this.data[key][prop] === undefined) throw `Missing property '${prop}' in datablock '${key}'`        
      }



      /* 'content' structure */

      if(Array.isArray(this.data[key].content) == false) {
        throw `In datablock ${key} 'content' property is not of type Array` 
      }

      for(let item of this.data[key].content) {
        if(item.t.isAny(...acceptedContentTypes) == false) {
          throw `In datablock ${key}, '${item.t}' property is not of the accepted types: \n '${acceptedContentTypes.join(", ")}'` 
        }
      }
    }


    console.log("Project data valid.")
  }

  static open() {
    const project = new Project()

    this.openedProjects.set(name, project)
  }

  /** @type Map<string, Project> */
  static openedProjects = new Map()

  static data = {
    "adria_gold": {
      titleShort: "Adria Gold",
      title: "Adria Gold - Firemní identita",
      descriptionShort: "Pro firmu Adria Gold jsme tvořili kompletní vizuální balíček - identita, logo, tiskoviny, POP materiály atd...",
      description: "Pro firmu Adria Gold jsme tvořili kompletní vizuální balíček - vizuální identitu a logo, obalový design, firemní tiskoviny (katalogy, vizitky, letáky...), POS a POP materiály, polepy aut atd.",
      content: [
        {
          t: "heading",
          h: "Vizuální identita"
        },
        {
          t: "image_2",
          d: "column",
          l: "Nové logo + rozvinutí identity na vizuálním stylu",
          f: ["logo_intro.png", "logo_intro_2.jpg"],
        },
        {
          t: "heading",
          h: "Obalový design",
        },
        {
          t: "image",
          l: "Obaly na prémiovou řadu zmrzlin.",
          f: "obaly_0.jpg"
        },
        {
          t: "heading",
          h: "Tiskoviny",
        },
        {
          t: "image_2",
          l: "Katalog točené zmrzliny pro velkoobchody a restaurace.",
          f: ["tocena_0.jpg", "tocena_1.jpg"]
        },
        {
          t: "image_2",
          l: "Manuál zmrzlináře - jak správně pracovat se zmrzlinou.",
          f: ["manual_0.jpg", "manual_1.jpg"]
        },
        {
          t: "image_2",
          l: "Katalog nabídek pro velkoobchody a restaurace.",
          f: ["katalog_0.jpg", "katalog_1.jpg"]
        },
        {
          t: "image",
          l: "Vizitky pro pracovníky firmy.",
          f: "vizitky.jpg"
        },
        {
          t: "heading",
          h: "POP materiály",
        },
        {
          t: "paragraph",
          h: "Materiály jsme navrhovali a zároveň zařizovali jejich produkci. Dělali jsme toho více, ale protože se to nefotilo je těžké ty věci teď najít a musel bych proto všechno vyrenderovat. \n — Štěpán",
        },
        {
          t: "image",
          l: "Velké reklamní kornouty.",
          f: "kornouty.jpg"
        },
        {
          t: "image",
          l: "Mincovník.",
          f: "mincovnik.jpg"
        },
      ],
    },
    "karima": {
      titleShort: "Karima",
      title: "Karima - Kosmetika",
      description: "",
      content: [],
    },
  }
}



class ProjectCard {
  constructor(name) {

    /* Set properties */

    this.name = name
    this.project = Project.data[name]


    
    /* Create HTML */

    const card =        Create("div", {c: "project-card"})
    const image =       Create("img", {a: `src=projects/${name}/project_card.png draggable=false`})
    const title =       Create("h2", {t: this.project.titleShort || this.project.title})
    const text =        Create("div", {c: "project-card--text"})
    const desc =        Create("div", {t: this.project.descriptionShort || this.project.description, c: "project-card--description"})

    const button =      Create("button", {c: "button dark dark-1 project-card--button", t: "Prohlédnout"})
    const buttonArrow = Create("div", {c: "button-arrow"})

    const borderLeft =  Create("div", {c: "project-card--border-left"})
    const borderRight = Create("div", {c: "project-card--border-right"})
    const borderTop =   Create("div", {c: "project-card--border-top"})

    card.append(image, borderLeft, borderRight, borderTop, text)
    text.append(title, desc, button)
    button.append(buttonArrow)

    autoShy(desc)
    ProjectCard.placeCard(card)
  }
  static nextColumn = 1
  static placeCard(card) {
    Q(`.works--column-${ProjectCard.nextColumn}`).append(card)
    this.nextColumn = this.nextColumn === 1 ? 2 : 1 
  }
}