const addNBSPToString = (str) => str.replace(
  / ([a-zA-Z]) /g,
  ' $1' + '\u00A0'
);

function addNBSPToAll() {
  Query.all(".add-nbsp").forEach(element => {
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
    const firstHalf =  word.slice(0, Math.ceil(word.length / 2))
    const secondHalf = word.slice(Math.ceil(word.length / 2))

    results.push(firstHalf + "\u00AD" + secondHalf)
  }
  element.innerText = results.join(" ")
}

window.onload = () => {
  Tooltip.init()
  Ticker.start()

  new ProjectCard("adria_gold")
  new ProjectCard("adria_gold")
  new ProjectCard("adria_gold")

  // pageSet("services")

  // for(let key in services) {
  //   const button = Create("button", {c: "dark dark-0 services--intro-button shadow-small", t: key})
  //   const arrow = Create("div", {c: "button-arrow rotate-90"})
  //   button.append(arrow)
  //   Q(".services--intro-buttons").append(button)

  // }
  // new ServiceCard("Obalový design")
  // new ServiceCard("Obalový design")
}



// #region EVENTS - All event handling is here for now

let timeoutId

timeoutId = setTimeout(() => {
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


//#endregion



function pageSet(name) {
  Qa(".page").forEach(p => p.classList.add("hidden"))
  Q(`.page--${name}`).classList.remove("hidden")
}



(function preload() {
  for(let anim of ["icon_mouse_animated", "icon_cursor_animated"]) {
    for(let i = 0; i < 10; ++i) {
      Create("img", {a: `src=../images/${anim}/${anim}000${i}.png`})  
    }
  }
})()