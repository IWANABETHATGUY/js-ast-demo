/**@type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
  },
  create: function (context) {
    let sourceCode = context.getSourceCode();
    return {
      CallExpression(node) {
        if (node.callee.type === 'MemberExpression') {
          const callee = node.callee;
          const object = callee.object;
          const property = callee.property;

          if (
            object.type === 'Identifier' &&
            property.type === 'Identifier' &&
            object.name === 'console' &&
            ['log', 'info', 'warn', 'error'].includes(property.name)
          ) {
            context.report({
              loc: node.loc,
              message: `'console' is disabled`,
              node: node,
              *fix(fixer) {
                let nextToken = sourceCode.getTokenAfter(node);
                yield fixer.removeRange(node.range);
                while (nextToken && nextToken.value === ';') {
                  yield fixer.remove(nextToken)
                  nextToken = sourceCode.getTokenAfter(nextToken);
                }
              },
            });
          }
        }
      },
    };
  },
};
module.exports = rule;

