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

linter.run('no-console', rule, {
  valid: [
    {
      code: stripIndentAndTrim(`
    let a = 4;
    `),
    },
  ],
  invalid: [
    {
      code: stripIndentAndTrim(`
    let a = 4;
    function test() {
      console.log('something');
    }
    `),
      errors: [
        {
          message: `'console.log' is disabled`,
        },
      ],
      output: stripIndentAndTrim(`
    let a = 4;
    function test() {
      
    }
    `),
    },
  ],
});
