const fs = require('fs');
const path = '/home/iam_masharipov/Desktop/iqromax_mobile/screens/StudentDashboardScreen.js';
let content = fs.readFileSync(path, 'utf8');
const keys = [
  'searchPlaceholder', 'stats', 'statRating', 'statSpeed', 'statAccuracy', 
  'statStreak', 'statExercises', 'statAchievements', 'statXP', 'statCoin', 
  'achievementsTitle', 'seeAll', 'achvGeneric', 'achvGeneric', 'achv14Days', 
  'achvTop10', 'achvGold3', 'achvGeneric', 'achvGeneric', 'achvGeneric', 
  'achvGeneric', 'achvGeneric', 'achvGeneric', 'achvGeneric', 'activityTitle', 
  'activitySeeAll', 'actSimple', 'actToday', 'actBattle', 'actToday', 
  'actWin', 'actFast', 'actToday', 'actAbacus', 'actYesterday', 
  'collectionTitle', 'collAvatars', 'collFrames', 'collBgs', 'collChars', 'collBtn'
];
let i = 0;
content = content.replace(/\{t\.\}/g, () => `{t.${keys[i++]}}`);
fs.writeFileSync(path, content);
console.log(`Replaced ${i} occurrences.`);
