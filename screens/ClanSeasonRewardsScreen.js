import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Modal,
  Alert,
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
import * as Haptics from 'expo-haptics';
import { getClanTranslations } from '../src/utils/clanTranslations';
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

const { width } = Dimensions.get('window');

// REWARDS DATA
const REWARD_MILESTONES = [
  {
    id: 1,
    xpRequired: 5000,
    xpLabel: '5,000 XP',
    status: 'claimed', // claimed | claimable | locked
    rewards: [
      { id: 'coin500', type: 'coins', value: '+500', label: 'Coin' },
      { id: 'xp200', type: 'clan_xp', value: '+200', label: 'Clan XP' },
    ],
  },
  {
    id: 2,
    xpRequired: 10000,
    xpLabel: '10,000 XP',
    status: 'claimed',
    rewards: [
      { id: 'energy5', type: 'energy', value: '+5', label: 'Energy' },
      { id: 'boost1', type: 'xp_boost', value: '+1', label: 'XP Boost (1 kun)' },
    ],
  },
  {
    id: 3,
    xpRequired: 15000,
    xpLabel: '15,000 XP',
    status: 'claimed',
    rewards: [
      { id: 'frame1', type: 'avatar_frame', value: 'Avatar', label: 'ramka' },
      { id: 'coin1000', type: 'coins', value: '+1,000', label: 'Coin' },
    ],
  },
  {
    id: 4,
    xpRequired: 25000,
    xpLabel: '25,000 XP',
    status: 'claimable', // ACTIVE TO CLAIM!
    rewards: [
      { id: 'badge_s5', type: 'clan_badge', value: 'Clan badge', label: '(Season 5)' },
      { id: 'xp500', type: 'clan_xp', value: '+500', label: 'Clan XP' },
    ],
  },
  {
    id: 5,
    xpRequired: 35000,
    xpLabel: '35,000 XP',
    status: 'locked',
    rewards: [
      { id: 'banner_s5', type: 'clan_banner', value: 'Clan banner', label: '(Season 5)' },
      { id: 'coin2000', type: 'coins', value: '+2,000', label: 'Coin' },
    ],
  },
  {
    id: 6,
    xpRequired: 50000,
    xpLabel: '50,000 XP',
    status: 'locked',
    rewards: [
      { id: 'title_champ', type: 'champion_title', value: '"Season 5', label: 'Champion" (unvon)' },
      { id: 'gem500', type: 'gems', value: '+500', label: 'Gem' },
    ],
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

export default function ClanSeasonRewardsScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const user = route?.params?.user;
  const language = route?.params?.language || user?.language || 'uz';
  const t = getClanTranslations(language);
  const [activeTab, setActiveTab] = useState('track'); // track | all | claimed
  const [milestones, setMilestones] = useState(REWARD_MILESTONES);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [claimedSuccessModal, setClaimedSuccessModal] = useState(false);

  const triggerHaptic = (style = 'light') => {
    try {
      if (style === 'medium') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else if (style === 'heavy') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (e) {}
  };

  // Handle claiming milestone 4 (25,000 XP)
  const handleClaimReward = (milestoneId) => {
    triggerHaptic('heavy');
    setMilestones((prev) =>
      prev.map((m) => (m.id === milestoneId ? { ...m, status: 'claimed' } : m))
    );
    setClaimedSuccessModal(true);
  };

  // Render individual reward graphic
  const renderRewardIcon = (type) => {
    switch (type) {
      case 'coins':
        return (
          <Svg width={30} height={26} viewBox="0 0 32 28">
            <Defs>
              <SvgGradient id="coinG" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FEF08A" />
                <Stop offset="60%" stopColor="#F59E0B" />
                <Stop offset="100%" stopColor="#B45309" />
              </SvgGradient>
            </Defs>
            {/* Coin 1 */}
            <Circle cx="12" cy="18" r="8" fill="url(#coinG)" stroke="#FDE047" strokeWidth="1" />
            <Circle cx="12" cy="18" r="5" fill="#D97706" opacity={0.4} />
            {/* Coin 2 */}
            <Circle cx="20" cy="12" r="8" fill="url(#coinG)" stroke="#FDE047" strokeWidth="1" />
            <Circle cx="20" cy="12" r="5" fill="#D97706" opacity={0.4} />
            {/* Star on top coin */}
            <Polygon points="20,9 21,11 23,11 21.5,12.5 22,14.5 20,13.5 18,14.5 18.5,12.5 17,11 19,11" fill="#FFFBEB" />
          </Svg>
        );

      case 'clan_xp':
        return (
          <Svg width={28} height={28} viewBox="0 0 36 36">
            <Defs>
              <SvgGradient id="xpShieldG" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#D8B4FE" />
                <Stop offset="50%" stopColor="#9333EA" />
                <Stop offset="100%" stopColor="#581C87" />
              </SvgGradient>
            </Defs>
            <Path
              d="M 6 6 L 30 6 Q 30 23 18 32 Q 6 23 6 6 Z"
              fill="url(#xpShieldG)"
              stroke="#E9D5FF"
              strokeWidth="1.2"
            />
            <Polygon
              points="18,11 20,16 25,16 21,19 22.5,24 18,21 13.5,24 15,19 11,16 16,16"
              fill="#FFFFFF"
            />
          </Svg>
        );

      case 'energy':
        return (
          <View style={styles.energyIconBox}>
            <Ionicons name="flash" size={20} color="#38BDF8" />
          </View>
        );

      case 'xp_boost':
        return (
          <View style={styles.xpBoostTicket}>
            <Text style={styles.xpBoostTicketText}>XP</Text>
          </View>
        );

      case 'avatar_frame':
        return (
          <View style={styles.avatarFrameOuter}>
            <View style={styles.avatarFrameInner} />
          </View>
        );

      case 'clan_badge':
        return (
          <Svg width={32} height={32} viewBox="0 0 40 40">
            <Defs>
              <SvgGradient id="badgeG" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#C084FC" />
                <Stop offset="50%" stopColor="#7E22CE" />
                <Stop offset="100%" stopColor="#3B0764" />
              </SvgGradient>
            </Defs>
            <Polygon
              points="20,4 32,8 36,20 32,32 20,36 8,32 4,20 8,8"
              fill="url(#badgeG)"
              stroke="#F59E0B"
              strokeWidth="1.5"
            />
            <Polygon
              points="20,12 22,17 27,17 23,20 24.5,25 20,22 15.5,25 17,20 13,17 18,17"
              fill="#FEF08A"
            />
          </Svg>
        );

      case 'clan_banner':
        return (
          <Svg width={28} height={32} viewBox="0 0 32 38">
            <Defs>
              <SvgGradient id="bannerG" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#F43F5E" />
                <Stop offset="70%" stopColor="#881337" />
              </SvgGradient>
            </Defs>
            {/* Top hanging bar */}
            <Rect x="2" y="2" width="28" height="3" rx="1.5" fill="#FBBF24" />
            {/* Banner fabric with bottom split */}
            <Path d="M 5 5 L 27 5 L 27 30 L 16 24 L 5 30 Z" fill="url(#bannerG)" stroke="#FBBF24" strokeWidth="1" />
            <Polygon points="16,11 18,14 21,13 19,16 20,19 16,17 12,19 13,16 11,13 14,14" fill="#FEF08A" />
          </Svg>
        );

      case 'champion_title':
        return (
          <View style={styles.championCrownWrap}>
            <Svg width={36} height={28} viewBox="0 0 44 32">
              <Defs>
                <SvgGradient id="laurelCrownG" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#FEF08A" />
                  <Stop offset="60%" stopColor="#F59E0B" />
                  <Stop offset="100%" stopColor="#B45309" />
                </SvgGradient>
              </Defs>
              {/* Crown */}
              <Path
                d="M 12 24 L 32 24 L 34 10 L 27 16 L 22 8 L 17 16 L 10 10 Z"
                fill="url(#laurelCrownG)"
                stroke="#FEF08A"
                strokeWidth="1"
              />
              {/* Left laurel branch */}
              <Path d="M 8 26 Q 2 16 8 8" stroke="#FBBF24" strokeWidth="1.5" fill="none" />
              {/* Right laurel branch */}
              <Path d="M 36 26 Q 42 16 36 8" stroke="#FBBF24" strokeWidth="1.5" fill="none" />
            </Svg>
          </View>
        );

      case 'gems':
        return (
          <Svg width={30} height={28} viewBox="0 0 36 32">
            <Defs>
              <SvgGradient id="gemG" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#F5D0FE" />
                <Stop offset="40%" stopColor="#D946EF" />
                <Stop offset="100%" stopColor="#701A75" />
              </SvgGradient>
            </Defs>
            <Polygon
              points="10,4 26,4 34,12 18,30 2,12"
              fill="url(#gemG)"
              stroke="#F472B6"
              strokeWidth="1.2"
            />
            {/* Top facets */}
            <Polygon points="10,4 18,12 26,4" fill="#FDF4FF" opacity={0.6} />
            <Polygon points="2,12 18,12 10,4" fill="#E879F9" opacity={0.4} />
            <Polygon points="26,4 18,12 34,12" fill="#A21CAF" opacity={0.4} />
          </Svg>
        );

      default:
        return null;
    }
  };

  // Filtered milestones based on active tab
  const getVisibleMilestones = () => {
    if (activeTab === 'claimed') {
      return milestones.filter((m) => m.status === 'claimed');
    }
    return milestones;
  };

  const displayedMilestones = getVisibleMilestones();

  return (
    <View style={styles.screenRoot}>
      <StatusBar barStyle="light-content" backgroundColor="#070814" />

      {/* Screen background deep dark ambience */}
      <LinearGradient
        colors={['#0F0B20', '#070814', '#05040B']}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* 1. TOP HEADER */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.headerIconButton}
            onPress={() => {
              triggerHaptic();
              navigation.goBack();
            }}
          >
            <Feather name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitleText}>{t.seasonRewards}</Text>
            <Text style={styles.headerSubtitleText}>{t.seasonRewardsDesc}</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.headerIconButton}
            onPress={() => {
              triggerHaptic();
              setInfoModalVisible(true);
            }}
          >
            <Feather name="info" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* SCROLLABLE MAIN CONTENT */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        >
          {/* 2. HERO SECTION */}
          <View style={styles.heroSection}>
            {/* SVG Mountain Silhouettes backdrop */}
            <View style={styles.heroMountainSvg}>
              <Svg width={width - 24} height={120} viewBox="0 0 350 120">
                <Defs>
                  <SvgGradient id="sHeroGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor="#581C87" stopOpacity={0.6} />
                    <Stop offset="100%" stopColor="#0B091A" stopOpacity={0.1} />
                  </SvgGradient>
                </Defs>
                <Path d="M 0 95 L 45 40 L 95 80 L 150 30 L 205 75 L 260 35 L 315 80 L 350 50 L 350 120 L 0 120 Z" fill="url(#sHeroGrad1)" />
              </Svg>
            </View>

            {/* Left Column: Season 5 with Golden Laurels & Clan Competition pill */}
            <View style={styles.heroLeftCol}>
              <View style={styles.seasonTitleRow}>
                {/* Left Laurel */}
                <Svg width={22} height={32} viewBox="0 0 24 36">
                  <Path d="M 20 4 Q 4 14 10 32" stroke="#F59E0B" strokeWidth="2" fill="none" />
                  <Path d="M 17 6 Q 10 8 13 13 Q 16 11 17 6 Z" fill="#FDE047" />
                  <Path d="M 12 14 Q 4 17 9 22 Q 13 19 12 14 Z" fill="#FBBF24" />
                  <Path d="M 10 24 Q 2 28 8 32 Q 11 29 10 24 Z" fill="#D97706" />
                </Svg>

                <Text style={styles.seasonBigTitle}>Season 5</Text>

                {/* Right Laurel */}
                <Svg width={22} height={32} viewBox="0 0 24 36">
                  <Path d="M 4 4 Q 20 14 14 32" stroke="#F59E0B" strokeWidth="2" fill="none" />
                  <Path d="M 7 6 Q 14 8 11 13 Q 8 11 7 6 Z" fill="#FDE047" />
                  <Path d="M 12 14 Q 20 17 15 22 Q 11 19 12 14 Z" fill="#FBBF24" />
                  <Path d="M 14 24 Q 22 28 16 32 Q 13 29 14 24 Z" fill="#D97706" />
                </Svg>
              </View>

              <View style={styles.clanCompPill}>
                <Text style={styles.clanCompText}>Clan Competition</Text>
              </View>
            </View>

            {/* Right Column: High Quality Animated Chest GIF */}
            <View style={styles.heroRightCol}>
              <ChestAnimatedDisplay style={styles.heroChestImage} />
            </View>
          </View>

          {/* 3. DATES BAR (Mavsum muddati | Qolgan vaqt) */}
          <View style={styles.datesBarContainer}>
            <View style={styles.dateCol}>
              <View style={styles.dateIconWrap}>
                <Ionicons name="calendar-outline" size={18} color="#C084FC" />
              </View>
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.dateLabel}>Mavsum muddati</Text>
                <Text style={styles.dateValue}>1 Okt – 30 Okt, 2026</Text>
              </View>
            </View>

            <View style={styles.dateColDivider} />

            <View style={styles.dateCol}>
              <View style={styles.dateIconWrap}>
                <Ionicons name="time-outline" size={18} color="#FBBF24" />
              </View>
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.dateLabel}>Qolgan vaqt</Text>
                <Text style={styles.dateValueYellow}>18 kun 14 soat</Text>
              </View>
            </View>
          </View>

          {/* 4. CLAN SEASON XP CARD */}
          <View style={styles.xpCard}>
            <View style={styles.xpCardHeaderRow}>
              <View style={styles.xpHeaderLeft}>
                <Svg width={24} height={24} viewBox="0 0 36 36">
                  <Defs>
                    <SvgGradient id="xpCardG" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor="#C084FC" />
                      <Stop offset="100%" stopColor="#7E22CE" />
                    </SvgGradient>
                  </Defs>
                  <Path d="M 6 6 L 30 6 Q 30 23 18 32 Q 6 23 6 6 Z" fill="url(#xpCardG)" stroke="#E9D5FF" strokeWidth="1.5" />
                  <Polygon points="18,11 20,16 25,16 21,19 22.5,24 18,21 13.5,24 15,19 11,16 16,16" fill="#FFFFFF" />
                </Svg>
                <Text style={styles.xpCardTitle}>Clan Season XP</Text>
              </View>

              <Text style={styles.xpCardRatio}>
                24,500 <Text style={styles.xpCardRatioMuted}>/ 50,000 XP</Text>
              </Text>
            </View>

            <View style={styles.xpBarWrapper}>
              <View style={styles.xpBarTrack}>
                <LinearGradient
                  colors={['#8B5CF6', '#C084FC', '#F472B6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.xpBarFill, { width: '49%' }]}
                />
              </View>
              <Text style={styles.xpPercentText}>49%</Text>
            </View>
          </View>

          {/* 5. TABS ROW (Rewards Track | Barcha mukofotlar | Olingan mukofotlar) */}
          <View style={styles.tabsRow}>
            {/* Tab 1: Rewards Track */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.tabPill, activeTab === 'track' && styles.tabPillActive]}
              onPress={() => {
                triggerHaptic();
                setActiveTab('track');
              }}
            >
              {activeTab === 'track' ? (
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.tabPillGrad}
                >
                  <Feather name="gift" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.tabPillTextActive}>Rewards Track</Text>
                </LinearGradient>
              ) : (
                <View style={styles.tabPillInactive}>
                  <Feather name="gift" size={14} color="#94A3B8" style={{ marginRight: 6 }} />
                  <Text style={styles.tabPillTextInactive}>Rewards Track</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Tab 2: Barcha mukofotlar */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.tabPill, activeTab === 'all' && styles.tabPillActive]}
              onPress={() => {
                triggerHaptic();
                setActiveTab('all');
              }}
            >
              {activeTab === 'all' ? (
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.tabPillGrad}
                >
                  <FontAwesome5 name="crown" size={12} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.tabPillTextActive}>Barcha mukofotlar</Text>
                </LinearGradient>
              ) : (
                <View style={styles.tabPillInactive}>
                  <FontAwesome5 name="crown" size={12} color="#94A3B8" style={{ marginRight: 6 }} />
                  <Text style={styles.tabPillTextInactive}>Barcha mukofotlar</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Tab 3: Olingan mukofotlar */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.tabPill, activeTab === 'claimed' && styles.tabPillActive]}
              onPress={() => {
                triggerHaptic();
                setActiveTab('claimed');
              }}
            >
              {activeTab === 'claimed' ? (
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.tabPillGrad}
                >
                  <Ionicons name="time-outline" size={14} color="#FFFFFF" style={{ marginRight: 5 }} />
                  <Text style={styles.tabPillTextActive}>Olingan mukofotlar</Text>
                </LinearGradient>
              ) : (
                <View style={styles.tabPillInactive}>
                  <Ionicons name="time-outline" size={14} color="#94A3B8" style={{ marginRight: 5 }} />
                  <Text style={styles.tabPillTextInactive}>Olingan mukofotlar</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* 6. VERTICAL TIMELINE / REWARDS TRACK */}
          <View style={styles.trackListContainer}>
            {displayedMilestones.map((milestone, index) => {
              const isClaimed = milestone.status === 'claimed';
              const isClaimable = milestone.status === 'claimable';
              const isLocked = milestone.status === 'locked';

              // Determine connecting line color
              const isLast = index === displayedMilestones.length - 1;
              const nextMilestone = !isLast ? displayedMilestones[index + 1] : null;
              const lineIsGreen = isClaimed && (nextMilestone?.status === 'claimed' || nextMilestone?.status === 'claimable');

              return (
                <View key={`m-${milestone.id}`} style={styles.milestoneRow}>
                  {/* Left Timeline Column (Node + Line) */}
                  <View style={styles.timelineCol}>
                    {/* Node */}
                    {isClaimed && (
                      <View style={styles.nodeClaimed}>
                        <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                      </View>
                    )}

                    {isClaimable && (
                      <View style={styles.nodeClaimable}>
                        <View style={styles.nodeClaimableInner} />
                      </View>
                    )}

                    {isLocked && (
                      <View style={styles.nodeLocked}>
                        <Feather name="lock" size={10} color="#94A3B8" />
                      </View>
                    )}

                    {/* Connecting vertical line to next item */}
                    {!isLast && (
                      <View
                        style={[
                          styles.timelineLine,
                          lineIsGreen ? styles.timelineLineGreen : styles.timelineLineMuted,
                        ]}
                      />
                    )}
                  </View>

                  {/* Right Milestone Card */}
                  <View
                    style={[
                      styles.milestoneCard,
                      isClaimable && styles.milestoneCardHighlight,
                    ]}
                  >
                    {/* 1. XP Milestone Label (Left) */}
                    <View style={styles.milestoneXpBox}>
                      <Text style={styles.milestoneXpText}>{milestone.xpLabel}</Text>
                    </View>

                    {/* 2. Rewards Preview (Center) */}
                    <View style={styles.milestoneRewardsCol}>
                      {milestone.rewards.map((rew) => (
                        <View key={rew.id} style={styles.rewardItem}>
                          <View style={styles.rewardIconWrap}>
                            {renderRewardIcon(rew.type)}
                          </View>
                          <Text style={styles.rewardValueText}>{rew.value}</Text>
                          <Text style={styles.rewardLabelText}>{rew.label}</Text>
                        </View>
                      ))}
                    </View>

                    {/* 3. Action / Status Button (Right) */}
                    <View style={styles.milestoneActionCol}>
                      {isClaimed && (
                        <View style={styles.statusPillClaimed}>
                          <Ionicons name="checkmark-circle" size={14} color="#34D399" style={{ marginRight: 4 }} />
                          <Text style={styles.statusTextClaimed}>Olingan</Text>
                        </View>
                      )}

                      {isClaimable && (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => handleClaimReward(milestone.id)}
                        >
                          <LinearGradient
                            colors={['#FDE047', '#F59E0B', '#D97706']}
                            style={styles.claimButtonGrad}
                          >
                            <Feather name="gift" size={13} color="#451A03" style={{ marginRight: 4 }} />
                            <Text style={styles.claimButtonText}>Mukofotni olish</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      )}

                      {isLocked && (
                        <View style={styles.statusPillLocked}>
                          <Feather name="lock" size={11} color="#94A3B8" style={{ marginRight: 4 }} />
                          <Text style={styles.statusTextLocked}>Qulflangan</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* 7. BOTTOM BANNER ("Mavsum yakunida") */}
          <View style={styles.bottomBannerCard}>
            {/* Mountain backdrop and flag SVG */}
            <View style={styles.bottomBannerSvg}>
              <Svg width={140} height={70} viewBox="0 0 140 70">
                <Defs>
                  <SvgGradient id="summitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor="#7E22CE" stopOpacity={0.8} />
                    <Stop offset="100%" stopColor="#1E103A" stopOpacity={0.2} />
                  </SvgGradient>
                </Defs>
                {/* Summit mountain peak */}
                <Path d="M 0 70 L 60 18 L 85 45 L 115 25 L 140 70 Z" fill="url(#summitGrad)" />
                {/* Golden flag pole and banner */}
                <Path d="M 60 18 L 60 4" stroke="#FDE047" strokeWidth="1.5" />
                <Path d="M 60 4 Q 72 2 76 6 Q 68 10 60 12 Z" fill="#FACC15" />
              </Svg>
            </View>

            {/* Left Trophy Cup */}
            <View style={styles.trophyIconWrap}>
              <Svg width={38} height={38} viewBox="0 0 44 44">
                <Defs>
                  <SvgGradient id="trophyG" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#FEF08A" />
                    <Stop offset="60%" stopColor="#F59E0B" />
                    <Stop offset="100%" stopColor="#B45309" />
                  </SvgGradient>
                </Defs>
                {/* Trophy cup body */}
                <Path d="M 14 10 L 30 10 L 28 24 Q 28 28 22 28 Q 16 28 16 24 Z" fill="url(#trophyG)" stroke="#FEF08A" strokeWidth="1" />
                {/* Handles */}
                <Path d="M 14 12 Q 8 14 10 20 Q 12 24 16 22" stroke="#FBBF24" strokeWidth="2" fill="none" />
                <Path d="M 30 12 Q 36 14 34 20 Q 32 24 28 22" stroke="#FBBF24" strokeWidth="2" fill="none" />
                {/* Stem & base */}
                <Rect x="20" y="28" width="4" height="6" fill="#D97706" />
                <Rect x="14" y="34" width="16" height="4" rx="2" fill="url(#trophyG)" />
              </Svg>
            </View>

            {/* Text description */}
            <View style={styles.bottomBannerContent}>
              <Text style={styles.bottomBannerTitle}>Mavsum yakunida</Text>
              <Text style={styles.bottomBannerDesc}>
                Ligadagi o'rningizga qarab qo'shimcha mukofotlar beriladi!
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* CLAIMED CELEBRATION MODAL */}
      <Modal
        visible={claimedSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setClaimedSuccessModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSuccessCard}>
            <LinearGradient
              colors={['#7E22CE', '#3B0764']}
              style={styles.modalSuccessHeader}
            >
              <FontAwesome5 name="gift" size={36} color="#FBBF24" />
              <Text style={styles.modalSuccessTitle}>Tabriklaymiz! 🎉</Text>
              <Text style={styles.modalSuccessSub}>25,000 XP Mukofoti qo'lga kiritildi!</Text>
            </LinearGradient>

            <View style={styles.modalSuccessBody}>
              <View style={styles.modalRewardPreviewRow}>
                <View style={styles.modalRewardItem}>
                  {renderRewardIcon('clan_badge')}
                  <Text style={styles.modalRewardText}>Clan badge (S5)</Text>
                </View>

                <View style={styles.modalRewardItem}>
                  {renderRewardIcon('clan_xp')}
                  <Text style={styles.modalRewardText}>+500 Clan XP</Text>
                </View>
              </View>

              <Text style={styles.modalRewardNote}>
                Mukofotlar sizning va claningiz balansiga muvaffaqiyatli qo'shildi!
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.modalClaimOkButton}
                onPress={() => setClaimedSuccessModal(false)}
              >
                <Text style={styles.modalClaimOkText}>Ajoyib!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* INFO MODAL */}
      <Modal
        visible={infoModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Feather name="gift" size={18} color="#C084FC" style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>Season Rewards haqida</Text>
              </View>
              <TouchableOpacity
                onPress={() => setInfoModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Feather name="x" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 340 }}>
              <View style={styles.modalRuleItem}>
                <Text style={styles.modalRuleHead}>1. Progress yig'ish</Text>
                <Text style={styles.modalRuleBody}>
                  Mavsum davomida jamoangiz bilan missiyalarni bajarib va bahslarda qatnashib Clan Season XP to'plang.
                </Text>
              </View>

              <View style={styles.modalRuleItem}>
                <Text style={styles.modalRuleHead}>2. Bosqichma-bosqich mukofotlar</Text>
                <Text style={styles.modalRuleBody}>
                  Har bir marraga yetganda (5K, 10K, 15K, 25K, 35K, 50K XP) tegishli sovg'alarni ochish imkoniyati taqdim etiladi.
                </Text>
              </View>

              <View style={styles.modalRuleItem}>
                <Text style={styles.modalRuleHead}>3. Mavsum yakuniy sovg'alari</Text>
                <Text style={styles.modalRuleBody}>
                  Mavsum oxirida liganing yuqori o'rinlarini egallagan clanlar qo'shimcha maxsus qimmatbaho sovrinlarga ega bo'ladi.
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modalPrimaryButton}
              onPress={() => setInfoModalVisible(false)}
            >
              <Text style={styles.modalPrimaryButtonText}>Tushundim</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  // 1. TOP HEADER
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCol: {
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  headerSubtitleText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },

  // SCROLL CONTENT
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },

  // 2. HERO SECTION
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 8,
    position: 'relative',
    height: 120,
  },
  heroMountainSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.7,
  },
  heroLeftCol: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 8,
  },
  seasonTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  seasonBigTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginHorizontal: 4,
    letterSpacing: -0.3,
  },
  clanCompPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(126, 34, 206, 0.3)',
    borderWidth: 1,
    borderColor: '#A855F7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  clanCompText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E9D5FF',
  },
  heroRightCol: {
    width: 140,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroChestImage: {
    width: 135,
    height: 110,
  },

  // 3. DATES BAR
  datesBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(22, 17, 43, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.22)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  dateCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateLabel: {
    fontSize: 10,
    color: '#94A3B8',
  },
  dateValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 1,
  },
  dateValueYellow: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FBBF24',
    marginTop: 1,
  },
  dateColDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: 10,
  },

  // 4. CLAN SEASON XP CARD
  xpCard: {
    backgroundColor: 'rgba(20, 15, 38, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  xpCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  xpHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  xpCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  xpCardRatio: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FACC15',
  },
  xpCardRatioMuted: {
    color: '#94A3B8',
    fontWeight: '500',
  },
  xpBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  xpBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  xpPercentText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 10,
    width: 32,
    textAlign: 'right',
  },

  // 5. TABS ROW
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tabPill: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 3,
  },
  tabPillActive: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 3,
  },
  tabPillGrad: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  tabPillInactive: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 6,
  },
  tabPillTextActive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tabPillTextInactive: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
  },

  // 6. VERTICAL TIMELINE / REWARDS TRACK
  trackListContainer: {
    marginBottom: 14,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 10,
  },
  timelineCol: {
    width: 28,
    alignItems: 'center',
    marginRight: 6,
  },
  nodeClaimed: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    zIndex: 2,
  },
  nodeClaimable: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#F59E0B',
    backgroundColor: '#070814',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    zIndex: 2,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  nodeClaimableInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FEF08A',
  },
  nodeLocked: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    zIndex: 2,
  },
  timelineLine: {
    position: 'absolute',
    top: 38,
    bottom: -18,
    width: 3,
    zIndex: 1,
  },
  timelineLineGreen: {
    backgroundColor: '#10B981',
  },
  timelineLineMuted: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
  },

  // Milestone Card
  milestoneCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(19, 14, 38, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.22)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  milestoneCardHighlight: {
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  milestoneXpBox: {
    width: 72,
    justifyContent: 'center',
  },
  milestoneXpText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  // Rewards Preview in Card
  milestoneRewardsCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
  },
  rewardItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  rewardIconWrap: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  rewardValueText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  rewardLabelText: {
    fontSize: 9,
    color: '#94A3B8',
    textAlign: 'center',
  },

  // Reward icons specifics
  energyIconBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  xpBoostTicket: {
    backgroundColor: '#22C55E',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    transform: [{ rotate: '-8deg' }],
  },
  xpBoostTicketText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#052E16',
  },
  avatarFrameOuter: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2.5,
    borderColor: '#C084FC',
    backgroundColor: 'rgba(192, 132, 252, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFrameInner: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#7E22CE',
  },
  championCrownWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Action column
  milestoneActionCol: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: 6,
  },
  statusPillClaimed: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusTextClaimed: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34D399',
  },
  claimButtonGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  claimButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#451A03',
  },
  statusPillLocked: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusTextLocked: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },

  // 7. BOTTOM BANNER
  bottomBannerCard: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 17, 44, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    overflow: 'hidden',
  },
  bottomBannerSvg: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'flex-end',
    opacity: 0.85,
  },
  trophyIconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  bottomBannerContent: {
    flex: 1,
    paddingRight: 60,
  },
  bottomBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  bottomBannerDesc: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 15,
  },

  // MODALS
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#16122C',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 14,
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalRuleItem: {
    marginBottom: 14,
  },
  modalRuleHead: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FBBF24',
    marginBottom: 4,
  },
  modalRuleBody: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  modalPrimaryButton: {
    marginTop: 10,
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalPrimaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Success Claim Modal
  modalSuccessCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#16122C',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    overflow: 'hidden',
  },
  modalSuccessHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  modalSuccessTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 10,
  },
  modalSuccessSub: {
    fontSize: 12,
    color: '#FEF08A',
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  modalSuccessBody: {
    padding: 20,
    alignItems: 'center',
  },
  modalRewardPreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  modalRewardItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 12,
    width: 120,
  },
  modalRewardText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 6,
    textAlign: 'center',
  },
  modalRewardNote: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 16,
  },
  modalClaimOkButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 14,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalClaimOkText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#451A03',
  },
});

