const fs = require('fs');
let code = fs.readFileSync('screens/BattleMatchmakingScreen.js', 'utf8');
code = code.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
fs.writeFileSync('screens/BattleMatchmakingScreen.js', code);
