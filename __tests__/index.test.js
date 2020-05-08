/* eslint-disable global-require */

describe('toMatchPdfSnapshot', () => {
  const mockDiffPdfToSnapshot = jest.fn();
  jest.mock('../src/diff-snapshot', () => ({
    diffPdfToSnapshot: mockDiffPdfToSnapshot,
  }));

  const mockFs = {
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
  };
  jest.mock('fs', () => mockFs);

  let mockTestContext;

  beforeEach(() => {
    mockDiffPdfToSnapshot.mockReset();
    mockFs.existsSync.mockReset();
    mockFs.existsSync.mockReturnValue(true);
    mockFs.mkdirSync.mockReset();

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


    expect(() => matcherAtTest('path/to/pdf'))
      .toThrowErrorMatchingSnapshot();
  });

  it('should thrown an error when given pdf path is not present', () => {
    mockDiffPdfToSnapshot.mockReturnValue({
      pass: false,
      failureType: 'SourcePdfNotPresent',
    });

    const { toMatchPdfSnapshot } = require('../src/index');
    const matcherAtTest = toMatchPdfSnapshot.bind(mockTestContext);


    expect(() => matcherAtTest('path/to/pdf'))
      .toThrowErrorMatchingSnapshot();
  });

  it('should create snapshot directory if not present', () => {
    mockDiffPdfToSnapshot.mockReturnValue({
      pass: true,
      updated: false,
      added: true,
    });
    mockFs.existsSync.mockReturnValue(false);

    const { toMatchPdfSnapshot } = require('../src/index');
    const matcherAtTest = toMatchPdfSnapshot.bind(mockTestContext);


    matcherAtTest('path/to/pdf');


    expect(mockFs.existsSync).toHaveBeenCalledWith('path/to/__pdf_snapshots__');
    expect(mockFs.mkdirSync).toHaveBeenCalledWith('path/to/__pdf_snapshots__');
  });

  it('should pass when the actual is same as the snapshot', () => {
    mockDiffPdfToSnapshot.mockReturnValue({
      pass: true,
      updated: false,
      added: false,
    });

    const { toMatchPdfSnapshot } = require('../src/index');
    const matcherAtTest = toMatchPdfSnapshot.bind(mockTestContext);


    const result = matcherAtTest('path/to/pdf');


    expect(result).toHaveProperty('pass', true);
    expect(mockTestContext.snapshotState).toHaveProperty('matched', 1);
    expect(mockDiffPdfToSnapshot).toHaveBeenCalledWith({
      pdfPath: 'path/to/pdf',
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


    const result = matcherAtTest('path/to/pdf');


    expect(result).toHaveProperty('pass', false);
    expect(result.message()).toMatchSnapshot();
    expect(mockTestContext.snapshotState).toHaveProperty('unmatched', 1);
    expect(mockDiffPdfToSnapshot).toHaveBeenCalledWith({
      pdfPath: 'path/to/pdf',
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


    const result = matcherAtTest('path/to/pdf');


    expect(result).toHaveProperty('pass', true);
    expect(mockTestContext.snapshotState).toHaveProperty('updated', 1);
    expect(mockDiffPdfToSnapshot).toHaveBeenCalledWith({
      pdfPath: 'path/to/pdf',
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


    const result = matcherAtTest('path/to/pdf');


    expect(result).toHaveProperty('pass', true);
    expect(mockTestContext.snapshotState).toHaveProperty('added', 1);
    expect(mockDiffPdfToSnapshot).toHaveBeenCalledWith({
      pdfPath: 'path/to/pdf',
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


    const result = matcherAtTest('path/to/pdf');


    expect(result).toHaveProperty('pass', false);
    expect(result.message()).toMatchSnapshot();
    expect(mockDiffPdfToSnapshot).toHaveBeenCalledWith({
      pdfPath: 'path/to/pdf',
      snapshotDir: 'path/to/__pdf_snapshots__',
      snapshotIdentifier: 'test-spec-js-test-1-undefined',
      updateSnapshot: false,
      addSnapshot: false,
    });
  });
});
