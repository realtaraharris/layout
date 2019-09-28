'use strict';

class Cache {
  constructor() {
    this.cache = new Map();
  }

  set(key, value) {
    this.cache.set(key, value);
  }

  get(key) {
    return this.cache.get(key);
  }

  clear() {
    this.cache.clear();
  }
}

function c(Methods, props, ...children) {
  const methods = new Methods();

  const filteredChildren = children.filter(Boolean);
  const a = {Methods, methods, props, children: filteredChildren};
  for (let child of filteredChildren) {
    child.parent = a;
  }
  return a;
}

function sizeDown(renderContext, component, cache) {
  // if we are a leaf node, start the up phase
  if (component.children.length === 0) {
    sizeUp(renderContext, component, {}, cache);
  }

  for (let child of component.children) {
    sizeDown(renderContext, child, cache);
  }
}

function sizeUp(renderContext, component, childBox, cache) {
  // if (component.Methods.name === 'SpacedLine') {
  //   console.log({
  //     props: component.props,
  //     childBox,
  //     childCount: component.children.length
  //   });
  // }

  let box = component.methods.size(
    renderContext,
    component.props,
    childBox,
    component.children.length,
    cache
  );

  // if (component.Methods.name === 'SpacedLine') {
  //   console.log('box:', box);
  // }

  // NB: if no box is returned, stop traversal per component API
  if (!component.parent || !box) {
    return;
  }

  sizeUp(renderContext, component.parent, box, cache);
}

// function sizeUpNew(renderContext, component, childBox) {
//   const memo = JSON.stringify({
//     props: component.props,
//     childBox,
//     childCount: component.children.length
//   });

//   let box;
//   if (
//     !component.methods.memos.size ||
//     component.methods.memos.size.memo !== memo
//   ) {
//     console.log('recalculating', component.methods.constructor.name);
//     box = component.methods.size(
//       renderContext,
//       component.props,
//       childBox,
//       component.children.length
//     );

//     component.methods.memos.size = {
//       memo,
//       cache: box
//     };
//   } else {
//     box = component.methods.memos.size.cache;
//   }

//   console.log({box});

//   // NB: if no box is returned, stop traversal per component API
//   if (!component.parent || !box) {
//     return;
//   }

//   sizeUp(renderContext, component.parent, box);
// }

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

function copyDown(component) {
  let result = Object.assign({}, component);

  // TODO: when cloning instances as we do immediately above, something is going wrong.
  result.children = [];
  // console.log('result', result);

  if (result.Methods.name === 'SpacedLine') {
    console.log('doing deletion on', result.Methods.name);
    delete result.methods;
    result.methods = new result.Methods();
  }

  for (let child of component.children) {
    result.children.push(copyDown(child));
  }

  return result;
}

function calcBoxPositions(
  renderContext,
  component,
  updatedParentPosition,
  cache
) {
  // console.log('component.methods:', component.Methods.name);
  // if (component.Methods.name === 'SpacedLine') {
  //   console.log('component.children.length:', component.children.length);
  // }
  const position = component.methods.position(
    renderContext,
    component.props,
    updatedParentPosition,
    component.children.length
  );
  // console.log('position:', position);

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
  component.methods.render(renderContext, component.props);

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

module.exports = {c, render, layout, click, copyDown, Cache};
