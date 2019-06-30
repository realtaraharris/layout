'use strict'

const { createCanvas } = require('canvas')
const tape = require('tape-catch')
const proxyquire = require('proxyquire')

const log = require('../lib/log')
const { clearTerminal, screenshot } = require('./lib/util')

const WIDTH = 800
const HEIGHT = 600

clearTerminal()

tape('spaced-line-horizontal-left-with-margin', t => {
  const { c, renderRoot } = require('../lib/layout')
  const { Root, Margin, Label, SpacedLine } = proxyquire('../lib/components', {
    './log': t.fail
  })

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  const marginA = 0
  const demo1 = ({ x, y, width, height }) => (
    c('root', new Root(), { x, y, width, height },
      c('spacedLine', new SpacedLine(), { mode: 'horizontal', align: 'left' },
        c('label', new Label(), { font: 'sans', size: 90, text: 'Push Me', done: () => {} }),
        c('margin', new Margin(), { top: marginA, bottom: marginA, left: marginA, right: marginA },
          c('label', new Label(), { font: 'sans', size: 100, text: 'A', done: () => {} })
        )
      )
    )
  )

  renderRoot(ctx, demo1({ x: 0, y: 0, width: WIDTH, height: HEIGHT }))
  screenshot('spaced-line-horizontal-left-with-margin', canvas, t)
})

tape('spaced-line-horizontal-right-with-margin', t => {
  const { c, renderRoot } = require('../lib/layout')
  const { Root, Margin, Label, SpacedLine } = proxyquire('../lib/components', {
    './log': t.fail
  })

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  const marginA = 0
  const demo1 = ({ x, y, width, height }) => (
    c('root', new Root(), { x, y, width, height },
      c('spacedLine', new SpacedLine(), { mode: 'horizontal', align: 'right' },
        c('label', new Label(), { font: 'sans', size: 90, text: 'Push Me', done: () => {} }),
        c('margin', new Margin(), { top: marginA, bottom: marginA, left: marginA, right: marginA },
          c('label', new Label(), { font: 'sans', size: 100, text: 'A', done: () => {} })
        )
      )
    )
  )

  renderRoot(ctx, demo1({ x: 0, y: 0, width: WIDTH, height: HEIGHT }))
  screenshot('spaced-line-horizontal-right-with-margin', canvas, t)
})

tape('spaced-line-vertical-left-with-margin', t => {
  const { c, renderRoot } = require('../lib/layout')
  const { Root, Margin, Label, SpacedLine } = proxyquire('../lib/components', {
    './log': t.fail
  })

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  const marginA = 0
  const demo1 = ({ x, y, width, height }) => (
    c('root', new Root(), { x, y, width, height },
      c('spacedLine', new SpacedLine(), { mode: 'vertical', align: 'left' },
        c('label', new Label(), { font: 'sans', size: 90, text: 'Push Me', done: () => {} }),
        c('margin', new Margin(), { top: marginA, bottom: marginA, left: marginA, right: marginA },
          c('label', new Label(), { font: 'sans', size: 100, text: 'A', done: () => {} })
        )
      )
    )
  )

  renderRoot(ctx, demo1({ x: 0, y: 0, width: WIDTH, height: HEIGHT }))
  screenshot('spaced-line-vertical-left-with-margin', canvas, t)
})

