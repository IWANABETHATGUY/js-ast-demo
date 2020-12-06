const traverse = require('@babel/traverse');
const parser = require('@babel/parser');
const generator = require('@babel/generator');
const template = require('@babel/template').default;
// import template from 'template'
const t = require('@babel/types');

/**
 *
 * @param {string} code
 * @return {string}
 */
exports.transformSget = function (code) {
  // const file = `sget(foo.bar, a, 'b', 'c')`
  const ast = parser.parse(code);
  traverse.default(ast, {
    CallExpression(path) {
      const node = path.node;
      if (t.isIdentifier(node.callee, { name: 'sget' })) {
        if (node.arguments.length >= 1) {
          const firstArgString = generator.default(node.arguments[0]).code;
          const transformedAst = transformTargetObject(
            node.arguments[0],
            []
          )(node.arguments.length > 1 ? transformPath(firstArgString, node.arguments.slice(1)) : firstArgString);
          path.replaceWith(transformedAst);
        }
      }
    },
  });
  return generator.default(ast).code;
};

function transformPath(objectString, argList) {
  if (argList.length) {
    objectString = objectString + `[${generator.default(argList[0]).code}]`;
    const condExpressionString = `${objectString} === undefined ? void 0 : ${transformPath(
      objectString,
      argList.slice(1)
    )}`;
    return condExpressionString;
  } else {
    return objectString;
  }
}
/**
 *
 * @param {t.Node} node
 */
function transformTargetObject(node, path) {
  return function (result) {
    if (t.isMemberExpression(node)) {
      const newPath = [...path, generator.default(node.object).code];
      return template(`
            ${newPath.join('.')} === undefined ? void 0 : ${
        generator.default(transformTargetObject(node.property, newPath)(result)).code
      }
        `)();
    } else {
      return template(`
            ${[...path, generator.default(node).code].join('.')} === undefined ? void 0 : ${result}
        `)();
    }
  };
}
// console.log(res);
// let foo = {
//     bar: {
//         a: {
//             b: {
//             }
//         }
//     }
// }
// const res = foo === undefined ? void 0 : foo.bar === undefined ? void 0 : foo.bar['a'] === undefined ? void 0 : foo.bar['a']['b'] === undefined ? void 0 : foo.bar['a']['b']['c'] === undefined ? void 0 : foo.bar['a']['b']['c'];
// console.log(res);
// const code = `
// let foo = {bar: {something: '222'}}
// foo === undefined ? void 0 : foo.bar === undefined ? void 0 : foo.bar;
// `;
