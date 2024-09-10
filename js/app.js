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
    // for(let char of word) {

    // }
    results.push(firstHalf + "\u00AD" + secondHalf)
  }
  element.innerText = results.join(" ")
}


document.addEventListener("mouseover", (e) => {
 
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

window.onload = () => {
  new ProjectCard("adria_gold")
  new ProjectCard("adria_gold")
  new ProjectCard("adria_gold")

  pageSet("services")

  for(let key in services) {
    const button = Create("button", {c: "dark dark-0 services--intro-button shadow-small", t: key})
    const arrow = Create("div", {c: "button-arrow rotate-90"})
    button.append(arrow)
    Q(".services--intro-buttons").append(button)
  }

}



function pageSet(name) {
  Qa(".page").forEach(p => p.classList.add("hidden"))
  Q(`.page--${name}`).classList.remove("hidden")
}



const services = {
  "Obalový design": {

  },
  "Grafický design": {

  },
  "Logo design": {

  },
  "Produkce": {

  },
  "Digitální design": {

  },
  "3D Vizualizace": {

  },
  "Ilustrace": {

  },
}

