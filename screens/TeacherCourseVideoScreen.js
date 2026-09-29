import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function TeacherCourseVideoScreen({ navigation }) {
  const videoData = {
    title: "Iqromax tizimi nima? Asosiy qoidalar",
    description: "Ushbu video darslik orqali siz Iqromax tizimining asl mohiyati, o'qituvchi oldidagi vazifalar va asosiy qoidalar bilan batafsil tanishib chiqasiz. Diqqat bilan eshiting va kerakli joylarini yozib oling.",
    duration: "15:24",
    module: "1-Modul"
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" translucent={false} />
      
      {/* Minimalist Video Player */}
      <View style={styles.videoPlayer}>
        {/* Simple Header inside Video */}
        <View style={styles.videoHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Clean Play Button */}
        <TouchableOpacity style={styles.playBtn} activeOpacity={0.8}>
          <View style={styles.playCircle}>
            <MaterialCommunityIcons name="play" size={32} color="#FFF" style={{ marginLeft: 4 }} />
          </View>
        </TouchableOpacity>

        {/* Thin Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBg}>
            <View style={styles.progressFill} />
          </View>
        </View>
      </View>

      {/* Clean Content Area */}
      <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.contentBox}>
          <Text style={styles.titleText}>{videoData.title}</Text>
          <Text style={styles.metaText}>{videoData.module} • {videoData.duration}</Text>
          
          <Text style={styles.descText}>{videoData.description}</Text>

          {/* Simple Resources */}
          <Text style={styles.sectionTitle}>Materiallar</Text>
          <TouchableOpacity activeOpacity={0.7} style={styles.resourceRow}>
            <MaterialCommunityIcons name="file-pdf-box" size={24} color="#EF4444" />
            <Text style={styles.resourceTitle}>Dars taqdimoti.pdf</Text>
            <MaterialCommunityIcons name="download" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Simple Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navBtn}>
          <MaterialCommunityIcons name="chevron-left" size={20} color="#9CA3AF" />
          <Text style={styles.navBtnText}>Oldingi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtnNext}>
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
  playBtn: {
    alignItems: 'center',
    justifyContent: 'center',
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
