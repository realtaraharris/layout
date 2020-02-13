'use strict';

const {DepGraph} = require('dependency-graph');
const encode = require('hashcode').hashCode;

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

  const filteredChildren = children.filter(Boolean);
  const instance = new Component(finalProps, filteredChildren.length);
  const hash = encode().value(finalProps);

  const result = {
    Component,
    instance,
    props: finalProps,
    children: filteredChildren,
    name: `${Component.name}-${hash}` // TODO: add depth, breadth
  };

  for (let i = 0; i < result.children.length; i++) {
    const child = result.children[i];
    child.parent = result;
    child.childPosition = i;
  }

  return result;
}

function copyTree(oldTree) {
  const props = oldTree.props;
  const children = oldTree.children.map(copyTree);
  const hash = encode().value(props);

  const result = {
    Component: oldTree.Component,
    instance: new oldTree.Component(props, children.length),
    props,
    children,
    name: `${oldTree.Component.name}-${hash}` // TODO: add depth, breadth
  };

  for (let i = 0; i < result.children.length; i++) {
    const child = result.children[i];
    child.parent = result;
    child.childPosition = i;
  }

  return result;
}

function walkTreeBreadthFirst(treeRoot, depth, callback) {
  const queue = [{component: treeRoot, depth}];

  while (queue.length > 0) {
    const {component} = queue.shift();
    callback({component, depth});
    queue.push(
      ...component.children.map(child => ({
        component: child,
        depth: ++depth
      }))
    );
  }
}

function walkTreeReverseBreadthFirst(treeRoot, depth, callback) {
  const queue = [{component: treeRoot, depth}];
  const stack = [];

  while (queue.length > 0) {
    const item = queue.shift();
    stack.push(item);
    queue.push(
      ...item.component.children.map(child => ({
        component: child,
        depth: ++depth
      }))
    );
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

// TODO: this is the last depth-first traversal. replace with walkTreeBreadthFirst
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

    // TODO: what is l?
    for (let l of layer) {
      renderContext.save();
      renderLayer(renderContext, l, layerName, 0);
      renderContext.restore();
    }
  }
}

class ShinyDepGraph extends DepGraph {
  addNodeAndDependency(newNode, componentName) {
    this.addNode(newNode.name, newNode);
    this.addDependency(componentName, newNode.name);
  }
}

const MAX_RETRIES = 10;
function layout(renderContext, treeRoot, cache) {
  const sizeDoneCallbacks = {};
  function collectSizeDone(groupId, continuationId, callback) {
    if (
      typeof groupId === 'undefined' ||
      typeof continuationId === 'undefined'
    ) {
      return;
    }

    if (!sizeDoneCallbacks[groupId]) {
      sizeDoneCallbacks[groupId] = {};
    }
    sizeDoneCallbacks[groupId][continuationId] = callback;
  }
  const redoList = [treeRoot];
  let retries = 0;

  while (redoList.length > 0 && retries < MAX_RETRIES) {
    const subtree = redoList.pop();
    const shrinkSizeDeps = new ShinyDepGraph();
    const expandSizeDeps = new ShinyDepGraph();

    // first pass: calculate shrinking box sizes
    walkTreeReverseBreadthFirst(subtree, 0, ({component, depth}) => {
      const parentBox =
        component.parent &&
        component.parent.instance.childBoxes[component.childPosition];
      component.instance.size(component.props, {
        renderContext,
        cache,
        component,
        parentBox,
        sizing: 'shrink',
        depth,
        shrinkSizeDeps,
        expandSizeDeps,
        redoList,
        collectSizeDone
      });
    });

    // second pass: calculate expanding box sizes
    walkTreeBreadthFirst(subtree, 0, ({component, depth}) => {
      const parentBox =
        component.parent &&
        component.parent.instance.childBoxes[component.childPosition];
      component.instance.size(component.props, {
        renderContext,
        cache,
        component,
        parentBox,
        sizing: 'expand',
        depth,
        shrinkSizeDeps,
        expandSizeDeps,
        redoList,
        collectSizeDone
      });
    });

    retries++;
  }

  if (Object.keys(sizeDoneCallbacks).length > 0) {
    for (let group in sizeDoneCallbacks) {
      Object.keys(sizeDoneCallbacks[group])
        .sort()
        .forEach(key => {
          sizeDoneCallbacks[group][key]();
        });
    }
  }

  // third pass: calculate box positions
  walkTreeBreadthFirst(treeRoot, 0, ({component, depth}) => {
    const parentBox =
      component.parent &&
      component.parent.instance.childBoxes[component.childPosition];
    component.instance.position(component.props, {
      renderContext,
      cache,
      component,
      parentBox,
      depth
    });
  });

  return treeRoot;
}

function click(treeRoot, rawEvent, eventName) {
  let results = [];
  walkTreeBreadthFirst(treeRoot, 0, ({component}) => {
    const {intersect} = component.instance;
    const intersection = intersect(rawEvent, eventName);

    if (intersection.hit) {
      results.push({
        component,
        box: intersection.box,
        childBox: intersection.childBox,
        event: intersection.event
      });
    }
  });

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

module.exports = {
  c,
  render,
  layout,
  click,
  copyTree
};
