function init() {

  /* Process the URL search */
  let searchQuery = window.location.search.replace("?", "")
  let pairs = searchQuery.split("+")
  pairs.forEach(pair => {
    let [key, value] = pair.split("=")
    
    switch(key) {
      case "project": {
        //display a specific project
        project_open(value)
        break
      }
    }
  })
}

window.onload = () => init()

/* EVENT HANDLING */

document.addEventListener("mousedown", (e) => {
  if(e.target.closest("#project-detail") == null) {
    project_hide()
  }
})

document.addEventListener("keydown", (e) => {
  if(e.code === "Escape") {
    project_hide()
  }
})

function pageSet(name) {
  switch(name) {
    case "project": {
      Q("#page--project").classList.remove("hidden")
      Q("#page--contact").classList.add("hidden")
      break
    }
    case "contact": {
      Q("#page--contact").classList.remove("hidden")
      Q("#page--project").classList.add("hidden")
      break
    }
  }
}

project_init()