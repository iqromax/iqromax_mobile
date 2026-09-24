import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, ImageBackground, ActivityIndicator, Platform, Modal, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import { Character3DViewer } from '../components/Character3DViewer';

import { SOCKET_URL, API_URL } from '../src/config/api';

const { width, height } = Dimensions.get('window');

const TRANSLATIONS = {
  uz: { title: "Battle", subtitle: "Amaliy hisobda kuchingni sinab ko'r!", waiting: "Raqib kutilmoqda...", searching: "Mos raqib qidirilmoqda", cancel: "Bekor qilish", tipTitle: "Maslahat:", tipText: "Battle'da tez va aniq javob berish g'alaba uchun muhim!", timeoutTitle: "Ogohlantirish", timeoutMsg: "Online raqiblar topilmayapti. Qayta chiqib urinib ko'ring yoki Do'st bilan battle orqali do'stlaringiz bilan o'ynang.", you: "Siz" },
  ru: { title: "Битва", subtitle: "Проверьте свои силы в вычислениях!", waiting: "Ожидание противника...", searching: "Поиск подходящего противника", cancel: "Отмена", tipTitle: "Совет:", tipText: "В битве важны скорость и точность!", timeoutTitle: "Предупреждение", timeoutMsg: "Онлайн противники не найдены. Попробуйте еще раз или сыграйте с друзьями.", you: "Вы" },
  en: { title: "Battle", subtitle: "Test your calculation skills!", waiting: "Waiting for opponent...", searching: "Searching for match", cancel: "Cancel", tipTitle: "Tip:", tipText: "Speed and accuracy are key to winning a battle!", timeoutTitle: "Warning", timeoutMsg: "No online opponents found. Try again later or play with friends.", you: "You" }
};

