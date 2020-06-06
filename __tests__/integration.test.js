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

    expect(maskTime(result.stderr)).toMatchSnapshot();
  });

  it('works as expected when updating snapshot', () => {
    const result = shell.exec('yarn test --update-snapshot');

    expect(maskTime(result.stderr)).toMatchSnapshot();
  });

  it('works as expected in ci', () => {
    const result = shell.exec('yarn test --ci');

    expect(maskTime(result.stderr)).toMatchSnapshot();
  });
});
