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
    JSXText(path) {
      const text = path.node.value;
      if (text.trim().length > 0) {
        let parent = path.parent;
        if (parent && parent.type === 'JSXElement') {
          const parentName = parent.openingElement.name.name;
          if (parentName !== 'Text') {
            console.log(`[${filename}] Text node "${text.trim()}" inside <${parentName}> at line ${path.node.loc.start.line}`);
            found = true;
          }
        }
      }
    },
    JSXExpressionContainer(path) {
        if (path.node.expression.type === 'StringLiteral') {
            let parent = path.parent;
            if (parent && parent.type === 'JSXElement') {
              const parentName = parent.openingElement.name.name;
              if (parentName !== 'Text') {
                console.log(`[${filename}] Expression String "${path.node.expression.value}" inside <${parentName}> at line ${path.node.loc.start.line}`);
                found = true;
              }
            }
        }
        if (path.node.expression.type === 'LogicalExpression' && path.node.expression.operator === '&&') {
            // Check if right side is a string
            if (path.node.expression.right.type === 'StringLiteral') {
                let parent = path.parent;
                if (parent && parent.type === 'JSXElement') {
                  const parentName = parent.openingElement.name.name;
                  if (parentName !== 'Text') {
                    console.log(`[${filename}] Logical && String "${path.node.expression.right.value}" inside <${parentName}> at line ${path.node.loc.start.line}`);
                    found = true;
                  }
                }
            }
        }
    }
  });
  if(!found) console.log(`[${filename}] No naked strings found.`);
}

checkFile(file1);
checkFile(file2);