export default function BattleMatchmakingScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { language = 'uz', examplesCount = 10, operation = 'oddiy', speed = 1, digits = 1, battleMode = 'oddiy', myCharPath, myEquippedSkins, dynamicCharacters = [] } = route.params || {};
  const t = TRANSLATIONS[language] || TRANSLATIONS['uz'];

  
  const [userData, setUserData] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const [localExamplesCount, setLocalExamplesCount] = useState(examplesCount);
  const [localOperation, setLocalOperation] = useState(operation);
  const [localSpeed, setLocalSpeed] = useState(speed);
  const [localDigits, setLocalDigits] = useState(digits);
  const [isExamplesPickerOpen, setIsExamplesPickerOpen] = useState(false);
  const [isSpeedPickerOpen, setIsSpeedPickerOpen] = useState(false);
  const [isDigitsPickerOpen, setIsDigitsPickerOpen] = useState(false);

  const exampleNumbers = Array.from({ length: 24 }, (_, i) => i + 2); // 2 to 25
  const speedOptions = [0.5, 0.7, 1.0, 1.5, 2.0];
  const digitsOptions = [1, 2, 3, 4];
  const formatSpeed = (val) => `${val} soniya`;

  
  const socketRef = useRef(null);
  const timeoutRef = useRef(null);
  const opponentRef = useRef(null);
  const isHostRef = useRef(false);


  const baseAvatarsList = [
    { id: 0, name: 'Alex', img: require('../assets/avatar_alex.jpg') },
    { id: 1, name: 'Maks', img: require('../assets/avatar_maks.png') },
    { id: 2, name: 'David', img: require('../assets/avatar_david.jpg') },
    { id: 3, name: 'Kevin', img: require('../assets/avatar_kevin.png') },
    { id: 4, name: 'Lily', img: require('../assets/avatar_lily.jpg') },
    { id: 5, name: 'Maya', img: require('../assets/avatar_maya.jpg') },
    { id: 6, name: 'Emma', img: require('../assets/avatar_emma.jpg') },
    { id: 7, name: 'Sophia', img: require('../assets/avatar_sophia.png') }
  ];

  const getAvatarImg = (uData) => {
    if (!uData) return require('../assets/avatar_maks.png');
    if (uData.character) {
      const found = baseAvatarsList.find(a => a.name.toLowerCase() === uData.character.toLowerCase());
      if (found) return found.img;
    }
    return require('../assets/avatar_maks.png');
  };

  useEffect(() => {
    async function loadData() {
      try {
        const uDataStr = await AsyncStorage.getItem('user_data');
        if (uDataStr) setUserData(JSON.parse(uDataStr));
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  const getCharPath = (charName) => {
    let safeName = charName || 'maks';
    let avatarIndex = 1;
    const lowerName = safeName.toLowerCase();
    const boysChars = ["alex", "maks", "david", "kevin"];
    const girlsChars = ["lily", "maya", "emma", "sophia"];
    if (boysChars.includes(lowerName)) {
      avatarIndex = boysChars.indexOf(lowerName);
    } else if (girlsChars.includes(lowerName)) {
      avatarIndex = girlsChars.indexOf(lowerName) + 4;
    }
    const found = dynamicCharacters.find(c => String(c.id) === String(avatarIndex)) || dynamicCharacters[0];
    if (found?.modelUrl) {
      return `${API_URL.replace(/\/api\/?$/, '')}${found.modelUrl}`;
    }
    return null;
  };

  // opponentCharPath will still be computed since opponent may have different characters
  const opponentCharPath = useMemo(() => getCharPath(opponent?.character), [opponent?.character, dynamicCharacters]);

  useEffect(() => {
    if (!userData) return;

    socketRef.current = io(SOCKET_URL, { 
      path: '/api/socket.io',
      transports: ['websocket'] 
    });

    socketRef.current.on('connect', () => {
      socketRef.current.emit('register', userData.customId);
      socketRef.current.emit('join_random_battle', {
        customId: userData.customId,
        name: userData.name,
        avatar: userData.avatar,
        character: userData.character,
        equippedSkins: myEquippedSkins || {},
        level: userData.level || 1,
        rating: userData.rating || 0,
        settings: { examplesCount, operation, speed, digits, battleMode }
      });
    });

    
    socketRef.current.on('random_match_found', (data) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setOpponent(data.opponent);
      setIsHost(data.isHost);
      opponentRef.current = data.opponent;
      isHostRef.current = data.isHost;
    });

    socketRef.current.on('start_battle_countdown', (settings) => {
      setShowSettingsModal(false);
      setShowLoading(true);
      setTimeout(() => {
        if (socketRef.current) socketRef.current.disconnect();
        navigation.replace('BattleGame', {
          mode: 'battle',
          isHost: isHostRef.current,
          targetId: opponentRef.current?.customId,
          examplesCount: settings.examplesCount,
          operation: settings.operation,
          speed: settings.speed,
          digits: settings.digits,
          language,
          opponentData: opponentRef.current
        });
      }, 3000);
    });


    // 5-minute timeout (300,000 ms)
    timeoutRef.current = setTimeout(() => {
      if (socketRef.current) {
        socketRef.current.emit('leave_random_battle');
        socketRef.current.disconnect();
      }
      Alert.alert(
        t.timeoutTitle,
        t.timeoutMsg,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    }, 300000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (socketRef.current) {
        socketRef.current.emit('leave_random_battle');
        socketRef.current.disconnect();
      }
    };
  }, [userData, myEquippedSkins]);

  const handleCancel = () => {
    if (socketRef.current) {
      socketRef.current.emit('leave_random_battle');
      socketRef.current.disconnect();
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/random_battle_bg.jpg')} style={styles.background} resizeMode="cover">
        
        {/* Header */}
        <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
          <View style={styles.header}>
            <View style={{ width: 40 }} />
            
            <View style={styles.headerTitleContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name="sword-cross" size={20} color="#F59E0B" style={{ marginRight: 8 }} />
                <Text style={styles.headerTitle}>{t.title}</Text>
              </View>
              <Text style={styles.headerSubtitle}>{t.subtitle}</Text>
            </View>

            <View style={{ width: 40 }} />
          </View>
        </SafeAreaView>

        {/* Characters Area */}
        <View style={styles.charactersArea}>
          
          {/* Left Player (Me) */}
          <View style={[styles.playerContainer, { left: 0 }]}>
            <View style={styles.modelWrapper}>
              {myCharPath ? (
                <Character3DViewer 
                  characterPath={myCharPath}
                  accessoryPath={myEquippedSkins?.accessories}
                  topsPath={myEquippedSkins?.tops}
                  headwearPath={myEquippedSkins?.headwears}
                  pantsPath={myEquippedSkins?.pants}
                  shoesPath={myEquippedSkins?.shoes}
                  backpackPath={myEquippedSkins?.backpacks}
                />
              ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Image source={getAvatarImg(userData)} style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
                </View>
              )}
            </View>
            <View style={styles.playerCard}>
              <Image source={getAvatarImg(userData)} style={styles.playerAvatar} />
              <View style={styles.playerInfo}>
                <Text style={styles.playerName} numberOfLines={1}>{userData?.name || t.you}</Text>
                <Text style={styles.playerId}>{userData?.customId}</Text>
              </View>
            </View>
          </View>

          {/* Right Player (Opponent) */}
          <View style={[styles.playerContainer, { right: 0 }]}>
            {opponent ? (
              <>
                <View style={[styles.modelWrapper, { transform: [{ translateX: 15 }, { translateY: 10 }] }]}>
                  {opponentCharPath ? (
                    <Character3DViewer 
                      characterPath={opponentCharPath}
                      accessoryPath={opponent.equippedSkins?.accessories}
                      topsPath={opponent.equippedSkins?.tops}
                      headwearPath={opponent.equippedSkins?.headwears}
                      pantsPath={opponent.equippedSkins?.pants}
                      shoesPath={opponent.equippedSkins?.shoes}
                      backpackPath={opponent.equippedSkins?.backpacks}
                    />
                  ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <Image source={getAvatarImg(opponent)} style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
                    </View>
                  )}
                </View>
                <View style={styles.playerCard}>
                  <Image source={getAvatarImg(opponent)} style={styles.playerAvatar} />
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName} numberOfLines={1}>{opponent.name || 'Ism yoq'}</Text>
                    <Text style={styles.playerId}>{opponent.customId || 'ID yoq'}</Text>
                  </View>
                </View>
              </>
            ) : (
              <View style={[styles.playerCard, styles.waitingCard]}>
                <ActivityIndicator size="small" color="#60A5FA" style={{ marginBottom: 10 }} />
                <Text style={styles.waitingTitle}>{t.waiting}</Text>
                <Text style={styles.waitingSubtitle}>{t.searching}</Text>
              </View>
            )}
          </View>

        </View>

                {/* Footer Area */}
        <SafeAreaView style={styles.footerSafeArea} edges={['bottom']}>
          {/* Tip Box */}
          <View style={styles.tipBox}>
            <View style={styles.tipIconBox}>
              <MaterialCommunityIcons name="lightbulb-on" size={24} color="#F59E0B" />
            </View>
            <View style={styles.tipTextContainer}>
              <Text style={styles.tipTitle}>{t.tipTitle}</Text>
              <Text style={styles.tipDesc}>{t.tipText}</Text>
            </View>
          </View>

          {opponent && isHost && !showLoading ? (
            <TouchableOpacity 
              style={[styles.cancelBtn, { backgroundColor: '#10B981' }]} 
              onPress={() => setShowSettingsModal(true)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="cog" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.cancelBtnText}>Battle sozlamalari</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.8}>
              <Feather name="x" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.cancelBtnText}>{t.cancel}</Text>
            </TouchableOpacity>
          )}
        </SafeAreaView>

      
      {showLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>O'yin boshlanmoqda...</Text>
        </View>
      )}

      <Modal visible={showSettingsModal} transparent animationType="slide">
        <View style={styles.fullModalOverlay}>
          <SafeAreaView style={styles.fullModalContainer}>
            <View style={styles.fullModalHeader}>
              <TouchableOpacity style={styles.fullModalBackButton} onPress={() => setShowSettingsModal(false)}>
                <MaterialCommunityIcons name="arrow-left" size={20} color="#D1D5DB" />
              </TouchableOpacity>
              <Text style={styles.fullModalHeaderTitle}>BATTLE SOZLAMALARI</Text>
              <View style={{ width: 40 }} />
            </View>

            <ScrollView nestedScrollEnabled={true} style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.fullModalScrollContent}>
              
              {/* NUMBER OF EXAMPLES */}
              <View style={styles.settingsGroupContainer}>
                <View style={styles.settingsGroupHeader}>
                  <View style={styles.settingsIconBox}>
                    <MaterialCommunityIcons name="format-list-bulleted" size={24} color="#A855F7" />
                  </View>
                  <View style={styles.settingsHeaderTextContainer}>
                    <Text style={styles.settingsTitle}>MISOLLAR SONI</Text>
                    <Text style={styles.settingsSubtitle}>Nechta misol yechishni xohlaysiz?</Text>
                  </View>
                </View>

                {!isExamplesPickerOpen ? (
                  <TouchableOpacity style={styles.settingsSelectorClosed} activeOpacity={0.8} onPress={() => setIsExamplesPickerOpen(true)}>
                    <Text style={styles.settingsSelectorValueText}>{localExamplesCount} <Text style={styles.settingsSelectorLabelText}>ta misol</Text></Text>
                    <MaterialCommunityIcons name="chevron-down" size={24} color="#A855F7" />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.settingsPickerExpanded}>
                    <ScrollView nestedScrollEnabled={true} style={styles.settingsPickerScroll} showsVerticalScrollIndicator={false} snapToInterval={40} decelerationRate="fast" onMomentumScrollEnd={(e) => {
                      const offsetY = e.nativeEvent.contentOffset.y;
                      const index = Math.round(offsetY / 40);
                      if (exampleNumbers[index]) setLocalExamplesCount(exampleNumbers[index]);
                    }}>
                      <View style={{ height: 40 }} />
                      {exampleNumbers.map((num) => {
                        const isSelected = localExamplesCount === num;
                        return (
                          <TouchableOpacity key={num} style={[styles.settingsPickerItem, isSelected && styles.settingsPickerItemSelected]} onPress={() => { setLocalExamplesCount(num); setIsExamplesPickerOpen(false); }}>
                            <Text style={[styles.settingsPickerItemText, isSelected && styles.settingsPickerItemTextSelected]}>
                              {num} {isSelected && <Text style={styles.settingsPickerItemLabel}>ta misol</Text>}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                      <View style={{ height: 40 }} />
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* OPERATIONS */}
              <View style={styles.settingsGroupContainer}>
                <View style={styles.settingsGroupHeader}>
                  <View style={styles.settingsIconBox}>
                    <MaterialCommunityIcons name="calculator-variant" size={24} color="#A855F7" />
                  </View>
                  <View style={styles.settingsHeaderTextContainer}>
                    <Text style={styles.settingsTitle}>OPERATSIYALAR</Text>
                    <Text style={styles.settingsSubtitle}>Qanday misollar tushishini tanlang</Text>
                  </View>
                </View>

                <View style={styles.opsRow}>
                  <TouchableOpacity style={[styles.opsCard, localOperation === 'oddiy' && styles.opsCardSelected]} onPress={() => setLocalOperation('oddiy')} activeOpacity={0.8}>
                    {localOperation === 'oddiy' && <View style={styles.opsCheckmarkBadge}><MaterialCommunityIcons name="check-bold" size={12} color="#fff" /></View>}
                    <View style={styles.opsCardIconWrapper}><MaterialCommunityIcons name="plus" size={32} color={localOperation === 'oddiy' ? '#A855F7' : '#9CA3AF'} /></View>
                    <Text style={[styles.opsCardTitle, localOperation === 'oddiy' && styles.opsCardTitleSelected]}>Oddiy</Text>
                    <Text style={styles.opsCardDesc} numberOfLines={2}>Faqat oddiy qo'shish va ayirish</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.opsCard, localOperation === 'f5' && styles.opsCardSelected]} onPress={() => setLocalOperation('f5')} activeOpacity={0.8}>
                    {localOperation === 'f5' && <View style={styles.opsCheckmarkBadge}><MaterialCommunityIcons name="check-bold" size={12} color="#fff" /></View>}
                    <View style={styles.opsCardIconWrapper}><Text style={[styles.opsFormulaIcon, localOperation === 'f5' && styles.opsFormulaIconSelected]}>f(x)</Text></View>
                    <Text style={[styles.opsCardTitle, localOperation === 'f5' && styles.opsCardTitleSelected]}>Formula 5</Text>
                    <Text style={styles.opsCardDesc} numberOfLines={2}>5 lik formula qo'shish, ayirish</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.opsCard, localOperation === 'f10' && styles.opsCardSelected]} onPress={() => setLocalOperation('f10')} activeOpacity={0.8}>
                    {localOperation === 'f10' && <View style={styles.opsCheckmarkBadge}><MaterialCommunityIcons name="check-bold" size={12} color="#fff" /></View>}
                    <View style={styles.opsCardIconWrapper}><Text style={[styles.opsFormulaIcon, localOperation === 'f10' && styles.opsFormulaIconSelected]}>f(x)</Text></View>
                    <Text style={[styles.opsCardTitle, localOperation === 'f10' && styles.opsCardTitleSelected]}>Formula 10</Text>
                    <Text style={styles.opsCardDesc} numberOfLines={2}>10 lik formula qo'shish, ayirish</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.opsCard, localOperation === 'aralash' && styles.opsCardSelected]} onPress={() => setLocalOperation('aralash')} activeOpacity={0.8}>
                    {localOperation === 'aralash' && <View style={styles.opsCheckmarkBadge}><MaterialCommunityIcons name="check-bold" size={12} color="#fff" /></View>}
                    <View style={styles.opsCardIconWrapper}><MaterialCommunityIcons name="shuffle-variant" size={28} color={localOperation === 'aralash' ? '#A855F7' : '#9CA3AF'} /></View>
                    <Text style={[styles.opsCardTitle, localOperation === 'aralash' && styles.opsCardTitleSelected]}>Aralash</Text>
                    <Text style={styles.opsCardDesc} numberOfLines={2}>Barcha formulalar qatnashadi</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* SPEED */}
              <View style={styles.settingsGroupContainer}>
                <View style={styles.settingsGroupHeader}>
                  <View style={styles.settingsIconBox}>
                    <MaterialCommunityIcons name="lightning-bolt" size={24} color="#A855F7" />
                  </View>
                  <View style={styles.settingsHeaderTextContainer}>
                    <Text style={styles.settingsTitle}>TEZLIK</Text>
                    <Text style={styles.settingsSubtitle}>Mashq bajarish tezligini tanlang</Text>
                  </View>
                </View>

                {!isSpeedPickerOpen ? (
                  <TouchableOpacity style={styles.settingsSelectorClosed} activeOpacity={0.8} onPress={() => setIsSpeedPickerOpen(true)}>
                    <Text style={styles.settingsSelectorValueText}>{formatSpeed(localSpeed)}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={24} color="#A855F7" />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.settingsPickerExpanded}>
                    <ScrollView nestedScrollEnabled={true} style={styles.settingsPickerScroll} showsVerticalScrollIndicator={false} snapToInterval={40} decelerationRate="fast" onMomentumScrollEnd={(e) => {
                      const offsetY = e.nativeEvent.contentOffset.y;
                      const index = Math.round(offsetY / 40);
                      if (speedOptions[index]) setLocalSpeed(speedOptions[index]);
                    }}>
                      <View style={{ height: 40 }} />
                      {speedOptions.map((s) => {
                        const isSelected = localSpeed === s;
                        return (
                          <TouchableOpacity key={s.toString()} style={[styles.settingsPickerItem, isSelected && styles.settingsPickerItemSelected]} onPress={() => { setLocalSpeed(s); setIsSpeedPickerOpen(false); }}>
                            <Text style={[styles.settingsPickerItemText, isSelected && styles.settingsPickerItemTextSelected]}>{formatSpeed(s)}</Text>
                          </TouchableOpacity>
                        );
                      })}
                      <View style={{ height: 40 }} />
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* DIGITS */}
              <View style={styles.settingsGroupContainer}>
                <View style={styles.settingsGroupHeader}>
                  <View style={styles.settingsIconBox}>
                    <MaterialCommunityIcons name="numeric" size={24} color="#A855F7" />
                  </View>
                  <View style={styles.settingsHeaderTextContainer}>
                    <Text style={styles.settingsTitle}>SON XONASI</Text>
                    <Text style={styles.settingsSubtitle}>Qatnashadigan sonlar xonasini tanlang</Text>
                  </View>
                </View>

                {!isDigitsPickerOpen ? (
                  <TouchableOpacity style={styles.settingsSelectorClosed} activeOpacity={0.8} onPress={() => setIsDigitsPickerOpen(true)}>
                    <Text style={styles.settingsSelectorValueText}>{localDigits} <Text style={styles.settingsSelectorLabelText}>xonali</Text></Text>
                    <MaterialCommunityIcons name="chevron-down" size={24} color="#A855F7" />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.settingsPickerExpanded}>
                    <ScrollView nestedScrollEnabled={true} style={styles.settingsPickerScroll} showsVerticalScrollIndicator={false} snapToInterval={40} decelerationRate="fast" onMomentumScrollEnd={(e) => {
                      const offsetY = e.nativeEvent.contentOffset.y;
                      const index = Math.round(offsetY / 40);
                      if (digitsOptions[index]) setLocalDigits(digitsOptions[index]);
                    }}>
                      <View style={{ height: 40 }} />
                      {digitsOptions.map((d) => {
                        const isSelected = localDigits === d;
                        return (
                          <TouchableOpacity key={d.toString()} style={[styles.settingsPickerItem, isSelected && styles.settingsPickerItemSelected]} onPress={() => { setLocalDigits(d); setIsDigitsPickerOpen(false); }}>
                            <Text style={[styles.settingsPickerItemText, isSelected && styles.settingsPickerItemTextSelected]}>
                              {d} {isSelected && <Text style={styles.settingsPickerItemLabel}>xonali</Text>}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                      <View style={{ height: 40 }} />
                    </ScrollView>
                  </View>
                )}
              </View>
            </ScrollView>

            <View style={styles.fullModalFooter}>
              <TouchableOpacity 
                style={styles.startBtnFull}
                onPress={() => {
                  socketRef.current?.emit('start_host_battle', {
                    opponentSocketId: opponentRef.current?.socketId,
                    settings: {
                      examplesCount: localExamplesCount,
                      operation: localOperation,
                      speed: localSpeed,
                      digits: localDigits
                    }
                  });
                }}
                activeOpacity={0.8}
              >
                <View style={styles.startBtnIconContainerFull}>
                  <MaterialCommunityIcons name="sword-cross" size={24} color="#fff" />
                </View>
                <View style={styles.startBtnTextContainerFull}>
                  <Text style={styles.startBtnTextFull}>BATTLE BOSHLASH</Text>
                </View>
                <View style={{ width: 24 }} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>

    </ImageBackground>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05050C',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  headerSafeArea: {
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Inter_800ExtraBold',
  },
  headerSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginTop: 4,
  },
  charactersArea: {
    flex: 1,
    position: 'relative',
  },
  playerContainer: {
    position: 'absolute',
    bottom: height * 0.05,
    width: '45%',
    alignItems: 'center',
  },
  modelWrapper: {
    width: 200,
    height: 350,
    marginBottom: 10,
    backgroundColor: 'transparent',
    opacity: 0.99,
    zIndex: 2,
    transform: [{ scale: 1.15 }, { translateX: -10 }, { translateY: -15 }],
  },
  playerCard: {
    backgroundColor: 'rgba(10, 15, 28, 0.7)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    width: 160,
  },
  waitingCard: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'rgba(10, 25, 48, 0.7)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    width: 170,
    paddingVertical: 20,
    transform: [{ translateY: 40 }],
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginRight: 10,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    marginBottom: 2,
  },
  playerId: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  waitingTitle: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  waitingSubtitle: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
  footerSafeArea: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 20, 30, 0.8)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  tipIconBox: {
    marginRight: 15,
    justifyContent: 'center',
  },
  tipTextContainer: {
    flex: 1,
  },
  tipTitle: {
    color: '#F59E0B',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  tipDesc: {
    color: '#D1D5DB',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    lineHeight: 18,
  },
  cancelBtn: {
    flexDirection: 'row',
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  }
});
