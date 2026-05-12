type Token =
  | { type: 'number'; value: number }
  | { type: 'op'; value: string }
  | { type: 'func'; value: string }
  | { type: 'lparen' }
  | { type: 'rparen' }
  | { type: 'comma' };

const PRECEDENCE: Record<string, number> = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  '^': 3,
};

const RIGHT_ASSOC: Record<string, boolean> = {
  '^': true,
};

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < expr.length) {
    const ch = expr[i];

    if (ch === ' ') {
      i++;
      continue;
    }

    if (ch >= '0' && ch <= '9' || ch === '.') {
      let num = '';
      while (i < expr.length && (expr[i] >= '0' && expr[i] <= '9' || expr[i] === '.')) {
        num += expr[i];
        i++;
      }
      tokens.push({ type: 'number', value: parseFloat(num) });
      continue;
    }

    if (ch === 'π') {
      tokens.push({ type: 'number', value: Math.PI });
      i++;
      continue;
    }

    if (ch === 'e' && (i + 1 >= expr.length || !isAlpha(expr[i + 1]))) {
      tokens.push({ type: 'number', value: Math.E });
      i++;
      continue;
    }

    if (isAlpha(ch)) {
      let name = '';
      while (i < expr.length && isAlpha(expr[i])) {
        name += expr[i];
        i++;
      }
      if (name === 'e') {
        tokens.push({ type: 'number', value: Math.E });
      } else {
        tokens.push({ type: 'func', value: name });
      }
      continue;
    }

    if ('+-*/^'.includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }

    if (ch === '(') {
      tokens.push({ type: 'lparen' });
      i++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'rparen' });
      i++;
      continue;
    }
    if (ch === ',') {
      tokens.push({ type: 'comma' });
      i++;
      continue;
    }

    i++;
  }

  return tokens;
}

function isAlpha(ch: string): boolean {
  return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
}

function factorial(n: number): number {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  if (!Number.isInteger(n)) {
    // Gamma function approximation for non-integers
    return gamma(n + 1);
  }
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function gamma(z: number): number {
  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  }
  z -= 1;
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  let x = c[0];
  for (let i = 1; i < g + 2; i++) x += c[i] / (z + i);
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

export function evaluate(expr: string, angleUnit: 'DEG' | 'RAD'): number {
  const tokens = tokenize(expr);
  if (tokens.length === 0) return 0;

  let pos = 0;

  function peek(): Token | null {
    return pos < tokens.length ? tokens[pos] : null;
  }

  function consume(): Token {
    return tokens[pos++];
  }

  function parseExpression(minPrec: number = 0): number {
    let left = parseUnary();

    while (true) {
      const tok = peek();
      if (!tok || tok.type !== 'op') break;
      const prec = PRECEDENCE[tok.value];
      if (prec === undefined || prec < minPrec) break;
      const op = tok.value;
      consume();

      const nextMinPrec = RIGHT_ASSOC[op] ? prec : prec + 1;
      const right = parseExpression(nextMinPrec);

      switch (op) {
        case '+': left += right; break;
        case '-': left -= right; break;
        case '*': left *= right; break;
        case '/':
          if (right === 0) throw new Error('Division by zero');
          left /= right;
          break;
        case '^': left = Math.pow(left, right); break;
      }
    }

    return left;
  }

  function parseUnary(): number {
    const tok = peek();
    if (tok && tok.type === 'op' && tok.value === '-') {
      consume();
      return -parseAtom();
    }
    if (tok && tok.type === 'op' && tok.value === '+') {
      consume();
      return parseAtom();
    }
    return parseAtom();
  }

  function parseAtom(): number {
    const tok = peek();
    if (!tok) throw new Error('Unexpected end of expression');

    if (tok.type === 'number') {
      consume();
      return tok.value;
    }

    if (tok.type === 'lparen') {
      consume();
      const val = parseExpression(0);
      const close = peek();
      if (!close || close.type !== 'rparen') {
        throw new Error('Missing closing parenthesis');
      }
      consume();
      return val;
    }

    if (tok.type === 'func') {
      const funcName = tok.value;
      consume();

      const openParen = peek();
      if (!openParen || openParen.type !== 'lparen') {
        // Implicit multiplication: sin 30 -> sin(30) but also handle sqrt 2
        // Fall back to treating next atom as argument
        const arg = parseAtom();
        return applyFunc(funcName, arg, angleUnit);
      }
      consume(); // consume '('

      const arg = parseExpression(0);

      // Handle two-argument functions like log(base, x)
      let arg2: number | undefined;
      const maybeComma = peek();
      if (maybeComma && maybeComma.type === 'comma') {
        consume();
        arg2 = parseExpression(0);
      }

      const closeParen = peek();
      if (!closeParen || closeParen.type !== 'rparen') {
        throw new Error('Missing closing parenthesis after function argument');
      }
      consume();

      return applyFunc(funcName, arg, angleUnit, arg2);
    }

    throw new Error(`Unexpected token: ${JSON.stringify(tok)}`);
  }

  return parseExpression(0);
}

function applyFunc(
  name: string,
  arg: number,
  angleUnit: 'DEG' | 'RAD',
  arg2?: number,
): number {
  const toRad = angleUnit === 'DEG' ? (x: number) => (x * Math.PI) / 180 : (x: number) => x;

  switch (name) {
    case 'sin': return Math.sin(toRad(arg));
    case 'cos': return Math.cos(toRad(arg));
    case 'tan': return Math.tan(toRad(arg));
    case 'asin': return angleUnit === 'DEG' ? (Math.asin(arg) * 180) / Math.PI : Math.asin(arg);
    case 'acos': return angleUnit === 'DEG' ? (Math.acos(arg) * 180) / Math.PI : Math.acos(arg);
    case 'atan': return angleUnit === 'DEG' ? (Math.atan(arg) * 180) / Math.PI : Math.atan(arg);
    case 'log':
      if (arg2 !== undefined) return Math.log(arg) / Math.log(arg2); // log(base, x)
      return Math.log10(arg);
    case 'ln': return Math.log(arg);
    case 'sqrt': return Math.sqrt(arg);
    case 'cbrt': return Math.cbrt(arg);
    case 'abs': return Math.abs(arg);
    case 'exp': return Math.exp(arg);
    case 'fact':
    case '!': return factorial(arg);
    default:
      throw new Error(`Unknown function: ${name}`);
  }
}
