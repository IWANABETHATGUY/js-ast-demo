/**@type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
  },
  create: function (context) {
    let sourceCode = context.getSourceCode();
    let allVariableSet = new Set();
    const scopeManager = sourceCode.scopeManager;
    const scopes = scopeManager.scopes;
    for (let i = scopes.length - 1; i > 0; i--) {
      scopes[i].variables.forEach(variable => {
        // allVariableSet.
        variable.identifiers.forEach(id => {
          allVariableSet.add(id);
        });
      });
    }
    return {
      Identifier(node) {
        if (node.parent.type === 'VariableDeclarator' || node.parent.type === 'MemberExpression' || node.parent.type === 'FunctionDeclaration') {
          return;
        }
        const name = node.name;
        let scope = context.getScope();
        while (scope && scope.type !== 'global') {
          if (scope.set.has(name)) {
            const value = scope.set.get(name);
            const id = value.identifiers[0];
            if (allVariableSet.has(id)) {
              allVariableSet.delete(id);
              break;
            }
          }
          scope = scope.upper;
        }
      },
      'Program:exit'() {
        allVariableSet.forEach(node => {
          context.report({
            loc: node.loc,
            message: `disallow unused var `,
            node: node,
          });
        });
      },
      
    };
  },
};
module.exports = rule;
