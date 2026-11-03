import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, StatusBar, Dimensions, Pressable } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

const videoSource = require('../assets/video/open.mp4');

export default function AdvancedSplashScreen({ isAppReady, onFinish }) {
  const hasFinishedRef = useRef(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [screenDim, setScreenDim] = useState(() => Dimensions.get('screen'));

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

  // Screen o'lchami o'zgarganda (masalan dinamik oriyentatsiya yoki status bar) yangilash
  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ screen }) => {
      setScreenDim(screen);
    });
    return () => sub?.remove();
  }, []);

  // Video boshlanishini kafolatlash
  useEffect(() => {
    try {
      if (player && !player.playing) {
        player.play();
      }
    } catch (e) {}
  }, [player]);

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

  // Xavfsizlik zaxira taymeri: agar video yuklanmasa ilova qotib qolmasligi uchun
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setVideoEnded(true);
    }, 10000);
    return () => clearTimeout(safetyTimer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <VideoView
        style={[
          styles.video,
          {
            width: screenDim.width,
            height: screenDim.height,
          },
        ]}
        player={player}
        nativeControls={false}
        contentFit="cover"
        allowsFullscreen={false}
        allowsPictureInPicture={false}
      />
      {/* Ekranga bosilganda videoni o'tkazib yuborish imkoniyati (overlay) */}
      <Pressable
        style={StyleSheet.absoluteFillObject}
        onPress={() => setVideoEnded(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    width: '100%',
    height: '100%',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
  },
});
