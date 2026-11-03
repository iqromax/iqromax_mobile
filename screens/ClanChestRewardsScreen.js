import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Alert,
  Modal,
  Image as RNImage,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image as ExpoImage } from 'expo-image';
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
  Rect,
  G,
} from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { getClanTranslations } from '../src/utils/clanTranslations';

const { width } = Dimensions.get('window');

// 3 Top Navigation Tabs
const TOP_TABS = [
  { id: 'chest', label: 'Clan Chest', icon: 'calendar-outline', family: 'ionicons' },
  { id: 'history', label: 'Rewards History', icon: 'history', family: 'materialCommunity' },
  { id: 'my_rewards', label: 'My Rewards', icon: 'gift', family: 'feather' },
];

// Timeline Levels (1 to 5)
const TIMELINE_LEVELS = [
  { level: 1, label: 'Lv. 1', status: 'completed' },
  { level: 2, label: 'Lv. 2', status: 'completed' },
  { level: 3, label: 'Lv. 3', status: 'current' }, // Currently active
  { level: 4, label: 'Lv. 4', status: 'locked' },
  { level: 5, label: 'Lv. 5', status: 'locked' },
];

// 5 Rewards for Next Chest (Lv. 3)
const CHEST_REWARDS = [
  {
    id: 'xp',
    type: 'shield',
    amount: '+500',
    title: 'Clan XP',
    desc: "Clan darajasini ko'tarish uchun 500 tajriba ochkosi",
    color: '#A855F7',
  },
  {
    id: 'coin',
    type: 'coin',
    amount: '+100',
    title: 'Coin',
    desc: "Do'konda maxsus buyumlar xarid qilish uchun 100 tanga",
    color: '#FBBF24',
  },
  {
    id: 'energy',
    type: 'energy',
    amount: '+3',
    title: 'Energy',
    desc: "Masala va darslarni yechish uchun 3 ta qo'shimcha energiya",
    color: '#38BDF8',
  },
  {
    id: 'boost',
    type: 'boost',
    amount: '+1',
    title: 'XP Boost',
    sub: '(1 kun)',
    desc: "24 soat davomida barcha to'plangan XP ni 2 barobarga oshiradi",
    color: '#4ADE80',
  },
  {
    id: 'mystery',
    type: 'mystery',
    amount: 'Tasodifiy',
    title: 'bonus',
    desc: "Noyob avatar ramkasi, emodzi yoki eksklyuziv sovg'a",
    color: '#C084FC',
  },
];

// 3 Conditions for unlocking
const CHEST_CONDITIONS = [
  {
    id: 1,
    title: "Jamoaviy 1,000 XP yig'ish",
    current: '720 / 1,000',
    completed: true,
  },
  {
    id: 2,
    title: "Kamida 5 ta a'zo vazifa bajarishi",
    current: '8 / 5',
    completed: true,
    highlightGreen: true,
  },
  {
    id: 3,
    title: "Vazifa muddatida bajarilishi",
    current: '2 kun 14 soat',
    completed: false,
    hasClock: true,
  },
];

// Past Chest History Data
const PAST_CHEST_HISTORY = [
  {
    id: 1,
    title: 'Clan Chest (Level 2)',
    date: 'Kecha, 23:59',
    rewards: '+250 Clan XP, +50 Coin, +1 Energy',
    status: "Ochilgan va bo'lingan",
  },
  {
    id: 2,
    title: 'Clan Chest (Level 1)',
    date: '3 kun oldin',
    rewards: '+100 Clan XP, +25 Coin',
    status: "Ochilgan va bo'lingan",
  },
];

// Dedicated animated chest component for maximum compatibility and smoothness
function ChestAnimatedDisplay({ style }) {
  const [useRNFallback, setUseRNFallback] = useState(false);
  const gifSource = require('../assets/sirli_sandiq_high_quality_nurli.gif');

  if (useRNFallback) {
    return (
      <RNImage
        source={gifSource}
        style={style}
        resizeMode="contain"
      />
    );
  }

  return (
    <ExpoImage
      source={gifSource}
      style={style}
      contentFit="contain"
      autoplay={true}
      priority="high"
      cachePolicy="memory-disk"
      onError={() => {
        setUseRNFallback(true);
      }}
    />
  );
}

