class Project {
  constructor(name) {
    /* reference data for easier access */
    this.data = Project.data[name]

    /* Create HTML */
    const heading =     Create("h1",  {c: "page-heading--project", t: this.data.title})
    const description = Create("p",   {c: "project--description", t: this.data.description})
    const bannerImage = Create("img", {c: "project--banner--image", a: `src=../projects/${name}/banner.jpg`})
    const content =     Create("div", {c: "section \f project--section--content"})

    autoShy(description)
    description.innerText = addNBSPToString(description.innerText)

    /** What the shortened property names mean */
    const tagLexicon = {
      t: "type",
      h: "text",
      f: "filename OR filename[]",
      l: "label",
    }

    /* Create HTML Content (the remaining project data that's very variable) */
    for(let object of this.data.content) {

      /* elements which might not be used always */

      const container =   Create("div", {c: "project--block-container"})
      const label =       Create("div", {c: "project--image--label", t: object.l})
      const labelBorder = Create("div", {c: "project--image--label--border"})

      label.append(labelBorder)



      if(object.t === "heading") {
        const h = Create("h3", {c: "project--sub-heading", t: object.h})
        container.append(h)
      } else
      
      if(object.t === "image") {
        const i = Create("img", {c: "project--image--single", a: `src=../projects/${name}/${object.f}`})
        container.append(i)

        /* add label */
        if(object.l) container.append(label)

      } else
      
      if(object.t === "image_2") {
        const dir =   object.d ?? "row"
        const flex =  Create("div",   {c: `project--image--flex \f ${dir}`})
        const i =     Create("img",   {c: "project--image--one-of-two", a: `src=../projects/${name}/${object.f[0]}`})
        const i_2 =   Create("img",   {c: "project--image--one-of-two", a: `src=../projects/${name}/${object.f[1]}`})

        flex.append(i, i_2)
        container.append(flex)

        /* add label */
        if(object.l) container.append(label)

        if(object.o?.gap) flex.style.gap = object.o?.gap

      } else
      
      if(object.t === "image_3") {
        const dir =   object.d ?? "row"
        const flex =  Create("div",   {c: `project--image--flex \f ${dir}`})
        for(let filename of object.f) {
          const i = Create("img",   {c: "project--image--one-of-three", a: `src=../projects/${name}/${filename}`})
          flex.append(i)
        }

        container.append(flex)

        /* add label */
        if(object.l) container.append(label)

        if(object.o?.gap) flex.style.gap = object.o?.gap

      } else

      if(object.t === "image_grid_2") {

        const images = []
        for(let src of object.f) {
          images.push(Create("img", {c: "project--image--for-grid", a: `src=../projects/${name}/${src}`}))
        }

        const grid = Create("div", {c: "project--image--grid"})
        grid.append(...images)
        container.append(grid)

        /* add label */
        if(object.l) container.append(label)

        if(object.o?.gap) grid.style.gap = object.o?.gap

      } else

      if(object.t === "paragraph") {
        const para = Create("div", {c: "project--description", t: object.h})
        autoShy(para)
        container.append(para)
      }

      /* THIS HAPPENS FOR EVERY BLOCK */
      content.append(container)
    }

    this.elements = {
      heading,
      description,
      bannerImage,
      content,
    }

    Project.loadedProjects.set(name, this)
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



  static open(name) {
    if(Project.current) {
      Project.close()
    }

    if(!this.loadedProjects.get(name)) {
      new Project(name)
    }

    const project = this.loadedProjects.get(name)

    Q(".project--banner").append(project.elements.bannerImage)
    Q(".project--section--intro").append(project.elements.heading, project.elements.description, project.elements.content)

    Project.current = project

    Page.set("project")
  }


  
  static close() {
    for(const key in Project.current.elements) {
      Project.current.elements[key].remove()
    }
    Project.current = false
  }



  /** @type Map<string, Project> */
  static loadedProjects = new Map()

  static data = {



    "adria_gold": {
      featured: true,
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
      titleShort: "Karima – Kosmetika",
      title: "Karima - Přírodní Kosmetika",
      description: "Design obalů pro sadu přírodní kosmetiky se solí z Mrtvého moře.",
      content: [
        {
          t: "image",
          l: "",
          f: "renders.jpg"
        }
      ],
    },



    "kralovske_marmelady": {
      featured: true,
      titleShort: "Královské Marmelády",
      title: "Královské Marmelády",
      description: "",
      content: [
        {
          t: "image",
          l: "",
          f: "citron_a.jpg"
        },
        {
          t: "image",
          l: "",
          f: "citron_b.jpg"
        },
        {
          t: "image",
          l: "",
          f: "pomeranc_b.jpg"
        },
        {
          t: "image",
          l: "",
          f: "pomeranc_b.jpg"
        },
        {
          t: "image_grid_2",
          l: "Návrhy ilustrací ve dvou různých stylech.",
          f: ["ilu_1.png", "ilu_2.png", "ilu_3.png", "ilu_4.png"]
        },
      ],
    },



    "vest": {
      featured: false,
      titleShort: "Vest - Tyčinky",
      title: "Vest - Slané tyčinky a krekry",
      description: "",
      content: [
        
      ],
    },



    "agro_jesenice": {
      featured: false,
      titleShort: "",
      title: "Agro Jesenice",
      description: "",
      content: [
        
      ],
    },



    "henna": {
      featured: false,
      titleShort: "",
      title: "Henna - Kosmetika",
      description: "",
      content: [
        
      ],
    },



    "kovacs": {
      featured: false,
      titleShort: "Kovacs – Vinařství",
      title: "Kovacs – Vinařství",
      description: "Pro Kovacse jsme dělali redesign loga, návrhy etiket, polepy vinárny, propagační materiály.",
      content: [
        
      ],
    },



    "corston_and_william": {
      featured: true,
      titleShort: "",
      title: "Design Whisky",
      description: "Projekt vznikl pouze jako návrh, který se nerealizoval.",
      content: [
        {
          t: "image_2",
          d: "column",
          o: {gap: "0px"},
          l: "Varianta A - s velkou ilustrací.",
          f: ["intro_1.jpg", "intro_1_tubus.jpg"]
        },
        {
          t: "image_2",
          d: "column",
          o: {gap: "0px"},
          l: "Varianta B – s malými ilustracemi.",
          f: ["intro_2.jpg", "intro_2_tubus.jpg"]
        },
        {
          t: "heading",
          h: "Ilustrace"
        },
        {
          t: "image",
          d: "column",
          l: "Hlavní motiv primárního návrhu. Abstrakce z dřeva, uhlí a kouře, evokuje výrobu whisky a je barevně výrazným motivem který na etiketu přitahuje hodně pozornosti",
          f: "ilu_big_2.png"
        },
        {
          t: "image",
          d: "column",
          l: "Tato verze byla použitá na tubus, je méně výrazná ale barevně harmonizuje s etiketou whisky a neodhaluje celou ilustraci hned na začátku.",
          f: "ilu_big.png"
        },
        {
          t: "image_grid_2",
          l: "Různé ilustrace dřeva.",
          f: ["ilu_wood_1.png", "ilu_wood_2.png", "ilu_wood_3.png", "ilu_wood_4.png"]
        },
        {
          t: "image_3",
          d: "column",
          l: "Další ilustrace, které se nakonec na etiketu nepoužily.",
          f: ["ilu_wood_wonky_1.png", "ilu_wood_wonky_2.png", "ilu_wood_wonky_3.png"]
        },
      ],
    },
  }
}






class ProjectCard {
  constructor(name) {

    /* Set properties */

    this.name = name
    this.project = Project.data[name]


    
    /* Create HTML */

    const card =        Create("div",    {c: "project-card"})
    const image =       Create("img",    {a: `src=projects/${name}/project_card.png \f draggable=false`})
    const title =       Create("h2",     {t: this.project.titleShort || this.project.title})
    const text =        Create("div",    {c: "project-card--text"})
    const desc =        Create("div",    {t: this.project.descriptionShort || this.project.description, c: "project-card--description"})

    const button =      Create("button", {c: "button \f dark \f dark-0 \f project-card--button", t: "Prohlédnout"})
    const buttonArrow = Create("div",    {c: "button-arrow"})

    const borderLeft =  Create("div",    {c: "project-card--border-left"})
    const borderRight = Create("div",    {c: "project-card--border-right"})
    const borderTop =   Create("div",    {c: "project-card--border-top"})

    card.append(image, borderLeft, borderRight, borderTop, text)
    text.append(title, desc, button)
    button.append(buttonArrow)



    /* Interactability */

    card.onclick = () => {
      Project.open(name)
    }

    // document.addEventListener("scroll", () => {
    //   let y = card.getBoundingClientRect().y
    //   let h = card.getBoundingClientRect().height
    //   if(y + h < 180 || y > window.innerHeight - 180) {
    //     card.style.filter = "opacity(0.25)"
    //   }
    //   else {
    //     card.style.filter = ""
    //   }
    // })


    autoShy(desc)
    ProjectCard.placeCard(card)
  }
  static nextColumn = 1
  static placeCard(card) {
    Q(`.works--column-${ProjectCard.nextColumn}`).append(card)
    this.nextColumn = this.nextColumn === 1 ? 2 : 1 
  }
}