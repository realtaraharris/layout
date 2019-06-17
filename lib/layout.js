'use strict'

const util = require('util')

function c(name, methods, props, ...children) {
  const a = { methods, name, props, children }
  for (let child of children) {
    child.parent = a
  }
  return a
}

function down(renderContext, component) {
  // if we are a leaf node, start the up phase
  if (component.children.length === 0) {
    up(renderContext, component)
  }
  
  for (let child of component.children) {
    down(renderContext, child)
  }
}

function up(renderContext, component, childBox) {
  let box = component.methods.size(renderContext, component.props, childBox, component.children.length)

  // NB: if no box is returned, stop traversal per component API
  if (!component.parent || !box) { return }

  up(renderContext, component.parent, box)
}

function calcBoxPositions(renderContext, component, updatedParentPosition) {
  const position = component.methods.position(renderContext, component.props, updatedParentPosition, component.children.length)

  if (component.children.length === 0) { return }

  if (position.length !== component.children.length) {
    console.error('scratch position count does not match child count', position.length, component.children.length)
  }
  
  for (let i = 0; i < component.children.length; i++) {
    const child = component.children[i]
    const newPos = position[i]

    calcBoxPositions(renderContext, child, newPos)
  }
}

function r(renderContext, component) {
  component.methods.render(renderContext, component.props)

  for (let i = 0; i < component.children.length; i++) {
    r(renderContext, component.children[i])
  }
}

function renderRoot (renderContext, root) {
  renderContext.fillStyle = 'indigo'
  renderContext.fillRect(0, 0, 800, 600)

  // calls each size function, ensuring that each component has a box
  down(renderContext, root)

  // calls each position function. also fills in any missing boxes using size props
  calcBoxPositions(renderContext, root, { x: 0, y: 0 })

  r(renderContext, root)

  // console.log(util.inspect(root, false, null, true))
}

module.exports = { c, renderRoot }
