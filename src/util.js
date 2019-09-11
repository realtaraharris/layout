'use strict'

function* circularDoublingIterator(array) {
  let firstIndex = -1
  let secondIndex = 0
  const elements = Array.isArray(array) ? array.slice() : []
  const length = elements.length

  while (length) {
    firstIndex = (firstIndex + 1) % length
    secondIndex = (secondIndex + 1) % length
    yield [...elements[firstIndex], ...elements[secondIndex]]
  }
}
exports.circularDoublingIterator = circularDoublingIterator

function* circularDoublingPeekingIterator(array) {
  let zerothIndex = array.length - 2
  let firstIndex = -1
  let secondIndex = 0
  let thirdIndex = 1

  const elements = Array.isArray(array) ? array.slice() : []
  const length = elements.length

  while (length) {
    zerothIndex = (zerothIndex + 1) % length
    firstIndex = (firstIndex + 1) % length
    secondIndex = (secondIndex + 1) % length
    thirdIndex = (thirdIndex + 1) % length

    yield {
      previousLine: [...elements[zerothIndex], ...elements[firstIndex]],
      currentLine: [...elements[firstIndex], ...elements[secondIndex]],
      nextLine: [...elements[secondIndex], ...elements[thirdIndex]]
    }
  }
}
exports.circularDoublingPeekingIterator = circularDoublingPeekingIterator
