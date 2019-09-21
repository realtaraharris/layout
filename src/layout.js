'use strict';

function c(Methods, props, ...children) {
  const a = {methods: new Methods(), props, children};
  for (let child of children) {
    child.parent = a;
  }
  return a;
}

function sizeDown(renderContext, component) {
  // if we are a leaf node, start the up phase
  if (component.children.length === 0) {
    sizeUp(renderContext, component);
  }

  for (let child of component.children) {
    sizeDown(renderContext, child);
  }
}

function sizeUp(renderContext, component, childBox) {
  let box = component.methods.size(
    renderContext,
    component.props,
    childBox,
    component.children.length
  );

  // NB: if no box is returned, stop traversal per component API
  if (!component.parent || !box) {
    return;
  }

  sizeUp(renderContext, component.parent, box);
}

function pickDown(component, x, y) {
  // if we are a leaf node, start the up phase
  if (component.children.length === 0) {
    const possibleComponent = pickUp(component, x, y);
    if (possibleComponent) {
      return possibleComponent;
    }
  }

  for (let child of component.children) {
    const possibleComponent = pickDown(child, x, y);
    if (possibleComponent) {
      return possibleComponent;
    }
  }
}

function pickUp(component, x, y) {
  const {box, parent} = component.methods;
  if (
    x >= box.x &&
    x <= box.x + box.width &&
    y >= box.y &&
    y <= box.y + box.height
  ) {
    return component;
  }

  // NB: if no box is returned, stop traversal per component API
  if (!parent || !box) {
    return;
  }

  return pickUp(parent, x, y);
}

function calcBoxPositions(renderContext, component, updatedParentPosition) {
  const position = component.methods.position(
    renderContext,
    component.props,
    updatedParentPosition,
    component.children.length
  );

  if (component.children.length === 0) {
    return;
  }

  if (position.length !== component.children.length) {
    console.error(
      'scratch position count does not match child count',
      position.length,
      component.children.length
    );
  }

  for (let i = 0; i < component.children.length; i++) {
    const child = component.children[i];
    const newPos = position[i];

    calcBoxPositions(renderContext, child, newPos);
  }
}

function r(renderContext, component) {
  component.methods.render(renderContext, component.props);

  for (let i = 0; i < component.children.length; i++) {
    renderContext.save();
    r(renderContext, component.children[i]);
    renderContext.restore();
  }
}

function renderRoot(renderContext, treeRoot) {
  // calls each size function, ensuring that each component has a box
  sizeDown(renderContext, treeRoot);

  // calls each position function. also fills in any missing boxes using size props
  calcBoxPositions(renderContext, treeRoot, {x: 0, y: 0});

  r(renderContext, treeRoot);

  // console.log(util.inspect(treeRoot, false, null, true))
  return treeRoot;
}

function pickComponent(treeRoot, x, y) {
  return pickDown(treeRoot, x, y);
}

module.exports = {c, renderRoot, pickComponent};
