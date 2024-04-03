/** @type Map<string, Object> */
const project_list = new Map()

/** @type Set<String> */
const project_tags = new Set()

/** @type Set<String> */
const project_tags_active = new Set()

const project_state = {
  tagContainerVisible: true
}

function project_init() {
  for(let project in projects) {
    project_create(project)

    for(let tag of projects[project].tags) {
      project_tags.add(tag)
    }
  }
  

  project_tags.forEach(tag => {
    const element = El("div", "project-tag-button", [], "#" + tag)
    element.dataset.tag = tag
    element.onclick = () => project_filter_gallery([tag], element)
    
    project_tags_active.add(tag)
    Q("#project-tags").append(element)
  })

  /* setup scrolling behavior */
  Q("#project-detail").onscroll = (e) => project_on_scroll(e)
}



function project_create(name) {
  const data = projects[name]
  if(!data) {
    throw "Invalid project name: " + name
  }

  const project = {}
  project.data = data
  project_list.set(name, project)

  /** @type Map<string, HTMLElement> */
  project.elements = new Map()  

  const title =       El("h2", "project-heading", [], data.title)
  const desc =        El("div", "project-description", [], data.description)
  const coverImage =  El("img", "project-cover-image", [["src", `projects/${name}/${data.cover}`]])
  const content =     El("div", "project-content")
  
  /* gallery thumbnail */
  const thumbnail =   El("div", "gallery-thumbnail")
  const thumbImage =  El("img", undefined, [["src", `projects/${name}/thumbnail.png`]])
  const thumbLabel =  El("div", "gallery-thumbnail--label", [], data.title)
  thumbnail.append(thumbImage, thumbLabel)

  Q("#gallery").append(thumbnail)
  

  for(let item of data.content) {
    switch(item.type) {
      case "images": {
        for(let image of item.images) {
          const src = "projects/" + name + "/" + image.src
          const alt = image.title
          const img = El("img", "project-image", [["src", src],["alt", alt]])
          img.title = alt

          content.append(img)

          if(alt) {
            const label = El("div", "project-image-title", [], alt)
            img.after(label)
          }
        }

        break
      }
      case "html": {
        const html = El("div", "project-text")
        html.innerHTML = item.html
        content.append(html)
        break
      }
    }
  }

  project.elements.set("coverImage", coverImage)
  project.elements.set("title", title)
  project.elements.set("content", content)
  project.elements.set("thumbnail", thumbnail)
  project.elements.set("description", desc)

  /* label elements as ephemeral */
  project.elements.forEach(el => el.dataset.ephemeral = "true")

  /* functionality */
  thumbnail.onclick = () => {
    project_open(name)
  }
}



function project_open(name) {
  const project = project_list.get(name)
  if(!project) {
    throw "No project under name: " + name
  }

  /* remove ephemeral elements */
  Qa("#project-detail *[data-ephemeral='true']").forEach(el => el.remove())

  Q("#project-detail").classList.remove("hidden")

  Q("#project-detail").append(project.elements.get("coverImage"))
  Q("#project-detail").append(project.elements.get("title"))

  if(project_list.get(name)?.data.description) {
    Q("#project-detail").append(project.elements.get("description"))
  }
  
  Q("#project-detail").append(project.elements.get("content"))
}

function project_hide() {
  Q("#project-detail").classList.add("hidden")
}

function project_filter_gallery(tags = [], clickedButton = null) {
  
  /* if you click the active tag button it un-actives those tags
  then if there is nothing active it just shows everything */

  if(clickedButton?.classList.contains("active")) {
    project_tags_active.delete(clickedButton.dataset.tag)
    clickedButton.classList.remove("active")

    if(project_tags_active.size === 0) {
      project_tags.forEach(t => project_tags_active.add(t))
    }
  }
  else {
    /* reset state */
    Qa(`.project-tag-button`).forEach(b => b.classList.remove("active"))
    project_tags_active.clear()

    tags.forEach(tag => {
      project_tags_active.add(tag)
      Q(`.project-tag-button[data-tag='${tag}']`).classList.add("active")
    })
  }


  project_list.forEach(project => {
    if(project.data.tags.hasAny(...Array.from(project_tags_active))) {
      project.elements.get("thumbnail").classList.remove("hidden")
    } else {
      project.elements.get("thumbnail").classList.add("hidden")
    }
  })

  project_gallery_scroll_to(0)
}

function project_on_scroll(e) {
  if(Q("#project-detail").scrollTop > window.innerHeight * 0.75) {
    Q("#button--scroll-to-top").classList.remove("hidden")
  }
  else {
    Q("#button--scroll-to-top").classList.add("hidden")
  }
}

function project_scroll_to(top = 0, behavior = "auto") {
  Q("#project-detail").scrollTo({top: top, behavior: behavior})
}

function project_gallery_scroll_to(top = 0, behavior = "auto") {
  Q("html").scrollTo({top: top, behavior: behavior})
}

function project_animate_tags(show = true) {
  /* if the state is already what it should be */
  if(project_state.tagContainerVisible === show) return

  /* prevent the tags from hiding if at least one is active */
  if(show === false && project_tags_active.size > 0 && project_tags_active.size < project_tags.size) return
  
  const tags = Q("#project-tags-container")

  if(tags.getAnimations().length !== 0) {
    return
  }

  const height = tags.offsetHeight

  let to = Q("header").offsetHeight + "px"
  let from = (-height + "px")
  let easing = show ? "cubic-bezier(0.2, 0.0, 0.3, 1.0)" : "cubic-bezier(0.7, 0.0, 0.8, 1.0)"

  if(!show) {
    [to, from] = [from, to]
  }

  // console.log(from, "->", to)

  tags.style.top = from
  tags.animate([
    {top: from},
    {top: to},
  ], {
    duration: 500,
    easing: easing
  })
  .onfinish = () => {
    tags.style.top = to
  }
  project_state.tagContainerVisible = show
}

setTimeout(() => {
  project_animate_tags(true)
}, 500);


// // Function to get the value of a specific CSS variable declared under :root pseudo-class
// function getRootCSSVariable(variableName) {
//   // Loop through all stylesheets
//   for (let i = 0; i < document.styleSheets.length; i++) {
//       let styleSheet = document.styleSheets[i];
      
//       // Check if the stylesheet is accessible (some may be inaccessible due to CORS policy)
//       if (!styleSheet.href || styleSheet.href.startsWith(window.location.origin)) {
//           // Loop through all the rules in the stylesheet
//           for (let j = 0; j < styleSheet.cssRules.length; j++) {
//               let rule = styleSheet.cssRules[j];
              
//               // Check if the rule is a CSSStyleRule and its selector is :root
//               if (rule instanceof CSSStyleRule && rule.selectorText === ':root') {
//                   // Check if the rule contains the desired variable
//                   if (rule.style.getPropertyValue(variableName)) {
//                       return rule.style.getPropertyValue(variableName);
//                   }
//               }
//           }
//       }
//   }

//   // If the variable is not found, return null
//   return null;
// }