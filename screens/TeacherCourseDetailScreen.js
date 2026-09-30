import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Modal, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../src/config/api';

export default function TeacherCourseDetailScreen({ navigation }) {
  const [selectedModule, setSelectedModule] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const [completedCount, setCompletedCount] = useState(0);
  const [totalLessonsCount, setTotalLessonsCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      fetchModules();
    }, [])
  );

  const fetchModules = async () => {
    try {
      const res = await fetch(`${API_URL}/courses/modules`);
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse JSON. Response text was:', text.substring(0, 500));
        throw e;
      }
      
      // Format to UI structure
      const formatted = data.map((mod, index) => {
        let content = [];
        
        // Add videos
        if (mod.videos) {
          mod.videos.forEach(v => {
            content.push({ type: 'video', label: `${v.name} ${v.duration ? '('+v.duration+')' : ''}` });
            if (v.pdfUrl) {
              content.push({ type: 'file-document', label: `${v.name} uchun material (PDF)` });
            }
          });
        }
        
        // Add tests
        if (mod.tests) {
          mod.tests.forEach(t => {
            content.push({ type: 'clipboard-check', label: t.title });
          });
        }

        return {
          id: mod.id,
          num: index + 1,
          title: mod.name,
          content
        };
      });

      setModules(formatted);
      
      const userDataStr = await AsyncStorage.getItem('user_data');
      let userId = "unknown";
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        userId = userData.customId || userData.id || "unknown";
      }

      const savedCompleted = await AsyncStorage.getItem(`${userId}_teacher_course_completed`);
      let completedLessonIds = savedCompleted ? JSON.parse(savedCompleted) : [];

      const savedHistoryStr = await AsyncStorage.getItem(`${userId}_teacher_course_test_history`);
      const testHistoryObj = savedHistoryStr ? JSON.parse(savedHistoryStr) : {};
      
      let count = 0;
      let total = 0;
      data.forEach(mod => {
        if (mod.videos) {
          mod.videos.forEach(v => {
            total++;
            if (completedLessonIds.includes(`v-${v.id}`)) count++;
          });
        }
        if (mod.guides) {
          mod.guides.forEach(g => {
            total++;
            if (completedLessonIds.includes(`g-${g.id}`)) count++;
          });
        }
        if (mod.tests) {
          mod.tests.forEach(t => {
            total++;
            const history = testHistoryObj[t.id] || [];
            if (history && history.length > 0) {
              const hasPassed = history.some(h => h.score >= 60);
              if (hasPassed) count++;
            }
          });
        }
      });
      setCompletedCount(count);
      setTotalLessonsCount(total);

      const enrolled = await AsyncStorage.getItem(`${userId}_teacher_course_enrolled`);
      if (enrolled === 'true') {
        setIsEnrolled(true);
      }

    } catch (error) {
      console.error('Fetch modules error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('user_data');
      let userId = "unknown";
      let userName = "Unknown";
      
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        userId = userData.customId || userData.id || "unknown";
        userName = userData.name || "Unknown";
      }

      await AsyncStorage.setItem(`${userId}_teacher_course_enrolled`, 'true');
      setIsEnrolled(true);

      // Send enrollment to backend without blocking navigation
      fetch(`${API_URL}/courses/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, name: userName })
      }).catch(err => console.log('Enroll API error:', err));

      navigation.navigate('TeacherCourseLessons', { showEnrollSuccess: true });
    } catch (e) {
      console.log('Enroll error:', e);
    }
  };

  // Calculate progress using synced values
  const progressPercent = totalLessonsCount > 0 ? Math.min(100, Math.round((completedCount / totalLessonsCount) * 100)) : 0;
  // hasStarted is now based on enrollment
  const hasStarted = isEnrolled;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050510" translucent={false} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Simple Navbar */}
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('TeacherDashboard')}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Kurs haqida</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView nestedScrollEnabled style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Main Hero Card */}
          <LinearGradient
            colors={['#1E1B4B', '#2E1065', '#4C1D95']}
            start={{x:0, y:0}} end={{x:1, y:1}}
            style={styles.heroCard}
          >
            <View style={styles.badge}>
              <MaterialCommunityIcons name="star-face" size={14} color="#FFF" />
              <Text style={styles.badgeText}>Yangi Imkoniyat</Text>
            </View>
            <Text style={styles.heroTitle}>O'qituvchilikka</Text>
            <Text style={styles.heroTitleHighlight}>tayyorlov kursi</Text>
            <Text style={styles.heroSubtitle}>
              O'qitish metodlari va psixologiya bo'yicha maxsus darslar.
            </Text>
          </LinearGradient>

          {/* Core Info */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="clock-outline" size={22} color="#A855F7" style={{ marginBottom: 4 }} />
              <Text style={styles.statValue}>{totalLessonsCount} ta</Text>
              <Text style={styles.statLabel}>Dars</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="account-group" size={22} color="#3B82F6" style={{ marginBottom: 4 }} />
              <Text style={styles.statValue}>Yuzlab</Text>
              <Text style={styles.statLabel}>O'qituvchilar</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="certificate" size={22} color="#10B981" style={{ marginBottom: 4 }} />
              <Text style={styles.statValue}>Sertifikat</Text>
              <Text style={styles.statLabel}>Mavjud</Text>
            </View>
          </View>

          {/* Simple Syllabus */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Kurs dasturi</Text>
            
            <ScrollView style={{ maxHeight: 300 }} nestedScrollEnabled showsVerticalScrollIndicator={false}>
              {loading ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <ActivityIndicator color="#A855F7" />
                </View>
              ) : modules.length === 0 ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ color: '#9CA3AF' }}>Hali modullar qo'shilmagan</Text>
                </View>
              ) : (
                modules.map((item, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={styles.moduleItem} 
                    activeOpacity={0.7}
                    onPress={() => setSelectedModule(item)}
                  >
                    <View style={styles.moduleNumBox}>
                      <Text style={styles.moduleNum}>{item.num}</Text>
                    </View>
                    <Text style={styles.moduleTitle}>{item.title}</Text>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#6B7280" />
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Clean Floating Button */}
      <View style={styles.bottomBar}>
        {hasStarted ? (
          <View style={styles.progressFooter}>
            <View style={styles.progressInfoRow}>
              <Text style={styles.progressLabel}>Darslar holati</Text>
              <Text style={styles.progressValue}>{progressPercent}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
            <TouchableOpacity activeOpacity={0.9} style={{ width: '100%', marginTop: 16 }} onPress={() => navigation.navigate('TeacherCourseLessons')}>
              <LinearGradient
                colors={['#8B5CF6', '#D946EF']}
                start={{x:0, y:0}} end={{x:1, y:0}}
                style={styles.startGradient}
              >
                <Text style={styles.startBtnText}>Davom etish</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity activeOpacity={0.9} style={{ width: '100%' }} onPress={handleEnroll}>
            <LinearGradient
              colors={['#8B5CF6', '#D946EF']}
              start={{x:0, y:0}} end={{x:1, y:0}}
              style={styles.startGradient}
            >
              <Text style={styles.startBtnText}>Boshlash - Bepul</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {/* Module Content Modal */}
      <Modal visible={!!selectedModule} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSelectedModule(null)}>
          <TouchableOpacity activeOpacity={1} style={styles.modalCard}>
            {selectedModule && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalNumBox}>
                    <Text style={styles.modalNumText}>{selectedModule.num}</Text>
                  </View>
                  <Text style={styles.modalTitle}>{selectedModule.title}</Text>
                  <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setSelectedModule(null)}>
                    <MaterialCommunityIcons name="close" size={22} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                  <Text style={styles.modalSectionTitle}>Ushbu bo'limdagi darslar:</Text>
                  {selectedModule.content.map((child, i) => (
                    <TouchableOpacity activeOpacity={1} key={i} style={styles.modalLessonRow}>
                      <View style={styles.modalIconCircle}>
                        <MaterialCommunityIcons name={child.type} size={18} color="#D946EF" />
                      </View>
                      <Text style={styles.modalLessonText}>{child.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050510',
  },
  safeArea: {
    flex: 1,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  scrollView: {
    flex: 1,
  },
  heroCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    marginTop: 10,
    marginBottom: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 16,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 26,
    fontFamily: 'Inter_900Black',
    lineHeight: 32,
  },
  heroTitleHighlight: {
    color: '#D946EF',
    fontSize: 26,
    fontFamily: 'Inter_900Black',
    lineHeight: 32,
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#C4B5FD',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    marginBottom: 2,
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  sectionBox: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    padding: 20,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    marginBottom: 16,
  },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  moduleNumBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moduleNum: {
    color: '#D946EF',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  moduleTitle: {
    flex: 1,
    color: '#E5E7EB',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 24,
    backgroundColor: '#050510',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  startGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  startBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#121228',
    borderRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 24,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalNumBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(217, 70, 239, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalNumText: {
    color: '#D946EF',
    fontSize: 14,
    fontFamily: 'Inter_800ExtraBold',
  },
  modalTitle: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScroll: {
    marginTop: 10,
  },
  modalSectionTitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginBottom: 16,
  },
  modalLessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.02)',
  },
  modalIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(217, 70, 239, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalLessonText: {
    flex: 1,
    color: '#E5E7EB',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  progressFooter: {
    width: '100%',
  },
  progressInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    color: '#9CA3AF',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  progressValue: {
    color: '#10B981',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  }
});
