import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const NEXT_TRANSLATIONS = {
  en: 'NEXT',
  ru: 'ДАЛЕЕ',
  uz: 'KEYINGISI',
  ar: 'التالي',
  tr: 'İLERİ',
  zh: '下一步',
  ky: 'КИЙИНКИСИ',
  kk: 'КЕЛЕСІ',
  tg: 'БАЪДӢ',
  ja: '次へ',
  ko: '다음',
};

export default function StepFiveScreen({ navigation, route }) {
  // Receive language from previous screen, default to uz
  const { language = 'uz' } = route.params || {};
  const buttonText = NEXT_TRANSLATIONS[language] || NEXT_TRANSLATIONS['en'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05050C" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.stepText}>STEP 5</Text>
          <View style={styles.pagination}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Empty for now, as requested */}
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate('StudentDashboard', { language });
          }}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
          <MaterialCommunityIcons name="chevron-right" size={28} color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05050C',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    zIndex: 10,
    padding: 5,
  },
  headerCenter: {
    alignItems: 'center',
  },
  stepText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: 1,
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333344',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#A855F7',
  },
  content: {
    flex: 1,
    // Empty area for future character selection
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#05050C',
    borderTopWidth: 1,
    borderTopColor: '#1A1A2E',
  },
  button: {
    backgroundColor: '#FACC15',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 4,
  },
});
