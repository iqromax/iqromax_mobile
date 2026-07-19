const fs = require('fs');

const helpersMix = `
function isMixAdd(currentDigit, operandDigit) {
  if (operandDigit < 6 || operandDigit > 9) return false;
  const high = 14 - operandDigit;
  return 5 <= currentDigit && currentDigit <= high;
}

function isMixSub(currentDigit, operandDigit, upperNonzero) {
  if (operandDigit < 6 || operandDigit > 9) return false;
  if (!upperNonzero) return false;
  const low = operandDigit - 5;
  return low <= currentDigit && currentDigit <= 4;
}

function generateMixFormula(operation, mainFormula, digitsCount, termsCount, maxAttempts = 1000) {
  const stateWidth = digitsCount + 1;
  for (let _attempt = 0; _attempt < maxAttempts; _attempt++) {
    const firstDigits = [];
    for (let i = 0; i < digitsCount; i++) {
      const low = 5;
      const high = Math.min(8, 14 - mainFormula);
      firstDigits.push(low + Math.floor(Math.random() * (high - low + 1)));
    }
    const firstNumber = digitsToNumber(firstDigits);
    
    const numbers = [firstNumber];
    let currentValue = firstNumber;
    let ok = true;
    for (let termIndex = 1; termIndex < termsCount; termIndex++) {
      const currentDigits = numberToDigits(currentValue, stateWidth);
      const mainDigits = currentDigits.slice(1);
      const avg = mainDigits.reduce((a, b) => a + b, 0) / digitsCount;
      const curOp = avg >= 5 ? 'add' : 'sub';
      let built = false;
      for (let _retry = 0; _retry < 30; _retry++) {
        const state = numberToDigits(currentValue, stateWidth);
        const termDigits = new Array(digitsCount).fill(0);
        for (let pos = stateWidth - 1; pos >= 1; pos--) {
          const upperNonzero = pos > 0 ? state[pos - 1] > 0 : false;
          const currentDigit = state[pos];
          const primaryCandidates = [];
          const secondaryCandidates = [];
          for (let d = 1; d <= 9; d++) {
             if (curOp === 'add' && d === mainFormula && isMixAdd(currentDigit, d)) primaryCandidates.push(d);
             if (curOp === 'sub' && d === mainFormula && isMixSub(currentDigit, d, upperNonzero)) primaryCandidates.push(d);
             
             if (curOp === 'add' && d !== mainFormula && isMixAdd(currentDigit, d)) secondaryCandidates.push(d);
             if (curOp === 'sub' && d !== mainFormula && isMixSub(currentDigit, d, upperNonzero)) secondaryCandidates.push(d);
          }
          if (primaryCandidates.length > 0) {
              const choice = primaryCandidates[Math.floor(Math.random() * primaryCandidates.length)];
              termDigits[pos - 1] = choice;
              applyDigit(state, pos, choice, curOp);
          } else if (secondaryCandidates.length > 0) {
              const choice = secondaryCandidates[Math.floor(Math.random() * secondaryCandidates.length)];
              termDigits[pos - 1] = choice;
              applyDigit(state, pos, choice, curOp);
          } else {
              const fallback = Math.floor(Math.random() * 4) + 1;
              termDigits[pos - 1] = fallback;
              applyDigit(state, pos, fallback, curOp);
          }
        }
        const term = digitsToNumber(termDigits);
        if (term === 0 || state[0] >= 10 || state[0] < 0) continue;
        const nextValue = digitsToNumber(state);
        if (nextValue < 0) continue;
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

const mixMethod = `
  generateAralash: (digits, termsCount) => {
    const formulas = [6, 7, 8, 9];
    const mainFormula = formulas[Math.floor(Math.random() * formulas.length)];
    const operation = Math.random() > 0.5 ? 'add' : 'sub';
    let res = generateMixFormula(operation, mainFormula, digits, termsCount);
    
    if (!res) {
      return { ...MentalMathGenerator.generateAddSub(digits, termsCount), section: 'aralash' };
    }
    
    const terms = res.numbers.map((n, i) => {
      if (i === 0) return String(n);
      return n >= 0 ? \`+ \${n}\` : \`- \${Math.abs(n)}\`;
    });
    
    return {
      display: terms.join(' '),
      answer: res.answer,
      section: 'aralash',
      difficulty: digits,
    };
  },
`;

let content = fs.readFileSync('src/lib/mathGenerator.js', 'utf8');

if (!content.includes('generateMixFormula')) {
  content = helpersMix + '\n' + content;
}

if (!content.includes('generateAralash:')) {
  content = content.replace(
    /generateF10:\s*\([\s\S]*?\},/,
    match => match + '\n' + mixMethod
  );
}

if (!content.includes("return MentalMathGenerator.generateAralash(digits, termsCount);")) {
  content = content.replace(
    /case 'mix':\s*\n\s*case 'aralash':\s*\n\s*return MentalMathGenerator\.generateMix\(digits\);/,
    "case 'mix':\n      case 'aralash':\n        return MentalMathGenerator.generateAralash(digits, termsCount);"
  );
}

fs.writeFileSync('src/lib/mathGenerator.js', content);
