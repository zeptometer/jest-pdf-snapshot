/* eslint-disable global-require */

describe('toMatchPdfSnapshot', () => {
  const mockDiffPdfToSnapshot = jest.fn();
  jest.mock('../src/diff-snapshot', () => ({
    diffPdfToSnapshot: mockDiffPdfToSnapshot,
  }));

  it('should throw an error if used with .not matcher', () => {
    const { toMatchPdfSnapshot } = require('../src/index');
    expect.extend({ toMatchPdfSnapshot });

    expect(() => expect('path to pdf file').not.toMatchPdfSnapshot())
      .toThrowErrorMatchingSnapshot();
  });

  it('should pass when the actual is same as the snapshot', () => {
    mockDiffPdfToSnapshot.mockReturnValue({
      pass: true,
      diffOutputPath: 'path/to/result.png',
    });

    const { toMatchPdfSnapshot } = require('../src/index');
    expect.extend({ toMatchPdfSnapshot });

    expect(() => expect('pretendthisisanimagebuffer').toMatchPdfSnapshot())
      .not.toThrow();
  });

  it('should fail when the acutual has a difference from the snapshot', () => {
    mockDiffPdfToSnapshot.mockReturnValue({
      pass: false,
      diffOutputPath: 'path/to/result.png',
    });

    const { toMatchPdfSnapshot } = require('../src/index');
    expect.extend({ toMatchPdfSnapshot });

    expect(() => expect('pretendthisisanimagebuffer').toMatchPdfSnapshot())
      .toThrowErrorMatchingSnapshot();
  });
});
