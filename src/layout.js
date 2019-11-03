'use strict';

const encode = require('hashcode').hashCode;
const util = require('util');
const walk = require('tree-walk');
const {DepGraph} = require('dependency-graph');

function c(Methods, props, ...children) {
  const filteredChildren = children.filter(Boolean);

  const hash = encode().value(props);
  const methods = new Methods(); // TODO: rename to `instance
  const a = {
    methods,
    props,
    children: filteredChildren,
    Methods,
    hash,
    name: `${Methods.name}-${hash}`
  };
  a.methods.children = filteredChildren; // allow access to the children from the component instance!
  // a.methods.dirty = true;
  for (let child of filteredChildren) {
    child.methods.parent = a; // TODO: pick one!
    child.parent = a;
  }
  return a;
}

function assignIds(treeRoot, depth) {
  if (depth === 0) {
    treeRoot.name = `${treeRoot.Methods.name}-${depth}-${0}-${treeRoot.hash}`;
  }

  for (let breadth = 0; breadth < treeRoot.children.length; breadth++) {
    const child = treeRoot.children[breadth];
    child.name = `${child.Methods.name}-${depth + 1}-${breadth}-${child.hash}`;
    assignIds(child, depth + 1);
  }
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
  // if (component.methods.dirty) {
  // console.log('calling size method', component.Methods.name);
  component.methods.size(
    renderContext,
    component.props,
    childBox,
    component.children.length
  );
  // component.methods.dirty = false;
  // }
  // NB: if no box is returned, stop traversal per component API
  if (!component.methods.parent || !component.methods.parentBox) {
    return;
  }

  sizeUp(renderContext, component.methods.parent, component.methods.parentBox);
}

function walkUp(treeNode, visitor) {
  if (!treeNode || !treeNode.methods) {
    return;
  }
  visitor(treeNode, 'up');

  walkUp(treeNode.methods.parent, visitor);
}

function walkDown(treeNode, visitor) {
  // if we are a leaf node, start the up phase
  if (treeNode.children.length === 0) {
    return walkUp(treeNode, visitor);
  }

  // visitor(treeNode, 'down');

  for (const child of treeNode.children) {
    walkDown(child, visitor);
  }
}

function pickDown(component, rawEvent, eventName, result) {
  const {intersect} = component.methods;
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
  const {box, parent} = component.methods;

  if (!parent || !box) {
    return;
  }

  return pickUp(parent, rawEvent, eventName, result);
}

