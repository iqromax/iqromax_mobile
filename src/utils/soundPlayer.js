import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { SOUND_DATA } from './soundData';

const listeners = new Set();

export const triggerSound = (name, options = {}) => {
  listeners.forEach((listener) => {
    try {
      listener(name, options);
    } catch (e) {}
  });
};

export function SoundPlayerBridge() {
  const webViewRef = useRef(null);

  useEffect(() => {
    const handleTrigger = (name, options = {}) => {
      if (webViewRef.current) {
        const rate = options.rate || 1.0;
        const js = `window.playSound('${name}', ${rate}); true;`;
        webViewRef.current.injectJavaScript(js);
      }
    };

    listeners.add(handleTrigger);
    return () => {
      listeners.delete(handleTrigger);
    };
  }, []);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="background:transparent;margin:0;padding:0;">
      <script>
        let audioCtx = null;
        const soundBuffers = {};
        const base64Sounds = {
          traffic_light: '${SOUND_DATA.traffic_light}',
          tick: '${SOUND_DATA.tick}',
          correct: '${SOUND_DATA.correct}',
          wrong: '${SOUND_DATA.wrong}'
        };

        function initAudio() {
          try {
            if (!audioCtx) {
              const AudioContext = window.AudioContext || window.webkitAudioContext;
              if (AudioContext) {
                audioCtx = new AudioContext();
              }
            }
            if (audioCtx && audioCtx.state === 'suspended') {
              audioCtx.resume();
            }
          } catch(e) {}
        }

        Object.keys(base64Sounds).forEach(function(key) {
          try {
            fetch(base64Sounds[key])
              .then(function(r) { return r.arrayBuffer(); })
              .then(function(buf) {
                initAudio();
                if (audioCtx) {
                  audioCtx.decodeAudioData(buf, function(decoded) {
                    soundBuffers[key] = decoded;
                  });
                }
              })
              .catch(function(err) {});
          } catch(e) {}
        });

        window.playSound = function(name, rate) {
          try {
            initAudio();
            const buffer = soundBuffers[name];
            // Only use AudioContext if it is ACTUALLY running. If suspended, fallback to new Audio()
            if (buffer && audioCtx && audioCtx.state === 'running') {
              const source = audioCtx.createBufferSource();
              source.buffer = buffer;
              source.playbackRate.value = rate || 1.0;
              source.connect(audioCtx.destination);
              source.start(0);
              return;
            }

            // Fallback for iOS when AudioContext is suspended due to lack of touch
            const base64 = base64Sounds[name];
            if (base64) {
              const a = new Audio(base64);
              a.playbackRate = rate || 1.0;
              a.play().catch(function(e) {});
            }
          } catch (e) {}
        };

        document.addEventListener('touchstart', initAudio, { once: true });
        document.addEventListener('click', initAudio, { once: true });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container} pointerEvents="none">
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
    overflow: 'hidden',
  },
  webview: {
    width: 1,
    height: 1,
    opacity: 0,
  },
});
