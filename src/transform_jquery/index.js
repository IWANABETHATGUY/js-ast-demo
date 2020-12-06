const traverse = require('@babel/traverse').default;
const parser = require('@babel/parser');
const generator = require('@babel/generator');
const template = require('@babel/template').default;
// import template from 'template'
const t = require('@babel/types');

/**
 *
 * @param {string} file
 * @return {string}
 */
exports.transformJquery = function (file) {

  const ast = parser.parse(file);
  traverse(ast, {
    CallExpression(path) {
      if (t.isIdentifier(path.node.callee, { name: '$' })) {
        const grandParent = path.parentPath.parentPath.node;
        if (
          t.isCallExpression(grandParent) &&
          t.isMemberExpression(path.parentPath.node) &&
          t.isIdentifier(path.parentPath.node.property, { name: 'hide' })
        ) {
          const styleTemplate = template(`ELEMENT.style.display = 'none'`);
          path.parentPath.parentPath.replaceWith(
            styleTemplate({ ELEMENT: path.node.arguments[0] })
          );
        }
      }
    },
  });
  return generator.default(ast).code;
};
