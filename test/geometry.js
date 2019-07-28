'use strict'

const tape = require('tape-catch')
const { clearTerminal, screenshot } = require('./lib/util')
const { createCanvas } = require('canvas')
const WIDTH = 800
const HEIGHT = 600

const { intersect, rasterizePolygon, intersectAabb, mergeRasterizations } = require('../lib/geometry')

clearTerminal()

tape('rasterize polygon (convex)', t => {
  const lineLoop = [
    [ 0, 0, 20, 0 ], // x1, y1, x2, y2
    [ 20, 0, 20, 20 ],
    [ 20, 20, 0, 20 ],
    [ 0, 20, 0, 0 ]
  ]

  const boundingBox = [
    0, 0, 20, 20 // x, y, width, height
  ]

  const intersections = rasterizePolygon(lineLoop, boundingBox, 1)

  const expected = [{
    intervals: [ 0, 20 ],
    box: { y: 0, height: 1 }
  }, {
    intervals: [ 0, 20 ],
    box: { y: 1, height: 1 }
  }, {
    intervals: [ 0, 20 ],
    box: { y: 2, height: 1 }
  }, {
    intervals: [ 0, 20 ],
    box: { y: 3, height: 1 }
  }, {
    intervals: [ 0, 20 ],
    box: { y: 4, height: 1 }
  }, {
    intervals: [ 0, 20 ],
    box: { y: 5, height: 1 }
  }, {
    intervals: [ 0, 20 ],
    box: { y: 6, height: 1 }
  }, {
    intervals: [ 0, 20 ],
    box: { y: 7, height: 1 }
  }, {
    intervals: [ 0, 20 ],
    box: { y: 8, height: 1 }
  }, {
    intervals: [ 0, 20 ],
    box: { y: 9, height: 1 }
  }, {
    intervals: [ 0, 20 ],
    box: { y: 10, height: 1 }
  }, {
    intervals: [ 0, 20 ],
    box: { y: 11, height: 1 }
  }, {
    intervals: [ 0, 20 ],
    box: { y: 12, height: 1 }
  }, {
    intervals: [ 0, 20 ],
    box: { y: 13, height: 1 }
  }, {
    intervals: [ 0, 20 ],
    box: { y: 14, height: 1 }
  }, {
    intervals: [ 0, 20 ],
    box: { y: 15, height: 1 }
  }, {
    intervals: [ 0, 20 ],
    box: { y: 16, height: 1 }
  }, {
    intervals: [ 0, 20 ],
    box: { y: 17, height: 1 }
  }, {
    intervals: [ 0, 20 ],
    box: { y: 18, height: 1 }
  }, {
    intervals: [ 0, 20 ],
    box: { y: 19, height: 1 }
  }]

  t.deepEquals(intersections, expected)

  t.end()
})

tape('rasterize polygon (concave)', t => {
  const lineLoop = [
    [ 0, 0, 5, 10 ], // x1, y1, x2, y2
    [ 5, 10, 7.5, 5 ],
    [ 7.5, 5, 10, 10 ],
    [ 10, 10, 15, 0 ],
    [ 15, 0, 0, 0 ]
  ]

  const boundingBox = [
    0, 0, 15, 10 // x, y, width, height
  ]

  const intersections = rasterizePolygon(lineLoop, boundingBox, 1)

  const expected = [{
    intervals: [0, 15],
    box: { y: 0, height: 1 }
  }, {
    intervals: [0.5, 14.5],
    box: { y: 1, height: 1 }
  }, {
    intervals: [1, 14],
    box: { y: 2, height: 1 }
  }, {
    intervals: [1.5, 13.5],
    box: { y: 3, height: 1 }
  }, {
    intervals: [2, 13],
    box: { y: 4, height: 1 }
  }, {
    intervals: [2.5, 7.5, 7.5, 12.5],
    box: { y: 5, height: 1 }
  }, {
    intervals: [3, 7, 8, 12],
    box: { y: 6, height: 1 }
  }, {
    intervals: [3.5, 6.5, 8.5, 11.5],
    box: { y: 7, height: 1 }
  }, {
    intervals: [4, 6, 9, 11],
    box: { y: 8, height: 1 }
  }, {
    intervals: [4.5, 5.5, 9.5, 10.5],
    box: { y: 9, height: 1 }
  }]

  t.deepEquals(intersections, expected)

  t.end()
})

tape('intersection', t => {
  const lineA = [ 0, 0, 1, 1 ] // bottom-left -> top-right
  const lineB = [ 0, 1, 1, 0 ] // top-left -> bottom-right

  const actual = intersect(lineA, lineB)

  t.deepEquals(actual, [ 0.5, 0.5 ], 'midpoint found')

  t.end()
})

tape('intersect bounding boxes', t => {
  const boxA = [ 0, 0, 1, 1 ]
  const boxB = [ 0.5, 0.5, 1, 1 ]

  t.equals(intersectAabb(boxA, boxB), true, 'boxes overlap')

  const boxC = [ 2, 2, 1, 1 ]
  t.equals(intersectAabb(boxA, boxC), false, `boxes don't overlap`)

  const boxD = [ 1, 1, 1, 1 ]
  t.equals(intersectAabb(boxA, boxD), true, `barely touching boxes overlap`)

  t.end()
})

