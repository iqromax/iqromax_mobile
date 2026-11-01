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
} from 'react-native';
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
      navigation.goBack();
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

  const handleJoinClan = (clanName) => {
    if (joinedClans.includes(clanName)) return;
    setJoinedClans((prev) => [...prev, clanName]);
    Alert.alert(
      "Muvaffaqiyatli!",
      `Siz "${clanName}" claniga muvaffaqiyatli qo'shildingiz! 🎉`
    );
  };

  const handleRequestClan = (clanName) => {
    if (requestedClans.includes(clanName)) return;
    setRequestedClans((prev) => [...prev, clanName]);
    Alert.alert(
      "So'rov yuborildi!",
      `"${clanName}" claniga qo'shilish so'rovi yuborildi. Clan yetakchisi tasdiqlashini kuting.`
    );
  };

  const handleCreateClan = () => {
    Alert.alert(
      "Clan yaratish",
      "Clan yaratish uchun kamida 10-daraja (Player Level 10) talab qilinadi. Tez orada to'liq Clan yaratish formasi ochiladi!"
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
            <Text style={styles.headerTitle}>Home</Text>
          </View>

          <View style={styles.headerRight}>
            {/* Notification Bell */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.headerIconBtn}
              onPress={() => Alert.alert("Bildirishnomalar", "Clan bo'yicha yangi bildirishnomalar yo'q")}
            >
              <Feather name="bell" size={20} color="#FFFFFF" />
              <View style={styles.notifDot} />
            </TouchableOpacity>

            {/* Profile Avatar / Icon */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.headerIconBtn, { marginLeft: 10 }]}
              onPress={() => Alert.alert("Profil", "Clan a'zolik profili")}
            >
              <Feather name="user" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Content */}
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
          {/* 1. HERO CARD: "Hali hech qanday clanga a'zo emassiz" */}
          <View style={styles.heroCard}>
            {/* Hero Artwork on the Right with Gradient Overlay */}
            <View style={styles.heroArtWrapper}>
              <Image
                source={require('../assets/clan_hero_banner.jpg')}
                style={styles.heroArtImage}
                contentFit="cover"
              />
              <LinearGradient
                colors={['#101124', 'rgba(16, 17, 36, 0.75)', 'transparent']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 0.7, y: 0.5 }}
                style={StyleSheet.absoluteFillObject}
              />
              <LinearGradient
                colors={['transparent', 'rgba(16, 17, 36, 0.95)', '#101124']}
                start={{ x: 0.5, y: 0.3 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />
            </View>

            {/* Hero Content */}
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>
                Hali hech qanday{'\n'}clanga a'zo emassiz
              </Text>
              <Text style={styles.heroDesc}>
                Clanga qo'shiling yoki o'z clangingizni yarating va jamoa bilan katta natijalarga erishing!
              </Text>

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
          </View>

          {/* 2. 4 FEATURE CARDS GRID */}
          <View style={styles.featuresRow}>
            {/* Card 1: Jamoa bilan rivojlaning */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.featureCard}
              onPress={() => handleFeaturePress("Jamoa bilan rivojlaning")}
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
              onPress={() => setActiveBottomTab('Missions')}
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
        </Animated.ScrollView>

        {/* 5. BOTTOM NAVIGATION BAR (Home, Missions, Season, Clan) */}
        <View style={[styles.bottomNavBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          {/* Tab 1: Home */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveBottomTab('Home')}
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
              setActiveBottomTab('Missions');
              Alert.alert("Missions", "Clan Missions bo'limi keyingi bosqichda to'liq ochiladi!");
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
              setActiveBottomTab('Season');
              Alert.alert("Season", "Mavsumiy League va turnirlar bo'limi!");
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
              setActiveBottomTab('Clan');
              Alert.alert("Clan", "Clan profili, a'zolar va baza boshqaruvi!");
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

  /* Hero Card */
  heroCard: {
    backgroundColor: '#101124',
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: 'rgba(168, 85, 247, 0.22)',
    overflow: 'hidden',
    position: 'relative',
    padding: 20,
    minHeight: 220,
    justifyContent: 'center',
  },
  heroArtWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '65%',
    overflow: 'hidden',
  },
  heroArtImage: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
  },
  heroTitle: {
    fontSize: 21,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    lineHeight: 27,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  heroDesc: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: 'rgba(224, 231, 255, 0.75)',
    lineHeight: 18,
    marginTop: 8,
    maxWidth: '68%',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  heroBtnPrimary: {
    flex: 1,
    height: 44,
    borderRadius: 22,
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
    paddingHorizontal: 14,
  },
  heroBtnPrimaryText: {
    fontSize: 13.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  heroBtnSecondary: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(12, 13, 28, 0.85)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  heroBtnSecondaryText: {
    fontSize: 13.5,
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
});