tape('vertical layout', t => {
  const { c, renderRoot } = require('../lib/layout')
  const { Root, Margin, Button, Label, SpacedLine } = proxyquire('../lib/components', {
    './log': t.fail
  })

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  const marginA = 0
  const demo1 = ({ x, y, width, height }) => (
    c('root', new Root(), { x, y, width, height },
      c('spacedLine', new SpacedLine(), { mode: 'vertical', align: 'center' },
        c('label', new Label(), { font: 'sans', size: 20, text: 'Push Me', done: () => {} }),
        c('label', new Label(), { font: 'sans', size: 20, text: 'Push Me', done: () => {} }),
        c('label', new Label(), { font: 'sans', size: 20, text: 'Push Me', done: () => {} }),
        c('label', new Label(), { font: 'sans', size: 20, text: 'Push Me', done: () => {} }),
        c('button', new Button(), { onInput: log, onClick: log },
          c('margin', new Margin(), { top: marginA, bottom: marginA, left: marginA, right: marginA },
            c('label', new Label(), { font: 'sans', size: 100, text: 'A', done: () => {} })
          )
        ),
        c('button', new Button(), { onInput: log, onClick: log },
          c('margin', new Margin(), { top: 10, bottom: 10, left: 10, right: 10 },
            c('label', new Label(), { font: 'sans', size: 200, text: 'B' })
          )
        ),
        c('button', new Button(), { onInput: log, onClick: log },
          c('margin', new Margin(), { top: 0, bottom: 0, left: 0, right: 0 },
            c('label', new Label(), { font: 'serif', size: 30, text: `C` })
          )
        )
      )
    )
  )

  renderRoot(ctx, demo1({ x: 0, y: 0, width: WIDTH, height: HEIGHT }))
  screenshot('vertical', canvas, t)
})

tape('vertical layout, right-aligned', t => {
  const { c, renderRoot } = require('../lib/layout')
  const { Root, Margin, Button, Label, SpacedLine } = proxyquire('../lib/components', {
    './log': t.fail
  })

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  const marginA = 0
  const demo1 = ({ x, y, width, height }) => (
    c('root', new Root(), { x, y, width, height },
      c('spacedLine', new SpacedLine(), { mode: 'vertical', align: 'right' },
        c('label', new Label(), { font: 'sans', size: 20, text: 'Push Me', done: () => {} }),
        c('label', new Label(), { font: 'sans', size: 20, text: 'Push Me', done: () => {} }),
        c('label', new Label(), { font: 'sans', size: 20, text: 'Push Me', done: () => {} }),
        c('label', new Label(), { font: 'sans', size: 20, text: 'Push Me', done: () => {} }),
        c('button', new Button(), { onInput: log, onClick: log },
          c('margin', new Margin(), { top: marginA, bottom: marginA, left: marginA, right: marginA },
            c('label', new Label(), { font: 'sans', size: 100, text: 'A', done: () => {} })
          )
        ),
        c('button', new Button(), { onInput: log, onClick: log },
          c('margin', new Margin(), { top: 10, bottom: 10, left: 10, right: 10 },
            c('label', new Label(), { font: 'sans', size: 200, text: 'B' })
          )
        ),
        c('button', new Button(), { onInput: log, onClick: log },
          c('margin', new Margin(), { top: 0, bottom: 0, left: 0, right: 0 },
            c('label', new Label(), { font: 'serif', size: 30, text: `C` })
          )
        )
      )
    )
  )

  renderRoot(ctx, demo1({ x: 0, y: 0, width: WIDTH, height: HEIGHT }))
  screenshot('vertical-right', canvas, t)
})

tape('spaced-line vertical right', t => {
  const { c, renderRoot } = require('../lib/layout')
  const { Root, Margin, Label, SpacedLine } = proxyquire('../lib/components', {
    './log': t.fail
  })

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  const marginA = 100
  const demo1 = ({ x, y, width, height }) => (
    c('root', new Root(), { x, y, width, height },
      c('margin', new Margin(), { top: marginA, bottom: marginA, left: marginA, right: marginA },
        c('spacedLine', new SpacedLine(), { mode: 'vertical', align: 'right' },
          c('label', new Label(), { font: 'sans', size: 100, text: 'i' }),
          c('label', new Label(), { font: 'sans', size: 100, text: 'Wide' }),
          c('label', new Label(), { font: 'sans', size: 100, text: '|' })
        )
      )
    )
  )

  renderRoot(ctx, demo1({ x: 0, y: 0, width: WIDTH, height: HEIGHT }))
  screenshot('spaced-line-vertical-right', canvas, t)
})

