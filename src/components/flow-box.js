'use strict';

const Component = require('../component');
const PropTypes = require('introspective-prop-types');

const {
  sizeShrinkVertical,
  sizeShrinkHorizontal,
  positionShrinkVertical,
  positionShrinkHorizontal,
  sizeExpandingVertical,
  sizeExpandingHorizontal,
  positionExpandingVertical,
  positionExpandingHorizontal
} = require('../shrinking-expanding');

class FlowBox extends Component {
  size(props, {sizing, component, parentBox, shrinkSizeDeps, expandSizeDeps}) {
    const {parent, children} = component;

    const shrinkVertical =
      sizing === 'shrink' && props.sizingVertical === 'shrink';
    const shrinkHorizontal =
      sizing === 'shrink' && props.sizingHorizontal === 'shrink';
    const expandVertical =
      sizing === 'expand' && props.sizingVertical === 'expand';
    const expandHorizontal =
      sizing === 'expand' && props.sizingHorizontal === 'expand';

    if (shrinkVertical || shrinkHorizontal) {
      shrinkSizeDeps.addNode(component.name, component);
    }

    if (expandVertical || expandHorizontal) {
      expandSizeDeps.addNode(component.name, component);
    }

    if (shrinkVertical) {
      const {height, childHeights, dependents} = sizeShrinkVertical(
        props,
        children
      );
      this.box.height = height;
      for (let i = 0; i < this.childBoxes.length; i++) {
        this.childBoxes[i].height = childHeights[i];
      }

      for (let dependent of dependents) {
        shrinkSizeDeps.addNodeAndDependency(dependent, component.name);
      }
    }

    if (shrinkHorizontal) {
      const {width, childWidths, dependents} = sizeShrinkHorizontal(
        props,
        children
      );
      this.box.width = width;
      for (let i = 0; i < this.childBoxes.length; i++) {
        this.childBoxes[i].width = childWidths[i];
      }

      for (let dependent of dependents) {
        shrinkSizeDeps.addNodeAndDependency(dependent, component.name);
      }
    }

    if (expandVertical) {
      expandSizeDeps.addNodeAndDependency(parent, component.name);
      this.box.height = parentBox.height;

      const {childHeights, dependents} = sizeExpandingVertical(
        props,
        children,
        this.box
      );
      for (let i = 0; i < this.childBoxes.length; i++) {
        this.childBoxes[i].height = childHeights[i];
      }

      for (let dependent of dependents) {
        expandSizeDeps.addNodeAndDependency(dependent, component.name);
      }
    }

    if (expandHorizontal) {
      expandSizeDeps.addNodeAndDependency(parent, component.name);
      this.box.width = parentBox.width;

      const {childWidths, dependents} = sizeExpandingHorizontal(
        props,
        children,
        this.box
      );
      for (let i = 0; i < this.childBoxes.length; i++) {
        this.childBoxes[i].width = childWidths[i];
      }

      for (let dependent of dependents) {
        expandSizeDeps.addNodeAndDependency(dependent, component.name);
      }
    }
  }

  position(props, {parentBox}) {
    if (props.sizingVertical === 'shrink') {
      const childBoxes = positionShrinkVertical(
        props,
        parentBox,
        this.childBoxes
      );
      this.box.y = parentBox.y;
      for (let i = 0; i < this.childBoxes.length; i++) {
        const childBox = this.childBoxes[i];
        const newChildBox = childBoxes[i];
        childBox.y = newChildBox.y;
        childBox.height = newChildBox.height;
      }
    }

    if (props.sizingHorizontal === 'shrink') {
      const childBoxes = positionShrinkHorizontal(
        props,
        parentBox,
        this.childBoxes
      );
      this.box.x = parentBox.x;
      for (let i = 0; i < this.childBoxes.length; i++) {
        const childBox = this.childBoxes[i];
        const newChildBox = childBoxes[i];
        childBox.x = newChildBox.x;
        childBox.width = newChildBox.width;
      }
    }

    if (props.sizingVertical === 'expand') {
      const childBoxes = positionExpandingVertical(
        props,
        parentBox,
        this.childBoxes
      );

      this.box.y = parentBox.y;
      for (let i = 0; i < this.childBoxes.length; i++) {
        const childBox = this.childBoxes[i];
        const newChildBox = childBoxes[i];
        childBox.y = newChildBox.y;
        childBox.height = newChildBox.height;
      }
    }

    if (props.sizingHorizontal === 'expand') {
      const childBoxes = positionExpandingHorizontal(
        props,
        parentBox,
        this.childBoxes
      );
      this.box.x = parentBox.x;
      for (let i = 0; i < this.childBoxes.length; i++) {
        const childBox = this.childBoxes[i];
        const newChildBox = childBoxes[i];
        childBox.x = newChildBox.x;
        childBox.width = newChildBox.width;
      }
    }

    if (props.stackChildren === 'horizontal') {
      let x = this.childBoxes.length === 1 ? this.childBoxes[0].x : this.box.x;

      for (let i = 0; i < this.childBoxes.length; i++) {
        const childBox = this.childBoxes[i];
        childBox.x = x;
        x += childBox.width;
      }
    } else if (props.stackChildren === 'vertical') {
      let y = this.childBoxes.length === 1 ? this.childBoxes[0].y : this.box.y;

      for (let i = 0; i < this.childBoxes.length; i++) {
        const childBox = this.childBoxes[i];
        childBox.y = y;
        y += childBox.height;
      }
    }
  }

  render({color, showBoxes}, {renderContext}) {
    if (!showBoxes) {
      return;
    }

    for (let childBox of this.childBoxes) {
      renderContext.strokeStyle = 'green';
      renderContext.strokeRect(
        childBox.x,
        childBox.y,
        childBox.width,
        childBox.height
      );
    }

    renderContext.strokeStyle = color;
    renderContext.strokeRect(
      this.box.x,
      this.box.y,
      this.box.width,
      this.box.height
    );
  }

  sizingVertical() {
    return this.props.sizingVertical;
  }

  sizingHorizontal() {
    return this.props.sizingHorizontal;
  }
}

FlowBox.propTypes = {
  sizingVertical: PropTypes.oneOf(['expand', 'shrink']).isRequired,
  sizingHorizontal: PropTypes.oneOf(['expand', 'shrink']).isRequired,
  alignVertical: PropTypes.oneOf(['top', 'center', 'bottom']).isRequired,
  alignHorizontal: PropTypes.oneOf(['left', 'center', 'right']).isRequired,
  stackChildren: PropTypes.oneOf(['vertical', 'horizontal', 'diagonal'])
    .isRequired
};
module.exports = FlowBox;
