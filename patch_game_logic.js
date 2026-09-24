const fs = require('fs');
const path = require('path');

// 1. Update BattleSettingsScreen.js to generate questions for random matchmaking
const settingsPath = path.join(__dirname, 'screens/BattleSettingsScreen.js');
let settingsContent = fs.readFileSync(settingsPath, 'utf8');

settingsContent = settingsContent.replace(
  `            if (route.params?.isFromMatchmaking) {
              const settings = {
                examplesCount: selectedExamples,
                operation: selectedOperation,
                speed: selectedSpeed,
                digits: selectedDigits
              };
              DeviceEventEmitter.emit('trigger_start_host_battle', settings);
              navigation.goBack();
            }`,
  `            if (route.params?.isFromMatchmaking) {
              const { MentalMathGenerator } = require('../src/lib/mathGenerator');
              const questions = [];
              for (let i = 0; i < 1; i++) {
                questions.push(MentalMathGenerator.generate(selectedOperation, selectedDigits, selectedExamples));
              }
              const settings = {
                examplesCount: selectedExamples,
                operation: selectedOperation,
                speed: selectedSpeed,
                digits: selectedDigits,
                questions: questions
              };
              DeviceEventEmitter.emit('trigger_start_host_battle', settings);
              navigation.goBack();
            }`
);
fs.writeFileSync(settingsPath, settingsContent, 'utf8');

// 2. Update BattleGameScreen.js to use multiplayer logic for all targetId matches
const gamePath = path.join(__dirname, 'screens/BattleGameScreen.js');
let gameContent = fs.readFileSync(gamePath, 'utf8');

// Update useEffect for listening to opponent answer
gameContent = gameContent.replace(
  `          if (route.params?.isFriendBattle) {
            answerSub = DeviceEventEmitter.addListener('global_battle_answer_submitted', (data) => {
               setOpponentResult(data);
            });
          }`,
  `          if (route.params?.targetId) {
            answerSub = DeviceEventEmitter.addListener('global_battle_answer_submitted', (data) => {
               setOpponentResult(data);
            });
          }`
);

// Update answer submission logic
gameContent = gameContent.replace(
  `      if (route.params?.isFriendBattle && route.params?.targetId) {`,
  `      if (route.params?.targetId) {`
);

// Update oppData fallback in the final navigation
gameContent = gameContent.replace(
  `          oppData: {
            name: opponentResult.senderName || t.opponent,
            avatar: opponentResult.senderAvatar || null,
            level: opponentResult.level || 1,
            xp: opponentResult.xp || 0
          }`,
  `          oppData: {
            name: opponentResult.senderName || route.params?.opponentData?.name || t.opponent,
            avatar: opponentResult.senderAvatar || route.params?.opponentData?.character || route.params?.opponentData?.avatar || null,
            level: opponentResult.level || route.params?.opponentData?.level || 1,
            xp: opponentResult.xp || route.params?.opponentData?.xp || 0
          }`
);

fs.writeFileSync(gamePath, gameContent, 'utf8');
console.log('BattleGameScreen and BattleSettingsScreen updated successfully!');
