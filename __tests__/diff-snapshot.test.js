/**
 * @group unit
 */

const mockFs = {
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  openSync: jest.fn(),
  writeSync: jest.fn(),
};
jest.mock('fs', () => mockFs);

const mockShell = {
  exec: jest.fn(),
  config: {},
};
jest.mock('shelljs', () => mockShell);
const { diffPdfToSnapshot } = require('../src/diff-snapshot');

describe('diffPdfToSnapshot', () => {
  const mockIsSamePdf = jest.fn();
  const mockGenerateDiff = jest.fn();
  const mockedDependency = {
    isSamePdf: mockIsSamePdf,
    generateDiff: mockGenerateDiff,
  };

  beforeEach(() => {
    mockFs.existsSync.mockReset();
    mockFs.mkdirSync.mockReset();
    mockFs.openSync.mockReset();
    mockFs.writeSync.mockReset();
    mockShell.exec.mockReset();
    mockIsSamePdf.mockReset();
    mockGenerateDiff.mockReset();

    mockShell.exec.mockReturnValue({ code: 0 });
  });

  it('should fail when diff-pdf is not found', () => {
    // Given
    mockShell.exec.mockReturnValueOnce({ code: 127 });

    // When
    const result = diffPdfToSnapshot({
      pdfPath: 'path/to/pdf',
      snapshotDir: 'snapshotDir',
      snapshotIdentifier: 'snapshotIdentifier',
      updateSnapshot: false,
      addSnapshot: true,
    });

    // Then
    expect(result.pass).toBe(false);
    expect(result.failureType).toBe('DiffPdfNotFound');
  });

  it('should copy pdf to snapshot when addSnapshot is true and snapshot does not exist', () => {
    // Given
    const randomFd = 1121;
    mockFs.existsSync.mockReturnValue(false);
    mockFs.openSync.mockReturnValue(randomFd);

    // When
    const pdfBuffer = Buffer.from('This is pdf file buffer');

    const result = diffPdfToSnapshot({
      pdfBuffer,
      snapshotDir: 'snapshotDir',
      snapshotIdentifier: 'snapshotIdentifier',
      updateSnapshot: false,
      addSnapshot: true,
    });

    // Then
    expect(result.pass).toBe(true);
    expect(result.added).toBe(true);
    expect(mockFs.existsSync).toHaveBeenCalledWith('snapshotDir/snapshotIdentifier.pdf');
    expect(mockFs.openSync).toHaveBeenCalledWith('snapshotDir/snapshotIdentifier.pdf', 'w');
    expect(mockFs.writeSync).toHaveBeenCalledWith(randomFd, pdfBuffer);
  });

  it('should fail when addSnapthot is false and snapshot does not exist', () => {
    // Given
    mockFs.existsSync.mockReturnValueOnce(false);

    // When
    const result = diffPdfToSnapshot({
      pdfPath: 'path/to/pdf',
      snapshotDir: 'snapshotDir',
      snapshotIdentifier: 'snapshotIdentifier',
      updateSnapshot: false,
      addSnapshot: false,
    });

    // Then
    expect(result.pass).toBe(false);
    expect(mockFs.existsSync).toHaveBeenCalledWith('snapshotDir/snapshotIdentifier.pdf');
    expect(mockFs.openSync).not.toHaveBeenCalled();
  });

  // it('should pass when given pdf is identical to snapshot', () => {
  //   // Given
  //   mockFs.existsSync.mockReturnValue(true);
  //   mockIsSamePdf.mockReturnValue(true);

  //   // When
  //   const result = diffPdfToSnapshot({
  //     pdfPath: 'path/to/pdf',
  //     snapshotDir: 'snapshotDir',
  //     snapshotIdentifier: 'snapshotIdentifier',
  //     updateSnapshot: undefined,
  //     addSnapshot: false,
  //   }, mockedDependency);

  //   // Then
  //   expect(result.pass).toBe(true);
  //   expect(result.updated).toBe(false);
  //   expect(result.added).toBe(false);
  // });

  // it('should create diff output path when not present', () => {
  //   // Given
  //   mockFs.existsSync
  //     .mockReturnValueOnce(true)
  //     .mockReturnValueOnce(true)
  //     .mockReturnValueOnce(false);
  //   mockIsSamePdf.mockReturnValue(false);

  //   // When
  //   diffPdfToSnapshot({
  //     pdfPath: 'path/to/pdf',
  //     snapshotDir: 'snapshotDir',
  //     snapshotIdentifier: 'snapshotIdentifier',
  //     updateSnapshot: undefined,
  //     addSnapshot: false,
  //   }, mockedDependency);

  //   // Then
  //   expect(mockFs.mkdirSync).toHaveBeenCalledWith('snapshotDir/__diff_output__');
  // });

  // it('should give path to diff file when files are different', () => {
  //   // Given
  //   mockFs.existsSync.mockReturnValue(true);
  //   mockIsSamePdf.mockReturnValue(false);

  //   // When
  //   const result = diffPdfToSnapshot({
  //     pdfPath: 'path/to/pdf',
  //     snapshotDir: 'snapshotDir',
  //     snapshotIdentifier: 'snapshotIdentifier',
  //     updateSnapshot: undefined,
  //     addSnapshot: false,
  //   }, mockedDependency);

  //   // Then
  //   expect(result.pass).toBe(false);
  //   expect(result.failureType).toBe('MismatchSnapshot');
  //   expect(result.diffOutputPath).toBe('snapshotDir/__diff_output__/snapshotIdentifier-diff.pdf');
  //   expect(mockGenerateDiff).toHaveBeenCalledWith(
  //     'path/to/pdf',
  //     'snapshotDir/snapshotIdentifier.pdf',
  //     'snapshotDir/__diff_output__/snapshotIdentifier-diff.pdf',
  //   );
  // });

  // it('should override snapshot if updateSnapshot is true', () => {
  //   // Given
  //   mockFs.existsSync.mockReturnValue(true);
  //   mockIsSamePdf.mockReturnValue(false);

  //   // When
  //   const result = diffPdfToSnapshot({
  //     pdfPath: 'path/to/pdf',
  //     snapshotDir: 'snapshotDir',
  //     snapshotIdentifier: 'snapshotIdentifier',
  //     updateSnapshot: true,
  //     addSnapshot: false,
  //   }, mockedDependency);

  //   // Then
  //   expect(result.pass).toBe(true);
  //   expect(result.updated).toBe(true);
  //   expect(mockFs.copyFileSync).toHaveBeenCalledWith('path/to/pdf', 'snapshotDir/snapshotIdentifier.pdf');
  //   expect(mockGenerateDiff).not.toHaveBeenCalled();
  // });
});
