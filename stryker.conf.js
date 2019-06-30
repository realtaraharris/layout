module.exports = function (config) {
  config.set({
    mutate: [
      'lib/layout.js',
      'lib/components.js',
      'lib/components/text.js'
    ],
    mutator: 'javascript',
    packageManager: 'npm',
    reporters: ['html', 'progress'],
    testRunner: 'command',
    commandRunner: {
      command: 'npm run test'
    },
    transpilers: [],
    coverageAnalysis: 'perTest'
  })
}
