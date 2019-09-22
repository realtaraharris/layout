'use strict';
const {c} = require('../../src/layout');
const {Root, Label, SpacedLine, Margin} = require('../../src/components');
const {Text} = require('../../src/components/text');
const {fromPolygons} = require('../../lib/csg/src/csg');

module.exports = ({x, y, width, height}) => {
  const wordsToLiveBy = `When you grow up you tend to get told the world is the way it is and your job is just to live your life inside the world. Try not to bash into the walls too much. Try to have a nice family life, have fun, save a little money. That's a very limited life. Life can be much broader once you discover one simple fact, and that is: everything around you that you call life, was made up by people that were no smarter than you. And you can change it, you can influence it, you can build your own things that other people can use. The minute that you understand that you can poke life and actually something will, you know if you push in, something will pop out the other side, that you can change it, you can mold it. That's maybe the most important thing. It's to shake off this erroneous notion that life is there and you're just gonna live in it, versus embrace it, change it, improve it, make your mark upon it. I think that’s very important and however you learn that, once you learn it, you'll want to change life and make it better, cause it's kind of messed up, in a lot of ways. Once you learn that, you'll never be the same again.`;

  const marginA = 20;

  const textWidth = 520;
  const textHeight = 360;

  const subjectPolygon = fromPolygons([
    [[0, 0], [textWidth, 0], [textWidth, textHeight], [0, textHeight]]
  ]);

  const clipPolygon = fromPolygons([
    [
      [12, 13], // x1, y1
      [33, 5],
      [10, 0]
    ].map(([x, y]) => [x * 20 - 150, y * 20 + 40])
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
          style: {font: `${17}px serif`, fillStyle: 'white'},
          polygons,
          showBoxes: true,
          done: () => {}
        })
      )
    )
  );
};
