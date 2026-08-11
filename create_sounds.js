const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'assets', 'sounds');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// Tiny base64 WAV files
const tickBase64 = "UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="; // Just an empty wav header for now, actually let me use real short beeps.

// Instead of base64, let's use some reliable raw URLs that don't block curl/node:
const sounds = [
  { name: 'tick.mp3', url: 'https://raw.githubusercontent.com/diev/sound/master/tick.mp3' }, // Or let's use github actions sounds
  { name: 'correct.mp3', url: 'https://raw.githubusercontent.com/taniarascia/memory/master/assets/audio/match.mp3' },
  { name: 'wrong.mp3', url: 'https://raw.githubusercontent.com/taniarascia/memory/master/assets/audio/error.mp3' }
];

const https = require('https');
sounds.forEach(s => {
  const file = fs.createWriteStream(path.join(dir, s.name));
  https.get(s.url, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Downloaded', s.name);
    });
  }).on('error', err => {
    console.error('Error downloading', s.name, err);
  });
});
