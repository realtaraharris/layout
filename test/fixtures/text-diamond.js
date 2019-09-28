'use strict';
const {c} = require('../../src/layout');
const {SpacedLine} = require('../../src/components');
const {Root} = require('../../src/components/root');
const {Text} = require('../../src/components/text');
const {Label} = require('../../src/components/label');
const {Margin} = require('../../src/components/margin');
const {fromPolygons} = require('../../lib/csg/src/csg');
const {createCircle} = require('../../src/geometry');
const createHyphenator = require('hyphen');
const hyphenationPatternsEnUs = require('hyphen/patterns/en-us');

module.exports = ({x, y, width, height}) => {
  const hyphenChar = '*';
  const hyphen = createHyphenator(hyphenationPatternsEnUs, {hyphenChar});

  const wordsToLiveBy = hyphen(
    `When you grow up you tend to get told the world is the way it is and your job is just to live your life inside the world. Try not to bash into the walls too much. Try to have a nice family life, have fun, save a little money. That's a very limited life.\n\n\nLife can be much broader once you discover one simple fact, and that is: everything around you that you call life, was made up by people that were no smarter than you. And you can change it, you can influence it, you can build your own things that other people can use. The minute that you understand that you can poke life and actually something will, you know if you push in, something will pop out the other side, that you can change it, you can mold it. That's maybe the most important thing. It's to shake off this erroneous notion that life is there and you're just gonna live in it, versus embrace it, change it, improve it, make your mark upon it. I think that’s very important and however you learn that, once you learn it, you'll want to change life and make it better, cause it's kind of messed up, in a lot of ways. Once you learn that, you'll never be the same again.`
  );
  // const wordsToLiveBy = hyphen(`discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace discover embrace`)

  const marginA = 20;

  const textWidth = 500;
  const textHeight = 500;

  const subjectPolygon = fromPolygons([
    createCircle(250, 250, 130).map(([x, y]) => [x + 250, y + 250])
  ]);

  const clipPolygon = fromPolygons([
    [
      [7.4806, 14.0654],
      [0, 8.7],
      [9.1639, 8.7],
      [12, 0],
      [14.8237, 8.7],
      [24, 8.7],
      [16.5651, 14.0654],
      [19.4, 22.8],
      [11.9573, 17.3906],
      [4.6, 22.8]
    ].map(([x, y]) => [x * 20 + 10, y * 20 + 0])
  ]);

  const polygons = subjectPolygon.subtract(clipPolygon);

  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      SpacedLine,
      {mode: 'vertical', align: 'left'},
      c(Label, {
        font: 'sans',
        color: 'white',
        size: 100,
        text: 'Push Me',
        showBoxes: true,
        done: () => {}
      }),
      c(
        Margin,
        {
          top: marginA,
          bottom: marginA,
          left: marginA,
          right: 20,
          showBoxes: true
        },
        c(Text, {
          width: textWidth,
          height: textHeight,
          lineHeight: 20,
          font: 'sans',
          size: 100,
          text: wordsToLiveBy,
          hyphenChar: hyphenChar,
          style: {font: `${17}px serif`, fillStyle: 'white'},
          polygons,
          showBoxes: true,
          done: () => {}
        })
      )
    )
  );
};