tape('spaced-line vertical center', t => {
  const { c, renderRoot } = require('../lib/layout')
  const { Root, Margin, Label, SpacedLine } = proxyquire('../lib/components', {
    './log': t.fail
  })

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  const marginA = 100
  const demo1 = ({ x, y, width, height }) => (
    c('root', new Root(), { x, y, width, height },
      c('margin', new Margin(), { top: marginA, bottom: marginA, left: marginA, right: marginA },
        c('spacedLine', new SpacedLine(), { mode: 'vertical', align: 'center' },
          c('label', new Label(), { font: 'sans', size: 25, text: 'i' }),
          c('label', new Label(), { font: 'sans', size: 25, text: 'Wide' }),
          c('label', new Label(), { font: 'sans', size: 25, text: '|' })
        )
      )
    )
  )

  renderRoot(ctx, demo1({ x: 0, y: 0, width: WIDTH, height: HEIGHT }))
  screenshot('spaced-line-vertical-center', canvas, t)
})

tape('spaced-line horizontal center', t => {
  const { c, renderRoot } = require('../lib/layout')
  const { Root, Margin, Label, SpacedLine } = proxyquire('../lib/components', {
    './log': t.fail
  })

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  const marginA = 100
  const demo1 = ({ x, y, width, height }) => (
    c('root', new Root(), { x, y, width, height },
      c('margin', new Margin(), { top: marginA, bottom: marginA, left: marginA, right: marginA },
        c('spacedLine', new SpacedLine(), { mode: 'horizontal', align: 'center' },
          c('label', new Label(), { font: 'sans', size: 25, text: 'i' }),
          c('label', new Label(), { font: 'sans', size: 25, text: 'Wide' }),
          c('label', new Label(), { font: 'sans', size: 25, text: '|' })
        )
      )
    )
  )

  renderRoot(ctx, demo1({ x: 0, y: 0, width: WIDTH, height: HEIGHT }))
  screenshot('spaced-line-horizontal-center', canvas, t)
})

tape('spaced-line diagonal center', t => {
  const { c, renderRoot } = require('../lib/layout')
  const { Root, Margin, Label, SpacedLine } = proxyquire('../lib/components', {
    './log': t.fail
  })

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  const marginA = 100
  const demo1 = ({ x, y, width, height }) => (
    c('root', new Root(), { x, y, width, height },
      c('margin', new Margin(), { top: marginA, bottom: marginA, left: marginA, right: marginA },
        c('spacedLine', new SpacedLine(), { mode: 'diagonal', align: 'center' },
          c('label', new Label(), { font: 'sans', size: 25, text: 'i' }),
          c('label', new Label(), { font: 'sans', size: 25, text: 'Wide' }),
          c('label', new Label(), { font: 'sans', size: 25, text: '|' })
        )
      )
    )
  )

  renderRoot(ctx, demo1({ x: 0, y: 0, width: WIDTH, height: HEIGHT }))
  screenshot('spaced-line-diagonal-center', canvas, t)
})

tape('spaced-line-horizontal-right', t => {
  const { c, renderRoot } = require('../lib/layout')
  const { Root, Margin, Label, SpacedLine } = proxyquire('../lib/components', {
    './log': t.fail
  })

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  const marginA = 100
  const demo1 = ({ x, y, width, height }) => (
    c('root', new Root(), { x, y, width, height },
      c('margin', new Margin(), { top: marginA, bottom: marginA, left: marginA, right: marginA },
        c('spacedLine', new SpacedLine(), { mode: 'horizontal', align: 'right' },
          c('label', new Label(), { font: 'sans', size: 25, text: 'i' }),
          c('label', new Label(), { font: 'sans', size: 25, text: 'Wide' }),
          c('label', new Label(), { font: 'sans', size: 25, text: '|' })
        )
      )
    )
  )

  renderRoot(ctx, demo1({ x: 0, y: 0, width: WIDTH, height: HEIGHT }))
  screenshot('spaced-line-horizontal-right', canvas, t)
})

tape('spaced-line-vertical-center-with-margin', t => {
  const { c, renderRoot } = require('../lib/layout')
  const { Root, Margin, Button, Label, SpacedLine } = proxyquire('../lib/components', {
    './log': t.fail
  })

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  const demo1 = ({ x, y, width, height }) => (
    c('root', new Root(), { x, y, width, height },
      c('spacedLine', new SpacedLine(), { mode: 'vertical', align: 'center' },
        c('button', new Button(), { onInput: log, onClick: log },
          c('margin', new Margin(), { top: 10, bottom: 10, left: 10, right: 10 },
            c('label', new Label(), { font: 'sans', size: 70, text: 'B' })
          )
        )
      )
    )
  )

  renderRoot(ctx, demo1({ x: 0, y: 0, width: WIDTH, height: HEIGHT }))
  screenshot('spaced-line-vertical-center-with-margin', canvas, t)
})

