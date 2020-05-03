/* eslint-disable global-require */

describe('toMatchPdfSnapshot', () => {
  const mockDiffPdfToSnapshot = jest.fn();
  jest.mock('../src/diff-snapshot', () => ({
    diffPdfToSnapshot: mockDiffPdfToSnapshot,
  }));

  let mockTestContext;

  beforeEach(() => {
    mockDiffPdfToSnapshot.mockReset();
    mockTestContext = {
      testPath: 'path/to/test.spec.js',
      currentTestName: 'test1',
      isNot: false,
      snapshotState: {
        _counters: new Map(),
        _updateSnapshot: 'new',
        matched: 0,
        unmatched: 0,
        updated: 0,
        added: 0,
      },
    };
  });

  it('should throw an error if used with .not matcher', () => {
    mockTestContext.isNot = true;

    const { toMatchPdfSnapshot } = require('../src/index');
    const matcherAtTest = toMatchPdfSnapshot.bind(mockTestContext);


    expect(() => matcherAtTest('pretendthisisanimagebuffer'))
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
    const matcherAtTest = toMatchPdfSnapshot.bind(mockTestContext);


    const result = matcherAtTest('pretendthisisanimagebuffer');


    expect(result).toHaveProperty('pass', true);
    expect(mockTestContext.snapshotState).toHaveProperty('matched', 1);
    expect(mockDiffPdfToSnapshot).toHaveBeenCalledWith({
      snapshotDir: 'path/to/__pdf_snapshots__',
      snapshotIdentifier: 'test-spec-js-test-1-undefined',
      updateSnapshot: false,
      addSnapshot: true,
    });
  });

  it('should fail when the acutual has a difference from the snapshot', () => {
    mockDiffPdfToSnapshot.mockReturnValue({
      pass: false,
      failureType: 'MismatchSnapshot',
      updated: false,
      added: false,
      diffOutputPath: 'path/to/result.png',
    });

    const { toMatchPdfSnapshot } = require('../src/index');
    const matcherAtTest = toMatchPdfSnapshot.bind(mockTestContext);


    const result = matcherAtTest('pretendthisisanimagebuffer');


    expect(result).toHaveProperty('pass', false);
    expect(result.message()).toMatchSnapshot();
    expect(mockTestContext.snapshotState).toHaveProperty('unmatched', 1);
    expect(mockDiffPdfToSnapshot).toHaveBeenCalledWith({
      snapshotDir: 'path/to/__pdf_snapshots__',
      snapshotIdentifier: 'test-spec-js-test-1-undefined',
      updateSnapshot: false,
      addSnapshot: true,
    });
  });

  it('attempts to update snapshots if snapshotState has updateSnapshot flag set', () => {
    // eslint-disable-next-line no-underscore-dangle
    mockTestContext.snapshotState._updateSnapshot = 'all';

    mockDiffPdfToSnapshot.mockReturnValue({
      pass: true,
      updated: true,
      added: false,
      diffOutputPath: 'path/to/result.png',
    });

    const { toMatchPdfSnapshot } = require('../src/index');
    const matcherAtTest = toMatchPdfSnapshot.bind(mockTestContext);


    const result = matcherAtTest('pretendthisisanimagebuffer');


    expect(result).toHaveProperty('pass', true);
    expect(mockTestContext.snapshotState).toHaveProperty('updated', 1);
    expect(mockDiffPdfToSnapshot).toHaveBeenCalledWith({
      snapshotDir: 'path/to/__pdf_snapshots__',
      snapshotIdentifier: 'test-spec-js-test-1-undefined',
      updateSnapshot: true,
      addSnapshot: true,
    });
  });

  it('should work when a new snapshot is added', () => {
    mockDiffPdfToSnapshot.mockReturnValue({
      pass: true,
      updated: false,
      added: true,
      diffOutputPath: 'path/to/result.png',
    });

    const { toMatchPdfSnapshot } = require('../src/index');
    const matcherAtTest = toMatchPdfSnapshot.bind(mockTestContext);


    const result = matcherAtTest('pretendthisisanimagebuffer');


    expect(result).toHaveProperty('pass', true);
    expect(mockTestContext.snapshotState).toHaveProperty('added', 1);
    expect(mockDiffPdfToSnapshot).toHaveBeenCalledWith({
      snapshotDir: 'path/to/__pdf_snapshots__',
      snapshotIdentifier: 'test-spec-js-test-1-undefined',
      updateSnapshot: false,
      addSnapshot: true,
    });
  });

  it('should fail when a new snapshot is added in ci', () => {
    // eslint-disable-next-line no-underscore-dangle
    mockTestContext.snapshotState._updateSnapshot = 'none';

    mockDiffPdfToSnapshot.mockReturnValue({
      pass: false,
      failureType: 'EmptySnapshot',
      updated: false,
      added: false,
      diffOutputPath: 'path/to/result.png',
    });

    const { toMatchPdfSnapshot } = require('../src/index');
    const matcherAtTest = toMatchPdfSnapshot.bind(mockTestContext);


    const result = matcherAtTest('pretendthisisanimagebuffer');


    expect(result).toHaveProperty('pass', false);
    expect(result.message()).toMatchSnapshot();
    expect(mockDiffPdfToSnapshot).toHaveBeenCalledWith({
      snapshotDir: 'path/to/__pdf_snapshots__',
      snapshotIdentifier: 'test-spec-js-test-1-undefined',
      updateSnapshot: false,
      addSnapshot: false,
    });
  });
});
