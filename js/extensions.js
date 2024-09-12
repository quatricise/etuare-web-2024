/* string */
String.prototype.capitalize = function() {
  return this.charAt(0).toLocaleUpperCase() + this.slice(1)
}
String.prototype.decapitalize = function() {
  return this.charAt(0).toLocaleLowerCase() + this.slice(1)
}
String.prototype.reverse = function() {
  return this.split('').reverse().join('')
}
String.prototype.bool = function() {
  if(this.includes("false")) return false
  if(this.includes("true")) return true
}
String.prototype.matchAgainst = function(...strings) {
  let match = false
  strings.forEach(str => {
    if(str == this) 
      match = true
  })
  return match
}
String.prototype.includesAny = function(...strings) {
  for(let str of strings)
    if(this.includes(str))
      return true
}
String.prototype.splitCamelCase = function() {
  return this.replace(/([a-z])([A-Z])/g, '$1 $2')
}
String.prototype.camelCaseToArray = function() {
  return this.splitCamelCase().toLocaleLowerCase()
}

/* array */
Array.prototype.remove = function(...children) {
  children.forEach(child => {
    if(this.find(c => c === child) === undefined)
      return
    this.splice(this.indexOf(child), 1)
  })
}
Array.prototype.findValue = function(child) {
  return this.find(obj => obj === child)
}
Array.prototype.last = function() {
  return this[this.length - 1]
}
Array.prototype.removeAt = function(index) {
  return this.splice(index, 1)
}
Array.prototype.empty = function() {
  while(this.length)
    this.pop()
}
Array.prototype.clear = function() {
  while(this.length)
    this.pop()
}
Array.prototype.has = function(value) {
  return this.find(obj => obj === value)
}

/* set */
Set.prototype.random = function() {
  if(!this.size) return null
  let index = Math.round(Math.random() * (this.size - 1))
  return Array.from(this)[index]
}
Set.prototype.addAll = function(...values) {
  for(let val of values)
    this.add(val)
}
Set.prototype.map = function(/** @type Function */ filterFn) {
  let result = []
  this.forEach(item => result.push(filterFn(item)))
  return result
}
Set.prototype.byIndex = function(index) {
  return Array.from(this)[index]
}
Set.prototype.find = function(/** @type Function */ filterFn) {
  let result = null
  
  for(let val of this.values()) {
    let item = filterFn(val)
    if(item) {
      result = val
      break
    }
  }
  return result
}

/* Map */
Map.prototype.random = function() {
  let index = Math.round(Math.random() * (this.size - 1))
  return Array.from(this).at(index)
}
