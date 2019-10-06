'use strict';

class FontMetrics {
  constructor(context, width, height, scaleFactor) {
    this.cache = new Map();
    this.chars = {
      capHeight: 'S',
      baseline: 'n',
      xHeight: 'x',
      descent: 'p',
      ascent: 'h',
      title: 'i'
    };

    this.width = width;
    this.height = height;
    this.context = context;
    this.padding = 0;
    this.scaleFactor = scaleFactor;

    this.visitPixel = this.visitPixel.bind(this);
    this.visitPixelEx = this.visitPixelEx.bind(this);
    this.getMetrics = this.getMetrics.bind(this);

    this.fuq = this.fuq.bind(this);

    this.measureLeft = this.measureLeft.bind(this);
    this.measureRight = this.measureRight.bind(this);
    this.measureTop = this.measureTop.bind(this);
    this.measureBottom = this.measureBottom.bind(this);
    this.setFont = this.setFont.bind(this);
    this.updateText = this.updateText.bind(this);
    this.getPixels = this.getPixels.bind(this);
  }

  measureText(text) {}

  measureTypeStyle({
    fontFamily,
    fontWeight,
    fontSize,
    origin // = 'baseline'
  } = {}) {
    const key = `${fontFamily}-${fontSize}-${fontWeight}`;
    const cachedResult = this.cache.get(key);

    if (cachedResult) {
      return cachedResult;
    }

    this.setFont({fontFamily, fontSize, fontWeight});

    this.context.save();
    const value = this.getMetrics();
    this.context.restore();

    // this.cache.set(key, value);

    return value;
  }

  setFont({fontFamily, fontSize, fontWeight}) {
    this.padding = 0;
    this.width = fontSize * this.scaleFactor;
    this.height = fontSize * this.scaleFactor;
    this.context.font = `${fontWeight} ${fontSize /
      this.scaleFactor}px ${fontFamily}`;
    this.context.textBaseline = 'top';
    this.context.textAlign = 'center';
    console.log(
      'set width and height to:',
      `${fontWeight} ${fontSize}px ${fontFamily}`
    );
  }

  setAlignment(baseline = 'top') {
    const ty = baseline === 'bottom' ? this.height : 0;
    this.context.setTransform(1, 0, 0, 1, 0, ty);
    this.context.textBaseline = baseline;
  }

  updateText(text) {
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.fillText(text, this.width / 2, this.padding, this.width);
  }

  computeLineHeight() {
    const letter = 'A';
    this.setAlignment('bottom');
    const gutter = this.height - this.measureBottom(letter);
    this.setAlignment('top');
    return this.measureBottom(letter) + gutter;
  }

  getPixels(text) {
    this.updateText(text);
    return this.context.getImageData(0, 0, this.width, this.height).data;
  }

  /**
   *
   * @param {*} pixels
   * @param {*} column - x
   * @param {*} row - y
   * @param {*} channel - Color channel (RGBA)
   */
  visitPixel(pixels, column, row, channel) {
    return pixels[row * this.width + column + channel];
  }

  visitPixelEx(pixels, column, row, channel) {
    return pixels[(row * this.width + column) * channel - 1];
  }

  fuq(text) {
    const pixels = this.getPixels(text);

    const pixelLength = pixels.length / 4;
    const rowCount = pixelLength / this.width;
    return {pixels, rowCount};
  }

  measureLeft(character) {
    const {pixels, rowCount} = this.fuq(character);

    // top-left -> down -> next column -> down...
    for (let column = 0; column < this.width; column++) {
      for (let row = 0; row < rowCount; row++) {
        // inspect the alpha value (4th channel)
        if (this.visitPixelEx(pixels, column, row, 4)) {
          return column;
        }
      }
    }
  }

  measureRight(character) {
    const {pixels, rowCount} = this.fuq(character);

    // top-right -> down -> next column -> down...
    for (let column = this.width; column > -1; column--) {
      for (let row = 0; row < rowCount; row++) {
        // inspect the alpha value (4th channel)
        if (this.visitPixelEx(pixels, column, row, 4)) {
          return column;
        }
      }
    }
  }

  measureTop(text) {
    const {pixels, rowCount} = this.fuq(text);

    // start from the top row
    for (let row = 0; row < rowCount; row++) {
      for (let column = 0; column < this.width; column++) {
        // inspect the alpha value (4th channel)
        if (this.visitPixelEx(pixels, column, row, 4)) {
          return row;
        }
      }
    }
  }

  measureBottom(text) {
    const {pixels, rowCount} = this.fuq(text);

    // start from the bottom row
    for (let row = rowCount; row > -1; row--) {
      for (let column = 0; column < this.width; column++) {
        // inspect the alpha value (4th channel)
        if (this.visitPixelEx(pixels, column, row, 4)) {
          return row;
        }
      }
    }
  }

  getMetrics(chars = this.chars) {
    const baseline = this.measureBottom(chars.baseline);
    console.log('chars.xHeight:', chars.xHeight);
    return {
      capHeight: this.measureTop(chars.capHeight) - baseline,
      baseline: 0,
      xHeight: this.measureTop(chars.xHeight) - baseline,
      descent: this.measureBottom(chars.descent) - baseline,
      ascent: this.measureTop(chars.ascent) - baseline,
      title: this.measureTop(chars.title) - baseline
      // bottom: this.computeLineHeight() - baseline
    };
  }
}

module.exports = FontMetrics;
