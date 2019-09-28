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
          font: 'serif',
          color: 'white',
          size: 30,
          text: 'item 0',
          showBoxes: true
        })
      ),
      c(
        SpacedLine,
        {mode: 'vertical', align: 'center'},
        c(
          Margin,
          {top: 10, bottom: 10, left: 10, right: 10, showBoxes: true},
          c(Label, {
            font: 'serif',
            color: 'white',
            size: 30,
            text: 'item 1',
            showBoxes: true
          })
        ),
        c(
          Margin,
          {top: 10, bottom: 10, left: 10, right: 10, showBoxes: true},
          c(Label, {
            font: 'serif',
            color: 'white',
            size: 30,
            text: 'item 2',
            showBoxes: true
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
                  font: 'sans',
                  color: 'white',
                  size: 70,
                  text: 'crazy 88s',
                  showBoxes: true
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
                    font: 'sans',
                    color: 'white',
                    size: 70,
                    text: 'a',
                    showBoxes: true
                  })
                )
              ),
              c(
                Margin,
                {top: 10, bottom: 10, left: 10, right: 10, showBoxes: true},
                c(Label, {
                  font: 'sans',
                  color: 'white',
                  size: 70,
                  text: 'b',
                  showBoxes: true
                })
              ),
              c(
                Margin,
                {top: 10, bottom: 10, left: 10, right: 10, showBoxes: true},
                c(Label, {
                  font: 'sans',
                  color: 'white',
                  size: 70,
                  text: 'c',
                  showBoxes: true
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
                  font: 'sans',
                  color: 'white',
                  size: 50,
                  text: 'Il Caffe',
                  showBoxes: true
                })
              ),
              c(
                Margin,
                {top: 10, bottom: 10, left: 10, right: 10, showBoxes: true},
                c(Label, {
                  font: 'sans',
                  color: 'white',
                  size: 70,
                  text: 'd',
                  showBoxes: true
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
                    font: 'sans',
                    color: 'white',
                    size: 70,
                    text: 'B',
                    showBoxes: true
                  })
                )
              )
            ),
            c(Label, {
              font: 'sans',
              color: 'white',
              size: 20,
              text: 'c',
              showBoxes: true
            }),
            c(Label, {
              font: 'serif',
              color: 'white',
              size: 30,
              text: 'd',
              showBoxes: true
            })
          )
        )
      )
    )
  );
};
