const fs = require('fs');

function checkFile(filename) {
  const code = fs.readFileSync(filename, 'utf8');
  const lines = code.split('\n');
  lines.forEach((line, index) => {
    // Look for JSX tags that have non-space text after them, or text before a tag
    // This is tricky, let's just look for any line that contains text not wrapped in <Text>
    // Just simple heuristics
    if (line.match(/>\s*[a-zA-Z0-9.,!?;:]/)) {
        if (!line.includes('<Text') && !line.includes('</Text>') && line.includes('<View') && !line.includes('/>')) {
            console.log(`[${filename}:${index+1}] ${line.trim()}`);
        }
    }
  });
}

checkFile('screens/BattleMatchmakingScreen.js');
checkFile('screens/StudentDashboardScreen.js');
