'use strict'

/**
 * represents a 3D vector
 * new Vector(1, 2)
 * new Vector([1, 2])
 * new Vector({ x: 1, y: 2 })
 */
class Vector {
  constructor (input) {
    // TODO: consider refactoring so that there's only one way to pass args in
    let x, y
    // console.log('input:', input)
    if (Array.isArray(input)) {
      // console.log('boom in array mode', input)
      x = input[0]
      y = input[1]
    } else if (arguments.length === 2) {
      x = arguments[0]
      y = arguments[1]
    } else {
      x = arguments.x
      x = arguments.y
    }
    // console.log(`constructing Vector, ${x}, ${y}, arguments: ${JSON.stringify(arguments)}`)
    this.x = x
    this.y = y
  }

  clone () {
    return new Vector(this.x, this.y)
  }

  negated () {
    return new Vector(-this.x, -this.y)
  }

  plus (a) {
    return new Vector(this.x + a.x, this.y + a.y)
  }

  minus (a) {
    return new Vector(this.x - a.x, this.y - a.y)
  }

  times (a) {
    return new Vector(this.x * a, this.y * a)
  }

  dividedBy (a) {
    return new Vector(this.x / a, this.y / a)
  }

  dot (a) {
    return this.x * a.x + this.y * a.y
  }

  lerp (a, t) {
    return this.plus(a.minus(this).times(t))
  }

  length () {
    return Math.sqrt(this.dot(this))
  }

  unit () {
    return this.dividedBy(this.length())
  }

  squaredLengthTo (b) {
    return (this.x - b.x) * (this.x - b.x) + (this.y - b.y) * (this.y - b.y)
  }
}

module.exports = Vector
