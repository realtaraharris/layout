'use strict';

function roundRect(
  renderContext,
  x,
  y,
  width,
  height,
  {topLeft, topRight, bottomLeft, bottomRight}
) {
  const bigX = x + width;
  const bigY = y + height;

  renderContext.beginPath();
  renderContext.moveTo(x + topLeft, y);
  renderContext.lineTo(bigX - topRight, y);
  renderContext.quadraticCurveTo(bigX, y, bigX, y + topRight);
  renderContext.lineTo(bigX, bigY - bottomRight);
  renderContext.quadraticCurveTo(bigX, bigY, bigX - bottomRight, bigY);
  renderContext.lineTo(x + bottomLeft, bigY);
  renderContext.quadraticCurveTo(x, bigY, x, bigY - bottomLeft);
  renderContext.lineTo(x, y + topLeft);
  renderContext.quadraticCurveTo(x, y, x + topLeft, y);
  renderContext.closePath();
}

function circle(renderContext, x, y, radius) {
  renderContext.arc(x, y, radius, 0, 2 * Math.PI);
}

module.exports = {roundRect, circle};
