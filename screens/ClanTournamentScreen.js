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

// TOURNAMENT STAGES
const STAGES = [
  { id: '1_16', label: '1/16 final', dates: '8 – 12 Okt', status: 'completed' },
  { id: '1_8', label: '1/8 final', dates: '13 – 17 Okt', status: 'active' },
  { id: '1_4', label: '1/4 final', dates: '18 – 21 Okt', status: 'locked' },
  { id: 'semi', label: 'Yarim final', dates: '22 – 25 Okt', status: 'locked' },
  { id: 'final', label: 'Final', dates: '28 Okt', status: 'locked' },
];

export default function ClanTournamentScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('umumiy'); // umumiy | jadval | ishtirokchilar | natijalar
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [clanDetailModalVisible, setClanDetailModalVisible] = useState(false);

  const triggerHaptic = (style = 'light') => {
    try {
      if (style === 'medium') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (e) {}
  };

  // 1. Medieval Pennants for Hero Section
  const renderMedievalBanner = (side = 'left') => {
    return (
      <View style={[styles.bannerContainer, side === 'right' && styles.bannerRight]}>
        <Svg width={44} height={78} viewBox="0 0 46 80">
          <Defs>
            <SvgGradient id={`tBannerGrad_${side}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#4C1D95" />
              <Stop offset="50%" stopColor="#3B0764" />
              <Stop offset="100%" stopColor="#1E1B4B" />
            </SvgGradient>
            <SvgGradient id={`tGoldRod_${side}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#F59E0B" />
              <Stop offset="50%" stopColor="#FDE047" />
              <Stop offset="100%" stopColor="#D97706" />
            </SvgGradient>
          </Defs>
          <Rect x="2" y="3" width="42" height="4" rx="2" fill={`url(#tGoldRod_${side})`} />
          <Circle cx="3" cy="5" r="3.5" fill="#FBBF24" />
          <Circle cx="43" cy="5" r="3.5" fill="#FBBF24" />
          <Path
            d="M 6 7 L 40 7 L 40 60 L 23 75 L 6 60 Z"
            fill={`url(#tBannerGrad_${side})`}
            stroke="#D97706"
            strokeWidth="1.5"
          />
          <G transform="translate(13, 26) scale(0.68)">
            <Path d="M 2 18 L 6 5 L 14 12 L 22 5 L 26 18 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
            <Circle cx="6" cy="4" r="1.5" fill="#FEF08A" />
            <Circle cx="14" cy="11" r="1.5" fill="#FEF08A" />
            <Circle cx="22" cy="4" r="1.5" fill="#FEF08A" />
            <Rect x="2" y="19" width="24" height="3" rx="1.5" fill="#F59E0B" />
          </G>
        </Svg>
      </View>
    );
  };

  // 2. Center Golden Trophy with Laurels and 5-pointed Star
  const renderGoldenTrophy = () => {
    return (
      <View style={styles.trophyWrapper}>
        <View style={styles.trophySunburstGlow} />
        <Svg width={140} height={95} viewBox="0 0 140 95">
          <Defs>
            <SvgGradient id="tTrophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FEF08A" />
              <Stop offset="40%" stopColor="#FBBF24" />
              <Stop offset="80%" stopColor="#F59E0B" />
              <Stop offset="100%" stopColor="#B45309" />
            </SvgGradient>
            <SvgGradient id="tLaurelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FEF08A" />
              <Stop offset="70%" stopColor="#FBBF24" />
              <Stop offset="100%" stopColor="#D97706" />
            </SvgGradient>
          </Defs>

          {/* Left Laurel Branch */}
          <Path d="M 45 75 Q 22 50 28 18" stroke="url(#tLaurelGrad)" strokeWidth="2.5" fill="none" />
          <Path d="M 40 65 Q 24 60 30 50 Q 36 55 40 65 Z" fill="url(#tLaurelGrad)" />
          <Path d="M 33 50 Q 16 44 24 34 Q 28 40 33 50 Z" fill="url(#tLaurelGrad)" />
          <Path d="M 28 34 Q 12 26 22 18 Q 25 24 28 34 Z" fill="url(#tLaurelGrad)" />

          {/* Right Laurel Branch */}
          <Path d="M 95 75 Q 118 50 112 18" stroke="url(#tLaurelGrad)" strokeWidth="2.5" fill="none" />
          <Path d="M 100 65 Q 116 60 110 50 Q 104 55 100 65 Z" fill="url(#tLaurelGrad)" />
          <Path d="M 107 50 Q 124 44 116 34 Q 112 40 107 50 Z" fill="url(#tLaurelGrad)" />
          <Path d="M 112 34 Q 128 26 118 18 Q 115 24 112 34 Z" fill="url(#tLaurelGrad)" />

          {/* Handles */}
          <Path d="M 48 22 C 28 22 28 46 48 50" stroke="url(#tTrophyGold)" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <Path d="M 92 22 C 112 22 112 46 92 50" stroke="url(#tTrophyGold)" strokeWidth="4.5" fill="none" strokeLinecap="round" />

          {/* Cup Body */}
          <Path d="M 44 14 L 96 14 C 96 44 85 58 70 59 C 55 58 44 44 44 14 Z" fill="url(#tTrophyGold)" stroke="#FEF08A" strokeWidth="1.2" />
          <Rect x="42" y="11" width="56" height="5" rx="2.5" fill="#FEF08A" stroke="#B45309" strokeWidth="0.8" />
          <Rect x="65" y="59" width="10" height="10" rx="1.5" fill="url(#tTrophyGold)" />
          <Polygon points="54,80 86,80 80,69 60,69" fill="url(#tTrophyGold)" stroke="#D97706" strokeWidth="1" />
          <Rect x="50" y="79" width="40" height="5" rx="2" fill="#92400E" stroke="#FEF08A" strokeWidth="0.8" />

          {/* Star on Cup */}
          <Polygon
            points="70,22 73,30 81,30 75,35 77,43 70,38 63,43 65,35 59,30 67,30"
            fill="#FEF08A"
            stroke="#B45309"
            strokeWidth="0.8"
          />
        </Svg>
      </View>
    );
  };

  // 3. Golden Shield Emblem with Crown
  const renderGoldCrownShield = (size = 54) => {
    return (
      <Svg width={size} height={size * 1.1} viewBox="0 0 54 60">
        <Defs>
          <SvgGradient id="cupShieldG" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FEF08A" />
            <Stop offset="45%" stopColor="#F59E0B" />
            <Stop offset="100%" stopColor="#92400E" />
          </SvgGradient>
        </Defs>
        <Path
          d="M 6 8 L 48 8 Q 48 38 27 54 Q 6 38 6 8 Z"
          fill="url(#cupShieldG)"
          stroke="#FEF08A"
          strokeWidth="2"
        />
        <Path
          d="M 11 12 L 43 12 Q 43 35 27 48 Q 11 35 11 12 Z"
          fill="#78350F"
          opacity={0.4}
        />
        <G transform="translate(14, 18) scale(0.95)">
          <Path
            d="M 2 18 L 6 5 L 14 12 L 22 5 L 26 18 Z"
            fill="#FEF08A"
            stroke="#92400E"
            strokeWidth="1.2"
          />
          <Circle cx="6" cy="4" r="1.5" fill="#FFFFFF" />
          <Circle cx="14" cy="11" r="1.5" fill="#FFFFFF" />
          <Circle cx="22" cy="4" r="1.5" fill="#FFFFFF" />
        </G>
      </Svg>
    );
  };

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
            <Text style={styles.headerTitleText}>Tournament</Text>
            <Text style={styles.headerSubtitleText}>Mavsumiy klan turniri</Text>
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
          {/* 2. HERO CARD: SEASON 5 TOURNAMENT */}
          <View style={styles.heroCard}>
            <LinearGradient
              colors={['#18103A', '#24144E', '#140C2C']}
              style={StyleSheet.absoluteFillObject}
            />

            {/* Background Mountain Silhouettes */}
            <View style={styles.heroMountainSvg}>
              <Svg width={width - 32} height={120} viewBox="0 0 350 120">
                <Defs>
                  <SvgGradient id="tMountG" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor="#4C1D95" stopOpacity={0.6} />
                    <Stop offset="100%" stopColor="#0B091A" stopOpacity={0.1} />
                  </SvgGradient>
                </Defs>
                <Path d="M 0 100 L 45 45 L 95 85 L 150 35 L 205 80 L 260 40 L 315 85 L 350 55 L 350 120 L 0 120 Z" fill="url(#tMountG)" />
              </Svg>
            </View>

            {/* Left and Right Medieval Pennants */}
            {renderMedievalBanner('left')}
            {renderMedievalBanner('right')}

            {/* Center Trophy */}
            {renderGoldenTrophy()}

            {/* Wide Ribbon Banner: "Season 5 Tournament" */}
            <View style={styles.ribbonWrapper}>
              <LinearGradient
                colors={['#7E22CE', '#6B21A8', '#581C87']}
                style={styles.ribbonGradient}
              >
                <Text style={styles.ribbonTitleText}>Season 5 Tournament</Text>
              </LinearGradient>
            </View>

            <Text style={styles.heroChampionshipSub}>Clan Championship</Text>

            {/* 4-Col Dates Bar */}
            <View style={styles.heroDatesBar}>
              <View style={styles.dateCol}>
                <Ionicons name="calendar-outline" size={14} color="#94A3B8" style={{ marginBottom: 2 }} />
                <Text style={styles.dateLabel}>Ro'yxatdan o'tish</Text>
                <Text style={styles.dateValue}>1 – 7 Okt</Text>
              </View>

              <View style={styles.dateCol}>
                <FontAwesome5 name="crown" size={12} color="#94A3B8" style={{ marginBottom: 3 }} />
                <Text style={styles.dateLabel}>Turnir boshlanishi</Text>
                <Text style={styles.dateValue}>8 Okt</Text>
              </View>

              <View style={styles.dateCol}>
                <Ionicons name="flag-outline" size={14} color="#94A3B8" style={{ marginBottom: 2 }} />
                <Text style={styles.dateLabel}>Final</Text>
                <Text style={styles.dateValue}>28 Okt</Text>
              </View>

              <View style={styles.dateCol}>
                <Ionicons name="time-outline" size={14} color="#FBBF24" style={{ marginBottom: 2 }} />
                <Text style={styles.dateLabel}>Qolgan vaqt</Text>
                <Text style={styles.dateValueYellow}>6 kun 14 soat</Text>
              </View>
            </View>
          </View>

          {/* 3. HORIZONTAL TABS (Umumiy | Jadval | Ishtirokchilar | Natijalar) */}
          <View style={styles.tabsRow}>
            {/* Tab 1: Umumiy */}
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
                  <FontAwesome5 name="trophy" size={13} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.tabTextActive}>Umumiy</Text>
                </LinearGradient>
              ) : (
                <View style={styles.tabInactiveContent}>
                  <FontAwesome5 name="trophy" size={13} color="#94A3B8" style={{ marginRight: 6 }} />
                  <Text style={styles.tabTextInactive}>Umumiy</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Tab 2: Jadval */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.tabButton, activeTab === 'jadval' && styles.tabButtonActive]}
              onPress={() => {
                triggerHaptic();
                setActiveTab('jadval');
              }}
            >
              {activeTab === 'jadval' ? (
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.tabGradient}
                >
                  <MaterialCommunityIcons name="tournament" size={15} color="#FFFFFF" style={{ marginRight: 5 }} />
                  <Text style={styles.tabTextActive}>Jadval</Text>
                </LinearGradient>
              ) : (
                <View style={styles.tabInactiveContent}>
                  <MaterialCommunityIcons name="tournament" size={15} color="#94A3B8" style={{ marginRight: 5 }} />
                  <Text style={styles.tabTextInactive}>Jadval</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Tab 3: Ishtirokchilar */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.tabButton, activeTab === 'ishtirokchilar' && styles.tabButtonActive]}
              onPress={() => {
                triggerHaptic();
                setActiveTab('ishtirokchilar');
              }}
            >
              {activeTab === 'ishtirokchilar' ? (
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.tabGradient}
                >
                  <Ionicons name="people-outline" size={15} color="#FFFFFF" style={{ marginRight: 5 }} />
                  <Text style={styles.tabTextActive}>Ishtirokchilar</Text>
                </LinearGradient>
              ) : (
                <View style={styles.tabInactiveContent}>
                  <Ionicons name="people-outline" size={15} color="#94A3B8" style={{ marginRight: 5 }} />
                  <Text style={styles.tabTextInactive}>Ishtirokchilar</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Tab 4: Natijalar */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.tabButton, activeTab === 'natijalar' && styles.tabButtonActive]}
              onPress={() => {
                triggerHaptic();
                setActiveTab('natijalar');
              }}
            >
              {activeTab === 'natijalar' ? (
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.tabGradient}
                >
                  <Ionicons name="time-outline" size={15} color="#FFFFFF" style={{ marginRight: 5 }} />
                  <Text style={styles.tabTextActive}>Natijalar</Text>
                </LinearGradient>
              ) : (
                <View style={styles.tabInactiveContent}>
                  <Ionicons name="time-outline" size={15} color="#94A3B8" style={{ marginRight: 5 }} />
                  <Text style={styles.tabTextInactive}>Natijalar</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* 4. IQROMAX CUP OVERVIEW CARD */}
          <View style={styles.cupOverviewCard}>
            {/* Background Mountains & Golden Flag */}
            <View style={styles.cupMountainBackdrop}>
              <Svg width={160} height={100} viewBox="0 0 160 100">
                <Defs>
                  <SvgGradient id="cupSummitG" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor="#7E22CE" stopOpacity={0.7} />
                    <Stop offset="100%" stopColor="#1E103A" stopOpacity={0.2} />
                  </SvgGradient>
                </Defs>
                <Path d="M 0 100 L 70 25 L 100 65 L 135 35 L 160 100 Z" fill="url(#cupSummitG)" />
                {/* Summit Flag */}
                <Path d="M 70 25 L 70 6" stroke="#FDE047" strokeWidth="1.8" />
                <Path d="M 70 6 Q 84 3 90 9 Q 80 14 70 17 Z" fill="#FACC15" />
              </Svg>
            </View>

            {/* Top row: Shield + Title */}
            <View style={styles.cupTopRow}>
              <View style={styles.cupShieldWrap}>
                {renderGoldCrownShield(56)}
              </View>

              <View style={styles.cupTitleCol}>
                <Text style={styles.cupTitleText}>IQROMAX Cup</Text>
                <Text style={styles.cupSeasonSub}>Season 5 • Clan Tournament</Text>
                <Text style={styles.cupDescText}>
                  Eng kuchli klanlarni aniqlaydigan mavsumiy musobaqa!
                </Text>
              </View>
            </View>

            {/* Bottom 4 Metric Stats */}
            <View style={styles.cupMetricsRow}>
              <View style={styles.cupMetricItem}>
                <Ionicons name="people-outline" size={18} color="#C084FC" />
                <View style={{ marginLeft: 6 }}>
                  <Text style={styles.cupMetricValue}>64</Text>
                  <Text style={styles.cupMetricLabel}>Klan</Text>
                </View>
              </View>

              <View style={styles.cupMetricItem}>
                <MaterialCommunityIcons name="sword-cross" size={18} color="#C084FC" />
                <View style={{ marginLeft: 6 }}>
                  <Text style={styles.cupMetricValue}>3</Text>
                  <Text style={styles.cupMetricLabel}>Bosqich</Text>
                </View>
              </View>

              <View style={styles.cupMetricItem}>
                <FontAwesome5 name="trophy" size={15} color="#FBBF24" />
                <View style={{ marginLeft: 6 }}>
                  <Text style={styles.cupMetricValue}>1,000,000 XP</Text>
                  <Text style={styles.cupMetricLabel}>Umumiy mukofot</Text>
                </View>
              </View>

              <View style={styles.cupMetricItem}>
                <Ionicons name="shield-checkmark" size={18} color="#C084FC" />
                <View style={{ marginLeft: 6 }}>
                  <Text style={styles.cupMetricValue}>Diamond Badge</Text>
                  <Text style={styles.cupMetricLabel}>G'olib unvoni</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 5. TURNIR BOSQICHLARI (STEPPER) */}
          <View style={styles.stagesCard}>
            <View style={styles.stagesHeaderRow}>
              <MaterialCommunityIcons name="layers-outline" size={16} color="#C084FC" style={{ marginRight: 6 }} />
              <Text style={styles.stagesHeaderTitle}>Turnir bosqichlari</Text>
            </View>

            <View style={styles.stagesStepperRow}>
              {STAGES.map((stg, idx) => {
                const isCompleted = stg.status === 'completed';
                const isActive = stg.status === 'active';
                const isLocked = stg.status === 'locked';
                const isLast = idx === STAGES.length - 1;
                const nextStage = !isLast ? STAGES[idx + 1] : null;
                const lineGreen = isCompleted && nextStage?.status === 'active';

                return (
                  <View key={stg.id} style={styles.stageItemWrap}>
                    {/* Node */}
                    <View style={styles.stageNodeContainer}>
                      {isCompleted && (
                        <View style={styles.nodeCompleted}>
                          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                        </View>
                      )}

                      {isActive && (
                        <View style={styles.nodeActive}>
                          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                        </View>
                      )}

                      {isLocked && (
                        <View style={styles.nodeLocked}>
                          <Feather name="lock" size={11} color="#94A3B8" />
                        </View>
                      )}

                      {/* Connecting Line */}
                      {!isLast && (
                        <View
                          style={[
                            styles.stageLine,
                            lineGreen ? styles.stageLineGreen : styles.stageLineMuted,
                          ]}
                        />
                      )}
                    </View>

                    {/* Labels */}
                    <Text style={[styles.stageNameText, isActive && styles.stageNameTextActive]}>
                      {stg.label}
                    </Text>
                    <Text style={styles.stageDateText}>{stg.dates}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* 6. DUAL CARDS (Bizning klan | Keyingi o'yin) */}
          <View style={styles.dualCardsRow}>
            {/* Left Card: Bizning klan */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.halfCard}
              onPress={() => {
                triggerHaptic();
                setClanDetailModalVisible(true);
              }}
            >
              <View style={styles.cardHeaderSmall}>
                <FontAwesome5 name="crown" size={12} color="#C084FC" style={{ marginRight: 6 }} />
                <Text style={styles.cardHeaderSmallText}>Bizning klan</Text>
              </View>

              <View style={styles.bizningKlanContent}>
                <View style={styles.bizningKlanEmblem}>
                  {renderGoldCrownShield(40)}
                </View>

                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.bizningKlanName}>IQROMAX Clan</Text>
                  <View style={styles.membersRowSmall}>
                    <Ionicons name="people-outline" size={11} color="#94A3B8" style={{ marginRight: 3 }} />
                    <Text style={styles.bizningKlanMembers}>10 a'zo</Text>
                  </View>
                  <View style={styles.stageBadgePill}>
                    <Text style={styles.stageBadgePillText}>1/8 final</Text>
                  </View>
                </View>

                <Feather name="chevron-right" size={16} color="#94A3B8" />
              </View>
            </TouchableOpacity>

            {/* Right Card: Keyingi o'yin */}
            <View style={styles.halfCard}>
              <View style={styles.cardHeaderSmall}>
                <MaterialCommunityIcons name="sword-cross" size={14} color="#C084FC" style={{ marginRight: 6 }} />
                <Text style={styles.cardHeaderSmallText}>Keyingi o'yin</Text>
              </View>

              {/* Matchup VS */}
              <View style={styles.matchupRow}>
                {/* Team 1: IQROMAX Clan */}
                <View style={styles.matchupTeam}>
                  <View style={styles.matchupEmblemGold}>
                    <FontAwesome5 name="crown" size={14} color="#FBBF24" />
                  </View>
                  <Text style={styles.matchupTeamName}>IQROMAX Clan</Text>
                </View>

                {/* VS Badge */}
                <Text style={styles.matchupVsText}>VS</Text>

                {/* Team 2: MathMasters */}
                <View style={styles.matchupTeam}>
                  <View style={styles.matchupEmblemRed}>
                    <FontAwesome5 name="shield-alt" size={15} color="#FB923C" />
                  </View>
                  <Text style={styles.matchupTeamName}>MathMasters</Text>
                </View>
              </View>

              {/* Match Date Pill */}
              <View style={styles.matchDatePill}>
                <Ionicons name="calendar-outline" size={12} color="#CBD5E1" style={{ marginRight: 4 }} />
                <Text style={styles.matchDateText}>15 Okt, 20:00</Text>
              </View>
            </View>
          </View>

          {/* 7. TURNIR MUKOFOTLARI (PODIUM 3 CARDS) */}
          <View style={styles.rewardsSection}>
            <View style={styles.rewardsHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="gift" size={16} color="#C084FC" style={{ marginRight: 6 }} />
                <Text style={styles.rewardsSectionTitle}>Turnir mukofotlari</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  triggerHaptic();
                  navigation.navigate('ClanSeasonRewardsScreen');
                }}
              >
                <Text style={styles.rewardsSeeAllText}>Barchasini ko'rish &gt;</Text>
              </TouchableOpacity>
            </View>

            {/* 3 Podium Cards */}
            <View style={styles.podiumCardsRow}>
              {/* 1-o'rin (Gold - Highlighted) */}
              <View style={[styles.podiumCard, styles.podiumCardGold]}>
                <View style={styles.podiumTrophyBox}>
                  <FontAwesome5 name="trophy" size={20} color="#FBBF24" />
                </View>
                <Text style={styles.podiumRankTextGold}>1-o'rin</Text>
                <Text style={styles.podiumXpText}>500,000 XP</Text>
                <View style={styles.podiumBonusRow}>
                  <Text style={styles.podiumCoinText}>🪙 +50,000</Text>
                  <Text style={styles.podiumGemText}>💎 +5,000</Text>
                </View>
              </View>

              {/* 2-o'rin (Silver) */}
              <View style={[styles.podiumCard, styles.podiumCardSilver]}>
                <View style={styles.podiumTrophyBox}>
                  <FontAwesome5 name="shield-alt" size={20} color="#94A3B8" />
                </View>
                <Text style={styles.podiumRankTextSilver}>2-o'rin</Text>
                <Text style={styles.podiumXpText}>300,000 XP</Text>
                <View style={styles.podiumBonusRow}>
                  <Text style={styles.podiumCoinText}>🪙 +30,000</Text>
                  <Text style={styles.podiumGemText}>💎 +3,000</Text>
                </View>
              </View>

              {/* 3-o'rin (Bronze) */}
              <View style={[styles.podiumCard, styles.podiumCardBronze]}>
                <View style={styles.podiumTrophyBox}>
                  <FontAwesome5 name="shield-alt" size={20} color="#D97706" />
                </View>
                <Text style={styles.podiumRankTextBronze}>3-o'rin</Text>
                <Text style={styles.podiumXpText}>200,000 XP</Text>
                <View style={styles.podiumBonusRow}>
                  <Text style={styles.podiumCoinText}>🪙 +20,000</Text>
                  <Text style={styles.podiumGemText}>💎 +2,000</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 8. BOTTOM ACTION BUTTON ("Turnir haqida batafsil") */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.bottomActionButton}
            onPress={() => {
              triggerHaptic('medium');
              setInfoModalVisible(true);
            }}
          >
            <LinearGradient
              colors={['#8B5CF6', '#6D28D9', '#5B21B6']}
              style={styles.bottomActionGrad}
            >
              <Ionicons name="people-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.bottomActionText}>Turnir haqida batafsil</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      {/* TOURNAMENT DETAIL / INFO MODAL */}
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
                <Text style={styles.modalTitle}>Season 5 Tournament</Text>
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
                <Text style={styles.modalRuleHead}>1. Turnir tartibi</Text>
                <Text style={styles.modalRuleBody}>
                  Turnir 64 ta eng yaxshi klanlar ishtirokida olimpik pley-off (Play-off Knockout) tizimida o'tkaziladi: 1/16, 1/8, 1/4, Yarim final va Final.
                </Text>
              </View>

              <View style={styles.modalRuleItem}>
                <Text style={styles.modalRuleHead}>2. Bahslar formati</Text>
                <Text style={styles.modalRuleBody}>
                  Har bir bosqichda jamoalar bir-biri bilan 1 vs 1 Battle va Jamoaviy estafeta bo'yicha kuch sinashadi. G'olib jamoa keyingi bosqichga yo'l oladi.
                </Text>
              </View>

              <View style={styles.modalRuleItem}>
                <Text style={styles.modalRuleHead}>3. Mukofotlar jamg'armasi</Text>
                <Text style={styles.modalRuleBody}>
                  Umumiy sovrin jamg'armasi 1,000,000 XP! Chempion klan 500,000 XP, 50,000 tanga, 5,000 olmos va maxsus Diamond Chempionlik nishonini qo'lga kiritadi.
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

      {/* CLAN DETAIL MODAL */}
      <Modal
        visible={clanDetailModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setClanDetailModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <FontAwesome5 name="crown" size={16} color="#FBBF24" style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>IQROMAX Clan Turnir Holati</Text>
              </View>
              <TouchableOpacity
                onPress={() => setClanDetailModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Feather name="x" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 14 }}>
              <Text style={styles.modalRuleHead}>Joriy bosqich: 1/8 final</Text>
              <Text style={styles.modalRuleBody}>
                Klaningiz 1/16 final bosqichida g'alaba qozondi va muvaffaqiyatli 1/8 finalga yo'l oldi!
                {'\n\n'}
                Keyingi raqib: MathMasters klani.
                {'\n'}O'yin vaqti: 15 Oktabr, soat 20:00 da.
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modalPrimaryButton}
              onPress={() => setClanDetailModalVisible(false)}
            >
              <Text style={styles.modalPrimaryButtonText}>Tayyormiz!</Text>
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

  // 2. HERO CARD
  heroCard: {
    borderRadius: 22,
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    alignItems: 'center',
  },
  heroMountainSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.6,
  },
  bannerContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 2,
  },
  bannerRight: {
    left: undefined,
    right: 12,
  },
  trophyWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 95,
    marginTop: 4,
  },
  trophySunburstGlow: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(245, 158, 11, 0.28)',
  },

  // Ribbon
  ribbonWrapper: {
    marginTop: 6,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  ribbonGradient: {
    paddingHorizontal: 22,
    paddingVertical: 6,
    borderRadius: 14,
  },
  ribbonTitleText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  heroChampionshipSub: {
    fontSize: 12,
    color: '#D8B4FE',
    fontWeight: '700',
    marginTop: 4,
  },

  // 4-Col Dates Bar
  heroDatesBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'rgba(18, 14, 38, 0.75)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginTop: 14,
  },
  dateCol: {
    flex: 1,
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 9,
    color: '#94A3B8',
    textAlign: 'center',
  },
  dateValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
    textAlign: 'center',
  },
  dateValueYellow: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FBBF24',
    marginTop: 2,
    textAlign: 'center',
  },

  // 3. HORIZONTAL TABS
  tabsRow: {
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
    marginHorizontal: 2.5,
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
    paddingHorizontal: 4,
  },
  tabInactiveContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 4,
  },
  tabTextActive: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tabTextInactive: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
  },

  // 4. IQROMAX CUP CARD
  cupOverviewCard: {
    position: 'relative',
    backgroundColor: 'rgba(20, 15, 42, 0.85)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    padding: 14,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cupMountainBackdrop: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.8,
  },
  cupTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  cupShieldWrap: {
    marginRight: 12,
    marginTop: 2,
  },
  cupTitleCol: {
    flex: 1,
    paddingRight: 60,
  },
  cupTitleText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  cupSeasonSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C084FC',
    marginTop: 2,
  },
  cupDescText: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 15,
    marginTop: 3,
  },

  // Cup 4 Metrics
  cupMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 10,
  },
  cupMetricItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cupMetricValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cupMetricLabel: {
    fontSize: 9,
    color: '#94A3B8',
  },

  // 5. STAGES STEPPER
  stagesCard: {
    backgroundColor: 'rgba(20, 15, 38, 0.85)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.22)',
    padding: 14,
    marginBottom: 12,
  },
  stagesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  stagesHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stagesStepperRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  stageItemWrap: {
    flex: 1,
    alignItems: 'center',
  },
  stageNodeContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 26,
    marginBottom: 6,
  },
  nodeCompleted: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  nodeActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    borderWidth: 2,
    borderColor: '#C084FC',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
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
    zIndex: 2,
  },
  stageLine: {
    position: 'absolute',
    top: 11,
    left: '50%',
    right: '-50%',
    height: 3,
    zIndex: 1,
  },
  stageLineGreen: {
    backgroundColor: '#10B981',
  },
  stageLineMuted: {
    backgroundColor: 'rgba(139, 92, 246, 0.25)',
  },
  stageNameText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    textAlign: 'center',
  },
  stageNameTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  stageDateText: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },

  // 6. DUAL CARDS
  dualCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  halfCard: {
    flex: 1,
    backgroundColor: 'rgba(20, 15, 38, 0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.22)',
    padding: 12,
    marginHorizontal: 3,
  },
  cardHeaderSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardHeaderSmallText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C084FC',
  },
  bizningKlanContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bizningKlanEmblem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bizningKlanName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  membersRowSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  bizningKlanMembers: {
    fontSize: 10,
    color: '#94A3B8',
  },
  stageBadgePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(139, 92, 246, 0.25)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  stageBadgePillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#E9D5FF',
  },

  // Matchup VS
  matchupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  matchupTeam: {
    alignItems: 'center',
    flex: 1,
  },
  matchupEmblemGold: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  matchupEmblemRed: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    borderWidth: 1,
    borderColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  matchupTeamName: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  matchupVsText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#C084FC',
    marginHorizontal: 4,
  },
  matchDatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    paddingVertical: 4,
  },
  matchDateText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#CBD5E1',
  },

  // 7. TOURNAMENT REWARDS
  rewardsSection: {
    marginBottom: 14,
  },
  rewardsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rewardsSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  rewardsSeeAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C084FC',
  },
  podiumCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  podiumCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  podiumCardGold: {
    borderColor: '#F59E0B',
    borderWidth: 1.5,
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
  },
  podiumCardSilver: {
    borderColor: 'rgba(148, 163, 184, 0.35)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  podiumCardBronze: {
    borderColor: 'rgba(217, 119, 6, 0.35)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  podiumTrophyBox: {
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  podiumRankTextGold: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FBBF24',
  },
  podiumRankTextSilver: {
    fontSize: 11,
    fontWeight: '800',
    color: '#CBD5E1',
  },
  podiumRankTextBronze: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FB923C',
  },
  podiumXpText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    marginVertical: 3,
    textAlign: 'center',
  },
  podiumBonusRow: {
    alignItems: 'center',
    marginTop: 2,
  },
  podiumCoinText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FDE047',
    marginBottom: 2,
  },
  podiumGemText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E879F9',
  },

  // 8. BOTTOM ACTION BUTTON
  bottomActionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  bottomActionGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  bottomActionText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
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

