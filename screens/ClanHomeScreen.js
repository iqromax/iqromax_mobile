import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Platform,
  Animated,
  Alert,
  Easing,
  BackHandler,
  Vibration,
  Modal,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Feather,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from '@expo/vector-icons';
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Polygon,
  Circle,
} from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { triggerReturnPortalHaptics } from '../src/utils/vibrationService';
import { MissionsTabContent } from './ClanMissionsScreen';

const { width } = Dimensions.get('window');

// Clan Emblems SVG component
const ClanShieldEmblem = ({ type = 'wolf', size = 46 }) => {
  if (type === 'wolf') {
    return (
      <View style={[styles.emblemContainer, { width: size, height: size }]}>
        <LinearGradient
          colors={['#4C1D95', '#2E1065', '#1E1B4B']}
          style={styles.emblemBg}
        >
          <Svg width={size * 0.72} height={size * 0.72} viewBox="0 0 24 24">
            <Defs>
              <SvgGradient id="wolfGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#E9D5FF" />
                <Stop offset="100%" stopColor="#A855F7" />
              </SvgGradient>
            </Defs>
            {/* Stylized Wolf/Fox Shield */}
            <Path
              d="M12 2L4 7v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V7l-8-5z"
              fill="none"
              stroke="#A855F7"
              strokeWidth="1.5"
            />
            {/* Wolf Face silhouette */}
            <Path
              d="M7 8.5L9.5 12L8 16L12 14L16 16L14.5 12L17 8.5L13.5 10L12 7.5L10.5 10L7 8.5Z"
              fill="url(#wolfGrad)"
            />
          </Svg>
        </LinearGradient>
      </View>
    );
  }

  if (type === 'eagle') {
    return (
      <View style={[styles.emblemContainer, { width: size, height: size }]}>
        <LinearGradient
          colors={['#78350F', '#451A03', '#1F1300']}
          style={[styles.emblemBg, { borderColor: '#F59E0B' }]}
        >
          <Svg width={size * 0.72} height={size * 0.72} viewBox="0 0 24 24">
            <Defs>
              <SvgGradient id="eagleGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#FDE68A" />
                <Stop offset="100%" stopColor="#F59E0B" />
              </SvgGradient>
            </Defs>
            {/* Shield */}
            <Path
              d="M12 2L4 7v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V7l-8-5z"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1.5"
            />
            {/* Eagle/Phoenix Wings silhouette */}
            <Path
              d="M6.5 10C8.5 9 10 11 12 8C14 11 15.5 9 17.5 10C16 13 14 14.5 12 16.5C10 14.5 8 13 6.5 10Z"
              fill="url(#eagleGrad)"
            />
          </Svg>
        </LinearGradient>
      </View>
    );
  }

  // Elite (Teal/Emerald Book & Shield)
  return (
    <View style={[styles.emblemContainer, { width: size, height: size }]}>
      <LinearGradient
        colors={['#064E3B', '#022C22', '#011A14']}
        style={[styles.emblemBg, { borderColor: '#10B981' }]}
      >
        <Svg width={size * 0.72} height={size * 0.72} viewBox="0 0 24 24">
          <Defs>
            <SvgGradient id="eliteGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#A7F3D0" />
              <Stop offset="100%" stopColor="#10B981" />
            </SvgGradient>
          </Defs>
          {/* Shield */}
          <Path
            d="M12 2L4 7v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V7l-8-5z"
            fill="none"
            stroke="#10B981"
            strokeWidth="1.5"
          />
          {/* Open Book / Wisdom */}
          <Path
            d="M8 9.5C9.5 9 11 9.5 12 10.5C13 9.5 14.5 9 16 9.5V15.5C14.5 15 13 15.5 12 16.5C11 15.5 9.5 15 8 15.5V9.5Z"
            fill="url(#eliteGrad)"
          />
        </Svg>
      </LinearGradient>
    </View>
  );
};

