const fs = require('fs');
const babel = require('@babel/parser');

try {
  const code = fs.readFileSync('screens/OddiyHisobGameScreen.js', 'utf8');
  babel.parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  });
  console.log("No syntax errors found.");
} catch (e) {
  console.error("Syntax Error at line", e.loc.line, "col", e.loc.column);
  console.error(e.message);
}
