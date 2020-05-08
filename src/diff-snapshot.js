const fs = require('fs');
const path = require('path');

function diffPdfToSnapshot({
  pdfPath,
  snapshotDir,
  snapshotIdentifier,
  updateSnapshot,
  addSnapshot,
}) {
  if (!fs.existsSync(pdfPath)) {
    return {
      pass: false,
      failureType: 'SourcePdfNotPresent',
      updated: false,
      added: false,
      diffOutputPath: undefined,
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
        diffOutputPath: undefined,
      };
    }

    return {
      pass: false,
      failureType: 'EmptySnapshot',
      updated: false,
      added: false,
      diffOutputPath: undefined,
    };
  }

  return {};
}

module.exports = {
  diffPdfToSnapshot,
};
