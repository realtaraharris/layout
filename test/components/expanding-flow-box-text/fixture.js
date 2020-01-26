'use strict';

const fs = require('fs');

const {c} = require('../../../src/layout');
const Root = require('../../../src/components/root');
const Label = require('../../../src/components/label');
const Margin = require('../../../src/components/margin');
const ExpandingFlowBox = require('../../../src/components/expanding-flow-box');
const ShrinkingFlowBox = require('../../../src/components/shrinking-flow-box');

const {Text, createTextContinuation} = require('../../../src/components/text');

const createHyphenator = require('hyphen');
const hyphenationPatternsEnUs = require('hyphen/patterns/en-us');

const hyphenateEnglish = rawText => {
  const hyphenChar = '\uFFFF';
  const hyphen = createHyphenator(hyphenationPatternsEnUs, {hyphenChar});
  const text = hyphen(rawText);

  return {hyphenChar, rawText, text};
};

const exampleText = hyphenateEnglish(
  fs.readFileSync('./test/fixtures/jobs-long.txt', 'utf-8')
);

module.exports = ({x, y, width, height}) => {
  const textContinuation = createTextContinuation(exampleText);
  const showBoxes = true;
  return c(
    Root,
    {x, y, width, height, color: 'white'},
    c(
      ExpandingFlowBox,
      {
        mode: 'horizontal',
        align: 'left',
        showBoxes,
        color: 'red'
      },
      c(
        ExpandingFlowBox,
        {
          mode: 'vertical',
          align: 'left',
          showBoxes,
          color: 'blue'
        },
        c(
          ShrinkingFlowBox,
          {mode: 'vertical', align: 'left', color: 'green', showBoxes},
          c(
            Margin,
            {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              showBoxes
            },
            c(Label, {
              font: 'SourceSerifPro-Regular',
              color: 'black',
              size: 30,
              sizeMode: 'capHeight',
              text: 'First Heading',
              showBoxes
            })
          )
        ),
        c(Text, {
          lineHeight: 20,
          font: 'SourceSerifPro-Regular',
          size: 12,
          sizeMode: 'capHeight',
          textContinuation,
          operation: 'add',
          overflow: 'continue',
          color: 'black',
          showBoxes
        }),
        c(
          Margin,
          {
            top: 200,
            bottom: 0,
            left: 0,
            right: 0,
            showBoxes
          },
          c(Label, {
            font: 'SourceSerifPro-Regular',
            color: 'black',
            size: 40,
            sizeMode: 'capHeight',
            text: 'Down Here',
            showBoxes
          })
        )
      ),
      c(
        ExpandingFlowBox,
        {
          mode: 'vertical',
          align: 'left',
          showBoxes,
          color: 'blue'
        },
        c(
          ShrinkingFlowBox,
          {mode: 'vertical', align: 'left', color: 'red', showBoxes},
          c(
            Margin,
            {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              showBoxes
            },
            c(Label, {
              font: 'SourceSerifPro-Regular',
              color: 'black',
              size: 30,
              sizeMode: 'capHeight',
              text: 'Second Heading',
              showBoxes
            })
          )
        ),
        c(Text, {
          color: 'black',
          lineHeight: 20,
          font: 'SourceSerifPro-Regular',
          size: 12,
          sizeMode: 'capHeight',
          textContinuation: textContinuation,
          operation: 'add',
          overflow: 'continue',
          showBoxes
        })
      ),
      c(
        ExpandingFlowBox,
        {
          mode: 'vertical',
          align: 'left',
          showBoxes,
          color: 'blue'
        },
        c(
          ShrinkingFlowBox,
          {mode: 'vertical', align: 'left', color: 'red', showBoxes},
          c(
            Margin,
            {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              showBoxes
            },
            c(Label, {
              font: 'SourceSerifPro-Regular',
              color: 'black',
              size: 30,
              sizeMode: 'capHeight',
              text: 'Third Heading',
              showBoxes
            })
          )
        ),
        c(Text, {
          lineHeight: 20,
          font: 'SourceSerifPro-Regular',
          size: 12,
          sizeMode: 'capHeight',
          textContinuation: textContinuation,
          operation: 'add',
          overflow: 'continue',
          color: 'black',
          showBoxes
        })
      )
    )
  );
};
