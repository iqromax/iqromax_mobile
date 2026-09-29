import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, LayoutAnimation, Platform, UIManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TeacherCourseDetailScreen({ navigation }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleDropdown = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

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

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
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
              <Text style={styles.statValue}>15 ta</Text>
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
            
            {[
              { 
                num: 1, 
                title: "Iqromax metodikasi asoslari",
                content: [
                  { type: 'video', label: "Iqromax tizimi nima? (15 daq)" },
                  { type: 'file-document', label: "O'qituvchi uchun qo'llanma (PDF)" },
                  { type: 'clipboard-check', label: "Asosiy qoidalar bo'yicha test" }
                ]
              },
              { 
                num: 2, 
                title: "Bolalar psixologiyasi",
                content: [
                  { type: 'video', label: "Yoshi va fe'l-atvoriga ko'ra yondashuv (20 daq)" },
                  { type: 'video', label: "Diqqatni jamlash usullari (18 daq)" },
                  { type: 'clipboard-check', label: "Psixologik keyslar yechimi" }
                ]
              },
              { 
                num: 3, 
                title: "Darsni tashkil qilish sirlari",
                content: [
                  { type: 'video', label: "Samarali dars strukturasi (25 daq)" },
                  { type: 'file-document', label: "Dars rejasi namunasi" }
                ]
              },
              { 
                num: 4, 
                title: "Amaliy mashg'ulotlar",
                content: [
                  { type: 'video', label: "Real dars namunasi (45 daq)" },
                  { type: 'account-supervisor', label: "O'quvchilar xatolarini tahlil qilish" }
                ]
              },
            ].map((item, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <View key={index}>
                  <TouchableOpacity 
                    style={[styles.moduleItem, isExpanded && { borderBottomWidth: 0, paddingBottom: 8 }]} 
                    activeOpacity={0.7}
                    onPress={() => toggleDropdown(index)}
                  >
                    <View style={styles.moduleNumBox}>
                      <Text style={styles.moduleNum}>{item.num}</Text>
                    </View>
                    <Text style={styles.moduleTitle}>{item.title}</Text>
                    <MaterialCommunityIcons 
                      name={isExpanded ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#6B7280" 
                    />
                  </TouchableOpacity>
                  
                  {isExpanded && (
                    <TouchableOpacity activeOpacity={1} style={styles.dropdownContent}>
                      {item.content.map((child, i) => (
                        <View key={i} style={styles.dropdownRow}>
                          <MaterialCommunityIcons name={child.type} size={16} color="#A855F7" />
                          <Text style={styles.dropdownText}>{child.label}</Text>
                        </View>
                      ))}
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Clean Floating Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity activeOpacity={0.9} style={{ width: '100%' }}>
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
  dropdownContent: {
    paddingLeft: 40,
    paddingRight: 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dropdownText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginLeft: 8,
  },
});
