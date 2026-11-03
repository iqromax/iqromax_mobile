import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Haptics from 'expo-haptics';
import { getClanTranslations } from '../src/utils/clanTranslations';
import {
  IQROMAX_CLAN_BASE64,
  CLAN_IQROMAX_BASE64,
} from '../src/utils/clanVideosBase64';

const { width, height } = Dimensions.get('window');

export default function ClanTransitionScreen({ route, navigation }) {
  const { type = 'toClan', target, params } = route?.params || {};
  const language = params?.language || params?.user?.language || 'uz';
  const t = getClanTranslations(language);
  const isToClan = type === 'toClan';
  const finishedRef = useRef(false);
  const [videoEnded, setVideoEnded] = useState(false);

  const videoBase64 = isToClan ? IQROMAX_CLAN_BASE64 : CLAN_IQROMAX_BASE64;
  const expectedDurationMs = 10200;

  const triggerHaptic = (style = 'medium') => {
    try {
      if (style === 'light') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (e) {}
  };

  const finishTransition = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setVideoEnded(true);

    triggerHaptic('light');

    if (isToClan) {
      navigation.replace(target || 'ClanHomeScreen', params || {});
    } else {
      navigation.replace(target || 'StudentDashboard', params || {});
    }
  };

  useEffect(() => {
    // Safety fallback timer if onended is delayed or platform blocks postMessage
    const timer = setTimeout(() => {
      finishTransition();
    }, expectedDurationMs + 800);

    return () => clearTimeout(timer);
  }, []);

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      background: #000000;
    }
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #000000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    video {
      width: 100vw;
      height: 100vh;
      object-fit: cover;
      background: #000000;
    }
  </style>
</head>
<body>
  <video
    id="transitionVideo"
    playsinline
    webkit-playsinline
    autoplay
    preload="auto"
    src="data:video/mp4;base64,${videoBase64}"
  ></video>

  <script>
    const video = document.getElementById('transitionVideo');

    function notifyFinished() {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage('ENDED');
      }
    }

    // Try playing unmuted, if autoplay restrictions block unmuted, play muted
    video.play().catch(function() {
      video.muted = true;
      video.play().catch(function() {
        notifyFinished();
      });
    });

    video.onended = function() {
      notifyFinished();
    };

    video.onerror = function() {
      notifyFinished();
    };
  </script>
</body>
</html>
  `;

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      <WebView
        source={{ html: htmlContent }}
        originWhitelist={['*']}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        onMessage={(event) => {
          if (event.nativeEvent.data === 'ENDED') {
            finishTransition();
          }
        }}
        onError={() => finishTransition()}
        style={styles.webView}
      />

      {/* Discrete Skip Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.skipButton}
        onPress={() => {
          triggerHaptic('light');
          finishTransition();
        }}
      >
        <Text style={styles.skipText}>{t.portalSkip}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    width,
    height,
  },
  webView: {
    flex: 1,
    backgroundColor: '#000000',
  },
  skipButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 48 : 28,
    right: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 99,
  },
  skipText: {
    color: '#DDD6FE',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
});