tape('complex-nested', t => {
  const { c, renderRoot } = require('../lib/layout')
  const { Root, Margin, Button, Label, SpacedLine } = proxyquire('../lib/components', {
    './log': t.fail
  })

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  const demo1 = ({ x, y, width, height }) => (
    c('root', new Root(), { x, y, width, height },
      c('spacedLine', new SpacedLine(), { mode: 'vertical', align: 'center' },
        c('button', new Button(), { onInput: log, onClick: log },
          c('margin', new Margin(), { top: 10, bottom: 10, left: 10, right: 10 },
            c('label', new Label(), { font: 'sans', size: 70, text: 'B' })
          )
        ),
        c('spacedLine', new SpacedLine(), { mode: 'horizontal', align: 'center' },
          c('button', new Button(), { onInput: log, onClick: log },
            c('margin', new Margin(), { top: 10, bottom: 10, left: 10, right: 10 },
              c('label', new Label(), { font: 'sans', size: 70, text: 'B' })
            )
          ),
          c('margin', new Margin(), { top: 10, bottom: 10, left: 10, right: 10 },
            c('label', new Label(), { font: 'sans', size: 70, text: 'B' })
          ),
          c('margin', new Margin(), { top: 10, bottom: 10, left: 10, right: 10 },
            c('label', new Label(), { font: 'sans', size: 70, text: 'B' })
          ),
          c('margin', new Margin(), { top: 200, bottom: 10, left: 10, right: 100 },
            c('label', new Label(), { font: 'sans', size: 150, text: 'Butter' })
          ),
          c('margin', new Margin(), { top: 10, bottom: 10, left: 10, right: 10 },
            c('label', new Label(), { font: 'sans', size: 70, text: 'B' })
          )
        ),
        c('spacedLine', new SpacedLine(), { mode: 'diagonal', align: 'center' },
          c('button', new Button(), { onInput: log, onClick: log },
            c('margin', new Margin(), { top: 10, bottom: 10, left: 10, right: 10 },
              c('label', new Label(), { font: 'sans', size: 70, text: 'B' })
            )
          )
        )
      )
    )
  )

  renderRoot(ctx, demo1({ x: 0, y: 0, width: WIDTH, height: HEIGHT }))
  screenshot('complex-nested', canvas, t)
})

tape('margin', t => {
  const { c, renderRoot } = require('../lib/layout')
  const { Root, Margin, Label, SpacedLine } = proxyquire('../lib/components', {
    './log': t.fail
  })

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  const marginA = 10
  const demo1 = ({ x, y, width, height }) => (
    c('root', new Root(), { x, y, width, height },
      c('spacedLine', new SpacedLine(), { mode: 'horizontal', align: 'left' },
        c('margin', new Margin(), { top: marginA, bottom: marginA, left: marginA, right: marginA },
          c('label', new Label(), { font: 'sans', size: 100, text: 'A', done: () => {} })
        ),
        c('margin', new Margin(), { top: marginA, bottom: marginA, left: marginA, right: marginA },
          c('label', new Label(), { font: 'sans', size: 100, text: 'i', done: () => {} })
        )
      )
    )
  )

  renderRoot(ctx, demo1({ x: 0, y: 0, width: WIDTH, height: HEIGHT }))
  screenshot('margin', canvas, t)
})

