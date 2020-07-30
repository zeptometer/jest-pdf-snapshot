const mockFs = {
  existsSync: jest.fn(),
};
jest.mock('fs', () => mockFs);

const { validateSourcePath } = require('../src/validate-source');

describe('validate-source', () => {
  it('regards non-string input as invalid', () => {
    // when
    const actual = validateSourcePath(3);

    // then
    expect(actual).toHaveProperty('isValid', false);
    expect(actual).toHaveProperty('invalidReason', 'NotString');
  });

  it('regards non-existent input as invalid', () => {
    // given
    mockFs.existsSync.mockReturnValue(false);

    // when
    const actual = validateSourcePath('path/to/pdf');

    // then
    expect(actual).toHaveProperty('isValid', false);
    expect(actual).toHaveProperty('invalidReason', 'SourceNotPresent');
  });
});
