/* eslint-disable global-require */

describe('diffPdfToSnapshot', () => {
  const mockFs = {
    copyFileSync: jest.fn(),
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
  };
  jest.mock('fs', () => mockFs);

  const mockDiffChecker = jest.fn();
  const mockDiffGenerator = jest.fn();
  const mockedDependency = {
    diffChecker: mockDiffChecker,
    diffGenerator: mockDiffGenerator,
  };

  beforeEach(() => {
    mockFs.copyFileSync.mockReset();
    mockFs.existsSync.mockReset();
    mockFs.mkdirSync.mockReset();
    mockDiffChecker.mockReset();
    mockDiffGenerator.mockReset();
  });

  it('should fail when pdfPath is not present', () => {
    const { diffPdfToSnapshot } = require('../src/diff-snapshot');

    mockFs.existsSync.mockReturnValue(false);


    const result = diffPdfToSnapshot({
      pdfPath: 'path/to/pdf',
      snapshotDir: 'snapshotDir',
      snapshotIdentifier: 'snapshotIdentifier',
      updateSnapshot: undefined,
      addSnapshot: undefined,
    });


    expect(result.pass).toBe(false);
    expect(result.failureType).toBe('SourcePdfNotPresent');
    expect(mockFs.existsSync).toHaveBeenCalledWith('path/to/pdf');
  });

  it('should copy pdf to snapshot when addSnapshot is true and snapshot does not exist', () => {
    const { diffPdfToSnapshot } = require('../src/diff-snapshot');

    mockFs.existsSync.mockReturnValueOnce(true).mockReturnValueOnce(false);

    const result = diffPdfToSnapshot({
      pdfPath: 'path/to/pdf',
      snapshotDir: 'snapshotDir',
      snapshotIdentifier: 'snapshotIdentifier',
      updateSnapshot: undefined,
      addSnapshot: true,
    });

    expect(result.pass).toBe(true);
    expect(result.added).toBe(true);
    expect(mockFs.existsSync).toHaveBeenCalledWith('snapshotDir/snapshotIdentifier.pdf');
    expect(mockFs.copyFileSync).toHaveBeenCalledWith('path/to/pdf', 'snapshotDir/snapshotIdentifier.pdf');
  });

  it('should fail when addSnapthot is false and snapshot does not exist', () => {
    const { diffPdfToSnapshot } = require('../src/diff-snapshot');

    mockFs.existsSync.mockReturnValueOnce(true).mockReturnValueOnce(false);

    const result = diffPdfToSnapshot({
      pdfPath: 'path/to/pdf',
      snapshotDir: 'snapshotDir',
      snapshotIdentifier: 'snapshotIdentifier',
      updateSnapshot: undefined,
      addSnapshot: false,
    });

    expect(result.pass).toBe(false);
    expect(mockFs.existsSync).toHaveBeenCalledWith('snapshotDir/snapshotIdentifier.pdf');
    expect(mockFs.copyFileSync).not.toHaveBeenCalled();
  });

  it('should pass when given pdf is identical to snapshot', () => {
    const { diffPdfToSnapshot } = require('../src/diff-snapshot');

    mockFs.existsSync.mockReturnValue(true);
    mockDiffChecker.mockReturnValue(true);


    const result = diffPdfToSnapshot({
      pdfPath: 'path/to/pdf',
      snapshotDir: 'snapshotDir',
      snapshotIdentifier: 'snapshotIdentifier',
      updateSnapshot: undefined,
      addSnapshot: false,
    }, mockedDependency);


    expect(result.pass).toBe(true);
    expect(result.updated).toBe(false);
    expect(result.added).toBe(false);
  });

  it('should create diff output path when not present', () => {
    const { diffPdfToSnapshot } = require('../src/diff-snapshot');

    mockFs.existsSync
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);
    mockDiffChecker.mockReturnValue(false);


    diffPdfToSnapshot({
      pdfPath: 'path/to/pdf',
      snapshotDir: 'snapshotDir',
      snapshotIdentifier: 'snapshotIdentifier',
      updateSnapshot: undefined,
      addSnapshot: false,
    }, mockedDependency);


    expect(mockFs.mkdirSync).toHaveBeenCalledWith('snapshotDir/__diff_output__');
  });

  it('should give path to diff file when files are different', () => {
    const { diffPdfToSnapshot } = require('../src/diff-snapshot');

    mockFs.existsSync.mockReturnValue(true);
    mockDiffChecker.mockReturnValue(false);


    const result = diffPdfToSnapshot({
      pdfPath: 'path/to/pdf',
      snapshotDir: 'snapshotDir',
      snapshotIdentifier: 'snapshotIdentifier',
      updateSnapshot: undefined,
      addSnapshot: false,
    }, mockedDependency);


    expect(result.pass).toBe(false);
    expect(result.failureType).toBe('MismatchSnapshot');
    expect(result.diffOutputPath).toBe('snapshotDir/__diff_output__/snapshotIdentifier-diff.pdf');
    expect(mockDiffGenerator).toHaveBeenCalledWith(
      'path/to/pdf',
      'snapshotDir/snapshotIdentifier.pdf',
      'snapshotDir/__diff_output__/snapshotIdentifier-diff.pdf',
    );
  });

  it('should override snapshot if updateSnapshot is true', () => {
    const { diffPdfToSnapshot } = require('../src/diff-snapshot');

    mockFs.existsSync.mockReturnValue(true);
    mockDiffChecker.mockReturnValue(false);


    const result = diffPdfToSnapshot({
      pdfPath: 'path/to/pdf',
      snapshotDir: 'snapshotDir',
      snapshotIdentifier: 'snapshotIdentifier',
      updateSnapshot: true,
      addSnapshot: false,
    }, mockedDependency);


    expect(result.pass).toBe(true);
    expect(result.updated).toBe(true);
    expect(mockFs.copyFileSync).toHaveBeenCalledWith('path/to/pdf', 'snapshotDir/snapshotIdentifier.pdf');
    expect(mockDiffGenerator).not.toHaveBeenCalled();
  });
});
