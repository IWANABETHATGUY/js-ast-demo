import { EditorState } from '@codemirror/next/state';
import { htmlSyntax, html } from '@codemirror/next/lang-html';
import { javascript } from '@codemirror/next/lang-javascript';
import { EditorView, basicSetup } from '@codemirror/next/basic-setup';
import { tagExtension } from '@codemirror/next/state';
import { linter } from '@codemirror/next/lint';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
const languageTag = Symbol('language');
const VariableType = {
  Any: 1 << 0,
  String: 1 << 1,
  Number: 1 << 2,
  Boolean: 1 << 3,
};
class ScopeStack {
  constructor() {
    this.scopeStack = [];
  }
  push(bindings) {
    this.scopeStack.push(bindings);
  }
  find(name) {
    for (let i = this.scopeStack.length - 1; i >= 0; i--) {
      let binding = this.scopeStack[i];
      if (binding[name]) {
        return binding[name];
      }
    }
    return undefined;
  }
  pop() {
    this.scopeStack.pop();
  }
}
const autoLanguage = EditorState.transactionFilter.of(tr => {
  if (!tr.docChanged) return tr;
  let docIsHTML = /^\s*</.test(tr.newDoc.sliceString(0, 100));
  let stateIsHTML = tr.startState.facet(EditorState.syntax)[0] == htmlSyntax;
  if (docIsHTML == stateIsHTML) return tr;
  return [
    tr,
    {
      reconfigure: { [languageTag]: docIsHTML ? html() : javascript() },
    },
  ];
});
const scopeStack = new ScopeStack();
// eslint-disable-next-line no-unused-vars
const editor = new EditorView({
  state: EditorState.create({
    doc: 'let a = 3;\na = 4;',
    extensions: [
      basicSetup,
      tagExtension(languageTag, javascript()),
      autoLanguage,
      linter(view => {
        const content = view.state.doc.toString();
        const diagnostics = [];
        const ast = parse(content, { errorRecovery: true });
        // parsing error
        ast.errors.forEach(error => {
          diagnostics.push({
            from: error.pos,
            to: error.pos,
            message: error.message,
            severity: 'error',
          });
        });
        // simple type checking
        traverse(ast, {
          Scope: {
            enter(path) {
              let scopeTypeMap = {};
              Object.values(path.scope.bindings).forEach(binding => {
                scopeTypeMap[binding.identifier.name] = {
                  kind: binding.kind,
                  type: getBindType(binding),
                };
                if (!binding.referenced) {
                  const identifier = binding.identifier;
                  diagnostics.push({
                    from: identifier.start,
                    to: identifier.end,
                    message: `the variable ${identifier.name} is defined but never used`,
                    severity: 'warning',
                  });
                }
              });
              scopeStack.push(scopeTypeMap);
              console.log(JSON.stringify(scopeStack));
            },
            exit() {
              scopeStack.pop();
            },
          },
          AssignmentExpression(path) {
            let node = path.node;
            let left = node.left;
            let right = node.right;
            console.assert(left.type === 'Identifier');
            let leftInfo = scopeStack.find(left.name);
            let rightType;
            if (right.type === 'Identifier') {
              rightType = scopeStack.find(right.name).type;
            } else {
              rightType = getNodeType(right);
            }
            if (
              !(leftInfo.type === VariableType.Any || rightType === VariableType.Any || leftInfo.type === rightType)
            ) {
              console.log('error happen', leftInfo.type, rightType);
              diagnostics.push({
                from: left.start,
                to: left.end,
                message: `${variableTypeToString(rightType)} can't assign to '${
                  left.name
                }', which type is ${variableTypeToString(leftInfo.type)}`,
                severity: 'error',
              });
            }
          },
        });
        diagnostics.sort((a, b) => a.from - b.from);
        return diagnostics;
      }),
    ],
  }),
  parent: document.querySelector('#app'),
});

function getBindType(binding) {
  if (binding.path.listKey === 'declarations') {
    if (!binding.path.node.init) {
      return VariableType.Any;
    }
    //TODO: init is a expression and so on
    return getNodeType(binding.path.node.init);
  } else {
    return VariableType.Any;
  }
}

function getNodeType(node) {
  switch (node.type) {
    case 'NumericLiteral':
      return VariableType.Number;
    case 'StringLiteral':
      return VariableType.String;
    case 'BooleanLiteral':
      return VariableType.Boolean;
    default:
      return VariableType.Any;
  }
}

function variableTypeToString(variableType) {
  switch (variableType) {
    case VariableType.Any:
      return 'any';
    case VariableType.Boolean:
      return 'boolean';
    case VariableType.Number:
      return 'number';
    case VariableType.String:
      return 'string';
  }
}
