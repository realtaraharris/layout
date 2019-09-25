'use strict';

function c(Methods, props, ...children) {
  const filteredChildren = children.filter(Boolean);
  const a = {methods: new Methods(), props, children: filteredChildren};
  for (let child of filteredChildren) {
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

function pickDown(component, x, y, result) {
  const {intersect} = component.methods;
  const intersection = intersect(x, y);

  if (intersection.hit) {
    result.push(component);
  }

  if (!intersection.descend) {
    return;
  }

  // if we are a leaf node, start the up phase
  if (component.children.length === 0) {
    pickUp(component, x, y, result);
  }

  for (let child of component.children) {
    pickDown(child, x, y, result);
  }
}

function pickUp(component, x, y, result) {
  const {box, parent} = component.methods;

  if (!parent || !box) {
    return;
  }

  return pickUp(parent, x, y, result);
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

function render(renderContext, component) {
  component.methods.render(renderContext, component.props);

  for (let i = 0; i < component.children.length; i++) {
    renderContext.save();
    render(renderContext, component.children[i]);
    renderContext.restore();
  }
}

function layout(renderContext, treeRoot) {
  // calls each size function, ensuring that each component has a box
  sizeDown(renderContext, treeRoot);

  // calls each position function. also fills in any missing boxes using size props
  calcBoxPositions(renderContext, treeRoot, {x: 0, y: 0});

  // console.log(util.inspect(treeRoot, false, null, true))
  return treeRoot;
}

function click(treeRoot, x, y) {
  let results = [];
  pickDown(treeRoot, x, y, results);

  if (results && results.length > 0) {
    for (let c of results) {
      if (c.props.onClick) {
        c.props.onClick();
      }
    }
  }
}

module.exports = {c, render, layout, click};
