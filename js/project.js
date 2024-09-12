class Project {

  constructor(name) {

    /* reference data for easier access */
    this.data = Project.data[name]

    /* Create HTML */
    const heading =     Create("h1",  {c: "page-heading--project", t: this.data.title})
    const description = Create("p",   {c: "project--description", t: this.data.description})
    const bannerImage = Create("img", {c: "project--banner--image", a: `src=../projects/${name}/banner.jpg`})
    const content =     Create("div", {c: "section project--section--content"})

    /* Create HTML Content (the remaining project data that's very variable) */
    for(let object of this.data.content) {

      if(object.t === "heading") {
        const h = Create("h3", {c: "project--sub-heading", t: object.h})
        content.append(h)
      } else
      
      if(object.t === "image") {
        const i = Create("img", {c: "project--image--single", a: `src=../projects/${name}/${object.f}`})
        content.append(i)
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
      description: "Pro firmu Adria Gold jsme logo vytvořili už dvakrát, jednou drobný redesign jejich starého loga, a potom kompletní redesign. Během toho jsme produkovali obalový design, katalogy, POS a POP materiály, polepy aut atd.",
      content: [
        {
          t: "heading",
          h: "Vizuální identita"
        },
        {
          t: "image",
          d: "",
          f: "logo_intro.png"
        },
        {
          t: "image",
          d: "",
          f: "logo_intro_2.jpg"
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