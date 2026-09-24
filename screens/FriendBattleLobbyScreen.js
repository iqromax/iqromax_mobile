import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions, DeviceEventEmitter, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import { calculateUserRank } from '../src/utils/rankUtils';
import { Character3DViewer } from '../components/Character3DViewer';
import { API_URL } from '../src/config/api';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL || 'https://iqromax-production.up.railway.app';

const TRANSLATIONS = {
  uz: {
    waitingTitle: "KUTISH ZALI",
    waitingText: "Do'stingiz o'yinni sozlamoqda, kuting...",
    leave: "CHIQISH",
    you: "Siz",
    level: "Daraja",
    fairPlay: "Adolatli o'yin ta'minlanadi"
  },
  en: {
    waitingTitle: "WAITING ROOM",
    waitingText: "Your friend is setting up the game, please wait...",
    leave: "LEAVE",
    you: "You",
    level: "Level",
    fairPlay: "Fair play guaranteed"
  },
  ru: {
    waitingTitle: "КОМНАТА ОЖИДАНИЯ",
    waitingText: "Ваш друг настраивает игру, подождите...",
    leave: "ВЫЙТИ",
    you: "Вы",
    level: "Уровень",
    fairPlay: "Честная игра гарантирована"
  }
};

export default function FriendBattleLobbyScreen({ navigation, route }) {
  const { inviteData, language = 'uz' } = route.params || {};
  const t = TRANSLATIONS[language] || TRANSLATIONS['uz'];
  const [userData, setUserData] = useState(null);
  const [dynamicCharacters, setDynamicCharacters] = useState([]);
  const [myEquippedSkins, setMyEquippedSkins] = useState({});
  const [friendEquippedSkinsState, setFriendEquippedSkinsState] = useState({});
  const [friendCharNameState, setFriendCharNameState] = useState(null);

  useEffect(() => {
    async function fetchChars() {
      try {
        const res = await fetch(`${API_URL}/inventory-skins`);
        if (res.ok) {
          const data = await res.json();
          setDynamicCharacters(data.filter(s => s.category === 'personajlar'));
        }
      } catch (e) {}
    }
    fetchChars();
  }, []);

  // Parse friend's skins from inviteData reliably
  useEffect(() => {
    if (!inviteData) return;
    let parsed = null;
    // Try inviteData.message (JSON string)
    if (inviteData.message) {
      try {
        parsed = typeof inviteData.message === 'string' ? JSON.parse(inviteData.message) : inviteData.message;
      } catch(e) {}
    }
    // Build friend equipped skins - sender is the one who sent the invite (Ergashboy)
    const senderSkins = parsed?.senderEquippedSkins || inviteData.senderEquippedSkins || {};
    const targetSkins = parsed?.targetEquippedSkins || inviteData.targetEquippedSkins || {};
    
    // If we are the host, the friend is the target. If we are the guest, the friend is the sender.
    let resolvedSkins = {};
    if (route.params?.isHost) {
      resolvedSkins = (targetSkins && Object.keys(targetSkins).length > 0) ? targetSkins : {};
    } else {
      resolvedSkins = (senderSkins && Object.keys(senderSkins).length > 0) ? senderSkins : targetSkins;
    }
    setFriendEquippedSkinsState(resolvedSkins);

    // Parse friend char name
    const senderAvatar = parsed?.senderAvatar || inviteData.senderAvatar;
    const targetAvatar = parsed?.targetAvatar || inviteData.targetAvatar;
    
    let resolvedAvatar = null;
    if (route.params?.isHost) {
      resolvedAvatar = targetAvatar;
    } else {
      resolvedAvatar = senderAvatar || targetAvatar;
    }
    setFriendCharNameState(resolvedAvatar || null);
  }, [inviteData, route.params?.isHost]);

  useEffect(() => {
    async function fetchMySkins() {
      if (userData) {
        try {
          const userIdKey = userData.customId || userData.id || 'guest';
          const skinsStr = await AsyncStorage.getItem(`user_equipped_skins_${userIdKey}`);
          if (skinsStr) {
            const parsedSkins = JSON.parse(skinsStr);
            let activeAvatarIndex = 0;
            if (userData.character) {
              const lowerChar = userData.character.toLowerCase();
              const boysChars = ["alex", "maks", "david", "kevin"];
              const girlsChars = ["lily", "maya", "emma", "sophia"];
              if (boysChars.includes(lowerChar)) {
                activeAvatarIndex = boysChars.indexOf(lowerChar);
              } else if (girlsChars.includes(lowerChar)) {
                activeAvatarIndex = girlsChars.indexOf(lowerChar) + 4;
              }
            }
            setMyEquippedSkins({
              accessories: parsedSkins.accessories?.[activeAvatarIndex] || null,
              tops: parsedSkins.tops?.[activeAvatarIndex] || null,
              headwears: parsedSkins.headwears?.[activeAvatarIndex] || null,
              pants: parsedSkins.pants?.[activeAvatarIndex] || null,
              shoes: parsedSkins.shoes?.[activeAvatarIndex] || null,
              backpacks: parsedSkins.backpacks?.[activeAvatarIndex] || null,
            });
          }
        } catch (e) {}
      }
    }
    fetchMySkins();
  }, [userData]);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const countdownScale = useRef(new Animated.Value(0.5)).current;
  const countdownOpacity = useRef(new Animated.Value(0)).current;
  const loadingProgress = useRef(new Animated.Value(0)).current;

  // Resolve avatars
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
    async function fetchUser() {
      try {
        const data = await AsyncStorage.getItem('user_data');
        if (data) setUserData(JSON.parse(data));
      } catch (e) {}
    }
    fetchUser();
  }, []);

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        })
      ])
    ).start();

    // Spin animation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, []);

  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdownVal, setCountdownVal] = useState(1);
  const [battleData, setBattleData] = useState(null);

  const hasEmitted = useRef(false);

  useEffect(() => {
    let socket;
    if (userData) {
      socket = io(SOCKET_URL, { 
        path: '/api/socket.io',
        transports: ['websocket'] 
      });

      socket.on('connect', () => {
        socket.emit('register', userData.customId);
        
        if (route.params?.isHost && route.params?.targetId && !hasEmitted.current) {
           hasEmitted.current = true;
           socket.emit('start_friend_battle', {
               targetId: route.params.targetId,
               senderId: userData.customId,
               questions: route.params.questions,
               ...route.params.settings
           });
        }
      });

      // Just in case it was already connected synchronously
      if (socket.connected) {
        socket.emit('register', userData.customId);
        if (route.params?.isHost && route.params?.targetId && !hasEmitted.current) {
           hasEmitted.current = true;
           socket.emit('start_friend_battle', {
               targetId: route.params.targetId,
               senderId: userData.customId,
               questions: route.params.questions,
               ...route.params.settings
           });
        }
      }

      socket.on('start_friend_battle', (settingsData) => {
        setBattleData(settingsData);
        setIsCountingDown(true);
        setCountdownVal(1);
      });
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [userData, route.params]);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('global_start_friend_battle', (settingsData) => {
      if (!route.params?.isHost) {
        setBattleData(settingsData);
        setIsCountingDown(true);
        setCountdownVal(1);
      }
    });
    return () => sub.remove();
  }, [route.params?.isHost]);

  useEffect(() => {
    if (route.params?.isHost) {
      setIsCountingDown(true);
      setCountdownVal(1);
    }
  }, [route.params?.isHost]);

  useEffect(() => {
    if (isCountingDown) {
      // We will handle the progress bar animation below.
      // Set progress smoothly to (countdownVal / 10)
      Animated.timing(loadingProgress, {
        toValue: countdownVal / 10,
        duration: 1000,
        useNativeDriver: false
      }).start();

      if (countdownVal < 10) {
        const timer = setTimeout(() => {
          setCountdownVal(prev => prev + 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        let finalSettings = route.params?.isHost 
          ? { ...route.params?.settings, questions: route.params?.questions, targetId: route.params?.targetId } 
          : { ...battleData, targetId: inviteData?.senderId };
          
        navigation.replace('BattleGame', {
          mode: 'battle',
          language,
          isFriendBattle: true,
          ...finalSettings
        });
      }
    }
  }, [isCountingDown, countdownVal, route.params, battleData, inviteData, language, navigation]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  // Parse friend info (name, level, xp) inline
  let friendName = 'Do\'st';
  let friendLevel = 1;
  let friendXp = 0;

  (() => {
    let parsed = null;
    if (inviteData?.message) {
      try {
        parsed = typeof inviteData.message === 'string' ? JSON.parse(inviteData.message) : inviteData.message;
      } catch(e) {}
    }
    const src = parsed || inviteData || {};
    // Sender = the person who sent the invite (Ergashboy in this case)
    if (src.senderName) friendName = src.senderName;
    else if (src.targetName) friendName = src.targetName;
    if (src.level) friendLevel = src.level;
    if (src.xp !== undefined) friendXp = src.xp;
    else if (src.rating !== undefined) friendXp = src.rating;
  })();

  // Use the state-based values for skins and char name (set in useEffect)
  const friendCharName = friendCharNameState;
  const friendEquippedSkins = friendEquippedSkinsState;

  let friendAvatarObj = require('../assets/avatar_david.jpg');
  if (friendCharName) {
    if (typeof friendCharName === 'string' && friendCharName.startsWith('http')) {
      friendAvatarObj = { uri: friendCharName };
    } else if (typeof friendCharName === 'string') {
      friendAvatarObj = getAvatarImg({ character: friendCharName });
    } else {
      friendAvatarObj = friendCharName;
    }
  }

  const myLevel = userData ? calculateUserRank(userData.xp || 0).levelNumber : 1;

  const getCharPath = (charName) => {
    if (!charName) return null;
    let avatarIndex = 0;
    const lowerName = charName.toLowerCase();
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

  const friendCharPath = useMemo(() => getCharPath(friendCharName), [friendCharName, dynamicCharacters]);
  const myCharPath = useMemo(() => getCharPath(userData?.character), [userData?.character, dynamicCharacters]);

  return (
    <View style={{ flex: 1, backgroundColor: '#05050C' }}>
      <ImageBackground source={require('../assets/arena_bg.png')} style={styles.background} resizeMode="contain">
        <SafeAreaView style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>KUTISH <Text style={{ color: '#A855F7' }}>ZALI</Text></Text>
            <Text style={styles.headerSubtitle}>{t.waitingText}</Text>
          </View>
        </View>

        {isCountingDown && (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingTrack}>
               <Animated.View style={[styles.loadingFill, {
                 width: loadingProgress.interpolate({
                   inputRange: [0, 1],
                   outputRange: ['0%', '100%']
                 })
               }]} />
            </View>
            <Text style={styles.loadingText}>O'yin tayyorlanmoqda...</Text>
          </View>
        )}



        {/* Arena & Characters Section */}
        <View style={styles.battleArena}>
          
          {/* Opponent (Red Side) */}
          <View style={styles.leftFighter}>
            <View style={styles.characterContainer}>
              {friendCharPath ? (
                <Character3DViewer 
                  characterPath={friendCharPath}
                  accessoryPath={friendEquippedSkins?.accessories}
                  topsPath={friendEquippedSkins?.tops}
                  headwearPath={friendEquippedSkins?.headwears}
                  pantsPath={friendEquippedSkins?.pants}
                  shoesPath={friendEquippedSkins?.shoes}
                  backpackPath={friendEquippedSkins?.backpacks}
                  disableRotation={true}
                />
              ) : (
                <Image source={friendAvatarObj} style={styles.fighterAvatar} contentFit="cover" />
              )}
            </View>
          </View>

          {/* User (Blue Side) */}
          <View style={styles.rightFighter}>
            <View style={styles.characterContainer}>
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
                <Image source={getAvatarImg(userData)} style={styles.fighterAvatar} contentFit="cover" />
              )}
            </View>
          </View>

          {/* Center VS Indicator */}
          <View style={styles.vsCenterContainer}>
             <Text style={styles.vsTextMain}><Text style={{ color: '#F472B6' }}>V</Text><Text style={{ color: '#60A5FA' }}>s</Text></Text>
             <MaterialCommunityIcons name="lightning-bolt" size={30} color="#FFF" style={styles.lightningIcon} />
          </View>

        </View>

        {/* Stats Cards Section */}
        <View style={styles.statsCardsRow}>
          
          {/* Opponent Card (Red Theme) */}
          <View style={[styles.statsCard, styles.statsCardRed]}>
            <View style={styles.cardHeader}>
               <View style={styles.cardAvatarBgRed}>
                 <Image source={friendAvatarObj} style={styles.cardSmallAvatar} contentFit="cover" />
               </View>
               <View style={styles.cardNameSection}>
                 <Text style={styles.cardNameText} numberOfLines={1}>{friendName}</Text>
                 <View style={styles.xpRow}>
                   <MaterialCommunityIcons name="star" size={12} color="#FBBF24" />
                   <Text style={styles.xpTextValue}>XP {friendXp}</Text>
                 </View>
               </View>
            </View>

            <View style={styles.statsMetricsRow}>
              <View style={styles.metricItem}>
                <View style={styles.metricIconBoxRed}>
                  <MaterialCommunityIcons name="fire" size={16} color="#FCA5A5" />
                </View>
                <Text style={styles.metricValue}>12</Text>
                <Text style={styles.metricLabel}>Seriya</Text>
              </View>
              <View style={styles.metricItem}>
                <View style={styles.metricIconBoxRed}>
                  <MaterialCommunityIcons name="trophy" size={16} color="#FCD34D" />
                </View>
                <Text style={styles.metricValue}>48</Text>
                <Text style={styles.metricLabel}>G'alaba</Text>
              </View>
              <View style={styles.metricItem}>
                <View style={styles.metricIconBoxRed}>
                  <MaterialCommunityIcons name="bullseye-arrow" size={16} color="#FCA5A5" />
                </View>
                <Text style={styles.metricValue}>89%</Text>
                <Text style={styles.metricLabel}>Aniqlik</Text>
              </View>
            </View>

            <View style={styles.quoteBoxRed}>
              <Text style={styles.quoteQuoteMark}>“</Text>
              <MaterialCommunityIcons name="fire" size={16} color="#EF4444" style={{ marginHorizontal: 4 }} />
              <Text style={styles.quoteTextRed}>G'alaba bizniki!</Text>
              <Text style={styles.quoteQuoteMark}>”</Text>
            </View>
          </View>

          {/* User Card (Blue Theme) */}
          <View style={[styles.statsCard, styles.statsCardBlue]}>
            <View style={styles.cardHeader}>
               <View style={styles.cardAvatarBgBlue}>
                 <Image source={getAvatarImg(userData)} style={styles.cardSmallAvatar} contentFit="cover" />
               </View>
               <View style={styles.cardNameSection}>
                 <Text style={styles.cardNameText} numberOfLines={1}>{t.you}</Text>
                 <View style={styles.xpRow}>
                   <MaterialCommunityIcons name="star" size={12} color="#FBBF24" />
                   <Text style={styles.xpTextValue}>XP {userData?.xp || 0}</Text>
                 </View>
               </View>
            </View>

            <View style={styles.statsMetricsRow}>
              <View style={styles.metricItem}>
                <View style={styles.metricIconBoxBlue}>
                  <MaterialCommunityIcons name="fire" size={16} color="#93C5FD" />
                </View>
                <Text style={styles.metricValue}>1</Text>
                <Text style={styles.metricLabel}>Seriya</Text>
              </View>
              <View style={styles.metricItem}>
                <View style={styles.metricIconBoxBlue}>
                  <MaterialCommunityIcons name="trophy" size={16} color="#FCD34D" />
                </View>
                <Text style={styles.metricValue}>2</Text>
                <Text style={styles.metricLabel}>G'alaba</Text>
              </View>
              <View style={styles.metricItem}>
                <View style={styles.metricIconBoxBlue}>
                  <MaterialCommunityIcons name="bullseye-arrow" size={16} color="#93C5FD" />
                </View>
                <Text style={styles.metricValue}>65%</Text>
                <Text style={styles.metricLabel}>Aniqlik</Text>
              </View>
            </View>

            <View style={styles.quoteBoxBlue}>
              <Text style={styles.quoteQuoteMark}>“</Text>
              <MaterialCommunityIcons name="arm-flex" size={16} color="#3B82F6" style={{ marginHorizontal: 4 }} />
              <Text style={styles.quoteTextBlue}>Men tayyorman!</Text>
              <Text style={styles.quoteQuoteMark}>”</Text>
            </View>
          </View>

        </View>

        {/* Footer Buttons Section */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.leaveButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <MaterialCommunityIcons name="exit-to-app" size={20} color="#EF4444" style={{ marginRight: 10 }} />
            <Text style={styles.leaveButtonText}>{t.leave}</Text>
          </TouchableOpacity>
        </View>

        {/* Fullscreen Countdown Removed */}
      </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    marginBottom: 20,
  },
  headerTitleContainer: {
    alignItems: 'center',
    width: '100%',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  pillContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pillBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pillText: {
    color: '#E5E7EB',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginHorizontal: 10,
  },
  battleArena: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 10,
  },
  leftFighter: {
    position: 'absolute',
    left: -width * 0.02,
    bottom: '10%',
    alignItems: 'center',
    zIndex: 2,
  },
  rightFighter: {
    position: 'absolute',
    right: -width * 0.02,
    bottom: '10%',
    alignItems: 'center',
    zIndex: 2,
  },
  characterContainer: {
    width: 210,
    height: 350,
    backgroundColor: 'transparent',
    opacity: 0.99,
  },
  fighterAvatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  vsCenterContainer: {
    position: 'absolute',
    top: '35%',
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  vsTextMain: {
    fontSize: 60,
    fontFamily: 'Inter_900Black',
    fontStyle: 'italic',
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  lightningIcon: {
    position: 'absolute',
    opacity: 0.8,
    top: 20,
    transform: [{ rotate: '15deg' }],
  },
  vsBox: {
    marginBottom: 20,
    backgroundColor: 'rgba(20, 25, 40, 0.8)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  vsBoxText: {
    color: '#D1D5DB',
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A855F7',
  },
  statsCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statsCard: {
    width: '48%',
    backgroundColor: 'rgba(10, 15, 28, 0.85)',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
  },
  statsCardRed: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderTopColor: 'rgba(239, 68, 68, 0.6)',
  },
  statsCardBlue: {
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderTopColor: 'rgba(59, 130, 246, 0.6)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardAvatarBgRed: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(239,68,68,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardAvatarBgBlue: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(59,130,246,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSmallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  cardNameSection: {
    marginLeft: 10,
    flex: 1,
  },
  cardNameText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  xpTextValue: {
    color: '#FBBF24',
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 4,
  },
  statsMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricIconBoxRed: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(239,68,68,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  metricIconBoxBlue: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(59,130,246,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  metricValue: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  metricLabel: {
    color: '#6B7280',
    fontSize: 9,
    fontFamily: 'Inter_500Medium',
  },
  quoteBoxRed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderRadius: 12,
    paddingVertical: 8,
  },
  quoteBoxBlue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59,130,246,0.15)',
    borderRadius: 12,
    paddingVertical: 8,
  },
  quoteTextRed: {
    color: '#FCA5A5',
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  quoteTextBlue: {
    color: '#93C5FD',
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  quoteQuoteMark: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 14,
    fontFamily: 'Inter_900Black',
    marginHorizontal: 2,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  leaveButton: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.5)',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  leaveButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  secureTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  secureText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginLeft: 6,
  },
  secureSubText: {
    color: '#6B7280',
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    marginBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.5,
  },
  logoTitle: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 2,
  },
  logoSub: {
    color: '#9CA3AF',
    fontSize: 7,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 1,
  },
  countdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 5, 12, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  countdownText: {
    color: '#FFF',
    fontSize: 120,
    fontFamily: 'Inter_900Black',
    textShadowColor: 'rgba(168, 85, 247, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    zIndex: 10,
  },
  loadingTrack: {
    width: 200,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  loadingFill: {
    height: '100%',
    backgroundColor: '#A855F7',
    borderRadius: 3,
  },
  loadingText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  }
});
