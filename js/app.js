const addNBSPToString = (str) => str.replace(
  / ([a-zA-Z]) /g,
  ' $1' + '\u00A0'
);

function addNBSPToAll() {
  Qa(".add-nbsp").forEach(element => {
    element.innerText = addNBSPToString(element.innerText)
  })
}

/** Adds shy hyphens to text. Rudimentary but works. */
function autoShy(/** @type HTMLElement */ element) {
  let words = element.innerText.split(" ").filter(word => word !== " ")
  let results = []
  for(let word of words) {
    if(word.length <= 5) {
      results.push(word)
      continue
    }
    let halvingIndex = Math.ceil(word.length / 2)

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
  element.innerText = results.join(" ")
}

window.onload = () => init()

function init() {
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
    "js/projects.js",
    "js/project_card.js",
  ]
  function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve(src);
        script.onerror = () => reject(new Error(`Failed to load script ${src}`));
        document.head.appendChild(script);
  });
}

  Promise.all(scripts.map(loadScript))
  .then(() => {



    /* INITIALIZE SHIT AFTER SCRIPTS ARE LOADED */

    Qa(".navlink").forEach(navlink => {
      navlink.onclick = () => Page.set(navlink.dataset.page)
    })

    Page.set("about")

    addEventListeners()

    Qa(".auto-shy").forEach(element => autoShy(element))

    addNBSPToAll()
  })
}



// #region EVENTS - All event handling is here for now

function addEventListeners() {
  let timeoutId = setTimeout(() => {
    Q(".icon--mouse-animated").style.animation = "var(--animation-mouse)"
  }, 3000)

  document.addEventListener("wheel", (e) => {
    Mouse.update(e)
    window.clearTimeout(timeoutId)
  })

  document.addEventListener("scroll", (e) => {
    if(Q(".icon--mouse-animated").getBoundingClientRect().y < 180) {
      Q(".icon--mouse-animated").style.opacity = "0"
    }
    else {
      Q(".icon--mouse-animated").style.opacity = ""
    }
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

  static set(name) {
    Qa(".page").forEach(p => p.classList.add("hidden"))
    Q(`.page--${name}`).classList.remove("hidden")
    
    if(Page.readyState[name] === false) {
      Page.setup(name)
    }
  }

  /** This sets up a page for working. pageSet() then only switches between them */
  static setup(name) {

    if(name === "home") {
      new ProjectCard("adria_gold")
      new ProjectCard("adria_gold")
      new ProjectCard("adria_gold")
    } 



    else
    if(name === "services") {
      for(let key in Services.list) {
        const button = Create("button", {c: "dark dark-0 services--intro-button shadow-small", t: key})
        const arrow = Create("div", {c: "button-arrow rotate-90"})
        button.append(arrow)
        Q(".services--intro-buttons").append(button)

        new ServiceCard(key)

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

    Page.readyState[name] = true
  }
  
  static readyState = {
    home: false,
    services: false,
    about: false,
    project: false,
  }
}



/* PRELOAD ANIMS */
for(let anim of ["icon_mouse_animated", "icon_cursor_animated"]) {
  for(let i = 0; i < 10; ++i) {
    let img = new Image()
    img.src = `../images/${anim}/${anim}000${i}.png`
    img.onload = () => console.log("loaded img")
  }
}