const fs = require('fs');
const b64 = fs.readFileSync('assets/sounds/traffic_light.mp3', {encoding: 'base64'});
let fileContent = fs.readFileSync('src/utils/soundData.js', 'utf8');
if (!fileContent.includes('traffic_light')) {
  fileContent = fileContent.replace('export const SOUND_DATA = {', `export const SOUND_DATA = {\n  traffic_light: 'data:audio/mp3;base64,${b64}',`);
  fs.writeFileSync('src/utils/soundData.js', fileContent);
}
