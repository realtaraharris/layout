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
    parent: Component,
    children: children.filter(Boolean)
  };
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

function walkTreeBreadthFirst(treeRoot, depth, callback) {
  const queue = [{component: treeRoot, parent: null, depth}];

  while (queue.length > 0) {
    const {component, parent, childPosition} = queue.shift();
    callback({component, parent, childPosition, depth});

    if (component.children) {
      depth++;
      queue.push(
        ...component.children.map((c, index) => ({
          component: c,
          parent: component,
          childPosition: index
        }))
      );
    }
  }
}

function walkTreeReverseBreadthFirst(treeRoot, depth, callback) {
  const queue = [{component: treeRoot, parent: null, childPosition: 0, depth}];
  const stack = [];

  while (queue.length > 0) {
    const item = queue.shift();
    stack.push(item);

    if (item.component.children) {
      queue.push(
        ...item.component.children.map((component, childPosition) => ({
          component,
          parent: item.component,
          childPosition,
          depth: ++depth
        }))
      );
    }
  }

  while (stack.length > 0) {
    callback(stack.pop());
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
    traversalMode: 'down'
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
  // first pass: calculate shrinking box sizes
  walkTreeReverseBreadthFirst(
    treeRoot,
    0,
    ({component, parent, childPosition, depth}) => {
      component.instance.size(component.props, {
        renderContext,
        cache,
        parent,
        children: component.children,
        childPosition,
        // parentBox, // NB: no parentBox is available because we haven't created it yet!
        sizing: 'shrink',
        depth
      });
    }
  );

  // second pass: calculate expanding box sizes
  walkTreeBreadthFirst(
    treeRoot,
    0,
    ({component, parent, childPosition, depth}) => {
      const parentBox = parent && parent.instance.childBoxes[childPosition];
      component.instance.size(component.props, {
        renderContext,
        cache,
        parent,
        children: component.children,
        childPosition,
        parentBox,
        sizing: 'expand',
        depth
      });
    }
  );

  // third pass: calculate box positions
  walkTreeBreadthFirst(
    treeRoot,
    0,
    ({component, parent, childPosition, depth}) => {
      const parentBox = parent && parent.instance.childBoxes[childPosition];
      component.instance.position(component.props, {
        renderContext,
        cache,
        parent,
        children: component.children,
        childPosition,
        parentBox,
        positioning: '',
        depth
      });
    }
  );

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

module.exports = {
  c,
  render,
  layout,
  click,
  copyTree,
  addFontToCanvas
};
