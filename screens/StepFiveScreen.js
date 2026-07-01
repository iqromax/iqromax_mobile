import React, { useState, Suspense, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Image, ImageBackground } from 'expo-image';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei/native';

// Preload 3D models for much faster rendering
useGLTF.preload(require('../assets/models/adult_male_optimized.glb'));
useGLTF.preload(require('../assets/models/athletic_man_optimized.glb'));
useGLTF.preload(require('../assets/models/mannequin_clothing_optimized.glb'));
useGLTF.preload(require('../assets/models/businessman_optimized.glb'));
useGLTF.preload(require('../assets/models/fashion_model_optimized.glb'));
useGLTF.preload(require('../assets/models/casual_outfit_optimized.glb'));
useGLTF.preload(require('../assets/models/stylized_girl_optimized.glb'));
useGLTF.preload(require('../assets/models/beige_trench_coat_optimized.glb'));

function CharacterModel({ onLoad, characterIndex }) {
  const models = {
    0: require('../assets/models/athletic_man_optimized.glb'),
    1: require('../assets/models/adult_male_optimized.glb'),
    2: require('../assets/models/mannequin_clothing_optimized.glb'),
    3: require('../assets/models/businessman_optimized.glb'),
    4: require('../assets/models/fashion_model_optimized.glb'),
    5: require('../assets/models/casual_outfit_optimized.glb'),
    6: require('../assets/models/stylized_girl_optimized.glb'),
    7: require('../assets/models/beige_trench_coat_optimized.glb')
  };
  
  const modelPath = models[characterIndex] || models[0];
  const { scene } = useGLTF(modelPath);
  
  React.useEffect(() => {
    if (scene) {
      onLoad();
    }
  }, [scene, onLoad, characterIndex]);
  
  // Personaj biroz tepaga ko'tarildi (-1 dan -0.5 ga) va kattalashtirildi (4.5 dan 5.2 ga)
  // Alex (index 0) uchun biroz pastroq joylashuv (masalan 0.6), Maks (index 1) uchun esa 2.0
  let positionY = 2.0;
  if (characterIndex === 0) positionY = 0.6;
  if (characterIndex === 2) positionY = 0.8; // Yangi personaj (David) uchun moslashtirish, sinov tariqasida 0.8
  if (characterIndex === 3) positionY = 0.7; // Yangi personaj (Kevin) uchun moslashtirish, yana biroz pastroq
  if (characterIndex === 4) positionY = 0.7; // Yangi qiz personaj (Lily) uchun
  if (characterIndex === 5) positionY = 0.7; // Yangi qiz personaj (Maya) uchun
  if (characterIndex === 6) positionY = 0.7; // Yangi qiz personaj (Emma) uchun
  if (characterIndex === 7) positionY = 0.7; // Yangi qiz personaj (Sophia) uchun

  return (
    <>
      <primitive 
        object={scene} 
        scale={5.2} 
        position={[0, positionY, 0]} 
        rotation={[0, -Math.PI / 2, 0]} 
      />
      <OrbitControls 
        enablePan={false} 
        enableZoom={false} 
        minPolarAngle={Math.PI / 2} 
        maxPolarAngle={Math.PI / 2} 
        rotateSpeed={2}
        target={[0, 1.1, 0]}
      />
    </>
  );
}

