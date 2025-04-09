let debug = false

const state = {
  mobile: window.innerWidth <= 720,
  navlinksOpen: false
}
state.navlinksOpen = !state.mobile

const ls = localStorage

/** @type Lightbox */
let lightbox

const addNBSPToString = (str) => str.replace(
  / ([a-zA-Z]) /g,
  ' $1' + '\u00A0'
);

/** Adds &nbsp; elements to element. ONLY use after autoShy(), not the other way around. It's still broken as it does not respect HTML entities. */
function autoNBSP(element) {
  element.innerHTML = addNBSPToString(element.innerHTML).replace("\n", "<br>")
}



/** Adds shy hyphens to text. Rudimentary but works in most simple cases. Does not respect HTML entities. */
function autoShy(/** @type HTMLElement */ element) {
  let words = element.innerHTML.split(" ")
  words = words.map(word => {
    if(word === "<br>") {
      return "\n"
    }
    else {
      return word
    }
  })

  let results = []
  for(let word of words) {
    if(word.length <= 5) {
      results.push(word)
      continue
    }

    let halvingIndex = Math.floor(word.length / 2)

    const czechVowels = ["a", "e", "i", "o", "u", "ě", "á", "í", "é", "ý", "ó", "ů", "ú"]

    if(word.charAt(halvingIndex).includesAny(...czechVowels)) {
      halvingIndex += 1
    }
    if(word.charAt(halvingIndex).includesAny(...czechVowels)) {
      halvingIndex -= 2
    }
    if(word.charAt(halvingIndex).includesAny(...czechVowels)) {
      halvingIndex = Math.ceil(word.length / 2)
    }

    const firstHalf =     word.slice(0, halvingIndex)
    const secondHalf =    word.slice(halvingIndex)

    results.push(firstHalf + "\u00AD" + secondHalf)
  }

  results = results.map(res => {
    if(res === "\n") {
      return "<br>"
    }
    else {
      return res
    }
  })
  
  element.innerHTML = results.join(" ")
  if(element.innerHTML.slice(0, 4) === "<br>") {
    element.innerHTML = element.innerHTML.slice(4)
  }
}




window.onbeforeunload = () => {
  ls.setItem("scrollY", window.scrollY)
  ls.setItem("page",    Page.current)
  ls.setItem("project", Project.current.name)
  ls.setItem("visitedBefore", "true")
}

window.onload = () => {
  const sources = [
    "js/extensions.js",
    "js/vector2.js",
    "js/ticker.js",
    "js/utility.js",
    "js/touch_support.js",
    "js/keys.js",
    "js/mouse.js",
    "js/tooltip.js",
    "js/about.js",
    "js/services.js",
    "js/carousel.js",
    "js/lightbox.js",
    "js/animate.js",
    "js/project.js",
  ]
  const scripts = new Map()

  function loadScript(src) {
    return new Promise(async (resolve, reject) => {
        const response = await fetch(src)
        
        if(!response.ok) {
          reject(new Error(`Failed to load script ${src}`))
        } 
        
        else {
          const data = await response.text()
          const script = document.createElement('script')
          script.textContent = data
          scripts.set(src, script)
          resolve()
        }
    })
  }

  

  /* WEBSITE INIT */

  Promise.all(sources.map(loadScript))
  .then(() => {


    sources.forEach(src => document.head.appendChild(scripts.get(src)))

    if(window.location.href.includes("etuare.com")) {
      debug = false
    }

    if(!state.mobile) {
      Tooltip.init()
    }

    Project.init()
    Ticker.start()
    Touch.init()

    if(debug) {
      Project.testDataValidity()
      Services.testDataValidity()
    }

    if(state.mobile) {
      const navlinks = Q(".navlinks")
      navlinks.classList.add("hidden")
      Qa(".show-only-on-mobile").forEach(element => element.classList.remove("hidden"))
      document.body.append(navlinks)
    }

    Qa(".navlink").forEach(navlink => navlink.onmousedown = () => {
      if(navlink.dataset.page === Page.current) return

      if(navlink.dataset.page === "home") {
        Page.applyState({page: navlink.dataset.page, scroll: "resume"})
      }
      else {
        Page.applyState({page: navlink.dataset.page})
      }
    })

    lightbox = new Lightbox(document.body)
    

    Q(".header--logo").onclick = () => Page.applyState({page: "home"})

    Qa(".auto-shy").forEach(element => autoShy(element))
    Qa(".add-nbsp").forEach(element => autoNBSP(element))

    {
      let intro = Q(".intro-text")
      let width = intro.getBoundingClientRect().width
      let scale = width / window.innerWidth
      const desiredScale = 0.70
      if(scale > desiredScale) {
        intro.style.transform = `scale(${desiredScale / scale})`
      }
    }

    addEventListeners()

    Qa(".icon--mouse-animated").forEach(element => {
      element.onclick = () => { 
        window.scrollBy({top: element.getBoundingClientRect().y + 50, behavior: 'smooth'})
      }
    })

    if(false) { //old debug, just needs big rewriting for it to work
      // Page.set(ls.getItem("page"))
      // if(Page.current === "project") {
      //   Project.open(ls.getItem("project"))
      // }
      // setTimeout(() => window.scrollTo({top: +ls.getItem("scrollY")}), 800) //this is eye-balled, im lazy adding promises to project loading
    } else
    
    if(Page.current === "home") {
      Page.setup("home")
    } 
    
    else {

    }

    const data = Page.deserializeSearchString()
    Page.applyState(data)
  })
  .catch((error) => {
    console.error(error)
  })
}






