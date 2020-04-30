const chalk = require('chalk');
const { diffPdfToSnapshot } = require('./diff-snapshot');

function toMatchPdfSnapshot(received) {
  const { isNot } = this;
  if (isNot) {
    throw new Error('Jest: `.not` cannot be used with `.toMatchPdfSnapshot()`.');
  }

  const { pass, diffOutputPath } = diffPdfToSnapshot(received);

  const message = () => (
    pass ? '' : (
      'Expected pdf to be same as the snapshot, but was different.\n'
    + `${chalk.bold.red('See diff for details:')} ${chalk.red(diffOutputPath)}`
    )
  );

  return { pass, message };
}

module.exports = {
  toMatchPdfSnapshot,
};