tape('horizontal layout', t => {
  const { c, renderRoot } = require('../lib/layout')
  const { Root, Margin, Button, Label, SpacedLine } = proxyquire('../lib/components', {
    './log': t.fail
  })

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  const marginA = 0
  const demo1 = ({ x, y, width, height }) => (
    c('root', new Root(), { x, y, width, height },
      c('spacedLine', new SpacedLine(), { mode: 'horizontal', align: 'center' },
        c('label', new Label(), { font: 'sans', size: 20, text: 'Push Me', done: () => {} }),
        c('label', new Label(), { font: 'sans', size: 20, text: 'Push Me', done: () => {} }),
        c('label', new Label(), { font: 'sans', size: 20, text: 'Push Me', done: () => {} }),
        c('label', new Label(), { font: 'sans', size: 20, text: 'Push Me', done: () => {} }),
        c('button', new Button(), { onInput: log, onClick: log },
          c('margin', new Margin(), { top: marginA, bottom: marginA, left: marginA, right: marginA },
            c('label', new Label(), { font: 'sans', size: 100, text: 'A', done: () => {} })
          )
        ),
        c('button', new Button(), { onInput: log, onClick: log },
          c('margin', new Margin(), { top: 0, bottom: 0, left: 0, right: 0 },
            c('label', new Label(), { font: 'sans', size: 20, text: 'B' })
          )
        ),
        c('button', new Button(), { onInput: log, onClick: log },
          c('margin', new Margin(), { top: 0, bottom: 0, left: 0, right: 0 },
            c('label', new Label(), { font: 'serif', size: 30, text: `C` })
          )
        )
      )
    )
  )

  renderRoot(ctx, demo1({ x: 0, y: 0, width: WIDTH, height: HEIGHT }))
  screenshot('horizontal', canvas, t)
})

tape('diagonal layout', t => {
  const { c, renderRoot } = require('../lib/layout')
  const { Root, Margin, Button, Label, SpacedLine } = proxyquire('../lib/components', {
    './log': t.fail
  })

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  const marginA = 20
  const demo1 = ({ x, y, width, height }) => (
    c('root', new Root(), { x, y, width, height },
      c('spacedLine', new SpacedLine(), { mode: 'diagonal', align: 'left' },
        c('label', new Label(), { font: 'sans', size: 20, text: 'Push Me', done: () => {} }),
        c('label', new Label(), { font: 'sans', size: 20, text: 'Push Me', done: () => {} }),
        c('label', new Label(), { font: 'sans', size: 20, text: 'Push Me', done: () => {} }),
        c('label', new Label(), { font: 'sans', size: 20, text: 'Push Me', done: () => {} }),
        c('button', new Button(), { onInput: log, onClick: log },
          c('margin', new Margin(), { top: marginA, bottom: marginA, left: marginA, right: marginA },
            c('spacedLine', new SpacedLine(), { mode: 'vertical', align: 'left' },
              c('label', new Label(), { font: 'sans', size: 100, text: 'A', done: () => {} }),
              c('label', new Label(), { font: 'sans', size: 100, text: 'A', done: () => {} })
            )
          )
        ),
        c('button', new Button(), { onInput: log, onClick: log },
          c('margin', new Margin(), { top: marginA, bottom: marginA, left: marginA, right: marginA },
            c('label', new Label(), { font: 'sans', size: 20, text: 'B' })
          )
        ),
        c('button', new Button(), { onInput: log, onClick: log },
          c('margin', new Margin(), { top: marginA, bottom: marginA, left: marginA, right: marginA },
            c('label', new Label(), { font: 'serif', size: 30, text: `C` })
          )
        )
      )
    )
  )

  renderRoot(ctx, demo1({ x: 0, y: 0, width: WIDTH, height: HEIGHT }))
  screenshot('diagonal', canvas, t)
})

tape('mixed layout, no margins', t => {
  const { c, renderRoot } = require('../lib/layout')
  const { Root, Label, SpacedLine } = proxyquire('../lib/components', {
    './log': t.fail
  })

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  const demo1 = ({ x, y, width, height }) => (
    c('root', new Root(), { x, y, width, height },
      c('spacedLine', new SpacedLine(), { mode: 'horizontal', align: 'left' },
        c('spacedLine', new SpacedLine(), { mode: 'vertical', align: 'left' },
          c('label', new Label(), { font: 'sans', size: 100, text: 'A', done: () => {} }),
          c('label', new Label(), { font: 'sans', size: 100, text: 'B', done: () => {} })
        ),
        c('label', new Label(), { font: 'sans', size: 20, text: 'c' }),
        c('label', new Label(), { font: 'serif', size: 30, text: 'd' })
      )
    )
  )

  renderRoot(ctx, demo1({ x: 0, y: 0, width: WIDTH, height: HEIGHT }))
  screenshot('mixed', canvas, t)
})