// #region EVENTS - All event handling is here for now

function addEventListeners() {

  window.addEventListener("popstate", (e) => {
    Page.applyState(history.state, true)
  })

  document.addEventListener("wheel", (e) => {
    Mouse.update(e)
  })

  document.addEventListener("scroll", (e) => {
    Qa(".icon--mouse-animated").forEach(element => {
      if(element.getBoundingClientRect().y < 180) {
        element.style.opacity = "0"
        element.style.pointerEvents = "none"
      }
      else {
        element.style.opacity = ""
        element.style.pointerEvents = ""
      }
    })

    // {
    //   const button  = Q(".project--button--go-back--container")
    //   const rect    = button.getBoundingClientRect()
    //   if(rect.y < 60) {
    //     button.style.position = "fixed"
    //   } else {
    //     button.style.position = "relative"
    //   }
    // }
    
  })

  document.addEventListener("mouseover", (e) => {
    Mouse.update(e)
  
    if(!state.mobile) {
      if(e.target.closest(".navlink, .header--logo")) {
        let rect = e.target.closest(".navlink, .header--logo").getBoundingClientRect()
        Q("header .header--border-bottom").style.left = rect.x + "px"
        Q("header .header--border-bottom").style.width = rect.width + "px"
        Q("header .header--border-bottom").style.opacity = "1.0"
        
      }
      else {
        Q("header .header--border-bottom").style.left = ""
        Q("header .header--border-bottom").style.width = ""
        Q("header .header--border-bottom").style.opacity = ""
      }
    }
  })

  document.addEventListener("click", (e) => {
    if(e.target.dataset.openlightbox === "true") {
      lightbox.openImage(e.target.src)
    }
  })

  document.addEventListener("mousedown", (e) => {
    Mouse.update(e)
    
    if(state.mobile && e.target.closest("header") === null) {
      toggleNavlinks(false)
    }
  })

  document.addEventListener("mouseup", (e) => {
    Mouse.update(e)
  })

  document.addEventListener("mousemove", (e) => {
    Mouse.update(e)
    Tooltip.updateOnMouse(e)
    Carousel.list.forEach(car => car.updateGlowOnMouse(e))
    ServiceCardSmall.list.forEach(card => card.updateGlowOnMouse(e))

  })

  document.addEventListener("keydown", (e) => {
    Keyboard.updateKeys(e)

    if(lightbox.flags.open) {
      if(e.code.isAny("ArrowLeft", "Numpad4")) {
        lightbox.prev()
      }
      if(e.code.isAny("ArrowRight", "Numpad6")) {
        lightbox.next()
      }
      if(e.code.isAny("Escape", "Enter", "NumpadEnter", "Backspace", "Delete")) {
        lightbox.close()
      }
    }
  })

  document.addEventListener("keyup", (e) => {
    Keyboard.updateKeys(e)
  })
}

//#endregion EVENTS






class Page {

  static current = "home"

  /** @returns Object */
  static deserializeSearchString() {
    const searchQuery = window.location.search.replace("?", "")
    const pairs = searchQuery.split("+")
    const state = {}
    for(let pair of pairs) {
      const [key, value] = pair.split("=")
      state[key] = value
    }
    return state
  }

  /** @returns string */
  static serializeSearchString(data) {
    let url = "?"
    for(let key in data) {
      if(!key) continue

      if(url !== "?") url += "+"
      url += key + "=" + data[key]
    }
    return url
  }

  static applyState(stateData, fromHistory = false) {
    if(!stateData) return

    if(keyInObject(stateData, "page") === false) {
      stateData.page = "home"
    }

    if(stateData.page.isAny("home", "services")) {
      stateData.scroll = "resume"
    }

    for(let key in stateData) {
      const value = stateData[key]
      
      if(!key) continue 
      
      switch(key) {
        case "project": {
          Project.open(value)
          break
        }
        case "page": {
          Page.set(stateData.page, stateData.scroll)
          break
        }
        case "scroll": {
          if(value === "resume") {
            setTimeout(() => {
              window.scrollTo({top: Page.data[stateData.page].scrollY ?? 0, behavior: "instant"})
            }, 0)
          }
          break
        }
        case "scrollY": {
          
          break
        }
        default: {
          console.warn("Invalid key in url: " + key)
        }
      }
    }

    if(!fromHistory) {
      history.pushState(stateData, "", Page.serializeSearchString(stateData))
    }
  }

