class Mouse {
  static position = new Vector2()
  static positionView = new Vector2()
  static positionPrevious = new Vector2()
  static buttons = {
    left: false,
    middle: false,
    right: false,
  }
  static update(/** @type Event */ e) {
    switch(e.type) {
      case "mousemove": {
        this.position.set(e.pageX, e.pageY)
        this.positionView.set(e.clientX, e.clientY)
        break
      }
      case "mousedown": {
        if(e.button === 0) this.buttons.left = true
        if(e.button === 1) this.buttons.middle = true
        if(e.button === 2) this.buttons.right = true
        break
      }
      case "mouseup": {
        if(e.button === 0) this.buttons.left = false
        if(e.button === 1) this.buttons.middle = false
        if(e.button === 2) this.buttons.right = false
        break
      }
    }
  }
}