tape('viewport', t => {
  const { c, renderRoot } = require('../lib/layout')
  const { Root, Label, SpacedLine, Button, Margin, Viewport } = proxyquire('../lib/components', {
    './log': t.fail
  })

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')

  const shrink = 40

  const demo1 = ({ x, y, width, height }) => (
    c('root', new Root(), { x, y, width, height },
      c('spacedLine', new SpacedLine(), { mode: 'horizontal', align: 'center' },
        c('margin', new Margin(), { top: 10, bottom: 10, left: 10, right: 10 },
          c('label', new Label(), { font: 'serif', size: 30, text: 'item 0' })
        ),
        c('spacedLine', new SpacedLine(), { mode: 'vertical', align: 'center' },
          c('margin', new Margin(), { top: 10, bottom: 10, left: 10, right: 10 },
            c('label', new Label(), { font: 'serif', size: 30, text: 'item 1' })
          ),
          c('margin', new Margin(), { top: 10, bottom: 10, left: 10, right: 10 },
            c('label', new Label(), { font: 'serif', size: 30, text: 'item 2' })
          ),
          c('viewport', new Viewport(), { width: 500 - shrink, height: 284 - shrink, offsetX: 1.0, offsetY: 1.0 },
            c('spacedLine', new SpacedLine(), { mode: 'vertical', align: 'center' },
              c('button', new Button(), { onInput: log, onClick: log },
                c('margin', new Margin(), { top: 10, bottom: 10, left: 10, right: 10 },
                  c('label', new Label(), { font: 'sans', size: 70, text: 'crazy 88s' })
                )
              ),
              c('spacedLine', new SpacedLine(), { mode: 'horizontal', align: 'center' },
                c('button', new Button(), { onInput: log, onClick: log },
                  c('margin', new Margin(), { top: 10, bottom: 10, left: 10, right: 10 },
                    c('label', new Label(), { font: 'sans', size: 70, text: 'a' })
                  )
                ),
                c('margin', new Margin(), { top: 10, bottom: 10, left: 10, right: 10 },
                  c('label', new Label(), { font: 'sans', size: 70, text: 'b' })
                ),
                c('margin', new Margin(), { top: 10, bottom: 10, left: 10, right: 10 },
                  c('label', new Label(), { font: 'sans', size: 70, text: 'c' })
                ),
                c('margin', new Margin(), { top: 50, bottom: 10, left: 10, right: 100 },
                  c('label', new Label(), { font: 'sans', size: 50, text: 'Il Caffe' })
                ),
                c('margin', new Margin(), { top: 10, bottom: 10, left: 10, right: 10 },
                  c('label', new Label(), { font: 'sans', size: 70, text: 'd' })
                )
              ),
              c('spacedLine', new SpacedLine(), { mode: 'diagonal', align: 'center' },
                c('button', new Button(), { onInput: log, onClick: log },
                  c('margin', new Margin(), { top: 10, bottom: 10, left: 10, right: 10 },
                    c('label', new Label(), { font: 'sans', size: 70, text: 'B' })
                  )
                )
              ),
              c('label', new Label(), { font: 'sans', size: 20, text: 'c' }),
              c('label', new Label(), { font: 'serif', size: 30, text: 'd' })
            )
          )
        )
      )
    )
  )

  renderRoot(ctx, demo1({ x: 0, y: 0, width: WIDTH, height: HEIGHT }))
  screenshot('viewport', canvas, t)
})

tape('components-line-215', t => {
  t.plan(2)
  const { c, renderRoot } = require('../lib/layout')
  const { Root, Label, SpacedLine } = proxyquire('../lib/components', {
    './log': t.ok // the test passes only if we trigger the error
  })

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  const demo1 = ({ x, y, width, height }) => (
    c('root', new Root(), { x, y, width, height },
      c('spacedLine', new SpacedLine(), { mode: 'horizontal', align: 'heft' },
        c('label', new Label(), { font: 'sans', size: 20, text: 'c' }),
        c('label', new Label(), { font: 'serif', size: 30, text: 'd' })
      )
    )
  )

  renderRoot(ctx, demo1({ x: 0, y: 0, width: WIDTH, height: HEIGHT }))
})

