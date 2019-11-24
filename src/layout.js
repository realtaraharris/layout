'use strict';

function c(Component, props, ...children) {
  return {
    Component,
    instance: new Component(props),
    props,
    children: children.filter(Boolean)
  };
}

function sizeDown({renderContext, component, cache, breadcrumbs}) {
  // if we are a leaf node, start the up phase
  if (component.children.length === 0) {
    sizeUp({renderContext, component, childBox: null, cache, breadcrumbs});
  } else {
    for (let child of component.children) {
      sizeDown({
        renderContext,
        component: child,
        cache,
        breadcrumbs: breadcrumbs.concat(component)
      });
    }
  }
}

function sizeUp({renderContext, component, childBox, cache, breadcrumbs}) {
  let box = component.instance.size(
    renderContext,
    component.props,
    childBox,
    component.children.length,
    cache
  );

  const parent = breadcrumbs.pop();

  // NB: if no box is returned, stop traversal per component API
  if (!box || !parent) {
    return;
  }

  sizeUp({renderContext, component: parent, childBox: box, cache, breadcrumbs});
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
  if (!component || !component.parent || !component.instance.box) {
    return;
  }

  return pickUp(component.parent, rawEvent, eventName, result);
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

function renderBaseLayer(renderContext, component) {
  if (component.props.layer) {
    return;
  }
  component.instance.render(renderContext, component.props);

  for (let i = 0; i < component.children.length; i++) {
    renderContext.save();
    renderBaseLayer(renderContext, component.children[i]);
    renderContext.restore();
  }
}

function collectLayers(renderContext, component, results) {
  const {layer} = component.props;

  if (layer) {
    results[layer].push(component);
  }

  for (let i = 0; i < component.children.length; i++) {
    collectLayers(renderContext, component.children[i], results);
  }
}

function render(renderContext, component) {
  let results = {};

  const layerNames =
    component.instance.constructor.name === 'Root' && component.props.layers
      ? component.props.layers
      : [];

  for (let layerName of layerNames) {
    results[layerName] = [];
  }

  collectLayers(renderContext, component, results);
  renderBaseLayer(renderContext, component);

  for (let layerName of layerNames) {
    const layer = results[layerName];
    if (!layer) {
      continue;
    }

    // render each result
    for (let c of layer) {
      renderContext.save();
      c.instance.render(renderContext, c.props);
      renderContext.restore();
    }
  }
}

function layout(renderContext, treeRoot, cache) {
  // calls each size function, ensuring that each component has a box
  sizeDown({renderContext, component: treeRoot, cache, breadcrumbs: []});

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
        component.props.onClick({box, childBox, event, component});
      }
      if (component.props.onScroll) {
        component.props.onScroll({box, childBox, event, component});
      }
    }
  }
}

function copyTree(oldTree) {
  const props = oldTree.props;
  return {
    Component: oldTree.Component,
    instance: new oldTree.Component(props),
    props,
    children: oldTree.children.map(child => copyTree(child, oldTree))
  };
}

module.exports = {c, render, layout, click, copyTree};
