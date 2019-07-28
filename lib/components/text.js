'use strict'

const { Layout } = require('../components')
const { rasterizePolygon, mergeRasterizations } = require('../geometry')

/**
 * 
 * @param {*} list - [ 'But', 'I', 'must', 'explain' ]
 * @param {*} newItem - ' '
 * @param {returns} - [ 'But', ' ', 'I', ' ', 'must', ' ', 'explain' ]
 */
const intersperse = (list, newItem) => {
   let result = []
  const listLength = list.length - 1
  list.forEach((item, index) => {
    if (index < listLength) {
      result.push(item, newItem)
    } else {
      result.push(item)
    }
  })
  return result
}

// input: [ 'master', 'builder' ], splitChar: '-'
// returns: [ 'master-', 'builder' ]
const hyphenate = (input, splitChar) => input.map((token, index) => {
  const atEnd = index === input.length - 1
  return atEnd ? token : token + splitChar
})

// inputs: [ 'asdf asdf asdf asdf' ], ' ', intersperse
// input: [ 'asdf', ' ', 'asdf', ' ', 'asdf, ' ', 'asdf' ]
const split = (input, splitChar, handler) => {
  let result = []
  input.forEach(token => {
    const rawSplit = token.split(splitChar)
    if (rawSplit.length > 1) {
      const newTokens = handler(rawSplit, splitChar)
      newTokens.forEach(newToken => {
        result.push(newToken)
      })
    } else {
      result.push(token)
    }
  })
  return result
}

const measure = (ctx, text, splitChar, style) => {
  Object.assign(ctx, style) // we need to measure text with a particular style

  const tokenized = split(split(split([text], ' ', intersperse), '-', hyphenate), '\n', intersperse)

  return tokenized.map(token => {
    const textMetrics = ctx.measureText(token)

    return {
      token,
      width: textMetrics.width,
      height: textMetrics.emHeightAscent,
      lastRendered: false,
      displayDuration: 0
    }
  })
}

class Text extends Layout {
  constructor (text) {
    super()
    this.childBoxes = []
    this.textBoxes = null
  }

  size (renderContext, { width, height, text, style, boundingPolygon, cutoutPolygon, lineHeight }, childBox) {
    this.childBoxes.push(childBox)

    const tokens = measure(renderContext, text, ' ', style)
    this.tokens = tokens

    this.textBoxes = mergeRasterizations(
      rasterizePolygon(boundingPolygon.lineLoop, boundingPolygon.aabb, lineHeight),
      boundingPolygon.aabb,
      rasterizePolygon(cutoutPolygon.lineLoop, cutoutPolygon.aabb, lineHeight),
      cutoutPolygon.aabb
    )

    this.box = Object.assign({}, { width, height })
    return { width, height }
  }

  position (renderContext, { offsetX, offsetY }, updatedParentPosition) {
    this.box.x = updatedParentPosition.x
    this.box.y = updatedParentPosition.y

    return [updatedParentPosition]
  }

  render (renderContext, { lineHeight = 19, scrollPosition = 1, style }) {
    renderContext.strokeStyle = 'teal'
    renderContext.strokeRect(
      this.box.x,
      this.box.y,
      this.box.width,
      this.box.height
    )

    renderContext.beginPath()
    renderContext.rect(
      this.box.x,
      this.box.y,
      this.box.width,
      this.box.height
    )
    renderContext.clip()

    let tokenCursor = 0
    const tokensLength = this.tokens.length

    Object.assign(renderContext, style) // we need to paint text with a particular style

    let leadingNewline = false
    renderContext.fillStyle = 'white'
    for (let tb of this.textBoxes) {
      if (leadingNewline) {
        leadingNewline = false
        continue
      }

      for (let i = 0; i < tb.intervals.length; i += 2) {
        if (tokenCursor > tokensLength - 1) { return }

        const startX = tb.intervals[i]
        const endX = tb.intervals[i + 1]
        
        const finalX = this.box.x + (startX * 10)
        const finalY = this.box.y + (tb.box.y * 20)
        const finalW = (endX - startX) * 10
        const finalH = tb.box.height * 20

        let tempWidth = 0

        renderContext.strokeStyle = 'teal'
        renderContext.strokeRect(finalX, finalY, finalW, finalH)

        do {
          const token = this.tokens[tokenCursor]
          if (!token) { break }

          if (tempWidth >= finalW - token.width) { break }

          renderContext.fillText(token.token, finalX + tempWidth, finalY + 20)

          renderContext.strokeStyle = 'rgba(127, 63, 195, 0.6)'
          renderContext.strokeRect(finalX + tempWidth, finalY, token.width, 20)

          if (token.token === '\n') {
            leadingNewline = true
            tokenCursor++
            break
          }

          if (token.token === ' ' && (tempWidth === 0)) {
          } else {
            tempWidth += token.width
          }
          tokenCursor++
        } while (tempWidth < finalW) 
      }
    }
  }  
}

module.exports = Text
