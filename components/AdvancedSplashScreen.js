import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

const videoSource = require('../assets/video/open.mp4');

export default function AdvancedSplashScreen({ isAppReady, onFinish }) {
  const hasFinishedRef = useRef(false);
  const [videoEnded, setVideoEnded] = useState(false);

  const triggerFinish = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    if (onFinish) onFinish();
  };

  const player = useVideoPlayer(videoSource, (p) => {
    p.loop = false;
    p.muted = false;
    p.play();
  });

  useEffect(() => {
    const playToEndSubscription = player.addListener('playToEnd', () => {
      setVideoEnded(true);
    });

    const statusSubscription = player.addListener('statusChange', ({ status, error }) => {
      if (status === 'error') {
        console.warn('Splash video playback error:', error);
        setVideoEnded(true);
      }
    });

    return () => {
      playToEndSubscription.remove();
      statusSubscription.remove();
    };
  }, [player]);

  useEffect(() => {
    if (videoEnded && isAppReady) {
      triggerFinish();
    }
  }, [videoEnded, isAppReady]);

  // Xavfsizlik uchun zaxira taymer (agar video yuklanmasa ilova qotib qolmasligi uchun)
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setVideoEnded(true);
    }, 10000);
    return () => clearTimeout(safetyTimer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" hidden={true} />
      <TouchableOpacity
        activeOpacity={1}
        style={StyleSheet.absoluteFillObject}
        onPress={() => setVideoEnded(true)}
      >
        <VideoView
          style={StyleSheet.absoluteFillObject}
          player={player}
          nativeControls={false}
          contentFit="cover"
          allowsFullscreen={false}
          allowsPictureInPicture={false}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
