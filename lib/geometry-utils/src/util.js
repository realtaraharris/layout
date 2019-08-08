'use strict'

function area (polygon) {
  const { length } = polygon
  let result = 0.0
  for (let p = length - 1, q = 0; q < length; p = q++) {
    result += polygon[p].x * polygon[q].y - polygon[q].x * polygon[p].y
  }
  return result * 0.5
}

function renderPolygon(context, polygon, outline) {
  if (!polygon) { return }

  const a = area(polygon)

  context.save()
  if (a < 0) { // polygon is reversed (it is a hole)
    context.fillStyle = 'red'
    context.strokeStyle = 'red'
  } else {
    context.fillStyle = 'orange'
    context.strokeStyle = 'gray'
  }

  context.beginPath()
  context.lineWidth = 1
  context.moveTo(polygon[0].x, polygon[0].y) // first vertex
  for (let i = 1; i < polygon.length; i++) {
    context.lineTo(polygon[i].x, polygon[i].y)
  }

  if (outline) {
    context.stroke()
  } else {
    context.fill()
  }

  context.restore()
}

module.exports = { area, renderPolygon }
