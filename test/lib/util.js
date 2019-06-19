'use strict'

/**
 * Clears the terminal's scrollback buffer
 */
function clearTerminal() {
  process.stdout.write('\x1Bc')
}

exports.clearTerminal = clearTerminal