tape('merge two rasterized polygons', t => {
  const square = [
    [ 0, 0, 20, 0 ], // x1, y1, x2, y2
    [ 20, 0, 20, 20 ],
    [ 20, 20, 0, 20 ],
    [ 0, 20, 0, 0 ]
  ]

  const squareBB = [
    0, 0, 20, 20 // x, y, width, height
  ]

  const squareBoxes = rasterizePolygon(square, squareBB, 1)

  const mounds = [
    [ 0, 0, 5, 10 ], // x1, y1, x2, y2
    [ 5, 10, 7.5, 5 ],
    [ 7.5, 5, 10, 10 ],
    [ 10, 10, 15, 0 ],
    [ 15, 0, 0, 0 ]
  ]

  const moundsBB = [
    1, 1, 15, 10 // x, y, width, height
  ]

  const moundsBoxes = rasterizePolygon(mounds, moundsBB, 1)

  const outputBoxes = mergeRasterizations(squareBoxes, squareBB, moundsBoxes, moundsBB)

  t.equals(outputBoxes.length, 20)
  t.deepEquals(outputBoxes[0].intervals, [ 0, 20 ])
  t.deepEquals(outputBoxes[1].intervals, [ 0, 1, 16, 20 ])
  t.deepEquals(outputBoxes[2].intervals, [ 0, 1.5, 15.5, 20 ])
  t.deepEquals(outputBoxes[3].intervals, [ 0, 2, 15, 20 ])
  t.deepEquals(outputBoxes[4].intervals, [ 0, 2.5, 14.5, 20 ])
  t.deepEquals(outputBoxes[5].intervals, [ 0, 3, 14, 20 ])
  t.deepEquals(outputBoxes[6].intervals, [ 0, 3.5, 8.5, 8.5, 13.5, 20 ])
  t.deepEquals(outputBoxes[7].intervals, [ 0, 4, 8, 9, 13, 20 ])
  t.deepEquals(outputBoxes[8].intervals, [ 0, 4.5, 7.5, 9.5, 12.5, 20 ])
  t.deepEquals(outputBoxes[9].intervals, [ 0, 5, 7, 10, 12, 20 ])
  t.deepEquals(outputBoxes[10].intervals, [ 0, 5.5, 6.5, 10.5, 11.5, 20 ])
  t.deepEquals(outputBoxes[11].intervals, [ 0, 20 ])
  t.deepEquals(outputBoxes[12].intervals, [ 0, 20 ])
  t.deepEquals(outputBoxes[13].intervals, [ 0, 20 ])
  t.deepEquals(outputBoxes[14].intervals, [ 0, 20 ])
  t.deepEquals(outputBoxes[15].intervals, [ 0, 20 ])
  t.deepEquals(outputBoxes[16].intervals, [ 0, 20 ])
  t.deepEquals(outputBoxes[17].intervals, [ 0, 20 ])
  t.deepEquals(outputBoxes[19].intervals, [ 0, 20 ])
  t.deepEquals(outputBoxes[19].intervals, [ 0, 20 ])

  for (let i = 0; i < outputBoxes.length; i++) {
    const box = outputBoxes[i].box
    t.equals(box.y, i)
    t.equals(box.height, 1)
  }

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  renderBoxes(outputBoxes, ctx, 10, 10)

  screenshot('merge-polygons', canvas, t)
})

tape('merge two more rasterized polygons', t => {
  const scaleX = 20
  const scaleY = 20
  const square = [
    [ 0, 0, 40, 0 ], // x1, y1, x2, y2
    [ 40, 0, 40, 40 ],
    [ 40, 40, 0, 40 ],
    [ 0, 40, 0, 0 ]
  ]

  const squareBB = [
    0, 0, 40, 40 // x, y, width, height
  ]

  const squareBoxes = rasterizePolygon(square, squareBB, 1)

  const mounds = [
    [ 0, 0, 10, 12 ], // x1, y1, x2, y2
    [ 10, 12, 8, 18 ],
    [ 8, 18, 13, 13 ],
    [ 13, 13, 18, 18 ],
    [ 18, 18, 16, 12 ],
    [ 16, 12, 26, 0 ],
    [ 26, 0, 13, 8 ],
    [ 13, 8, 0, 0 ]
  ]

  const moundsBB = [
    5, 3, 26, 18 // x, y, width, height
  ]

  const moundsBoxes = rasterizePolygon(mounds, moundsBB, 1)

  const outputBoxes = mergeRasterizations(squareBoxes, squareBB, moundsBoxes, moundsBB)

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  renderBoxes(outputBoxes, ctx, scaleX, scaleY)
  // draw the star box
  ctx.strokeStyle = 'orange'
  ctx.strokeRect(moundsBB[0] * scaleX, moundsBB[1] * scaleY, moundsBB[2] * scaleX, moundsBB[3] * scaleY)

  // draw the star shape
  ctx.strokeStyle = 'indigo'
  const [ firstX, firstY ] = mounds[0]
  ctx.moveTo((firstX + moundsBB[0]) * scaleX, (firstY + moundsBB[1]) * scaleY)
  for (let i = 0; i < mounds.length; i++) {
    const [ x1, y1 ] = mounds[i] // x1, y1, x2, y2
    ctx.lineTo((x1 + moundsBB[0]) * scaleX, (y1 + moundsBB[1]) * scaleY)
  }
  ctx.lineTo((firstX + moundsBB[0]) * scaleX, (firstY + moundsBB[1]) * scaleY)
  ctx.stroke()

  screenshot('merge-more-polygons', canvas, t)
})

function renderBoxes (textBoxes, renderContext, scaleX, scaleY) {
  for (let tb of textBoxes) {
    for (let i = 0; i < tb.intervals.length; i += 2) {
      const startX = tb.intervals[i]
      const endX = tb.intervals[i + 1]

      const finalX = 0 + (startX * scaleX)
      const finalY = 0 + (tb.box.y * scaleY)
      const finalW = (endX - startX) * scaleX
      const finalH = tb.box.height * scaleY

      renderContext.strokeStyle = 'teal'
      renderContext.strokeRect(finalX, finalY, finalW, finalH)
    }
  }
}
