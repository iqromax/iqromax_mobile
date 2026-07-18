
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

export const MentalMathGenerator = {
  // Helper for generating random number based on digits (1 -> 1-9, 2 -> 10-99, etc)
  getNumByDigits: (digits) => {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Qo'shish va Ayirish (Zanjir usulida ketma-ket)
  generateAddSub: (digits, termsCount = 3) => {
    const terms = [];
    let currentTotal = 0;
    
    for (let i = 0; i < termsCount; i++) {
      const num = MentalMathGenerator.getNumByDigits(digits);
      if (i === 0) {
        currentTotal = num;
        terms.push(String(num));
      } else {
        const isPlus = Math.random() > 0.4;
        if (isPlus) {
          currentTotal += num;
          terms.push(`+ ${num}`);
        } else {
          // Manfiy son chiqib ketmasligi uchun tekshiruv
          if (currentTotal - num >= 0) {
            currentTotal -= num;
            terms.push(`- ${num}`);
          } else {
            currentTotal += num;
            terms.push(`+ ${num}`);
          }
        }
      }
    }
    return {
      display: terms.join(' '),
      answer: currentTotal,
      section: 'add-sub',
      difficulty: digits,
    };
  },
  // Ko'paytirish
  generateMul: (digits) => {
    // Both numbers will use the selected digits count
    const n1 = MentalMathGenerator.getNumByDigits(digits);
    const n2 = MentalMathGenerator.getNumByDigits(digits);
    return {
      display: `${n1} × ${n2}`,
      answer: n1 * n2,
      section: 'multiply',
      difficulty: digits,
    };
  },
  // Bo'lish (Qoldiqsiz ishlashi uchun maxsus tayyorlangan)
  generateDiv: (digits) => {
    // Both divisor and answer will use the selected digits count to form the dividend
    const divisor = MentalMathGenerator.getNumByDigits(digits);
    const answer = MentalMathGenerator.getNumByDigits(digits);
    const dividend = divisor * answer;
    return {
      display: `${dividend} ÷ ${divisor}`,
      answer: answer,
      section: 'divide',
      difficulty: digits,
    };
  },
  // Aralash (Tasodifiy barcha amallar qatnashadi)
  generateMix: (digits) => {
    const rand = Math.random();
    if (rand < 0.33) {
      return { ...MentalMathGenerator.generateAddSub(digits, 3), section: 'mix' };
    } else if (rand < 0.66) {
      return { ...MentalMathGenerator.generateMul(digits), section: 'mix' };
    } else {
      return { ...MentalMathGenerator.generateDiv(digits), section: 'mix' };
    }
  },

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
      return n >= 0 ? `+ ${n}` : `- ${Math.abs(n)}`;
    });
    
    return {
      display: terms.join(' '),
      answer: res.answer,
      section: 'f5',
      difficulty: digits,
    };
  },

  // Asosiy chaqiruv funksiyasi
  generate: (section, digits = 1, termsCount = 3) => {
    switch (section) {
      case 'add-sub':
      case 'oddiy': // handle mapping from UI
        return MentalMathGenerator.generateAddSub(digits, termsCount);
      case 'f5':
        return MentalMathGenerator.generateF5(digits, termsCount);
      case 'multiply':
      case 'kopaytirish':
        return MentalMathGenerator.generateMul(digits);
      case 'divide':
      case 'bolish':
        return MentalMathGenerator.generateDiv(digits);
      case 'mix':
      case 'aralash':
        return MentalMathGenerator.generateMix(digits);
      default:
        return MentalMathGenerator.generateAddSub(digits, termsCount);
    }
  },
};