  static set(/** @type string */ page) {
    if(state.mobile) {
      toggleNavlinks(false)
    }

    console.log(page)

    Page.data[Page.current].scrollY = window.scrollY

    Qa(".page").forEach(p => p.classList.add("hidden"))
    Q(`.page--${page}`).classList.remove("hidden")


    window.scrollTo({top: 0, behavior: "instant"})
  
    if(debug) {
      console.log("New page's previous scrollY position: ", Page.data[page].scrollY)
    }

    if(Page.data[page].ready === false) {
      Page.setup(page)
    }

    Page.current = page
  }

  /** This sets up a page for working. pageSet() then only switches between them */
  static setup(page) {

    switch(page) {
      case "home": {
        for(let key in Services.list) {
          new ServiceCardSmall(key)
        }
  
        new ProjectCard("adria_gold")
        new ProjectCard("kovacs")
        new ProjectCard("agro_jesenice")
        new ProjectCard("la_food")
        break
      }

      case "services": {
        const keys = Object.keys(Services.list)
        for(let [index, key] of keys.entries()) {
          const card = new ServiceCard(key)
          
          if(index === 0) {
            setTimeout(() => card.show(), 100)
          }
        }
        break
      }

      case "about": {
        for(let key in Person.list) {
          new PersonCard(key)
        }

        break
      }
      case "project": {
        break
      }
    }

    Page.data[page].ready = true
  }
  
  static data = {
    home: {
      ready: false,
      scrollY: 0,
    },
    services: {
      ready: false,
      scrollY: 0,
    },
    about: {
      ready: false,
      scrollY: 0,
    },
    project: {
      ready: false,
      scrollY: 0,
    },
  }
}



async function showMoreProjects() {
  const max = 4
  let counter = 0

  for(let key in Project.data) {
    if(counter >= max) break
    
    if(Project.homeCardsLoaded.has(key)) {
      continue
    }
    else {
      new ProjectCard(key)
      counter++
      await wait(240)
    }
  }

  if(counter < max || Project.homeCardsLoaded.size === Object.keys(Project.data).length) { //ran out of projects
    Q(".home--section--see-more").classList.add("hidden")
  }
}



function toggleNavlinks(visible) {
  const duration = 700
  const easing = "cubic-bezier(0.7, 0.0, 0.3, 1.0)"
  const heightEst = 400
  if(visible === false || state.navlinksOpen) {
    
    new Animate(Q(".navlinks"))
    .animate( [{transform: "translateY(0px)"}, {transform: `translateY(-${heightEst}px)`}], {duration, easing} )
    .classAdd("hidden")
    .then(() => state.navlinksOpen = false)

    Qa(".navlink, .navlink--icon").forEach((navlink, index) => {
      new Animate(navlink)
      .animate([{transform: `translateY(0px)`}, {transform: `translateY(${60 + index*10}px)`}], {duration: duration * (1 + index/3), easing})
    })

  } else

  {
    Q(".navlinks").classList.remove("hidden")

    Qa(".navlink, .navlink--icon").forEach((navlink, index) => {
      new Animate(navlink)
      .animate([{transform: `translateY(-${20 + index*10}px)`}, {transform: "translateY(0px)"}], {duration: duration * (1 + index/3), easing})
    })

    new Animate(Q(".navlinks"))
    .animate( [{transform: `translateY(-${heightEst}px)`}, {transform: "translateY(0px)"}], {duration, easing} )
    .then(() => state.navlinksOpen = true)
  }
}



function scrollToContactOnDesktop() {
  if(state.mobile) return

  Q('#link--contact').scrollIntoView({behavior: 'smooth'})
}






/* PRELOAD STUFF */

for(let anim of ["icon_mouse_animated", "icon_cursor_animated"]) {
  for(let i = 0; i < 10; ++i) {
    let img = new Image()
    img.src = `../images/${anim}/${anim}000${i}.png`
    img.onload = () => {
      if(debug) console.log("loaded img")
    }
  }
}

const placeholder = new Image();
placeholder.src = "../images/placeholder.jpg"







/* VISITED BEFORE => Show visitor different projects at the front, based on the featured property of the project. */



/* syllable splitting idea unfinished */
function syllableSplit(word) {
  
  "a ne ta";
  "an té na";
  "ant mé na";
  "man dra žé";
  "kr ko no še";

  /* these are what is accepted as the core vowel sound of a syllable */
  const cores = ["a", "e", "i", "o", "u", "ě", "á", "í", "é", "ý", "ó", "ů", "ú"]
  /* these only apply if the primary core is not found */
  const cores_2nd = ["l", "r"]

  let foundConsonant = false
  let lastVowelAt = 0 //index in word
  for(let [index, char] of [word.split("").entries()]) {
    if(char.includesAny(...cores)) {
      lastVowelAt = index
    }

    if(lastVowelAt === index - 1) {}
  }

}



function testOverflowXElements(...excludedQueries) {
  let query = "*"
  if(excludedQueries.length) {
    query += `:not(${excludedQueries.join(", ")})`
  }
  Qa(`*`).forEach(element => {
    const rect = element.getBoundingClientRect()
    if(rect.right > window.innerWidth) {
      console.log(element)
    }
  })
}