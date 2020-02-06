'use strict';

const Component = require('../component');
const PropTypes = require('introspective-prop-types');

class Margin extends Component {
  size(props, {sizing, parentBox, shrinkSizeDeps, expandSizeDeps, component}) {
    const {parent, children} = component;
    const {top, right, bottom, left} = props;
    if (children.length > 1) {
      console.error('too many kids!');
      return;
    }
    const childBox = children[0].instance.box;

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
      this.box.height = childBox.height + top + bottom;
      this.childBoxes[0].y = this.box.y + top;
      this.childBoxes[0].height = childBox.height;

      shrinkSizeDeps.addNodeAndDependency(children[0], component.name);
    }

    if (shrinkHorizontal) {
      this.box.width = childBox.width + left + right;
      this.childBoxes[0].x = this.box.x + left;
      this.childBoxes[0].width = childBox.width;

      shrinkSizeDeps.addNodeAndDependency(children[0], component.name);
    }

    if (expandVertical) {
      this.box.y = parentBox.y;
      this.box.height = parentBox.height;
      this.childBoxes[0].y = this.box.y + top;
      this.childBoxes[0].height = this.box.height - top - bottom;

      expandSizeDeps.addNodeAndDependency(parent, component.name);
    }

    if (expandHorizontal) {
      this.box.x = parentBox.x;
      this.box.width = parentBox.width;
      this.childBoxes[0].x = this.box.x + left;
      this.childBoxes[0].width = this.box.width - left - right;

      expandSizeDeps.addNodeAndDependency(parent, component.name);
    }
  }

  position(props, {parentBox}) {
    this.box.x = parentBox.x;
    this.box.y = parentBox.y;

    this.childBoxes[0].x = this.box.x + props.left;
    this.childBoxes[0].y = this.box.y + props.top;
  }

  render({showBoxes = false}, {renderContext}) {
    if (!showBoxes) {
      return;
    }

    renderContext.setLineDash([4, 4]);
    renderContext.strokeStyle = 'darkgray';
    renderContext.strokeRect(
      this.childBoxes[0].x, // + left,
      this.childBoxes[0].y, // + top,
      this.childBoxes[0].width,
      this.childBoxes[0].height
    );

    renderContext.setLineDash([]);
    renderContext.strokeStyle = 'orange';
    renderContext.strokeRect(
      this.box.x,
      this.box.y,
      this.box.width, // + right + left,
      this.box.height // + top + bottom
    );
  }

  sizingVertical() {
    return this.props.sizingVertical;
  }

  sizingHorizontal() {
    return this.props.sizingHorizontal;
  }
}

Margin.propTypes = {
  sizing: PropTypes.oneOf(['expand', 'shrink']).isRequired,
  left: PropTypes.number.isRequired,
  right: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  bottom: PropTypes.number.isRequired,
  showBoxes: PropTypes.bool.isRequired
};

module.exports = Margin;
