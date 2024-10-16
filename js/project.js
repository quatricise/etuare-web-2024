class Project {
  constructor(name) {
    /* reference data for easier access */
    this.name = name
    this.data = Project.data[name]

    /* Create HTML */
    const heading =     Create("h1",  {c: "page-heading--project", t: this.data.title})
    const description = Create("p",   {c: "project--description", t: this.data.description})
    const bannerImage = Create("img", {c: "project--banner--image", a: `src=../projects/${name}/banner.jpg`})
    const content =     Create("div", {c: "section \f project--section--content"})

    autoShy(description)
    description.innerHTML = addNBSPToString(description.innerHTML)

    /** What the shortened property names mean */
    const tagLexicon = {
      t: "type",
      h: "text",
      d: "direction",
      f: "filename OR filename[]",
      o: "options",
      l: "label",
    }

    function replaceWithPlaceholder(img, classAdd) {
      const plc = placeholder.cloneNode(true)
      plc.classList.add(classAdd)
      img.onerror = img.replaceWith(plc)
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
        i.onerror = () => replaceWithPlaceholder(i, "project--image--single")

      } else
      
      if(object.t === "image_2") {
        const dir =   object.d ?? "row"
        const flex =  Create("div",   {c: `project--image--flex \f ${dir}`})
        for(let filename of object.f) {
          const i = Create("img",   {c: "project--image--one-of-two", a: `loading=lazy \f src=../projects/${name}/${filename}`})
          flex.append(i)
          i.onerror = () => replaceWithPlaceholder(i, "project--image--one-of-two") 
        }
        container.append(flex)

        /* add label */
        if(object.l) container.append(label)

        if(object.o?.gap) flex.style.gap = object.o?.gap

      } else

      if(object.t === "image_2_1") {
        const dir =   object.d ?? "row"
        const flex =  Create("div",   {c: `project--image--flex \f ${dir}`})
        for(let [index, filename] of object.f.entries()) {
          const i = Create("img",   {c: "project--image--one-of-two", a: `loading=lazy \f src=../projects/${name}/${filename}`})
          flex.append(i)

          if (index === 2) {
            i.classList.replace("project--image--one-of-two", "project--image--single")
          }

          i.onerror = () => replaceWithPlaceholder(i, "project--image--one-of-two") 
        }
        container.append(flex)

        /* add label */
        if(object.l) container.append(label)

        if(object.o?.gap) flex.style.gap = object.o?.gap

      } else
      
      if(object.t === "image_3") {
        const dir =   object.d ?? "row"
        const flex =  Create("div",   {c: `project--image--flex \f ${dir}`})
        for(let filename of object.f) {
          const i = Create("img",   {c: "project--image--one-of-three", a: `loading=lazy \f src=../projects/${name}/${filename}`})
          flex.append(i)

          i.onerror = () => replaceWithPlaceholder(i, "project--image--one-of-three") 
        }

        container.append(flex)

        /* add label */
        if(object.l) container.append(label)

        if(object.o?.gap) flex.style.gap = object.o?.gap

      } else

      if(object.t === "image_grid_2") {

        const images = []
        for(let src of object.f) {
          const i = Create("img", {c: "project--image--for-grid", a: `loading=lazy \f src=../projects/${name}/${src}`})
          i.onerror = () => replaceWithPlaceholder(i, "project--image--for-grid")
          images.push(i)
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
      } else

      if(object.t === "video") {
        /** @type HTMLVideoElement */
        const video = Create("video", {c: "project--video", a: `src=../projects/${name}/${object.f}`})
        video.autoplay = false
        video.controls = true
        video.loop = true
        container.style.alignItems = "center"
        container.append(video)

        /* add label */
        if(object.l) container.append(label)
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
    
    /** @type Array<string> */
    const requiredProps = [
      "title",
      "description",
      "content",
    ]
    
    /** @type Array<string> */
    const acceptedProps = [
      "titleShort",
      "descriptionShort",
      "featured",
      "brightOnHover",
    ].concat(requiredProps)

    /** @type Array<string> */
    const acceptedContentTypes = [
      "heading",
      "paragraph",
      "image",
      "image_2",
      "image_2_1",
      "image_3",
      "image_grid_2",
      "image_grid_3",
      "video",
    ]

    for(let key in this.data) {

      /* top-level */

      for(let prop of requiredProps) {
        if(this.data[key][prop] === undefined) throw `Missing property '${prop}' in datablock '${key}'`        
      }

      for(let prop in this.data[key]) {
        if(acceptedProps.find(p => p === prop) === undefined) {
          throw "Property not accepted: " + prop + " in project: " + prop
        }
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
    Project.current = null
  }



  /** @type Map<string, Project> */
  static loadedProjects = new Map()

  /** @type Project */
  static current = null

  /** @type Set<string> */
  static homeCardsLoaded = new Set()

  static data = {



    "adria_gold": {
      featured: true, brightOnHover: false,
      title: "Identita – Adria Gold",
      descriptionShort: "Vizuální identita, logo, tiskoviny...",
      description: "Pro firmu Adria Gold jsme tvořili kompletní vizuální balíček - vizuální identitu, claim, logo, obalový design, firemní tiskoviny (katalogy, vizitky, letáky...), POS a POP materiály, polepy aut atd.",
      content: [
        {
          t: "heading",
          h: "Vizuální identita"
        },
        {
          t: "image_2",
          d: "column",
          l: "Logo + claim a rozvinutí identity na vizuálním stylu",
          f: ["logo_intro.png", "logo_intro_2.jpg"],
        },
        {
          t: "image",
          l: "Variace loga na další produkty firmy.",
          f: "loga_tocena_a_trist.jpg"
        },
        {
          t: "heading",
          h: "Tiskoviny",
        },
        {
          t: "image_2",
          o: {gap: "2px"},
          l: "Manuál zmrzlináře - jak správně pracovat se zmrzlinou.",
          f: ["manual_0.jpg", "manual_1.jpg"]
        },
        {
          t: "image_2",
          o: {gap: "2px"},
          l: "Katalog točené zmrzliny pro velkoobchody a restaurace.",
          f: ["tocena_0.jpg", "tocena_1.jpg"]
        },
        {
          t: "image_2",
          o: {gap: "2px"},
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
          h: "Obalový design",
        },
        {
          t: "image",
          l: "Obaly na prémiovou řadu zmrzlin.",
          f: "obaly_0.jpg"
        },
        /* {
          t: "image",
          l: "Obaly na topping.",
          f: "topping.jpg"
        }, */
        {
          t: "heading",
          h: "POP materiály",
        },
        {
          t: "paragraph",
          h: "Materiály jsme navrhovali a zároveň zařizovali jejich produkci. Dělali jsme toho více, ale protože se to často nefotilo, je těžké ty věci teď najít a musel bych proto všechno vymodelovat a to smrdí prací. \n — Štěpán",
        },
        {
          t: "image",
          l: "Velké reklamní kornouty.",
          f: "kornouty.jpg"
        },
        {
          t: "image",
          f: "zapichovatka.jpg"
        },
        {
          t: "image_2",
          f: ["stojanek_1.jpg", "stojanek_2.jpg"]
        },
      ],
    },



    "agro_jesenice": {
      featured: false,
      titleShort: "",
      title: "Agro Jesenice",
      descriptionShort: "Obalový design",
      description: "Obaly pro mraženou řady mražených výrobků - zelenina, smoothies a směsi různého druhu.",
      content: [
        {
          t: "image",
          f: "zaklad.jpg"
        },
        {
          t: "image",
          f: "smesi_vseci_rovni.jpg"
        },
        {
          t: "image",
          f: "send_vegana.jpg"
        },
        {
          t: "image",
          f: "smooth_ass.jpg"
        },
      ],
    },



    "martenz": {
      titleShort: "Martenz",
      title: "Martenz",
      descriptionShort: "Obalový design",
      description: "Design exclusivní borůvkovice od značky Martenz. Jedná se o speciální design, tzv. Fan Edition, která byla navrhnuta společně se zákazníky/fanoušky značky.",
      content: [
        {
          t: "image",
          l: "",
          f: "lahev.jpg"
        },
        {
          t: "image_3",
          l: "Alternativní ilustrace pro etiketu, z nich se nakonec použila prostřední.",
          f: ["ilu_1.jpg", "ilu_2.jpg", "ilu_3.jpg"]
        },
      ],
    },



    "kovacs": {
      featured: true,
      titleShort: "",
      title: "Vinařství Kovacs",
      descriptionShort: "Logo redesign, etikety, tiskoviny ad.", // @todo
      description: "Pro Kovacse jsme dělali redesign loga, návrhy etiket, polepy vinárny, propagační materiály a vše co zde vidíte.", // @todo
      content: [
        {
          t: "image",
          l: "Redesign loga + návrh firemního claimu: Umění ve víně",
          f: "kovacs_logo_intro.jpg"
        },
        {
          t: "heading",
          h: "Etikety na víno"
        },
        {
          t: "image_2",
          f: ["wine_7.jpg", "wine_1.jpg"],
        },
        {
          t: "image_2",
          l: "Edice vín Family Reserve s obrazy rodiny Kovács, dedikovaná rodině majitele.", /* @todo */
          f: ["cuvee_miroslav.jpg", "cuvee_amalie.jpg"],
        },
        {
          t: "heading",
          h: "Vínovice"
        },
        {
          t: "image_2",
          f: ["vinovice_1.jpg", "vinovice_2.jpg"],
        },
        {
          t: "heading",
          h: "Kovacs & Hess"
        },
        {
          t: "image",
          f: "bottle_render_shit.jpg"
        },
        {
          t: "image",
          f: ["kovacs_and_hess_etiketa_predni_2.jpg"]
        },
        {
          t: "heading",
          h: "Ilustrace"
        },
        {
          t: "paragraph",
          h: "K vínu už je zvykem dávat na etiketu kresby krajiny, tato pochází přímo z (Zbyněk doplní, protože si nepamatuju, ale asi to bude Pálava)." //@todo
        },
        {
          t: "image_2",
          l: "Autorka - Ivana Kotásková",
          f: ["iva_ilu_1.jpg", "iva_ilu_2.jpg"]
        },

        {
          t: "heading",
          h: "Další materiály"
        },
        {
          t: "image_2",
          f: ["rollups_mockup.jpg", "sidlo_1.jpg"],
        },
        {
          t: "image_2",
          d: "column",
          l: "Profil - leták o 4 stránkách, který shrnuje filozofii firmy.",
          f: ["profil_1.jpg", "profil_2.jpg"],
        },
        {
          t: "image_2_1",
          l: "Reklamní předměty - Zařizovali jsme výrobu a dodání + design potisku.",
          f: ["vinny_listek.jpg", "reklamni_predmety.jpg", "ubrus.jpg"],
        },
      ],
    },



    "kralovske_marmelady": {
      featured: true,
      titleShort: "Královské Marmelády",
      title: "Královské Marmelády",
      descriptionShort: "Logo, obalový design, vizualizace",
      description: "Design pro malovýrobce prémiových českých marmelád. Navrhovali jsme logo a etikety pro první řadu.",
      content: [
        {
          t: "image_2",
          d: "column",
          l: "Dvě varianty návrhu pro citrónovou marmeládu.",
          f: ["citron_a.jpg", "citron_b.jpg"]
        },
        {
          t: "image_2",
          d: "column",
          l: "Dvě varianty návrhu pro pomerančovou marmeládu.",
          f: ["pomeranc_a.jpg", "pomeranc_b.jpg"]
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
      titleShort: "Vest",
      title: "Vest - Slané tyčinky a krekry",
      descriptionShort: "Obalový design",
      description: 'Každý si dnes vzpomene na klasické \"Vestky\" jak mu je koupila babička v místní sámošce a potom se vydali s kamarády za železnici chroupat tyto lahodné, slané tyčinky. Pepa vždycky řekl, že není nad takové dobré pochutnání a ukousnul přitom do tyčinky, která byla tak lahodná a křupavá, že vždycky začal slintat jako pes. Maminka z toho nebyla nadšená, když po takovém chroupání a mlaskání přišel domů a měl sváteční košili potečenou od slin a plnou drobků - musela ji vždy řádně vyprat, ale to byla tehdy jiná doba, panečku, to když ještě existovaly nějaké mravy a dívky se nehonili s chlapci po ulicích a diskotékách jako kdyby zítřku nebylo, když chlapci dostali pořádný výprask za to, že jedli moc tyčinek a když bylo na světě dobře. \n — Mark Twain, Wild Wild Vest: Pepa Chroupal a kluci od železnice.',
      content: [
        {
          t: "image",
          f: "obaly.jpg"
        }
      ],
    },



    "napacider": {
      featured: true, brightOnHover: false,
      titleShort: "Napa cider",
      title: "Napa cider - Řemeslný cider z Moravy",
      description: "Napa cider je příjemné alkoholické letní občerstvení. Osvěžující dávka ovocné chuti, nic komplikovaného.  Skvělý pro posezení ve dvou na zahradě i večírek s přáteli. \n \n Pro Napa cider jsme dělali všechno, vlastně i ten cider, do kterého se pan Zbyněk pustil ve volném čase, když zrovna neměl co na práci.",
      descriptionShort: "Vizuální identita pro řemeslný cider + reklamní kampaň a eshop.",
      content: [
        {
          t: "image_2",
          d: "column",
          l: "Tiskoviny - leták, kupon a vizitky.",
          f: ["tiskoviny.jpg", "vizitky.jpg"]
        },
        {
          t: "image",
          l: "Ikony pro eshop cideru.",
          f: "eshop_ikony.png"
        },
        {
          t: "heading", 
          h: "Facebook Kampaň"
        },
        {
          t: "paragraph", 
          h: "Facebook kampaň jsme orientovali na návštěvnost nově spuštěného eshopu. Soustředili jsme se na agregaci co nejvíce potencionálních zákazníků aby se přes FB reklamní systém vymezily parametry podle kterých dále hledat."
        },
        {
          t: "video",
          l: "Reklamní 'reels' video pro upoutání pozornosti, použití je možné na FB i Instagramu.",
          f: "video.mp4"
        },
        {
          t: "image_2",
          l: "Základní slevová kampaň pro rozjetí eshopu.",
          f: ["fb_1.jpg", "fb_2.jpg"]
        },
        {
          t: "image_2",
          l: "Alternativní, nízkorozpočtová kampaň pro viditelnost produktu.",
          f: ["fb_3.jpg", "fb_4.jpg"]
        },
        {
          t: "image_2",
          l: "Alternativní kampaň s využitím fotek.",
          f: ["fb_5.jpg", "fb_6.jpg"]
        },
      ],
    },



    "brela": {
      featured: false,
      titleShort: "",
      title: "Ilustrace pro čistící prostředek.",
      descriptionShort: "Obalový design, ilustrace",
      description: "Jednoduchý design pro jednoduchý produkt. Maminka vždycky říkávala že od Důbravy jsou přípravky nejlevnější ale také nejlepší!", /* @todo */
      content: [
        {
          t: "image_grid_2",
          l: "Originální ilustrace vytvořené pro projekt.",
          f: ["ilu_1.jpg", "ilu_2.jpg", "ilu_3.jpg", "ilu_4.jpg"]
        },
        {
          t: "image",
          f: "lahvicka.jpg"
        },
      ],
    },



    "karima": {
      titleShort: "Karima – Kosmetika",
      title: "Karima - Přírodní Kosmetika",
      descriptionShort: "Obalový design, logo",
      description: "Design obalů pro sadu přírodní kosmetiky se solí z Mrtvého moře.",
      content: [
        {
          t: "image",
          l: "",
          f: "renders.jpg"
        }
      ],
    },



    "henna": {
      featured: false,
      titleShort: "",
      title: "Henna - Kosmetika",
      descriptionShort: "Obalový design",
      description: "Henna je česká firma, vyrábí přírodní kosmetiku, sprchové gely a šampony. Dělali jsme obaly, propagační materiály a redesign loga.",
      content: [
        {
          t: "image",
          f: "damske.jpg"
        },
        {
          t: "image",
          f: "panske.jpg"
        },
        {
          t: "image",
          f: "balzam_a_gel.jpg"
        },
      ],
    },



    // "kovacs_and_hess": {
    //   featured: false,
    //   title: "Kovacs & Hess",
    //   description: "Nejvíc epický crossover od dob Marvelovského Endgame. Kdo je to Hess? Je mocnější než pan Tau. A co pan Pi - je to jeho drahá polovička? A co na to Jan Tleskač?", //@todo
    //   content: [

    //   ]
    // },



    "jarmila": {
      featured: true,
      titleShort: "Jarmila",
      title: "Jarmila - Víno",
      descriptionShort: "Obalový design, logo, polepy budov.",
      description: "Jarmila je žena Miroslava Kovácse a teď nevím jestli to víno dělá ona nebo její manžel ale každopádně Zbyněk to ví.", //@todo
      content: [
        {
          t: "image_2",
          f: ["photo_1.jpg", "ilustrace.jpg"]
        },
        {
          t: "image_2",
          f: ["domecek.jpg", "bottle_interior_photo.jpg"]
        },
      ]
    },



    "la_food": {
      featured: false,
      titleShort: "La Food",
      title: "La Food - Luštěniny, rýže",
      descriptionShort: "Obalový design",
      description: "La Food je česká firma zabývající se výrobou luštěnin, rýže atd. Dělali jsme primárně design obalů a redesign loga pro řadu Menu Gold.",
      content: [
        {
          t: "image_2",
          d: "column",
          l: "Redesign starého loga.",
          f: ["logo.jpg", "logo_redesign.jpg"],
        },
        {
          t: "image",
          f: "lusteniny.jpg",
        },
        {
          t: "image",
          f: "ryze.jpg",
        },
      ]
    },



    "corston_and_william": {
      featured: true,
      titleShort: "",
      title: "Design Whisky",
      descriptionShort: "Projekt vznikl jako návrh pro začínající českou firmu zabývající se lokální výrobou whisky.",
      description: "Projekt vznikl jako návrh pro začínající českou firmu zabývající se lokální výrobou whisky. Na projektu jsem dělal sám, v rámci školního zadání. Základem identity jsou vysoce detailní ilustrace dřeva a moderní serifové písmo. — Štěpán",
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
          t: "image_grid_2",
          l: "Další ilustrace, které se nakonec na etiketu nepoužily.",
          f: ["ilu_wood_wonky_1.png", "ilu_wood_wonky_2.png", "ilu_wood_wonky_3.png", "ilu_wood_wonky_4.png"]
        },
      ],
    },
  }
}






class ProjectCard {
  constructor(/** @type string */ name) {

    /* Set properties */

    this.name = name
    this.data = Project.data[name]


    
    /* Create HTML */

    const card =        Create("div",    {c: "project-card"})
    const image =       Create("img",    {c: "project-card--image", a: `src=projects/${name}/project_card.png \f draggable=false`})
    const title =       Create("h2",     {t: this.data.titleShort || this.data.title})
    const text =        Create("div",    {c: "project-card--text"})
    const desc =        Create("div",    {t: this.data.descriptionShort || this.data.description, c: "project-card--description"})

    const button =      Create("button", {c: "button \f no-glow \f dark \f dark-0 \f project-card--button", t: "Prohlédnout"})
    const buttonArrow = Create("div",    {c: "button-arrow"})

    const borderLeft =  Create("div",    {c: "project-card--border-left"})
    const borderRight = Create("div",    {c: "project-card--border-right"})
    const borderTop =   Create("div",    {c: "project-card--border-top"})

    card.append(image, borderLeft, borderRight, borderTop, text)
    text.append(title, desc, button)
    button.append(buttonArrow)


    if(this.data.brightOnHover !== false) {
      card.classList.add("brighten-on-hover")
    }


    /* Interactability */

    card.onclick = () => {
      Project.open(name)
    }

    // if(!state.mobile) {
    //   document.addEventListener("scroll", () => {

    //     const rect =  card.getBoundingClientRect()
        
    //     /* this shit is sorta broken but idk why, i'm adding an offset manually that I observed to be the correct offset */
    //     let top =     window.innerHeight + rect.y - rect.height + 30 /* <-- the offset */
    //     let bottom =  window.innerHeight - rect.y
  
    //     const opacityRaw = Math.min(top, bottom) / 120
    //     card.style.opacity = Math.max(opacityRaw, 0.4)
    //   })
    // }

    new Animate(card)
    .animate([
      {transform: "translateY(-8px)", filter: "opacity(0)"},
      {transform: "translateY(0px)", filter: "opacity(1)"}
    ],{
      duration: 750, 
      easing: "cubic-bezier(0.3, 0.0, 0.6, 1.0)"
    })

    autoShy(desc)
    autoNBSP(desc)
    ProjectCard.placeCard(card)
    Project.homeCardsLoaded.add(name)
  }
  
  static nextColumn = 1

  static placeCard(card) {
    Q(`.works--column-${ProjectCard.nextColumn}`).append(card)
    
    if(state.mobile) {
      //nothing
    } else {
      this.nextColumn = this.nextColumn === 1 ? 2 : 1 
    }
  }
}