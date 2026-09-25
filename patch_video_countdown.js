const fs = require('fs');
const path = require('path');

const gamePath = path.join(__dirname, 'screens/BattleGameScreen.js');
let gameContent = fs.readFileSync(gamePath, 'utf8');

// 1. Add Video import
if (!gameContent.includes('import { Video } from \\'expo-av\\';')) {
  gameContent = gameContent.replace(
    "import { Audio } from '../src/utils/safeAudio';",
    "import { Audio } from '../src/utils/safeAudio';\nimport { Video } from 'expo-av';"
  );
}

// 2. Remove the old countdown useEffect
const oldEffect = /  useEffect\(\(\) => \{\n    if \(phase === 'countdown'\) \{\n      if \(startCountdown > 0\) \{\n        const timer = setTimeout\(\(\) => \{\n          setStartCountdown\(prev => prev - 1\);\n        \}, 1000\);\n        return \(\) => clearTimeout\(timer\);\n      \} else \{\n        playSound\('tick', sequence\[0\]\?\.op \|\| '\+'\);\n        setPhase\('flashing'\);\n        setQuestionStartTime\(Date\.now\(\)\);\n      \}\n    \}\n  \}, \[phase, startCountdown\]\);\n/;
gameContent = gameContent.replace(oldEffect, '');

// 3. Replace the countdown UI with Video
const oldUI = `        {phase === 'countdown' ? (
          <View style={styles.gameArea}>
            <Text style={{ fontSize: 120, color: '#f97316', fontFamily: 'Inter_800ExtraBold', textShadowColor: 'rgba(249, 115, 22, 0.5)', textShadowRadius: 20 }}>
              {startCountdown}
            </Text>
            <Text style={[styles.operator, { fontSize: 24, marginTop: 10, color: '#9ca3af' }]}>{t.getReady}</Text>
          </View>
        ) : phase === 'flashing' ? (`;

const newUI = `        {phase === 'countdown' ? (
          <View style={[styles.gameArea, { padding: 0, overflow: 'hidden', borderWidth: 1, borderColor: '#f97316' }]}>
            <Video
              source={require('../assets/svetafor.mp4')}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
              shouldPlay
              isLooping={false}
              onPlaybackStatusUpdate={(status) => {
                if (status.didJustFinish) {
                   playSound('tick', sequence[0]?.op || '+');
                   setPhase('flashing');
                   setQuestionStartTime(Date.now());
                }
              }}
            />
          </View>
        ) : phase === 'flashing' ? (`;

gameContent = gameContent.replace(oldUI, newUI);

fs.writeFileSync(gamePath, gameContent, 'utf8');
console.log('BattleGameScreen updated with video countdown successfully!');
