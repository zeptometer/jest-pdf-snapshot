const chalk = require('chalk');
const { diffPdfToSnapshot } = require('./diff-snapshot');

// eslint-disable-next-line no-unused-vars
function toMatchPdfSnapshot(_received) {
  const { snapshotState, isNot } = this;

  if (isNot) {
    throw new Error('Jest: `.not` cannot be used with `.toMatchPdfSnapshot()`.');
  }

  // eslint-disable-next-line no-underscore-dangle
  const updateSnapshot = snapshotState._updateSnapshot === 'all';
  // eslint-disable-next-line no-underscore-dangle
  const addSnapshot = snapshotState._updateSnapshot === 'all' || snapshotState._updateSnapshot === 'new';

  const result = diffPdfToSnapshot({
    updateSnapshot,
    addSnapshot,
  });

  const {
    pass,
    diffOutputPath,
    updated,
    added,
  } = result;

  let message = () => '';

  if (updated) {
    snapshotState.updated += 1;
  } else if (added) {
    snapshotState.added += 1;
  } else if (!pass) {
    snapshotState.unmatched += 1;

    switch (result.failureType) {
      case 'MismatchSnapshot':
        message = () => (
          'Expected pdf to be same as the snapshot, but was different.\n'
          + `${chalk.bold.red('See diff for details:')} ${chalk.red(diffOutputPath)}`
        );
        break;

      case 'EmptySnapshot':
        message = () => (
          `New snapshot was ${chalk.bold.red('not written')}. The update flag must be explicitly `
          + 'passed to write a new snapshot.\n\n + This is likely because this test is run in a continuous '
          + 'integration (CI) environment in which snapshots are not written by default.'
        );
        break;

      default:
        throw new Error('Got unexpected failure type');
    }
  } else {
    snapshotState.matched += 1;
  }

  return { pass, message };
}

module.exports = {
  toMatchPdfSnapshot,
};
