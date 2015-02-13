# doc-merge

A tool for merging together Polymer element docs.

## Example usage

See the `demo.js` file

```
var FIXTURES = path.join(__dirname, 'test/fixtures');
var OUTPUT = path.join(__dirname, 'test/tmp');

var generate = require('doc-merge');
generate(FIXTURES, OUTPUT, {config: 'test/fixtures/config.json' });
```
