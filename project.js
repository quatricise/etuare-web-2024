/** @type Map<string, Object> */
const project_list = new Map()

/** @type Set<String> */
const project_tags = new Set()

/** @type Set<String> */
const project_tags_active = new Set()

const project_state = {
  tagContainerVisible: true
}

let project_active = null

function project_init() {
  for(let project in projects) {
    project_create(project)

    for(let tag of projects[project].tags) {
      project_tags.add(tag)
    }
  }

  project_gallery_fill_end()
  

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
  if(data.hidden) {
    return
  }

  const 
  project = {}
  project.data = data
  project.visibleInGallery = true
  project.loaded = false
  
  project_list.set(name, project)

  /** @type Map<string, HTMLElement> */
  project.elements = new Map()


  /* Note: data-src attribs are used for all internal images, which are not to be seen until the project is opened */

  const title =       El("h2",  "project-heading", [], data.title)
  const desc =        El("div", "project-description add-nbsp", [], data.description)
  const coverImage =  El("img", "project-cover-image", [["data-src", `projects/${name}/${data.cover || "cover.png"}`]])
  const coverImageContainer = El("div", "project-cover-image-container")
  const coverImageShadow = El("div", "project-cover-image-shadow")
  const content =     El("div", "project-content")
  
  /* gallery thumbnail */
  const thumbnail =   El("div", "gallery-thumbnail")
  const thumbImage =  El("img", "gallery-thumbnail-image", [["src", `projects/${name}/${data.thumbnail || "thumbnail.png"}`]])
  const thumbLabel =  El("div", "gallery-thumbnail--label", [], data.title)
  thumbnail.append(thumbImage, thumbLabel)
  coverImageContainer.append(coverImage, coverImageShadow)
  
  thumbnail.onmouseover = () => {
    thumbnail.style.borderColor = data.accent || "var(--color-etuare)"
  }
  thumbnail.onmouseout = () => {
    thumbnail.style.borderColor = "transparent"
  }

  Q("#gallery").append(thumbnail)
  

  for(let item of data.content) {
    switch(item.type) {
      case "images": {
        for(let image of item.images) {
          const src = "projects/" + name + "/" + image.src
          const title = image.title
          const img = El("img", "project-image", [["data-src", src],["alt", title]])
          img.title = title

          content.append(img)

          if(image.title) {
            const label = El("div", "project-image-title", [], " 🡩 " + title)
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
  project.elements.set("coverImageContainer", coverImageContainer)
  project.elements.set("title", title)
  project.elements.set("content", content)
  project.elements.set("thumbnail", thumbnail)
  project.elements.set("description", desc)

  /* label elements as ephemeral */
  project.elements.forEach((el, name) => {
    if(name.isAny( //these will be removed/added to the DOM during opening and closing projects
      "coverImageContainer",
      "title",
      "content",
      "thumbnail",
      "description",
    ))
      el.dataset.ephemeral = "true"
  })

  addNonBreakingSpaces()

  /* functionality */
  thumbnail.onclick = () => {
    project_open(name)
  }
}



function project_open(name) {
  const project = project_list.get(name)

  /** @type HTMLImageElement */
  const cover = project.elements.get("coverImage")

  if(!project) {
    throw "No project under name: " + name
  }

  if(project_active === project) {
    setTimeout(() => {
      Q("#project-detail").scrollTo({top: 0, behavior: "smooth"})
    }, 100)
  }
  project_active = project

  /* load all from data-src attribs if there are elements with those, and then delete those attribs */

  if(project.loaded === false) {
    let elements = []
    elements.push(...Array.from(project.elements.values()))
    
    /* exception for "content" element because its contents is not added to the "project.elements" Map */
    elements.push(...Array.from(project.elements.get("content").querySelectorAll("[data-src]"))) 
    
    elements.forEach(element => {
      if(!element.dataset.src) return
      element.src = element.dataset.src
      delete element.dataset.src
    })
    project.loaded = true
  }
  


  /* remove ephemeral elements from the project detail panel */
  
  Qa("#project-detail *[data-ephemeral='true']").forEach(el => el.remove())



  /* append new elements and show the project-detail */

  Q("#project-detail").classList.remove("hidden")

  Q("#project-detail").append(project.elements.get("coverImageContainer"))
  Q("#project-detail").append(project.elements.get("title"))

  if(project_list.get(name)?.data.description) {
    Q("#project-detail").append(project.elements.get("description"))
  }
  
  Q("#project-detail").append(project.elements.get("content"))



  /* animations */

  cover.style.pointerEvents = "none"
  cover.animate([
    {filter: "opacity(0)"},
    {filter: "opacity(1)"},
  ],{
    duration: 1200,
    easing: "cubic-bezier(0.2, 0.7, 0.2, 0.7)"
  })
  .onfinish = () => cover.style.pointerEvents = ""
  
}

function project_hide() {
  Q("#project-detail").style.pointerEvents = "none"
  Q("#project-detail").animate([
    {filter: "opacity(1.0) contrast(1.0) brightness(1.0)", transform: "translateY(0)"},
    {filter: "opacity(1.0) contrast(2.5) brightness(0.1)", transform: "translateY(100%)"}
  ], {
    duration: 500,
    easing: "cubic-bezier(0.5, 0.0, 0.2, 1.0)"
  })
  .onfinish = () => {
    Q("#project-detail").classList.add("hidden")
    Q("#project-detail").style.pointerEvents = ""
  }
  
}

function project_filter_gallery(tags = [], clickedButton = null) {
  
  /* if you click the active tag button it un-actives that tag
  then if there is nothing active it shows everything */

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
      project.visibleInGallery = true
    } else {
      project.elements.get("thumbnail").classList.add("hidden")
      project.visibleInGallery = false
    }
  })

  /* lazy-fuck solution */
  project_gallery_fill_end()

  project_gallery_scroll_to(0)
}

/** Fills the end of the gallery with empty items so the bg color does not show */
function project_gallery_fill_end() {
  Qa(".gallery-thumbnail.fill-in").forEach(el => el.remove())

  const cellWidth = 320 + 1 /* + 1 because of the grid gap */
  const galleryWidth = Q("#gallery").getBoundingClientRect().width
  const rowCount = Math.floor(galleryWidth / cellWidth)
  const countVisible = Array.from(project_list.values()).filter(p => p.visibleInGallery === true).length
  let   fillInCount = rowCount - (countVisible % rowCount)

  /* makes no sense to fill an entire new row, so just don't */
  if(fillInCount == rowCount) fillInCount = 0

  /* construct the thumbnails per amount of cells that are underflowing in the last row of the grid */
  for(let i = 0; i < fillInCount; i++) {
    const thumbnail = El("div", "gallery-thumbnail fill-in")
    Q("#gallery").append(thumbnail)
  }
}

function project_on_scroll(e) {
  const detail = Q("#project-detail")
  const button = Q("#button--scroll-to-top")

  if(detail.scrollTop > window.innerHeight * 0.75) {
    button.classList.remove("hidden")
  }
  else
  if(button.classList.contains("hidden") == false && detail.scrollTop > 150) {
    
  }
  else {
    button.classList.add("hidden")
  }
}

function project_scroll_to(top = 0, behavior = "auto") {
  Q("#project-detail").scrollTo({top: top, behavior: behavior})
}

function project_gallery_scroll_to(top = 0, behavior = "auto") {
  Q("html").scrollTo({top: top, behavior: behavior})
}

function project_animate_tags(value = true) {
  if(project_state.tagContainerVisible === value) return

  /* prevent the tags from hiding if at least one is active */
  if(value === false && project_tags_active.size < project_tags.size) return
  
  const tags = Q("#project-tags-container")

  if(tags.getAnimations().length !== 0) {
    return
  }

  const height = tags.offsetHeight

  let to = Q("header").offsetHeight + "px"
  let from = (-height + "px")
  let easing = value ? "cubic-bezier(0.2, 0.0, 0.3, 1.0)" : "cubic-bezier(0.7, 0.0, 0.8, 1.0)"

  if(!value) {
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
  project_state.tagContainerVisible = value
}

setTimeout(() => {
  project_animate_tags(true)
}, 500);