const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'screens/BattleSettingsScreen.js');
let content = fs.readFileSync(filePath, 'utf8');

// Add DeviceEventEmitter import
if (!content.includes('DeviceEventEmitter')) {
  content = content.replace(
    "import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';",
    "import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform, DeviceEventEmitter } from 'react-native';"
  );
}

// Update the onPress logic of the BATTLE BOSHLASH button
const oldStartLogic = /if \(route\.params\?\.isFriendBattle[\s\S]*?navigation\.navigate\('BattleMatchmaking', {[\s\S]*?}\);\n\s+}/;
const newStartLogic = `if (route.params?.isFromMatchmaking) {
              const settings = {
                examplesCount: selectedExamples,
                operation: selectedOperation,
                speed: selectedSpeed,
                digits: selectedDigits
              };
              DeviceEventEmitter.emit('trigger_start_host_battle', settings);
              navigation.goBack();
            } else if (route.params?.isFriendBattle && route.params?.targetId) {
              const settings = {
                examplesCount: selectedExamples,
                operation: selectedOperation,
                speed: selectedSpeed,
                digits: selectedDigits
              };
              
              const { MentalMathGenerator } = require('../src/lib/mathGenerator');
              const questions = [];
              for (let i = 0; i < 1; i++) {
                questions.push(MentalMathGenerator.generate(selectedOperation, selectedDigits, selectedExamples));
              }

              const friendAvatar = route.params.foundUser?.character 
                ? route.params.foundUser.character 
                : (route.params.foundUser?.avatar?.uri ? route.params.foundUser.avatar.uri : route.params.foundUser?.avatar);

              let myEquippedSkins = {};
              try {
                const userDataStr = await AsyncStorage.getItem('user_data');
                const userData = userDataStr ? JSON.parse(userDataStr) : null;
                if (userData) {
                  const userIdKey = userData.customId || userData.id || 'guest';
                  const skinsStr = await AsyncStorage.getItem(\`user_equipped_skins_\${userIdKey}\`);
                  if (skinsStr) {
                    const parsedSkins = JSON.parse(skinsStr);
                    let activeAvatarIndex = 0;
                    if (userData.character) {
                      const lowerChar = userData.character.toLowerCase();
                      const boysChars = ["alex", "maks", "david", "kevin"];
                      const girlsChars = ["lily", "maya", "emma", "sophia"];
                      if (boysChars.includes(lowerChar)) {
                        activeAvatarIndex = boysChars.indexOf(lowerChar);
                      } else if (girlsChars.includes(lowerChar)) {
                        activeAvatarIndex = girlsChars.indexOf(lowerChar) + 4;
                      }
                    }
                    myEquippedSkins = {
                      accessories: parsedSkins.accessories?.[activeAvatarIndex] || null,
                      tops: parsedSkins.tops?.[activeAvatarIndex] || null,
                      headwears: parsedSkins.headwears?.[activeAvatarIndex] || null,
                      pants: parsedSkins.pants?.[activeAvatarIndex] || null,
                      shoes: parsedSkins.shoes?.[activeAvatarIndex] || null,
                      backpacks: parsedSkins.backpacks?.[activeAvatarIndex] || null,
                    };
                  }
                }
              } catch (e) {}

              navigation.replace('FriendBattleLobby', {
                language,
                inviteData: { 
                   targetName: route.params.foundUser?.name || route.params.inviteData?.targetName || route.params.inviteData?.senderName,
                   targetAvatar: friendAvatar,
                   targetEquippedSkins: route.params.inviteData?.targetEquippedSkins || {},
                   myEquippedSkins: myEquippedSkins,
                   level: route.params.foundUser?.level || 1,
                   xp: route.params.foundUser?.xp !== undefined ? route.params.foundUser.xp : (route.params.foundUser?.rating || 0),
                   senderId: route.params.targetId,
                },
                isHost: true,
                settings,
                questions,
                targetId: route.params.targetId
              });
            } else {
              navigation.navigate('BattleMatchmaking', {
                battleMode,
                language,
                examplesCount: selectedExamples,
                operation: selectedOperation,
                speed: selectedSpeed,
                digits: selectedDigits
              });
            }`;

content = content.replace(oldStartLogic, newStartLogic);

fs.writeFileSync(filePath, content, 'utf8');
console.log('BattleSettingsScreen updated successfully!');
