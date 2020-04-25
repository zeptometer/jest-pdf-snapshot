/* eslint-disable global-require */

describe('toMatchPdfSnapshot', () => {
  it('should throw an error if used with .not matcher', () => {
    const { toMatchPdfSnapshot } = require('../src/index');
    expect.extend({ toMatchPdfSnapshot });

    expect(() => expect('path to pdf file').not.toMatchPdfSnapshot())
      .toThrowErrorMatchingSnapshot();
  });
});
