import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, Platform, Image, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const T = {
  uz: {
    step: '4-QADAM',
    title: 'PERSONAJ TANLANG',
    boys: "O'G'IL BOLALAR",
    girls: 'QIZ BOLALAR',
    chars: ['IQ Kid', 'Cyber Boy', 'Tech Genius', 'Sporty Boy'],
    selected: 'Tanlangan',
    next: 'KEYINGISI',
  },
  en: {
    step: 'STEP 4',
    title: 'SELECT CHARACTER',
    boys: 'BOYS',
    girls: 'GIRLS',
    chars: ['IQ Kid', 'Cyber Boy', 'Tech Genius', 'Sporty Boy'],
    selected: 'Selected',
    next: 'NEXT',
  },
  ru: {
    step: 'ШАГ 4',
    title: 'ВЫБЕРИТЕ ПЕРСОНАЖА',
    boys: 'МАЛЬЧИКИ',
    girls: 'ДЕВОЧКИ',
    chars: ['IQ Kid', 'Cyber Boy', 'Tech Genius', 'Sporty Boy'],
    selected: 'Выбрано',
    next: 'ДАЛЕЕ',
  },
  ar: {
    step: 'الخطوة 4',
    title: 'اختر الشخصية',
    boys: 'أولاد',
    girls: 'بنات',
    chars: ['IQ Kid', 'Cyber Boy', 'Tech Genius', 'Sporty Boy'],
    selected: 'المحدد',
    next: 'التالي',
  },
  tr: {
    step: 'ADIM 4',
    title: 'KARAKTER SEÇ',
    boys: 'ERKEKLER',
    girls: 'KIZLAR',
    chars: ['IQ Kid', 'Cyber Boy', 'Tech Genius', 'Sporty Boy'],
    selected: 'Seçildi',
    next: 'İLERİ',
  },
  zh: {
    step: '第4步',
    title: '选择角色',
    boys: '男孩',
    girls: '女孩',
    chars: ['IQ Kid', 'Cyber Boy', 'Tech Genius', 'Sporty Boy'],
    selected: '已选',
    next: '下一步',
  },
  ky: {
    step: '4-КАДАМ',
    title: 'ПЕРСОНАЖ ТАНДАҢЫЗ',
    boys: 'БАЛДАР',
    girls: 'КЫЗДАР',
    chars: ['IQ Kid', 'Cyber Boy', 'Tech Genius', 'Sporty Boy'],
    selected: 'Тандалды',
    next: 'КИЙИНКИСИ',
  },
  kk: {
    step: '4-ҚАДАМ',
    title: 'ПЕРСОНАЖ ТАҢДАҢЫЗ',
    boys: 'ҰЛДАР',
    girls: 'ҚЫЗДАР',
    chars: ['IQ Kid', 'Cyber Boy', 'Tech Genius', 'Sporty Boy'],
    selected: 'Таңдалды',
    next: 'КЕЛЕСІ',
  },
  tg: {
    step: 'ҚАДАМИ 4',
    title: 'ПЕРСОНАЖРО ИНТИХОБ КУНЕД',
    boys: 'ПИСАРОН',
    girls: 'ДУХТАРОН',
    chars: ['IQ Kid', 'Cyber Boy', 'Tech Genius', 'Sporty Boy'],
    selected: 'Интихоб шуд',
    next: 'БАЪДӢ',
  },
  ja: {
    step: 'ステップ 4',
    title: 'キャラクターを選択',
    boys: '男の子',
    girls: '女の子',
    chars: ['IQ Kid', 'Cyber Boy', 'Tech Genius', 'Sporty Boy'],
    selected: '選択済み',
    next: '次へ',
  },
  ko: {
    step: '4단계',
    title: '캐릭터 선택',
    boys: '남자',
    girls: '여자',
    chars: ['IQ Kid', 'Cyber Boy', 'Tech Genius', 'Sporty Boy'],
    selected: '선택됨',
    next: '다음',
  },
};

