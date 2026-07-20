const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const code = fs.readFileSync('screens/BattleMatchmakingScreen.js', 'utf8');
const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['jsx']
});

traverse(ast, {
  JSXText(path) {
    const text = path.node.value;
    if (text.replace(/\s/g, '').length > 0) {
      const parentName = path.parent.openingElement ? path.parent.openingElement.name.name : 'Unknown';
      console.log(`Text: "${text.trim()}" inside <${parentName}> at line ${path.node.loc.start.line}`);
      if (parentName !== 'Text') {
          console.log(`ERROR: Found naked text: "${text.trim()}"`);
      }
    }
  }
});
