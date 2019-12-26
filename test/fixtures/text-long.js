'use strict';
const {c} = require('../../src/layout');
const Root = require('../../src/components/root');
const {Text, createTextContinuation} = require('../../src/components/text');
const Label = require('../../src/components/label');
const Margin = require('../../src/components/margin');
const SpacedLine = require('../../src/components/spaced-line');
const {fromPolygons} = require('../../lib/csg/src/csg');

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
    `I am honored to be with you today at your commencement from one of the finest universities in the world. I never graduated from college. Truth be told, this is the closest I’ve ever gotten to a college graduation. Today I want to tell you three stories from my life. That’s it. No big deal. Just three stories.
    
    I dropped out of Reed College after the first 6 months, but then stayed around as a drop-in for another 18 months or so before I really quit. So why did I drop out?
    
    It started before I was born. My biological mother was a young, unwed college graduate student, and she decided to put me up for adoption. She felt very strongly that I should be adopted by college graduates, so everything was all set for me to be adopted at birth by a lawyer and his wife. Except that when I popped out they decided at the last minute that they really wanted a girl. So my parents, who were on a waiting list, got a call in the middle of the night asking: “We have an unexpected baby boy; do you want him?” They said: “Of course.” My biological mother later found out that my mother had never graduated from college and that my father had never graduated from high school. She refused to sign the final adoption papers. She only relented a few months later when my parents promised that I would someday go to college.`
  );
  const textContinuation = createTextContinuation(exampleText);

  const marginA = 20;

  const textWidth = 520;
  const textHeight = 360;

  // TODO: MOVE THIS BOX INTO THE COMPONENT?
  const subjectPolygon = fromPolygons([
    [
      [0, 0],
      [textWidth, 0],
      [textWidth, textHeight],
      [0, textHeight]
    ]
  ]);

  // const polygons = subjectPolygon.subtract(clipPolygon);

  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      SpacedLine,
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
          showBoxes: true
        },
        c(Text, {
          width: textWidth,
          height: textHeight,
          lineHeight: 20,
          font: 'SourceSerifPro-Regular',
          size: 17,
          sizeMode: 'capHeight',
          textContinuation,

          operation: 'add',
          overflow: 'continue', // ignores any words that don't fit in the polygon

          color: 'white',
          showBoxes: true
        })
      )
    )
  );
};
