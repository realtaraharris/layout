'use strict';

const opentype = require('opentype.js');

function c(componentOrFunction, props, ...children) {
  const type = typeof componentOrFunction;

  let Component, connectedProps;
  if (type === 'object') {
    Component = componentOrFunction.Component;
    connectedProps = componentOrFunction.props;
  } else if (type === 'function') {
    Component = componentOrFunction;
  }

  const finalProps = connectedProps
    ? Object.assign({}, connectedProps, props)
    : props;

  return {
    Component,
    instance: new Component(finalProps),
    props: finalProps,
    children: children.filter(Boolean)
  };
}

function dumpChildBoxes(childBoxes, message) {
  if (childBoxes) {
    for (let childBox of childBoxes) {
      if (!childBox) {
        continue;
      }
      console.log(
        `${message}. childBox.width: ${childBox.width}, childBox.height: ${childBox.height}`
      );
    }
  }
}

function leftPad(distance, character) {
  let scratch = '';
  for (let i = 0; i < distance; i++) {
    scratch += character;
  }
  return scratch;
}

function fixed(number) {
  if (typeof number === 'number') {
    return number.toFixed(2);
  }
  return '-';
}

function printBox({x, y, width, height}) {
  return `x: ${fixed(x)} y: ${fixed(y)} width: ${fixed(width)} height: ${fixed(
    height
  )}`;
}

function printChildBoxes(childBoxes, padding) {
  if (childBoxes) {
    return childBoxes
      .map(childBox => `${padding}  ${printBox(childBox)}`)
      .join('\n');
  }
  return `${padding}-`;
}

function dumpTree(component, depth) {
  const {box, childBoxes} = component.instance;
  const {name} = component.instance.constructor;

  const padding = leftPad(depth * 2, ' ');
  const subPadding = padding + '  ';
  console.log(
    `${padding}${name}\n${subPadding}box: ${printBox(
      box
    )}\n${subPadding}childBoxes:\n${printChildBoxes(childBoxes, subPadding)}`
  );

  for (let child of component.children) {
    dumpTree(child, depth + 1);
  }
}

function expandingSizeDown({
  renderContext,
  component,
  parent,
  cache,
  childPosition,
  depth
}) {
  // if (component.instance.flowMode() === 'shrink') {
  // // if (component.instance.constructor.name === 'ExpandingFlowBox') {
  // console.log(`sizing down ${component.instance.constructor.name}`);
  // parent &&
  //   parent.instance &&
  //   dumpChildBoxes(parent.instance.childBoxes, 'before');
  component.instance.size(component.props, {
    renderContext,
    cache,
    parent,
    children: component.children,
    mode: 'down',
    childPosition,
    depth
  });
  // dumpChildBoxes(component.instance.childBoxes, 'after');

  if (!component) {
    return;
  }

  for (
    let childPosition = 0;
    childPosition < component.children.length;
    childPosition++
  ) {
    console.log('layout.js/childPosition:', childPosition);
    const child = component.children[childPosition];
    expandingSizeDown({
      renderContext,
      component: child,
      parent: component,
      cache,
      childPosition,
      depth: depth + 1
    });
  }
}

function shrinkingSizeDown({renderContext, component, cache, breadcrumbs}) {
  // if we are a leaf node, start the up phase
  if (component.children.length === 0) {
    shrinkingSizeUp({
      renderContext,
      component,
      childBox: null,
      cache,
      breadcrumbs
    });
  } else {
    for (let child of component.children) {
      shrinkingSizeDown({
        renderContext,
        component: child,
        cache,
        breadcrumbs: breadcrumbs.concat(component)
      });
    }
  }
}

