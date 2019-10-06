## font-metrics

mutated heavily from https://github.com/soulwire/FontMetrics/blob/master/source/FontMetrics.js by Justin Windle

changes from Justin's version:

- remove DOM dependency, making it compatible with node-canvas
- cache results
- add tests
- maintain state using a class. the `new` operator makes it easier to see that it's stateful

TODO:

- [ ] measures strings. does this by
