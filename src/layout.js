'use strict';

function c(Methods, props, ...children) {
  const filteredChildren = children.filter(Boolean);
  const component = {
    instance: new Methods(props),
    props,
    children: filteredChildren
  };
  for (let child of filteredChildren) {
    child.parent = component;
  }
  return component;
}

function sizeDown(renderContext, component, cache) {
  // if we are a leaf node, start the up phase
  if (component.children.length === 0) {
    sizeUp(renderContext, component, null, cache);
  }

  for (let child of component.children) {
    sizeDown(renderContext, child, cache);
  }
}

function sizeUp(renderContext, component, childBox, cache) {
  let box = component.instance.size(
    renderContext,
    component.props,
    childBox,
    component.children.length,
    cache
  );

  // NB: if no box is returned, stop traversal per component API
  if (!component.parent || !box) {
    return;
  }

  sizeUp(renderContext, component.parent, box, cache);
}

function pickDown(component, rawEvent, eventName, result) {
  const {intersect} = component.instance;
  const intersection = intersect(rawEvent, eventName);

  if (intersection.hit) {
    result.push({
      component,
      box: intersection.box,
      childBox: intersection.childBox,
      event: intersection.event
    });
  }

  if (!intersection.descend) {
    return;
  }

  // if we are a leaf node, start the up phase
  if (component.children.length === 0) {
    pickUp(component, rawEvent, eventName, result);
  }

  for (let child of component.children) {
    pickDown(child, rawEvent, eventName, result);
  }
}

function pickUp(component, rawEvent, eventName, result) {
  const {box, parent} = component.instance;

  if (!parent || !box) {
    return;
  }

  return pickUp(parent, rawEvent, eventName, result);
}

function calcBoxPositions(
  renderContext,
  component,
  updatedParentPosition,
  cache
) {
  const position = component.instance.position(
    renderContext,
    component.props,
    updatedParentPosition,
    component.children.length,
    cache
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

    calcBoxPositions(renderContext, child, newPos, cache);
  }
}

function render(renderContext, component) {
  component.instance.render(renderContext, component.props);

  for (let i = 0; i < component.children.length; i++) {
    renderContext.save();
    render(renderContext, component.children[i]);
    renderContext.restore();
  }
}

function layout(renderContext, treeRoot, cache) {
  // calls each size function, ensuring that each component has a box
  sizeDown(renderContext, treeRoot, cache);

  // calls each position function. also fills in any missing boxes using size props
  calcBoxPositions(renderContext, treeRoot, {x: 0, y: 0}, cache);

  // console.log(util.inspect(treeRoot, false, null, true))
  return treeRoot;
}

function click(treeRoot, rawEvent, eventName) {
  let results = [];
  pickDown(treeRoot, rawEvent, eventName, results);

  if (results && results.length > 0) {
    for (let {component, box, childBox, event} of results) {
      if (component.props.onClick) {
        component.props.onClick({box, childBox, event});
      }
      if (component.props.onScroll) {
        component.props.onScroll({box, childBox, event});
      }
    }
  }
}

module.exports = {c, render, layout, click};
