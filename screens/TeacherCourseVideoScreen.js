import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Linking, useWindowDimensions, Platform } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import YoutubePlayer from 'react-native-youtube-iframe';
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

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

  const playerRef = useRef(null);
  const supposedCurrentTime = useRef(0);

  useEffect(() => {
    let interval = null;
    if (isPlaying && ytId) {
      interval = setInterval(async () => {
        if (playerRef.current) {
          try {
            const currentTime = await playerRef.current.getCurrentTime();
            const duration = await playerRef.current.getDuration();
            
            if (duration > 0) {
              setProgress(currentTime / duration);
            }
            
            const delta = currentTime - supposedCurrentTime.current;
            if (delta > 1.5) {
              playerRef.current.seekTo(supposedCurrentTime.current);
            } else if (delta < -1.5) {
              supposedCurrentTime.current = currentTime;
            } else {
              supposedCurrentTime.current = currentTime;
            }
          } catch (e) {}
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, ytId]);

  useEffect(() => {
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
    };
  }, []);

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

  const onStateChange = (state) => {
    if (state === 'playing') {
      setIsPlaying(true);
    } else if (state === 'paused') {
      setIsPlaying(false);
    } else if (state === 'ended') {
      setIsFinished(true);
      setIsPlaying(false);
      setProgress(1);
      saveProgress();
    }
  };

  const handleNextLesson = () => {
    navigation.navigate({
      name: 'TeacherCourseLessons',
      params: { autoOpenNextFor: lessonId },
      merge: true,
    });
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleFullscreen = async () => {
    try {
      if (isFullscreen) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        setIsFullscreen(false);
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
        setIsFullscreen(true);
      }
    } catch (error) {
      setIsFullscreen(!isFullscreen);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" hidden={isFullscreen} translucent={false} />
      
      {/* Real Video Player */}
      <View style={[
        styles.videoPlayer, 
        isFullscreen && { height: screenHeight, width: screenWidth, zIndex: 999 },
        !isFullscreen && Platform.OS === 'ios' && { marginTop: 48 }
      ]}>
        {ytId ? (
          <View style={StyleSheet.absoluteFill}>
            <YoutubePlayer
              ref={playerRef}
              height={isFullscreen ? screenHeight : 240}
              play={isPlaying}
              videoId={ytId}
              onChangeState={onStateChange}
              webViewStyle={{ opacity: 0.99 }}
              webViewProps={{
                androidLayerType: 'hardware',
                allowsInlineMediaPlayback: true,
                mediaPlaybackRequiresUserAction: false,
              }}
              forceAndroidAutoplay={true}
              initialPlayerParams={{
                controls: false,
                preventFullScreen: true,
                showClosedCaptions: false,
                rel: false,
                modestbranding: true,
                showinfo: false,
              }}
            />
          </View>
        ) : (
          <Text style={{ color: '#6B7280' }}>Video topilmadi</Text>
        )}

        {/* Header Overlay */}
        <View style={styles.videoHeader} pointerEvents="box-none">
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Top and Bottom Touch Blockers for YouTube UI */}
        <TouchableOpacity style={styles.topBlocker} activeOpacity={1} />
        <TouchableOpacity style={styles.bottomBlocker} activeOpacity={1} />

        {/* Fullscreen Button */}
        {ytId && (
          <TouchableOpacity style={styles.fullscreenBtn} onPress={toggleFullscreen}>
            <MaterialCommunityIcons name={isFullscreen ? "fullscreen-exit" : "fullscreen"} size={24} color="#FFF" />
          </TouchableOpacity>
        )}

        {/* Unseekable Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
      </View>

      {/* Clean Content Area */}
      {!isFullscreen && (
        <>
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
        </>
      )}
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
    backgroundColor: '#000',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  videoHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: 'row',
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBlocker: {
    position: 'absolute',
    top: 0,
    left: 0, 
    right: 0,
    height: 80, // Covers channel name and share button entirely
    backgroundColor: 'rgba(0,0,0,0.01)',
    zIndex: 5,
  },
  bottomBlocker: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0, 
    height: 100, // Covers YouTube logo and related video thumbnail
    backgroundColor: 'rgba(0,0,0,0.01)',
    zIndex: 5,
  },
  fullscreenBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    zIndex: 10,
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
