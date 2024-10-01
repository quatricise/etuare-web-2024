class Vector2 {
  constructor(x = 0, y) {
    this.x = x
    if(y === undefined) this.y = x
    else this.y = y
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }
  distance(vector) {
    let v = new Vector2(
      Math.abs(this.x - vector.x),
      Math.abs(this.y - vector.y)
    )
    return v.length()
  }
  add(vector) {
    this.x = this.x + vector.x
    this.y = this.y + vector.y
    return this
  }
  dot(vector) {

  }
  sub(vector) {
    this.x = this.x - vector.x
    this.y = this.y - vector.y
    return this
  }
  get copy() {
    return new Vector2(this.x, this.y)
  }
  mult(factor) {
    this.x = this.x * factor
    this.y = this.y * factor
    return this
  }
  invert() {
    this.x *= -1
    this.y *= -1
    return this
  }
  normalize(length) {
    length = length || 1
    let total = this.length()
    this.x = (this.x / total) * length
    this.y = (this.y / total) * length
    return this
  }
  angle() {
    return Math.atan2(this.y, this.x)
  }
  angleTo(vector) {
    let angle = Math.atan2(vector.y - this.y, vector.x - this.x)
    if(angle < 0) angle += TAU
    return angle
  }
  result() {
    return new Vector2(this.x, this.y)
  }
  lerp(vector, amount) {
    return new Vector2(
      this.x + (vector.x - this.x) * amount,
      this.y + (vector.y - this.y) * amount
    )
  }
  rotate(angle) {
    this.x = this.x * Math.cos(angle) - this.y * Math.sin(angle)
    this.y = this.x * Math.sin(angle) + this.y * Math.cos(angle)
    return this
  }
  rotate_around(vector, rotation) {
    this.sub(vector)
    .rotate(rotation)
    .add(vector)
    return this
  }
  clamp(length) {
    if (this.length() > length)
      this.normalize(length)
    return this
  }
  lerp(target, value) {
    return new Vector2(this.x + (target.x - this.x) * value, this.y + (target.y - this.y) * value)
  }
  inbound(bound) {
    return this.x < bound && this.x > -bound && this.y < bound && this.y > -bound
  }
  set(x, y) {
    this.x = x
    if(y === undefined) this.y = x
    else this.y = y
    return this
  }
  set_from(vec) {
    this.x = vec.x
    this.y = vec.y
  }
  is(vector) {
    return this.x === vector.x && this.y === vector.y
  }
  isClose(margin, vector) {
    return this.distance(vector) <= margin
  }
  floor() {
    this.x = Math.floor(this.x)
    this.y = Math.floor(this.y)
    return this
  }
  round() {
    this.x = Math.round(this.x)
    this.y = Math.round(this.y)
    return this
  }
  plain() {
    return {x: this.x, y: this.y}
  }
  static zero() {
    return new Vector2(0, 0)
  }
  static fromAngle(rotation) {
    return new Vector2(Math.cos(rotation), Math.sin(rotation))
  }
  static avg(...vectors) {
    let x = [],y = []
    vectors.map(vec => {x.push(vec.x); y.push(vec.y)})
    return new Vector2(avg(...x), avg(...y))
  }
}