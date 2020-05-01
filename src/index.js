const chalk = require('chalk');
const merge = require('lodash/merge');
const { diffPdfToSnapshot } = require('./diff-snapshot');

// eslint-disable-next-line no-unused-vars
function toMatchPdfSnapshot(_received) {
  const { snapshotState, isNot } = this;

  if (isNot) {
    throw new Error('Jest: `.not` cannot be used with `.toMatchPdfSnapshot()`.');
  }

  const {
    pass,
    diffOutputPath,
    updated,
    added,
  } = diffPdfToSnapshot({
    // eslint-disable-next-line no-underscore-dangle
    updateSnapshot: snapshotState._updateSnapshot === 'all',
  });

  let message = () => '';

  if (updated) {
    merge(snapshotState, {
      updated: snapshotState.updated + 1,
    });
  } else if (added) {
    merge(snapshotState, {
      added: snapshotState.added + 1,
    });
  } else if (!pass) {
    message = () => (
      'Expected pdf to be same as the snapshot, but was different.\n'
      + `${chalk.bold.red('See diff for details:')} ${chalk.red(diffOutputPath)}`
    );
  }

  return { pass, message };
}

module.exports = {
  toMatchPdfSnapshot,
};