export default function ClanChestRewardsScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const language = route?.params?.language || 'uz';
  const t = getClanTranslations(language);
  const [activeTab, setActiveTab] = useState('chest');
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);

  const triggerHaptic = (type = 'light') => {
    try {
      if (type === 'medium') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (e) {}
  };

  const handleTabPress = (tabId) => {
    triggerHaptic();
    setActiveTab(tabId);
  };

  const handleChestOpenPress = () => {
    triggerHaptic('medium');
    Alert.alert(
      "Sandiq qulflangan 🔒",
      "Level 3 Sandiqni ochish uchun jamoaviy 1,000 XP to'planishi kerak.\n\nHozirgi progress: 720 / 1,000 XP (yana 280 XP qoldi).\nJamoa a'zolaringiz bilan birgalikda missiyalarni bajaring!",
      [
        { text: "Tushundim", style: "cancel" },
        {
          text: "Missiyalarga o'tish",
          onPress: () => navigation.navigate('ClanMissionsScreen'),
        },
      ]
    );
  };

  const handleRewardPress = (reward) => {
    triggerHaptic();
    setSelectedReward(reward);
  };

  // Render medieval hanging banner with golden crown on left/right
  const renderMedievalBanner = (side = 'left') => {
    return (
      <View style={[styles.bannerContainer, side === 'right' && styles.bannerRight]}>
        <Svg width={46} height={80} viewBox="0 0 46 80">
          <Defs>
            <SvgGradient id="bannerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#4C1D95" />
              <Stop offset="50%" stopColor="#3B0764" />
              <Stop offset="100%" stopColor="#1E1B4B" />
            </SvgGradient>
            <SvgGradient id="goldRodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#F59E0B" />
              <Stop offset="50%" stopColor="#FDE047" />
              <Stop offset="100%" stopColor="#D97706" />
            </SvgGradient>
          </Defs>

          {/* Hanging Rod with Finials */}
          <Rect x="2" y="3" width="42" height="4" rx="2" fill="url(#goldRodGrad)" />
          <Circle cx="3" cy="5" r="3.5" fill="#FBBF24" />
          <Circle cx="43" cy="5" r="3.5" fill="#FBBF24" />

          {/* Pennant Fabric with V-cut at bottom */}
          <Path
            d="M 6 7 L 40 7 L 40 60 L 23 75 L 6 60 Z"
            fill="url(#bannerGrad)"
            stroke="#D97706"
            strokeWidth="1.5"
          />

          {/* Inner Golden Border */}
          <Path
            d="M 9 10 L 37 10 L 37 57 L 23 69 L 9 57 Z"
            fill="none"
            stroke="#FBBF24"
            strokeWidth="0.8"
            strokeDasharray="2, 2"
            opacity="0.7"
          />

          {/* Golden Crown in Center */}
          <G transform="translate(13, 26) scale(0.68)">
            <Path
              d="M 2 18 L 6 5 L 14 12 L 22 5 L 26 18 Z"
              fill="#FBBF24"
              stroke="#D97706"
              strokeWidth="1"
            />
            <Circle cx="6" cy="4" r="1.5" fill="#FEF08A" />
            <Circle cx="14" cy="11" r="1.5" fill="#FEF08A" />
            <Circle cx="22" cy="4" r="1.5" fill="#FEF08A" />
            <Rect x="2" y="19" width="24" height="3" rx="1.5" fill="#F59E0B" />
          </G>
        </Svg>
      </View>
    );
  };

  // Render miniature chests for the 5 progression levels
  const renderTimelineChest = (levelItem) => {
    const isCompleted = levelItem.status === 'completed';
    const isCurrent = levelItem.status === 'current';
    const isLocked = levelItem.status === 'locked';

    if (isCompleted) {
      return (
        <View style={styles.timelineNodeBox}>
          <View style={styles.miniChestWrap}>
            <Svg width={36} height={30} viewBox="0 0 36 30">
              <Defs>
                <SvgGradient id="miniChestWood" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#7C3AED" />
                  <Stop offset="100%" stopColor="#4C1D95" />
                </SvgGradient>
              </Defs>
              {/* Chest base */}
              <Rect x="4" y="10" width="28" height="18" rx="3" fill="url(#miniChestWood)" stroke="#F59E0B" strokeWidth="1.2" />
              {/* Chest lid */}
              <Path d="M 4 10 Q 18 3 32 10 Z" fill="#9333EA" stroke="#F59E0B" strokeWidth="1.2" />
              {/* Center latch */}
              <Rect x="15" y="9" width="6" height="7" rx="1.5" fill="#FDE047" stroke="#D97706" strokeWidth="0.8" />
            </Svg>

            {/* Green Checkmark Badge */}
            <View style={styles.miniCheckBadge}>
              <Ionicons name="checkmark" size={10} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.timelineLevelTextCompleted}>{levelItem.label}</Text>
        </View>
      );
    }

    if (isCurrent) {
      return (
        <View style={styles.timelineNodeBox}>
          <View style={styles.currentChestWrap}>
            {/* Glowing Halo around Lv 3 chest */}
            <View style={styles.currentChestHalo} />
            <Svg width={42} height={34} viewBox="0 0 42 34">
              <Defs>
                <SvgGradient id="goldChestGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#A855F7" />
                  <Stop offset="50%" stopColor="#7C3AED" />
                  <Stop offset="100%" stopColor="#581C87" />
                </SvgGradient>
                <SvgGradient id="goldLidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#FBBF24" />
                  <Stop offset="100%" stopColor="#D97706" />
                </SvgGradient>
              </Defs>
              {/* Body */}
              <Rect x="5" y="12" width="32" height="20" rx="3.5" fill="url(#goldChestGlow)" stroke="#FBBF24" strokeWidth="1.8" />
              {/* Lid */}
              <Path d="M 5 12 Q 21 4 37 12 Z" fill="#9333EA" stroke="#FBBF24" strokeWidth="1.8" />
              {/* Golden trim straps */}
              <Rect x="11" y="6" width="3" height="26" fill="url(#goldLidGrad)" opacity="0.9" />
              <Rect x="28" y="6" width="3" height="26" fill="url(#goldLidGrad)" opacity="0.9" />
              {/* Glowing gem latch */}
              <Rect x="17.5" y="10" width="7" height="8" rx="2" fill="#FDE047" stroke="#B45309" strokeWidth="1" />
              <Circle cx="21" cy="14" r="1.5" fill="#E11D48" />
            </Svg>
          </View>
          <Text style={styles.timelineLevelTextCurrent}>{levelItem.label}</Text>
        </View>
      );
    }

    // Locked Level (Lv 4, Lv 5)
    return (
      <View style={styles.timelineNodeBox}>
        <View style={styles.lockedChestWrap}>
          <Svg width={36} height={30} viewBox="0 0 36 30">
            <Defs>
              <SvgGradient id="lockedChest" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#334155" />
                <Stop offset="100%" stopColor="#1E293B" />
              </SvgGradient>
            </Defs>
            {/* Body */}
            <Rect x="5" y="10" width="26" height="17" rx="3" fill="url(#lockedChest)" stroke="#475569" strokeWidth="1" />
            {/* Lid */}
            <Path d="M 5 10 Q 18 4 31 10 Z" fill="#475569" stroke="#64748B" strokeWidth="1" />
          </Svg>
          <View style={styles.lockedIconCenter}>
            <Feather name="lock" size={11} color="#94A3B8" />
          </View>
        </View>
        <Text style={styles.timelineLevelTextLocked}>{levelItem.label}</Text>
      </View>
    );
  };

  // Render individual reward item in the 5-item row
  const renderRewardItem = (reward) => {
    return (
      <TouchableOpacity
        key={reward.id}
        activeOpacity={0.8}
        style={styles.rewardCol}
        onPress={() => handleRewardPress(reward)}
      >
        <View style={styles.rewardIconCircle}>
          {reward.type === 'shield' && (
            <View style={styles.shieldGlowWrap}>
              <MaterialCommunityIcons name="shield-star" size={26} color="#A855F7" />
            </View>
          )}

          {reward.type === 'coin' && (
            <Svg width={28} height={28} viewBox="0 0 32 32">
              <Defs>
                <SvgGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#FDE047" />
                  <Stop offset="70%" stopColor="#F59E0B" />
                  <Stop offset="100%" stopColor="#D97706" />
                </SvgGradient>
              </Defs>
              {/* Back coin */}
              <Circle cx="12" cy="18" r="9" fill="url(#coinGrad)" stroke="#B45309" strokeWidth="1" />
              {/* Front coin */}
              <Circle cx="18" cy="14" r="10" fill="url(#coinGrad)" stroke="#B45309" strokeWidth="1.2" />
              <Circle cx="18" cy="14" r="7.5" fill="none" stroke="#FEF08A" strokeWidth="0.8" />
              <Path d="M 18 10 L 18 18 M 16 12 L 20 12 M 16 16 L 20 16" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" />
            </Svg>
          )}

          {reward.type === 'energy' && (
            <View style={styles.energyBoltWrap}>
              <Ionicons name="flash" size={24} color="#38BDF8" />
            </View>
          )}

          {reward.type === 'boost' && (
            <Svg width={30} height={24} viewBox="0 0 36 26">
              <Defs>
                <SvgGradient id="ticketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#4ADE80" />
                  <Stop offset="100%" stopColor="#16A34A" />
                </SvgGradient>
              </Defs>
              <Rect x="2" y="2" width="32" height="22" rx="4" fill="url(#ticketGrad)" stroke="#86EFAC" strokeWidth="1" />
              <Circle cx="2" cy="13" r="3.5" fill="#0D091F" />
              <Circle cx="34" cy="13" r="3.5" fill="#0D091F" />
              <Text style={{ position: 'absolute', top: 5, left: 9, fontSize: 10, fontWeight: '900', color: '#064E3B' }}>
                XP
              </Text>
            </Svg>
          )}

          {reward.type === 'mystery' && (
            <Svg width={28} height={28} viewBox="0 0 32 32">
              <Defs>
                <SvgGradient id="boxTop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#C084FC" />
                  <Stop offset="100%" stopColor="#9333EA" />
                </SvgGradient>
                <SvgGradient id="boxLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#7E22CE" />
                  <Stop offset="100%" stopColor="#581C87" />
                </SvgGradient>
                <SvgGradient id="boxRight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#9333EA" />
                  <Stop offset="100%" stopColor="#6B21A8" />
                </SvgGradient>
              </Defs>
              {/* Isometric 3D Gift Box */}
              <Polygon points="16,3 28,10 16,17 4,10" fill="url(#boxTop)" stroke="#E9D5FF" strokeWidth="0.8" />
              <Polygon points="4,10 16,17 16,29 4,22" fill="url(#boxLeft)" stroke="#E9D5FF" strokeWidth="0.8" />
              <Polygon points="16,17 28,10 28,22 16,29" fill="url(#boxRight)" stroke="#E9D5FF" strokeWidth="0.8" />
              {/* Ribbon or question mark */}
              <Path d="M 14 20 Q 16 18 16 17 Q 16 15 14 15" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
              <Circle cx="14" cy="22" r="0.8" fill="#FFFFFF" />
            </Svg>
          )}
        </View>

        <Text
          style={[
            styles.rewardAmount,
            reward.type === 'coin' && { color: '#FBBF24' },
            reward.type === 'energy' && { color: '#38BDF8' },
            reward.type === 'boost' && { color: '#4ADE80' },
          ]}
          numberOfLines={1}
        >
          {reward.amount}
        </Text>

        <Text style={styles.rewardTitle} numberOfLines={1}>
          {reward.title}
        </Text>
        {reward.sub && <Text style={styles.rewardSub}>{reward.sub}</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070514" />

      {/* 1. HEADER (Back circle, Title, Info circle) */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.backCircleBtn}
          onPress={() => {
            triggerHaptic();
            navigation.goBack();
          }}
        >
          <Feather name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>{t.seasonRewardsTitle || "Clan Sandig'i va Mukofotlar"}</Text>
          <Text style={styles.headerSubtitle}>Jamoaviy sandiq va mukofotlar</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.infoCircleBtn}
          onPress={() => {
            triggerHaptic();
            setInfoModalVisible(true);
          }}
        >
          <Feather name="info" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* 2. TOP TABS (Clan Chest, Rewards History, My Rewards) */}
      <View style={styles.topTabsContainer}>
        {TOP_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.8}
              style={[styles.topTabBtn, isActive && styles.topTabBtnActive]}
              onPress={() => handleTabPress(tab.id)}
            >
              {isActive && (
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                />
              )}

              {tab.family === 'ionicons' && (
                <Ionicons
                  name={tab.icon}
                  size={14}
                  color={isActive ? '#FFFFFF' : '#94A3B8'}
                  style={{ marginRight: 6 }}
                />
              )}
              {tab.family === 'materialCommunity' && (
                <MaterialCommunityIcons
                  name={tab.icon}
                  size={15}
                  color={isActive ? '#FFFFFF' : '#94A3B8'}
                  style={{ marginRight: 6 }}
                />
              )}
              {tab.family === 'feather' && (
                <Feather
                  name={tab.icon}
                  size={14}
                  color={isActive ? '#FFFFFF' : '#94A3B8'}
                  style={{ marginRight: 6 }}
                />
              )}

              <Text style={[styles.topTabLabel, isActive && styles.topTabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        {activeTab === 'chest' && (
          <>
            {/* 3. HERO SECTION (Glowing Purple Chest + Banners) */}
            <View style={styles.heroSection}>
              {/* Left Medieval Banner */}
              {renderMedievalBanner('left')}

              {/* Right Medieval Banner */}
              {renderMedievalBanner('right')}

              {/* Center 3D Royal Purple Chest */}
              <View style={styles.centerChestContainer}>
                <ChestAnimatedDisplay style={styles.heroChestImage} />
              </View>

              {/* Hero Title & Subtitle */}
              <View style={styles.heroTitleWrap}>
                <Text style={styles.heroChestTitle}>
                  Clan Chest (Level <Text style={{ color: '#D946EF' }}>3</Text>)
                </Text>
                <Text style={styles.heroChestSubtitle}>
                  Jamoaviy vazifalarni bajarib, sandiqni oching!
                </Text>
              </View>
            </View>

            {/* 4. CARD 1: SANDIQ OCHILISH PROGRESSI (720 / 1,000 XP) */}
            <View style={styles.progressCard}>
              <View style={styles.progressCardHeader}>
                <Text style={styles.progressCardTitle}>Sandiq ochilish progressi</Text>
                <Text style={styles.progressCardXpText}>720 / 1,000 XP</Text>
              </View>

              {/* Gradient Progress Bar */}
              <View style={styles.progressBarTrack}>
                <LinearGradient
                  colors={['#A855F7', '#EC4899', '#C084FC']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[styles.progressBarFill, { width: '72%' }]}
                />
              </View>

              {/* Percentage label */}
              <View style={styles.percentRow}>
                <Text style={styles.percentText}>72%</Text>
              </View>

              {/* 5-Level Horizontal Timeline */}
              <View style={styles.timelineRow}>
                {/* Connecting Lines Behind Chests */}
                <View style={styles.timelineConnectLineTrack}>
                  {/* Purple line between completed Lv1-Lv2-Lv3 */}
                  <View style={[styles.timelineLineSegment, { width: '50%', backgroundColor: '#8B5CF6' }]} />
                  {/* Muted line between Lv3-Lv4-Lv5 */}
                  <View style={[styles.timelineLineSegment, { width: '50%', backgroundColor: 'rgba(255, 255, 255, 0.12)' }]} />
                </View>

                {TIMELINE_LEVELS.map((levelItem) => (
                  <View key={levelItem.level}>
                    {renderTimelineChest(levelItem)}
                  </View>
                ))}
              </View>
            </View>

            {/* 5. CARD 2: NEXT CHEST REWARDS (LV. 3) */}
            <View style={styles.rewardsCard}>
              <View style={styles.rewardsCardHeader}>
                <View style={styles.rewardsHeaderLeft}>
                  <View style={styles.giftIconBox}>
                    <MaterialCommunityIcons name="gift-outline" size={20} color="#C084FC" />
                  </View>
                  <View>
                    <Text style={styles.rewardsCardTitle}>Next Chest Rewards (Lv. 3)</Text>
                    <Text style={styles.rewardsCardSubtitle}>Keyingi sandiq mukofotlari</Text>
                  </View>
                </View>

                {/* Level 3 Badge */}
                <View style={styles.levelBadgePill}>
                  <Text style={styles.levelBadgeText}>Lv. 3</Text>
                </View>
              </View>

              {/* 5 Reward Columns */}
              <View style={styles.rewardsGrid}>
                {CHEST_REWARDS.map((reward) => renderRewardItem(reward))}
              </View>
            </View>

            {/* 6. CARD 3: SANDIQ OCHISH SHARTLARI */}
            <View style={styles.conditionsCard}>
              <View style={styles.conditionsHeader}>
                <MaterialCommunityIcons
                  name="clipboard-check-outline"
                  size={20}
                  color="#C084FC"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.conditionsTitle}>Sandiq ochish shartlari</Text>
              </View>

              {CHEST_CONDITIONS.map((cond, idx) => (
                <View
                  key={cond.id}
                  style={[
                    styles.conditionRow,
                    idx < CHEST_CONDITIONS.length - 1 && styles.conditionRowBorder,
                  ]}
                >
                  <View style={styles.conditionLeft}>
                    {cond.completed ? (
                      <Ionicons name="checkmark-circle" size={19} color="#22C55E" />
                    ) : (
                      <Ionicons name="ellipse-outline" size={19} color="#64748B" />
                    )}
                    <Text style={styles.conditionText}>{cond.title}</Text>
                  </View>

                  <View style={styles.conditionRight}>
                    {cond.hasClock && (
                      <Ionicons
                        name="time-outline"
                        size={14}
                        color="#C084FC"
                        style={{ marginRight: 4 }}
                      />
                    )}
                    <Text
                      style={[
                        styles.conditionValueText,
                        cond.highlightGreen && styles.conditionValueGreen,
                        cond.hasClock && styles.conditionValueClock,
                      ]}
                    >
                      {cond.current}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* 7. REWARDS HISTORY TAB CONTENT */}
        {activeTab === 'history' && (
          <View style={styles.tabContentWrap}>
            <Text style={styles.tabSectionTitle}>Avvalgi ochilgan sandiqlar</Text>
            {PAST_CHEST_HISTORY.map((item) => (
              <View key={item.id} style={styles.historyCard}>
                <View style={styles.historyCardHeader}>
                  <View style={styles.historyChestIcon}>
                    <ExpoImage
                      source={require('../assets/clan_chest_purple.jpg')}
                      style={{ width: 34, height: 30 }}
                      contentFit="contain"
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.historyCardTitle}>{item.title}</Text>
                    <Text style={styles.historyCardDate}>{item.date}</Text>
                  </View>
                  <View style={styles.historyStatusPill}>
                    <Text style={styles.historyStatusText}>{item.status}</Text>
                  </View>
                </View>
                <View style={styles.historyRewardsRow}>
                  <Text style={styles.historyRewardsLabel}>Mukofotlar: </Text>
                  <Text style={styles.historyRewardsValue}>{item.rewards}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 8. MY REWARDS TAB CONTENT */}
        {activeTab === 'my_rewards' && (
          <View style={styles.tabContentWrap}>
            <Text style={styles.tabSectionTitle}>Sizning shaxsiy ulushingiz</Text>
            <View style={styles.myRewardsCard}>
              <View style={styles.myRewardsHeader}>
                <MaterialCommunityIcons name="star-circle" size={28} color="#FBBF24" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.myRewardsTitle}>Topshirilgan ulush (Lv. 3 Sandiq)</Text>
                  <Text style={styles.myRewardsSub}>Sizning hissangiz: 180 XP (25%)</Text>
                </View>
              </View>
              <Text style={styles.myRewardsInfo}>
                Sandiq ochilganda barcha a'zolarga belgilangan bazaviy mukofotlar va qo'shimcha shaxsiy hissa bonusi beriladi.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* 9. BOTTOM ACTION BUTTON ("Sandiqni ochish") */}
      <View style={[styles.bottomBarContainer, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.openChestBtn}
          onPress={handleChestOpenPress}
        >
          <Feather name="lock" size={17} color="#D8B4FE" style={{ marginRight: 8 }} />
          <Text style={styles.openChestBtnText}>Sandiqni ochish</Text>
        </TouchableOpacity>
      </View>

      {/* 10. INFO MODAL */}
      <Modal
        visible={infoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Clan Sandiqlari haqida</Text>
              <TouchableOpacity
                onPress={() => setInfoModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Feather name="x" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 320 }}>
              <Text style={styles.modalBodyText}>
                👑 <Text style={styles.modalBoldText}>Clan Chest qanday ishlaydi?</Text>
                {'\n'}Har hafta barcha clan a'zolari birgalikda missiyalarni bajarib, sandiq darajasini (Lv. 1 dan Lv. 5 gacha) oshirib borishadi.
                {'\n\n'}
                📈 <Text style={styles.modalBoldText}>Darajalar:</Text>
                {'\n'}• Lv. 1: 250 XP
                {'\n'}• Lv. 2: 500 XP
                {'\n'}• Lv. 3: 1,000 XP (Hozirgi bosqich)
                {'\n'}• Lv. 4: 2,000 XP
                {'\n'}• Lv. 5: 3,500 XP (Afsonaviy Sandiq)
                {'\n\n'}
                🎁 <Text style={styles.modalBoldText}>Mukofotlar:</Text>
                {'\n'}Sandiq ochilganda barcha a'zolarga teng ravishda XP, Coin, Energiya va noyob bonuslar taqsimlanadi.
              </Text>
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modalOkBtn}
              onPress={() => setInfoModalVisible(false)}
            >
              <Text style={styles.modalOkBtnText}>Tushundim</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 11. REWARD DETAIL MODAL */}
      <Modal
        visible={!!selectedReward}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedReward(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedReward && (
              <>
                <View style={styles.modalHeaderRow}>
                  <Text style={[styles.modalTitle, { color: selectedReward.color }]}>
                    {selectedReward.amount} {selectedReward.title}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setSelectedReward(null)}
                    style={styles.modalCloseBtn}
                  >
                    <Feather name="x" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalBodyText}>{selectedReward.desc}</Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.modalOkBtn}
                  onPress={() => setSelectedReward(null)}
                >
                  <Text style={styles.modalOkBtnText}>Yopish</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070514',
  },

  /* 1. Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  backCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 11.5,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    marginTop: 2,
  },
  infoCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* 2. Top Tabs */
  topTabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
  },
  topTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  topTabBtnActive: {
    borderColor: 'rgba(167, 139, 250, 0.45)',
  },
  topTabLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#94A3B8',
  },
  topTabLabelActive: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  /* 3. Hero Section */
  heroSection: {
    alignItems: 'center',
    position: 'relative',
    marginTop: 6,
    paddingVertical: 12,
  },
  bannerContainer: {
    position: 'absolute',
    top: 6,
    left: 20,
    zIndex: 2,
  },
  bannerRight: {
    left: undefined,
    right: 20,
  },
  centerChestContainer: {
    width: 290,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  heroChestImage: {
    width: 280,
    height: 240,
  },
  heroTitleWrap: {
    alignItems: 'center',
    marginTop: 8,
  },
  heroChestTitle: {
    fontSize: 19,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  heroChestSubtitle: {
    fontSize: 12.5,
    fontFamily: 'Inter_400Regular',
    color: '#A78BFA',
    marginTop: 4,
    textAlign: 'center',
  },

  /* 4. Progress Card */
  progressCard: {
    backgroundColor: 'rgba(20, 16, 42, 0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.28)',
    padding: 16,
    marginTop: 14,
  },
  progressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressCardTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  progressCardXpText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#FBBF24',
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    marginTop: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentRow: {
    alignItems: 'flex-end',
    marginTop: 6,
  },
  percentText: {
    fontSize: 12.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },

  /* Timeline */
  timelineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    position: 'relative',
    paddingHorizontal: 4,
  },
  timelineConnectLineTrack: {
    position: 'absolute',
    top: 15,
    left: 20,
    right: 20,
    height: 2,
    flexDirection: 'row',
    zIndex: 0,
  },
  timelineLineSegment: {
    height: 2,
  },
  timelineNodeBox: {
    alignItems: 'center',
    zIndex: 1,
  },
  miniChestWrap: {
    position: 'relative',
    width: 36,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniCheckBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#070514',
  },
  currentChestWrap: {
    position: 'relative',
    width: 44,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentChestHalo: {
    position: 'absolute',
    width: 46,
    height: 40,
    borderRadius: 23,
    backgroundColor: 'rgba(251, 191, 36, 0.28)',
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  lockedChestWrap: {
    position: 'relative',
    width: 36,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedIconCenter: {
    position: 'absolute',
    top: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLevelTextCompleted: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginTop: 6,
  },
  timelineLevelTextCurrent: {
    fontSize: 11.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginTop: 6,
  },
  timelineLevelTextLocked: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginTop: 6,
  },

  /* 5. Rewards Card */
  rewardsCard: {
    backgroundColor: 'rgba(20, 16, 42, 0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.28)',
    padding: 16,
    marginTop: 14,
  },
  rewardsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  giftIconBox: {
    marginRight: 10,
  },
  rewardsCardTitle: {
    fontSize: 14.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  rewardsCardSubtitle: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    marginTop: 2,
  },
  levelBadgePill: {
    backgroundColor: 'rgba(139, 92, 246, 0.25)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.45)',
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  levelBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#D8B4FE',
  },
  rewardsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 14,
  },
  rewardCol: {
    flex: 1,
    alignItems: 'center',
  },
  rewardIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  shieldGlowWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  energyBoltWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardAmount: {
    fontSize: 12.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  rewardTitle: {
    fontSize: 10.5,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 2,
  },
  rewardSub: {
    fontSize: 9.5,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    textAlign: 'center',
  },

  /* 6. Conditions Card */
  conditionsCard: {
    backgroundColor: 'rgba(20, 16, 42, 0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.28)',
    padding: 16,
    marginTop: 14,
  },
  conditionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  conditionsTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  conditionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  conditionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  conditionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  conditionText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#FFFFFF',
    flex: 1,
  },
  conditionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conditionValueText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#CBD5E1',
  },
  conditionValueGreen: {
    color: '#22C55E',
    fontFamily: 'Inter_700Bold',
  },
  conditionValueClock: {
    color: '#C084FC',
    fontFamily: 'Inter_600SemiBold',
  },

  /* Tabs History & My Rewards */
  tabContentWrap: {
    marginTop: 14,
  },
  tabSectionTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  historyCard: {
    backgroundColor: 'rgba(20, 16, 42, 0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    padding: 14,
    marginBottom: 12,
  },
  historyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyChestIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyCardTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  historyCardDate: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    marginTop: 2,
  },
  historyStatusPill: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  historyStatusText: {
    fontSize: 10.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#4ADE80',
  },
  historyRewardsRow: {
    flexDirection: 'row',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  historyRewardsLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
  },
  historyRewardsValue: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#FBBF24',
    flex: 1,
  },
  myRewardsCard: {
    backgroundColor: 'rgba(20, 16, 42, 0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    padding: 16,
  },
  myRewardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  myRewardsTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  myRewardsSub: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#C084FC',
    marginTop: 2,
  },
  myRewardsInfo: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    marginTop: 12,
    lineHeight: 18,
  },

  /* 9. Bottom Bar Button */
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: 'rgba(7, 5, 20, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 92, 246, 0.2)',
  },
  openChestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.16)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    paddingVertical: 14,
  },
  openChestBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#D8B4FE',
  },

  /* 10. Modals */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#15102A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.35)',
    padding: 20,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalBodyText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#CBD5E1',
    lineHeight: 20,
    marginBottom: 16,
  },
  modalBoldText: {
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  modalOkBtn: {
    backgroundColor: '#8B5CF6',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalOkBtnText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
});

