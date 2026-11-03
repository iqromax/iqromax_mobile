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
  Rect,
  G,
} from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { getClanTranslations } from '../src/utils/clanTranslations';

const { width } = Dimensions.get('window');

export function SeasonTabContent({ navigation, user, language }) {
  const insets = useSafeAreaInsets();
  const currentLang = language || user?.language || 'uz';
  const t = getClanTranslations(currentLang);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [tournamentModalVisible, setTournamentModalVisible] = useState(false);

  const triggerHaptic = (type = 'light') => {
    try {
      if (type === 'medium') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (e) {}
  };

  // Render medieval hanging banner with golden crown on left/right
  const renderMedievalBanner = (side = 'left') => {
    return (
      <View style={[styles.bannerContainer, side === 'right' && styles.bannerRight]}>
        <Svg width={44} height={78} viewBox="0 0 46 80">
          <Defs>
            <SvgGradient id={`bannerGrad_${side}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#4C1D95" />
              <Stop offset="50%" stopColor="#3B0764" />
              <Stop offset="100%" stopColor="#1E1B4B" />
            </SvgGradient>
            <SvgGradient id={`goldRodGrad_${side}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#F59E0B" />
              <Stop offset="50%" stopColor="#FDE047" />
              <Stop offset="100%" stopColor="#D97706" />
            </SvgGradient>
          </Defs>

          {/* Hanging Rod with Finials */}
          <Rect x="2" y="3" width="42" height="4" rx="2" fill={`url(#goldRodGrad_${side})`} />
          <Circle cx="3" cy="5" r="3.5" fill="#FBBF24" />
          <Circle cx="43" cy="5" r="3.5" fill="#FBBF24" />

          {/* Pennant Fabric with V-cut at bottom */}
          <Path
            d="M 6 7 L 40 7 L 40 60 L 23 75 L 6 60 Z"
            fill={`url(#bannerGrad_${side})`}
            stroke="#D97706"
            strokeWidth="1.5"
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

  // Render Golden Trophy with Star and Laurel branches
  const renderGoldenTrophy = () => {
    return (
      <View style={styles.trophyWrapper}>
        {/* Warm Golden Glow behind trophy */}
        <View style={styles.trophySunburstGlow} />

        <Svg width={140} height={100} viewBox="0 0 140 100">
          <Defs>
            <SvgGradient id="trophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FEF08A" />
              <Stop offset="40%" stopColor="#FBBF24" />
              <Stop offset="80%" stopColor="#F59E0B" />
              <Stop offset="100%" stopColor="#B45309" />
            </SvgGradient>
            <SvgGradient id="laurelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FEF08A" />
              <Stop offset="70%" stopColor="#FBBF24" />
              <Stop offset="100%" stopColor="#D97706" />
            </SvgGradient>
          </Defs>

          {/* Left Laurel Branch */}
          <Path d="M 45 80 Q 22 55 28 20" stroke="url(#laurelGrad)" strokeWidth="2.5" fill="none" />
          <Path d="M 40 70 Q 24 64 30 55 Q 36 60 40 70 Z" fill="url(#laurelGrad)" />
          <Path d="M 33 55 Q 16 48 24 38 Q 28 44 33 55 Z" fill="url(#laurelGrad)" />
          <Path d="M 28 38 Q 12 30 22 20 Q 25 28 28 38 Z" fill="url(#laurelGrad)" />
          <Path d="M 26 22 Q 18 14 26 12 Q 28 17 26 22 Z" fill="url(#laurelGrad)" />

          {/* Right Laurel Branch */}
          <Path d="M 95 80 Q 118 55 112 20" stroke="url(#laurelGrad)" strokeWidth="2.5" fill="none" />
          <Path d="M 100 70 Q 116 64 110 55 Q 104 60 100 70 Z" fill="url(#laurelGrad)" />
          <Path d="M 107 55 Q 124 48 116 38 Q 112 44 107 55 Z" fill="url(#laurelGrad)" />
          <Path d="M 112 38 Q 128 30 118 20 Q 115 28 112 38 Z" fill="url(#laurelGrad)" />
          <Path d="M 114 22 Q 122 14 114 12 Q 112 17 114 22 Z" fill="url(#laurelGrad)" />

          {/* Trophy Handles */}
          <Path d="M 48 25 C 28 25 28 50 48 55" stroke="url(#trophyGold)" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <Path d="M 92 25 C 112 25 112 50 92 55" stroke="url(#trophyGold)" strokeWidth="4.5" fill="none" strokeLinecap="round" />

          {/* Trophy Cup Body */}
          <Path d="M 44 15 L 96 15 C 96 48 85 64 70 65 C 55 64 44 48 44 15 Z" fill="url(#trophyGold)" stroke="#FEF08A" strokeWidth="1.2" />

          {/* Trophy Rim */}
          <Rect x="42" y="12" width="56" height="6" rx="3" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />

          {/* Stem & Base */}
          <Rect x="65" y="65" width="10" height="12" rx="1.5" fill="url(#trophyGold)" />
          <Polygon points="54,88 86,88 80,77 60,77" fill="url(#trophyGold)" stroke="#D97706" strokeWidth="1" />
          <Rect x="50" y="87" width="40" height="6" rx="2" fill="#92400E" stroke="#FEF08A" strokeWidth="0.8" />

          {/* 5-pointed star emblem on cup */}
          <Polygon
            points="70,25 73,33 81,33 75,38 77,46 70,41 63,46 65,38 59,33 67,33"
            fill="#FEF08A"
            stroke="#B45309"
            strokeWidth="0.8"
          />
        </Svg>
      </View>
    );
  };

  // Render 3D Golden League Winged Shield
  const renderGoldLeagueShield = () => {
    return (
      <Svg width={46} height={46} viewBox="0 0 54 54">
        <Defs>
          <SvgGradient id="goldShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FEF08A" />
            <Stop offset="50%" stopColor="#FBBF24" />
            <Stop offset="100%" stopColor="#B45309" />
          </SvgGradient>
          <SvgGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FDE047" />
            <Stop offset="100%" stopColor="#D97706" />
          </SvgGradient>
        </Defs>

        {/* Left Wing tiers */}
        <Path d="M 16 18 Q 4 15 2 24 Q 10 24 16 26 Z" fill="url(#wingGrad)" />
        <Path d="M 16 25 Q 6 24 5 32 Q 12 30 16 32 Z" fill="url(#wingGrad)" />
        <Path d="M 16 32 Q 9 32 9 38 Q 14 36 17 37 Z" fill="url(#wingGrad)" />

        {/* Right Wing tiers */}
        <Path d="M 38 18 Q 50 15 52 24 Q 44 24 38 26 Z" fill="url(#wingGrad)" />
        <Path d="M 38 25 Q 48 24 49 32 Q 42 30 38 32 Z" fill="url(#wingGrad)" />
        <Path d="M 38 32 Q 45 32 45 38 Q 40 36 37 37 Z" fill="url(#wingGrad)" />

        {/* Central Shield */}
        <Path
          d="M 16 12 L 38 12 Q 38 32 27 45 Q 16 32 16 12 Z"
          fill="url(#goldShieldGrad)"
          stroke="#FEF08A"
          strokeWidth="1.5"
        />

        {/* Star */}
        <Polygon
          points="27,18 29,24 35,24 30,28 32,34 27,30 22,34 24,28 19,24 25,24"
          fill="#FEF08A"
          stroke="#92400E"
          strokeWidth="0.6"
        />
      </Svg>
    );
  };

  // Render 3D Platinum League Shield with silver wings & cyan crown
  const renderPlatinumLeagueShield = () => {
    return (
      <Svg width={72} height={64} viewBox="0 0 76 68">
        <Defs>
          <SvgGradient id="platShield" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#38BDF8" />
            <Stop offset="40%" stopColor="#6366F1" />
            <Stop offset="100%" stopColor="#4338CA" />
          </SvgGradient>
          <SvgGradient id="platWing" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#E0F2FE" />
            <Stop offset="60%" stopColor="#93C5FD" />
            <Stop offset="100%" stopColor="#3B82F6" />
          </SvgGradient>
        </Defs>

        {/* Left Wing */}
        <Path d="M 24 22 Q 4 16 2 30 Q 14 30 24 34 Z" fill="url(#platWing)" />
        <Path d="M 24 32 Q 8 30 7 42 Q 17 38 24 40 Z" fill="url(#platWing)" />

        {/* Right Wing */}
        <Path d="M 52 22 Q 72 16 74 30 Q 62 30 52 34 Z" fill="url(#platWing)" />
        <Path d="M 52 32 Q 68 30 69 42 Q 59 38 52 40 Z" fill="url(#platWing)" />

        {/* Shield Frame */}
        <Polygon points="38,4 58,16 58,46 38,64 18,46 18,16" fill="url(#platWing)" opacity="0.4" />
        <Path
          d="M 22 14 L 54 14 Q 54 42 38 58 Q 22 42 22 14 Z"
          fill="url(#platShield)"
          stroke="#BAE6FD"
          strokeWidth="1.8"
        />

        {/* Crown on Shield */}
        <G transform="translate(28, 26) scale(0.75)">
          <Path
            d="M 2 18 L 6 6 L 14 12 L 22 6 L 26 18 Z"
            fill="#38BDF8"
            stroke="#E0F2FE"
            strokeWidth="1.5"
          />
          <Circle cx="6" cy="5" r="1.5" fill="#FFFFFF" />
          <Circle cx="14" cy="11" r="1.5" fill="#FFFFFF" />
          <Circle cx="22" cy="5" r="1.5" fill="#FFFFFF" />
          <Rect x="2" y="19" width="24" height="3" rx="1.5" fill="#0284C7" />
        </G>
      </Svg>
    );
  };

  return (
    <>
      {/* MAIN SCROLLABLE CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
      >
          {/* 2. HERO CARD: SEASON 5 SHOWCASE */}
          <View style={styles.heroCard}>
            <LinearGradient
              colors={['#18103A', '#24144E', '#140C2C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />

            {/* Background Mountains */}
            <Svg width={width - 32} height={120} viewBox={`0 0 ${width - 32} 120`} style={styles.heroMountainSvg}>
              <Polygon points={`0,120 40,55 90,120`} fill="#2B1055" opacity="0.6" />
              <Polygon points={`30,120 75,40 120,120`} fill="#3B0764" opacity="0.75" />
              <Polygon points={`${width - 150},120 ${width - 95},40 ${width - 40},120`} fill="#3B0764" opacity="0.75" />
              <Polygon points={`${width - 100},120 ${width - 50},55 ${width - 10},120`} fill="#2B1055" opacity="0.6" />
            </Svg>

            {/* Left and Right Medieval Pennants */}
            {renderMedievalBanner('left')}
            {renderMedievalBanner('right')}

            {/* Center Golden Trophy */}
            {renderGoldenTrophy()}

            {/* Season 5 Title & Competition Pill */}
            <View style={styles.seasonTitleWrap}>
              <Text style={styles.seasonTitleText}>{t.season5 || 'Season 5'}</Text>
              <View style={styles.competitionPill}>
                <Text style={styles.competitionPillText}>{t.clanCompetition || 'Klan musobaqasi'}</Text>
              </View>
            </View>

            {/* Bottom 3-Col Dates & Time Remaining */}
            <View style={styles.heroDatesRow}>
              {/* Col 1: Boshlanish */}
              <View style={styles.heroDateCol}>
                <View style={styles.heroDateIconRow}>
                  <Ionicons name="calendar-outline" size={14} color="#94A3B8" style={{ marginRight: 4 }} />
                  <Text style={styles.heroDateLabel}>Boshlanish</Text>
                </View>
                <Text style={styles.heroDateValue}>1 Okt, 2026</Text>
              </View>

              {/* Col 2: Tugash */}
              <View style={styles.heroDateCol}>
                <View style={styles.heroDateIconRow}>
                  <Ionicons name="calendar-outline" size={14} color="#94A3B8" style={{ marginRight: 4 }} />
                  <Text style={styles.heroDateLabel}>Tugash</Text>
                </View>
                <Text style={styles.heroDateValue}>30 Okt, 2026</Text>
              </View>

              {/* Col 3: Qolgan vaqt */}
              <View style={styles.heroDateCol}>
                <View style={styles.heroDateIconRow}>
                  <Ionicons name="time-outline" size={14} color="#94A3B8" style={{ marginRight: 4 }} />
                  <Text style={styles.heroDateLabel}>Qolgan vaqt</Text>
                </View>
                <Text style={styles.heroDateValueYellow}>18 kun 14 soat</Text>
              </View>
            </View>
          </View>

          {/* 3. CARD 1: CLAN SEASON XP (24,500 / 50,000 XP) */}
          <View style={styles.seasonXpCard}>
            <View style={styles.seasonXpHeader}>
              <View style={styles.seasonXpHeaderLeft}>
                <View style={styles.shieldIconWrap}>
                  <MaterialCommunityIcons name="shield-star" size={24} color="#A855F7" />
                </View>
                <Text style={styles.seasonXpTitle}>Clan Season XP</Text>
              </View>

              <Text style={styles.seasonXpTargetText}>
                <Text style={{ color: '#FBBF24', fontFamily: 'Inter_700Bold' }}>24,500</Text> / 50,000 XP
              </Text>
            </View>

            {/* Gradient Progress Bar */}
            <View style={styles.seasonXpBarTrack}>
              <LinearGradient
                colors={['#A855F7', '#C084FC']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[styles.seasonXpBarFill, { width: '49%' }]}
              />
            </View>

            <View style={styles.seasonXpPercentRow}>
              <Text style={styles.seasonXpPercentText}>49%</Text>
            </View>
          </View>

          {/* 4. CARD 2: LEAGUE & RANKING (SIDE-BY-SIDE) */}
          <View style={styles.leagueAndRankRow}>
            {/* Left Card: Gold League */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.leagueCard}
              onPress={() => {
                triggerHaptic();
                setInfoModalVisible(true);
              }}
            >
              <View style={styles.leagueCardTopRow}>
                {renderGoldLeagueShield()}
                <Feather name="info" size={13} color="#94A3B8" style={{ position: 'absolute', top: 0, right: 0 }} />
              </View>

              <View style={{ marginTop: 6 }}>
                <Text style={styles.leagueCardTitle}>Gold League</Text>
                <Text style={styles.leagueCardSubtitle}>Joriy ligangiz</Text>
              </View>
            </TouchableOpacity>

            {/* Right Card: Rank #12 */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.rankCard}
              onPress={() => {
                triggerHaptic();
                navigation.navigate('ClanLeaderboardScreen');
              }}
            >
              {/* Top right rank gain badge */}
              <View style={styles.rankGainBadge}>
                <Ionicons name="triangle" size={7} color="#22C55E" style={{ marginRight: 3 }} />
                <Text style={styles.rankGainText}>+3</Text>
              </View>

              <View style={styles.rankCardContent}>
                <Feather name="bar-chart-2" size={26} color="#C084FC" style={{ marginRight: 10 }} />
                <View>
                  <Text style={styles.rankNumberText}>#12</Text>
                  <Text style={styles.rankLabelText}>Umumiy reyting</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* 5. CARD 3: NEXINGI MAQSAD (PLATINUM LEAGUE PROMOTION) */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.nextTargetCard}
            onPress={() => {
              triggerHaptic();
              navigation.navigate('ClanLeaderboardScreen');
            }}
          >
            <View style={styles.nextTargetLeft}>
              <Text style={styles.nextTargetTitle}>Nexingi maqsad</Text>
              <Text style={styles.nextTargetSubtitle}>Platinum League ga ko'tarilish!</Text>

              {/* Progress bar */}
              <View style={styles.nextTargetBarTrack}>
                <LinearGradient
                  colors={['#A855F7', '#C084FC']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[styles.nextTargetBarFill, { width: '81.6%' }]}
                />
              </View>

              <Text style={styles.nextTargetProgressText}>
                <Text style={{ color: '#FBBF24', fontFamily: 'Inter_700Bold' }}>24,500</Text> / 30,000 XP
              </Text>
            </View>

            {/* Platinum League Shield Illustration */}
            <View style={styles.nextTargetRight}>
              {renderPlatinumLeagueShield()}
              <View style={styles.chevronCircle}>
                <Feather name="chevron-right" size={16} color="#FFFFFF" />
              </View>
            </View>
          </TouchableOpacity>

          {/* 6. CARD 4: MAVSUM STATISTIKASI (4 COLUMNS) */}
          <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <MaterialCommunityIcons name="chart-box-outline" size={18} color="#C084FC" style={{ marginRight: 8 }} />
              <Text style={styles.statsTitle}>Mavsum statistikasi</Text>
            </View>

            <View style={styles.statsGridRow}>
              {/* Stat 1: Faol a'zolar */}
              <View style={styles.statCol}>
                <Feather name="users" size={18} color="#C084FC" style={{ marginBottom: 6 }} />
                <Text style={styles.statNumber}>10</Text>
                <Text style={styles.statLabel}>Faol a'zolar</Text>
              </View>

              {/* Stat 2: Bajarilgan vazifalar */}
              <View style={styles.statCol}>
                <MaterialCommunityIcons name="target" size={19} color="#C084FC" style={{ marginBottom: 6 }} />
                <Text style={styles.statNumber}>48</Text>
                <Text style={styles.statLabel}>Bajarilgan vazifalar</Text>
              </View>

              {/* Stat 3: Joriy streak */}
              <View style={styles.statCol}>
                <Ionicons name="flash" size={18} color="#FBBF24" style={{ marginBottom: 6 }} />
                <Text style={styles.statNumber}>7 kun</Text>
                <Text style={styles.statLabel}>Joriy streak</Text>
              </View>

              {/* Stat 4: Faollik darajasi */}
              <View style={styles.statCol}>
                <FontAwesome5 name="trophy" size={16} color="#FBBF24" style={{ marginBottom: 6 }} />
                <Text style={styles.statNumber}>85%</Text>
                <Text style={styles.statLabel}>Faollik darajasi</Text>
              </View>
            </View>
          </View>

          {/* 7. CARD 5: TEZKOR O'TISH (3 ACTION CARDS) */}
          <View style={styles.quickNavSection}>
            <View style={styles.quickNavHeader}>
              <Ionicons name="flash" size={16} color="#FBBF24" style={{ marginRight: 6 }} />
              <Text style={styles.quickNavTitle}>Tezkor o'tish</Text>
            </View>

            <View style={styles.quickNavRow}>
              {/* Action 1: League Ranking */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.quickNavCard}
                onPress={() => {
                  triggerHaptic();
                  navigation.navigate('ClanLeaderboardScreen');
                }}
              >
                <View style={styles.quickNavIconWrap}>
                  <FontAwesome5 name="crown" size={16} color="#FBBF24" />
                </View>
                <Text style={styles.quickNavCardTitle}>{t.leagueRanking || 'Liga reytingi'}</Text>
                <Text style={styles.quickNavCardSub}>Reyting va ligalar</Text>
                <Feather name="chevron-right" size={14} color="#94A3B8" style={styles.quickNavChevron} />
              </TouchableOpacity>

              {/* Action 2: Season Rewards */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.quickNavCard}
                onPress={() => {
                  triggerHaptic();
                  navigation.navigate('ClanSeasonRewardsScreen');
                }}
              >
                <View style={styles.quickNavIconWrap}>
                  <Feather name="gift" size={16} color="#C084FC" />
                </View>
                <Text style={styles.quickNavCardTitle}>{t.seasonRewardsTitle || 'Mavsum mukofotlari'}</Text>
                <Text style={styles.quickNavCardSub}>Mavsum mukofotlari</Text>
                <Feather name="chevron-right" size={14} color="#94A3B8" style={styles.quickNavChevron} />
              </TouchableOpacity>

              {/* Action 3: Tournament */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.quickNavCard}
                onPress={() => {
                  triggerHaptic();
                  navigation.navigate('ClanTournamentScreen');
                }}
              >
                <View style={styles.quickNavIconWrap}>
                  <MaterialCommunityIcons name="sword-cross" size={18} color="#C084FC" />
                </View>
                <Text style={styles.quickNavCardTitle}>{t.tournamentTitle || 'Turnir'}</Text>
                <Text style={styles.quickNavCardSub}>Mavsum turniri</Text>
                <Feather name="chevron-right" size={14} color="#94A3B8" style={styles.quickNavChevron} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* 9. INFO MODAL */}
        <Modal
          visible={infoModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setInfoModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalTitle}>Mavsum va Ligalar</Text>
                <TouchableOpacity onPress={() => setInfoModalVisible(false)} style={styles.modalCloseBtn}>
                  <Feather name="x" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 320 }}>
                <Text style={styles.modalBodyText}>
                  🏆 <Text style={styles.modalBoldText}>Season 5 haqida:</Text>
                  {'\n'}Har bir mavsum 30 kun davom etadi. Bu davrda clanning barcha a'zolari to'plagan XP umumiy hisobga qo'shiladi.
                  {'\n\n'}
                  🛡 <Text style={styles.modalBoldText}>Ligalar tizimi:</Text>
                  {'\n'}• Bronze: 0 - 10,000 XP
                  {'\n'}• Silver: 10,000 - 20,000 XP
                  {'\n'}• Gold: 20,000 - 30,000 XP (Hozirgi liga)
                  {'\n'}• Platinum: 30,000 - 50,000 XP
                  {'\n'}• Diamond / Master: 50,000+ XP
                  {'\n\n'}
                  🎁 <Text style={styles.modalBoldText}>Mavsum yakuni:</Text>
                  {'\n'}Mavsum oxirida yuqori ligaga ko'tarilgan clanlarga maxsus belgilar, kuboklar va katta tanga bonuslari beriladi!
                </Text>
              </ScrollView>

              <TouchableOpacity activeOpacity={0.8} style={styles.modalOkBtn} onPress={() => setInfoModalVisible(false)}>
                <Text style={styles.modalOkBtnText}>Tushundim</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* 10. TOURNAMENT MODAL */}
        <Modal
          visible={tournamentModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setTournamentModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalTitle}>Mavsum Turniri ⚔️</Text>
                <TouchableOpacity onPress={() => setTournamentModalVisible(false)} style={styles.modalCloseBtn}>
                  <Feather name="x" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalBodyText}>
                Tez kunlarda Clanlar o'rtasida katta olimpiada va jangovar turnirlar start oladi!
                {'\n\n'}
                • <Text style={styles.modalBoldText}>1 vs 1 Battle:</Text> Clan chempionlari bellashuvi.
                {'\n'}• <Text style={styles.modalBoldText}>Team Relay:</Text> Matematika va mantiqiy masalalar estafetasi.
                {'\n\n'}
                Jamoangiz bilan faollikni oshirib boring va turnirga tayyor turing!
              </Text>

              <TouchableOpacity activeOpacity={0.8} style={styles.modalOkBtn} onPress={() => setTournamentModalVisible(false)}>
                <Text style={styles.modalOkBtnText}>Tayyormiz!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </>
  );
}

