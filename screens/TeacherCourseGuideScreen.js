import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RenderHtml from 'react-native-render-html';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function TeacherCourseGuideScreen({ route, navigation }) {
  const { width } = useWindowDimensions();
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollViewRef = useRef(null);
  
  const lessonId = route?.params?.lessonId;
  const title = route?.params?.title || "Qo'llanma";
  const content = route?.params?.content || "";

  const handleScroll = (event) => {
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;

    // Check if scrolled to bottom with 20px threshold
    if (layoutHeight + contentOffsetY >= contentHeight - 20) {
      if (!hasScrolledToBottom) {
        setHasScrolledToBottom(true);
      }
    }
  };

  const handleComplete = async () => {
    if (!hasScrolledToBottom) return;

    if (lessonId) {
      try {
        const userDataStr = await AsyncStorage.getItem('user_data');
        let userId = "unknown";
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          userId = userData.customId || userData.id || "unknown";
        }

        const saved = await AsyncStorage.getItem(`${userId}_teacher_course_completed`);
        let completedLessonIds = saved ? JSON.parse(saved) : [];
        if (!completedLessonIds.includes(lessonId)) {
          completedLessonIds.push(lessonId);
          await AsyncStorage.setItem(`${userId}_teacher_course_completed`, JSON.stringify(completedLessonIds));
        }
      } catch (e) {
        console.log('Error saving guide complete:', e);
      }
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050510" translucent={false} />
      
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
          <View style={{width: 40}} />
        </View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.contentContainer} 
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        >
          <View style={styles.card}>
            <RenderHtml
              contentWidth={width - 80}
              source={{ html: content }}
              tagsStyles={tagsStyles}
              baseStyle={{ color: '#E0E7FF' }}
            />
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity 
            activeOpacity={0.9} 
            style={{ width: '100%' }}
            onPress={handleComplete}
            disabled={!hasScrolledToBottom}
          >
            <LinearGradient
              colors={hasScrolledToBottom ? ['#EC4899', '#D946EF'] : ['#374151', '#374151']}
              start={{x:0, y:0}} end={{x:1, y:0}}
              style={[styles.completeBtn, !hasScrolledToBottom && { opacity: 0.5 }]}
            >
              <MaterialCommunityIcons 
                name={hasScrolledToBottom ? "check-all" : "lock"} 
                size={20} 
                color={hasScrolledToBottom ? "#FFF" : "#9CA3AF"} 
                style={{ marginRight: 8 }} 
              />
              <Text style={[styles.completeBtnText, !hasScrolledToBottom && { color: '#9CA3AF' }]}>
                {hasScrolledToBottom ? "Tugatish va qaytish" : "Tugatish uchun oxirigacha o'qing"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const tagsStyles = {
  p: { color: '#E0E7FF', fontSize: 16, lineHeight: 24, marginBottom: 15 },
  h1: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 15, marginTop: 10 },
  h2: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 15, marginTop: 10 },
  h3: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 10, marginTop: 10 },
  strong: { color: '#FFF', fontWeight: 'bold' },
  em: { fontStyle: 'italic', color: '#A5B4FC' },
  ul: { color: '#E0E7FF', marginBottom: 15 },
  ol: { color: '#E0E7FF', marginBottom: 15 },
  li: { color: '#E0E7FF', fontSize: 16, lineHeight: 24, marginBottom: 5 },
  a: { color: '#EC4899', textDecorationLine: 'none' },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050510',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    backgroundColor: '#0C0C18'
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleBox: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: '#121223',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1A1A2F',
  },
  bottomBar: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    backgroundColor: '#0C0C18',
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
  },
  completeBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  }
});
