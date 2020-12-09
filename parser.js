function dvAdditive(dv) {
  if (!('Additive' in dv)) {
    dv.Additive = ExprAdditive(dv);
  }
  return dv.Additive;
}

function ExprAdditive(dv) {
  try {
    const mul = dvMultitive(dv);
    if (dvChar(mul.dv).value == '+') {
      const add = dvAdditive(dvChar(mul.dv).dv);
      return {
        value: mul.value + add.value,
        dv: add.dv,
      };
    } else {
      throw {};
    }
  } catch (e) {
    return dvMultitive(dv);
  }
}

function dvMultitive(dv) {
  if (!('Multitive' in dv)) {
    dv.Multitive = ExprMultitive(dv);
  }
  return dv.Multitive;
}

function ExprMultitive(dv) {
  try {
    const primary = dvPrimary(dv);
    if (dvChar(primary.dv).value == '*') {
      const mul = dvMultitive(dvChar(primary.dv).dv);
      return {
        value: primary.value * mul.value,
        dv: mul.dv,
      };
    } else {
      throw {};
    }
  } catch (e) {
    return dvPrimary(dv);
  }
}

function dvPrimary(dv) {
  if (!('Primary' in dv)) {
    dv.Primary = ExprPrimary(dv);
  }
  return dv.Primary;
}

function ExprPrimary(dv) {
  try {
    if (dv.str[0].value == '(') {
      const add = dvAdditive(dvChar(dv).dv);
      if (dvChar(add.dv).value == ')') {
        return {
          value: add.value,
          dv: dvChar(add.dv).dv,
        };
      } else {
        throw {};
      }
    } else {
      throw {};
    }
  } catch (e) {
    return dvNumber(dv);
  }
}

function dvNumber(dv) {
  if (!('Number' in dv)) {
    dv.Number = ExprNumber(dv);
  }
  return dv.Number;
}

function ExprNumber(dv) {
  let value = 0;
  while (!isNaN(dvChar(dv).value)) {
    value = value * 10 + parseInt(dvChar(dv).value);
    dv = dvChar(dv).dv;
  }
  return {
    value: value,
    dv: dv,
  };
}

// function dvChar(dv) {
//   if (!('Char' in dv)) {
//     dv.Char = {
//       value: dv.str[0],
//       dv: {
//         str: dv.str.slice(1),
//       },
//     };
//   }
//   return dv.Char;
// }

function Expr(tokenList) {
  debugger;
  return ExprAdditive({
    str: tokenList,
  }).value;
}

console.log(Expr('1+2*4+3'));

class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

class Lexer {
  /**
   *Creates an instance of Lexer.
   * @param {string} source
   * @memberof Lexer
   */
  constructor(source) {
    this.source = source;
    this.tokenList = [];
  }

  lex() {
    while (this.source.length > 0) {
      this.source = this.source.trim();
      let num;
      if ((num = /^\d+/.exec(this.source))) {
        this.tokenList.push(new Token('Number', Number.parseInt(num[0])));
        this.source = this.source.slice(num[0].length);
      } else {
        switch (this.source[0]) {
          case '+':
            this.tokenList.push(new Token('Add', this.source[0]));
            break;
          case '-':
            this.tokenList.push(new Token('Minus', this.source[0]));
            break;
          case '*':
            this.tokenList.push(new Token('Multiply', this.source[0]));
            break;
          case '/':
            this.tokenList.push(new Token('Divide', this.source[0]));
            break;
          case '(':
            this.tokenList.push(new Token('LParen', this.source[0]));
            break;
          case ')':
            this.tokenList.push('RParen', this.source[0]);
            break;
          default:
            throw new Error('parse Error: unExpected char');
        }
        this.source = this.source.slice(1)
      }
    }
  }
}
const lexer = new Lexer('1 +2 * 3 +33333 + 4444');
console.log(lexer.lex())

console.log(lexer.tokenList)