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
    const result = shell.exec('yarn test');

    expect(result.code).toBe(1);
    expect(fs.existsSync('__pdf_snapshots__/mock-test-js-snapshot-is-absent-1.pdf'))
      .toBeTruthy();
    expect(fs.existsSync('__pdf_snapshots__/__diff_output__/mock-test-js-snapshot-is-different-1-diff.pdf'))
      .toBeTruthy();
  });

  it('works as expected when updating snapshot', () => {
    const snapshotPath = '__pdf_snapshots__/mock-test-js-snapshot-is-different-1.pdf';
    const originalModifiedTime = fs.statSync(snapshotPath).mtimeMs;


    const result = shell.exec('yarn test --update-snapshot');


    expect(result.code).toBe(0);
    expect(fs.existsSync('__pdf_snapshots__/mock-test-js-snapshot-is-absent-1.pdf'))
      .toBeTruthy();

    const newModifiedTime = fs.statSync(snapshotPath).mtimeMs;
    expect(newModifiedTime).toBeGreaterThan(originalModifiedTime);
  });

  it('works as expected in ci', () => {
    const result = shell.exec('yarn test --ci');

    expect(result.code).toBe(1);
  });
});
