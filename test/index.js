'use strict'

const fs = require('fs')
const { createCanvas } = require('canvas')
const tape = require('tape')
const resemble = require('node-resemble-js')
const proxyquire = require('proxyquire')

const log = require('../lib/log')
const { clearTerminal } = require('./lib/util')

const WIDTH = 800
const HEIGHT = 600

function screenshot(name, canvas, t) {
  const base = `${__dirname}/screenshots/${name}`

  const actualFull = `${base}-actual.png`
  const expectedFull = `${base}-expected.png`
  const diffFull = `${base}-diff.png`

  const actualBuffer = canvas.toBuffer()

  fs.writeFileSync(actualFull, actualBuffer)

  if (!fs.existsSync(expectedFull)) {
    fs.writeFileSync(expectedFull, actualBuffer)
  }

  resemble(expectedFull).compareTo(actualFull).onComplete((result) => {
    const exactMatch = result.misMatchPercentage === '0.00'

    t.ok(result.isSameDimensions)
    t.ok(exactMatch)

    if (!exactMatch) {
      const diffImage = result.getDiffImage()
      diffImage.pack().pipe(fs.createWriteStream(diffFull))
    } else {
      fs.existsSync(diffFull) && fs.unlinkSync(diffFull)
    }

    t.end()
  })
}

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
          ),
        ),
        c('button', new Button(), { onInput: log, onClick: log },
          c('margin', new Margin(), { top: 10, bottom: 10, left: 10, right: 10 },
            c('label', new Label(), { font: 'sans', size: 200, text: 'B' })
          ),
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
          ),
        ),
        c('button', new Button(), { onInput: log, onClick: log },
          c('margin', new Margin(), { top: 10, bottom: 10, left: 10, right: 10 },
            c('label', new Label(), { font: 'sans', size: 200, text: 'B' })
          ),
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
          c('label', new Label(), { font: 'sans', size: 25, text: '|' }),
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
          c('label', new Label(), { font: 'sans', size: 100, text: 'A', done: () => {} }),
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
          ),
        ),
        c('button', new Button(), { onInput: log, onClick: log },
          c('margin', new Margin(), { top: 0, bottom: 0, left: 0, right: 0 },
            c('label', new Label(), { font: 'sans', size: 20, text: 'B' })
          ),
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
            ),
          ),
        ),
        c('button', new Button(), { onInput: log, onClick: log },
          c('margin', new Margin(), { top: marginA, bottom: marginA, left: marginA, right: marginA },
            c('label', new Label(), { font: 'sans', size: 20, text: 'B' })
          ),
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
  const marginA = 0
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
