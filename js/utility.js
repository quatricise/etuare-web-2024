/* QUERY */

function Q(query) {
  return document.querySelector(query)
}
function Qa(query) {
  return Array.from(document.querySelectorAll(query))
}
function Q_On(element, query) {
  return element.querySelector(query)
}
function Qa_On(element, query) {
  return Array.from(element.querySelectorAll(query))
}

/* HTML */

/** @returns HTMLElement */
function Create(tagname, options = {}) {
  const element = document.createElement(tagname)
  const classes = options.c?.split(" ")
  if(classes) {
    for(let c of classes) {
      element.classList.add(c)
    }
  }
  const attributes = options.a?.split(" ")
  if(attributes) {
    for(let a of attributes) {
      const [key, val] = a.split("=")
      element.setAttribute(key, val)
    }
  }
  element.innerText = options.t ?? ""
  return element
}