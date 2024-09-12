class Keyboard {
  static keys = {
    shift: false,
    ctrl: false,
    alt: false
  }
  static updateKeys(/** @type KeyboardEvent */ e) {
    if(e.type === "keydown") {
      if(e.code === "ShiftLeft" || e.code === "ShiftRight")     this.keys.shift = true
      else
      if(e.code === "AltLeft" || e.code === "AltRight")         this.keys.alt = true
      else
      if(e.code === "ControlLeft" || e.code === "ControlRight") this.keys.ctrl = true
    } else
    if(e.type === "keyup") {
      if(e.code === "ShiftLeft" || e.code === "ShiftRight")     this.keys.shift = false
      else
      if(e.code === "AltLeft" || e.code === "AltRight")         this.keys.alt = false
      else
      if(e.code === "ControlLeft" || e.code === "ControlRight") this.keys.ctrl = false
    }
  }
}