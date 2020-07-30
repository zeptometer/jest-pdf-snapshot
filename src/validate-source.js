function validateSourcePath(sourcePath) {
  if (typeof sourcePath !== 'string') {
    return {
      isValid: false,
      invalidReason: 'NotString',
    };
  }

  return 0;
}

module.exports = {
  validateSourcePath,
};
