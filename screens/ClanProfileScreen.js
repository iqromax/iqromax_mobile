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
  TextInput,
  Share,
  Alert,
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
  Rect,
  G,
} from 'react-native-svg';

const { width } = Dimensions.get('window');

// 10 CLAN MEMBERS MOCK DATA
const CLAN_MEMBERS = [
  { id: '1', name: 'Ali_Pro', role: 'Lider', xp: '185,400 XP', active: true },
  { id: '2', name: 'Sardor', role: 'Ham-lider', xp: '142,300 XP', active: true },
  { id: '3', name: 'Bekzod', role: 'Oqsoqol', xp: '124,100 XP', active: true },
  { id: '4', name: 'Diyor', role: "A'zo", xp: '110,500 XP', active: true },
  { id: '5', name: 'Madina', role: "A'zo", xp: '98,700 XP', active: true },
  { id: '6', name: 'Aziz', role: "A'zo", xp: '86,400 XP', active: true },
  { id: '7', name: 'Umid', role: "A'zo", xp: '75,200 XP', active: true },
  { id: '8', name: 'Nilufar', role: "A'zo", xp: '68,100 XP', active: true },
  { id: '9', name: 'Jasur', role: "A'zo", xp: '54,300 XP', active: false },
  { id: '10', name: 'Zilola', role: "A'zo", xp: '45,800 XP', active: false },
];

