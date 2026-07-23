
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

  // Tekshiradi: A va B sonlari o'rtasidagi amal Oddiy (formula ishlatilmaydigan) usulda bajarilishi mumkinmi?
  isDirectMultiDigit: (c, d, op) => {
    let sC = String(c).padStart(String(Math.max(c, d)).length, '0');
    let sD = String(d).padStart(String(Math.max(c, d)).length, '0');
    for (let i = 0; i < sC.length; i++) {
      let digitC = parseInt(sC[i]);
      let digitD = parseInt(sD[i]);
      if (op === 'add') {
        if ((digitC % 5) + (digitD % 5) >= 5 || digitC + digitD > 9) return false;
      } else {
        if ((digitC % 5) - (digitD % 5) < 0 || digitC - digitD < 0) return false;
      }
    }
    return true;
  },

  // Tekshiradi: A va B sonlari o'rtasidagi amal faqat Oddiy yoki Formula 5 orqali bajariladimi? (10-formula umuman ishlatilmaydi)
  // return object { valid: boolean, usesF5: boolean }

  // Tekshiradi: A va B sonlari o'rtasidagi amal faqat Oddiy yoki Formula 10 orqali bajariladimi? (Formula 5 va Aralash ishlatilmaydi)
  // return object { valid: boolean, usesF10: boolean }
  isF10OrDirectMultiDigit: (c, d, op) => {
    if (op === 'sub' && c - d < 0) return { valid: false, usesF10: false };
    
    let strC = String(c).split('').map(Number).reverse();
    let strD = String(d).split('').map(Number).reverse();
    let maxLen = Math.max(strC.length, strD.length) + 1;
    let carryOrBorrow = 0;
    let usesF10 = false;
    
    for (let i = 0; i < maxLen; i++) {
      let valC = strC[i] || 0;
      let valD = (strD[i] || 0) + carryOrBorrow;
      carryOrBorrow = 0;
      
      if (valD === 0 && i >= Math.max(strC.length, strD.length)) continue; 
      
      if (op === 'add') {
        if (valC + valD <= 9) {
          // Direct add: no F5 allowed
          if ((valC % 5) + (valD % 5) >= 5) return { valid: false, usesF10: false };
        } else {
          // F10 add
          usesF10 = true;
          let comp = 10 - valD;
          // Must subtract comp directly (no F5)
          if ((valC % 5) - (comp % 5) < 0) return { valid: false, usesF10: false };
          carryOrBorrow = 1;
        }
      } else {
        if (valC - valD >= 0) {
          // Direct sub: no F5 allowed
          if ((valC % 5) - (valD % 5) < 0) return { valid: false, usesF10: false };
        } else {
          // F10 sub
          usesF10 = true;
          let comp = 10 - valD;
          // Must add comp directly (no F5)
          if ((valC % 5) + (comp % 5) >= 5) return { valid: false, usesF10: false };
          carryOrBorrow = 1;
        }
      }
    }
    return { valid: true, usesF10 };
  },

  isF5OrDirectMultiDigit: (c, d, op) => {
    let sC = String(c).padStart(String(Math.max(c, d)).length, '0');
    let sD = String(d).padStart(String(Math.max(c, d)).length, '0');
    let usesF5 = false;
    for (let i = 0; i < sC.length; i++) {
      let digitC = parseInt(sC[i]);
      let digitD = parseInt(sD[i]);
      if (op === 'add') {
        if (digitC + digitD > 9) return { valid: false, usesF5: false };
        if ((digitC % 5) + (digitD % 5) >= 5) usesF5 = true;
      } else {
        if (digitC - digitD < 0) return { valid: false, usesF5: false };
        if ((digitC % 5) - (digitD % 5) < 0) usesF5 = true;
      }
    }
    return { valid: true, usesF5 };
  },

  // Tekshiradi: A va B sonlari o'rtasidagi amal Aralash (Mixed) formula orqali bajariladimi?
  // return object { valid: boolean, usesMixed: boolean }
  isMixedOrAnyMultiDigit: (c, d, op) => {
    if (op === 'sub' && c - d < 0) return { valid: false, usesMixed: false };
    
    let strC = String(c).split('').map(Number).reverse();
    let strD = String(d).split('').map(Number).reverse();
    let maxLen = Math.max(strC.length, strD.length) + 1;
    let carryOrBorrow = 0;
    let usesMixed = false;
    
    for (let i = 0; i < maxLen; i++) {
      let valC = strC[i] || 0;
      let valD = (strD[i] || 0) + carryOrBorrow;
      carryOrBorrow = 0;
      
      if (valD === 0 && i >= Math.max(strC.length, strD.length)) continue; 
      
      if (op === 'add') {
        if (valC + valD > 9) {
          let comp = 10 - valD;
          if ((valC % 5) - (comp % 5) < 0) usesMixed = true;
          carryOrBorrow = 1;
        }
      } else {
        if (valC - valD < 0) {
          let comp = 10 - valD;
          if ((valC % 5) + (comp % 5) >= 5) usesMixed = true;
          carryOrBorrow = 1;
        }
      }
    }
    return { valid: true, usesMixed };
  },

  // Qo'shish va Ayirish (Oddiy abakus usulida, formula ishlatilmaydi, ikki xonali javob chiqmaydi)
  generateAddSub: (digits, termsCount = 3) => {
    for (let mainAttempt = 0; mainAttempt < 50; mainAttempt++) {
      const terms = [];
      let ok = true;
      
      const firstNum = MentalMathGenerator.getNumByDigits(digits);
      let currentTotal = firstNum;
      terms.push(String(firstNum));

      for (let i = 1; i < termsCount; i++) {
        let isPlus = Math.random() > 0.5;
        let found = false;

        for (let retry = 0; retry < 50; retry++) {
          let num = MentalMathGenerator.getNumByDigits(digits);
          
          if (isPlus) {
            if (MentalMathGenerator.isDirectMultiDigit(currentTotal, num, 'add')) {
              currentTotal += num;
              terms.push(`+ ${num}`);
              found = true;
              break;
            } else {
              isPlus = false; // try minus
            }
          } 
          if (!isPlus) {
            if (MentalMathGenerator.isDirectMultiDigit(currentTotal, num, 'sub')) {
              currentTotal -= num;
              terms.push(`- ${num}`);
              found = true;
              break;
            } else {
              isPlus = true; // reset for next retry
            }
          }
        }
        
        if (!found) {
           ok = false;
           break;
        }
      }
      
      if (ok) {
        return {
          display: terms.join(' '),
          answer: currentTotal,
          section: 'add-sub',
          difficulty: digits,
        };
      }
    }
    
    // Fallback if failed to generate
    const fbNum = Math.pow(10, digits - 1);
    return {
      display: `${fbNum} + ${fbNum}`,
      answer: fbNum * 2,
      section: 'add-sub',
      difficulty: digits,
    };
  },
  // Ko'paytirish
  generateMul: (level) => {
    let n1, n2;
    switch (level) {
      case 1: 
        n1 = Math.floor(Math.random() * 9) + 2; // 1-digit (2-9, ignoring 1 to avoid trivial 1x1)
        n2 = Math.floor(Math.random() * 9) + 2; // 1-digit
        break;
      case 2: 
        n1 = Math.floor(Math.random() * 90) + 10; // 2-digit
        n2 = Math.floor(Math.random() * 90) + 10; // 2-digit
        break;
      case 3: 
        n1 = Math.floor(Math.random() * 900) + 100; // 3-digit
        n2 = Math.floor(Math.random() * 900) + 100; // 3-digit
        break;
      case 4: 
        n1 = Math.floor(Math.random() * 9000) + 1000; // 4-digit
        n2 = Math.floor(Math.random() * 9000) + 1000; // 4-digit
        break;
      default:
        n1 = Math.floor(Math.random() * 9) + 2;
        n2 = Math.floor(Math.random() * 9) + 2;
    }
    return {
      display: `${n1} × ${n2}`,
      answer: n1 * n2,
      section: 'multiply',
      difficulty: level,
    };
  },
  // Bo'lish (Qoldiqsiz ishlashi uchun maxsus tayyorlangan)
  generateDiv: (level) => {
    let divisor;
    let answer;
    switch (level) {
      case 1:
        divisor = Math.floor(Math.random() * 8) + 2; 
        answer = Math.floor(Math.random() * 8) + 2;
        break;
      case 2:
        divisor = Math.floor(Math.random() * 90) + 10;
        answer = Math.floor(Math.random() * 90) + 10;
        break;
      case 3:
        divisor = Math.floor(Math.random() * 900) + 100;
        answer = Math.floor(Math.random() * 900) + 100;
        break;
      case 4:
        divisor = Math.floor(Math.random() * 9000) + 1000;
        answer = Math.floor(Math.random() * 9000) + 1000;
        break;
      default:
        divisor = Math.floor(Math.random() * 8) + 2;
        answer = Math.floor(Math.random() * 8) + 2;
    }
    const dividend = divisor * answer; 
    return {
      display: `${dividend} ÷ ${divisor}`,
      answer: answer,
      section: 'divide',
      difficulty: level,
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

  // Formula 5 (Kichik Do'st) usulida
  generateF5: (digits, termsCount = 3) => {
    for (let mainAttempt = 0; mainAttempt < 50; mainAttempt++) {
      const terms = [];
      let ok = true;
      let sequenceHasF5 = false;
      
      const firstNum = MentalMathGenerator.getNumByDigits(digits);
      let currentTotal = firstNum;
      terms.push(String(firstNum));

      for (let i = 1; i < termsCount; i++) {
        let isPlus = Math.random() > 0.5;
        let found = false;

        for (let retry = 0; retry < 50; retry++) {
          let num = MentalMathGenerator.getNumByDigits(digits);
          
          if (isPlus) {
            const check = MentalMathGenerator.isF5OrDirectMultiDigit(currentTotal, num, 'add');
            if (check.valid) {
              currentTotal += num;
              terms.push(`+ ${num}`);
              if (check.usesF5) sequenceHasF5 = true;
              found = true;
              break;
            } else {
              isPlus = false; // try minus
            }
          } 
          if (!isPlus) {
            const check = MentalMathGenerator.isF5OrDirectMultiDigit(currentTotal, num, 'sub');
            if (check.valid) {
              currentTotal -= num;
              terms.push(`- ${num}`);
              if (check.usesF5) sequenceHasF5 = true;
              found = true;
              break;
            } else {
              isPlus = true; // reset
            }
          }
        }
        
        if (!found) {
           ok = false;
           break;
        }
      }
      
      if (ok && sequenceHasF5) {
        return {
          display: terms.join(' '),
          answer: currentTotal,
          section: 'f5',
          difficulty: digits,
        };
      }
    }
    
    // Fallback if failed to generate (masalan, faqat direct tushib qolsa, lekin bu ehtimoli juda kam)
    return { ...MentalMathGenerator.generateAddSub(digits, termsCount), section: 'f5' };
  },

    // Formula 10 (Katta Do'st) usulida
  generateF10: (digits, termsCount = 3) => {
    for (let mainAttempt = 0; mainAttempt < 50; mainAttempt++) {
      const terms = [];
      let ok = true;
      let sequenceHasF10 = false;
      
      const firstNum = MentalMathGenerator.getNumByDigits(digits);
      let currentTotal = firstNum;
      terms.push(String(firstNum));

      for (let i = 1; i < termsCount; i++) {
        let isPlus = Math.random() > 0.5;
        let found = false;

        for (let retry = 0; retry < 50; retry++) {
          let num = MentalMathGenerator.getNumByDigits(digits);
          
          if (isPlus) {
            const check = MentalMathGenerator.isF10OrDirectMultiDigit(currentTotal, num, 'add');
            if (check.valid) {
              currentTotal += num;
              terms.push(`+ ${num}`);
              if (check.usesF10) sequenceHasF10 = true;
              found = true;
              break;
            } else {
              isPlus = false; 
            }
          } 
          if (!isPlus) {
            const check = MentalMathGenerator.isF10OrDirectMultiDigit(currentTotal, num, 'sub');
            if (check.valid) {
              currentTotal -= num;
              terms.push(`- ${num}`);
              if (check.usesF10) sequenceHasF10 = true;
              found = true;
              break;
            } else {
              isPlus = true; 
            }
          }
        }
        
        if (!found) {
           ok = false;
           break;
        }
      }
      
      if (ok && sequenceHasF10) {
        return {
          display: terms.join(' '),
          answer: currentTotal,
          section: 'f10',
          difficulty: digits,
        };
      }
    }
    
    return { ...MentalMathGenerator.generateAddSub(digits, termsCount), section: 'f10' };
  },

  // Aralash (Mixed) formula usulida
  generateAralash: (digits, termsCount = 3) => {
    for (let mainAttempt = 0; mainAttempt < 50; mainAttempt++) {
      const terms = [];
      let ok = true;
      let sequenceHasMixed = false;
      
      const firstNum = MentalMathGenerator.getNumByDigits(digits);
      let currentTotal = firstNum;
      terms.push(String(firstNum));

      for (let i = 1; i < termsCount; i++) {
        let isPlus = Math.random() > 0.5;
        let found = false;

        for (let retry = 0; retry < 50; retry++) {
          let num = MentalMathGenerator.getNumByDigits(digits);
          
          if (isPlus) {
            const check = MentalMathGenerator.isMixedOrAnyMultiDigit(currentTotal, num, 'add');
            if (check.valid) {
              currentTotal += num;
              terms.push(`+ ${num}`);
              if (check.usesMixed) sequenceHasMixed = true;
              found = true;
              break;
            } else {
              isPlus = false; 
            }
          } 
          if (!isPlus) {
            const check = MentalMathGenerator.isMixedOrAnyMultiDigit(currentTotal, num, 'sub');
            if (check.valid) {
              currentTotal -= num;
              terms.push(`- ${num}`);
              if (check.usesMixed) sequenceHasMixed = true;
              found = true;
              break;
            } else {
              isPlus = true; 
            }
          }
        }
        
        if (!found) {
           ok = false;
           break;
        }
      }
      
      if (ok && sequenceHasMixed) {
        return {
          display: terms.join(' '),
          answer: currentTotal,
          section: 'aralash',
          difficulty: digits,
        };
      }
    }
    
    return { ...MentalMathGenerator.generateAddSub(digits, termsCount), section: 'aralash' };
  },



  // Asosiy chaqiruv funksiyasi
  generate: (section, digits = 1, termsCount = 3) => {
    switch (section) {
      case 'add-sub':
      case 'oddiy': // handle mapping from UI
        return MentalMathGenerator.generateAddSub(digits, termsCount);
      case 'f5':
        return MentalMathGenerator.generateF5(digits, termsCount);
      case 'f10':
        return MentalMathGenerator.generateF10(digits, termsCount);
      case 'multiply':
      case 'kopaytirish':
        return MentalMathGenerator.generateMul(digits);
      case 'divide':
      case 'bolish':
        return MentalMathGenerator.generateDiv(digits);
      case 'mix':
      case 'aralash':
        return MentalMathGenerator.generateAralash(digits, termsCount);
      default:
        return MentalMathGenerator.generateAddSub(digits, termsCount);
    }
  },
};
