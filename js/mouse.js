class Mouse {
  //page position
  static position =           new Vector2()
  static positionPrevious =   new Vector2()
  static positionClickStart = new Vector2()

  //viewport position
  static positionView =       new Vector2() 

  static movedFromClick =     new Vector2() //how far the mouse is from the origin of the last click
  static traveledSinceClick = new Vector2() //how far the mouse has traveled total since the last click
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
        
        this.movedFromClick.set_from(this.position.copy.sub(this.positionClickStart))

        let moved = this.position.copy.sub(this.positionPrevious)
        moved.x = Math.abs(moved.x)
        moved.y = Math.abs(moved.y)

        this.traveledSinceClick.add(moved)
        this.positionPrevious.set_from(this.position)
        break
      }
      case "mousedown": {
        if(e.button === 0) this.buttons.left = true
        if(e.button === 1) this.buttons.middle = true
        if(e.button === 2) this.buttons.right = true

        this.movedFromClick.set(0)
        this.positionClickStart.set_from(this.position)
        this.traveledSinceClick.set(0)
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