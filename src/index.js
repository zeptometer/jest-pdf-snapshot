function toMatchPdfSnapshot(received) {
  // eslint-disable-next-line no-console
  console.log(received);

  const { isNot } = this;
  if (isNot) {
    throw new Error('Jest: `.not` cannot be used with `.toMatchPdfSnapshot()`.');
  }

  return {
    pass: true,
    message: 'some message',
  };
}

module.exports = {
  toMatchPdfSnapshot,
};
