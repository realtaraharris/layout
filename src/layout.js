'use strict';

const {DepGraph} = require('dependency-graph');
const encode = require('hashcode').hashCode;

function c(componentOrFunction, props, ...children) {
  const type = typeof componentOrFunction;

  let Component, connectedProps;
  if (type === 'object') {
    Component = componentOrFunction.Component;
    connectedProps = componentOrFunction.getProps();
  } else if (type === 'function') {
    Component = componentOrFunction;
  }

  const finalProps = connectedProps
    ? Object.assign({}, props, connectedProps)
    : props;
  const filteredChildren = children.flat().filter(Boolean);
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

function walkTreeBreadthFirst(treeRoot, initialDepth, callback) {
  const queue = [{component: treeRoot, depth: initialDepth, path: '0'}];

  while (queue.length > 0) {
    const {component, depth, path} = queue.shift();
    callback({component, depth, path});
    queue.push(
      ...component.children.map(child => ({
        component: child,
        depth: depth + 1,
        path: `${path}-${child.childPosition}`
      }))
    );
  }
}

function walkTreeReverseBreadthFirst(treeRoot, initialDepth, callback) {
  const queue = [{component: treeRoot, depth: initialDepth, path: '0'}];
  const stack = [];

  while (queue.length > 0) {
    const {component, depth, path} = queue.shift();
    stack.push({component, depth, path});

    queue.push(
      ...component.children.map(child => ({
        component: child,
        depth: depth + 1,
        path: `${path}-${child.childPosition}`
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
  // first pass: apply props from Context components to their subtrees
  let contextNodes = [];
  walkTreeBreadthFirst(treeRoot, 0, ({component}) => {
    if (component.instance.constructor.name === 'Context') {
      contextNodes.push(component);
    }
  });
  for (let node of contextNodes) {
    walkTreeBreadthFirst(node, 0, ({component}) => {
      Object.assign(component.props, node.props);
    });
  }

  // second pass: calculate box sizes
  const sizeDoneCallbacks = {};
  const collectSizeDone = (groupId, itemId, callback) => {
    if (typeof groupId === 'undefined' || typeof itemId === 'undefined') {
      return;
    }

    if (!sizeDoneCallbacks[groupId]) {
      sizeDoneCallbacks[groupId] = {};
    }
    sizeDoneCallbacks[groupId][itemId] = callback;
  };
  const sizeRedoList = [treeRoot];
  let sizeRetries = 0;
  while (sizeRedoList.length > 0 && sizeRetries < MAX_RETRIES) {
    const subtree = sizeRedoList.pop();
    const shrinkSizeDeps = new ShinyDepGraph();
    const expandSizeDeps = new ShinyDepGraph();

    // first pass: calculate shrinking box sizes
    walkTreeReverseBreadthFirst(subtree, 0, ({component, depth, path}) => {
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
        redoList: sizeRedoList,
        collectSizeDone,
        path
      });
    });

    // second pass: calculate expanding box sizes
    walkTreeBreadthFirst(subtree, 0, ({component, depth, path}) => {
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
        redoList: sizeRedoList,
        collectSizeDone,
        path
      });
    });

    sizeRetries++;
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
  const positionRedoList = [treeRoot];
  let positionRetries = 0;
  let accumulatedVector = {x: 0, y: 0};

  while (positionRedoList.length > 0 && positionRetries < MAX_RETRIES) {
    const subtree = positionRedoList.pop();
    const positionDeps = new ShinyDepGraph({circular: true});

    const positionDoneCallbacks = {};
    const collectPositionDone = (groupId, itemId, callback) => {
      if (typeof groupId === 'undefined' || typeof itemId === 'undefined') {
        return;
      }

      if (!positionDoneCallbacks[groupId]) {
        positionDoneCallbacks[groupId] = {};
      }
      positionDoneCallbacks[groupId][itemId] = callback;
    };

    walkTreeBreadthFirst(subtree, 0, ({component, depth}) => {
      const parentBox =
        component.parent &&
        component.parent.instance.childBoxes[component.childPosition];
      component.instance.position(component.props, {
        renderContext,
        cache,
        component,
        parentBox,
        depth,
        positionDeps,
        redoList: positionRedoList,
        collectPositionDone,
        positionRetries: positionRetries
      });
    });
    positionRetries++;

    if (Object.keys(positionDoneCallbacks).length > 0) {
      for (let group in positionDoneCallbacks) {
        Object.keys(positionDoneCallbacks[group])
          .sort()
          .forEach(key => {
            positionDoneCallbacks[group][key](accumulatedVector);
          });
      }
    }
  }

  return treeRoot;
}

function key(treeRoot, rawEvent, eventName) {
  walkTreeBreadthFirst(treeRoot, 0, ({component}) => {
    if (component.props.onKeyDown && eventName === 'keydown') {
      component.props.onKeyDown({eventName, rawEvent, component});
    }
    if (component.props.onKeyPress && eventName === 'keypress') {
      component.props.onKeyPress({eventName, rawEvent, component});
    }
    if (component.props.onKeyUp && eventName === 'keyup') {
      component.props.onKeyUp({eventName, rawEvent, component});
    }
  });
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
  key,
  copyTree
};
