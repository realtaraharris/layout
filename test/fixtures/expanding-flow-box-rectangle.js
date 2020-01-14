'use strict';

const fs = require('fs');

const {c} = require('../../src/layout');
const Root = require('../../src/components/root');
const Label = require('../../src/components/label');
const Margin = require('../../src/components/margin');
const ExpandingFlowBox = require('../../src/components/expanding-flow-box');
const ShrinkingFlowBox = require('../../src/components/shrinking-flow-box');

const Rectangle = require('../../src/components/rectangle');

const {Text, createTextContinuation} = require('../../src/components/text');

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

const exampleText2 = hyphenateEnglish(
  `But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?
  On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.`
);

// c(Margin, {
//   top: pageMargin,
//   bottom: pageMargin,
//   left: pageMargin,
//   right: pageMargin / 2,
//   showBoxes
// });

module.exports = ({x, y, width, height}) => {
  const textContinuation = createTextContinuation(exampleText);
  const textContinuation2 = createTextContinuation(exampleText2);
  const showBoxes = true;
  const textWidth = 0; //266.666; // TODO: remove!
  // const pageMargin = 100;
  return c(
    Root,
    {x, y, width, height, color: 'white'},
    c(
      ExpandingFlowBox,
      {
        mode: 'horizontal',
        align: 'left',
        expand: 'bidirectional',
        showBoxes,
        color: 'red'
      },
      c(
        ExpandingFlowBox,
        {
          mode: 'vertical',
          align: 'left',
          expand: 'bidirectional',
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
        c(Rectangle, {
          // c(Text, {
          color: '#FFDD00',
          topLeft: 0,
          topRight: 0,
          bottomLeft: 0,
          bottomRight: 0,

          width: textWidth,
          lineHeight: 20,
          font: 'SourceSerifPro-Regular',
          size: 12,
          sizeMode: 'capHeight',
          textContinuation,
          operation: 'add',
          overflow: 'continue',
          // color: 'black',
          showBoxes
        }),
        c(Label, {
          font: 'SourceSerifPro-Regular',
          color: 'black',
          size: 30,
          sizeMode: 'capHeight',
          text: 'Down Here',
          showBoxes
        })
      ),
      c(
        ExpandingFlowBox,
        {
          mode: 'vertical',
          align: 'left',
          expand: 'bidirectional',
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
        c(Rectangle, {
          // c(Text, {
          color: 'orange',
          topLeft: 0,
          topRight: 0,
          bottomLeft: 0,
          bottomRight: 0,

          width: textWidth,
          lineHeight: 20,
          font: 'SourceSerifPro-Regular',
          size: 12,
          sizeMode: 'capHeight',
          textContinuation: textContinuation,
          operation: 'add',
          overflow: 'continue',
          // color: 'black',
          showBoxes
        })
      ),
      c(
        ExpandingFlowBox,
        {
          mode: 'vertical',
          align: 'left',
          expand: 'bidirectional',
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
        c(Rectangle, {
          // c(Text, {
          color: 'red',
          topLeft: 0,
          topRight: 0,
          bottomLeft: 0,
          bottomRight: 0,

          // width: textWidth,
          lineHeight: 20,
          font: 'SourceSerifPro-Regular',
          size: 12,
          sizeMode: 'capHeight',
          textContinuation: textContinuation,
          operation: 'add',
          // overflow: 'clip',
          overflow: 'continue',
          // color: 'black',
          showBoxes
        })
      )
    )
  );
};
