// can't use strict because it specifically disallows octal escape characters

/**
 * Clears the terminal's scrollback buffer
 */
function clearTerminal() {
  process.stdout.write('\033c')
}

exports.clearTerminal = clearTerminal
