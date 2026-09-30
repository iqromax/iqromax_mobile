import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, LayoutAnimation, Platform, UIManager, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';



import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../src/config/api';

const INITIAL_MODULES = [];

export default function TeacherCourseLessonsScreen({ navigation, route }) {
  const [modules, setModules] = useState(INITIAL_MODULES);
  const [completedIds, setCompletedIds] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [showToast, setShowToast] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (route.params?.showEnrollSuccess) {
      setShowToast(true);
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(2000),
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true })
      ]).start(() => {
        setShowToast(false);
        navigation.setParams({ showEnrollSuccess: undefined });
      });
    }
  }, [route.params?.showEnrollSuccess]);

  useFocusEffect(
    React.useCallback(() => {
      fetchModules();
    }, [route.params?.autoOpenNextFor])
  );

  React.useEffect(() => {

    const SOCKET_URL = API_URL.replace('/api', '');
    const socket = io(SOCKET_URL, {
      path: '/api/socket.io',
      transports: ['websocket']
    });

    socket.on('courses-updated', () => {
      console.log('Real-time update received: courses-updated');
      fetchModules();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchModules = async () => {
    try {
      const res = await fetch(`${API_URL}/courses/modules`);
      const data = await res.json();
      
      const userDataStr = await AsyncStorage.getItem('user_data');
      let userId = "unknown";
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        userId = userData.customId || userData.id || "unknown";
      }

      const savedCompleted = await AsyncStorage.getItem(`${userId}_teacher_course_completed`);
      let completedLessonIds = [];
      if (savedCompleted) {
        completedLessonIds = JSON.parse(savedCompleted);
      }

      let allLessonIds = [];
      
      const savedHistoryStr = await AsyncStorage.getItem(`${userId}_teacher_course_test_history`);
      const testHistoryObj = savedHistoryStr ? JSON.parse(savedHistoryStr) : {};
      
      const formatted = data.map((mod, index) => {
        let lessons = [];
        
        let items = [];
        if (mod.videos) items = items.concat(mod.videos.map(v => ({ ...v, itemType: 'video' })));
        if (mod.tests) items = items.concat(mod.tests.map(t => ({ ...t, itemType: 'test' })));
        if (mod.guides) items = items.concat(mod.guides.map(g => ({ ...g, itemType: 'guide' })));
        
        items.sort((a, b) => (a.order || 0) - (b.order || 0));
        
        items.forEach(item => {
          if (item.itemType === 'video') {
            const lId = `v-${item.id}`;
            lessons.push({
              id: lId,
              type: 'video',
              title: item.name,
              duration: item.duration || 'N/A',
              videoUrl: item.videoUrl,
              pdfUrl: item.pdfUrl,
              description: item.description,
              globalIndex: allLessonIds.length
            });
            allLessonIds.push(lId);
          } else if (item.itemType === 'test') {
            const lId = `t-${item.id}`;
            const isPractical = item.testType === 'practical';
            lessons.push({
              id: lId,
              testId: item.id,
              type: isPractical ? 'test_practical' : 'test_theory',
              title: item.title,
              questions: isPractical ? `${item.practicalCount || 7} ta misol` : (item.questions?.length || 0) + ' ta savol',
              duration: isPractical ? `${item.practicalOp}, ${item.practicalDigits} xonali` : undefined,
              history: testHistoryObj[item.id] || [],
              globalIndex: allLessonIds.length,
              practicalOp: item.practicalOp,
              practicalDigits: item.practicalDigits,
              practicalCount: item.practicalCount
            });
            allLessonIds.push(lId);
          } else if (item.itemType === 'guide') {
            const lId = `g-${item.id}`;
            lessons.push({
              id: lId,
              guideId: item.id,
              type: 'guide',
              title: item.title,
              content: item.content,
              duration: "Qo'llanma",
              globalIndex: allLessonIds.length
            });
            allLessonIds.push(lId);
          }
        });

        return {
          id: mod.id,
          title: `${index + 1}-Modul: ${mod.name}`,
          lessons
        };
      });

      formatted.forEach(mod => {
        mod.lessons.forEach(lesson => {
          if (lesson.globalIndex === 0) {
            lesson.locked = false;
          } else {
            const prevLessonId = allLessonIds[lesson.globalIndex - 1];
            lesson.locked = !completedLessonIds.includes(prevLessonId);
          }
        });
      });

      setModules(formatted);
      setCompletedIds(completedLessonIds);

      // Determine default expanded module
      let targetModuleIndex = 0;
      for (let i = 0; i < formatted.length; i++) {
        let hasUnlockedUncompleted = false;
        for (let j = 0; j < formatted[i].lessons.length; j++) {
          const lesson = formatted[i].lessons[j];
          let isCompleted = completedLessonIds.includes(lesson.id);
          if (!lesson.locked && !isCompleted) {
            hasUnlockedUncompleted = true;
            break;
          }
        }
        if (hasUnlockedUncompleted) {
          targetModuleIndex = i;
          break;
        } else if (i === formatted.length - 1) {
          targetModuleIndex = i;
        }
      }

      // Handle auto-open next
      if (route.params?.autoOpenNextFor) {
        const completedId = route.params.autoOpenNextFor;
        const currentIndex = allLessonIds.indexOf(completedId);
        if (currentIndex !== -1 && currentIndex + 1 < allLessonIds.length) {
          const nextId = allLessonIds[currentIndex + 1];
          // Find next lesson details
          let nextLesson = null;
          let moduleIndex = 0;
          for (let i = 0; i < formatted.length; i++) {
            const found = formatted[i].lessons.find(l => l.id === nextId);
            if (found) {
              nextLesson = found;
              moduleIndex = i;
              break;
            }
          }
          if (nextLesson) {
            // Expand the correct module
            setExpandedIndex(moduleIndex);
            
            // Clear the param so it doesn't loop
            navigation.setParams({ autoOpenNextFor: undefined });

            // Wait a bit so the user can see the green checkmark
            setTimeout(() => {
              if (nextLesson.type === 'video') {
                navigation.navigate('TeacherCourseVideo', {
                  lessonId: nextLesson.id,
                  title: nextLesson.title,
                  duration: nextLesson.duration,
                  description: nextLesson.description,
                  pdfUrl: nextLesson.pdfUrl,
                  videoUrl: nextLesson.videoUrl
                });
              } else if (nextLesson.type === 'test_theory') {
                navigation.navigate('TeacherCourseTheoryTest', {
                  lessonId: nextLesson.id,
                  testId: nextLesson.testId,
                  history: nextLesson.history
                });
              } else if (nextLesson.type === 'guide') {
                navigation.navigate('TeacherCourseGuide', {
                  lessonId: nextLesson.id,
                  guideId: nextLesson.guideId,
                  title: nextLesson.title,
                  content: nextLesson.content
                });
              }
            }, 1000);
          }
        }
      } else {
        setExpandedIndex(targetModuleIndex);
      }

    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleLessonComplete = async (lessonId) => {
    try {
      const userDataStr = await AsyncStorage.getItem('user_data');
      let userId = "unknown";
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        userId = userData.customId || userData.id || "unknown";
      }

      const savedCompleted = await AsyncStorage.getItem(`${userId}_teacher_course_completed`);
      let completedLessonIds = savedCompleted ? JSON.parse(savedCompleted) : [];
      if (!completedLessonIds.includes(lessonId)) {
        completedLessonIds.push(lessonId);
        await AsyncStorage.setItem(`${userId}_teacher_course_completed`, JSON.stringify(completedLessonIds));
        fetchModules();
      }
    } catch(err) {
      console.log('Error saving lesson progress:', err);
    }
  };

  const getIconData = (type, locked) => {
    if (locked) return { name: "lock", color: "#6B7280", bg: "rgba(255,255,255,0.05)" };
    
    switch (type) {
      case 'video': return { name: "play", color: "#3B82F6", bg: "rgba(59, 130, 246, 0.15)" };
      case 'test_theory': return { name: "file-document-edit-outline", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.15)" };
      case 'guide': return { name: "text-box-outline", color: "#EC4899", bg: "rgba(236, 72, 153, 0.15)" };
      case 'test_practical': return { name: "laptop", color: "#10B981", bg: "rgba(16, 185, 129, 0.15)" };
      case 'certificate': return { name: "certificate", color: "#D946EF", bg: "rgba(217, 70, 239, 0.15)" };
      default: return { name: "play", color: "#3B82F6", bg: "rgba(59, 130, 246, 0.15)" };
    }
  };

  let totalLessonsCount = 0;
  let completedLessonsCount = 0;

  modules.forEach(mod => {
    mod.lessons.forEach(lesson => {
      totalLessonsCount++;
      if ((lesson.type === 'video' || lesson.type === 'guide') && completedIds.includes(lesson.id)) {
        completedLessonsCount++;
      } else if ((lesson.type === 'test_theory' || lesson.type === 'test_practical') && lesson.history && lesson.history.length > 0) {
        const hasPassed = lesson.history.some(h => h.score >= 60);
        if (hasPassed) {
          completedLessonsCount++;
        }
      }
    });
  });

  const totalProgress = totalLessonsCount > 0 ? Math.min(100, Math.round((completedLessonsCount / totalLessonsCount) * 100)) : 0;

  React.useEffect(() => {
    if (modules.length > 0) {
      syncProgress(totalProgress);
    }
  }, [totalProgress, modules.length]);

  const syncProgress = async (progress) => {
    try {
      const userDataStr = await AsyncStorage.getItem('user_data');
      if (!userDataStr) return;
      const userData = JSON.parse(userDataStr);
      const userId = userData.customId || userData.id;
      if (!userId) return;

      await fetch(`${API_URL}/courses/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, progress })
      });
    } catch (e) {
      console.log('Sync progress error:', e);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050510" translucent={false} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Success Toast */}
        {showToast && (
          <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
            <MaterialCommunityIcons name="check-circle" size={24} color="#10B981" style={{ marginRight: 8 }} />
            <Text style={styles.toastText}>Siz kursga muvaffaqiyatli yozildingiz!</Text>
          </Animated.View>
        )}
        
        {/* Navbar */}
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('TeacherCourseDetail')}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.navTitle}>Darslar</Text>
            <Text style={styles.navSubtitle}>O'qituvchilikka tayyorlov</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50, paddingTop: 10 }}>
          
          <View style={styles.modulesContainer}>
            {loading && <Text style={{color: '#9CA3AF', textAlign: 'center', marginTop: 20}}>Yuklanmoqda...</Text>}
            {!loading && modules.length === 0 && <Text style={{color: '#9CA3AF', textAlign: 'center', marginTop: 20}}>Hali darslar qo'shilmagan</Text>}
            {modules.map((mod, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <View key={mod.id} style={styles.moduleCard}>
                  <TouchableOpacity 
                    activeOpacity={0.8}
                    style={[styles.moduleHeader, isExpanded && styles.moduleHeaderActive]}
                    onPress={() => toggleDropdown(index)}
                  >
                    <View style={styles.moduleHeaderLeft}>
                      <View style={[styles.moduleIconBox, isExpanded ? { backgroundColor: '#8B5CF6' } : {}]}>
                        <MaterialCommunityIcons name="folder-outline" size={20} color={isExpanded ? "#FFF" : "#A855F7"} />
                      </View>
                      <Text style={styles.moduleTitle}>{mod.title}</Text>
                    </View>
                    <MaterialCommunityIcons 
                      name={isExpanded ? "chevron-up" : "chevron-down"} 
                      size={24} 
                      color="#6B7280" 
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.moduleBody}>
                      {mod.lessons.map((lesson, idx) => {
                        let iconData = getIconData(lesson.type, lesson.locked);
                        let isFailed = false;
                        let isPassed = false;
                        const isCompleted = completedIds.includes(lesson.id);
                        
                        if (isCompleted && (lesson.type === 'video' || lesson.type === 'guide')) {
                          iconData = { name: "check-circle", color: "#10B981", bg: "rgba(16, 185, 129, 0.15)" };
                        }

                        if (lesson.history && lesson.history.length > 0) {
                          const hasPassed = lesson.history.some(h => h.score >= 60);
                          if (!hasPassed) {
                            isFailed = true;
                            iconData = { name: "close-circle", color: "#EF4444", bg: "rgba(239, 68, 68, 0.15)" };
                          } else {
                            isPassed = true;
                            iconData = { name: "check-circle", color: "#10B981", bg: "rgba(16, 185, 129, 0.15)" };
                          }
                        }

                        return (
                          <TouchableOpacity 
                            key={lesson.id} 
                            activeOpacity={lesson.locked ? 1 : 0.7}
                            onPress={() => {
                              if (!lesson.locked) {
                                if (lesson.type === 'video') {
                                  navigation.navigate('TeacherCourseVideo', {
                                    lessonId: lesson.id,
                                    title: lesson.title,
                                    duration: lesson.duration,
                                    description: lesson.description,
                                    pdfUrl: lesson.pdfUrl,
                                    videoUrl: lesson.videoUrl
                                  });
                                } else if (lesson.type === 'test_theory') {
                                  navigation.navigate('TeacherCourseTheoryTest', {
                                    lessonId: lesson.id,
                                    testId: lesson.testId,
                                    history: lesson.history
                                  });
                                } else if (lesson.type === 'guide') {
                                  navigation.navigate('TeacherCourseGuide', {
                                    lessonId: lesson.id,
                                    guideId: lesson.guideId,
                                    title: lesson.title,
                                    content: lesson.content
                                  });
                                } else if (lesson.type === 'test_practical') {
                                  navigation.navigate('TeacherCoursePracticalTest', {
                                    lessonId: lesson.id,
                                    testId: lesson.testId,
                                    history: lesson.history,
                                    practicalOp: lesson.practicalOp,
                                    practicalDigits: lesson.practicalDigits,
                                    practicalCount: lesson.practicalCount
                                  });
                                }
                              }
                            }}
                            style={[
                              styles.lessonItem, 
                              idx === mod.lessons.length - 1 && { borderBottomWidth: 0 },
                              isFailed && { backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: 12, paddingHorizontal: 12, marginVertical: 2, borderBottomWidth: 0 }
                            ]}
                          >
                            <View style={[styles.lessonIconBox, { backgroundColor: iconData.bg }]}>
                              <MaterialCommunityIcons name={iconData.name} size={18} color={iconData.color} />
                            </View>
                            <View style={styles.lessonInfo}>
                              <Text style={[
                                styles.lessonTitle, 
                                lesson.locked && { color: '#6B7280' },
                                isFailed && { color: '#EF4444' },
                                isPassed && { color: '#10B981' }
                              ]}>
                                {lesson.title}
                              </Text>
                              {lesson.type === 'video' && (
                                <View style={styles.lessonMeta}>
                                  <MaterialCommunityIcons name="clock-outline" size={12} color="#6B7280" />
                                  <Text style={styles.lessonDuration}>
                                    {lesson.duration}
                                  </Text>
                                </View>
                              )}
                              {(lesson.type === 'test_theory' || lesson.type === 'test_practical') && (
                                <View style={styles.lessonMeta}>
                                  <MaterialCommunityIcons name="help-circle-outline" size={12} color="#6B7280" />
                                  <Text style={styles.lessonDuration}>
                                    {lesson.questions} {lesson.duration ? `• ${lesson.duration}` : ''}
                                  </Text>
                                </View>
                              )}
                              {lesson.history && lesson.history.length > 0 && (
                                <View style={styles.lessonMeta}>
                                  <Text style={[styles.lessonDuration, { marginLeft: 0, color: isFailed ? '#F87171' : '#34D399' }]}>
                                    Oxirgi natija: {lesson.history[lesson.history.length - 1].score}%
                                  </Text>
                                </View>
                              )}
                            </View>
                            {!lesson.locked && (
                              <MaterialCommunityIcons name="chevron-right" size={20} color={isFailed ? "#EF4444" : "#374151"} />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
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
    fontFamily: 'Inter_700Bold',
  },
  navSubtitle: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  progressCard: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  progressTitle: {
    color: '#E5E7EB',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  progressPercent: {
    color: '#D946EF',
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    width: '0%', // 0 for now
    height: '100%',
    borderRadius: 3,
  },
  progressSub: {
    color: '#6B7280',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  modulesContainer: {
    paddingHorizontal: 20,
  },
  moduleCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  moduleHeaderActive: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  moduleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  moduleIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moduleTitle: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  moduleBody: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  lessonIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    color: '#E5E7EB',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonDuration: {
    color: '#6B7280',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    marginLeft: 4,
  },
  toastContainer: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: '#121223',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 999,
  },
  toastText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  }
});
