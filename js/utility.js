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






/** 
 * @returns HTMLElement 
*/
function Create(tagname, options = {}) {
  const splittingChar = " \f "
  /** @type HTMLElement */
  const element = document.createElement(tagname)
  const classes = options.c?.split(splittingChar) //classes are exceptions because their tokens cannot contain spaces
  if(classes) {
    for(let c of classes) {
      if(c !== "" && c !== " ") {
        element.classList.add(c)
      }
    }
  }
  const attributes = options.a?.split(splittingChar)
  if(attributes) {
    for(let a of attributes) {
      const [key, val] = a.split("=")
      element.setAttribute(key, val)
    }
  }
  if(options.t) element.innerText = options.t
  if(options.h) element.innerHTML = options.h

  const styles = options.s?.split(splittingChar)
  if(styles) {
    for(let style of styles) {
      const [key, val] = style.split("=")
      element.style[key] = val
    }
  }
  const data = options.d?.split(splittingChar)
  if(data) {
    for(let set of data) {
      const [key, val] = set.split("=")
      element.dataset[key] = val
    }
  }

  return element
}






function wait(durationMS) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, durationMS);
  });
}

const TAU  = Math.PI * 2
const PI   = Math.PI
const PI_2 = Math.PI / 2
const PI_4 = Math.PI / 4

function radToDeg(/** @type number */ rad) {
  return rad * 180/Math.PI
}

/** @returns boolean */
function keyInObject(obj, tested) {
  if(!obj) return false
  return Object.keys(obj).has(tested)
}