tape('components-line-228', t => {
  t.plan(2)
  const { c, renderRoot } = require('../lib/layout')
  const { Root, Label, SpacedLine } = proxyquire('../lib/components', {
    './log': t.ok // the test passes only if we trigger the error
  })

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  const demo1 = ({ x, y, width, height }) => (
    c('root', new Root(), { x, y, width, height },
      c('spacedLine', new SpacedLine(), { mode: 'vertical', align: 'heft' },
        c('label', new Label(), { font: 'sans', size: 20, text: 'c' }),
        c('label', new Label(), { font: 'serif', size: 30, text: 'd' })
      )
    )
  )

  renderRoot(ctx, demo1({ x: 0, y: 0, width: WIDTH, height: HEIGHT }))
})

tape('components-line-236', t => {
  t.plan(6)
  const { c, renderRoot } = require('../lib/layout')
  const { Root, Label, SpacedLine } = proxyquire('../lib/components', {
    './log': t.ok // the test passes only if we trigger the error
  })

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  const demo1 = ({ x, y, width, height }) => (
    c('root', new Root(), { x, y, width, height },
      c('spacedLine', new SpacedLine(), { mode: 'diagone', align: 'left' },
        c('label', new Label(), { font: 'sans', size: 20, text: 'c' }),
        c('label', new Label(), { font: 'serif', size: 30, text: 'd' })
      )
    )
  )

  renderRoot(ctx, demo1({ x: 0, y: 0, width: WIDTH, height: HEIGHT }))
})

tape('components-line-246', t => {
  t.plan(6)
  const { c, renderRoot } = require('../lib/layout')
  const { Root, Label, SpacedLine } = proxyquire('../lib/components', {
    './log': t.ok // the test passes only if we trigger the error
  })

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  const demo1 = ({ x, y, width, height }) => (
    c('root', new Root(), { x, y, width, height },
      c('spacedLine', new SpacedLine(), { mode: 'bertical', align: 'left' },
        c('label', new Label(), { font: 'sans', size: 20, text: 'c' }),
        c('label', new Label(), { font: 'serif', size: 30, text: 'd' })
      )
    )
  )

  renderRoot(ctx, demo1({ x: 0, y: 0, width: WIDTH, height: HEIGHT }))
})

tape('text', t => {
  const { c, renderRoot } = require('../lib/layout')
  const { Root, Margin, Label, SpacedLine } = proxyquire('../lib/components', {
    './log': t.fail
  })

  const Text = require('../lib/components/text')

  const wordsToLiveBy = `When you grow up you tend to get told the world is the way it is and your job is just to live your life inside the world. Try not to bash into the walls too much. Try to have a nice family life, have fun, save a little money.\nThat's a very limited life. Life can be much broader once you discover one simple fact, and that is: everything around you that you call life, was made up by people that were no smarter than you. And you can change it, you can influence it, you can build your own things that other people can use.\nThe minute that you understand that you can poke life and actually something will, you know if you push in, something will pop out the other side, that you can change it, you can mold it. That's maybe the most important thing. It's to shake off this erroneous notion that life is there and you're just gonna live in it, versus embrace it, change it, improve it, make your mark upon it.\nI think that’s very important and however you learn that, once you learn it, you'll want to change life and make it better, cause it's kind of messed up, in a lot of ways. Once you learn that, you'll never be the same again.`

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  const marginA = 20

  const textWidth = 720
  const textHeight = 360
  const w = textWidth / 10
  const h = textHeight / 10

  const boundingPolygon = {
    lineLoop: [
      [ 0, 0, w, 0 ], // x1, y1, x2, y2
      [ w, 0, w, h ],
      [ w, h, 0, h ],
      [ 0, h, 0, 0 ]
    ],
    aabb: [
      0, 0, w, h // x, y, width, height
    ]
  }

  const cutoutPolygon = {
    lineLoop: [
      [ 15, 5, 22.5, 9.5 ], // x1, y1, x2, y2
      [ 22.5, 9.5, 30, 5 ],
      [ 30, 5, 15, 5 ],
    ],
    aabb: [
      0, 0, 30, 30 // x, y, width, height
    ]
  }

  const demo1 = ({ x, y, width, height }) => (
    c('root', new Root(), { x, y, width, height },
      c('spacedLine', new SpacedLine(), { mode: 'vertical', align: 'left' },
        c('label', new Label(), { font: 'sans', size: 100, text: 'Push Me', done: () => {} }),
        c('margin', new Margin(), { top: marginA, bottom: marginA, left: marginA, right: 20 },
          c('text', new Text(), {
            width: textWidth,
            height: textHeight,
            lineHeight: 1,
            font: 'sans',
            size: 100,
            text: wordsToLiveBy,
            style: { font: `${17}px serif`, fillStyle: 'black' },
            boundingPolygon,
            cutoutPolygon,
            done: () => {} }
          )
        )
      )
    )
  )

  renderRoot(ctx, demo1({ x: 0, y: 0, width: WIDTH, height: HEIGHT }))
  screenshot('text', canvas, t)
})

