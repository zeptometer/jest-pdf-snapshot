const fs = require('fs');
const path = require('path');

const DIFF_OUTPUT_DIR = '__diff_output__';

function compareChecksum(_source, _target) {

}

function runDiffPdf(_source, _target, _diffOutputPath) {

}

function diffPdfToSnapshot({
  pdfPath,
  snapshotDir,
  snapshotIdentifier,
  updateSnapshot,
  addSnapshot,
}, {
  checksumComparator = compareChecksum,
  diffRunner = runDiffPdf,
} = {}) {
  if (!fs.existsSync(pdfPath)) {
    return {
      pass: false,
      failureType: 'SourcePdfNotPresent',
    };
  }

  const snapshotPath = path.join(snapshotDir, `${snapshotIdentifier}.pdf`);

  if (!fs.existsSync(snapshotPath)) {
    if (addSnapshot) {
      fs.copyFileSync(pdfPath, snapshotPath);

      return {
        pass: true,
        updated: false,
        added: true,
      };
    }

    return {
      pass: false,
      failureType: 'EmptySnapshot',
    };
  }

  if (!checksumComparator(pdfPath, snapshotPath)) {
    const diffOutputPath = path.join(snapshotDir, DIFF_OUTPUT_DIR, `${snapshotIdentifier}-diff.pdf`);

    diffRunner(pdfPath, snapshotPath, diffOutputPath);

    return {
      pass: false,
      failureType: 'MismatchSnapshot',
      diffOutputPath,
    };
  }

  return {
    pass: true,
    updated: false,
    added: false,
  };
}

module.exports = {
  diffPdfToSnapshot,
};
