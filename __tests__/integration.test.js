/**
 * @group integration
 */

/* eslint-disable global-require */
const shell = require('shelljs');
const fs = require('fs');

shell.config.silent = true;

function maskTime(jestOutput) {
  return jestOutput
    .replace(/\(\d+ ms\)/g, '(??? ms)')
    .replace(/\d+\.\d+ s, estimated \d+ s/g, '??? s')
    .replace(/\d+\.\d+ s/g, '??? s');
}

describe('jest-pdf-snapshot', () => {
  beforeAll(() => {
    shell.cd('__tests__/mock_project');
    shell.rm('-rf', 'node_modules');
    shell.exec('yarn install');
    shell.cd('..');
    shell.rm('-rf', 'sandbox');
  });

  beforeEach(() => {
    shell.cp('-r', './mock_project', './sandbox');
    shell.cd('./sandbox');
  });

  afterEach(() => {
    shell.cd('..');
    shell.rm('-rf', './sandbox');
  });

  it('works as expected when local testing', () => {
    // When
    const result = shell.exec('yarn test -i mock.test.js');

    // Then
    expect(maskTime(result.stderr)).toMatchSnapshot();
    expect(fs.existsSync('__pdf_snapshots__/mock-test-js-snapshot-is-absent-1.pdf'))
      .toBeTruthy();
    expect(fs.existsSync('__pdf_snapshots__/__diff_output__/mock-test-js-snapshot-is-different-1-diff.pdf'))
      .toBeTruthy();
  });

  it('works as expected when updating snapshot', () => {
    // Given
    const snapshotPath = '__pdf_snapshots__/mock-test-js-snapshot-is-different-1.pdf';
    const originalModifiedTime = fs.statSync(snapshotPath).mtimeMs;

    // When
    const result = shell.exec('yarn test -i mock.test.js --update-snapshot');

    // Then
    expect(maskTime(result.stderr)).toMatchSnapshot();
    expect(fs.existsSync('__pdf_snapshots__/mock-test-js-snapshot-is-absent-1.pdf'))
      .toBeTruthy();

    const newModifiedTime = fs.statSync(snapshotPath).mtimeMs;
    expect(newModifiedTime).toBeGreaterThan(originalModifiedTime);
  });

  it('works as expected in ci', () => {
    // When
    const result = shell.exec('yarn test -i mock.test.js --ci');

    // Then
    expect(maskTime(result.stderr)).toMatchSnapshot();
  });

  it('works as expected for error cases', () => {
    // When
    const result = shell.exec('yarn test -i error.test.js');

    // Then
    expect(maskTime(result.stderr)).toMatchSnapshot();
  });
});