export function ClanProfileTabContent({ navigation, user, language }) {
  const insets = useSafeAreaInsets();
  const currentLang = language || user?.language || 'uz';
  const t = getClanTranslations(currentLang);

  // Modals state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [membersModalVisible, setMembersModalVisible] = useState(false);
  const [baseModalVisible, setBaseModalVisible] = useState(false);
  const [shopModalVisible, setShopModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);

  // Clan Editable Info State
  const [clanName, setClanName] = useState('IQROMAX Clan');
  const [clanDesc, setClanDesc] = useState(
    "IQROMAX — bilim, raqobat va rivojlanish uchun birlashgan jamoa. Maqsadimiz — Season'da Top 10 ga kirish! 🚀"
  );
  const [clanRegion, setClanRegion] = useState("O'zbekiston");
  const [clanEntryType, setClanEntryType] = useState('Ochiq');

  const triggerHaptic = (type = 'light') => {
    try {
      if (type === 'medium') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (e) {}
  };

  const handleShareClan = async () => {
    triggerHaptic();
    try {
      await Share.share({
        message: `IQROMAX Clan ga qo'shiling! Biz Season 5 da Gold Leaguedamiz. Clan kodi: #IQROMAX`,
      });
    } catch (e) {}
  };

  // 1. Waving Pennant Flag on Left
  const renderWavingFlag = () => {
    return (
      <View style={styles.heroFlagWrap}>
        <Svg width={60} height={90} viewBox="0 0 60 90">
          <Defs>
            <SvgGradient id="flagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#7E22CE" />
              <Stop offset="60%" stopColor="#581C87" />
              <Stop offset="100%" stopColor="#3B0764" />
            </SvgGradient>
            <SvgGradient id="poleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FEF08A" />
              <Stop offset="50%" stopColor="#F59E0B" />
              <Stop offset="100%" stopColor="#B45309" />
            </SvgGradient>
          </Defs>
          {/* Flagpole */}
          <Rect x="10" y="8" width="3.5" height="80" rx="1.5" fill="url(#poleGrad)" />
          <Circle cx="11.75" cy="8" r="3.5" fill="#FBBF24" />

          {/* Waving Flag Banner */}
          <Path
            d="M 13.5 12 Q 35 8 50 16 Q 38 28 55 36 Q 30 42 13.5 36 Z"
            fill="url(#flagGrad)"
            stroke="#F59E0B"
            strokeWidth="1.2"
          />

          {/* Golden Crown on Flag */}
          <G transform="translate(22, 19) scale(0.6)">
            <Path
              d="M 2 16 L 6 5 L 14 11 L 22 5 L 26 16 Z"
              fill="#FBBF24"
              stroke="#B45309"
              strokeWidth="1"
            />
          </G>
        </Svg>
      </View>
    );
  };

  // 2. Glowing Fantasy Castle on Right
  const renderCastle = () => {
    return (
      <View style={styles.heroCastleWrap}>
        <Svg width={90} height={90} viewBox="0 0 90 90">
          <Defs>
            <SvgGradient id="castleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#6B21A8" />
              <Stop offset="50%" stopColor="#4C1D95" />
              <Stop offset="100%" stopColor="#2E1065" />
            </SvgGradient>
          </Defs>
          {/* Main Wall */}
          <Path
            d="M 15 50 L 75 50 L 75 80 L 15 80 Z"
            fill="url(#castleGrad)"
            stroke="#A855F7"
            strokeWidth="1"
          />
          {/* Central Tower */}
          <Path
            d="M 32 30 L 58 30 L 58 50 L 32 50 Z"
            fill="url(#castleGrad)"
            stroke="#C084FC"
            strokeWidth="1"
          />
          {/* Spire Roof */}
          <Polygon points="45,8 32,30 58,30" fill="#7E22CE" stroke="#FBBF24" strokeWidth="1" />
          <Path d="M 45 8 L 45 2" stroke="#FDE047" strokeWidth="1.5" />
          <Polygon points="45,2 53,5 45,8" fill="#FACC15" />

          {/* Left Tower */}
          <Path d="M 12 40 L 26 40 L 26 70 L 12 70 Z" fill="url(#castleGrad)" stroke="#A855F7" strokeWidth="1" />
          <Polygon points="12,40 12,34 16,34 16,37 22,37 22,34 26,34 26,40" fill="#7E22CE" />

          {/* Right Tower */}
          <Path d="M 64 40 L 78 40 L 78 70 L 64 70 Z" fill="url(#castleGrad)" stroke="#A855F7" strokeWidth="1" />
          <Polygon points="64,40 64,34 68,34 68,37 74,37 74,34 78,34 78,40" fill="#7E22CE" />

          {/* Glowing Windows */}
          <Rect x="42" y="38" width="6" height="9" rx="3" fill="#FDE047" />
          <Rect x="17" y="52" width="4" height="6" rx="2" fill="#FDE047" />
          <Rect x="69" y="52" width="4" height="6" rx="2" fill="#FDE047" />

          {/* Gate */}
          <Path d="M 38 80 L 38 65 Q 45 58 52 65 L 52 80 Z" fill="#1E103A" stroke="#FBBF24" strokeWidth="1" />
        </Svg>
      </View>
    );
  };

  // 3. Center Golden Shield with White Wolf
  const renderWolfShield = () => {
    return (
      <View style={styles.wolfShieldContainer}>
        {/* Ambient Halo */}
        <View style={styles.wolfShieldGlow} />

        <Svg width={120} height={110} viewBox="0 0 120 110">
          <Defs>
            <SvgGradient id="shieldGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FEF08A" />
              <Stop offset="40%" stopColor="#F59E0B" />
              <Stop offset="80%" stopColor="#D97706" />
              <Stop offset="100%" stopColor="#78350F" />
            </SvgGradient>

            <SvgGradient id="shieldInnerPurple" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#4C1D95" />
              <Stop offset="60%" stopColor="#2E1065" />
              <Stop offset="100%" stopColor="#0F0826" />
            </SvgGradient>

            <SvgGradient id="laurelG" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FEF08A" />
              <Stop offset="70%" stopColor="#FBBF24" />
              <Stop offset="100%" stopColor="#D97706" />
            </SvgGradient>
          </Defs>

          {/* Left Laurel Branch */}
          <Path d="M 32 80 Q 12 55 20 25" stroke="url(#laurelG)" strokeWidth="2.5" fill="none" />
          <Path d="M 28 70 Q 14 65 18 56 Q 25 60 28 70 Z" fill="url(#laurelG)" />
          <Path d="M 22 55 Q 8 48 14 40 Q 20 44 22 55 Z" fill="url(#laurelG)" />
          <Path d="M 18 40 Q 6 32 14 24 Q 18 30 18 40 Z" fill="url(#laurelG)" />

          {/* Right Laurel Branch */}
          <Path d="M 88 80 Q 108 55 100 25" stroke="url(#laurelG)" strokeWidth="2.5" fill="none" />
          <Path d="M 92 70 Q 106 65 102 56 Q 95 60 92 70 Z" fill="url(#laurelG)" />
          <Path d="M 98 55 Q 112 48 106 40 Q 100 44 98 55 Z" fill="url(#laurelG)" />
          <Path d="M 102 40 Q 114 32 106 24 Q 102 30 102 40 Z" fill="url(#laurelG)" />

          {/* Outer Gold Shield */}
          <Path
            d="M 28 18 L 92 18 Q 92 68 60 94 Q 28 68 28 18 Z"
            fill="url(#shieldGoldGrad)"
            stroke="#FEF08A"
            strokeWidth="2.5"
          />

          {/* Inner Purple Plate */}
          <Path
            d="M 35 24 L 85 24 Q 85 64 60 86 Q 35 64 35 24 Z"
            fill="url(#shieldInnerPurple)"
            stroke="#FEF08A"
            strokeWidth="1"
          />

          {/* Top Apex Crown */}
          <G transform="translate(50, 8) scale(0.7)">
            <Path
              d="M 2 16 L 6 4 L 14 10 L 22 4 L 26 16 Z"
              fill="#FEF08A"
              stroke="#D97706"
              strokeWidth="1"
            />
          </G>

          {/* Majestic White Wolf Head */}
          <G transform="translate(42, 28) scale(0.9)">
            {/* Wolf Muzzle & Profile */}
            <Path
              d="M 18 10 L 14 18 L 8 22 L 2 24 L 6 28 L 12 28 L 16 34 L 20 40 L 26 44 L 28 36 L 34 32 L 32 24 L 28 18 L 26 10 Z"
              fill="#FFFFFF"
            />
            {/* Fur Tuft shadows */}
            <Path d="M 20 20 L 24 24 L 20 28 L 26 30 L 22 36 L 28 34" stroke="#CBD5E1" strokeWidth="1.5" fill="none" />
            {/* Wolf Ear */}
            <Polygon points="22,6 26,14 18,12" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
            <Polygon points="21,8 24,13 19,12" fill="#C084FC" opacity={0.6} />
            {/* Wolf Eye */}
            <Polygon points="14,20 18,22 14,23" fill="#6B21A8" />
            {/* Nose */}
            <Polygon points="2,24 5,23 4,26" fill="#1E1B4B" />
          </G>
        </Svg>
      </View>
    );
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 110 }]}
      >
        {/* 2. TOP HERO SECTION */}
        <View style={styles.heroSection}>
          {/* Background Mountains */}
          <View style={styles.heroMountainBackdrop}>
            <Svg width={width - 24} height={130} viewBox="0 0 350 130">
              <Defs>
                <SvgGradient id="pMountG" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#581C87" stopOpacity={0.6} />
                  <Stop offset="100%" stopColor="#0B091A" stopOpacity={0.1} />
                </SvgGradient>
              </Defs>
              <Path d="M 0 100 L 45 40 L 95 85 L 150 30 L 210 75 L 265 35 L 320 85 L 350 50 L 350 130 L 0 130 Z" fill="url(#pMountG)" />
            </Svg>
          </View>

          {/* Left Flag & Right Castle */}
          {renderWavingFlag()}
          {renderCastle()}

          {/* Center Wolf Shield */}
          {renderWolfShield()}

          {/* Clan Name & Edit Icon */}
          <View style={styles.clanNameRow}>
            <Text style={styles.clanNameTitle}>{clanName}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.pencilCircleBtn}
              onPress={() => {
                triggerHaptic();
                setEditModalVisible(true);
              }}
            >
              <Feather name="edit-2" size={13} color="#C084FC" />
            </TouchableOpacity>
          </View>

          {/* Badges Row (Lv.12 | Gold League) */}
          <View style={styles.heroBadgesRow}>
            <View style={styles.levelBadgePill}>
              <Text style={styles.levelBadgeText}>Lv.12</Text>
            </View>

            <View style={styles.leagueBadgePill}>
              <FontAwesome5 name="shield-alt" size={12} color="#FBBF24" style={{ marginRight: 5 }} />
              <Text style={styles.leagueBadgeText}>Gold League</Text>
            </View>
          </View>
        </View>

        {/* 3. CLAN DESCRIPTION & INFO CARD */}
        <View style={styles.descCard}>
          {/* Description Quote */}
          <View style={styles.descQuoteRow}>
            <View style={styles.descAccentBar} />
            <Text style={styles.descText}>{clanDesc}</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.descEditButton}
              onPress={() => {
                triggerHaptic();
                setEditModalVisible(true);
              }}
            >
              <Feather name="edit-2" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.descEditText}>{t.editClan}</Text>
            </TouchableOpacity>
          </View>

          {/* 4 Info Columns */}
          <View style={styles.infoColsRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.infoCol}
              onPress={() => {
                triggerHaptic();
                navigation.navigate('ClanMembersScreen', { user, language: currentLang });
              }}
            >
              <Ionicons name="people-outline" size={18} color="#C084FC" />
              <Text style={styles.infoColLabel}>{t.members}</Text>
              <Text style={styles.infoColValue}>10 / 10</Text>
            </TouchableOpacity>

            <View style={styles.infoCol}>
              <Ionicons name="calendar-outline" size={18} color="#C084FC" />
              <Text style={styles.infoColLabel}>{t.createdAt}</Text>
              <Text style={styles.infoColValue}>15 Sen, 2026</Text>
            </View>

            <View style={styles.infoCol}>
              <Ionicons name="location-outline" size={18} color="#C084FC" />
              <Text style={styles.infoColLabel}>{t.region}</Text>
              <Text style={styles.infoColValue}>{clanRegion}</Text>
            </View>

            <View style={styles.infoCol}>
              <Feather name="lock" size={16} color="#C084FC" />
              <Text style={styles.infoColLabel}>{t.entryType}</Text>
              <Text style={styles.infoColValueGreen}>{clanEntryType}</Text>
            </View>
          </View>
        </View>

        {/* 4. CLAN XP CARD */}
        <View style={styles.xpCard}>
          <View style={styles.xpCardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Svg width={22} height={22} viewBox="0 0 36 36">
                <Defs>
                  <SvgGradient id="pXpG" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#C084FC" />
                    <Stop offset="100%" stopColor="#7E22CE" />
                  </SvgGradient>
                </Defs>
                <Path d="M 6 6 L 30 6 Q 30 23 18 32 Q 6 23 6 6 Z" fill="url(#pXpG)" stroke="#E9D5FF" strokeWidth="1.2" />
                <Polygon points="18,11 20,16 25,16 21,19 22.5,24 18,21 13.5,24 15,19 11,16 16,16" fill="#FFFFFF" />
              </Svg>
              <Text style={styles.xpCardTitle}>Clan XP</Text>
            </View>

            <Text style={styles.xpCardRatio}>
              248,500 <Text style={styles.xpCardRatioMuted}>/ 300,000 XP</Text>
            </Text>
          </View>

          <View style={styles.xpProgressRow}>
            <Text style={styles.xpLevelLeft}>Lv.12</Text>
            <View style={styles.xpTrack}>
              <LinearGradient
                colors={['#8B5CF6', '#C084FC', '#F472B6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.xpFill, { width: '83%' }]}
              />
            </View>
            <Text style={styles.xpLevelRight}>Lv.13</Text>
          </View>
        </View>

        {/* 5. CLAN STATISTIKASI (SEASON 5) */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="chart-box-outline" size={18} color="#C084FC" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>{t.clanStats}</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.seasonDropdownPill}
              onPress={() => triggerHaptic()}
            >
              <Text style={styles.seasonDropdownText}>Season 5</Text>
              <Feather name="chevron-down" size={13} color="#E9D5FF" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>

          <View style={styles.statCardsRow}>
            {/* Stat 1: Liga reytingi */}
            <View style={styles.statCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <FontAwesome5 name="trophy" size={16} color="#FBBF24" style={{ marginRight: 4 }} />
                <View style={styles.rankGainPill}>
                  <Ionicons name="triangle" size={6} color="#34D399" style={{ marginRight: 2 }} />
                  <Text style={styles.rankGainText}>+3</Text>
                </View>
              </View>
              <Text style={styles.statValueText}>#12</Text>
              <Text style={styles.statLabelText}>{t.rank}</Text>
            </View>

            {/* Stat 2: Clan Streak */}
            <View style={styles.statCard}>
              <Ionicons name="flash" size={18} color="#FBBF24" style={{ marginBottom: 4 }} />
              <Text style={styles.statValueText}>21 {t.streakDays}</Text>
              <Text style={styles.statLabelText}>{t.clanStreak}</Text>
            </View>

            {/* Stat 3: Battle g'alaba */}
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="sword-cross" size={18} color="#C084FC" style={{ marginBottom: 4 }} />
              <Text style={styles.statValueText}>48</Text>
              <Text style={styles.statLabelText}>{t.battleWins}</Text>
            </View>

            {/* Stat 4: Mission faolligi */}
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="target" size={18} color="#E879F9" style={{ marginBottom: 4 }} />
              <Text style={styles.statValueText}>85%</Text>
              <Text style={styles.statLabelText}>{t.missionActivity}</Text>
            </View>
          </View>
        </View>

        {/* 6. CLAN FAOLIYATI (SEASON 5) */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome5 name="crown" size={14} color="#C084FC" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>{t.clanActivitySeason}</Text>
            </View>
          </View>

          <View style={styles.statCardsRow}>
            {/* Act 1: Jami XP */}
            <View style={styles.statCard}>
              <View style={styles.activityXpPill}>
                <Text style={styles.activityXpPillText}>XP</Text>
              </View>
              <Text style={styles.actValueTextSmall}>1,240,500 XP</Text>
              <Text style={styles.statLabelText}>{t.totalXp}</Text>
            </View>

            {/* Act 2: Bajarilgan vazifalar */}
            <View style={styles.statCard}>
              <Ionicons name="shield-checkmark" size={18} color="#34D399" style={{ marginBottom: 4 }} />
              <Text style={styles.statValueText}>128</Text>
              <Text style={styles.statLabelText}>{t.completedTasks}</Text>
            </View>

            {/* Act 3: G'alaba (Battle) */}
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="sword-cross" size={18} color="#C084FC" style={{ marginBottom: 4 }} />
              <Text style={styles.statValueText}>36</Text>
              <Text style={styles.statLabelText}>{t.battleVictories}</Text>
            </View>

            {/* Act 4: Turnirlar */}
            <View style={styles.statCard}>
              <FontAwesome5 name="trophy" size={16} color="#FBBF24" style={{ marginBottom: 4 }} />
              <Text style={styles.statValueText}>8</Text>
              <Text style={styles.statLabelText}>{t.tournaments}</Text>
            </View>
          </View>
        </View>

        {/* 7. TEZKOR BO'LIMLAR (2x2 GRID) */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="flash" size={16} color="#FBBF24" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>{t.quickSections}</Text>
            </View>
          </View>

          <View style={styles.quickGrid}>
            {/* Card 1: A'zolar */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.quickGridCard}
              onPress={() => {
                triggerHaptic();
                navigation.navigate('ClanMembersScreen', { user, language: currentLang });
              }}
            >
              <View style={styles.quickGridIconWrap}>
                <Ionicons name="people-outline" size={22} color="#C084FC" />
              </View>
              <View style={styles.quickGridMeta}>
                <Text style={styles.quickGridTitle}>{t.members}</Text>
                <Text style={styles.quickGridSub}>{t.clanMembersDesc}</Text>
              </View>
              <Feather name="chevron-right" size={16} color="#94A3B8" />
            </TouchableOpacity>

            {/* Card 2: Clan Base */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.quickGridCard}
              onPress={() => {
                triggerHaptic();
                navigation.navigate('ClanBaseScreen', { user, language: currentLang });
              }}
            >
              <View style={styles.quickGridIconWrap}>
                <FontAwesome5 name="fort-awesome" size={20} color="#C084FC" />
              </View>
              <View style={styles.quickGridMeta}>
                <Text style={styles.quickGridTitle}>{t.clanBase}</Text>
                <Text style={styles.quickGridSub}>Lvl. 5</Text>
              </View>
              <Feather name="chevron-right" size={16} color="#94A3B8" />
            </TouchableOpacity>

            {/* Card 3: Clan Shop */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.quickGridCard}
              onPress={() => {
                triggerHaptic();
                navigation.navigate('ClanShopScreen', { user, language: currentLang });
              }}
            >
              <View style={styles.quickGridIconWrap}>
                <MaterialCommunityIcons name="storefront-outline" size={22} color="#C084FC" />
              </View>
              <View style={styles.quickGridMeta}>
                <Text style={styles.quickGridTitle}>{t.clanShop}</Text>
                <Text style={styles.quickGridSub}>{t.clanShopDesc}</Text>
              </View>
              <Feather name="chevron-right" size={16} color="#94A3B8" />
            </TouchableOpacity>

            {/* Card 4: Sozlamalar */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.quickGridCard}
              onPress={() => {
                triggerHaptic();
                navigation.navigate('ClanSettingsScreen', { user, language: currentLang });
              }}
            >
              <View style={styles.quickGridIconWrap}>
                <Ionicons name="settings-outline" size={22} color="#C084FC" />
              </View>
              <View style={styles.quickGridMeta}>
                <Text style={styles.quickGridTitle}>{t.clanSettings}</Text>
                <Text style={styles.quickGridSub}>{t.clanSettingsDesc}</Text>
              </View>
              <Feather name="chevron-right" size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>
            >
              <View style={styles.quickGridIconWrap}>
                <Ionicons name="people-outline" size={22} color="#C084FC" />
              </View>
              <View style={styles.quickGridMeta}>
                <Text style={styles.quickGridTitle}>A'zolar</Text>
                <Text style={styles.quickGridSub}>Clan a'zolari ro'yxati</Text>
              </View>
              <Feather name="chevron-right" size={16} color="#94A3B8" />
            </TouchableOpacity>

            {/* Card 2: Clan Base */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.quickGridCard}
              onPress={() => {
                triggerHaptic();
                navigation.navigate('ClanBaseScreen');
              }}
            >
              <View style={styles.quickGridIconWrap}>
                <FontAwesome5 name="fort-awesome" size={20} color="#C084FC" />
              </View>
              <View style={styles.quickGridMeta}>
                <Text style={styles.quickGridTitle}>Clan Base</Text>
                <Text style={styles.quickGridSub}>Lvl. 5</Text>
              </View>
              <Feather name="chevron-right" size={16} color="#94A3B8" />
            </TouchableOpacity>

            {/* Card 3: Clan Shop */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.quickGridCard}
              onPress={() => {
                triggerHaptic();
                navigation.navigate('ClanShopScreen');
              }}
            >
              <View style={styles.quickGridIconWrap}>
                <MaterialCommunityIcons name="storefront-outline" size={22} color="#C084FC" />
              </View>
              <View style={styles.quickGridMeta}>
                <Text style={styles.quickGridTitle}>Clan Shop</Text>
                <Text style={styles.quickGridSub}>Maxsus buyumlar</Text>
              </View>
              <Feather name="chevron-right" size={16} color="#94A3B8" />
            </TouchableOpacity>

            {/* Card 4: Sozlamalar */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.quickGridCard}
              onPress={() => {
                triggerHaptic();
                navigation.navigate('ClanSettingsScreen');
              }}
            >
              <View style={styles.quickGridIconWrap}>
                <Ionicons name="settings-outline" size={22} color="#C084FC" />
              </View>
              <View style={styles.quickGridMeta}>
                <Text style={styles.quickGridTitle}>Sozlamalar</Text>
                <Text style={styles.quickGridSub}>Clan boshqaruvi</Text>
              </View>
              <Feather name="chevron-right" size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* EDIT CLAN MODAL */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Clan ma'lumotlarini tahrirlash</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Feather name="x" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalInputLabel}>Clan nomi:</Text>
            <TextInput
              value={clanName}
              onChangeText={setClanName}
              style={styles.modalTextInput}
              placeholderTextColor="#64748B"
            />

            <Text style={styles.modalInputLabel}>Tavsif va maqsad:</Text>
            <TextInput
              value={clanDesc}
              onChangeText={setClanDesc}
              style={[styles.modalTextInput, { height: 75, textAlignVertical: 'top' }]}
              multiline
              placeholderTextColor="#64748B"
            />

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modalPrimaryBtn}
              onPress={() => {
                triggerHaptic();
                setEditModalVisible(false);
              }}
            >
              <Text style={styles.modalPrimaryBtnText}>Saqlash</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CLAN MEMBERS MODAL */}
      <Modal
        visible={membersModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMembersModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Clan a'zolari (10/10)</Text>
              <TouchableOpacity onPress={() => setMembersModalVisible(false)}>
                <Feather name="x" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 320 }}>
              {CLAN_MEMBERS.map((m) => (
                <View key={m.id} style={styles.memberListItem}>
                  <View style={styles.memberAvatarCircle}>
                    <Text style={styles.memberAvatarInitial}>{m.name[0]}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.memberNameText}>{m.name}</Text>
                    <Text style={styles.memberRoleText}>{m.role}</Text>
                  </View>
                  <Text style={styles.memberXpText}>{m.xp}</Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modalPrimaryBtn}
              onPress={() => setMembersModalVisible(false)}
            >
              <Text style={styles.modalPrimaryBtnText}>Yopish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* BASE / SHOP / SETTINGS MODALS */}
      <Modal
        visible={baseModalVisible || shopModalVisible || settingsModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setBaseModalVisible(false);
          setShopModalVisible(false);
          setSettingsModalVisible(false);
        }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {baseModalVisible ? '🏰 Clan Base (Lvl. 5)' : shopModalVisible ? '🏪 Clan Shop' : '⚙️ Clan Sozlamalari'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setBaseModalVisible(false);
                  setShopModalVisible(false);
                  setSettingsModalVisible(false);
                }}
              >
                <Feather name="x" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalGenericDesc}>
              {baseModalVisible
                ? "Clan bazangiz 5-darajada. Baza har kuni barcha a'zolarga +15% XP va tanga kuchaytirgich beradi."
                : shopModalVisible
                ? "Clan do'koni orqali to'plangan clan ballariga eksklyuziv ramkalar, bayroqlar va cheksiz energiya xarid qilish mumkin."
                : "Klan sozlamalari: klan ochiqligi, kirish talabi (daraja chegarasi), avtomatik qabul qilish va boshqaruv vakolatlari."}
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modalPrimaryBtn}
              onPress={() => {
                setBaseModalVisible(false);
                setShopModalVisible(false);
                setSettingsModalVisible(false);
              }}
            >
              <Text style={styles.modalPrimaryBtnText}>Tushundim</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

