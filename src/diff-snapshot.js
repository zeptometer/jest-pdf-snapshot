const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

const DIFF_OUTPUT_DIR = '__diff_output__';

shell.config.silent = true;

function defaultIsSamePdf(source, target) {
  return shell.exec(`diff-pdf ${source} ${target}`).code === 0;
}

function defaultGenerateDiff(source, target, diffOutput) {
  return shell.exec(`diff-pdf --output-diff=${diffOutput} ${source} ${target}`);
}

function diffPdfToSnapshot({
  pdfBuffer,
  snapshotDir,
  snapshotIdentifier,
  updateSnapshot,
  addSnapshot,
}, {
  isSamePdf = defaultIsSamePdf,
  generateDiff = defaultGenerateDiff,
} = {}) {
  if (shell.exec('diff-pdf -h').code !== 0) {
    return {
      pass: false,
      failureType: 'DiffPdfNotFound',
    };
  }

  const snapshotPath = path.join(snapshotDir, `${snapshotIdentifier}.pdf`);

  if (updateSnapshot) {
    const snapshotFd = fs.openSync(snapshotPath, 'w');
    fs.writeSync(snapshotFd, pdfBuffer);

    return {
      pass: true,
      updated: true,
      added: false,
    };
  }

  if (!fs.existsSync(snapshotPath)) {
    if (addSnapshot) {
      const snapshotFd = fs.openSync(snapshotPath, 'w');
      fs.writeSync(snapshotFd, pdfBuffer);

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

  if (!isSamePdf(pdfPath, snapshotPath)) {
    const diffOutputDir = path.join(snapshotDir, DIFF_OUTPUT_DIR);

    if (!fs.existsSync(diffOutputDir)) {
      fs.mkdirSync(diffOutputDir);
    }

    const diffOutputPath = path.join(diffOutputDir, `${snapshotIdentifier}-diff.pdf`);

    generateDiff(pdfPath, snapshotPath, diffOutputPath);

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
