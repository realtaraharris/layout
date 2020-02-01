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
  size(props, {sizing, children, parentBox}) {
    const shrinkVertical = props.sizingVertical === 'shrink';
    const shrinkHorizontal = props.sizingHorizontal === 'shrink';
    const expandVertical = props.sizingVertical === 'expand';
    const expandHorizontal = props.sizingHorizontal === 'expand';

    if (sizing === 'shrink' && shrinkVertical) {
      const {box, childBoxes} = sizeShrinkVertical(props, children);
      this.box.y = box.y;
      this.box.height = box.height;
      for (let i = 0; i < this.childBoxes.length; i++) {
        const childBox = this.childBoxes[i];
        const newChildBox = childBoxes[i];
        childBox.y = newChildBox.y;
        childBox.height = newChildBox.height;
      }
    }

    if (sizing === 'shrink' && shrinkHorizontal) {
      const {box, childBoxes} = sizeShrinkHorizontal(props, children);
      this.box.x = box.x;
      this.box.width = box.width;
      for (let i = 0; i < this.childBoxes.length; i++) {
        const childBox = this.childBoxes[i];
        const newChildBox = childBoxes[i];
        childBox.x = newChildBox.x;
        childBox.width = newChildBox.width;
      }
    }

    if (sizing === 'expand' && expandVertical) {
      this.box.y = parentBox.y;
      this.box.height = parentBox.height;
      const childBoxes = sizeExpandingVertical(props, children, this.box);
      for (let i = 0; i < this.childBoxes.length; i++) {
        const childBox = this.childBoxes[i];
        const newChildBox = childBoxes[i];
        childBox.y = newChildBox.y;
        childBox.height = newChildBox.height;
      }
    }

    if (sizing === 'expand' && expandHorizontal) {
      this.box.x = parentBox.x;
      this.box.width = parentBox.width;
      const childBoxes = sizeExpandingHorizontal(props, children, this.box);
      for (let i = 0; i < this.childBoxes.length; i++) {
        const childBox = this.childBoxes[i];
        const newChildBox = childBoxes[i];
        childBox.x = newChildBox.x;
        childBox.width = newChildBox.width;
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
