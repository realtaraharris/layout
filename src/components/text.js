'use strict'

const { Layout } = require('../components')
const { insertSorted } = require('../geometry')
const { fromPolygons } = require('../../lib/csg/src/csg')

const createHyphenator = require('hyphen')
const hyphenationPatternsEnUs = require('hyphen/patterns/en-us')

function split(input, ctx, style) {
  // first split by newlines, ensuring that the newlines make it through as tokens, then split on whitespace
  const words = input
    .split(/(\n)/)
    .reduce((accum, current) => accum.concat(current.split(/[ [\]/\\]+/)), [])

  Object.assign(ctx, style) // we need to measure text with a particular style

  let result = []
  for (let i = 0; i < words.length; i++) {
    const word = words[i]

    const syllables = word.split('*')

    if (syllables.length > 1) {
      const measurements = syllables.map(syl => {
        const textMetrics = ctx.measureText(syl)

        return {
          width: textMetrics.width,
          height: textMetrics.emHeightAscent
        }
      })

      result.push({
        token: syllables,
        type: 'syllables',
        measurements
      })
    } else {
      const textMetrics = ctx.measureText(word)
      result.push({
        token: word,
        type: 'word',
        width: textMetrics.width,
        height: textMetrics.emHeightAscent
      })
    }
  }

  return result
}

function polyToBoundingBoxX(polygon) {
  let minX
  let maxX = 0

  for (let { x } of polygon) {
    if (minX === undefined || x < minX) {
      minX = x
    } else if (x > maxX) {
      maxX = x
    }
  }

  return [minX, maxX]
}

function getRowBoxes(i, stepHeight, width, polygons) {
  let boxes = []
  const y = i * stepHeight
  const maxY = y + stepHeight
  const linePolygon = fromPolygons([
    [[0, y], [width, y], [width, maxY], [0, maxY]]
  ])
  const splitPolys = polygons.intersect(linePolygon).toPolygons()

  // as we get the horizontal boxes, get the bounding x coords
  const row = []
  for (const splitPolygon of splitPolys) {
    if (splitPolygon.length < 3) {
      continue
    } // filter out points, lines

    const [minX, maxX] = polyToBoundingBoxX(splitPolygon, y, maxY)

    if (minX === maxX) {
      continue
    }

    insertSorted(row, minX) // ensure that each box will be sorted by the x coord
    insertSorted(row, maxX)
  }

  for (let j = 0; j < row.length - 1; j += 2) {
    const minX = row[j]
    const maxX = row[j + 1]

    boxes.push({
      startX: minX,
      endX: maxX,
      startY: y,
      endY: maxY,
      lineIndex: i
    })
  }

  return boxes
}

function textPolyCutup(polygons, stepHeight, width, height) {
  let result = []
  const steps = Math.floor(height / stepHeight)
  for (let i = 0; i < steps - 1; i++) {
    result.push(...getRowBoxes(i, stepHeight, width, polygons))
  }

  return result
}

class Text extends Layout {
  constructor() {
    super()
    this.childBoxes = []
    this.textBoxes = null
  }

  size(
    renderContext,
    { width, height, text, style, polygons, lineHeight },
    childBox
  ) {
    this.childBoxes.push(childBox)

    const hyphen = createHyphenator(hyphenationPatternsEnUs, {
      hyphenChar: '*'
    })
    const syl = hyphen(text)

    this.tokens = split(syl, renderContext, style)

    this.textBoxes = textPolyCutup(polygons, lineHeight, width, height)

    this.dashWidth = renderContext.measureText('-').width
    this.spaceWidth = renderContext.measureText(' ').width

    this.box = Object.assign({}, { width, height })
    return { width, height }
  }

  position(renderContext, props, updatedParentPosition) {
    this.box.x = updatedParentPosition.x
    this.box.y = updatedParentPosition.y

    return [updatedParentPosition]
  }

  render(renderContext, { showBoxes = false, lineHeight = 20, style }) {
    const { dashWidth, spaceWidth } = this

    if (showBoxes) {
      renderContext.strokeStyle = 'teal'
      renderContext.strokeRect(
        this.box.x,
        this.box.y,
        this.box.width,
        this.box.height
      )
    }

    renderContext.beginPath()
    renderContext.rect(this.box.x, this.box.y, this.box.width, this.box.height)
    renderContext.clip()

    Object.assign(renderContext, style) // we need to paint text with a particular style

    let syllableCounter = 0
    let tokenCursor = 0
    let lastLineVisited = 0
    for (const { startX, endX, startY, endY, lineIndex } of this.textBoxes) {
      const finalX = this.box.x + startX
      const finalY = this.box.y + startY
      const finalW = endX - startX
      const finalH = endY - startY

      let tempWidth = 0

      if (showBoxes) {
        renderContext.strokeStyle = 'teal'
        renderContext.strokeRect(finalX, finalY, finalW, finalH)
      }

      while (tempWidth < finalW) {
        const token2 = this.tokens[tokenCursor]
        if (!token2) {
          break
        }

        if (token2.token === '\n') {
          tokenCursor++ // don't render the newline token
          lastLineVisited = lineIndex + 1
          break // skip to the next box
        }

        if (lineIndex < lastLineVisited) {
          break
        }

        if (token2.type === 'word') {
          if (tempWidth > finalW - token2.width) {
            lastLineVisited = lineIndex
            break
          }

          renderContext.fillText(
            token2.token,
            finalX + tempWidth,
            finalY + lineHeight
          )

          // if (showBoxes) {
          //   renderContext.strokeStyle = 'rgba(127, 63, 195, 0.6)'
          //   renderContext.strokeRect(finalX + tempWidth, finalY, token2.width, 20)
          // }

          tempWidth += token2.width + spaceWidth
          tokenCursor++
        } else if (token2.type === 'syllables') {
          while (token2.token[syllableCounter]) {
            const syl = token2.token[syllableCounter]
            const meas = token2.measurements[syllableCounter].width

            if (tempWidth + meas + dashWidth <= finalW) {
              if (showBoxes) {
                renderContext.strokeStyle = 'rgba(127, 63, 195, 0.6)'
                renderContext.strokeRect(
                  finalX + tempWidth,
                  finalY,
                  meas,
                  lineHeight
                )
              }

              renderContext.fillText(
                syl,
                finalX + tempWidth,
                finalY + lineHeight
              )
              tempWidth += meas
              syllableCounter++
            } else if (syllableCounter > 0) {
              renderContext.fillText(
                '-',
                finalX + tempWidth,
                finalY + lineHeight
              )
              lastLineVisited = lineIndex
              break
            } else {
              lastLineVisited = lineIndex
              break
            }
          }

          if (syllableCounter >= token2.token.length) {
            syllableCounter = 0
            tokenCursor++
            tempWidth += spaceWidth
          } else {
            lastLineVisited = lineIndex
            break
          }
        } else {
          console.error('invalid type:', token2.type)
        }
      }
    }
  }
}

module.exports = { Text, textPolyCutup }
