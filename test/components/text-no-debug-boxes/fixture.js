'use strict';
const {c} = require('../../../src/layout');
const Root = require('../../../src/components/root');
const {Text, createTextContinuation} = require('../../../src/components/text');
const Label = require('../../../src/components/label');
const Margin = require('../../../src/components/margin');
const ShrinkingFlowBox = require('../../../src/components/shrinking-flow-box');
const Box = require('../../../src/components/box');
const {fromPolygons} = require('../../../lib/csg/src/csg');

const createHyphenator = require('hyphen');
const hyphenationPatternsEnUs = require('hyphen/patterns/en-us');

const hyphenateEnglish = rawText => {
  const hyphenChar = '\uFFFF';
  const hyphen = createHyphenator(hyphenationPatternsEnUs, {hyphenChar});
  const text = hyphen(rawText);

  return {hyphenChar, rawText, text};
};

module.exports = ({x, y, width, height}) => {
  const exampleText = hyphenateEnglish(
    `When you grow up you tend to get told the world is the way it is and your job is just to live your life inside the world. Try not to bash into the walls too much. Try to have a nice family life, have fun, save a little money. That's a very limited life. Life can be much broader once you discover one simple fact, and that is: everything around you that you call life, was made up by people that were no smarter than you. And you can change it, you can influence it, you can build your own things that other people can use. The minute that you understand that you can poke life and actually something will, you know if you push in, something will pop out the other side, that you can change it, you can mold it. That's maybe the most important thing. It's to shake off this erroneous notion that life is there and you're just gonna live in it, versus embrace it, change it, improve it, make your mark upon it. I think that’s very important and however you learn that, once you learn it, you'll want to change life and make it better, cause it's kind of messed up, in a lot of ways. Once you learn that, you'll never be the same again.`
  );
  const textContinuation = createTextContinuation(exampleText);

  const marginA = 20;

  const clipPolygon = fromPolygons([
    [
      [10, 0],
      [12, 13], // x1, y1
      [33, 5]
    ].map(([x, y]) => [x * 20 - 150, y * 20 + 40])
  ]);

  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      ShrinkingFlowBox,
      {mode: 'vertical', align: 'left'},
      c(Label, {
        font: 'SourceSansPro-Regular',
        color: 'white',
        size: 100,
        sizeMode: 'capHeight',
        text: 'Push Me',
        showBoxes: false
      }),
      c(
        Margin,
        {
          top: marginA,
          bottom: marginA,
          left: marginA,
          right: 20,
          showBoxes: false
        },
        c(
          Box,
          {width: 520, height: 360},
          c(Text, {
            lineHeight: 20,
            font: 'SourceSerifPro-Regular',
            size: 17,
            sizeMode: 'capHeight',
            textContinuation,

            polygons: clipPolygon,
            operation: 'subtract',
            overflow: 'clip', // ignores any words that don't fit in the polygon
            // overflow: 'continue', // creates more area to flow text, below the poly

            color: 'white',
            showBoxes: false
          })
        )
      )
    )
  );
};
