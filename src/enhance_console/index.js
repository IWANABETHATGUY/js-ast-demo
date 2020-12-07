const traverse = require('@babel/traverse');
const parser = require('@babel/parser');
const generator = require('@babel/generator');
// import template from 'template'
const t = require('@babel/types');

/**
 *
 * @param {string} code
 * @return {string}
 */
exports.enhanceConsole = function (code) {
  // const file = `sget(foo.bar, a, 'b', 'c')`
  const ast = parser.parse(code);
  traverse.default(ast, {
    CallExpression(path) {
      const node = path.node;
      if (t.isMemberExpression(node.callee)) {
        let callee = node.callee;
        if (
          t.isIdentifier(callee.object, { name: 'console' }) &&
          t.isIdentifier(callee.property) &&
          ['log', 'info', 'warn', 'error'].includes(callee.property.name)
        ) {
          node.arguments.unshift(t.stringLiteral(`${node.loc.start.line}:${node.loc.start.column}`));
        }
      }
    },
  });
  return generator.default(ast).code;
};

// console.log(this.enhanceConsole(`
//   console.log('something')
// `))
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