const T = {
  uz: {
    step: '4-QADAM',
    title: 'PERSONAJ TANLANG',
    boys: "O'G'IL BOLALAR",
    girls: 'QIZ BOLALAR',
    boysChars: ['Alex', 'Maks', 'David', 'Kevin'],
    girlsChars: ['Lily', 'Maya', 'Emma', 'Sophia'],
    selected: 'Tanlangan',
    next: 'KEYINGISI',
    loading: 'Personaj yuklanmoqda...',
  },
  en: {
    step: 'STEP 4',
    title: 'SELECT CHARACTER',
    boys: 'BOYS',
    girls: 'GIRLS',
    boysChars: ['Alex', 'Maks', 'David', 'Kevin'],
    girlsChars: ['Lily', 'Maya', 'Emma', 'Sophia'],
    selected: 'Selected',
    next: 'NEXT',
    loading: 'Loading character...',
  },
  ru: {
    step: 'ШАГ 4',
    title: 'ВЫБЕРИТЕ ПЕРСОНАЖА',
    boys: 'МАЛЬЧИКИ',
    girls: 'ДЕВОЧКИ',
    boysChars: ['Alex', 'Maks', 'David', 'Kevin'],
    girlsChars: ['Lily', 'Maya', 'Emma', 'Sophia'],
    selected: 'Выбрано',
    next: 'ДАЛЕЕ',
    loading: 'Загрузка персонажа...',
  },
  ar: {
    step: 'الخطوة 4',
    title: 'اختر الشخصية',
    boys: 'أولاد',
    girls: 'بنات',
    boysChars: ['Alex', 'Maks', 'David', 'Kevin'],
    girlsChars: ['Lily', 'Maya', 'Emma', 'Sophia'],
    selected: 'المحدد',
    next: 'التالي',
    loading: 'جاري تحميل الشخصية...',
  },
  tr: {
    step: 'ADIM 4',
    title: 'KARAKTER SEÇ',
    boys: 'ERKEKLER',
    girls: 'KIZLAR',
    boysChars: ['Alex', 'Maks', 'David', 'Kevin'],
    girlsChars: ['Lily', 'Maya', 'Emma', 'Sophia'],
    selected: 'Seçildi',
    next: 'İLERİ',
    loading: 'Karakter yükleniyor...',
  },
  zh: {
    step: '第4步',
    title: '选择角色',
    boys: '男孩',
    girls: '女孩',
    boysChars: ['Alex', 'Maks', 'David', 'Kevin'],
    girlsChars: ['Lily', 'Maya', 'Emma', 'Sophia'],
    selected: '已选',
    next: '下一步',
    loading: '角色加载中...',
  },
  ky: {
    step: '4-КАДАМ',
    title: 'ПЕРСОНАЖ ТАНДАҢЫЗ',
    boys: 'БАЛДАР',
    girls: 'КЫЗДАР',
    boysChars: ['Alex', 'Maks', 'David', 'Kevin'],
    girlsChars: ['Lily', 'Maya', 'Emma', 'Sophia'],
    selected: 'Тандалды',
    next: 'КИЙИНКИСИ',
    loading: 'Персонаж жүктөлүүдө...',
  },
  kk: {
    step: '4-ҚАДАМ',
    title: 'ПЕРСОНАЖ ТАҢДАҢЫЗ',
    boys: 'ҰЛДАР',
    girls: 'ҚЫЗДАР',
    boysChars: ['Alex', 'Maks', 'David', 'Kevin'],
    girlsChars: ['Lily', 'Maya', 'Emma', 'Sophia'],
    selected: 'Таңдалды',
    next: 'КЕЛЕСІ',
    loading: 'Персонаж жүктелуде...',
  },
  tg: {
    step: 'ҚАДАМИ 4',
    title: 'ПЕРСОНАЖРО ИНТИХОБ КУНЕД',
    boys: 'ПИСАРОН',
    girls: 'ДУХТАРОН',
    boysChars: ['Alex', 'Maks', 'David', 'Kevin'],
    girlsChars: ['Lily', 'Maya', 'Emma', 'Sophia'],
    selected: 'Интихоб шуд',
    next: 'БАЪДӢ',
    loading: 'Боргирии персонаж...',
  },
  ja: {
    step: 'ステップ 4',
    title: 'キャラクターを選択',
    boys: '男の子',
    girls: '女の子',
    boysChars: ['Alex', 'Maks', 'David', 'Kevin'],
    girlsChars: ['Lily', 'Maya', 'Emma', 'Sophia'],
    selected: '選択済み',
    next: '次へ',
    loading: 'キャラクターを読み込み中...',
  },
  ko: {
    step: '4단계',
    title: '캐릭터 선택',
    boys: '남자',
    girls: '여자',
    boysChars: ['Alex', 'Maks', 'David', 'Kevin'],
    girlsChars: ['Lily', 'Maya', 'Emma', 'Sophia'],
    selected: '선택됨',
    next: '다음',
    loading: '캐릭터 로딩 중...',
  },
};

