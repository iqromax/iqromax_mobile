import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, StatusBar, ScrollView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
  { code: 'uz', name: 'Uzbek', native: "O'zbekcha", flag: '🇺🇿' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
  { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳' },
  { code: 'ky', name: 'Kyrgyz', native: 'Кыргызча', flag: '🇰🇬' },
  { code: 'kk', name: 'Kazakh', native: 'Қазақша', flag: '🇰🇿' },
  { code: 'tg', name: 'Tajik', native: 'Тоҷикӣ', flag: '🇹🇯' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
];

const TRANSLATIONS = {
  en: { step: 'STEP 2', title: 'SELECT LANGUAGE', subtitle: 'Choose your preferred language for the application.', continue: 'CONTINUE' },
  ru: { step: 'ШАГ 2', title: 'ВЫБЕРИТЕ ЯЗЫК', subtitle: 'Выберите предпочитаемый язык для приложения.', continue: 'ПРОДОЛЖИТЬ' },
  uz: { step: '2-QADAM', title: 'TILNI TANLANG', subtitle: 'Ilova uchun afzal ko\'rgan tilingizni tanlang.', continue: 'DAVOM ETISH' },
  ar: { step: 'الخطوة 2', title: 'اختر اللغة', subtitle: 'اختر لغتك المفضلة للتطبيق.', continue: 'استمر' },
  tr: { step: 'ADIM 2', title: 'DİL SEÇİN', subtitle: 'Uygulama için tercih ettiğiniz dili seçin.', continue: 'DEVAM ET' },
  zh: { step: '第2步', title: '选择语言', subtitle: '为应用程序选择您的首选语言。', continue: '继续' },
  ky: { step: '2-КАДАМ', title: 'ТИЛДИ ТАНДАҢЫЗ', subtitle: 'Колдонмо үчүн каалаган тилиңизди тандаңыз.', continue: 'УЛАНТУУ' },
  kk: { step: '2-ҚАДАМ', title: 'ТІЛДІ ТАҢДАҢЫЗ', subtitle: 'Қолданба үшін қалаған тіліңізді таңдаңыз.', continue: 'ЖАЛҒАСТЫРУ' },
  tg: { step: 'ҚАДАМИ 2', title: 'ЗАБОНРО ИНТИХОБ КУНЕД', subtitle: 'Забони дилхоҳи худро барои барнома интихоб кунед.', continue: 'ИДОМА ДОДАН' },
  ja: { step: 'ステップ 2', title: '言語を選択', subtitle: 'アプリケーションの優先言語を選択してください。', continue: '続く' },
  ko: { step: '2단계', title: '언어 선택', subtitle: '애플리케이션에 사용할 언어를 선택하십시오.', continue: '계속하기' },
};

const LOCALIZED_LANGUAGES = {
  en: { en: "English", ru: "Russian", uz: "Uzbek", ar: "Arabic", tr: "Turkish", zh: "Chinese", ky: "Kyrgyz", kk: "Kazakh", tg: "Tajik", ja: "Japanese", ko: "Korean" },
  ru: { en: "Английский", ru: "Русский", uz: "Узбекский", ar: "Арабский", tr: "Турецкий", zh: "Китайский", ky: "Киргизский", kk: "Казахский", tg: "Таджикский", ja: "Японский", ko: "Корейский" },
  uz: { en: "Ingliz tili", ru: "Rus tili", uz: "O'zbek tili", ar: "Arab tili", tr: "Turk tili", zh: "Xitoy tili", ky: "Qirg'iz tili", kk: "Qozoq tili", tg: "Tojik tili", ja: "Yapon tili", ko: "Koreys tili" },
  ar: { en: "الإنجليزية", ru: "الروسية", uz: "الأوزبكية", ar: "العربية", tr: "التركية", zh: "الصينية", ky: "القرغيزية", kk: "الكازاخستانية", tg: "الطاجيكية", ja: "اليابانية", ko: "الكورية" },
  tr: { en: "İngilizce", ru: "Rusça", uz: "Özbekçe", ar: "Arapça", tr: "Türkçe", zh: "Çince", ky: "Kırgızca", kk: "Kazakça", tg: "Tacikçe", ja: "Japonca", ko: "Korece" },
  zh: { en: "英语", ru: "俄语", uz: "乌兹别克语", ar: "阿拉伯语", tr: "土耳其语", zh: "中文", ky: "吉尔吉斯语", kk: "哈萨克语", tg: "塔吉克语", ja: "日语", ko: "韩语" },
  ky: { en: "Англис тили", ru: "Орус тили", uz: "Өзбек тили", ar: "Араб тили", tr: "Түрк тили", zh: "Кытай тили", ky: "Кыргыз тили", kk: "Казак тили", tg: "Тажик тили", ja: "Жапон тили", ko: "Корей тили" },
  kk: { en: "Ағылшын тілі", ru: "Орыс тілі", uz: "Өзбек тілі", ar: "Араб тілі", tr: "Түрік тілі", zh: "Қытай тілі", ky: "Қырғыз тілі", kk: "Қазақ тілі", tg: "Тәжік тілі", ja: "Жапон тілі", ko: "Корей тілі" },
  tg: { en: "Англисӣ", ru: "Русӣ", uz: "Ӯзбекӣ", ar: "Арабӣ", tr: "Туркӣ", zh: "Хитоӣ", ky: "Қирғизӣ", kk: "Қазоқӣ", tg: "Тоҷикӣ", ja: "Ҷопонӣ", ko: "Кореягӣ" },
  ja: { en: "英語", ru: "ロシア語", uz: "ウズベク語", ar: "アラビア語", tr: "トルコ語", zh: "中国語", ky: "キルギス語", kk: "カザフ語", tg: "タジク語", ja: "日本語", ko: "韓国語" },
  ko: { en: "영어", ru: "러시아어", uz: "우즈베크어", ar: "아랍어", tr: "튀르키예어", zh: "중국어", ky: "키르기스어", kk: "카자흐어", tg: "타지크어", ja: "일본어", ko: "한국어" },
};

export default function StepTwoScreen({ navigation, route }) {
  const [selectedLanguage, setSelectedLanguage] = useState('uz');
  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS['en'];
  const localizedNames = LOCALIZED_LANGUAGES[selectedLanguage] || LOCALIZED_LANGUAGES['en'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05050C" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.stepText}>{t.step}</Text>
          <View style={styles.pagination}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroContainer}>
          <Image 
            source={require('../assets/language_hero.jpg')} 
            style={styles.heroImage} 
            contentFit="contain" 
            transition={200}
          />
        </View>

        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>

        <View style={styles.languagesContainer}>
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <TouchableOpacity 
                key={lang.code}
                style={[styles.languageItem, isSelected && styles.languageItemSelected]}
                onPress={() => setSelectedLanguage(lang.code)}
                activeOpacity={0.7}
              >
                <View style={styles.languageInfo}>
                  <Text style={styles.flag}>{lang.flag}</Text>
                  <View style={styles.languageTextContainer}>
                    <Text style={styles.languageName}>{localizedNames[lang.code]}</Text>
                    <Text style={styles.languageEnglishName}>{lang.native}</Text>
                  </View>
                </View>
                
                {isSelected ? (
                  <View style={styles.radioSelected}>
                    <MaterialCommunityIcons name="check" size={16} color="#FFF" />
                  </View>
                ) : (
                  <View style={styles.radioUnselected} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[styles.button, !selectedLanguage && styles.buttonDisabled]} 
          activeOpacity={0.8}
          disabled={!selectedLanguage}
          onPress={() => {
            requestAnimationFrame(() => {
              navigation.navigate('StepThree', { 
                ...route.params,
                language: selectedLanguage 
              });
            });
          }}
        >
          <Text style={styles.buttonText}>{t.continue}</Text>
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
    paddingVertical: Platform.OS === 'android' ? 5 : 15,
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
  scrollContent: {
    paddingHorizontal: 20,
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: 320,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#888899',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  languagesContainer: {
    gap: 16,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A0A16',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  languageItemSelected: {
    borderColor: '#A855F7',
    backgroundColor: '#120A20',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 32,
    marginRight: 20,
  },
  languageTextContainer: {
    flex: 1,
  },
  languageName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  languageEnglishName: {
    color: '#888899',
    fontSize: 14,
  },
  radioUnselected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333344',
  },
  radioSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#A855F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
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
  buttonDisabled: {
    backgroundColor: '#555540',
    opacity: 0.7,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 4,
  },
});
