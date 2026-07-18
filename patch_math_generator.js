const fs = require('fs');

const helpers = `
function isSmall5Add(currentDigit, operandDigit) {
  if (operandDigit < 1 || operandDigit > 4) return false;
  return (5 - operandDigit) <= currentDigit && currentDigit <= 4;
}
function isSmall5Sub(currentDigit, operandDigit) {
  if (operandDigit < 1 || operandDigit > 4) return false;
  return 5 <= currentDigit && currentDigit <= (4 + operandDigit);
}
function numberToDigits(n, width) {
  const s = String(Math.abs(n)).padStart(width, '0');
  return Array.from(s, ch => parseInt(ch, 10));
}
function digitsToNumber(digits) {
  return parseInt(digits.map(String).join(''), 10) || 0;
}
function smartInitialForFive(operation, mainFormula, digitsCount) {
  const digits = [];
  for (let i = 0; i < digitsCount; i++) {
    if (operation === 'add') {
      const low = Math.max(1, 5 - mainFormula);
      digits.push(low + Math.floor(Math.random() * (4 - low + 1)));
    } else {
      const high = Math.min(9, 4 + mainFormula);
      digits.push(5 + Math.floor(Math.random() * (high - 5 + 1)));
    }
  }
  return digitsToNumber(digits);
}
function generateFiveFormula(operation, mainFormula, digitsCount, termsCount, maxAttempts = 1000) {
  for (let _attempt = 0; _attempt < maxAttempts; _attempt++) {
    const firstNumber = smartInitialForFive(operation, mainFormula, digitsCount);
    const numbers = [firstNumber];
    let currentValue = firstNumber;
    let ok = true;
    for (let termIndex = 1; termIndex < termsCount; termIndex++) {
      const currentDigits = numberToDigits(currentValue, digitsCount);
      const avg = currentDigits.reduce((a, b) => a + b, 0) / digitsCount;
      let curOp;
      if (operation === 'add') {
        curOp = avg >= 5 ? 'sub' : 'add';
      } else {
        curOp = avg <= 4 ? 'add' : 'sub';
      }
      let built = false;
      for (let _retry = 0; _retry < 30; _retry++) {
        const curDigits = numberToDigits(currentValue, digitsCount);
        const termDigits = [];
        for (const digit of curDigits) {
          const primaryCandidates = [];
          for (let d = 1; d <= 9; d++) {
             if (curOp === 'add' && isSmall5Add(digit, d) && d === mainFormula) {
                 primaryCandidates.push(d);
             } else if (curOp === 'sub' && isSmall5Sub(digit, d) && d === mainFormula) {
                 primaryCandidates.push(d);
             }
          }
          if (primaryCandidates.length > 0) {
              termDigits.push(primaryCandidates[Math.floor(Math.random() * primaryCandidates.length)]);
          } else {
              termDigits.push(Math.floor(Math.random() * 4) + 1); 
          }
        }
        const term = digitsToNumber(termDigits);
        const signedVal = curOp === 'add' ? term : -term;
        
        const prevAbs = numbers.length > 1 ? Math.abs(numbers[numbers.length - 1]) : null;
        if (prevAbs !== null && term === prevAbs) continue;
        const nextValue = curOp === 'add' ? currentValue + term : currentValue - term;
        if (nextValue < 0 || String(nextValue).length > digitsCount) continue;
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

const f5Method = `
  generateF5: (digits, termsCount) => {
    const formulas = [1, 2, 3, 4];
    const mainFormula = formulas[Math.floor(Math.random() * formulas.length)];
    const operation = Math.random() > 0.5 ? 'add' : 'sub';
    let res = generateFiveFormula(operation, mainFormula, digits, termsCount);
    
    if (!res) {
      return { ...MentalMathGenerator.generateAddSub(digits, termsCount), section: 'f5' };
    }
    
    const terms = res.numbers.map((n, i) => {
      if (i === 0) return String(n);
      return n >= 0 ? \`+ \${n}\` : \`- \${Math.abs(n)}\`;
    });
    
    return {
      display: terms.join(' '),
      answer: res.answer,
      section: 'f5',
      difficulty: digits,
    };
  },
`;

let content = fs.readFileSync('src/lib/mathGenerator.js', 'utf8');

// Prepend helpers
if (!content.includes('generateFiveFormula')) {
  content = helpers + '\n' + content;
}

// Add generateF5 method
if (!content.includes('generateF5:')) {
  content = content.replace(
    /generateMix:\s*\([\s\S]*?\},/,
    match => match + '\n' + f5Method
  );
}

// Update the generate case
if (!content.includes("case 'f5':")) {
  content = content.replace(
    /case 'oddiy':\s*\/\/[^\n]*\n\s*return MentalMathGenerator\.generateAddSub\(digits, termsCount\);/,
    match => match + "\n      case 'f5':\n        return MentalMathGenerator.generateF5(digits, termsCount);"
  );
}

fs.writeFileSync('src/lib/mathGenerator.js', content);