export default function StepFiveScreen({ navigation, route }) {
  // Receive language from previous screen, default to uz
  const { language = 'uz' } = route.params || {};
  const t = T[language] || T['en'];

  const [gender, setGender] = useState('boys');
  const [selectedChar, setSelectedChar] = useState(0);

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
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        <Text style={styles.mainTitle}>{t.title}</Text>

        {/* Character Preview Area */}
        <View style={styles.previewContainer}>
          <Image source={require('../assets/character_bg.png')} style={styles.previewBg} resizeMode="cover" />
          
          <TouchableOpacity style={styles.arrowLeft} activeOpacity={0.7}>
            <MaterialCommunityIcons name="chevron-left" size={32} color="#FFF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.arrowRight} activeOpacity={0.7}>
            <MaterialCommunityIcons name="chevron-right" size={32} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Gender Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, gender === 'boys' && styles.tabButtonActive]}
            onPress={() => setGender('boys')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="face-man-profile" size={22} color={gender === 'boys' ? '#FFF' : '#9CA3AF'} />
            <Text style={[styles.tabText, gender === 'boys' && styles.tabTextActive]}>{t.boys}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabButton, gender === 'girls' && styles.tabButtonActive]}
            onPress={() => setGender('girls')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="face-woman-profile" size={22} color={gender === 'girls' ? '#FFF' : '#9CA3AF'} />
            <Text style={[styles.tabText, gender === 'girls' && styles.tabTextActive]}>{t.girls}</Text>
          </TouchableOpacity>
        </View>

        {/* Character List */}
        <View style={styles.listWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
            {t.chars.map((charName, index) => {
              const isSelected = selectedChar === index;
              // Placeholder colors matching design
              const colors = ['#A855F7', '#3B82F6', '#10B981', '#EAB308'];
              const bgCol = colors[index % colors.length];

              return (
                <TouchableOpacity 
                  key={index} 
                  style={styles.charItem}
                  onPress={() => setSelectedChar(index)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.charAvatarWrapper, isSelected && styles.charAvatarWrapperSelected]}>
                    <View style={[styles.charAvatar, { backgroundColor: bgCol }]}>
                      <Ionicons name="person" size={32} color="#FFF" />
                    </View>
                    {isSelected && (
                      <View style={styles.checkBadge}>
                        <MaterialCommunityIcons name="check" size={14} color="#FFF" />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.charName, isSelected && styles.charNameSelected]} numberOfLines={1}>{charName}</Text>
                  {isSelected ? (
                    <Text style={styles.charSelectedText}>{t.selected}</Text>
                  ) : (
                    <Text style={styles.charEmptyText}> </Text>
                  )}
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

      </ScrollView>

      {/* Bottom Fixed Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate('StudentDashboard', { language });
          }}
        >
          <Text style={styles.buttonText}>{t.next}</Text>
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
  },
  mainTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  previewContainer: {
    marginHorizontal: 20,
    height: 380,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#160a2b',
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  previewBg: {
    width: '100%',
    height: '100%',
  },
  arrowLeft: {
    position: 'absolute',
    left: 15,
    top: '45%',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(22, 10, 43, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A855F7',
  },
  arrowRight: {
    position: 'absolute',
    right: 15,
    top: '45%',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(22, 10, 43, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A855F7',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1A1A2E',
    backgroundColor: '#0A0A14',
    gap: 8,
  },
  tabButtonActive: {
    borderColor: '#A855F7',
    backgroundColor: '#160a2b',
  },
  tabText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: '#FFF',
  },
  listWrapper: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#1A1A2E',
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 15,
    backgroundColor: '#0A0A14',
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 20,
  },
  charItem: {
    alignItems: 'center',
    width: 72,
  },
  charAvatarWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 3,
    marginBottom: 8,
    position: 'relative',
  },
  charAvatarWrapperSelected: {
    borderColor: '#A855F7',
  },
  charAvatar: {
    flex: 1,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#A855F7',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#05050C',
  },
  charName: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
  charNameSelected: {
    fontWeight: 'bold',
  },
  charSelectedText: {
    color: '#A855F7',
    fontSize: 10,
    marginTop: 2,
  },
  charEmptyText: {
    fontSize: 10,
    marginTop: 2,
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
