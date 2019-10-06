'use strict';

const Layout = require('../components');

class Label extends Layout {
  // TODO: add check to ensure labels have NO children
  // sends a child box up
  size(renderContext, {text, size, font}) {
    const metrics = renderContext.textMetrics.measureTypeStyle({
      fontFamily: font,
      // Optional (defaults)
      fontWeight: 'normal',
      fontSize: size,
      scaleFactor: 2,
      origin: 'baseline'
    });

    renderContext.font = `${size}px ${font}`;
    const textMetrics = renderContext.measureText(text);
    const newBox = {
      x: 0,
      y: 0,
      width: textMetrics.width,
      height: metrics.xHeight
    };
    this.box = newBox;

    this.metrics = metrics;

    return Object.assign({}, newBox);
  }

  // eslint-disable-next-line no-unused-vars
  position(renderContext, {x, y, width, height}, updatedParentPosition) {
    this.box.x = updatedParentPosition.x;
    this.box.y = updatedParentPosition.y;

    // return value ignored in leaf nodes such as these
    // TODO: add assertions that ths component has no children!
    // we want to give users an error if they're doing that!
  }

  render(renderContext, {text, size, font, color}) {
    // const offsetY = 130;
    const offsetY = 0; //this.metrics.baseline - this.metrics.xHeight;
    // console.log({offsetY});

    const horizontalLine = (y, color) => {
      const yyy = this.box.y + this.box.height + y;
      renderContext.beginPath();
      renderContext.moveTo(this.box.x + 0, yyy);
      renderContext.lineTo(this.box.x + this.box.width, yyy);
      renderContext.strokeStyle = color;
      renderContext.setLineDash([5, 5]);
      renderContext.stroke();
    };

    const colors = {
      red: '#ff0000',
      orange: '#ff3300',
      yellow: '#ff9900',
      green: '#006600',
      blueGreen: '#006666',
      lightBlue: '#0066ff',
      darkBlue: '#0000ff',
      purple: '#330066',
      pink: '#cc0099'
    };

    renderContext.fillStyle = color;
    renderContext.font = `${size}px ${font}`;
    renderContext.fillText(text, this.box.x, this.box.y + this.box.height);

    console.log('this.metrics.xHeight:', this.metrics.xHeight);
    console.log('this.metrics.baseline:', this.metrics.baseline);

    // horizontalLine(this.metrics.ascent, colors.red); // #2
    horizontalLine(this.metrics.capHeight, colors.orange);
    horizontalLine(this.metrics.baseline, colors.yellow);
    // horizontalLine(this.metrics.bottom, colors.blueGreen);
    horizontalLine(this.metrics.xHeight, colors.green);
    horizontalLine(this.metrics.descent, colors.lightBlue);
    // horizontalLine(this.metrics.title, colors.darkBlue);
    // horizontalLine(this.metrics.top, colors.purple);
  }
}

module.exports = Label;
