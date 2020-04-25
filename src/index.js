function toMatchPdfSnapshot(received) {
  // eslint-disable-next-line no-console
  console.log(received);

  throw new Error('Jest: `.not` cannot be used with `.toMatchPdfSnapshot()`.');
}

module.exports = {
  toMatchPdfSnapshot,
};
