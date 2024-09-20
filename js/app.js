let debug = true
const ls = localStorage

const addNBSPToString = (str) => str.replace(
  / ([a-zA-Z]) /g,
  ' $1' + '\u00A0'
);

function addNBSP(element) {
  element.innerText = addNBSPToString(element.innerText)
}

function addNBSPToAll() {
  Qa(".add-nbsp").forEach(element => {
    element.innerText = addNBSPToString(element.innerText)
  })
}


const wildIndex = 0
const wildPassword = "wild"

function wildGo() {
  
}

function wildProcessKey() {

}




/** Adds shy hyphens to text. Rudimentary but works. */
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
}




window.onbeforeunload = () => {
  ls.setItem("scrollY", window.scrollY)
  ls.setItem("page",    Page.current)
  ls.setItem("project", Project.current.name)
}

window.onload = () => {
  const scripts = [
    "js/extensions.js",
    "js/vector2.js",
    "js/ticker.js",
    "js/utility.js",
    "js/keys.js",
    "js/mouse.js",
    "js/tooltip.js",
    "js/about.js",
    "js/services.js",
    "js/carousel.js",
    "js/project.js",
  ]
  function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve(src);
        script.onerror = () => reject(new Error(`Failed to load script ${src}`));
        document.head.appendChild(script);
    })
  }

  Promise.all(scripts.map(loadScript))
  .then(() => {

    /* WEBSITE INIT */

    Tooltip.init()
    Ticker.start()
    if(debug) {
      Project.testDataValidity()
    }

    Qa(".navlink").forEach(navlink => navlink.onclick = () => Page.set(navlink.dataset.page))

    Q(".header--logo").onclick = () => Page.set("home")

    Qa(".auto-shy").forEach(element => autoShy(element))

    addNBSPToAll()

    addEventListeners()

    Qa(".icon--mouse-animated").forEach(element => {
      element.onclick = () => { 
        window.scrollBy({top: element.getBoundingClientRect().y + 100, behavior: 'smooth'})
      }
    })

    if(debug) {
      Page.set(ls.getItem("page"))
      if(Page.current === "project") {
        Project.open(ls.getItem("project"))
      }
      setTimeout(() => window.scrollTo({top: +ls.getItem("scrollY")}), 1000) //this is eye-balled, im lazy adding promises to project loading
    }



    /* URL stuff */
    const searchQuery = window.location.search.replace("?", "")
    const pairs = searchQuery.split("+")
    pairs.forEach(pair => {
      const [key, value] = pair.split("=")
      
      switch(key) {
        case "project": {
          Project.open(value)
          break
        }
        case "page": {
          Page.set(value)
          break
        }
      }
    })

    
  })
  .catch((error) => {
    console.error(error)
  })
}



// #region EVENTS - All event handling is here for now

function addEventListeners() {
  let timeoutId = setTimeout(() => {
    Qa(".icon--mouse-animated").forEach(element => element.style.animation = "var(--animation-mouse)")
  }, 3000)

  document.addEventListener("wheel", (e) => {
    Mouse.update(e)
    window.clearTimeout(timeoutId)
  })

  document.addEventListener("scroll", (e) => {
    Qa(".icon--mouse-animated").forEach(element => {
      if(element.getBoundingClientRect().y < 180) {
        element.style.opacity = "0"
      }
      else {
        element.style.opacity = ""
      }
    })
  })

  document.addEventListener("mouseover", (e) => {
    Mouse.update(e)
  
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
    
  })

  document.addEventListener("mousedown", (e) => {
    Mouse.update(e)
  })

  document.addEventListener("mouseup", (e) => {
    Mouse.update(e)
  })

  document.addEventListener("mousemove", (e) => {
    Mouse.update(e)
    Tooltip.updateOnMouse(e)
    Carousel.list.forEach(car => car.updateGlowOnMouse(e))

  })

  document.addEventListener("keydown", (e) => {
    Keyboard.updateKeys(e)
  })

  document.addEventListener("keyup", (e) => {
    Keyboard.updateKeys(e)
  })
}

//#endregion EVENTS



class Page {

  static history = [] //@todo

  static current = "home"

  static set(name, scrollMode = "none") {

    /* when you're already on the page you want to visit */
    if(name === Page.current && Page.data[name].ready === true) {
      if(name === "home") {
        let y = Q(".project-card").getBoundingClientRect().y + window.scrollY
        window.scrollTo({top: y - 200, behavior: "smooth"})
      }
      return
    }

    Page.data[Page.current].scrollY = window.scrollY

    Qa(".page").forEach(p => p.classList.add("hidden"))
    Q(`.page--${name}`).classList.remove("hidden")


    /* What happens to the scrollY of the page. */
    if(scrollMode === "resume") {
      window.scrollTo({top: Page.data[name].scrollY ?? 0, behavior: "instant"})
    } else {
      window.scrollTo({top: 0, behavior: "instant"})
    }
  
    if(debug) console.log("New page's previous scrollY position: ", Page.data[name].scrollY)

    if(Page.data[name].ready === false) {
      Page.setup(name)
    }

    Page.history.push(Page.current)

    Page.current = name
  }

  static next(scrollMode) {

  }

  static prev(scrollMode) {
    Page.set(Page.history.pop(), scrollMode)
  }

  /** This sets up a page for working. pageSet() then only switches between them */
  static setup(name) {

    if(name === "home") {
      new ProjectCard("adria_gold")
      new ProjectCard("kovacs")
      new ProjectCard("napacider")
      new ProjectCard("kralovske_marmelady")
    } 



    else
    if(name === "services") {
      for(let key in Services.list) {
        
        const card = new ServiceCard(key)
        const button = Create("button", {c: "dark \f dark-0 \f services--intro-button \f shadow-small", t: key})
        const arrow =  Create("div",    {c: "button-arrow \f rotate-90"})

        button.onclick = () => card.elements.get("container").scrollIntoView({block: "center", behavior: "smooth"})

        button.append(arrow)
        Q(".services--intro-buttons").append(button)
      }
    } 
    
    

    else
    if(name === "about") {
      for(let key in Person.list) {
        new PersonCard(key)
      }
    } 
    

    
    else
    if(name === "project") {
      
    }

    Page.data[name].ready = true
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



/* PRELOAD ANIMS */
for(let anim of ["icon_mouse_animated", "icon_cursor_animated"]) {
  for(let i = 0; i < 10; ++i) {
    let img = new Image()
    img.src = `../images/${anim}/${anim}000${i}.png`
    img.onload = () => {
      if(debug) console.log("loaded img")
    }
  }
}






/* VISITED BEFORE => Show visitor different projects at the front, based on the featured property of the project. */



/* syllable splitting idea */
function syllableSplit(word) {
  
  "a ne ta";
  "an té na";
  "ant mé na";
  "man dra žé";

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