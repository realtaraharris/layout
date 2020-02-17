'use strict';

const fs = require('fs');

const {c} = require('../../../src/layout');
const Root = require('../../../src/components/root');
const Label = require('../../../src/components/label');
const Margin = require('../../../src/components/margin');
const FlowBox = require('../../../src/components/flow-box');

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
  const showBoxes = false;
  return c(
    Root,
    {x, y, width, height, color: 'white'},
    c(
      Margin,
      {
        sizingHorizontal: 'expand',
        sizingVertical: 'expand',
        top: 100,
        bottom: 100,
        left: 50,
        right: 50,
        showBoxes: showBoxes
      },
      c(
        FlowBox,
        {
          sizingHorizontal: 'expand',
          sizingVertical: 'expand',
          alignVertical: 'center',
          alignHorizontal: 'left',
          stackChildren: 'vertical',
          color: 'green',
          showBoxes
        },
        c(
          FlowBox,
          {
            sizingHorizontal: 'expand',
            sizingVertical: 'shrink',
            alignVertical: 'center',
            alignHorizontal: 'left',
            stackChildren: 'vertical',
            color: 'green',
            showBoxes
          },
          c(
            Margin,
            {
              sizingVertical: 'shrink',
              sizingHorizontal: 'shrink',
              top: 0,
              bottom: 20,
              left: 0,
              right: 0,
              showBoxes
            },
            c(Label, {
              font: 'SourceSansPro-Regular',
              color: 'black',
              size: 25,
              sizeMode: 'capHeight',
              text: 'Stanford Commencement Address, June 2005',
              showBoxes
            })
          )
        ),
        c(
          FlowBox,
          {
            sizingHorizontal: 'expand',
            sizingVertical: 'expand',
            alignVertical: 'center',
            alignHorizontal: 'left',
            stackChildren: 'horizontal',
            showBoxes,
            color: 'red'
          },

          c(
            Margin,
            {
              sizingVertical: 'expand',
              sizingHorizontal: 'expand',
              top: 0,
              bottom: 0,
              left: 0,
              right: 10,
              showBoxes
            },
            c(
              FlowBox,
              {
                sizingHorizontal: 'expand',
                sizingVertical: 'expand',
                alignVertical: 'center',
                alignHorizontal: 'right',
                stackChildren: 'vertical',
                showBoxes,
                color: 'blue'
              },
              c(Text, {
                lineHeight: 20,
                font: 'SourceSerifPro-Regular',
                size: 12,
                sizeMode: 'capHeight',
                textContinuation,
                operation: 'add',
                overflow: 'continue',
                color: 'black',
                showBoxes,
                continuationId: 0,
                groupId: 'Steve Jobs quotes'
              }),
              c(
                Margin,
                {
                  sizingVertical: 'shrink',
                  sizingHorizontal: 'expand',
                  top: 200,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  showBoxes: true
                },
                c(Label, {
                  font: 'SourceSansPro-Regular',
                  color: 'black',
                  size: 40,
                  sizeMode: 'xHeight',
                  text: 'Down',
                  showBoxes: showBoxes
                })
              )
            )
          ),
          c(
            Margin,
            {
              sizingVertical: 'expand',
              sizingHorizontal: 'expand',
              top: 0,
              bottom: 0,
              left: 10,
              right: 10,
              showBoxes
            },
            c(
              FlowBox,
              {
                sizingHorizontal: 'expand',
                sizingVertical: 'expand',
                alignVertical: 'center',
                alignHorizontal: 'left',
                stackChildren: 'vertical',
                showBoxes,
                color: 'blue'
              },

              c(Text, {
                color: 'black',
                lineHeight: 20,
                font: 'SourceSerifPro-Regular',
                size: 12,
                sizeMode: 'capHeight',
                textContinuation: textContinuation,
                operation: 'add',
                overflow: 'continue',
                showBoxes,
                continuationId: 1,
                groupId: 'Steve Jobs quotes'
              })
            )
          ),
          c(
            Margin,
            {
              sizingVertical: 'expand',
              sizingHorizontal: 'expand',
              top: 0,
              bottom: 0,
              left: 10,
              right: 0,
              showBoxes
            },
            c(
              FlowBox,
              {
                sizingHorizontal: 'expand',
                sizingVertical: 'expand',
                alignVertical: 'center',
                alignHorizontal: 'left',
                stackChildren: 'vertical',
                showBoxes,
                color: 'blue'
              },
              c(Text, {
                lineHeight: 20,
                font: 'SourceSerifPro-Regular',
                size: 12,
                sizeMode: 'capHeight',
                textContinuation: textContinuation,
                operation: 'add',
                overflow: 'continue',
                color: 'black',
                showBoxes,
                continuationId: 2,
                groupId: 'Steve Jobs quotes'
              })
            )
          )
        )
      )
    )
  );
};
