const { toMatchPdfSnapshot } = require('jest-pdf-snapshot');

expect.extend({ toMatchPdfSnapshot });

test('Not pdf buffer', () => {
  expect('I am a string!').toMatchPdfSnapshot();
});
