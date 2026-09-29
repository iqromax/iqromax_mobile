import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, LayoutAnimation, Platform, UIManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const INITIAL_MODULES = [
  { 
    id: 1, 
    title: "1-Modul: Iqromax metodikasi",
    lessons: [
      { id: '1-1', type: 'video', title: "Iqromax tizimi nima?", duration: "15 daq", locked: false },
      { id: '1-2', type: 'video', title: "Tizimli yondashuv asoslari", duration: "20 daq", locked: false },
      { id: '1-3', type: 'test_theory', title: "Nazariy test (Asosiy qoidalar)", questions: "10 ta savol", locked: false, history: [] },
      { id: '1-4', type: 'video', title: "Dars o'tish texnikasi", duration: "15 daq", locked: false },
      { id: '1-5', type: 'video', title: "O'quvchilarni baholash usullari", duration: "10 daq", locked: false },
      { id: '1-6', type: 'test_practical', title: "Amaliy test (Keys yechish)", questions: "5 ta vazifa", locked: false, history: [] },
    ]
  },
  { 
    id: 2, 
    title: "2-Modul: Bolalar psixologiyasi",
    lessons: [
      { id: '2-1', type: 'video', title: "Yoshi va fe'l-atvoriga ko'ra yondashuv", duration: "20 daq", locked: true },
      { id: '2-2', type: 'video', title: "Diqqatni jamlash usullari", duration: "18 daq", locked: true },
      { id: '2-3', type: 'test_theory', title: "Psixologik holat bo'yicha test", questions: "12 ta savol", locked: true, history: [] },
      { id: '2-4', type: 'video', title: "Motivatsiya berish sirlari", duration: "25 daq", locked: true },
      { id: '2-5', type: 'test_practical', title: "Vaziyatni tahlil qilish", questions: "3 ta vazifa", locked: true, history: [] },
    ]
  },
  { 
    id: 3, 
    title: "3-Modul: Darsni tashkil qilish",
    lessons: [
      { id: '3-1', type: 'video', title: "Samarali dars strukturasi", duration: "25 daq", locked: true },
      { id: '3-2', type: 'video', title: "Dars rejasi namunasi", duration: "15 daq", locked: true },
      { id: '3-3', type: 'test_theory', title: "Rejalashtirish bo'yicha test", questions: "8 ta savol", locked: true, history: [] },
    ]
  },
  { 
    id: 4, 
    title: "4-Modul: Amaliy mashg'ulotlar",
    lessons: [
      { id: '4-1', type: 'video', title: "Real dars namunasi", duration: "45 daq", locked: true },
      { id: '4-2', type: 'video', title: "Xatolarni tahlil qilish", duration: "20 daq", locked: true },
      { id: '4-3', type: 'test_practical', title: "Amaliyot va xulosa", questions: "1 ta loyiha", locked: true, history: [] },
    ]
  },
  { 
    id: 5, 
    title: "5-Modul: Sertifikatlash",
    lessons: [
      { id: '5-1', type: 'test_practical', title: "Yakuniy imtihon", questions: "20 ta savol", locked: true, history: [] },
      { id: '5-2', type: 'certificate', title: "Sertifikatni yuklab olish", duration: "", locked: true },
    ]
  },
];

export default function TeacherCourseLessonsScreen({ navigation }) {
  const [modules, setModules] = useState(INITIAL_MODULES);
  // State 0 index is open by default
  const [expandedIndex, setExpandedIndex] = useState(0);

  const toggleDropdown = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getIconData = (type, locked) => {
    if (locked) return { name: "lock", color: "#6B7280", bg: "rgba(255,255,255,0.05)" };
    
    switch (type) {
      case 'video': return { name: "play", color: "#3B82F6", bg: "rgba(59, 130, 246, 0.15)" };
      case 'test_theory': return { name: "file-document-edit-outline", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.15)" };
      case 'test_practical': return { name: "laptop", color: "#10B981", bg: "rgba(16, 185, 129, 0.15)" };
      case 'certificate': return { name: "certificate", color: "#D946EF", bg: "rgba(217, 70, 239, 0.15)" };
      default: return { name: "play", color: "#3B82F6", bg: "rgba(59, 130, 246, 0.15)" };
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050510" translucent={false} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Navbar */}
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.navTitle}>Darslar</Text>
            <Text style={styles.navSubtitle}>O'qituvchilikka tayyorlov</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50, paddingTop: 10 }}>
          
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Sizning natijangiz</Text>
              <Text style={styles.progressPercent}>0%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <LinearGradient
                colors={['#8B5CF6', '#D946EF']}
                start={{x:0, y:0}} end={{x:1, y:0}}
                style={styles.progressBarFill}
              />
            </View>
            <Text style={styles.progressSub}>0 / 19 dars va testlar bajarildi</Text>
          </View>

          <View style={styles.modulesContainer}>
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
                        
                        if (lesson.history && lesson.history.length > 0) {
                          const lastScore = lesson.history[lesson.history.length - 1].score;
                          if (lastScore < 60) {
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
                                  navigation.navigate('TeacherCourseVideo');
                                } else if (lesson.type === 'test_theory') {
                                  navigation.navigate('TeacherCourseTheoryTest', {
                                    lessonId: lesson.id,
                                    history: lesson.history,
                                    onFinishTest: (result) => {
                                      const newModules = [...modules];
                                      const mIndex = newModules.findIndex(m => m.id === mod.id);
                                      const lIndex = newModules[mIndex].lessons.findIndex(l => l.id === lesson.id);
                                      newModules[mIndex].lessons[lIndex].history.push(result);
                                      setModules(newModules);
                                    }
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
});
