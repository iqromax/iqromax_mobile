const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'screens/BattleGameScreen.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Import Image from react-native (it is already imported from expo-image, wait!)
// Actually React Native's Image is usually imported, let's see.
// In BattleGameScreen.js: import { ImageBackground, Image } from 'expo-image';
// expo-image doesn't have resolveAssetSource. We need react-native's Image!
// Let's import RNImage.
if (!content.includes('import { Image as RNImage } from \\'react-native\\';')) {
  content = content.replace(
    "import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, Modal, StatusBar, Animated, DeviceEventEmitter } from 'react-native';",
    "import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, Modal, StatusBar, Animated, DeviceEventEmitter, Image as RNImage } from 'react-native';"
  );
}

// 2. Replace the WebView HTML source to use resolveAssetSource
const oldWebView = /<WebView[\\s\\S]*?\\/>/;
const newWebView = `<WebView
              originWhitelist={['*']}
              source={{ html: \`
                <!DOCTYPE html>
                <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                  <style>
                    html, body { width: 100%; height: 100%; margin: 0; padding: 0; background-color: transparent; overflow: hidden; display: flex; justify-content: center; align-items: center; }
                    video { width: 100%; height: 100%; object-fit: cover; }
                  </style>
                </head>
                <body>
                  <video id="v" autoplay playsinline muted>
                    <source src="\${RNImage.resolveAssetSource(require('../assets/svetafor.mp4')).uri}" type="video/mp4" />
                  </video>
                  <script>
                    var vid = document.getElementById("v");
                    vid.onended = function() {
                      window.ReactNativeWebView.postMessage("finished");
                    };
                    vid.onerror = function() {
                      window.ReactNativeWebView.postMessage("finished");
                    };
                    // Ensure it plays
                    setTimeout(() => { vid.play().catch(e => console.log(e)); }, 100);
                  </script>
                </body>
                </html>
              \`}}
              style={{ flex: 1, backgroundColor: 'transparent' }}
              javaScriptEnabled={true}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              onMessage={(event) => {
                if (event.nativeEvent.data === 'finished') {
                   playSound('tick', sequence[0]?.op || '+');
                   setPhase('flashing');
                   setQuestionStartTime(Date.now());
                }
              }}
            />`;

content = content.replace(oldWebView, newWebView);

fs.writeFileSync(filePath, content, 'utf8');
console.log('BattleGameScreen updated to use RNImage.resolveAssetSource successfully!');
