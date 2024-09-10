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
function Create(options = {}) {
  const element = document.createElement(options.tagname ?? "div")
  const classes = options.classes?.split(" ")
  if(classes) {
    for(let c of classes) {
      element.classList.add(c)
    }
  }
  const attribs = options.attribs?.split("|")
  if(attribs) {
    for(let a of attribs) {
      const [key, val] = a.split(" ")
      element.setAttribute(key, val)
    }
  }
  element.innerText = options.innerText ?? ""
  return element
} 