function calcBoxPositions(renderContext, component, updatedParentPosition) {
  // if (component.methods.dirty || !component.methods.positionInfo) {
  // component.methods.positionInfo = [];
  // const position =
  console.log(updatedParentPosition.x, updatedParentPosition.y);
  component.methods.position(
    renderContext,
    component.props,
    updatedParentPosition,
    component.children.length
  );
  // component.methods.dirty = false;
  // }

  if (component.children.length === 0) {
    return;
  }

  const position = component.methods.positionInfo;
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

  // console.log(util.inspect(treeRoot, false, null, true));
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

function shallowCompare(next, prev) {
  for (let key in next) {
    if (next[key] !== prev[key]) {
      return true;
    }
  }

  return false;
}

// function copyTree(previousTree, currentTree) {
//   if (!currentTree) {
//     debugger;
//   }

//   const currentHash = encode().value(currentTree.props);
//   const previousHash = previousTree.hash;

//   if (currentHash !== previousHash) {
//     console.log({
//       currentHash,
//       previousHash,
//       name: currentTree.Methods.name,
//       props: currentTree.props
//     });

//     currentTree.methods.dirty = true;
//   } else {
//     currentTree.methods.dirty = false;
//   }

//   let children = [];
//   for (let i = 0; i < previousTree.children.length; i++) {
//     const previousChild = previousTree.children[i];
//     const currentChild = currentTree.children[i];

//     const subtree = copyTree(previousChild, currentChild);
//     children.push(subtree);
//     // console.log(`i: ${i}`);
//   }

//   const component = c(previousTree.Methods, previousTree.props, ...children);

//   component.methods.deserialize(previousTree.methods.serialize());
//   return component;
// }

/**
 * Produces an array of transformations to apply to tree elements?
 * @param {*} previousTree
 * @param {*} currentTree
 */
function diffTree(previousTree, currentTree) {
  if (!previousTree || !currentTree) {
    return;
  }

  let diff = [];
  // TODO: consider writing these hashes in c()
  const currentHash = encode().value(currentTree.props);
  const previousHash = encode().value(previousTree.props);

  if (currentTree.name !== previousTree.name) {
    const componentChanged =
      currentTree.Methods.name !== previousTree.Methods.name;
    const hashChanged = currentHash !== previousHash;
    diff.push({componentChanged, hashChanged, previousTree, currentTree});
  }

  // if (previousTree.children.length > currentTree.children.length) {
  //   for (let i = 0; i < previousTree.children.length; i++) {
  //     const previousChild = previousTree.children[i];
  //     const currentChild = currentTree.children[i];
  //     if (previousChild.name !== currentChild.name||previousChild.){}
  //   }
  //   console.log('components removed from new tree');
  //   previousTree.children.map(child => {
  //     console.log('previousTree.children', child.name);
  //   });
  //   currentTree.children.map(child => {
  //     console.log('currentTree.children', child.name);
  //   });
  // } else if (previousTree.children.length < currentTree.children.length) {
  // } else { // the lengths are equal. the hashes could be different!
  // }

  let childrenRemovedCount = 0,
    childrenAddedCount = 0;
  if (previousTree.children.length > currentTree.children.length) {
    childrenRemovedCount =
      previousTree.children.length - currentTree.children.length;
  } else if (previousTree.children.length < currentTree.children.length) {
    childrenAddedCount =
      currentTree.children.length - previousTree.children.length;
  }

  const childCount = Math.min(
    previousTree.children.length,
    currentTree.children.length
  );

  console.log({childrenAddedCount, childrenRemovedCount});

  const previousNames = previousTree.children.map(child => child.name);
  const currentNames = currentTree.children.map(child => child.name);
  console.log({previousNames, currentNames});

  for (let i = 0; i < childCount; i++) {
    const previousChild = previousTree.children[i];
    const currentChild = currentTree.children[i];

    if (currentChild.name !== previousChild.name) {
      console.log('changed!', currentChild.name, previousChild.name);
    }

    diff.push(...diffTree(previousChild, currentChild));
  }

  let added = previousNames.filter(x => !currentNames.includes(x));
  let removed = currentNames.filter(x => !previousNames.includes(x));
  console.log({added, removed});

  return diff;
}

function applyDiff(renderContext, diff) {
  for (let d of diff) {
    const {previousTree, currentTree} = d;
    console.log({previousTree, currentTree});

    // TODO: figure out how to actually apply the diff we just printed!

    // d.previousTree = currentTree;
    // currentTree.methods.deserialize(previousTree.methods.serialize());
    // calcBoxPositions(renderContext, currentTree, {x: 0, y: 0});

    // layout(renderContext, currentTree);
  }
}

const childWalker = walk(node => node.children);

const modes = Object.freeze({
  SELF: Symbol('self'), // size depends entirely on self
  SELF_AND_CHILDREN: Symbol('self-and-children'), // size depends on self and child(ren)
  CHILDREN: Symbol('children'), // size depends entirely on child(ren)
  SELF_AND_PARENTS: Symbol('self-and-parents'), // size depends on self and parent(s)
  PARENTS: Symbol('parents') // size depends entirely on parent(s)
  // ... parent-children doesn't make sense
});

// put self, all children into the return list, *until* you run into a SELF node
function collectSelfAndChildren(graph, component) {
  for (let child of component.children) {
    graph.addNode(child.name, child);
    graph.addDependency(component.name, child.name);
    collectSelfAndChildren(graph, child);
  }
}

// put all children into the return list, *until* you run into a SELF node
function collectChildren(graph, component) {
  for (let child of component.children) {
    // this check prevents the top component of the subtree from getting added
    if (child === component) {
      continue;
    }
    graph.addNode(child.name, child);
    graph.addDependency(component.name, child.name);
    collectChildren(graph, child);
  }
}

// walk up, put self and all parents into return list, until you hit the root node, or a SELF node
function collectSelfAndParents(graph, component) {
  graph.addNode(component.name, component);

  const {parent} = component;
  if (parent) {
    graph.addNode(parent.name, parent);
    graph.addDependency(component.name, parent.name);
    collectSelfAndParents(graph, parent);
  }
}

// walk up, put all parents into return list, until you hit a SELF node
function collectParents(graph, component) {
  graph.addNode(component.name, component);

  const {parent} = component;
  if (parent) {
    graph.addNode(parent.name, parent);
    graph.addDependency(component.name, parent.name);
    collectParents(graph, parent);
  }
}

function calculateComponentDeps(graph, component, layoutMode) {
  graph.addNode(component.name, component);
  if (layoutMode === modes.SELF) {
  } else if (layoutMode === modes.SELF_AND_CHILDREN) {
    collectSelfAndChildren(graph, component);
  } else if (layoutMode === modes.CHILDREN) {
    collectChildren(graph, component);
  } else if (layoutMode === modes.SELF_AND_PARENTS) {
    collectSelfAndParents(graph, component);
  } else if (layoutMode === modes.PARENTS) {
    collectParents(graph, component);
  } else {
    console.error(`unhandled mode: ${layoutModes.sizeMode}`);
  }
}

function calcDependencies(treeRoot) {
  const sizeDeps = new DepGraph();
  const positionDeps = new DepGraph();

  childWalker.postorder(treeRoot, component => {
    const {sizeMode, positionMode} = component.methods.getLayoutModes();
    calculateComponentDeps(sizeDeps, component, sizeMode);
    calculateComponentDeps(positionDeps, component, positionMode);
  });

  return {sizeDeps, positionDeps};
}

module.exports = {
  c,
  render,
  layout,
  click,
  diffTree,
  applyDiff,
  calcDependencies,
  modes,
  assignIds,
  sizeDown,
  calcBoxPositions
};