export default function StepFiveScreen({ navigation, route }) {
  // Receive language from previous screen, default to uz
  const { language = 'uz' } = route.params || {};
  const t = T[language] || T['en'];
  const isFocused = useIsFocused();

  const [gender, setGender] = useState('boys');
  const [selectedChar, setSelectedChar] = useState(0);
  const [modelLoaded, setModelLoaded] = useState(false);

  const handlePrev = () => {
    if (gender === 'boys') {
      setSelectedChar(prev => (prev === 0 ? 3 : prev - 1));
    } else {
      setSelectedChar(prev => (prev === 4 ? 7 : prev - 1));
    }
    setModelLoaded(false);
  };

  const handleNext = () => {
    if (gender === 'boys') {
      setSelectedChar(prev => (prev === 3 ? 0 : prev + 1));
    } else {
      setSelectedChar(prev => (prev === 7 ? 4 : prev + 1));
    }
    setModelLoaded(false);
  };

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

      <View style={styles.content}>
        
        <Text style={styles.mainTitle}>{t.title}</Text>

        {/* Character Preview Area */}
        <View style={styles.previewContainer}>
          <Image source={require('../assets/character_bg.png')} style={styles.previewBg} resizeMode="cover" />

          <View style={styles.canvasContainer}>
            {isFocused && (
              <Canvas 
                style={{ flex: 1, backgroundColor: 'transparent' }}
                gl={{ preserveDrawingBuffer: true, alpha: true, antialias: true }}
              >
                <ambientLight intensity={1.5} color="#ffffff" />
                <hemisphereLight intensity={1} color="#ffffff" groundColor="#000000" />
                <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
                <directionalLight position={[-10, 10, -5]} intensity={0.5} color="#ffffff" />
                <Environment preset="city" />
                <Suspense fallback={null}>
                  <CharacterModel onLoad={() => setModelLoaded(true)} characterIndex={selectedChar} />
                </Suspense>
              </Canvas>
            )}
          </View>

          <TouchableOpacity style={styles.arrowLeft} activeOpacity={0.7} onPress={handlePrev}>
            <MaterialCommunityIcons name="chevron-left" size={32} color="#FFF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.arrowRight} activeOpacity={0.7} onPress={handleNext}>
            <MaterialCommunityIcons name="chevron-right" size={32} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Gender Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, gender === 'boys' && styles.tabButtonActive]}
            onPress={() => {
              setGender('boys');
              if (selectedChar >= 4) {
                setSelectedChar(0);
                setModelLoaded(false);
              }
            }}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="face-man-profile" size={22} color={gender === 'boys' ? '#FFF' : '#9CA3AF'} />
            <Text style={[styles.tabText, gender === 'boys' && styles.tabTextActive]}>{t.boys}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabButton, gender === 'girls' && styles.tabButtonActive]}
            onPress={() => {
              setGender('girls');
              if (selectedChar < 4) {
                setSelectedChar(4);
                setModelLoaded(false);
              }
            }}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="face-woman-profile" size={22} color={gender === 'girls' ? '#FFF' : '#9CA3AF'} />
            <Text style={[styles.tabText, gender === 'girls' && styles.tabTextActive]}>{t.girls}</Text>
          </TouchableOpacity>
        </View>

        {/* Character List */}
        <View style={styles.listWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
            {(gender === 'boys' ? t.boysChars : t.girlsChars).map((charName, i) => {
              const actualIndex = gender === 'boys' ? i : i + 4;
              const isSelected = selectedChar === actualIndex;
              // Placeholder colors matching design
              const colors = ['#A855F7', '#3B82F6', '#10B981', '#EAB308'];
              const bgCol = colors[i % colors.length];

              return (
                <TouchableOpacity 
                  key={actualIndex} 
                  style={styles.charItem}
                  onPress={() => {
                    if (selectedChar !== actualIndex) {
                      setModelLoaded(false);
                      setSelectedChar(actualIndex);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <View style={[styles.charAvatarWrapper, isSelected && styles.charAvatarWrapperSelected]}>
                    <View style={[styles.charAvatar, { backgroundColor: bgCol, overflow: 'hidden' }]}>
                      {actualIndex === 0 ? (
                        <Image source={require('../assets/avatar_alex.jpg')} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                      ) : actualIndex === 1 ? (
                        <Image source={require('../assets/avatar_maks.png')} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                      ) : actualIndex === 2 ? (
                        <Image source={require('../assets/avatar_david.jpg')} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                      ) : actualIndex === 3 ? (
                        <Image source={require('../assets/avatar_kevin.png')} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                      ) : actualIndex === 4 ? (
                        <Image source={require('../assets/avatar_lily.jpg')} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                      ) : actualIndex === 5 ? (
                        <Image source={require('../assets/avatar_maya.jpg')} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                      ) : actualIndex === 6 ? (
                        <Image source={require('../assets/avatar_emma.jpg')} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                      ) : actualIndex === 7 ? (
                        <Image source={require('../assets/avatar_sophia.png')} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                      ) : (
                        <Ionicons name="person" size={32} color="#FFF" />
                      )}
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

      </View>

      {/* Bottom Fixed Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate('StudentDashboard', { language, selectedChar, gender });
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
    paddingBottom: 80,
  },
  mainTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  previewContainer: {
    flex: 1,
    position: 'relative',
    width: '100%',
  },
  previewBg: {
    width: '100%',
    height: '100%',
    transform: [{ scale: 1.1 }, { translateY: 30 }],
  },
  canvasContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 6,
    backgroundColor: 'rgba(22, 10, 43, 0.5)',
  },
  loadingText: {
    color: '#FFF',
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
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
    zIndex: 10,
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
    zIndex: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 10,
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
