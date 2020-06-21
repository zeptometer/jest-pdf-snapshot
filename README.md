# jest-pdf-snapshot
*jest-pdf-snapshot* provides Jest matcher that performs pdf comparisons. It uses [diff-pdf](https://vslavik.github.io/diff-pdf/) for pdf comparison/diff.

```javascript
const { toMatchPdfSnapshot } = require('jest-pdf-snapshot');

expect.extend({ toMatchPdfSnapshot });

test('Snapshot matches', () => {
  expect('../resources/test1.pdf').toMatchPdfSnapshot();
});
```

Would give you following files:

```
├── resources/test1.pdf
└── __tests__
    ├── pdf_snapshots
    │   ├── __diff_output__
    |   |   └── pdf-snapshot-test-js-snapshot-is-different-1-diff.pdf 
    |   |        (in case snapshot doesn't match) 
    │   └── pdf-snapshot-test-js-snapshot-matches-1.pdf
    └── pdf-snapshot.test.js
```

If you want to play with working example, see our mock project in `__tests__/mock_project`, which we use for integration tests.

## Installation
⚠️ Jest-pdf-snapshot depends on [vslavik/diff-pdf](https://github.com/vslavik/diff-pdf). Please read [diff-pdf's README.md](https://github.com/vslavik/diff-pdf/blob/master/README.md#obtaining-the-binaries) to install it to your test environment.

After you've set up diff-pdf, you can install jest-pdf-snapshot just with:

```shell
npm install --save-dev jest-pdf-snapshot
```
