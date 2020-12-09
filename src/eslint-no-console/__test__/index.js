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
      code: stripIndent(`
    let a = 4;
    function test() {
      console.log('something');
    }
    console.test('this is custom function')
    console.info('something')
    `),
      errors: [
        {
          message: `'console' is disabled`,
          column: 3,
          line: 4,
        },
        {
          message: `'console' is disabled`
        }
      ],
      output: stripIndent(
        `
      let a = 4;
      function test() {
        
      }
      console.test('this is custom function')

      `
      ),
    },
  ],
});
