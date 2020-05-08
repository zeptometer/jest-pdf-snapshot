/* eslint-disable global-require */

describe('diffPdfToSnapshot', () => {
  const mockCopyFileSync = jest.fn();
  const mockExistsSync = jest.fn();
  jest.mock('fs', () => ({
    copyFileSync: mockCopyFileSync,
    existsSync: mockExistsSync,
  }));

  beforeEach(() => {
    mockCopyFileSync.mockReset();
    mockExistsSync.mockReset();
  });

  it('should fail when pdfPath is not present', () => {
    const { diffPdfToSnapshot } = require('../src/diff-snapshot');

    mockExistsSync.mockReturnValue(false);


    const result = diffPdfToSnapshot({
      pdfPath: 'path/to/pdf',
      snapshotDir: 'snapshotDir',
      snapshotIdentifier: 'snapshotIdentifier',
      updateSnapshot: undefined,
      addSnapshot: undefined,
    });


    expect(result.pass).toBe(false);
    expect(result.failureType).toBe('SourcePdfNotPresent');
    expect(mockExistsSync).toHaveBeenCalledWith('path/to/pdf');
  });

  it('should copy pdf to snapshot when addSnapshot is true and snapshot does not exist', () => {
    const { diffPdfToSnapshot } = require('../src/diff-snapshot');

    mockExistsSync.mockReturnValueOnce(true).mockReturnValueOnce(false);

    const result = diffPdfToSnapshot({
      pdfPath: 'path/to/pdf',
      snapshotDir: 'snapshotDir',
      snapshotIdentifier: 'snapshotIdentifier',
      updateSnapshot: undefined,
      addSnapshot: true,
    });

    expect(result.pass).toBe(true);
    expect(result.added).toBe(true);
    expect(mockExistsSync).toHaveBeenCalledWith('snapshotDir/snapshotIdentifier.pdf');
    expect(mockCopyFileSync).toHaveBeenCalledWith('path/to/pdf', 'snapshotDir/snapshotIdentifier.pdf');
  });

  it('should fail when addSnapthot is false and snapshot does not exist', () => {
    const { diffPdfToSnapshot } = require('../src/diff-snapshot');

    mockExistsSync.mockReturnValueOnce(true).mockReturnValueOnce(false);

    const result = diffPdfToSnapshot({
      pdfPath: 'path/to/pdf',
      snapshotDir: 'snapshotDir',
      snapshotIdentifier: 'snapshotIdentifier',
      updateSnapshot: undefined,
      addSnapshot: false,
    });

    expect(result.pass).toBe(false);
    expect(result.added).toBe(false);
    expect(mockExistsSync).toHaveBeenCalledWith('snapshotDir/snapshotIdentifier.pdf');
    expect(mockCopyFileSync).not.toHaveBeenCalled();
  });

  it('should create snapshot directory when it is not present', () => {
    expect(true).toBe(true); // FIXME
  });
});
