function init() {

  /* Process the URL search */
  let searchQuery = window.location.search.replace("?", "")
  let pairs = searchQuery.split("+")
  pairs.forEach(pair => {
    let [key, value] = pair.split("=")
    
    switch(key) {
      case "project": {
        project_open(value)
        break
      }
      case "tag": {
        project_filter_gallery([value])
        break
      }
      case "page": {
        pageSet(value)
        break
      }
    }
  })

  addNonBreakingSpaces()
}

const state = {
  lastScrollTop: 0
}

window.onload = () => init()
window.onresize = () => project_gallery_fill_end()


/* EVENT HANDLING */

document.addEventListener("pointerdown", (e) => {
  if(e.target.closest("#project-detail") == null && e.target.closest(".gallery-thumbnail") == null) {
    project_hide()
  }
  if(e.target.closest("#logo")) {
    pageSet("project")
    project_gallery_scroll_to(0, "smooth")
  }
})

document.addEventListener("keydown", (e) => {
  if(e.code === "Escape") {
    project_hide()
  }
})

document.addEventListener("scroll", (e) => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop

  /* scrolled up */
  if(state.lastScrollTop > scrollTop) {
    project_animate_tags(false)
  }
  /* scrolled down */
  else {
    project_animate_tags(true)
  }

  state.lastScrollTop = scrollTop
})

function pageSet(name) {
  Qa(".navlink").forEach(element => element.classList.remove("active"))
  
  switch(name) {
    case "project": {
      Q("#page--project").classList.remove("hidden")
      Q("#page--contact").classList.add("hidden")
      Q(`.navlink[data-pagename='${name}']`).classList.add("active")
      break
    }
    case "contact": {
      Q("#page--contact").classList.remove("hidden")
      Q("#page--project").classList.add("hidden")
      Q(`.navlink[data-pagename='${name}']`).classList.add("active")
      break
    }
  }
}

project_init()