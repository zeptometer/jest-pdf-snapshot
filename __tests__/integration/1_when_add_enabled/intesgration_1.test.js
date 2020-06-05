const { toMatchPdfSnapshot } = require('jest-pdf-snapshot');

expect.extend({ toMatchPdfSnapshot });

test('Adds pdf to snapshot', () => {
  expect('../resources/test1.pdf').toMatchPdfSnapshot();
});