export default function ClanProfileScreen({ navigation, route }) {
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

  const handleShareClan = async () => {
    triggerHaptic();
    try {
      await Share.share({
        message: `IQROMAX Clan ga qo'shiling! Biz Season 5 da Gold Leaguedamiz. Clan kodi: #IQROMAX`,
      });
    } catch (e) {}
  };

  return (
    <View style={styles.screenRoot}>
      <StatusBar barStyle="light-content" backgroundColor="#070814" />

      {/* Screen Background Gradient */}
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
              navigation.replace('ClanHomeScreen', { initialTab: 'Home', user, language });
            }}
          >
            <Feather name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitleText}>{t.clanProfileTitle}</Text>
            <Text style={styles.headerSubtitleText}>{t.clanProfileSubtitle}</Text>
          </View>

          <View style={styles.headerRightButtonsRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.headerIconButton}
              onPress={handleShareClan}
            >
              <Feather name="share-2" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.headerIconButton, { marginLeft: 8 }]}
              onPress={() => {
                triggerHaptic();
                Alert.alert(
                  'IQROMAX Clan',
                  'Clan ID: #IQROMAX_777\nYaratilgan sana: 15.09.2026\nHolat: Faol',
                  [{ text: 'Yopish', style: 'cancel' }]
                );
              }}
            >
              <Feather name="more-vertical" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* CLAN PROFILE CONTENT */}
        <ClanProfileTabContent navigation={navigation} user={user} language={language} />

        {/* BOTTOM NAVIGATION BAR */}
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

          {/* Tab 3: Season */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              triggerHaptic();
              navigation.replace('ClanHomeScreen', { initialTab: 'Season', user, language });
            }}
            style={styles.navTabItem}
          >
            <View style={styles.inactiveTabCol}>
              <MaterialCommunityIcons name="trophy-outline" size={22} color="#94A3B8" />
              <Text style={styles.inactiveTabLabel}>{t.tabSeason}</Text>
            </View>
          </TouchableOpacity>

          {/* Tab 4: Clan (ACTIVE - VERTICAL GRADIENT PILL) */}
          <TouchableOpacity activeOpacity={0.8} style={styles.navTabItem}>
            <LinearGradient
              colors={['rgba(168, 85, 247, 0.35)', 'rgba(99, 102, 241, 0.22)']}
              style={styles.activeTabPill}
            >
              <MaterialCommunityIcons name="shield-outline" size={20} color="#FFFFFF" />
              <Text style={styles.activeTabLabel}>{t.tabClan}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
  headerRightButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // SCROLL CONTENT
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },

  // 2. HERO SECTION
  heroSection: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 14,
    marginBottom: 10,
  },
  heroMountainBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.6,
  },
  heroFlagWrap: {
    position: 'absolute',
    left: 6,
    top: 6,
    zIndex: 1,
  },
  heroCastleWrap: {
    position: 'absolute',
    right: 4,
    top: 6,
    zIndex: 1,
  },
  wolfShieldContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 110,
    marginTop: 2,
  },
  wolfShieldGlow: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
  },
  clanNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  clanNameTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  pencilCircleBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(192, 132, 252, 0.15)',
    borderWidth: 1,
    borderColor: '#C084FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  heroBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  levelBadgePill: {
    backgroundColor: 'rgba(126, 34, 206, 0.35)',
    borderWidth: 1,
    borderColor: '#A855F7',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginRight: 8,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E9D5FF',
  },
  leagueBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  leagueBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FDE047',
  },

  // 3. CLAN DESCRIPTION CARD
  descCard: {
    backgroundColor: 'rgba(20, 15, 42, 0.85)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.22)',
    padding: 14,
    marginBottom: 12,
  },
  descQuoteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  descAccentBar: {
    width: 3.5,
    height: '100%',
    minHeight: 38,
    backgroundColor: '#A855F7',
    borderRadius: 2,
    marginRight: 10,
  },
  descText: {
    flex: 1,
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
    marginRight: 8,
  },
  descEditButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(126, 34, 206, 0.35)',
    borderWidth: 1,
    borderColor: '#A855F7',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  descEditText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoColsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 12,
  },
  infoCol: {
    flex: 1,
    alignItems: 'center',
  },
  infoColLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  infoColValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
    textAlign: 'center',
  },
  infoColValueGreen: {
    fontSize: 12,
    fontWeight: '800',
    color: '#34D399',
    marginTop: 2,
    textAlign: 'center',
  },

  // 4. CLAN XP CARD
  xpCard: {
    backgroundColor: 'rgba(20, 15, 38, 0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.22)',
    padding: 14,
    marginBottom: 12,
  },
  xpCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  xpProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  xpLevelLeft: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FDE047',
    marginRight: 8,
  },
  xpTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    borderRadius: 4,
  },
  xpLevelRight: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    marginLeft: 8,
  },

  // 5 & 6. SECTION BLOCKS
  sectionBlock: {
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  seasonDropdownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(126, 34, 206, 0.35)',
    borderWidth: 1,
    borderColor: '#A855F7',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  seasonDropdownText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E9D5FF',
  },
  statCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(20, 15, 38, 0.85)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    marginHorizontal: 2.5,
  },
  statValueText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  actValueTextSmall: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 2,
    textAlign: 'center',
  },
  statLabelText: {
    fontSize: 9,
    color: '#94A3B8',
    textAlign: 'center',
  },
  rankGainPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  rankGainText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#34D399',
  },
  activityXpPill: {
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginBottom: 4,
  },
  activityXpPillText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  // 7. TEZKOR BO'LIMLAR (2x2 GRID)
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickGridCard: {
    width: (width - 32 - 8) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 15, 38, 0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.22)',
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  quickGridIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(126, 34, 206, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickGridMeta: {
    flex: 1,
    marginLeft: 8,
  },
  quickGridTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  quickGridSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },

  // 8. BOTTOM NAVIGATION BAR
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.5)',
  },
  activeTabLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  inactiveTabCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveTabLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
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
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalInputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CBD5E1',
    marginBottom: 6,
    marginTop: 8,
  },
  modalTextInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    color: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },
  modalPrimaryBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  modalPrimaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalGenericDesc: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 19,
    marginVertical: 12,
  },

  // Members list in modal
  memberListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  memberAvatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7E22CE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarInitial: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  memberNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  memberRoleText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  memberXpText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FBBF24',
  },
});

