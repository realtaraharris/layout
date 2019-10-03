'use strict';

let cache = new Map();

/**
 * Variables
 */
let initialized = false;
let padding;
let context;
let height;
let width;

/**
 * Settings
 */
const settings = {
  chars: {
    capHeight: 'S',
    baseline: 'n',
    xHeight: 'x',
    descent: 'p',
    ascent: 'h',
    title: 'i'
  }
};

/**
 * Functions
 */
const setFont = (fontFamily, fontSize, fontWeight) => {
  padding = fontSize * 0.5;
  width = fontSize * 2;
  height = fontSize * 2 + padding;
  context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  context.textBaseline = 'top';
  context.textAlign = 'center';
};

const setAlignment = (baseline = 'top') => {
  const ty = baseline === 'bottom' ? height : 0;
  context.setTransform(1, 0, 0, 1, 0, ty);
  context.textBaseline = baseline;
};

const updateText = text => {
  context.clearRect(0, 0, width, height);
  context.fillText(text, width / 2, padding, width);
};

const computeLineHeight = () => {
  const letter = 'A';
  setAlignment('bottom');
  const gutter = height - measureBottom(letter);
  setAlignment('top');
  return measureBottom(letter) + gutter;
};

const getPixels = text => {
  updateText(text);
  return context.getImageData(0, 0, width, height).data;
};

const getFirstIndex = pixels => {
  for (let i = 3, n = pixels.length; i < n; i += 4) {
    if (pixels[i] > 0) {
      return (i - 3) / 4;
    }
  }
  return pixels.length;
};

const getLastIndex = pixels => {
  for (let i = pixels.length - 1; i >= 3; i -= 4) {
    if (pixels[i] > 0) {
      return i / 4;
    }
  }
  return 0;
};

const normalize = (metrics, fontSize, origin) => {
  const result = {};
  const offset = metrics[origin];
  for (let key in metrics) {
    result[key] = (metrics[key] - offset) / fontSize;
  }
  return result;
};

const measureTop = text =>
  Math.round(getFirstIndex(getPixels(text)) / width) - padding;

const measureBottom = text =>
  Math.round(getLastIndex(getPixels(text)) / width) - padding;

const getMetrics = (chars = settings.chars) => ({
  capHeight: measureTop(chars.capHeight) / -2,
  baseline: measureBottom(chars.baseline) / -2,
  xHeight: measureTop(chars.xHeight) / -2,
  descent: measureBottom(chars.descent) / -2,
  bottom: computeLineHeight() / -2,
  ascent: measureTop(chars.ascent) / -2,
  title: measureTop(chars.title) / -2,
  top: 0
});

/**
 * FontMetrics
 */
const FontMetrics = (
  renderContext,
  {
    fontFamily = 'Times',
    fontWeight = 'normal',
    fontSize = 200,
    origin = 'baseline'
  } = {}
) => {
  const key = `${fontFamily}-${fontSize}-${fontWeight}`;
  const cachedResult = cache.get(key);

  if (cachedResult) {
    return cachedResult;
  }

  if (!initialized) {
    context = renderContext;
    initialized = true;
  }

  renderContext.save();
  setFont(fontFamily, fontSize, fontWeight);

  const value = {
    ...normalize(getMetrics(), fontSize, origin),
    fontFamily,
    fontWeight,
    fontSize
  };
  renderContext.restore();

  cache.set(key, value);

  return value;
};

FontMetrics.settings = settings;

module.exports = FontMetrics;