export default function ClanHomeScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [activeBottomTab, setActiveBottomTab] = useState('Home'); // Home | Missions | Season | Clan
  const [joinedClans, setJoinedClans] = useState([]);
  const [requestedClans, setRequestedClans] = useState([]);

  // Active Clan State (null = unassigned free agent; object = active clan member)
  const [userClan, setUserClan] = useState(null);

  // Clan Creation Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newClanName, setNewClanName] = useState('');
  const [newClanDesc, setNewClanDesc] = useState('');
  const [selectedEmblem, setSelectedEmblem] = useState('wolf');
  const [isClanOpen, setIsClanOpen] = useState(true);

  // Arrival animation when entering screen from dimensional portal
  const arrivalFlashAnim = useRef(new Animated.Value(1)).current;
  const arrivalScaleAnim = useRef(new Animated.Value(1.08)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;

  // Exit Dimension Warp Animation (Clan -> IQROMAX Main System)
  const [isExitPortalActive, setIsExitPortalActive] = useState(false);
  const exitScaleAnim = useRef(new Animated.Value(0.01)).current;
  const exitRotateAnim = useRef(new Animated.Value(0)).current;
  const exitCounterRotateAnim = useRef(new Animated.Value(0)).current;
  const exitRaysScaleAnim = useRef(new Animated.Value(0.2)).current;
  const exitOpacityAnim = useRef(new Animated.Value(0)).current;
  const exitFlashAnim = useRef(new Animated.Value(0)).current;
  const exitProgressAnim = useRef(new Animated.Value(0)).current;

  // Load user clan from storage
  useEffect(() => {
    const loadUserClan = async () => {
      try {
        const stored = await AsyncStorage.getItem('@iqromax_user_clan');
        if (stored) {
          setUserClan(JSON.parse(stored));
        }
      } catch (e) {
        console.log('Error loading clan:', e);
      }
    };
    loadUserClan();
  }, []);

  useEffect(() => {
    // Arrival sequence: portal warp flash dissolves and screen content settles into place
    Animated.parallel([
      Animated.timing(arrivalFlashAnim, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(arrivalScaleAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Android hardware back press listener
    const onBackPress = () => {
      handleExitToMainSystem();
      return true;
    };
    const backSub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backSub.remove();
  }, []);

  useEffect(() => {
    if (route.params?.tab) {
      setActiveBottomTab(route.params.tab);
    }
  }, [route.params?.tab]);

  const handleExitToMainSystem = () => {
    if (isExitPortalActive) return;
    setIsExitPortalActive(true);
    exitScaleAnim.setValue(0.01);
    exitRotateAnim.setValue(0);
    exitCounterRotateAnim.setValue(0);
    exitRaysScaleAnim.setValue(0.2);
    exitOpacityAnim.setValue(0);
    exitFlashAnim.setValue(0);
    exitProgressAnim.setValue(0);

    // Cross-platform Haptic & Native Vibrator Trigger
    triggerReturnPortalHaptics();

    Animated.parallel([
      Animated.timing(exitOpacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(exitScaleAnim, {
        toValue: 26,
        duration: 920,
        easing: Easing.bezier(0.18, 0.9, 0.25, 1),
        useNativeDriver: true,
      }),
      Animated.timing(exitRaysScaleAnim, {
        toValue: 4.8,
        duration: 920,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        useNativeDriver: true,
      }),
      Animated.timing(exitRotateAnim, {
        toValue: 1,
        duration: 920,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(exitCounterRotateAnim, {
        toValue: 1,
        duration: 920,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(exitProgressAnim, {
        toValue: 1,
        duration: 750,
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.delay(520),
        Animated.timing(exitFlashAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      navigation.navigate('StudentDashboard');
      setTimeout(() => {
        setIsExitPortalActive(false);
        exitScaleAnim.setValue(0.01);
        exitRotateAnim.setValue(0);
        exitCounterRotateAnim.setValue(0);
        exitRaysScaleAnim.setValue(0.2);
        exitOpacityAnim.setValue(0);
        exitFlashAnim.setValue(0);
        exitProgressAnim.setValue(0);
      }, 500);
    });
  };

  const handleJoinClan = async (clanName) => {
    const clanObj = {
      name: clanName,
      level: clanName === 'Wolf Legends' ? 12 : 11,
      membersCount: clanName === 'Wolf Legends' ? 8 : 7,
      maxMembers: 10,
      clanXp: 7250,
      clanTargetXp: 10000,
      weeklyBattles: 24,
      weeklyMissions: 86,
      weeklyXp: '12K',
      seasonNumber: 5,
      seasonTimeLeft: '18d 12h left',
      seasonXp: 24500,
      seasonTargetXp: 50000,
      emblem: clanName === 'Wolf Legends' ? 'wolf' : 'eagle',
      role: 'Member',
      isActive: true,
    };

    try {
      await AsyncStorage.setItem('@iqromax_user_clan', JSON.stringify(clanObj));
      setUserClan(clanObj);
      if (!joinedClans.includes(clanName)) {
        setJoinedClans((prev) => [...prev, clanName]);
      }
      Alert.alert(
        "Muvaffaqiyatli! 🎉",
        `Siz "${clanName}" claniga muvaffaqiyatli qo'shildingiz! Bosh sahifa yangilandi.`
      );
    } catch (e) {
      console.log('Error joining clan:', e);
    }
  };

  const handleRequestClan = (clanName) => {
    if (requestedClans.includes(clanName)) return;
    setRequestedClans((prev) => [...prev, clanName]);
    Alert.alert(
      "So'rov yuborildi!",
      `"${clanName}" claniga qo'shilish so'rovi yuborildi. Clan yetakchisi tasdiqlashini kuting.`
    );
  };

  // Open clan creation directly without level 10 limitation
  const handleCreateClan = () => {
    setIsCreateModalOpen(true);
  };

  const handleConfirmCreateClan = async () => {
    const clanName = newClanName.trim() || 'Wolf Legends';
    const newClanObj = {
      name: clanName,
      description: newClanDesc.trim() || 'Doimo birga va cho\'qqilar sari!',
      level: 12,
      membersCount: 8,
      maxMembers: 10,
      clanXp: 7250,
      clanTargetXp: 10000,
      weeklyBattles: 24,
      weeklyMissions: 86,
      weeklyXp: '12K',
      seasonNumber: 5,
      seasonTimeLeft: '18d 12h left',
      seasonXp: 24500,
      seasonTargetXp: 50000,
      emblem: selectedEmblem,
      role: 'Leader',
      isOpen: isClanOpen,
      isActive: true,
    };

    try {
      await AsyncStorage.setItem('@iqromax_user_clan', JSON.stringify(newClanObj));
      setUserClan(newClanObj);
      setIsCreateModalOpen(false);
      setNewClanName('');
      setNewClanDesc('');
      Alert.alert(
        "Tabriklaymiz! 🎉",
        `"${newClanObj.name}" clani muvaffaqiyatli yaratildi! Siz clan yetakchisisiz.`
      );
    } catch (err) {
      Alert.alert("Xatolik", "Clan yaratishda xatolik yuz berdi");
    }
  };

  const handleLeaveClan = () => {
    Alert.alert(
      "Clanni tark etish",
      "Haqiqatan ham clanni tark etmoqchimisiz? (Boshlang'ich 'Erkin o'yinchi' holatiga qaytadi)",
      [
        { text: "Bekor qilish", style: "cancel" },
        {
          text: "Tark etish",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('@iqromax_user_clan');
              setUserClan(null);
              Alert.alert("Muvaffaqiyatli", "Siz clandan chiqdingiz. Erkin o'yinchi holatiga qaytdingiz.");
            } catch (e) {
              console.log(e);
            }
          },
        },
      ]
    );
  };

  const handleClanProfileMenu = () => {
    Alert.alert(
      userClan?.name || "Wolf Legends",
      `Daraja: ${userClan?.level || 12}\nA'zolar: ${userClan?.membersCount || 8}/${userClan?.maxMembers || 10}\nHolat: Faol Clan\nRolingiz: ${userClan?.role || 'A\'zo'}`,
      [
        { text: "Yopish", style: "cancel" },
        {
          text: "Clanni tark etish (Sinov uchun)",
          style: "destructive",
          onPress: handleLeaveClan,
        },
      ]
    );
  };

  const handleSearchClan = () => {
    Alert.alert("Clan izlash", "Clanlarni nomi yoki ID bo'yicha qidirish bo'limi");
  };

  const handleFeaturePress = (title) => {
    Alert.alert(title, `"${title}" sahifasi yaqin orada ishga tushadi!`);
  };

  return (
    <View style={styles.screenRoot}>
      <StatusBar barStyle="light-content" backgroundColor="#070814" />

      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleExitToMainSystem}
              style={styles.backBreadcrumb}
            >
              <View style={styles.backArrowBadge}>
                <Feather name="chevron-left" size={16} color="#C084FC" />
              </View>
              <Text style={styles.headerSubtitle}>IQROMAX Clan</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {activeBottomTab === 'Missions' ? 'Missions' : 'Home'}
            </Text>
            {activeBottomTab === 'Missions' && (
              <Text style={styles.headerMissionsSub}>Jamoaviy vazifalar va mukofotlar</Text>
            )}
          </View>

          <View style={styles.headerRight}>
            {/* Notification Bell */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.headerIconBtn}
              onPress={() => navigation.navigate('ClanNotificationsScreen')}
            >
              <Feather name="bell" size={20} color="#FFFFFF" />
              <View style={styles.notifDot} />
            </TouchableOpacity>

            {/* Profile Avatar / Icon or Info Icon for Missions */}
            {activeBottomTab === 'Missions' ? (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.headerIconBtn, { marginLeft: 10 }]}
                onPress={() => {
                  try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch (e) {}
                  Alert.alert(
                    "Clan Missions Qoidalari",
                    "• Daily vazifalar har kuni 00:00 da yangilanadi. Ularni bajarib tezkor XP va tangalar yig'asiz.\n\n• Weekly vazifalar har dushanba yangilanadi va Clan sandig'ini ochish uchun kalit hisoblanadi.\n\n• Clan missiyalari barcha a'zolarning birgalikdagi faolligi orqali bajariladi."
                  );
                }}
              >
                <Feather name="info" size={19} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.headerIconBtn, { marginLeft: 10 }]}
                onPress={() => {
                  if (userClan) {
                    handleClanProfileMenu();
                  } else {
                    Alert.alert("Profil", "Erkin o'yinchi (Hali hech qanday clanga a'zo emassiz)");
                  }
                }}
              >
                <Feather name="user" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Scrollable Content */}
        {activeBottomTab === 'Missions' ? (
          <MissionsTabContent navigation={navigation} />
        ) : (
          <Animated.ScrollView
            style={[
              styles.scrollContent,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: arrivalScaleAnim },
              ],
            },
          ]}
          contentContainerStyle={[styles.scrollInner, { paddingBottom: insets.bottom + 90 }]}
          showsVerticalScrollIndicator={false}
        >
          {userClan ? (
            /* ======================================================== */
            /* 1. ACTIVE CLAN VIEW (MEMBER / LEADER VIEW - 1:1 TO MOCKUP) */
            /* ======================================================== */
            <View style={styles.activeClanContentWrap}>
              {/* TOP CLAN BANNER CARD */}
              <View style={styles.activeHeroCard}>
                <LinearGradient
                  colors={['#17123A', '#130E2A', '#0B0A18']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                />

                {/* Ambient Top Glow */}
                <View style={styles.activeHeroGlow} />

                {/* Top Info Row */}
                <View style={styles.activeHeroTopRow}>
                  {/* Left: Shield Crown Emblem */}
                  <View style={styles.activeEmblemWrap}>
                    <Image
                      source={require('../assets/clan_shield_crown.png')}
                      style={styles.activeEmblemImg}
                      contentFit="contain"
                    />
                  </View>

                  {/* Center: Clan Meta */}
                  <View style={styles.activeHeroMetaCol}>
                    <Text style={styles.activeClanName} numberOfLines={1}>
                      {userClan?.name || 'Wolf Legends'}
                    </Text>
                    <Text style={styles.activeClanSubtitle}>
                      Lv. {userClan?.level || 12} · {userClan?.membersCount || 8}/{userClan?.maxMembers || 10} Members
                    </Text>
                    <View style={styles.activeStatusPill}>
                      <View style={styles.activeGreenDot} />
                      <Text style={styles.activeStatusText}>Active Clan</Text>
                    </View>
                  </View>

                  {/* Right: Wolf Head Art + Circular Chevron */}
                  <View style={styles.activeHeroRightCol}>
                    <Image
                      source={require('../assets/clan_active_wolf.png')}
                      style={styles.activeWolfArt}
                      contentFit="cover"
                    />
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.activeChevronBtn}
                      onPress={handleClanProfileMenu}
                    >
                      <Feather name="chevron-right" size={17} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Bottom: Clan XP Progress */}
                <View style={styles.activeXpSection}>
                  <View style={styles.activeXpLabelsRow}>
                    <Text style={styles.activeXpTitle}>Clan XP</Text>
                    <Text style={styles.activeXpValue}>7,250 / 10,000</Text>
                  </View>
                  <View style={styles.activeXpProgressBarTrack}>
                    <LinearGradient
                      colors={['#8B5CF6', '#C084FC']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.activeXpProgressBarFill, { width: '72.5%' }]}
                    />
                  </View>
                </View>
              </View>

              {/* 4 QUICK ACTION BUTTONS */}
              <View style={styles.activeActionsRow}>
                {/* 1: Activity -> OPENS CLAN ACTIVITY SCREEN! */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.activeActionCard}
                  onPress={() => navigation.navigate('ClanActivityScreen')}
                >
                  <View style={styles.activeActionIconBox}>
                    <Feather name="flag" size={22} color="#C084FC" />
                  </View>
                  <Text style={styles.activeActionLabel}>Activity</Text>
                </TouchableOpacity>

                {/* 2: Statistics */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.activeActionCard}
                  onPress={() => navigation.navigate('ClanStatisticsScreen')}
                >
                  <View style={styles.activeActionIconBox}>
                    <Feather name="bar-chart-2" size={22} color="#38BDF8" />
                  </View>
                  <Text style={styles.activeActionLabel}>Statistics</Text>
                </TouchableOpacity>

                {/* 3: Leaderboard */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.activeActionCard}
                  onPress={() => navigation.navigate('ClanLeaderboardScreen')}
                >
                  <View style={styles.activeActionIconBox}>
                    <Ionicons name="trophy-outline" size={22} color="#FBBF24" />
                  </View>
                  <Text style={styles.activeActionLabel}>Leaderboard</Text>
                </TouchableOpacity>

                {/* 4: Notifications (with unread dot) */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.activeActionCard}
                  onPress={() => navigation.navigate('ClanNotificationsScreen')}
                >
                  <View style={styles.activeActionIconBox}>
                    <Feather name="mail" size={22} color="#C084FC" />
                    <View style={styles.actionNotifDot} />
                  </View>
                  <Text style={styles.activeActionLabel}>Notifications</Text>
                </TouchableOpacity>
              </View>

              {/* THIS WEEK SECTION */}
              <View style={styles.activeSectionHeaderRow}>
                <Text style={styles.activeSectionTitle}>This Week</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => Alert.alert("Weekly Overview", "Bu haftadagi barcha janglar va faolliklar")}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <Text style={styles.activeSeeAllLink}>Weekly Overview</Text>
                  <Feather name="chevron-right" size={14} color="#A855F7" style={{ marginLeft: 2 }} />
                </TouchableOpacity>
              </View>

              <View style={styles.thisWeekCard}>
                {/* Battles */}
                <View style={styles.thisWeekCol}>
                  <MaterialCommunityIcons name="sword-cross" size={24} color="#EC4899" />
                  <Text style={styles.thisWeekValue}>24</Text>
                  <Text style={styles.thisWeekLabel}>Battles</Text>
                </View>

                <View style={styles.thisWeekDivider} />

                {/* Missions */}
                <View style={styles.thisWeekCol}>
                  <MaterialCommunityIcons name="target" size={24} color="#10B981" />
                  <Text style={styles.thisWeekValue}>86</Text>
                  <Text style={styles.thisWeekLabel}>Missions</Text>
                </View>

                <View style={styles.thisWeekDivider} />

                {/* Clan XP */}
                <View style={styles.thisWeekCol}>
                  <Ionicons name="layers" size={24} color="#FBBF24" />
                  <Text style={styles.thisWeekValue}>12K</Text>
                  <Text style={styles.thisWeekLabel}>Clan XP</Text>
                </View>
              </View>

              {/* SEASON 5 COMPETITION CARD */}
              <TouchableOpacity
                activeOpacity={0.88}
                style={styles.seasonCard}
                onPress={() => navigation.navigate('ClanSeasonScreen')}
              >
                <LinearGradient
                  colors={['#17123A', '#110E28']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.seasonTopRow}>
                  <Image
                    source={require('../assets/clan_season_shield.png')}
                    style={styles.seasonShieldImg}
                    contentFit="contain"
                  />
                  <View style={styles.seasonMetaCol}>
                    <Text style={styles.seasonTitle}>Season 5</Text>
                    <Text style={styles.seasonSubtitle}>Clan Competition</Text>
                  </View>

                  <View style={styles.seasonBadgePill}>
                    <Feather name="clock" size={11} color="#FDE047" />
                    <Text style={styles.seasonBadgeText}> 18d 12h left</Text>
                  </View>

                  <Feather name="chevron-right" size={16} color="#64748B" style={{ marginLeft: 8 }} />
                </View>

                {/* Season Progress */}
                <View style={styles.seasonProgressRow}>
                  <View style={styles.seasonProgressBarTrack}>
                    <LinearGradient
                      colors={['#8B5CF6', '#C084FC']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.seasonProgressBarFill, { width: '49%' }]}
                    />
                  </View>
                  <Text style={styles.seasonProgressXpText}>24,500 / 50,000 XP</Text>
                </View>
              </TouchableOpacity>

              {/* MEMBERS (8/10) SECTION */}
              <View style={styles.activeSectionHeaderRow}>
                <Text style={styles.activeSectionTitle}>Members (8/10)</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => Alert.alert("Clan A'zolari", "Barcha 8 nafar a'zolar ro'yxati va rollari")}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <Text style={styles.activeSeeAllLink}>View All</Text>
                  <Feather name="chevron-right" size={14} color="#A855F7" style={{ marginLeft: 2 }} />
                </TouchableOpacity>
              </View>

              <View style={styles.membersCard}>
                <View style={styles.membersRow}>
                  {/* Member 1: Leader (Alex) */}
                  <View style={styles.memberAvatarWrap}>
                    <View style={styles.memberLeaderCrown}>
                      <FontAwesome5 name="crown" size={8} color="#F59E0B" />
                    </View>
                    <Image
                      source={require('../assets/clan_avatar_1.png')}
                      style={styles.memberAvatarImg}
                      contentFit="cover"
                    />
                    <View style={styles.memberOnlineDot} />
                  </View>

                  {/* Member 2: Sophia */}
                  <View style={styles.memberAvatarWrap}>
                    <Image
                      source={require('../assets/clan_avatar_2.png')}
                      style={styles.memberAvatarImg}
                      contentFit="cover"
                    />
                    <View style={styles.memberOnlineDot} />
                  </View>

                  {/* Member 3: David */}
                  <View style={styles.memberAvatarWrap}>
                    <Image
                      source={require('../assets/clan_avatar_3.png')}
                      style={styles.memberAvatarImg}
                      contentFit="cover"
                    />
                    <View style={styles.memberOnlineDot} />
                  </View>

                  {/* Member 4: Kevin */}
                  <View style={styles.memberAvatarWrap}>
                    <Image
                      source={require('../assets/clan_avatar_4.png')}
                      style={styles.memberAvatarImg}
                      contentFit="cover"
                    />
                    <View style={styles.memberOnlineDot} />
                  </View>

                  {/* Member 5: Lily */}
                  <View style={styles.memberAvatarWrap}>
                    <Image
                      source={require('../assets/clan_avatar_5.png')}
                      style={styles.memberAvatarImg}
                      contentFit="cover"
                    />
                    <View style={styles.memberOnlineDot} />
                  </View>

                  {/* Member 6: +3 remaining bubble */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.memberMoreBubble}
                    onPress={() => Alert.alert("Qolgan a'zolar", "3 nafar a'zo hozirda oflayn")}
                  >
                    <Text style={styles.memberMoreText}>+3</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            /* ======================================================== */
            /* 2. UNASSIGNED CLAN VIEW (FREE AGENT VIEW) */
            /* ======================================================== */
            <>
              {/* 1. HERO CARD: "Hali hech qanday clanga a'zo emassiz" (Holographic Gateway & Perks) */}
              <View style={styles.heroCard}>
                {/* Mesh Gradient Card Backdrop */}
                <LinearGradient
                  colors={['#17113E', '#100E2B', '#090A1A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                />

                {/* Ambient Corner Glow Orbs */}
                <View style={styles.heroAmbientGlowTop} />
                <View style={styles.heroAmbientGlowBottom} />

                {/* Top Row: Content & Holographic Shield Sanctum */}
                <View style={styles.heroTopRow}>
                  {/* Left Column: Text & Perks */}
                  <View style={styles.heroLeftCol}>
                    {/* Status Indicator Pill */}
                    <View style={styles.heroStatusBadge}>
                      <View style={styles.heroStatusDotPulse}>
                        <View style={styles.heroStatusDot} />
                      </View>
                      <Text style={styles.heroStatusBadgeText}>STATUS: ERKIN O'YINCHI</Text>
                    </View>

                    <Text style={styles.heroTitle}>
                      Hali hech qanday{'\n'}
                      <Text style={styles.heroTitleHighlight}>clanga a'zo emassiz</Text>
                    </Text>

                    <Text style={styles.heroDesc}>
                      Clanga qo'shiling yoki o'z clangingizni yarating va jamoa bilan katta natijalarga erishing!
                    </Text>

                    {/* Clan Perks Preview Chips */}
                    <View style={styles.heroPerksRow}>
                      <View style={styles.heroPerkChip}>
                        <Text style={styles.heroPerkIcon}>⚡</Text>
                        <Text style={styles.heroPerkText}>+15% XP</Text>
                      </View>
                      <View style={styles.heroPerkChip}>
                        <Text style={styles.heroPerkIcon}>🛡️</Text>
                        <Text style={styles.heroPerkText}>Jamoa missiyalari</Text>
                      </View>
                      <View style={styles.heroPerkChip}>
                        <Text style={styles.heroPerkIcon}>🏆</Text>
                        <Text style={styles.heroPerkText}>Mavsum kubogi</Text>
                      </View>
                    </View>
                  </View>

                  {/* Right Column: Holographic Cyber-Shield Sanctum */}
                  <View style={styles.hologramSanctum}>
                    <LinearGradient
                      colors={['rgba(168, 85, 247, 0.45)', 'rgba(59, 130, 246, 0.2)', 'transparent']}
                      style={styles.hologramGlow}
                    />
                    <Svg width={105} height={105} viewBox="0 0 100 100">
                      <Defs>
                        <SvgGradient id="holoShieldGrad" x1="0" y1="0" x2="1" y2="1">
                          <Stop offset="0%" stopColor="#C084FC" />
                          <Stop offset="50%" stopColor="#8B5CF6" />
                          <Stop offset="100%" stopColor="#4C1D95" />
                        </SvgGradient>
                        <SvgGradient id="holoCrownGrad" x1="0" y1="0" x2="1" y2="1">
                          <Stop offset="0%" stopColor="#FDE68A" />
                          <Stop offset="100%" stopColor="#F59E0B" />
                        </SvgGradient>
                      </Defs>
                      {/* Outer dashed energy ring */}
                      <Circle
                        cx="50"
                        cy="50"
                        r="44"
                        fill="none"
                        stroke="#A855F7"
                        strokeWidth="1.2"
                        strokeDasharray="4 4"
                        opacity={0.65}
                      />
                      {/* Inner geometric hex */}
                      <Polygon
                        points="50,14 82,30 82,70 50,86 18,70 18,30"
                        fill="none"
                        stroke="#7C3AED"
                        strokeWidth="1.2"
                        opacity={0.4}
                      />
                      {/* Stylized Clan Shield */}
                      <Path
                        d="M50 20L28 32v22c0 14 9.5 27 22 30 12.5-3 22-16 22-30V32L50 20z"
                        fill="url(#holoShieldGrad)"
                        stroke="#E9D5FF"
                        strokeWidth="1.8"
                      />
                      {/* Golden Crown on Shield */}
                      <Path
                        d="M38 46l3.5 12h17l3.5-12-6 5-6-9-6 9-6-5z"
                        fill="url(#holoCrownGrad)"
                      />
                      {/* Center Star Core */}
                      <Circle cx="50" cy="53" r="3" fill="#FFFFFF" />
                    </Svg>
                    <View style={styles.holoBadgePill}>
                      <MaterialCommunityIcons name="shield-lock-outline" size={11} color="#C084FC" />
                      <Text style={styles.holoBadgeText}>CLAN ZALI</Text>
                    </View>
                  </View>
                </View>

                {/* Action Buttons Row */}
                <View style={styles.heroButtonsRow}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.heroBtnPrimary}
                    onPress={handleCreateClan}
                  >
                    <LinearGradient
                      colors={['#9333EA', '#7C3AED']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.heroBtnGradient}
                    >
                      <Feather name="plus" size={17} color="#FFFFFF" />
                      <Text style={styles.heroBtnPrimaryText}>Clan yaratish</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.heroBtnSecondary}
                    onPress={handleSearchClan}
                  >
                    <Feather name="search" size={16} color="#FFFFFF" />
                    <Text style={styles.heroBtnSecondaryText}>Clan izlash</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 2. 4 FEATURE CARDS GRID */}
              <View style={styles.featuresRow}>
                {/* Card 1: Jamoa bilan rivojlaning (Does NOT open Activity screen anymore!) */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.featureCard}
                  onPress={() => Alert.alert(
                    "Jamoa bilan rivojlaning",
                    "Clan faoliyatini kuzatish uchun avval biror clanga qo'shiling yoki o'z clangingizni yarating!"
                  )}
                >
                  <View style={[styles.featureIconWrap, { backgroundColor: 'rgba(192, 132, 252, 0.12)' }]}>
                    <Feather name="users" size={22} color="#C084FC" />
                  </View>
                  <Text style={styles.featureLabel}>Jamoa bilan{'\n'}rivojlaning</Text>
                </TouchableOpacity>

                {/* Card 2: Clan vazifalari */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.featureCard}
                  onPress={() => navigation.navigate('ClanMissionsScreen')}
                >
                  <View style={[styles.featureIconWrap, { backgroundColor: 'rgba(56, 189, 248, 0.12)' }]}>
                    <MaterialCommunityIcons name="target" size={24} color="#38BDF8" />
                  </View>
                  <Text style={styles.featureLabel}>Clan{'\n'}vazifalari</Text>
                </TouchableOpacity>

                {/* Card 3: Season reytingi */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.featureCard}
                  onPress={() => setActiveBottomTab('Season')}
                >
                  <View style={[styles.featureIconWrap, { backgroundColor: 'rgba(251, 191, 36, 0.12)' }]}>
                    <MaterialCommunityIcons name="trophy-outline" size={23} color="#FBBF24" />
                  </View>
                  <Text style={styles.featureLabel}>Season{'\n'}reytingi</Text>
                </TouchableOpacity>

                {/* Card 4: Clan bazasi */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.featureCard}
                  onPress={() => handleFeaturePress("Clan bazasi")}
                >
                  <View style={[styles.featureIconWrap, { backgroundColor: 'rgba(244, 114, 182, 0.12)' }]}>
                    <MaterialCommunityIcons name="castle" size={23} color="#F472B6" />
                  </View>
                  <Text style={styles.featureLabel}>Clan{'\n'}bazasi</Text>
                </TouchableOpacity>
              </View>

              {/* 3. TAVSIYA ETILGAN CLANLAR SECTION */}
              <View style={styles.recSectionCard}>
                <View style={styles.recSectionHeader}>
                  <Text style={styles.recSectionTitle}>Tavsiya etilgan clanlar</Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => Alert.alert("Clanlar", "Barcha mavjud clanlar ro'yxati")}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Text style={styles.recSeeAllText}>Barchasini ko'rish</Text>
                    <Feather name="chevron-right" size={14} color="#A855F7" style={{ marginLeft: 2 }} />
                  </TouchableOpacity>
                </View>

                {/* Clan 1: Wolf Legends */}
                <View style={styles.clanRowItem}>
                  <ClanShieldEmblem type="wolf" size={48} />
                  <View style={styles.clanItemInfo}>
                    <Text style={styles.clanItemName}>Wolf Legends</Text>
                    <View style={styles.clanItemMetaRow}>
                      <View style={styles.clanMetaPill}>
                        <Feather name="users" size={12} color="#94A3B8" />
                        <Text style={styles.clanMetaText}>8/10</Text>
                      </View>
                      <View style={[styles.clanMetaPill, { marginLeft: 12 }]}>
                        <MaterialCommunityIcons name="chart-bar" size={13} color="#94A3B8" />
                        <Text style={styles.clanMetaText}>Lv. 12</Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                      styles.clanActionBtn,
                      joinedClans.includes('Wolf Legends') && styles.clanActionBtnJoined,
                    ]}
                    onPress={() => handleJoinClan('Wolf Legends')}
                  >
                    <LinearGradient
                      colors={
                        joinedClans.includes('Wolf Legends')
                          ? ['#059669', '#10B981']
                          : ['#8B5CF6', '#6D28D9']
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.clanActionBtnGradient}
                    >
                      <Text style={styles.clanActionBtnText}>
                        {joinedClans.includes('Wolf Legends') ? "A'zo" : "Qo'shilish"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {/* Clan 2: Math Warriors */}
                <View style={styles.clanRowItem}>
                  <ClanShieldEmblem type="eagle" size={48} />
                  <View style={styles.clanItemInfo}>
                    <Text style={styles.clanItemName}>Math Warriors</Text>
                    <View style={styles.clanItemMetaRow}>
                      <View style={styles.clanMetaPill}>
                        <Feather name="users" size={12} color="#94A3B8" />
                        <Text style={styles.clanMetaText}>7/10</Text>
                      </View>
                      <View style={[styles.clanMetaPill, { marginLeft: 12 }]}>
                        <MaterialCommunityIcons name="chart-bar" size={13} color="#94A3B8" />
                        <Text style={styles.clanMetaText}>Lv. 11</Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                      styles.clanActionBtn,
                      joinedClans.includes('Math Warriors') && styles.clanActionBtnJoined,
                    ]}
                    onPress={() => handleJoinClan('Math Warriors')}
                  >
                    <LinearGradient
                      colors={
                        joinedClans.includes('Math Warriors')
                          ? ['#059669', '#10B981']
                          : ['#8B5CF6', '#6D28D9']
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.clanActionBtnGradient}
                    >
                      <Text style={styles.clanActionBtnText}>
                        {joinedClans.includes('Math Warriors') ? "A'zo" : "Qo'shilish"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {/* Clan 3: IQROMAX Elite */}
                <View style={[styles.clanRowItem, { borderBottomWidth: 0, paddingBottom: 4 }]}>
                  <ClanShieldEmblem type="elite" size={48} />
                  <View style={styles.clanItemInfo}>
                    <Text style={styles.clanItemName}>IQROMAX Elite</Text>
                    <View style={styles.clanItemMetaRow}>
                      <View style={styles.clanMetaPill}>
                        <Feather name="users" size={12} color="#94A3B8" />
                        <Text style={styles.clanMetaText}>9/10</Text>
                      </View>
                      <View style={[styles.clanMetaPill, { marginLeft: 12 }]}>
                        <MaterialCommunityIcons name="chart-bar" size={13} color="#94A3B8" />
                        <Text style={styles.clanMetaText}>Lv. 14</Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                      styles.clanRequestBtn,
                      requestedClans.includes('IQROMAX Elite') && styles.clanRequestBtnSent,
                    ]}
                    onPress={() => handleRequestClan('IQROMAX Elite')}
                  >
                    <Text
                      style={[
                        styles.clanRequestBtnText,
                        requestedClans.includes('IQROMAX Elite') && { color: '#FBBF24' },
                      ]}
                    >
                      {requestedClans.includes('IQROMAX Elite') ? "Yuborilgan" : "So'rov yuborish"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 4. CLAN CHEST REWARDS BANNER */}
              <TouchableOpacity
                activeOpacity={0.88}
                style={styles.rewardBannerCard}
                onPress={() => Alert.alert("Clan Mukofotlari", "Har haftalik jamoaviy Clan Chest va maxsus sovrinlar!")}
              >
                {/* Glowing Chest Graphic */}
                <View style={styles.chestImageWrap}>
                  <Image
                    source={require('../assets/clan_chest_purple.jpg')}
                    style={styles.chestImage}
                    contentFit="cover"
                  />
                </View>

                {/* Text description */}
                <View style={styles.rewardBannerTextWrap}>
                  <Text style={styles.rewardBannerTitle}>
                    Clanga qo'shiling va{'\n'}maxsus mukofotlarga ega bo'ling!
                  </Text>
                </View>

                {/* Chevron Arrow */}
                <Feather name="chevron-right" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </>
          )}
        </Animated.ScrollView>
        )}

        {/* 5. BOTTOM NAVIGATION BAR (Home, Missions, Season, Clan) */}
        <View style={[styles.bottomNavBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          {/* Tab 1: Home */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch (e) {}
              setActiveBottomTab('Home');
            }}
            style={styles.navTabItem}
          >
            {activeBottomTab === 'Home' ? (
              <LinearGradient
                colors={['rgba(168, 85, 247, 0.35)', 'rgba(99, 102, 241, 0.22)']}
                style={styles.activeTabPill}
              >
                <Ionicons name="home" size={20} color="#FFFFFF" />
                <Text style={styles.activeTabLabel}>Home</Text>
              </LinearGradient>
            ) : (
              <View style={styles.inactiveTabCol}>
                <Ionicons name="home-outline" size={21} color="#94A3B8" />
                <Text style={styles.inactiveTabLabel}>Home</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Tab 2: Missions */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch (e) {}
              setActiveBottomTab('Missions');
            }}
            style={styles.navTabItem}
          >
            {activeBottomTab === 'Missions' ? (
              <LinearGradient
                colors={['rgba(168, 85, 247, 0.35)', 'rgba(99, 102, 241, 0.22)']}
                style={styles.activeTabPill}
              >
                <MaterialCommunityIcons name="target" size={20} color="#FFFFFF" />
                <Text style={styles.activeTabLabel}>Missions</Text>
              </LinearGradient>
            ) : (
              <View style={styles.inactiveTabCol}>
                <MaterialCommunityIcons name="target" size={22} color="#94A3B8" />
                <Text style={styles.inactiveTabLabel}>Missions</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Tab 3: Season */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch (e) {}
              navigation.navigate('ClanSeasonScreen');
            }}
            style={styles.navTabItem}
          >
            {activeBottomTab === 'Season' ? (
              <LinearGradient
                colors={['rgba(168, 85, 247, 0.35)', 'rgba(99, 102, 241, 0.22)']}
                style={styles.activeTabPill}
              >
                <MaterialCommunityIcons name="trophy" size={20} color="#FFFFFF" />
                <Text style={styles.activeTabLabel}>Season</Text>
              </LinearGradient>
            ) : (
              <View style={styles.inactiveTabCol}>
                <MaterialCommunityIcons name="trophy-outline" size={22} color="#94A3B8" />
                <Text style={styles.inactiveTabLabel}>Season</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Tab 4: Clan */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch (e) {}
              navigation.navigate('ClanActivityScreen');
            }}
            style={styles.navTabItem}
          >
            {activeBottomTab === 'Clan' ? (
              <LinearGradient
                colors={['rgba(168, 85, 247, 0.35)', 'rgba(99, 102, 241, 0.22)']}
                style={styles.activeTabPill}
              >
                <MaterialCommunityIcons name="shield-crown" size={20} color="#FFFFFF" />
                <Text style={styles.activeTabLabel}>Clan</Text>
              </LinearGradient>
            ) : (
              <View style={styles.inactiveTabCol}>
                <MaterialCommunityIcons name="shield-outline" size={22} color="#94A3B8" />
                <Text style={styles.inactiveTabLabel}>Clan</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Clan Creation Modal (No Level 10 requirement) */}
        <Modal
          visible={isCreateModalOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsCreateModalOpen(false)}
        >
          <View style={styles.createModalOverlay}>
            <View style={styles.createModalCard}>
              {/* Modal Header */}
              <View style={styles.createModalHeader}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.createModalTitle}>Yangi Clan Yaratish</Text>
                  <Text style={styles.createModalSubtitle}>
                    O'z jamoangizni shakllantiring va birgalikda o'sing!
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.createModalCloseBtn}
                  onPress={() => setIsCreateModalOpen(false)}
                >
                  <Feather name="x" size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              {/* Input 1: Clan Nomi */}
              <Text style={styles.createInputLabel}>CLAN NOMI</Text>
              <TextInput
                style={styles.createTextInput}
                placeholder="Masalan: Wolf Legends, Cyber Kings..."
                placeholderTextColor="#64748B"
                value={newClanName}
                onChangeText={setNewClanName}
                maxLength={24}
              />

              {/* Input 2: Clan Shiori */}
              <Text style={styles.createInputLabel}>CLAN SHIORI / TAVSIF</Text>
              <TextInput
                style={styles.createTextInput}
                placeholder="Masalan: Doimo birga va cho'qqilar sari!"
                placeholderTextColor="#64748B"
                value={newClanDesc}
                onChangeText={setNewClanDesc}
                maxLength={60}
              />

              {/* Emblema tanlash */}
              <Text style={styles.createInputLabel}>EMBLEMA TANLANG</Text>
              <View style={styles.emblemPickRow}>
                {[
                  { id: 'wolf', label: 'Wolf' },
                  { id: 'eagle', label: 'Eagle' },
                  { id: 'elite', label: 'Elite' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    style={[
                      styles.emblemPickItem,
                      selectedEmblem === item.id && styles.emblemPickItemSelected,
                    ]}
                    onPress={() => setSelectedEmblem(item.id)}
                  >
                    <ClanShieldEmblem type={item.id} size={38} />
                    <Text
                      style={[
                        styles.emblemPickLabel,
                        selectedEmblem === item.id && { color: '#C084FC' },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Clan Turi */}
              <Text style={styles.createInputLabel}>QO'SHILISH TURI</Text>
              <View style={styles.createTypeRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.createTypeBtn, isClanOpen && styles.createTypeBtnActive]}
                  onPress={() => setIsClanOpen(true)}
                >
                  <Text
                    style={[
                      styles.createTypeBtnText,
                      isClanOpen && styles.createTypeBtnTextActive,
                    ]}
                  >
                    🌐 Ochiq Clan
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.createTypeBtn, !isClanOpen && styles.createTypeBtnActive]}
                  onPress={() => setIsClanOpen(false)}
                >
                  <Text
                    style={[
                      styles.createTypeBtnText,
                      !isClanOpen && styles.createTypeBtnTextActive,
                    ]}
                  >
                    🔒 So'rov orqali
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Test info notice */}
              <View style={styles.createNoticePill}>
                <MaterialCommunityIcons name="lightning-bolt" size={14} color="#FBBF24" />
                <Text style={styles.createNoticeText}>
                  Hozirgi sinov bosqichida istalgan darajada clan yarata olasiz!
                </Text>
              </View>

              {/* Action Buttons */}
              <TouchableOpacity
                activeOpacity={0.88}
                style={styles.createSubmitBtn}
                onPress={handleConfirmCreateClan}
              >
                <LinearGradient
                  colors={['#9333EA', '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.createSubmitGradient}
                >
                  <Text style={styles.createSubmitText}>Clanni Tasdiqlash va Yaratish</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>

      {/* Reverse Dimensional Portal Overlay (Clan -> IQROMAX Main System) */}
      {isExitPortalActive && (
        <Animated.View
          pointerEvents="auto"
          style={[
            StyleSheet.absoluteFillObject,
            {
              zIndex: 999999,
              backgroundColor: '#040714',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: exitOpacityAnim,
            },
          ]}
        >
          {/* Hyperspace Light Streaks (Golden & Cyan IQROMAX aura) */}
          <Animated.View
            style={{
              position: 'absolute',
              width: 380,
              height: 380,
              justifyContent: 'center',
              alignItems: 'center',
              transform: [
                { scale: exitRaysScaleAnim },
                {
                  rotate: exitRotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            }}
          >
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <View
                key={deg}
                style={{
                  position: 'absolute',
                  width: 3,
                  height: 480,
                  transform: [{ rotate: `${deg}deg` }],
                  opacity: 0.7,
                }}
              >
                <LinearGradient
                  colors={['transparent', '#F59E0B', '#38BDF8', 'transparent']}
                  style={{ flex: 1 }}
                />
              </View>
            ))}
          </Animated.View>

          {/* Outer Swirling Warp Vortex (IQROMAX Gold & Blue) */}
          <Animated.View
            style={{
              width: 250,
              height: 250,
              borderRadius: 125,
              justifyContent: 'center',
              alignItems: 'center',
              transform: [
                { scale: exitScaleAnim },
                {
                  rotate: exitRotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '720deg'],
                  }),
                },
              ],
            }}
          >
            {/* Outer Vortex Gradient Glow */}
            <LinearGradient
              colors={['#F59E0B', '#3B82F6', '#06B6D4', '#10B981', '#F59E0B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 250,
                height: 250,
                borderRadius: 125,
                position: 'absolute',
                opacity: 0.92,
              }}
            />

            {/* Counter-Rotating Rune Ring */}
            <Animated.View
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                borderWidth: 2,
                borderColor: '#FDE68A',
                borderStyle: 'dashed',
                position: 'absolute',
                transform: [
                  {
                    rotate: exitCounterRotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '-1080deg'],
                    }),
                  },
                ],
              }}
            />

            {/* Inner Dark Eye */}
            <View
              style={{
                width: 150,
                height: 150,
                borderRadius: 75,
                backgroundColor: '#050B1C',
                borderWidth: 3,
                borderColor: '#F59E0B',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#F59E0B',
                shadowOpacity: 1,
                shadowRadius: 22,
                elevation: 15,
              }}
            >
              <MaterialCommunityIcons name="home-variant" size={56} color="#FBBF24" />
            </View>
          </Animated.View>

          {/* Hyperdrive Sci-Fi HUD Label & Progress */}
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 110,
              alignItems: 'center',
              paddingHorizontal: 24,
              opacity: exitFlashAnim.interpolate({
                inputRange: [0, 0.4, 1],
                outputRange: [1, 0.6, 0],
              }),
            }}
          >
            {/* Top Holo Pill */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(245, 158, 11, 0.22)',
                borderWidth: 1,
                borderColor: 'rgba(245, 158, 11, 0.5)',
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 4,
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#F59E0B',
                  marginRight: 6,
                }}
              />
              <Text
                style={{
                  color: '#FDE68A',
                  fontSize: 10,
                  fontFamily: 'Inter_700Bold',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
                DIMENSIYA QAYTISHI | REVERSE WARP
              </Text>
            </View>

            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontFamily: 'Inter_900Black',
                letterSpacing: 2,
                textTransform: 'uppercase',
                textAlign: 'center',
              }}
            >
              IQROMAX TIZIMIGA QAYTILMOQDA...
            </Text>
            <Text
              style={{
                color: '#93C5FD',
                fontSize: 11,
                fontFamily: 'Inter_500Medium',
                marginTop: 4,
                textAlign: 'center',
              }}
            >
              Bosh sahifa, mashg'ulotlar va shaxsiy kabinet ochilmoqda
            </Text>

            {/* Glowing Golden Charging Progress Bar */}
            <View
              style={{
                width: 200,
                height: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 2,
                marginTop: 14,
                overflow: 'hidden',
              }}
            >
              <Animated.View
                style={{
                  height: '100%',
                  width: exitProgressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: '#F59E0B',
                  borderRadius: 2,
                }}
              />
            </View>
          </Animated.View>

          {/* Golden / White Flash Burst at Teleport */}
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: '#FFFBEB',
                opacity: exitFlashAnim,
              },
            ]}
          />
        </Animated.View>
      )}

      {/* Arrival Dissipating Flash */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: '#FFFFFF',
            opacity: arrivalFlashAnim,
            zIndex: 99998,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: '#070814',
  },
  safeArea: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? 10 : 4,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  backBreadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    marginLeft: -2,
  },
  backArrowBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(168, 85, 247, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#A8AABD',
    marginLeft: 2,
  },
  headerMissionsSub: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginTop: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter_900Black',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1B1C2A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A855F7',
    borderWidth: 1.5,
    borderColor: '#070814',
  },

  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  /* Hero Card (Holographic Gateway & Perks) */
  heroCard: {
    backgroundColor: '#100E2B',
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: 'rgba(168, 85, 247, 0.28)',
    overflow: 'hidden',
    position: 'relative',
    padding: 18,
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  heroAmbientGlowTop: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(168, 85, 247, 0.18)',
  },
  heroAmbientGlowBottom: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroLeftCol: {
    flex: 1,
    paddingRight: 10,
  },
  heroStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    marginBottom: 8,
  },
  heroStatusDotPulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(192, 132, 252, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  heroStatusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#C084FC',
  },
  heroStatusBadgeText: {
    fontSize: 9.5,
    fontFamily: 'Inter_700Bold',
    color: '#E9D5FF',
    letterSpacing: 0.6,
  },
  heroTitle: {
    fontSize: 19.5,
    fontFamily: 'Inter_800ExtraBold',
    color: '#FFFFFF',
    lineHeight: 25,
  },
  heroTitleHighlight: {
    color: '#C084FC',
  },
  heroDesc: {
    fontSize: 11.5,
    fontFamily: 'Inter_500Medium',
    color: 'rgba(224, 231, 255, 0.72)',
    lineHeight: 17,
    marginTop: 6,
  },
  heroPerksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  heroPerkChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  heroPerkIcon: {
    fontSize: 10,
    marginRight: 4,
  },
  heroPerkText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: '#E0E7FF',
  },
  hologramSanctum: {
    width: 105,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  hologramGlow: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    opacity: 0.8,
  },
  holoBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 16, 45, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.4)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: -4,
  },
  holoBadgeText: {
    fontSize: 8.5,
    fontFamily: 'Inter_800ExtraBold',
    color: '#E9D5FF',
    letterSpacing: 0.6,
    marginLeft: 3,
  },
  heroButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  heroBtnPrimary: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  heroBtnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  heroBtnPrimaryText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  heroBtnSecondary: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(15, 16, 35, 0.85)',
    borderWidth: 1.2,
    borderColor: 'rgba(168, 85, 247, 0.45)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  heroBtnSecondaryText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    marginLeft: 6,
  },

  /* 4 Feature Cards */
  featuresRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#101223',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 96,
  },
  featureIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#E2E8F0',
    textAlign: 'center',
    marginTop: 7,
    lineHeight: 14,
  },

  /* Recommended Section */
  recSectionCard: {
    marginTop: 14,
    backgroundColor: '#101124',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 16,
  },
  recSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  recSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  recSeeAllText: {
    fontSize: 12.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#A855F7',
  },

  clanRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  emblemContainer: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  emblemBg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#A855F7',
  },
  clanItemInfo: {
    flex: 1,
    marginLeft: 14,
  },
  clanItemName: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  clanItemMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clanMetaPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clanMetaText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginLeft: 5,
  },

  clanActionBtn: {
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    minWidth: 92,
  },
  clanActionBtnGradient: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clanActionBtnText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  clanActionBtnJoined: {
    opacity: 0.9,
  },

  clanRequestBtn: {
    height: 36,
    borderRadius: 18,
    backgroundColor: '#16172E',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clanRequestBtnSent: {
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  clanRequestBtnText: {
    fontSize: 12.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },

  /* Clan Chest Banner */
  rewardBannerCard: {
    marginTop: 14,
    backgroundColor: '#121128',
    borderWidth: 1.2,
    borderColor: 'rgba(168, 85, 247, 0.28)',
    borderRadius: 20,
    padding: 12,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  chestImageWrap: {
    width: 64,
    height: 64,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.4)',
    backgroundColor: '#1D1338',
  },
  chestImage: {
    width: '100%',
    height: '100%',
  },
  rewardBannerTextWrap: {
    flex: 1,
    marginLeft: 14,
    marginRight: 6,
  },
  rewardBannerTitle: {
    fontSize: 13.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    lineHeight: 19,
  },

  /* Fixed Bottom Nav Bar */
  bottomNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#090A17',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 8,
    paddingHorizontal: 12,
  },
  navTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
  },
  activeTabPill: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 22,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.5)',
  },
  activeTabLabel: {
    fontSize: 10.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  inactiveTabCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveTabLabel: {
    fontSize: 10.5,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginTop: 3,
  },

  /* Active Clan View Styles (1:1 matching mockup) */
  activeClanContentWrap: {
    marginTop: 4,
  },
  activeHeroCard: {
    backgroundColor: '#14102C',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.28)',
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 4,
  },
  activeHeroGlow: {
    position: 'absolute',
    top: -30,
    right: 40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(168, 85, 247, 0.16)',
  },
  activeHeroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeEmblemWrap: {
    width: 60,
    height: 60,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeEmblemImg: {
    width: 60,
    height: 60,
  },
  activeHeroMetaCol: {
    flex: 1,
    justifyContent: 'center',
  },
  activeClanName: {
    fontSize: 18.5,
    fontFamily: 'Inter_900Black',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  activeClanSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#A78BFA',
    marginTop: 2,
  },
  activeStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.14)',
    borderColor: 'rgba(16, 185, 129, 0.32)',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  activeGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 5,
  },
  activeStatusText: {
    fontSize: 10.5,
    fontFamily: 'Inter_700Bold',
    color: '#34D399',
  },
  activeHeroRightCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeWolfArt: {
    width: 82,
    height: 62,
    borderRadius: 12,
    marginRight: 8,
  },
  activeChevronBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeXpSection: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  activeXpLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  activeXpTitle: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#94A3B8',
  },
  activeXpValue: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  activeXpProgressBarTrack: {
    height: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3.5,
    overflow: 'hidden',
  },
  activeXpProgressBarFill: {
    height: '100%',
    borderRadius: 3.5,
  },

  /* 4 Quick Action Cards */
  activeActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  activeActionCard: {
    flex: 1,
    backgroundColor: '#131126',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 2,
    alignItems: 'center',
    marginHorizontal: 3.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  activeActionIconBox: {
    position: 'relative',
    marginBottom: 6,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionNotifDot: {
    position: 'absolute',
    top: -2,
    right: -6,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#C084FC',
  },
  activeActionLabel: {
    fontSize: 11.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#E2E8F0',
    textAlign: 'center',
  },

  /* This Week Section */
  activeSectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 10,
  },
  activeSectionTitle: {
    fontSize: 17.5,
    fontFamily: 'Inter_800ExtraBold',
    color: '#FFFFFF',
  },
  activeSeeAllLink: {
    fontSize: 12.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#A855F7',
  },
  thisWeekCard: {
    backgroundColor: '#121124',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  thisWeekCol: {
    flex: 1,
    alignItems: 'center',
  },
  thisWeekValue: {
    fontSize: 22,
    fontFamily: 'Inter_900Black',
    color: '#FFFFFF',
    marginTop: 6,
  },
  thisWeekLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginTop: 2,
  },
  thisWeekDivider: {
    width: 1,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
  },

  /* Season 5 Section */
  seasonCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.22)',
    padding: 16,
    overflow: 'hidden',
    marginTop: 14,
    position: 'relative',
  },
  seasonTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seasonShieldImg: {
    width: 52,
    height: 52,
    marginRight: 10,
  },
  seasonMetaCol: {
    flex: 1,
  },
  seasonTitle: {
    fontSize: 17,
    fontFamily: 'Inter_800ExtraBold',
    color: '#FFFFFF',
  },
  seasonSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginTop: 2,
  },
  seasonBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(234, 179, 8, 0.12)',
    borderColor: 'rgba(234, 179, 8, 0.28)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
  },
  seasonBadgeText: {
    fontSize: 10.5,
    fontFamily: 'Inter_700Bold',
    color: '#FDE047',
  },
  seasonProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  seasonProgressBarTrack: {
    flex: 1,
    height: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3.5,
    overflow: 'hidden',
  },
  seasonProgressBarFill: {
    height: '100%',
    borderRadius: 3.5,
  },
  seasonProgressXpText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#CBD5E1',
    marginLeft: 12,
  },

  /* Members Section */
  membersCard: {
    backgroundColor: '#121124',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberAvatarWrap: {
    position: 'relative',
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarImg: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  memberLeaderCrown: {
    position: 'absolute',
    top: -5,
    left: -2,
    zIndex: 10,
    backgroundColor: '#271705',
    paddingHorizontal: 3.5,
    paddingVertical: 1.5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  memberOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#121124',
  },
  memberMoreBubble: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#1A1830',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberMoreText: {
    fontSize: 14.5,
    fontFamily: 'Inter_700Bold',
    color: '#94A3B8',
  },

  /* Clan Creation Modal Styles */
  createModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 18, 0.86)',
    justifyContent: 'center',
    padding: 18,
  },
  createModalCard: {
    backgroundColor: '#131128',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.45)',
    padding: 20,
    shadowColor: '#9333EA',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  createModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  createModalTitle: {
    fontSize: 19,
    fontFamily: 'Inter_900Black',
    color: '#FFFFFF',
  },
  createModalSubtitle: {
    fontSize: 11.5,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginTop: 2,
  },
  createModalCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createInputLabel: {
    fontSize: 10.5,
    fontFamily: 'Inter_700Bold',
    color: '#A78BFA',
    letterSpacing: 0.8,
    marginBottom: 5,
    marginTop: 9,
  },
  createTextInput: {
    backgroundColor: '#0D0A1C',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 13.5,
    fontFamily: 'Inter_500Medium',
  },
  emblemPickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 6,
  },
  emblemPickItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 3,
    backgroundColor: '#0E0C20',
  },
  emblemPickItemSelected: {
    borderColor: '#A855F7',
    backgroundColor: 'rgba(168, 85, 247, 0.16)',
  },
  emblemPickLabel: {
    fontSize: 10.5,
    fontFamily: 'Inter_700Bold',
    color: '#94A3B8',
    marginTop: 3,
  },
  createTypeRow: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 12,
  },
  createTypeBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    marginHorizontal: 3,
    backgroundColor: '#0E0C20',
  },
  createTypeBtnActive: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  createTypeBtnText: {
    fontSize: 11.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#94A3B8',
  },
  createTypeBtnTextActive: {
    color: '#34D399',
  },
  createNoticePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.22)',
  },
  createNoticeText: {
    flex: 1,
    marginLeft: 6,
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#FDE68A',
    lineHeight: 15,
  },
  createSubmitBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  createSubmitGradient: {
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createSubmitText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
});
