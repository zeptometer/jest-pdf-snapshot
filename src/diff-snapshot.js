const fs = require('fs');
const path = require('path');

function compareChecksum(_source, _target) {

}

function runDiffPdf(_source, _target) {

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
    return {};
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
