/* eslint-disable global-require */

describe('diffPdfToSnapshot', () => {
  const mockExistsSync = jest.fn();
  jest.mock('fs', () => ({
    existsSync: mockExistsSync,
  }));

  beforeEach(() => {
    mockExistsSync.mockReset();
  });

  it('should faile when pdfPath is not present', () => {
    const { diffPdfToSnapshot } = require('../src/diff-snapshot');

    mockExistsSync.mockReturnValue(false);


    const result = diffPdfToSnapshot({
      pdfPath: 'path/to/pdf',
      snapshotDir: 'snapshotDir',
      snapshotIdentifier: 'snapshotIdentifier',
      updateSnapshot: undefined,
      addSnapshot: true,
    });


    expect(result.pass).toBe(false);
    expect(result.failureType).toBe('SourcePdfNotPresent');
    expect(mockExistsSync).toHaveBeenCalledWith('path/to/pdf');
  });

  // it('should pass when addSnapshot is true and snapshot does not exist', () => {
  //   const { diffPdfToSnapshot } = require('../src/diff-snapshot');

  //   mockExistsSync.mockReturnValue(false);

  //   const result = diffPdfToSnapshot({
  //     pdfPath: 'path/to/pdf',
  //     snapshotDir: 'snapshotDir',
  //     snapshotIdentifier: 'snapshotIdentifier',
  //     updateSnapshot: undefined,
  //     addSnapshot: true,
  //   });

  //   expect(result.pass).toBe(true);
  //   expect(mockExistsSync).toHaveBeenCalledWith('snapshotDir/snapshotIdetifier.pdf');
  // });
});
