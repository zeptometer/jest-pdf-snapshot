const { toMatchPdfSnapshot } = require('jest-pdf-snapshot');
const fs = require('fs');

expect.extend({ toMatchPdfSnapshot });

const pdfBuffer1 = fs.readFileSync('../resources/test1.pdf');
const pdfBuffer2 = fs.readFileSync('../resources/test2.pdf');

test('Snapshot matches', () => {
  expect(pdfBuffer1).toMatchPdfSnapshot();
});

test('Snapshot is absent', () => {
  expect(pdfBuffer1).toMatchPdfSnapshot();
});

test('Snapshot is different', () => {
  expect(pdfBuffer2).toMatchPdfSnapshot();
});
