//search query parsing
function init() {

  /* Process the URL search */
  let searchQuery = window.location.search.replace("?", "")
  let pairs = searchQuery.split("+")
  pairs.forEach(pair => {
    let [key, value] = pair.split("=")
    
    switch(key) {
      case "project": {
        //display a specific project
        break
      }
    }
  })
}

window.onload = () => {
  Qa(".gallery-thumbnail").forEach(th => {
    th.onclick = () => {
      Q("#project-detail").classList.remove("hidden")
    }
  })
}

document.addEventListener("mousedown", (e) => {
  if(e.target.closest("#project-detail") == null) {
    Q("#project-detail").classList.add("hidden")
  }
})