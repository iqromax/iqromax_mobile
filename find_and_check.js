const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const file1 = 'screens/BattleMatchmakingScreen.js';
const file2 = 'screens/StudentDashboardScreen.js';

function checkFile(filename) {
  const code = fs.readFileSync(filename, 'utf8');
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  });

  let found = false;
  traverse(ast, {
    JSXExpressionContainer(path) {
        if (path.node.expression.type === 'LogicalExpression' && path.node.expression.operator === '&&') {
            const left = path.node.expression.left;
            // Check what left side is. If it's something that might return a string or number, flag it.
            // But actually we just want to print all of them to inspect.
            let parent = path.parent;
            if (parent && parent.type === 'JSXElement') {
                const parentName = parent.openingElement.name.name;
                if (parentName !== 'Text') {
                    console.log(`[${filename}] Logical && inside <${parentName}> at line ${path.node.loc.start.line}. Left side type: ${left.type}`);
                }
            }
        }
    }
  });
}

checkFile(file1);
checkFile(file2);
