/** @type Map<string, Object> */
const project_list = new Map()

/** @type Set<String> */
const project_tags = new Set()

/** @type Set<String> */
const project_tags_active = new Set()



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

    Q("#project-tags").append(element)
  })
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

  Q("#project-detail").innerHTML = ""
  Q("#project-detail").classList.remove("hidden")

  Q("#project-detail").append(project.elements.get("coverImage"))
  Q("#project-detail").append(project.elements.get("title"))
  Q("#project-detail").append(project.elements.get("description"))
  Q("#project-detail").append(project.elements.get("content"))
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
}