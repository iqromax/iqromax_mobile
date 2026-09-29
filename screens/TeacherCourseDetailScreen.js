import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_URL } from '../src/config/api';

export default function TeacherCourseDetailScreen({ navigation }) {
  const [selectedModule, setSelectedModule] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await fetch(`${API_URL}/courses/modules`);
      const data = await res.json();
      
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
    } catch (error) {
      console.error('Fetch modules error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total lessons
  const totalLessons = modules.reduce((acc, mod) => acc + mod.content.length, 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050510" translucent={false} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Simple Navbar */}
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
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
              <Text style={styles.statValue}>{totalLessons} ta</Text>
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
        <TouchableOpacity activeOpacity={0.9} style={{ width: '100%' }} onPress={() => navigation.navigate('TeacherCourseLessons')}>
          <LinearGradient
            colors={['#8B5CF6', '#D946EF']}
            start={{x:0, y:0}} end={{x:1, y:0}}
            style={styles.startGradient}
          >
            <Text style={styles.startBtnText}>Boshlash - Bepul</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
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
  }
});
