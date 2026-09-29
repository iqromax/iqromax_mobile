import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../src/config/api';

export default function TeacherCourseVideoScreen({ route, navigation }) {
  const { lessonId, title, description, duration, pdfUrl, videoUrl } = route?.params || {};

  const videoData = {
    title: title || "Video topilmadi",
    description: description || "Ushbu video uchun tafsif kiritilmagan.",
    duration: duration || "",
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const extractYoutubeId = (url) => {
    if (!url) return null;
    const srcMatch = url.match(/src=["'](.*?)["']/);
    const targetStr = srcMatch ? srcMatch[1] : url;

    const regExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = targetStr.match(regExp);
    
    if (match && match[1].length === 11) {
      return match[1];
    }
    
    if (url.trim().length === 11) {
      return url.trim();
    }
    
    return url;
  };
  const ytId = extractYoutubeId(videoUrl);
  const fullPdfUrl = pdfUrl ? `${API_URL}${pdfUrl}` : null;

  const webviewRef = useRef(null);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        body, html { margin: 0; padding: 0; background: #000; width: 100%; height: 100%; overflow: hidden; display: flex; justify-content: center; align-items: center; }
        iframe { width: 100% !important; height: 100% !important; border: none; }
        #player { width: 100%; height: 100%; }
      </style>
    </head>
    <body>
      <div id="player"></div>
      <script>
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        var player;
        var supposedCurrentTime = 0;

        function onYouTubeIframeAPIReady() {
          player = new YT.Player('player', {
            height: '100%',
            width: '100%',
            videoId: '${ytId}',
            playerVars: {
              'playsinline': 1,
              'controls': 0,
              'disablekb': 1,
              'fs': 0,
              'rel': 0,
              'modestbranding': 1,
              'showinfo': 0,
              'iv_load_policy': 3
            },
            events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange
            }
          });
        }

        function onPlayerReady(event) {
           window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
        }

        function onPlayerStateChange(event) {
          if (event.data == YT.PlayerState.PLAYING) {
             window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'play' }));
          } else if (event.data == YT.PlayerState.PAUSED) {
             window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'pause' }));
          } else if (event.data == YT.PlayerState.ENDED) {
             window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ended' }));
          }
        }

        window.toggleVideo = function() {
          if(player && player.getPlayerState) {
            var state = player.getPlayerState();
            if(state === YT.PlayerState.PLAYING) {
              player.pauseVideo();
            } else {
              player.playVideo();
            }
          }
        };

        setInterval(function() {
          if (player && player.getCurrentTime) {
            var currentTime = player.getCurrentTime();
            var duration = player.getDuration();
            if (duration > 0) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'progress', progress: currentTime / duration }));
            }
            
            if (player.getPlayerState && player.getPlayerState() !== YT.PlayerState.PLAYING) return;
            
            var delta = currentTime - supposedCurrentTime;
            if (delta > 1.5) {
              player.seekTo(supposedCurrentTime);
            } else if (delta < -1.5) {
              supposedCurrentTime = currentTime; 
            } else {
              supposedCurrentTime = currentTime;
            }
          }
        }, 1000);
      </script>
    </body>
    </html>
  `;

  const saveProgress = async () => {
    try {
      if (lessonId) {
        const savedCompleted = await AsyncStorage.getItem('teacher_course_completed');
        let completedLessonIds = savedCompleted ? JSON.parse(savedCompleted) : [];
        if (!completedLessonIds.includes(lessonId)) {
          completedLessonIds.push(lessonId);
          await AsyncStorage.setItem('teacher_course_completed', JSON.stringify(completedLessonIds));
        }
      }
    } catch (e) {
      console.log('Error saving progress', e);
    }
  };

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'progress') {
        setProgress(data.progress);
      } else if (data.type === 'ended') {
        setIsFinished(true);
        setIsPlaying(false);
        setProgress(1);
        saveProgress();
      } else if (data.type === 'play') {
        setIsPlaying(true);
      } else if (data.type === 'pause') {
        setIsPlaying(false);
      }
    } catch (e) {}
  };

  const handleNextLesson = () => {
    navigation.goBack();
  };

  const togglePlayPause = () => {
    if (webviewRef.current) {
      webviewRef.current.injectJavaScript('window.toggleVideo(); true;');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" translucent={false} />
      
      {/* Real Video Player */}
      <View style={styles.videoPlayer}>
        {ytId ? (
          <WebView
            ref={webviewRef}
            source={{ html: htmlContent, baseUrl: 'https://iqromax.net' }}
            style={{ flex: 1, backgroundColor: '#000', opacity: 0.99 }}
            androidLayerType="hardware"
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            scrollEnabled={false}
            bounces={false}
            javaScriptEnabled={true}
            originWhitelist={['*']}
            mixedContentMode="always"
            onMessage={handleMessage}
          />
        ) : (
          <Text style={{ color: '#6B7280' }}>Video topilmadi</Text>
        )}

        {/* Header Overlay */}
        <View style={styles.videoHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Play/Pause Button Overlay */}
        <TouchableOpacity style={styles.playBtnOverlay} activeOpacity={1} onPress={togglePlayPause}>
          {!isPlaying && ytId && (
            <View style={styles.playCircle}>
              <MaterialCommunityIcons 
                name={isFinished ? "replay" : "play"} 
                size={32} 
                color="#FFF" 
                style={!isFinished ? { marginLeft: 4 } : {}} 
              />
            </View>
          )}
        </TouchableOpacity>

        {/* Unseekable Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Clean Content Area */}
      <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.contentBox}>
          <Text style={styles.titleText}>{videoData.title}</Text>
          {!!videoData.duration && <Text style={styles.metaText}>{videoData.duration}</Text>}
          
          <Text style={styles.descText}>{videoData.description}</Text>

          {/* Simple Resources */}
          {!!pdfUrl && (
            <>
              <Text style={styles.sectionTitle}>Materiallar</Text>
              <TouchableOpacity 
                activeOpacity={0.7} 
                style={styles.resourceRow}
                onPress={() => Linking.openURL(fullPdfUrl)}
              >
                <MaterialCommunityIcons name="file-pdf-box" size={24} color="#EF4444" />
                <Text style={styles.resourceTitle}>Dars materialini ko'rish</Text>
                <MaterialCommunityIcons name="download" size={20} color="#6B7280" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      {/* Simple Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navBtn}>
          <MaterialCommunityIcons name="chevron-left" size={20} color="#9CA3AF" />
          <Text style={styles.navBtnText}>Oldingi</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navBtnNext, !isFinished && { opacity: 0.5 }]} 
          disabled={!isFinished}
          onPress={handleNextLesson}
        >
          <LinearGradient
            colors={['#8B5CF6', '#D946EF']}
            start={{x:0, y:0}} end={{x:1, y:0}}
            style={styles.navGradient}
          >
            <Text style={styles.navBtnTextNext}>Keyingi dars</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050510',
  },
  videoPlayer: {
    width: '100%',
    height: 240,
    backgroundColor: '#111',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: 'row',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtnOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  playCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  progressBg: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: '100%',
  },
  progressFill: {
    width: '35%',
    height: '100%',
    backgroundColor: '#D946EF',
  },
  contentScroll: {
    flex: 1,
  },
  contentBox: {
    padding: 24,
  },
  titleText: {
    color: '#FFF',
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    lineHeight: 30,
    marginBottom: 8,
  },
  metaText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    marginBottom: 24,
  },
  descText: {
    color: '#D1D5DB',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 16,
  },
  resourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  resourceTitle: {
    flex: 1,
    color: '#E5E7EB',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    marginLeft: 12,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 24,
    backgroundColor: '#050510',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  navBtnText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    marginLeft: 4,
  },
  navBtnNext: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  navGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  navBtnTextNext: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginRight: 4,
  },
});
