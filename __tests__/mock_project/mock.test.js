const { toMatchPdfSnapshot } = require('jest-pdf-snapshot');

expect.extend({ toMatchPdfSnapshot });

test('Snapshot matches', () => {
  expect('../resources/test1.pdf').toMatchPdfSnapshot();
});

test('Snapshot is absent', () => {
  expect('../resources/test1.pdf').toMatchPdfSnapshot();
});

test('Snapshot is different', () => {
  expect('../resources/test2.pdf').toMatchPdfSnapshot();
});