export default function ClanSeasonScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const user = route?.params?.user;
  const language = route?.params?.language || user?.language || 'uz';
  const t = getClanTranslations(language);

  const triggerHaptic = (type = 'light') => {
    try {
      if (type === 'medium') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070514" />

      {/* Atmospheric Background Gradient */}
      <LinearGradient
        colors={['#170F38', '#0A081C', '#070814']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.45 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* 1. TOP HEADER */}
        <View style={styles.headerRow}>
          <View style={styles.headerTitleCol}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                triggerHaptic();
                navigation.navigate('ClanTransitionScreen', {
                  type: 'toIqromax',
                  target: 'StudentDashboard',
                  params: { user, language },
                });
              }}
              style={styles.backBreadcrumb}
            >
              <View style={styles.backArrowBadge}>
                <Feather name="chevron-left" size={16} color="#C084FC" />
              </View>
              <Text style={styles.headerSubtitleBadge}>IQROMAX Clan</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Season Overview</Text>
            <Text style={styles.headerSubtitle}>Mavsum haqida umumiy ma'lumot</Text>
          </View>

          <View style={styles.headerRightActions}>
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.iconCircleButton}
              onPress={() => {
                triggerHaptic();
                navigation.navigate('ClanNotificationsScreen', { user, language });
              }}
            >
              <Feather name="bell" size={19} color="#FFFFFF" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* REUSABLE SEASON TAB CONTENT */}
        <SeasonTabContent navigation={navigation} user={user} language={language} />

        {/* 8. BOTTOM NAVIGATION BAR */}
        <View style={[styles.bottomNavBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          {/* Tab 1: Home */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              triggerHaptic();
              navigation.replace('ClanHomeScreen', { initialTab: 'Home', user, language });
            }}
            style={styles.navTabItem}
          >
            <View style={styles.inactiveTabCol}>
              <Ionicons name="home-outline" size={21} color="#94A3B8" />
              <Text style={styles.inactiveTabLabel}>{t.tabHome}</Text>
            </View>
          </TouchableOpacity>

          {/* Tab 2: Missions */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              triggerHaptic();
              navigation.replace('ClanHomeScreen', { initialTab: 'Missions', user, language });
            }}
            style={styles.navTabItem}
          >
            <View style={styles.inactiveTabCol}>
              <MaterialCommunityIcons name="target" size={22} color="#94A3B8" />
              <Text style={styles.inactiveTabLabel}>{t.tabMissions}</Text>
            </View>
          </TouchableOpacity>

          {/* Tab 3: Season (ACTIVE) */}
          <TouchableOpacity activeOpacity={0.8} style={styles.navTabItem}>
            <LinearGradient
              colors={['rgba(168, 85, 247, 0.35)', 'rgba(99, 102, 241, 0.22)']}
              style={styles.activeTabPill}
            >
              <MaterialCommunityIcons name="trophy" size={20} color="#FFFFFF" />
              <Text style={styles.activeTabLabel}>{t.tabSeason}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Tab 4: Clan */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              triggerHaptic();
              navigation.replace('ClanHomeScreen', { initialTab: 'Clan', user, language });
            }}
            style={styles.navTabItem}
          >
            <View style={styles.inactiveTabCol}>
              <MaterialCommunityIcons name="shield-outline" size={22} color="#94A3B8" />
              <Text style={styles.inactiveTabLabel}>{t.tabClan}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070514',
  },
  safeArea: {
    flex: 1,
  },

  /* 1. Header */
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  headerTitleCol: {
    flex: 1,
  },
  backBreadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  backArrowBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(192, 132, 252, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  headerSubtitleBadge: {
    fontSize: 11.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#DDD6FE',
    letterSpacing: 0.2,
  },
  headerTitle: {
    fontSize: 23,
    fontFamily: 'Inter_800ExtraBold',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    marginTop: 2,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  iconCircleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#C084FC',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
  },

  /* 2. Hero Card */
  heroCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    overflow: 'hidden',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 14,
    position: 'relative',
  },
  heroMountainSvg: {
    position: 'absolute',
    bottom: 45,
    zIndex: 0,
  },
  bannerContainer: {
    position: 'absolute',
    top: 14,
    left: 20,
    zIndex: 2,
  },
  bannerRight: {
    left: undefined,
    right: 20,
  },
  trophyWrapper: {
    width: 140,
    height: 95,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  trophySunburstGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(251, 191, 36, 0.22)',
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
  },
  seasonTitleWrap: {
    alignItems: 'center',
    marginTop: 4,
    zIndex: 2,
  },
  seasonTitleText: {
    fontSize: 25,
    fontFamily: 'Inter_900Black',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  competitionPill: {
    backgroundColor: '#6D28D9',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 3.5,
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.45)',
    marginTop: 4,
  },
  competitionPillText: {
    fontSize: 11.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  heroDatesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: 2,
  },
  heroDateCol: {
    alignItems: 'flex-start',
  },
  heroDateIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  heroDateLabel: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
  },
  heroDateValue: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  heroDateValueYellow: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#FBBF24',
  },

  /* 3. Season XP Card */
  seasonXpCard: {
    backgroundColor: 'rgba(20, 16, 42, 0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    padding: 16,
    marginTop: 12,
  },
  seasonXpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seasonXpHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shieldIconWrap: {
    marginRight: 8,
  },
  seasonXpTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  seasonXpTargetText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  seasonXpBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    marginTop: 10,
  },
  seasonXpBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  seasonXpPercentRow: {
    alignItems: 'flex-end',
    marginTop: 5,
  },
  seasonXpPercentText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },

  /* 4. League & Ranking Side by Side */
  leagueAndRankRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  leagueCard: {
    flex: 1,
    backgroundColor: 'rgba(20, 16, 42, 0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    padding: 14,
  },
  leagueCardTopRow: {
    position: 'relative',
    height: 48,
    justifyContent: 'center',
  },
  leagueCardTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  leagueCardSubtitle: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#A78BFA',
    marginTop: 2,
  },
  rankCard: {
    flex: 1,
    backgroundColor: 'rgba(20, 16, 42, 0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    padding: 14,
    justifyContent: 'space-between',
  },
  rankGainBadge: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.16)',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  rankGainText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#22C55E',
  },
  rankCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  rankNumberText: {
    fontSize: 22,
    fontFamily: 'Inter_900Black',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  rankLabelText: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
  },

  /* 5. Next Target Card */
  nextTargetCard: {
    backgroundColor: 'rgba(20, 16, 42, 0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.28)',
    padding: 16,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nextTargetLeft: {
    flex: 1,
    paddingRight: 10,
  },
  nextTargetTitle: {
    fontSize: 14.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  nextTargetSubtitle: {
    fontSize: 11.5,
    fontFamily: 'Inter_400Regular',
    color: '#CBD5E1',
    marginTop: 2,
  },
  nextTargetBarTrack: {
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    marginTop: 10,
  },
  nextTargetBarFill: {
    height: '100%',
    borderRadius: 3.5,
  },
  nextTargetProgressText: {
    fontSize: 11.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    marginTop: 6,
  },
  nextTargetRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chevronCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* 6. Season Stats Card */
  statsCard: {
    backgroundColor: 'rgba(20, 16, 42, 0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    padding: 16,
    marginTop: 12,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  statsTitle: {
    fontSize: 14.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  statsGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 9.5,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 3,
  },

  /* 7. Quick Navigation */
  quickNavSection: {
    marginTop: 16,
  },
  quickNavHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickNavTitle: {
    fontSize: 14.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  quickNavRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickNavCard: {
    flex: 1,
    backgroundColor: 'rgba(20, 16, 42, 0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    padding: 12,
    position: 'relative',
    minHeight: 100,
    justifyContent: 'space-between',
  },
  quickNavIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  quickNavCardTitle: {
    fontSize: 11.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  quickNavCardSub: {
    fontSize: 9.5,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    marginTop: 2,
  },
  quickNavChevron: {
    position: 'absolute',
    top: 12,
    right: 8,
  },

  /* 8. Bottom Nav Bar */
  bottomNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#090717',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navTabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  activeTabPill: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.4)',
    gap: 2,
  },
  activeTabLabel: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  inactiveTabCol: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  inactiveTabLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
  },

  /* 9. Modals */
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

