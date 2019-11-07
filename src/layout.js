'use strict';

const encode = require('hashcode').hashCode;
const util = require('util');
// const walk = require('tree-walk');
// const {DepGraph} = require('dependency-graph');

const modes = Object.freeze({
  SELF: Symbol('self'), // size depends entirely on self
  SELF_AND_CHILDREN: Symbol('self-and-children'), // size depends on self and child(ren)
  CHILDREN: Symbol('children'), // size depends entirely on child(ren)
  SELF_AND_PARENTS: Symbol('self-and-parents'), // size depends on self and parent(s)
  PARENTS: Symbol('parents') // size depends entirely on parent(s)
  // ... parent-children doesn't make sense
});

function c(Component, props, ...allChildren) {
  const children = allChildren.filter(Boolean);
  const instance = new Component();

  const component = {
    instance,
    props,
    children
  };

  for (let child of children) {
    child.parent = component;
  }
  return component;
}

/*
function hashesDown(component) {
  const selfHash = encode().value(component.props);

  // if we are a leaf node, start the up phase
  if (component.children.length === 0) {
    hashesUp(component);
  }

  for (let child of component.children) {
    const {sizeMode, positionMode} = child.instance.getLayoutModes();

    if (sizeMode === modes.SELF_AND_PARENTS) {
      component.sizeHashDown = encode().value(
        Object.assign({}, selfHash, component.props)
      );
    } else if (sizeMode === modes.PARENTS) {
      component.sizeHashDown = encode().value(component.props);
    }

    if (positionMode === modes.SELF_AND_PARENTS) {
      component.positionHashDown = encode().value(
        Object.assign({}, selfHash, component.props)
      );
    } else if (positionMode === modes.PARENTS) {
      component.positionHashDown = encode().value(component.props);
    }

    hashesDown(child);
  }
}

function hashesUp(component) {
  if (!component) {
    return;
  }
  const selfHash = encode().value(component.props);
  const {sizeMode, positionMode} = component.instance.getLayoutModes();

  if (sizeMode === modes.SELF_AND_CHILDREN) {
    component.sizeHashUp = encode().value(
      Object.assign({}, selfHash, component.props)
    );
  } else if (sizeMode === modes.CHILDREN) {
    component.sizeHashUp = encode().value(component.props);
  }

  if (positionMode === modes.SELF_AND_CHILDREN) {
    component.positionHashUp = encode().value(
      Object.assign({}, selfHash, component.props)
    );
  } else if (positionMode === modes.CHILDREN) {
    component.positionHashUp = encode().value(component.props);
  }

  hashesUp(component.parent);
}*/

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
  let box = component.instance.size(
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

function calcBoxPositions(renderContext, component, updatedParentPosition) {
  const position = component.instance.position(
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
  component.instance.render(renderContext, component.props);

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

module.exports = {c, render, layout, click, modes, hashesDown};
