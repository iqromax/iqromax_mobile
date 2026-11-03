import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Feather,
  MaterialCommunityIcons,
  Ionicons,
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function ClanLeaderboardScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [activeScope, setActiveScope] = useState('Global'); // Global | O'zbekiston | Do'stlar
  const [activePeriod, setActivePeriod] = useState('Umumiy'); // Umumiy | Haftalik | Oylik | Season
  const [userClan, setUserClan] = useState(null);

  useEffect(() => {
    const loadClan = async () => {
      try {
        const stored = await AsyncStorage.getItem('@iqromax_user_clan');
        if (stored) {
          setUserClan(JSON.parse(stored));
        }
      } catch (e) {
        console.log('Error loading clan:', e);
      }
    };
    loadClan();
  }, []);

  // Top 3 Podium Clans per period
  const getPodiumData = () => {
    switch (activePeriod) {
      case 'Haftalik':
        return {
          rank1: { name: 'Wolf Legends', level: 24, xp: '28,450 XP', members: '8/10' },
          rank2: { name: 'Math Warriors', level: 22, xp: '24,200 XP', members: '7/10' },
          rank3: { name: 'IQROMAX Elite', level: 21, xp: '21,860 XP', members: '9/10' },
        };
      case 'Oylik':
        return {
          rank1: { name: 'Wolf Legends', level: 24, xp: '64,150 XP', members: '8/10' },
          rank2: { name: 'Math Warriors', level: 22, xp: '58,400 XP', members: '7/10' },
          rank3: { name: 'IQROMAX Elite', level: 21, xp: '52,900 XP', members: '9/10' },
        };
      case 'Season':
        return {
          rank1: { name: 'Wolf Legends', level: 24, xp: '95,450 XP', members: '8/10' },
          rank2: { name: 'Math Warriors', level: 22, xp: '88,100 XP', members: '7/10' },
          rank3: { name: 'IQROMAX Elite', level: 21, xp: '81,200 XP', members: '9/10' },
        };
      case 'Umumiy':
      default:
        return {
          rank1: { name: 'Wolf Legends', level: 24, xp: '128,450 XP', members: '8/10' },
          rank2: { name: 'Math Warriors', level: 22, xp: '118,240 XP', members: '7/10' },
          rank3: { name: 'IQROMAX Elite', level: 21, xp: '110,860 XP', members: '9/10' },
        };
    }
  };

  // Clans list (Ranks 4 - 10)
  const getClansList = () => {
    switch (activePeriod) {
      case 'Haftalik':
        return [
          { rank: 4, name: 'Brain Force', level: 20, xp: '19,100 XP', trend: '+2', trendType: 'up', emblem: require('../assets/clan_emb_brain.png') },
          { rank: 5, name: 'Soroban Masters', level: 19, xp: '18,540 XP', trend: '-1', trendType: 'down', emblem: require('../assets/clan_emb_soroban.png') },
          { rank: 6, name: 'Minim Force', level: 19, xp: '17,320 XP', trend: '+3', trendType: 'up', emblem: require('../assets/clan_emb_minim.png') },
          { rank: 7, name: 'Next Learners', level: 18, xp: '16,760 XP', trend: '—', trendType: 'same', emblem: require('../assets/clan_emb_next.png') },
          { rank: 8, name: 'Sakura Team', level: 18, xp: '15,420 XP', trend: '-2', trendType: 'down', emblem: require('../assets/clan_emb_sakura.png') },
          { rank: 9, name: 'UzEdu Clan', level: 17, xp: '14,900 XP', trend: '+1', trendType: 'up', emblem: require('../assets/clan_emb_uzedu.png') },
          { rank: 10, name: 'Study Masters', level: 17, xp: '13,240 XP', trend: '—', trendType: 'same', emblem: require('../assets/clan_emb_study.png') },
        ];
      case 'Umumiy':
      default:
        return [
          { rank: 4, name: 'Brain Force', level: 20, xp: '92,100 XP', trend: '+2', trendType: 'up', emblem: require('../assets/clan_emb_brain.png') },
          { rank: 5, name: 'Soroban Masters', level: 19, xp: '89,540 XP', trend: '-1', trendType: 'down', emblem: require('../assets/clan_emb_soroban.png') },
          { rank: 6, name: 'Minim Force', level: 19, xp: '86,320 XP', trend: '+3', trendType: 'up', emblem: require('../assets/clan_emb_minim.png') },
          { rank: 7, name: 'Next Learners', level: 18, xp: '83,760 XP', trend: '—', trendType: 'same', emblem: require('../assets/clan_emb_next.png') },
          { rank: 8, name: 'Sakura Team', level: 18, xp: '80,420 XP', trend: '-2', trendType: 'down', emblem: require('../assets/clan_emb_sakura.png') },
          { rank: 9, name: 'UzEdu Clan', level: 17, xp: '78,900 XP', trend: '+1', trendType: 'up', emblem: require('../assets/clan_emb_uzedu.png') },
          { rank: 10, name: 'Study Masters', level: 17, xp: '76,240 XP', trend: '—', trendType: 'same', emblem: require('../assets/clan_emb_study.png') },
        ];
    }
  };

  const podium = getPodiumData();
  const clansList = getClansList();

  const handleClanPress = (clan) => {
    Alert.alert(
      clan.name,
      `Reyting: #${clan.rank || 'Top'}\nDaraja: Lv. ${clan.level}\nUmumiy ball: ${clan.xp}\nHolat: Faol Clan`,
      [{ text: "Yopish", style: "cancel" }]
    );
  };

  return (
    <View style={styles.screenRoot}>
      <StatusBar barStyle="light-content" backgroundColor="#070814" />

      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerTextCol}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.backBreadcrumb}
              onPress={() => navigation.goBack()}
            >
              <View style={styles.backArrowBadge}>
                <Feather name="chevron-left" size={16} color="#C084FC" />
              </View>
              <Text style={styles.headerSubtitleBadge}>IQROMAX Clan</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Season</Text>
            <Text style={styles.headerSubtitle}>Eng kuchli clanlar reytingi</Text>
          </View>
        </View>

        {/* Fixed Top Container (Scope Filter + 3D Podium + Time Period Bar) */}
        <View style={styles.topFixedContainer}>
          {/* 1. SCOPE FILTER PILLS ROW (Global, O'zbekiston, Do'stlar - Viloyat removed) */}
          <View style={styles.scopeFilterRow}>
            {[
              { id: 'Global', label: 'Global' },
              { id: "O'zbekiston", label: "O'zbekiston" },
              { id: "Do'stlar", label: "Do'stlar" },
            ].map((tab) => {
              const isActive = activeScope === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  activeOpacity={0.8}
                  style={[styles.scopeBtn, isActive && styles.scopeBtnActive]}
                  onPress={() => setActiveScope(tab.id)}
                >
                  {isActive ? (
                    <LinearGradient
                      colors={['#8B5CF6', '#7C3AED']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.scopeGradient}
                    >
                      {tab.id === 'Global' && <Feather name="globe" size={13} color="#FFFFFF" style={{ marginRight: 5 }} />}
                      {tab.id === "O'zbekiston" && <MaterialCommunityIcons name="flag-variant" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />}
                      {tab.id === "Do'stlar" && <Ionicons name="people" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />}
                      <Text style={styles.scopeTextActive}>{tab.label}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.scopeInactiveContent}>
                      {tab.id === 'Global' && <Feather name="globe" size={13} color="#94A3B8" style={{ marginRight: 5 }} />}
                      {tab.id === "O'zbekiston" && <MaterialCommunityIcons name="flag-variant" size={14} color="#94A3B8" style={{ marginRight: 4 }} />}
                      {tab.id === "Do'stlar" && <Ionicons name="people-outline" size={13} color="#94A3B8" style={{ marginRight: 4 }} />}
                      <Text style={styles.scopeTextInactive}>{tab.label}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 2. TOP 3 PODIUM SHOWCASE */}
          <View style={styles.podiumContainer}>
            <Image
              source={require('../assets/clan_leaderboard_podium.png')}
              style={styles.podiumImage}
              contentFit="contain"
            />

            {/* Interactive Press Overlays */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.podiumHitRank2}
              onPress={() => handleClanPress({ rank: 2, ...podium.rank2 })}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.podiumHitRank1}
              onPress={() => handleClanPress({ rank: 1, ...podium.rank1 })}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.podiumHitRank3}
              onPress={() => handleClanPress({ rank: 3, ...podium.rank3 })}
            />
          </View>

          {/* 3. TIME FILTER SEGMENT BAR (Umumiy, Haftalik, Oylik, Season) */}
          {/* As the user scrolls the clans list below, rows slide underneath this bar */}
          <View style={styles.periodSegmentRow}>
            {['Umumiy', 'Haftalik', 'Oylik', 'Season'].map((period) => {
              const isActive = activePeriod === period;
              return (
                <TouchableOpacity
                  key={period}
                  activeOpacity={0.8}
                  style={[styles.periodBtn, isActive && styles.periodBtnActive]}
                  onPress={() => setActivePeriod(period)}
                >
                  {isActive ? (
                    <LinearGradient
                      colors={['#8B5CF6', '#7C3AED']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.periodGradient}
                    >
                      <Text style={styles.periodTextActive}>{period}</Text>
                    </LinearGradient>
                  ) : (
                    <Text style={styles.periodTextInactive}>{period}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 4. SCROLLABLE CLANS LIST (RANKS 4 TO 10) */}
        {/* The rows scroll up and slide directly underneath the period segment bar */}
        <ScrollView
          style={styles.clansScrollView}
          contentContainerStyle={[
            styles.clansScrollInner,
            { paddingBottom: Math.max(insets.bottom, 12) + 90 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {clansList.map((clan) => (
            <TouchableOpacity
              key={clan.rank}
              activeOpacity={0.85}
              style={styles.clanRowCard}
              onPress={() => handleClanPress(clan)}
            >
              {/* Rank Number */}
              <Text style={styles.clanRankNumber}>{clan.rank}</Text>

              {/* Shield Emblem */}
              <Image
                source={clan.emblem}
                style={styles.clanEmblem}
                contentFit="contain"
              />

              {/* Clan Info */}
              <View style={styles.clanInfoCol}>
                <Text style={styles.clanName}>{clan.name}</Text>
                <Text style={styles.clanMeta}>
                  Lv. {clan.level} · {clan.xp}
                </Text>
              </View>

              {/* Trend Badge */}
              <View
                style={[
                  styles.trendBadgePill,
                  clan.trendType === 'up' && styles.trendBadgeUp,
                  clan.trendType === 'down' && styles.trendBadgeDown,
                  clan.trendType === 'same' && styles.trendBadgeSame,
                ]}
              >
                <Text
                  style={[
                    styles.trendBadgeText,
                    clan.trendType === 'up' && { color: '#34D399' },
                    clan.trendType === 'down' && { color: '#F87171' },
                    clan.trendType === 'same' && { color: '#94A3B8' },
                  ]}
                >
                  {clan.trendType === 'up' && '↑ '}
                  {clan.trendType === 'down' && '↓ '}
                  {clan.trend}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 5. USER'S CLAN FLOATING BOTTOM BAR (#14 IQROMAX Clan) */}
        {/* Solid, non-transparent background so scrolling list is hidden behind it */}
        <View style={[styles.bottomStickyWrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.userClanStickyCard}
            onPress={() => Alert.alert("Sizning Claningiz", `Clan: ${userClan?.name || 'IQROMAX Clan'}\nReyting: #14\nDaraja: Lv. 12\nXP: 64,320 XP`)}
          >
            {/* 100% Solid opaque background gradient */}
            <LinearGradient
              colors={['#241552', '#140D30']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />

            {/* Rank Number */}
            <Text style={styles.userClanRankText}>#14</Text>

            {/* Emblem */}
            <Image
              source={require('../assets/clan_emb_user.png')}
              style={styles.userClanEmblem}
              contentFit="contain"
            />

            {/* Clan Meta */}
            <View style={styles.userClanInfoCol}>
              <Text style={styles.userClanTitle} numberOfLines={1}>
                {userClan?.name ? `${userClan.name} (Siz)` : 'IQROMAX Clan (Siz)'}
              </Text>
              <Text style={styles.userClanSubtitle}>
                Lv. {userClan?.level || 12} · 64,320 XP
              </Text>
            </View>

            {/* Trend Badge */}
            <View style={[styles.trendBadgePill, styles.trendBadgeUp, { paddingHorizontal: 9 }]}>
              <Text style={[styles.trendBadgeText, { color: '#34D399' }]}>↑ +5</Text>
            </View>
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

  /* Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 8,
  },
  headerTextCol: {
    flex: 1,
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
  headerSubtitleBadge: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#A8AABD',
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Inter_900Black',
    color: '#FFFFFF',
    letterSpacing: 0.2,
    marginTop: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginTop: 1,
  },

  /* Fixed Top Container (Scope + Podium + Time Period) */
  topFixedContainer: {
    paddingHorizontal: 16,
    backgroundColor: '#070814',
    zIndex: 10,
  },

  /* Scope Filter Tabs (3 tabs now) */
  scopeFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#110F24',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 3,
    marginTop: 4,
  },
  scopeBtn: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scopeBtnActive: {},
  scopeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 18,
    width: '100%',
  },
  scopeInactiveContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  scopeTextActive: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  scopeTextInactive: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#94A3B8',
  },

  /* Top 3 Podium */
  podiumContainer: {
    width: '100%',
    height: Math.min(width * 0.44, 195),
    marginTop: 10,
    position: 'relative',
    borderRadius: 18,
    overflow: 'hidden',
  },
  podiumImage: {
    width: '100%',
    height: '100%',
  },
  podiumHitRank2: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '33%',
    height: '80%',
  },
  podiumHitRank1: {
    position: 'absolute',
    left: '33%',
    bottom: 0,
    width: '34%',
    height: '100%',
  },
  podiumHitRank3: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '33%',
    height: '80%',
  },

  /* Time Period Segment Bar */
  periodSegmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#110F24',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 3,
    marginTop: 10,
    marginBottom: 8,
  },
  periodBtn: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodBtnActive: {},
  periodGradient: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 18,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodTextActive: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  periodTextInactive: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#94A3B8',
    paddingVertical: 7,
  },

  /* Scrollable Clans List (Ranks 4-10) */
  clansScrollView: {
    flex: 1,
    zIndex: 1,
  },
  clansScrollInner: {
    paddingHorizontal: 16,
    paddingTop: 2,
  },
  clanRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121124',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  clanRankNumber: {
    fontSize: 15,
    fontFamily: 'Inter_800ExtraBold',
    color: '#FFFFFF',
    width: 24,
    textAlign: 'center',
    marginRight: 8,
  },
  clanEmblem: {
    width: 44,
    height: 44,
    marginRight: 12,
  },
  clanInfoCol: {
    flex: 1,
  },
  clanName: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  clanMeta: {
    fontSize: 11.5,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginTop: 2,
  },

  /* Trend Badges */
  trendBadgePill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadgeUp: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  trendBadgeDown: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  trendBadgeSame: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  trendBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },

  /* Bottom User Clan Sticky Bar - 100% Solid, Non-Transparent */
  bottomStickyWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: '#070814', // Solid opaque black/dark background matching the screen!
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: 99,
  },
  userClanStickyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#160F38', // Solid opaque base color!
    overflow: 'hidden',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
  },
  userClanRankText: {
    fontSize: 17,
    fontFamily: 'Inter_900Black',
    color: '#FFFFFF',
    marginRight: 10,
  },
  userClanEmblem: {
    width: 44,
    height: 44,
    marginRight: 12,
  },
  userClanInfoCol: {
    flex: 1,
  },
  userClanTitle: {
    fontSize: 14.5,
    fontFamily: 'Inter_800ExtraBold',
    color: '#FFFFFF',
  },
  userClanSubtitle: {
    fontSize: 11.5,
    fontFamily: 'Inter_500Medium',
    color: '#C084FC',
    marginTop: 2,
  },
});