function shrinkingSizeUp({
  renderContext,
  component,
  childBox,
  cache,
  breadcrumbs
}) {
  let box;
  // if (component.instance.constructor.name !== 'ExpandingFlowBox') {
  const parent = breadcrumbs.pop();
  box = component.instance.size(component.props, {
    renderContext,
    childBox,
    childCount: component.children.length,
    cache,
    parent,
    children: component.children,
    mode: 'up'
  });
  // }

  // NB: if no box is returned, stop traversal per component API
  if (!box || !parent) {
    return;
  }

  shrinkingSizeUp({
    renderContext,
    component: parent,
    childBox: box,
    cache,
    breadcrumbs
  });
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

function calcBoxPositions({
  renderContext,
  component,
  updatedParentPosition,
  cache,
  parent,
  childPosition
}) {
  const position = component.instance.position(component.props, {
    renderContext,
    updatedParentPosition,
    childCount: component.children.length,
    cache,
    children: component.children,
    mode: 'down',
    parent,
    childPosition
  });

  if (component.children.length === 0) {
    return;
  }

  if (position.length !== component.children.length) {
    console.error(
      'scratch position count does not match child count',
      position.length,
      component.children.length,
      component.instance.constructor.name
    );
  }

  for (let i = 0; i < component.children.length; i++) {
    const child = component.children[i];
    const newPos = position[i];

    calcBoxPositions({
      renderContext,
      component: child,
      updatedParentPosition: newPos,
      cache,
      parent: component,
      childPosition: i
    });
  }
}

function renderLayer(renderContext, component, layerName, position) {
  const {layer} = component.props;
  if (layer && layerName !== layer) {
    return;
  }
  component.instance.render(component.props, {
    renderContext,
    position,
    mode: 'down'
  });

  for (let i = 0; i < component.children.length; i++) {
    renderContext.save();
    renderLayer(renderContext, component.children[i], layerName, i);
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
  renderLayer(renderContext, component, 'base', 0); // render the base layer first

  for (let layerName of layerNames) {
    const layer = results[layerName];
    if (!layer) {
      continue;
    }

    for (let l of layer) {
      renderContext.save();
      renderLayer(renderContext, l, layerName, 0);
      renderContext.restore();
    }
  }
}

function layout(renderContext, treeRoot, cache) {
  // first pass: calculate the shrinking box sizes
  shrinkingSizeDown({
    renderContext,
    component: treeRoot,
    cache,
    breadcrumbs: []
  });

  // second pass: calculate the expanding box sizes
  expandingSizeDown({
    renderContext,
    component: treeRoot,
    parent: null,
    cache,
    depth: 0
  });

  // third pass: calculate the box positions and also update some box sizes
  calcBoxPositions({
    renderContext,
    component: treeRoot,
    updatedParentPosition: {x: 0, y: 0},
    cache,
    childPosition: 0
  });

  return treeRoot;
}

function click(treeRoot, rawEvent, eventName) {
  let results = [];
  pickDown(treeRoot, rawEvent, eventName, results);

  if (results && results.length > 0) {
    for (let {component, box, childBox, event} of results) {
      if (component.props.onClick && eventName === 'click') {
        component.props.onClick({box, childBox, event, component, eventName});
      }
      if (component.props.onMouseDown && eventName === 'mousedown') {
        component.props.onMouseDown({
          box,
          childBox,
          event,
          component,
          eventName
        });
      }
      if (component.props.onMouseMove && eventName === 'mousemove') {
        component.props.onMouseMove({
          box,
          childBox,
          event,
          component,
          eventName
        });
      }
      if (component.props.onMouseUp && eventName === 'mouseup') {
        component.props.onMouseUp({box, childBox, event, component, eventName});
      }
      if (component.props.onScroll) {
        component.props.onScroll({box, childBox, event, component, eventName});
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

/**
 * makes the font available to canvas
 * @param {*} name - font name
 * @param {*} weight - font weight
 * @param {*} buffer - buffer containing font data
 */
const addFontToCanvasBrowser = async (name, weight, buffer) => {
  const fontName = `${name}-${weight}`;
  const font = new FontFace(fontName, buffer);
  await font.load();
  document.fonts.add(font);

  const options = {};
  return opentype.parse(buffer, options);
};

/**
 * makes the font available to canvas
 * @param {*} name - font name
 * @param {*} weight - font weight
 * @param {*} buffer - buffer containing font data
 */
const addFontToCanvasNode = async (name, weight, buffer) => {
  const options = {};
  return opentype.parse(buffer, options);
};

/**
 * makes the font available to canvas
 * @param {*} name - font name
 * @param {*} weight - font weight
 * @param {*} buffer - buffer containing font data
 */
const addFontToCanvas = async (name, weight, buffer) => {
  const isBrowser =
    typeof window !== 'undefined' && typeof window.document !== 'undefined';

  if (isBrowser) {
    return addFontToCanvasBrowser(name, weight, buffer);
  } else {
    return addFontToCanvasNode(name, weight, buffer);
  }
};

module.exports = {c, render, layout, click, copyTree, addFontToCanvas};
