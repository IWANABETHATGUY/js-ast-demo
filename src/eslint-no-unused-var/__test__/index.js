const rule = require('../index.js');
const EsLinter = require('eslint').RuleTester;
const stripIndent = require('strip-indent');
const linter = new EsLinter({
  parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
});

/**
 *
 *
 * @param {string} code
 * @returns string
 */
function stripIndentAndTrim(code) {
  return stripIndent(code).trim();
}

linter.run('no-unused-vars', rule, {
  valid: [
    {
      code: stripIndentAndTrim(`
      let a = 4;
      a
    `),
    },
  ],
  invalid: [
    {
      code: stripIndent(`
let a = 4;
function test() {
  a
}
function result() {
  let d = 4;
  let a = 4;
}
    `),
      errors: [
        {
          message: `disallow unused var `,
          column: 10,
          line: 3,
        },
        {
          message: `disallow unused var `,
          column: 10,
          line: 6,
        },
        {
          message: `disallow unused var `,
          column: 7,
          line: 7,
        },
        {
          message: `disallow unused var `,
          column: 7,
          line: 8,
        },
      ],
    },
  ],
});