tape('text - concave cutout', t => {
  const { c, renderRoot } = require('../lib/layout')
  const { Root, Margin, Label, SpacedLine } = proxyquire('../lib/components', {
    './log': t.fail
  })

  const Text = require('../lib/components/text')

  const wordsToLiveBy = `When you grow up you tend to get told the world is the way it is and your job is just to live your life inside the world. Try not to bash into the walls too much. Try to have a nice family life, have fun, save a little money. That's a very limited life. Life can be much broader once you discover one simple fact, and that is: everything around you that you call life, was made up by people that were no smarter than you. And you can change it, you can influence it, you can build your own things that other people can use. The minute that you understand that you can poke life and actually something will, you know if you push in, something will pop out the other side, that you can change it, you can mold it. That's maybe the most important thing. It's to shake off this erroneous notion that life is there and you're just gonna live in it, versus embrace it, change it, improve it, make your mark upon it. I think that’s very important and however you learn that, once you learn it, you'll want to change life and make it better, cause it's kind of messed up, in a lot of ways. Once you learn that, you'll never be the same again.`

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  const marginA = 20

  const textWidth = 520
  const textHeight = 460
  const w = textWidth / 10
  const h = textHeight / 10

  const boundingPolygon = {
    lineLoop: [
      [ 0, 0, w, 0 ], // x1, y1, x2, y2
      [ w, 0, w, h ],
      [ w, h, 0, h ],
      [ 0, h, 0, 0 ]
    ],
    aabb: [
      0, 0, w, h // x, y, width, height
    ]
  }

  const cutoutPolygon = {
    lineLoop: [
      [ 0, 0, 10, 12 ], // x1, y1, x2, y2
      [ 10, 12, 8, 18 ],
      [ 8, 18, 13, 13 ],
      [ 13, 13, 18, 18 ],
      [ 18, 18, 16, 12 ],
      [ 16, 12, 26, 0 ],
      [ 26, 0, 13, 8 ],
      [ 13, 8, 0, 0 ]
    ],
    aabb: [
      10, 1, 26, 18 // x, y, width, height
    ]
  }

  const demo1 = ({ x, y, width, height }) => (
    c('root', new Root(), { x, y, width, height },
      c('spacedLine', new SpacedLine(), { mode: 'vertical', align: 'left' },
        c('label', new Label(), { font: 'sans', size: 100, text: 'Push Me', done: () => {} }),
        c('margin', new Margin(), { top: marginA, bottom: marginA, left: marginA, right: 20 },
          c('text', new Text(), {
            width: textWidth,
            height: textHeight,
            lineHeight: 1,
            font: 'sans',
            size: 100,
            text: wordsToLiveBy,
            style: { font: `${20}px serif`, fillStyle: 'black' },
            boundingPolygon,
            cutoutPolygon,
            done: () => {} }
          )
        )
      )
    )
  )

  renderRoot(ctx, demo1({ x: 0, y: 0, width: WIDTH, height: HEIGHT }))
  screenshot('text-concave-cutout', canvas, t)
})
