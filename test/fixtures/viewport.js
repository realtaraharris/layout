'use strict';
const {c} = require('../../src/layout');
const Root = require('../../src/components/root');
const Label = require('../../src/components/label');
const Margin = require('../../src/components/margin');
const SpacedLine = require('../../src/components/spaced-line');
const Viewport = require('../../src/components/viewport');
const Button = require('../../src/components/button');
const log = require('../../src/log');

module.exports = ({x, y, width, height}) => {
  const shrink = 40;

  return c(
    Root,
    {x, y, width, height, color: 'black'},
    c(
      SpacedLine,
      {mode: 'horizontal', align: 'center'},
      c(
        Margin,
        {top: 10, bottom: 10, left: 10, right: 10, showBoxes: true},
        c(Label, {
          font: 'SourceSerifPro-Regular',
          color: 'white',
          size: 30,
          sizeMode: 'capHeight',
          text: 'item 0',
          showBoxes: false
        })
      ),
      c(
        SpacedLine,
        {mode: 'vertical', align: 'center'},
        c(
          Margin,
          {top: 10, bottom: 10, left: 10, right: 10, showBoxes: true},
          c(Label, {
            font: 'SourceSerifPro-Regular',
            color: 'white',
            size: 30,
            sizeMode: 'capHeight',
            text: 'item 1',
            showBoxes: false
          })
        ),
        c(
          Margin,
          {top: 10, bottom: 10, left: 10, right: 10, showBoxes: true},
          c(Label, {
            font: 'SourceSerifPro-Regular',
            color: 'white',
            size: 30,
            sizeMode: 'capHeight',
            text: 'item 2',
            showBoxes: false
          })
        ),
        c(
          Viewport,
          {
            width: 500 - shrink,
            height: 284 - shrink,
            offsetX: 1.0,
            offsetY: 1.0
          },
          c(
            SpacedLine,
            {mode: 'vertical', align: 'center'},
            c(
              Button,
              {onInput: log, onClick: log},
              c(
                Margin,
                {top: 10, bottom: 10, left: 10, right: 10, showBoxes: true},
                c(Label, {
                  font: 'SourceSansPro-Regular',
                  color: 'white',
                  size: 70,
                  sizeMode: 'capHeight',
                  text: 'crazy 88s',
                  showBoxes: false
                })
              )
            ),
            c(
              SpacedLine,
              {mode: 'horizontal', align: 'center'},
              c(
                Button,
                {onInput: log},
                c(
                  Margin,
                  {
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10,
                    showBoxes: true
                  },
                  c(Label, {
                    font: 'SourceSansPro-Regular',
                    color: 'white',
                    size: 70,
                    sizeMode: 'capHeight',
                    text: 'a',
                    showBoxes: false
                  })
                )
              ),
              c(
                Margin,
                {top: 10, bottom: 10, left: 10, right: 10, showBoxes: true},
                c(Label, {
                  font: 'SourceSansPro-Regular',
                  color: 'white',
                  size: 70,
                  sizeMode: 'capHeight',
                  text: 'b',
                  showBoxes: false
                })
              ),
              c(
                Margin,
                {top: 10, bottom: 10, left: 10, right: 10, showBoxes: true},
                c(Label, {
                  font: 'SourceSansPro-Regular',
                  color: 'white',
                  size: 70,
                  sizeMode: 'capHeight',
                  text: 'c',
                  showBoxes: false
                })
              ),
              c(
                Margin,
                {
                  top: 50,
                  bottom: 10,
                  left: 10,
                  right: 100,
                  showBoxes: true
                },
                c(Label, {
                  font: 'SourceSansPro-Regular',
                  color: 'white',
                  size: 50,
                  sizeMode: 'capHeight',
                  text: 'Il Caffe',
                  showBoxes: false
                })
              ),
              c(
                Margin,
                {top: 10, bottom: 10, left: 10, right: 10, showBoxes: true},
                c(Label, {
                  font: 'SourceSansPro-Regular',
                  color: 'white',
                  size: 70,
                  sizeMode: 'capHeight',
                  text: 'd',
                  showBoxes: false
                })
              )
            ),
            c(
              SpacedLine,
              {mode: 'diagonal', align: 'center'},
              c(
                Button,
                {onInput: log, onClick: log},
                c(
                  Margin,
                  {
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10,
                    showBoxes: true
                  },
                  c(Label, {
                    font: 'SourceSansPro-Regular',
                    color: 'white',
                    size: 70,
                    sizeMode: 'capHeight',
                    text: 'B',
                    showBoxes: false
                  })
                )
              )
            ),
            c(Label, {
              font: 'SourceSansPro-Regular',
              color: 'white',
              size: 20,
              sizeMode: 'capHeight',
              text: 'c',
              showBoxes: false
            }),
            c(Label, {
              font: 'SourceSerifPro-Regular',
              color: 'white',
              size: 30,
              sizeMode: 'capHeight',
              text: 'd',
              showBoxes: false
            })
          )
        )
      )
    )
  );
};
