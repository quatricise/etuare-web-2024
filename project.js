/** @type Map<string, Object> */
const project_list = new Map()

function project_init() {
  for(let project in projects) {
    project_create(project)
  }
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

  const
  title = El("div", "project-heading", [], data.title)

  const
  desc = El("div", "project-description", [], data.description)

  const
  content = El("div", "project-content")

  for(let item of data.content) {
    switch(item.type) {
      case "images": {
        for(let image of item.images) {
          const img = El("img", "project-image", [["src", image.src],["alt", image.alt]])
          content.append(img)
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

  project.elements.set("title", title)
  project.elements.set("content", content)
  project.elements.set("desc", desc)
}

function project_open(name) {
  const project = project_list.get(name)
  if(!project) {
    throw "No project under name: " + name
  }

  Q("#project-detail").append(project.elements.get("title"))
  Q("#project-detail").append(project.elements.get("description"))
  Q("#project-detail").append(project.elements.get("content"))
}