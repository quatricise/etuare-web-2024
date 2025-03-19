class Animate {
  constructor(
    /** @type HTMLElement */ element,
  ) {

    /** @type boolean */
    this.suspended = false

    /** @type function */
    this._ondestroy = null

    /** @type HTMLElement */
    this.element = element

    /** @type Animation */
    this.current = null

    /** @type Array<Object> */
    this.actions = []

    if(Animate.list.has(element)) {
      this.suspended = true
      this.current = true //@todo - hack, so no chained commands work, i think it just means the animation is not added anywhere, so it's not finished

      // console.log("suspended")
      // Animate.list.get(element)._ondestroy = () => {
      //   Animate.list.set(this.element, this)
      //   this.suspended = false 
      //   this._queueNext()
      // }
    }
    else {
      Animate.list.set(this.element, this)
    }
  }

  _queueNext() {
    if(this.suspended) return

    this.current = null
    const action = this.actions.shift()
    if(action) {
      switch (action.type) {
        case "animate": {
          this.animate(action.keyframes, action.options)
          break
        }
        case "set": {
          this.set(action.data)
          break
        }
        case "class": {
          this._classSet(action.state, action.classes)
          break
        }
        case "resetStyle": {
          this.resetStyle(action.state)
          break
        }
        case "wait": {
          this.wait(action.durationMS)
          break
        }
        case "then": {
          this.then(action.fn)
          break
        }
        default: {
          throw "invalid action type"
        }
      }
    }

    else {
      this.destroy()
    }
  }

  then(fn) {
    if(this.current) {
      this.actions.push({type: "then", fn})
    }

    else {
      fn()
      this._queueNext()
    }

    return this
  }

  wait(durationMS) {
    if(this.current) {
      this.actions.push({type: "wait", durationMS})
    }
    
    else {
      this.current = true
      // console.log("wait for " + durationMS)
      window.setInterval(() => this._queueNext(), durationMS)
    }

    return this
  }

  animate(/** @type Keyframe[] */ keyframes, /** @type KeyframeAnimationOptions */ options) {
    
    if(this.current) {
      this.actions.push({type: "animate", keyframes, options})
    }

    else {
      // console.log("animate")
      this.current = this.element.animate(keyframes, options)
      this.current.onfinish = () => this._queueNext()
    }

    return this
  }

  /** Sets some things on the element */
  set(data = {style: {}, attribs: {}}) {
    if(!data) return

    if(this.current) {
      this.actions.push({type: "set", data})
    }

    else {
      // console.log("set")
      if(data.style) {
        for(let key in data.style) {
          this.element.style[key] = data.style[key]
        }
      }
      if(data.attribs) {
        for(let key in data.attribs) {
          this.element.setAttribute(key, data.attribs[key])
        }
      }
      this._queueNext()
    }

    return this
  }

  resetStyle() {
    if(this.current) {
      this.actions.push({type: "resetStyle"})
    }
    else {
      this.element.style = ""
    }
    
    return this
  }

  _classSet(state = "", ...classes) {

    if(this.current) {
      this.actions.push({type: "class", state, classes})
    }

    else {
      for(let c of classes) {
        this.element.classList[state](c)
      }
      // console.log("class set")
      this._queueNext()
    }

    return this
  }
  classAdd(...classes) {
    this._classSet("add", ...classes)
    return this
  }
  classRemove(...classes) {
    this._classSet("remove", ...classes)
    return this
  }

  destroy() {
    // console.log("destroy")
    this._ondestroy?.()
    Animate.list.delete(this.element)
  }


  /** @type Map<HTMLElement, Animate> */
  static list = new Map()
}