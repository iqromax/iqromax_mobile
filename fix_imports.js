const fs = require('fs');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace 'Image, ' or 'ImageBackground, ' inside react-native import
  content = content.replace(/Image,\s*/g, '');
  content = content.replace(/ImageBackground,\s*/g, '');
  
  // If react-native import now has a trailing comma, it's fine, but let's clean it just in case
  // Or just leave it as it will just be parsed correctly. 
  
  // Also handle if they are at the end: `, Image }` -> ` }`
  content = content.replace(/,\s*Image\s*}/g, ' }');
  content = content.replace(/,\s*ImageBackground\s*}/g, ' }');
  content = content.replace(/{\s*Image\s*,\s*/g, '{ ');
  content = content.replace(/{\s*ImageBackground\s*,\s*/g, '{ ');

  // Add expo-image import after react-native import
  if (!content.includes('from \'expo-image\'')) {
    content = content.replace(/(import .* from 'react-native';)/, "$1\nimport { Image, ImageBackground } from 'expo-image';");
  }

  fs.writeFileSync(filePath, content);
  console.log('Updated ' + filePath);
}

updateFile('./screens/StudentDashboardScreen.js');
updateFile('./screens/StepFiveScreen.js');
