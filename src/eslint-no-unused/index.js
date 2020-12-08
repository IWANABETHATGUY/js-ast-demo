/**@type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
  },
  create: function (context) {
    context.getScope();
    debugger;
    // declare the state of the rule
    // context.report({
    //   loc: token.loc,
    //   message: `unused code \`${token.name}\``,
    //   data: {
    //     identifier: token.name,
    //   },
    //   suggest: [
    //     {
    //       desc: 'Remove the unused code',
    //       *fix(fixer) {
    //         yield fixer.remove(node);
    //         let nextToken = sourceCode.getTokenAfter(node);
    //         while (nextToken && nextToken.value === ',') {
    //           yield fixer.remove(nextToken);
    //           nextToken = sourceCode.getTokenAfter(nextToken);
    //         }
    //       },
    //     },
    //   ],
    // });
    return {
      VariableDeclaration(node) {},
    };
  },
};
// module.exports = rule;

const EsLinter = require('eslint').ESLint;

const linter = new EsLinter({ baseConfig: { parserOptions: { ecmaVersion: 2015, sourceType: 'module' } } , });
