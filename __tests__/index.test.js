/* eslint-disable global-require */

describe('toMatchPdfSnapshot', () => {
  const mockDiffPdfToSnapshot = jest.fn();
  jest.mock('../src/diff-snapshot', () => ({
    diffPdfToSnapshot: mockDiffPdfToSnapshot,
  }));

  const mockFs = ({
    existsSync: jest.fn(),
  });
  jest.mock('fs', () => mockFs);

  beforeEach(() => {
    mockDiffPdfToSnapshot.mockReset();
    mockFs.existsSync.mockReset();
  });

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
      updated: false,
      added: false,
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
      updated: false,
      added: false,
    });

    const { toMatchPdfSnapshot } = require('../src/index');
    expect.extend({ toMatchPdfSnapshot });

    expect(() => expect('pretendthisisanimagebuffer').toMatchPdfSnapshot())
      .toThrowErrorMatchingSnapshot();
  });

  it('attempts to update snapshots if snapshotState has updateSnapshot flag set', () => {
    const mockTestContext = {
      testPath: 'path/to/test.spec.js',
      currentTestName: 'test1',
      isNot: false,
      snapshotState: {
        _counters: new Map(),
        _updateSnapshot: 'all',
        updated: 0,
        added: 0,
      },
    };

    mockDiffPdfToSnapshot.mockReturnValue({
      pass: true,
      diffOutputPath: 'path/to/result.png',
      updated: true,
      added: false,
    });

    const { toMatchPdfSnapshot } = require('../src/index');
    const matcherAtTest = toMatchPdfSnapshot.bind(mockTestContext);


    const result = matcherAtTest('pretendthisisanimagebuffer');


    expect(result).toHaveProperty('pass', true);
    expect(mockTestContext.snapshotState).toHaveProperty('updated', 1);
    expect(mockDiffPdfToSnapshot).toHaveBeenCalledWith({
      updateSnapshot: true,
    });
  });

  it('should work when a new snapshot is added', () => {
    const mockTestContext = {
      testPath: 'path/to/test.spec.js',
      currentTestName: 'test1',
      isNot: false,
      snapshotState: {
        _counters: new Map(),
        _updateSnapshot: 'new',
        updatred: 0,
        added: 0,
      },
    };

    mockDiffPdfToSnapshot.mockReturnValue({
      pass: true,
      diffOutputPath: 'path/to/result.png',
      updated: false,
      added: true,
    });

    const { toMatchPdfSnapshot } = require('../src/index');
    const matcherAtTest = toMatchPdfSnapshot.bind(mockTestContext);


    const result = matcherAtTest('pretendthisisanimagebuffer');


    expect(result).toHaveProperty('pass', true);
    expect(mockTestContext.snapshotState).toHaveProperty('added', 1);
    expect(mockDiffPdfToSnapshot).toHaveBeenCalledWith({
      updateSnapshot: false,
    });
  });
});
