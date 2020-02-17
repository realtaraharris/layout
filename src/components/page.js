'use strict';

const FlowBox = require('./flow-box');
const PropTypes = require('introspective-prop-types');

class Page extends FlowBox {
  constructor() {
    super();
  }

  render(props, {renderContext, position}) {
    if (position > 0) {
      renderContext.addPage();
    }
  }
}
Page.propTypes = {
  mode: PropTypes.oneOf(['vertical', 'horizontal', 'diagonal']).isRequired,
  align: PropTypes.oneOf(['left', 'right', 'center']).isRequired
};
module.exports = Page;
