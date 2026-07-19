const fs = require('fs');

const helpersF10 = `
const TEN_ADD_ALLOWED = {
  1: { 'false': new Set([9]), 'true': new Set([9]) },
  2: { 'false': new Set([8, 9]), 'true': new Set([8, 9]) },
  3: { 'false': new Set([7, 8, 9]), 'true': new Set([7, 8, 9]) },
  4: { 'false': new Set([6, 7, 8, 9]), 'true': new Set([6, 7, 8, 9]) },
  5: { 'false': new Set([5, 6, 7, 8, 9]), 'true': new Set([5, 6, 7, 8, 9]) },
  6: { 'false': new Set([4, 9]), 'true': new Set([4, 9]) },
  7: { 'false': new Set([3, 4, 8, 9]), 'true': new Set([3, 4, 8, 9]) },
  8: { 'false': new Set([2, 3, 4, 7, 8, 9]), 'true': new Set([2, 3, 4, 7, 8, 9]) },
  9: { 'false': new Set([1, 2, 3, 4, 6, 7, 8, 9]), 'true': new Set([1, 2, 3, 4, 6, 7, 8, 9]) },
};

const TEN_SUB_ALLOWED = {
  1: { 'false': new Set(), 'true': new Set([0]) },
  2: { 'false': new Set(), 'true': new Set([0, 1]) },
  3: { 'false': new Set(), 'true': new Set([0, 1, 2]) },
  4: { 'false': new Set(), 'true': new Set([0, 1, 2, 3]) },
  5: { 'false': new Set(), 'true': new Set([0, 1, 2, 3, 4]) },
  6: { 'false': new Set(), 'true': new Set([0, 5]) },
  7: { 'false': new Set(), 'true': new Set([0, 1, 5, 6]) },
  8: { 'false': new Set(), 'true': new Set([0, 1, 2, 5, 6, 7]) },
  9: { 'false': new Set(), 'true': new Set([0, 1, 2, 3, 5, 6, 7, 8]) },
};

function isPrimaryTenAdd(currentDigit, operandDigit, upperNonzero) {
  const table = TEN_ADD_ALLOWED[operandDigit];
  if (!table) return false;
  return table[String(upperNonzero)].has(currentDigit);
}

function isPrimaryTenSub(currentDigit, operandDigit, upperNonzero) {
  const table = TEN_SUB_ALLOWED[operandDigit];
  if (!table) return false;
  return table[String(upperNonzero)].has(currentDigit);
}

function applyDigit(state, pos, operandDigit, operation) {
  if (operation === 'add') {
    state[pos] += operandDigit;
    while (pos > 0 && state[pos] >= 10) {
      const carry = Math.floor(state[pos] / 10);
      state[pos] %= 10;
      state[pos - 1] += carry;
      pos--;
    }
  } else {
    state[pos] -= operandDigit;
    while (pos > 0 && state[pos] < 0) {
      state[pos] += 10;
      state[pos - 1] -= 1;
      pos--;
    }
  }
}

function generateTenFormula(operation, mainFormula, digitsCount, termsCount, maxAttempts = 1000) {
  const stateWidth = digitsCount + 1;
  for (let _attempt = 0; _attempt < maxAttempts; _attempt++) {
    const firstNumber = Math.floor(Math.random() * (Math.pow(10, digitsCount) - Math.pow(10, digitsCount - 1))) + Math.pow(10, digitsCount - 1);
    
    const numbers = [firstNumber];
    let currentValue = firstNumber;
    let ok = true;
    for (let termIndex = 1; termIndex < termsCount; termIndex++) {
      const currentDigits = numberToDigits(currentValue, stateWidth);
      const mainDigits = currentDigits.slice(1);
      const avg = mainDigits.reduce((a, b) => a + b, 0) / digitsCount;
      let curOp;
      if (operation === 'add') {
        curOp = avg >= 6 ? 'sub' : 'add';
      } else {
        curOp = avg <= 3 ? 'add' : 'sub';
      }
      let built = false;
      for (let _retry = 0; _retry < 50; _retry++) {
        const state = numberToDigits(currentValue, stateWidth);
        const termDigits = new Array(digitsCount).fill(0);
        for (let pos = stateWidth - 1; pos >= 1; pos--) {
          const upperNonzero = pos > 0 ? state[pos - 1] > 0 : false;
          const primaryCandidates = [];
          for (let d = 1; d <= 9; d++) {
             if (curOp === 'add' && isPrimaryTenAdd(state[pos], d, upperNonzero) && d === mainFormula) {
                 primaryCandidates.push(d);
             } else if (curOp === 'sub' && isPrimaryTenSub(state[pos], d, upperNonzero) && d === mainFormula) {
                 primaryCandidates.push(d);
             }
          }
          if (primaryCandidates.length > 0) {
              const choice = primaryCandidates[Math.floor(Math.random() * primaryCandidates.length)];
              termDigits[pos - 1] = choice;
              applyDigit(state, pos, choice, curOp);
          } else {
              const fallback = Math.floor(Math.random() * 4) + 1;
              termDigits[pos - 1] = fallback;
              applyDigit(state, pos, fallback, curOp);
          }
        }
        const term = digitsToNumber(termDigits);
        if (state[0] >= 10 || state[0] < 0) continue;
        const nextValue = digitsToNumber(state);
        if (nextValue < 0 || String(nextValue).length > stateWidth) continue;
        const signedVal = curOp === 'add' ? term : -term;
        const prevAbs = numbers.length > 1 ? Math.abs(numbers[numbers.length - 1]) : null;
        if (prevAbs !== null && term === prevAbs) continue;
        numbers.push(signedVal);
        currentValue = nextValue;
        built = true;
        break;
      }
      if (!built) { ok = false; break; }
    }
    if (!ok || numbers.length !== termsCount) continue;
    return { numbers, answer: currentValue, ok: true };
  }
  return null;
}
`;

const f10Method = `
  generateF10: (digits, termsCount) => {
    const formulas = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const mainFormula = formulas[Math.floor(Math.random() * formulas.length)];
    const operation = Math.random() > 0.5 ? 'add' : 'sub';
    let res = generateTenFormula(operation, mainFormula, digits, termsCount);
    
    if (!res) {
      return { ...MentalMathGenerator.generateAddSub(digits, termsCount), section: 'f10' };
    }
    
    const terms = res.numbers.map((n, i) => {
      if (i === 0) return String(n);
      return n >= 0 ? \`+ \${n}\` : \`- \${Math.abs(n)}\`;
    });
    
    return {
      display: terms.join(' '),
      answer: res.answer,
      section: 'f10',
      difficulty: digits,
    };
  },
`;

let content = fs.readFileSync('src/lib/mathGenerator.js', 'utf8');

if (!content.includes('generateTenFormula')) {
  content = helpersF10 + '\n' + content;
}

if (!content.includes('generateF10:')) {
  content = content.replace(
    /generateF5:\s*\([\s\S]*?\},/,
    match => match + '\n' + f10Method
  );
}

if (!content.includes("case 'f10':")) {
  content = content.replace(
    /case 'f5':\s*\n\s*return MentalMathGenerator\.generateF5\(digits, termsCount\);/,
    match => match + "\n      case 'f10':\n        return MentalMathGenerator.generateF10(digits, termsCount);"
  );
}

fs.writeFileSync('src/lib/mathGenerator.js', content);
