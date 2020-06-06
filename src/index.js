const chalk = require('chalk');
const fs = require('fs');
const kebabCase = require('lodash/kebabCase');
const path = require('path');

const { diffPdfToSnapshot } = require('./diff-snapshot');

const SNAPSHOTS_DIR = '__pdf_snapshots__';

function initializeOrIncrementTestCounter(
  testCounterMap,
  currentTestName,
) {
  const currentCount = testCounterMap.get(currentTestName);
  const updatedCount = (currentCount || 0) + 1;
  testCounterMap.set(currentTestName, updatedCount);
}

function createSnapshotIdentifier({
  testPath,
  currentTestName,
  snapshotState,
}) {
  // eslint-disable-next-line no-underscore-dangle
  const counter = snapshotState._counters.get(currentTestName);
  return kebabCase(`${path.basename(testPath)}-${currentTestName}-${counter}`);
}

// eslint-disable-next-line no-unused-vars
function toMatchPdfSnapshot(received) {
  const {
    testPath, currentTestName, snapshotState, isNot,
  } = this;

  if (isNot) {
    throw new Error('Jest: `.not` cannot be used with `.toMatchPdfSnapshot()`.');
  }

  const snapshotDir = path.join(path.dirname(testPath), SNAPSHOTS_DIR);

  if (!fs.existsSync(snapshotDir)) {
    fs.mkdirSync(snapshotDir);
  }

  // eslint-disable-next-line no-underscore-dangle
  initializeOrIncrementTestCounter(snapshotState._counters, currentTestName);

  const snapshotIdentifier = createSnapshotIdentifier({
    testPath,
    currentTestName,
    snapshotState,
  });
  // eslint-disable-next-line no-underscore-dangle
  const updateSnapshot = snapshotState._updateSnapshot === 'all';
  // eslint-disable-next-line no-underscore-dangle
  const addSnapshot = ['all', 'new'].includes(snapshotState._updateSnapshot);

  const result = diffPdfToSnapshot({
    pdfPath: received,
    snapshotDir,
    snapshotIdentifier,
    updateSnapshot,
    addSnapshot,
  });

  const {
    pass,
    diffOutputPath,
    updated,
    added,
  } = result;

  if (!pass) {
    snapshotState.unmatched += 1;
    let message;

    switch (result.failureType) {
      case 'DiffPdfNotFound':
        throw new Error('Jest: diff-pdf is not available. Install diff-pdf from https://github.com/vslavik/diff-pdf');

      case 'SourcePdfNotPresent':
        throw new Error(`Jest: given path to \`.toMatchPdfSnapshot()\` is not present: ${received}`);

      case 'EmptySnapshot':
        message = () => (
          `New snapshot was ${chalk.bold.red('not written')}. The update flag must be explicitly `
          + 'passed to write a new snapshot.\n\n + This is likely because this test is run in a continuous '
          + 'integration (CI) environment in which snapshots are not written by default.'
        );
        break;

      case 'MismatchSnapshot':
        message = () => (
          'Expected pdf to be same as the snapshot, but was different.\n'
          + `${chalk.bold.red('See diff for details:')} ${chalk.red(diffOutputPath)}`
        );
        break;

      default:
        throw new Error('Got unexpected failure type');
    }

    return { pass, message };
  }

  if (updated) {
    snapshotState.updated += 1;
  } else if (added) {
    snapshotState.added += 1;
  } else {
    snapshotState.matched += 1;
  }

  return { pass, message: () => '' };
}

module.exports = {
  toMatchPdfSnapshot,
};
