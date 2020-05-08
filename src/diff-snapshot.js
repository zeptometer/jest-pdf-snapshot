const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

const DIFF_OUTPUT_DIR = '__diff_output__';

shell.config.fatal = true;

function checkDiff(source, target) {
  return shell.exec(`diff-pdf ${source} ${target}`).code === 0;
}

function generateDiff(source, target, diffOutput) {
  return shell.exec(`diff-pdf --output=${diffOutput} ${source} ${target}`).code === 1;
}

function diffPdfToSnapshot({
  pdfPath,
  snapshotDir,
  snapshotIdentifier,
  updateSnapshot,
  addSnapshot,
}, {
  diffChecker = checkDiff,
  diffGenerator = generateDiff,
} = {}) {
  if (!fs.existsSync(pdfPath)) {
    return {
      pass: false,
      failureType: 'SourcePdfNotPresent',
    };
  }

  const snapshotPath = path.join(snapshotDir, `${snapshotIdentifier}.pdf`);

  if (updateSnapshot) {
    fs.copyFileSync(pdfPath, snapshotPath);

    return {
      pass: true,
      updated: true,
      added: false,
    };
  }

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

  if (!diffChecker(pdfPath, snapshotPath)) {
    const diffOutputDir = path.join(snapshotDir, DIFF_OUTPUT_DIR);

    if (!fs.existsSync(diffOutputDir)) {
      fs.mkdirSync(diffOutputDir);
    }

    const diffOutputPath = path.join(diffOutputDir, `${snapshotIdentifier}-diff.pdf`);

    diffGenerator(pdfPath, snapshotPath, diffOutputPath);

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
