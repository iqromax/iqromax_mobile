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
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
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
  G,
  Rect,
} from 'react-native-svg';

const { width } = Dimensions.get('window');

// 5 LEAGUE TIERS CONFIG
const LEAGUES = [
  { id: 'bronze', name: 'Bronze', xpMin: 0, xpMax: 100000, color: '#CD7F32' },
  { id: 'silver', name: 'Silver', xpMin: 100000, xpMax: 300000, color: '#CBD5E1' },
  { id: 'gold', name: 'Gold', xpMin: 300000, xpMax: 700000, color: '#FBBF24' },
  { id: 'platinum', name: 'Platinum', xpMin: 700000, xpMax: 1500000, color: '#C084FC' },
  { id: 'diamond', name: 'Diamond', xpMin: 1500000, xpMax: 3000000, color: '#38BDF8' },
];

export default function ClanLeaderboardScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const user = route?.params?.user;
  const language = route?.params?.language || user?.language || 'uz';
  const t = getClanTranslations(language);
  const [selectedLeague, setSelectedLeague] = useState('gold');
  const [activeTab, setActiveTab] = useState('umumiy'); // umumiy | ozbekiston | viloyat
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const triggerHaptic = (style = 'light') => {
    try {
      if (style === 'medium') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (e) {}
  };

  // LEADERBOARD DATA PER TAB
  const getLeaderboardData = () => {
    if (activeTab === 'ozbekiston') {
      return [
        { rank: 1, name: 'Alpha Clan', members: 12, xp: '1,240,800 XP', emblem: 'lion' },
        { rank: 2, name: 'MathMasters', members: 12, xp: '1,102,500 XP', emblem: 'wolf' },
        { rank: 3, name: 'IQRO Team', members: 12, xp: '987,300 XP', emblem: 'phoenix' },
        { rank: 4, name: 'BrainStorm', members: 11, xp: '892,100 XP', emblem: 'owl' },
        { rank: 5, name: 'SmartClan', members: 12, xp: '861,400 XP', emblem: 'book' },
      ];
    }
    if (activeTab === 'viloyat') {
      return [
        { rank: 1, name: 'IQRO Team', members: 12, xp: '987,300 XP', emblem: 'phoenix' },
        { rank: 2, name: 'SmartClan', members: 12, xp: '861,400 XP', emblem: 'book' },
        { rank: 3, name: 'IQROMAX Clan', members: 10, xp: '548,200 XP', emblem: 'crown', isCurrent: true },
        { rank: 4, name: 'LogicStars', members: 9, xp: '430,100 XP', emblem: 'owl' },
        { rank: 5, name: 'Xorazm Elite', members: 11, xp: '380,500 XP', emblem: 'wolf' },
      ];
    }
    // Default: 'umumiy' (Exact match from screenshot)
    return [
      { rank: 1, name: 'Alpha Clan', members: 12, xp: '1,240,800 XP', emblem: 'lion' },
      { rank: 2, name: 'MathMasters', members: 12, xp: '1,102,500 XP', emblem: 'wolf' },
      { rank: 3, name: 'IQRO Team', members: 12, xp: '987,300 XP', emblem: 'phoenix' },
      { rank: 4, name: 'BrainStorm', members: 11, xp: '892,100 XP', emblem: 'owl' },
      { rank: 5, name: 'SmartClan', members: 12, xp: '861,400 XP', emblem: 'book' },
    ];
  };

  // Render Big Hero Gold Shield with Wings and Star
  const renderHeroGoldShield = () => {
    return (
      <View style={styles.heroShieldContainer}>
        {/* Ambient Gold Glow */}
        <View style={styles.heroShieldGlow} />

        <Svg width={120} height={100} viewBox="0 0 120 100">
          <Defs>
            <SvgGradient id="heroGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FEF08A" />
              <Stop offset="45%" stopColor="#F59E0B" />
              <Stop offset="85%" stopColor="#D97706" />
              <Stop offset="100%" stopColor="#78350F" />
            </SvgGradient>

            <SvgGradient id="heroWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FFFBEB" />
              <Stop offset="50%" stopColor="#FBBF24" />
              <Stop offset="100%" stopColor="#B45309" />
            </SvgGradient>

            <SvgGradient id="heroShieldRim" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FFF" stopOpacity={0.9} />
              <Stop offset="100%" stopColor="#F59E0B" stopOpacity={0.3} />
            </SvgGradient>
          </Defs>

          {/* Left Wing Layers */}
          <Path d="M 36 32 Q 10 24 2 40 Q 18 42 34 46 Z" fill="url(#heroWingGrad)" />
          <Path d="M 36 44 Q 14 42 10 56 Q 24 52 35 56 Z" fill="url(#heroWingGrad)" opacity={0.95} />
          <Path d="M 36 56 Q 20 54 18 66 Q 28 62 36 64 Z" fill="url(#heroWingGrad)" opacity={0.85} />

          {/* Right Wing Layers */}
          <Path d="M 84 32 Q 110 24 118 40 Q 102 42 86 46 Z" fill="url(#heroWingGrad)" />
          <Path d="M 84 44 Q 106 42 110 56 Q 96 52 85 56 Z" fill="url(#heroWingGrad)" opacity={0.95} />
          <Path d="M 84 56 Q 100 54 102 66 Q 92 62 84 64 Z" fill="url(#heroWingGrad)" opacity={0.85} />

          {/* Central Gold Shield Back Plate */}
          <Path
            d="M 36 20 L 84 20 Q 84 58 60 82 Q 36 58 36 20 Z"
            fill="url(#heroGoldGrad)"
            stroke="#FEF08A"
            strokeWidth="2.5"
          />

          {/* Inner Shield Inset */}
          <Path
            d="M 42 26 L 78 26 Q 78 54 60 74 Q 42 54 42 26 Z"
            fill="#B45309"
            opacity={0.35}
          />

          {/* 5-pointed Golden Star */}
          <Polygon
            points="60,34 64,44 75,44 67,51 70,61 60,55 50,61 53,51 45,44 56,44"
            fill="#FFFBEB"
            stroke="#FDE047"
            strokeWidth="1.2"
          />
        </Svg>
      </View>
    );
  };

  // Render Individual League Shield for Stepper
  const renderLeagueShield = (leagueId, isActive) => {
    switch (leagueId) {
      case 'bronze':
        return (
          <Svg width={36} height={36} viewBox="0 0 40 40">
            <Defs>
              <SvgGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FDBA74" />
                <Stop offset="60%" stopColor="#C2410C" />
                <Stop offset="100%" stopColor="#7C2D12" />
              </SvgGradient>
            </Defs>
            <Path
              d="M 8 8 L 32 8 Q 32 26 20 36 Q 8 26 8 8 Z"
              fill="url(#bronzeGrad)"
              stroke="#EA580C"
              strokeWidth="1.5"
            />
            <Polygon
              points="20,13 22,18 28,18 23,22 25,28 20,24 15,28 17,22 12,18 18,18"
              fill="#FFEDD5"
            />
          </Svg>
        );

      case 'silver':
        return (
          <Svg width={36} height={36} viewBox="0 0 40 40">
            <Defs>
              <SvgGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FFFFFF" />
                <Stop offset="50%" stopColor="#94A3B8" />
                <Stop offset="100%" stopColor="#475569" />
              </SvgGradient>
            </Defs>
            <Path
              d="M 8 8 L 32 8 Q 32 26 20 36 Q 8 26 8 8 Z"
              fill="url(#silverGrad)"
              stroke="#E2E8F0"
              strokeWidth="1.5"
            />
            <Polygon
              points="20,13 22,18 28,18 23,22 25,28 20,24 15,28 17,22 12,18 18,18"
              fill="#FFFFFF"
            />
          </Svg>
        );

      case 'gold':
        return (
          <Svg width={42} height={42} viewBox="0 0 54 54">
            <Defs>
              <SvgGradient id="stepGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FEF08A" />
                <Stop offset="50%" stopColor="#F59E0B" />
                <Stop offset="100%" stopColor="#B45309" />
              </SvgGradient>
              <SvgGradient id="stepWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FDE047" />
                <Stop offset="100%" stopColor="#D97706" />
              </SvgGradient>
            </Defs>
            {/* Wings */}
            <Path d="M 16 18 Q 4 15 2 24 Q 10 24 16 26 Z" fill="url(#stepWingGrad)" />
            <Path d="M 16 25 Q 6 24 5 32 Q 12 30 16 32 Z" fill="url(#stepWingGrad)" />
            <Path d="M 38 18 Q 50 15 52 24 Q 44 24 38 26 Z" fill="url(#stepWingGrad)" />
            <Path d="M 38 25 Q 48 24 49 32 Q 42 30 38 32 Z" fill="url(#stepWingGrad)" />
            {/* Shield */}
            <Path
              d="M 16 12 L 38 12 Q 38 32 27 45 Q 16 32 16 12 Z"
              fill="url(#stepGoldGrad)"
              stroke="#FEF08A"
              strokeWidth="1.5"
            />
            <Polygon
              points="27,18 29,24 35,24 30,28 32,34 27,30 22,34 24,28 19,24 25,24"
              fill="#FFFBEB"
            />
          </Svg>
        );

      case 'platinum':
        return (
          <Svg width={36} height={36} viewBox="0 0 40 40">
            <Defs>
              <SvgGradient id="platGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#F5D0FE" />
                <Stop offset="50%" stopColor="#A855F7" />
                <Stop offset="100%" stopColor="#581C87" />
              </SvgGradient>
            </Defs>
            <Path
              d="M 8 8 L 32 8 Q 32 26 20 36 Q 8 26 8 8 Z"
              fill="url(#platGrad)"
              stroke="#E879F9"
              strokeWidth="1.5"
            />
            {/* Crown / Star */}
            <Polygon
              points="14,24 14,18 17,21 20,16 23,21 26,18 26,24"
              fill="#FFFFFF"
            />
          </Svg>
        );

      case 'diamond':
        return (
          <Svg width={36} height={36} viewBox="0 0 40 40">
            <Defs>
              <SvgGradient id="diamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#BAE6FD" />
                <Stop offset="50%" stopColor="#0284C7" />
                <Stop offset="100%" stopColor="#082F49" />
              </SvgGradient>
            </Defs>
            <Path
              d="M 8 8 L 32 8 Q 32 26 20 36 Q 8 26 8 8 Z"
              fill="url(#diamGrad)"
              stroke="#38BDF8"
              strokeWidth="1.5"
            />
            {/* Diamond Crown */}
            <Polygon
              points="20,14 26,19 23,27 17,27 14,19"
              fill="#E0F2FE"
            />
          </Svg>
        );

      default:
        return null;
    }
  };

  // Render Clan Emblem Badges
  const renderEmblem = (type) => {
    switch (type) {
      case 'lion':
        // Rank 1: Royal Purple Shield with Lion
        return (
          <View style={[styles.emblemBase, { backgroundColor: '#3B0764', borderColor: '#A855F7' }]}>
            <LinearGradient
              colors={['#7E22CE', '#3B0764']}
              style={styles.emblemGrad}
            >
              <FontAwesome5 name="shield-alt" size={28} color="#C084FC" />
              <View style={styles.emblemIconOverlay}>
                <Ionicons name="paw" size={15} color="#FDE047" />
              </View>
            </LinearGradient>
          </View>
        );

      case 'wolf':
        // Rank 2: Blue Shield with Wolf/Fox
        return (
          <View style={[styles.emblemBase, { backgroundColor: '#0C4A6E', borderColor: '#38BDF8' }]}>
            <LinearGradient
              colors={['#0284C7', '#082F49']}
              style={styles.emblemGrad}
            >
              <FontAwesome5 name="shield-alt" size={28} color="#38BDF8" />
              <View style={styles.emblemIconOverlay}>
                <Ionicons name="skull" size={14} color="#E0F2FE" />
              </View>
            </LinearGradient>
          </View>
        );

      case 'phoenix':
        // Rank 3: Red-orange Shield with Phoenix / Fire Bird
        return (
          <View style={[styles.emblemBase, { backgroundColor: '#7C2D12', borderColor: '#F97316' }]}>
            <LinearGradient
              colors={['#EA580C', '#7C2D12']}
              style={styles.emblemGrad}
            >
              <FontAwesome5 name="shield-alt" size={28} color="#FB923C" />
              <View style={styles.emblemIconOverlay}>
                <Ionicons name="flame" size={16} color="#FEF08A" />
              </View>
            </LinearGradient>
          </View>
        );

      case 'owl':
        // Rank 4: Violet Shield with Owl
        return (
          <View style={[styles.emblemBase, { backgroundColor: '#2E1065', borderColor: '#8B5CF6' }]}>
            <LinearGradient
              colors={['#6D28D9', '#2E1065']}
              style={styles.emblemGrad}
            >
              <FontAwesome5 name="shield-alt" size={28} color="#A78BFA" />
              <View style={styles.emblemIconOverlay}>
                <Ionicons name="eye" size={14} color="#DDD6FE" />
              </View>
            </LinearGradient>
          </View>
        );

      case 'book':
        // Rank 5: Cyan/Blue Shield with Book
        return (
          <View style={[styles.emblemBase, { backgroundColor: '#0E7490', borderColor: '#22D3EE' }]}>
            <LinearGradient
              colors={['#06B6D4', '#155E75']}
              style={styles.emblemGrad}
            >
              <FontAwesome5 name="shield-alt" size={28} color="#67E8F9" />
              <View style={styles.emblemIconOverlay}>
                <Ionicons name="book" size={14} color="#ECFEFF" />
              </View>
            </LinearGradient>
          </View>
        );

      case 'crown':
      default:
        // User Clan: Gold Rim Shield with Golden Crown
        return (
          <View style={[styles.emblemBase, { backgroundColor: '#451A03', borderColor: '#F59E0B', borderWidth: 2 }]}>
            <LinearGradient
              colors={['#78350F', '#451A03']}
              style={styles.emblemGrad}
            >
              <FontAwesome5 name="crown" size={17} color="#FBBF24" />
            </LinearGradient>
          </View>
        );
    }
  };

  // Render Rank Badge (#1, #2, #3 crown ribbons, or simple circle for #4, #5)
  const renderRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <View style={styles.topRankBadgeContainer}>
          <LinearGradient
            colors={['#FDE047', '#EAB308', '#CA8A04']}
            style={styles.crownRibbonBadge}
          >
            <FontAwesome5 name="crown" size={8} color="#713F12" style={{ marginBottom: 1 }} />
            <Text style={styles.topRankText}>1</Text>
          </LinearGradient>
        </View>
      );
    }
    if (rank === 2) {
      return (
        <View style={styles.topRankBadgeContainer}>
          <LinearGradient
            colors={['#F1F5F9', '#94A3B8', '#64748B']}
            style={styles.crownRibbonBadge}
          >
            <FontAwesome5 name="crown" size={8} color="#1E293B" style={{ marginBottom: 1 }} />
            <Text style={[styles.topRankText, { color: '#0F172A' }]}>2</Text>
          </LinearGradient>
        </View>
      );
    }
    if (rank === 3) {
      return (
        <View style={styles.topRankBadgeContainer}>
          <LinearGradient
            colors={['#FDBA74', '#D97706', '#9A3412']}
            style={styles.crownRibbonBadge}
          >
            <FontAwesome5 name="crown" size={8} color="#431407" style={{ marginBottom: 1 }} />
            <Text style={[styles.topRankText, { color: '#431407' }]}>3</Text>
          </LinearGradient>
        </View>
      );
    }
    return (
      <View style={styles.normalRankBadge}>
        <Text style={styles.normalRankText}>{rank}</Text>
      </View>
    );
  };

  const clansData = getLeaderboardData();

  return (
    <View style={styles.screenRoot}>
      <StatusBar barStyle="light-content" backgroundColor="#070814" />

      {/* Background Ambience Gradient */}
      <LinearGradient
        colors={['#0F0C22', '#070814', '#06050C']}
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
            <Text style={styles.headerTitleText}>{t.leaderboard}</Text>
            <Text style={styles.headerSubtitleText}>{t.leaderboardDesc}</Text>
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

        {/* SCROLLABLE CONTENT */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        >
          {/* 2. HERO SECTION ("Gold League") */}
          <View style={styles.heroSection}>
            {/* SVG Mountain Silhouette in Background */}
            <View style={styles.mountainSvgWrap}>
              <Svg width={width - 24} height={140} viewBox="0 0 350 140">
                <Defs>
                  <SvgGradient id="mountGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor="#4C1D95" stopOpacity={0.5} />
                    <Stop offset="100%" stopColor="#0B091A" stopOpacity={0.1} />
                  </SvgGradient>
                  <SvgGradient id="mountGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor="#2E1065" stopOpacity={0.7} />
                    <Stop offset="100%" stopColor="#070814" stopOpacity={0.9} />
                  </SvgGradient>
                </Defs>

                {/* Back peaks */}
                <Path d="M 0 110 L 40 45 L 85 85 L 130 35 L 175 75 L 220 30 L 265 80 L 310 40 L 350 90 L 350 140 L 0 140 Z" fill="url(#mountGrad1)" />

                {/* Front peaks */}
                <Path d="M 0 120 L 50 65 L 105 105 L 175 55 L 245 105 L 300 65 L 350 115 L 350 140 L 0 140 Z" fill="url(#mountGrad2)" />
              </Svg>
            </View>

            {/* Top 3-column Hero Row */}
            <View style={styles.heroStatsRow}>
              {/* Left Stat: Sizning o'rningiz */}
              <View style={styles.heroSideCard}>
                <Text style={styles.heroSideLabel}>Sizning o'rningiz</Text>
                <Text style={styles.heroRankNumber}>#12</Text>
                <Text style={styles.heroXpSub}>548,200 XP</Text>
              </View>

              {/* Center Hero Shield */}
              <View style={styles.heroCenterWrap}>
                {renderHeroGoldShield()}

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.heroTitleRow}
                  onPress={() => {
                    triggerHaptic();
                    setInfoModalVisible(true);
                  }}
                >
                  <Text style={styles.heroLeagueTitle}>Gold League</Text>
                  <Feather name="info" size={15} color="#CBD5E1" style={{ marginLeft: 6 }} />
                </TouchableOpacity>

                <Text style={styles.heroSeasonSub}>Season 5 • Clan Competition</Text>
              </View>

              {/* Right Stat: Reyting o'zgarishi */}
              <View style={styles.heroSideCard}>
                <View style={styles.trendPill}>
                  <Ionicons name="triangle" size={8} color="#34D399" style={{ marginRight: 3 }} />
                  <Text style={styles.trendPillText}>+3</Text>
                </View>
                <Text style={styles.heroSideLabel}>Reyting o'zgarishi</Text>
                <Text style={styles.heroTrendDays}>(oxirgi 7 kun)</Text>
              </View>
            </View>
          </View>

          {/* 3. LEAGUE STEPPER / PROGRESSION TIERS */}
          <View style={styles.stepperContainer}>
            {LEAGUES.map((league, idx) => {
              const isSelected = selectedLeague === league.id;
              return (
                <React.Fragment key={league.id}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.stepperItem,
                      isSelected && styles.stepperItemSelected,
                    ]}
                    onPress={() => {
                      triggerHaptic();
                      setSelectedLeague(league.id);
                    }}
                  >
                    <View style={styles.stepperShieldBox}>
                      {renderLeagueShield(league.id, isSelected)}
                    </View>
                    <Text
                      style={[
                        styles.stepperLabel,
                        isSelected && styles.stepperLabelSelected,
                      ]}
                    >
                      {league.name}
                    </Text>
                  </TouchableOpacity>

                  {/* Chevron separator between items */}
                  {idx < LEAGUES.length - 1 && (
                    <Feather name="chevron-right" size={14} color="#475569" style={styles.stepperChevron} />
                  )}
                </React.Fragment>
              );
            })}
          </View>

          {/* 4. PROGRESS BAR CARD ("Keyingi ligaga: Platinum League") */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeaderRow}>
              <Text style={styles.progressTargetText}>
                Keyingi ligaga: <Text style={styles.progressTargetHighlight}>Platinum League</Text>
              </Text>
              <Text style={styles.progressRatioText}>
                548,200 <Text style={styles.progressRatioMuted}>/ 700,000 XP</Text>
              </Text>
            </View>

            <View style={styles.progressBarWrapper}>
              <View style={styles.progressBarTrack}>
                <LinearGradient
                  colors={['#8B5CF6', '#C084FC', '#F472B6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressBarFill, { width: '78%' }]}
                />
              </View>
              <Text style={styles.progressPercentText}>78%</Text>
            </View>
          </View>

          {/* 5. FILTER / SCOPE TABS */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.tabButton, activeTab === 'umumiy' && styles.tabButtonActive]}
              onPress={() => {
                triggerHaptic();
                setActiveTab('umumiy');
              }}
            >
              {activeTab === 'umumiy' ? (
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.tabGradient}
                >
                  <MaterialCommunityIcons name="chart-box-outline" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.tabTextActive}>Umumiy reyting</Text>
                </LinearGradient>
              ) : (
                <View style={styles.tabInactiveContent}>
                  <MaterialCommunityIcons name="chart-box-outline" size={15} color="#94A3B8" style={{ marginRight: 6 }} />
                  <Text style={styles.tabTextInactive}>Umumiy reyting</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.tabButton, activeTab === 'ozbekiston' && styles.tabButtonActive]}
              onPress={() => {
                triggerHaptic();
                setActiveTab('ozbekiston');
              }}
            >
              {activeTab === 'ozbekiston' ? (
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.tabGradient}
                >
                  <Ionicons name="location-outline" size={15} color="#FFFFFF" style={{ marginRight: 5 }} />
                  <Text style={styles.tabTextActive}>O'zbekiston</Text>
                </LinearGradient>
              ) : (
                <View style={styles.tabInactiveContent}>
                  <Ionicons name="location-outline" size={15} color="#94A3B8" style={{ marginRight: 5 }} />
                  <Text style={styles.tabTextInactive}>O'zbekiston</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.tabButton, activeTab === 'viloyat' && styles.tabButtonActive]}
              onPress={() => {
                triggerHaptic();
                setActiveTab('viloyat');
              }}
            >
              {activeTab === 'viloyat' ? (
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.tabGradient}
                >
                  <Feather name="map" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.tabTextActive}>Viloyat</Text>
                </LinearGradient>
              ) : (
                <View style={styles.tabInactiveContent}>
                  <Feather name="map" size={14} color="#94A3B8" style={{ marginRight: 6 }} />
                  <Text style={styles.tabTextInactive}>Viloyat</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* 6. LEADERBOARD TABLE */}
          <View style={styles.tableCard}>
            {/* Table Header Row */}
            <View style={styles.tableHeaderRow}>
              <Text style={styles.thRank}>#</Text>
              <Text style={styles.thName}>Clan nomi</Text>
              <Text style={styles.thXp}>Clan XP</Text>
            </View>

            {/* Clan Rows List */}
            {clansData.map((item) => (
              <View key={`clan-${item.rank}-${item.name}`} style={styles.clanRow}>
                {/* Rank Badge */}
                <View style={styles.colRank}>
                  {renderRankBadge(item.rank)}
                </View>

                {/* Emblem */}
                <View style={styles.colEmblem}>
                  {renderEmblem(item.emblem)}
                </View>

                {/* Clan Info */}
                <View style={styles.colInfo}>
                  <Text style={styles.clanNameText}>{item.name}</Text>
                  <View style={styles.membersRow}>
                    <Ionicons name="people-outline" size={12} color="#94A3B8" style={{ marginRight: 4 }} />
                    <Text style={styles.clanMembersText}>{item.members} a'zo</Text>
                  </View>
                </View>

                {/* XP Value */}
                <View style={styles.colXp}>
                  <Text style={styles.clanXpText}>{item.xp}</Text>
                </View>
              </View>
            ))}

            {/* Ellipsis Divider if current clan is not in top 5 */}
            {activeTab !== 'viloyat' && (
              <>
                <View style={styles.ellipsisRow}>
                  <Text style={styles.ellipsisDots}>•••</Text>
                </View>

                {/* HIGHLIGHTED USER CLAN ROW (#12) */}
                <LinearGradient
                  colors={['rgba(126, 34, 206, 0.25)', 'rgba(59, 7, 100, 0.35)']}
                  style={styles.userClanHighlightRow}
                >
                  <View style={styles.colRank}>
                    <View style={styles.userClanRankBadge}>
                      <Text style={styles.userClanRankText}>12</Text>
                    </View>
                  </View>

                  <View style={styles.colEmblem}>
                    {renderEmblem('crown')}
                  </View>

                  <View style={styles.colInfo}>
                    <Text style={styles.userClanNameText}>IQROMAX Clan</Text>
                    <View style={styles.membersRow}>
                      <Ionicons name="people-outline" size={12} color="#94A3B8" style={{ marginRight: 4 }} />
                      <Text style={styles.clanMembersText}>10 a'zo</Text>
                    </View>
                  </View>

                  <View style={styles.colXp}>
                    <Text style={styles.userClanXpText}>548,200 XP</Text>
                  </View>
                </LinearGradient>
              </>
            )}
          </View>

          {/* 7. BOTTOM RULES CARD ("Liga qoidalari") */}
          <View style={styles.rulesCard}>
            {/* Left Column: Liga qoidalari */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.rulesLeftCol}
              onPress={() => {
                triggerHaptic();
                setInfoModalVisible(true);
              }}
            >
              <MaterialCommunityIcons name="chart-timeline-variant-shimmer" size={22} color="#C084FC" />
              <Text style={styles.rulesTitle}>Liga qoidalari</Text>
            </TouchableOpacity>

            <View style={styles.rulesDivider} />

            {/* Middle Column: Yuqoriga Top 10 */}
            <View style={styles.rulesCol}>
              <View style={styles.rulesBadgeGreen}>
                <Feather name="arrow-up" size={12} color="#34D399" style={{ marginRight: 2 }} />
                <Text style={styles.rulesBadgeGreenText}>Yuqoriga: <Text style={{ fontWeight: '800' }}>Top 10</Text></Text>
              </View>
              <Text style={styles.rulesDescText}>Platinum League ga ko'tariladi</Text>
            </View>

            <View style={styles.rulesDivider} />

            {/* Right Column: Pastga Bottom 20 */}
            <View style={styles.rulesCol}>
              <View style={styles.rulesBadgeRed}>
                <Feather name="arrow-down" size={12} color="#F87171" style={{ marginRight: 2 }} />
                <Text style={styles.rulesBadgeRedText}>Pastga: <Text style={{ fontWeight: '800' }}>Bottom 20</Text></Text>
              </View>
              <Text style={styles.rulesDescText}>Silver League ga tushadi</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

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
                <FontAwesome5 name="trophy" size={18} color="#FBBF24" style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>Liga qoidalari</Text>
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
                <Text style={styles.modalRuleHead}>1. Liga bosqichlari</Text>
                <Text style={styles.modalRuleBody}>
                  Clan'lar to'plagan umumiy XP miqdoriga ko'ra 5 ta ligaga bo'linadi: Bronze, Silver, Gold, Platinum va Diamond.
                </Text>
              </View>

              <View style={styles.modalRuleItem}>
                <Text style={styles.modalRuleHead}>2. Ko'tarilish va tushish</Text>
                <Text style={styles.modalRuleBody}>
                  Har haftalik yakunida ligadagi Top 10 ta eng yuqori natija ko'rsatgan clan yuqori ligaga ko'tariladi. Bottom 20 ta past natija ko'rsatgan clan quyi ligaga tushadi.
                </Text>
              </View>

              <View style={styles.modalRuleItem}>
                <Text style={styles.modalRuleHead}>3. Mavsum mukofotlari</Text>
                <Text style={styles.modalRuleBody}>
                  Har bir mavsum 30 kun davom etadi. Mavsum yakunida Platinum va Diamond ligalari a'zolari eksklyuziv avatar, unvon va XP bonuslariga ega bo'ladilar.
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

  // 1. HEADER
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
    position: 'relative',
    marginTop: 4,
    marginBottom: 8,
    alignItems: 'center',
  },
  mountainSvgWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 8,
  },
  heroSideCard: {
    width: (width - 32 - 140) / 2,
    backgroundColor: 'rgba(23, 17, 44, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.22)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSideLabel: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    fontWeight: '500',
  },
  heroRankNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FACC15',
    marginVertical: 2,
  },
  heroXpSub: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 4,
  },
  trendPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#34D399',
  },
  heroTrendDays: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 2,
  },

  // Center Shield & Titles
  heroCenterWrap: {
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroShieldContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 100,
  },
  heroShieldGlow: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  heroLeagueTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  heroSeasonSub: {
    fontSize: 11,
    color: '#A78BFA',
    marginTop: 2,
  },

  // 3. LEAGUE STEPPER
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(18, 14, 36, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 6,
    marginTop: 10,
    marginBottom: 12,
  },
  stepperItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  stepperItemSelected: {
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  stepperShieldBox: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  stepperLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  stepperLabelSelected: {
    color: '#FBBF24',
    fontWeight: '800',
  },
  stepperChevron: {
    marginHorizontal: -4,
  },

  // 4. PROGRESS CARD
  progressCard: {
    backgroundColor: 'rgba(20, 15, 38, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressTargetText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressTargetHighlight: {
    color: '#C084FC',
    fontWeight: '800',
  },
  progressRatioText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FBBF24',
  },
  progressRatioMuted: {
    color: '#94A3B8',
    fontWeight: '500',
  },
  progressBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    marginLeft: 10,
    width: 32,
    textAlign: 'right',
  },

  // 5. FILTER / SCOPE TABS
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 3,
  },
  tabButtonActive: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 3,
  },
  tabGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  tabInactiveContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  tabTextActive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tabTextInactive: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
  },

  // 6. LEADERBOARD TABLE
  tableCard: {
    backgroundColor: 'rgba(17, 13, 33, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 14,
    marginBottom: 14,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 6,
  },
  thRank: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    width: 32,
    textAlign: 'center',
  },
  thName: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    flex: 1,
    marginLeft: 14,
  },
  thXp: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    textAlign: 'right',
  },

  clanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  colRank: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRankBadgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  crownRibbonBadge: {
    width: 24,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
  },
  topRankText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#713F12',
  },
  normalRankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  normalRankText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E2E8F0',
  },

  colEmblem: {
    marginLeft: 8,
    marginRight: 10,
  },
  emblemBase: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1.2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemGrad: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emblemIconOverlay: {
    position: 'absolute',
  },

  colInfo: {
    flex: 1,
  },
  clanNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  clanMembersText: {
    fontSize: 11,
    color: '#94A3B8',
  },

  colXp: {
    alignItems: 'flex-end',
  },
  clanXpText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Ellipsis divider
  ellipsisRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  ellipsisDots: {
    color: '#8B5CF6',
    fontSize: 18,
    letterSpacing: 4,
    opacity: 0.7,
  },

  // Highlighted User Clan Row
  userClanHighlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#A855F7',
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginVertical: 2,
  },
  userClanRankBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#7E22CE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userClanRankText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  userClanNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userClanXpText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FACC15',
  },

  // 7. BOTTOM RULES CARD
  rulesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 17, 44, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  rulesLeftCol: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 82,
  },
  rulesTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E9D5FF',
    marginTop: 4,
    textAlign: 'center',
  },
  rulesDivider: {
    width: 1,
    height: 34,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: 8,
  },
  rulesCol: {
    flex: 1,
    justifyContent: 'center',
  },
  rulesBadgeGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  rulesBadgeGreenText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34D399',
  },
  rulesBadgeRed: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  rulesBadgeRedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F87171',
  },
  rulesDescText: {
    fontSize: 10,
    color: '#94A3B8',
    lineHeight: 13,
  },

  // MODAL
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
});
