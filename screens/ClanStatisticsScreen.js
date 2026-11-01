import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Animated,
  Alert,
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
  Circle,
  Line,
} from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function ClanStatisticsScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState('Hafta'); // Hafta | Oy | Season | Barchasi
  const [userClan, setUserClan] = useState(null);

  // Animation values for smooth tab transitions
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loadClan = async () => {
      try {
        const stored = await AsyncStorage.getItem('@iqromax_user_clan');
        if (stored) {
          setUserClan(JSON.parse(stored));
        }
      } catch (e) {
        console.log('Error loading clan in statistics:', e);
      }
    };
    loadClan();
  }, []);

  const handleFilterChange = (filter) => {
    if (filter === selectedFilter) return;
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.4, duration: 120, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
    setSelectedFilter(filter);
  };

  // Filter-specific statistics dataset
  const getFilterData = () => {
    switch (selectedFilter) {
      case 'Oy':
        return {
          dateRange: '1 - 31 okt',
          clanXp: '48,250',
          xpTrend: '+28%',
          missions: '312',
          missionsTrend: '+32%',
          battles: '94',
          battlesTrend: '+19%',
          activity: '94%',
          activityTrend: '+8%',
          totalXp: '48,250 XP',
          chartPoints: [
            { label: '1-h', val: 9500, x: 20, y: 100 },
            { label: '2-h', val: 21000, x: 100, y: 75 },
            { label: '3-h', val: 34500, x: 180, y: 50 },
            { label: '4-h', val: 48250, x: 260, y: 22 },
          ],
          chartPath: 'M 20 100 Q 60 90, 100 75 T 180 50 T 260 22',
          chartArea: 'M 20 100 Q 60 90, 100 75 T 180 50 T 260 22 L 260 135 L 20 135 Z',
          completedMissions: 270,
          inProgressMissions: 28,
          failedMissions: 14,
          missionPercent: 88,
          activeCount: 9,
          totalCount: 10,
          memberPercent: '90%',
          activeBars: 9,
          members: [
            { rank: 1, name: 'Ali_Pro', level: 28, xp: '9,450 XP', pct: 22, avatar: require('../assets/clan_avatar_1.png') },
            { rank: 2, name: 'Sardor', level: 24, xp: '7,980 XP', pct: 18, avatar: require('../assets/clan_avatar_2.png') },
            { rank: 3, name: 'Bekzod', level: 22, xp: '6,720 XP', pct: 15, avatar: require('../assets/clan_avatar_3.png') },
          ],
        };
      case 'Season':
        return {
          dateRange: 'Mavsum 5',
          clanXp: '124,500',
          xpTrend: '+45%',
          missions: '780',
          missionsTrend: '+40%',
          battles: '240',
          battlesTrend: '+28%',
          activity: '95%',
          activityTrend: '+10%',
          totalXp: '124,500 XP',
          chartPoints: [
            { label: 'Avg', val: 24000, x: 20, y: 110 },
            { label: 'Sen', val: 68000, x: 140, y: 65 },
            { label: 'Okt', val: 124500, x: 260, y: 20 },
          ],
          chartPath: 'M 20 110 Q 80 90, 140 65 T 260 20',
          chartArea: 'M 20 110 Q 80 90, 140 65 T 260 20 L 260 135 L 20 135 Z',
          completedMissions: 710,
          inProgressMissions: 50,
          failedMissions: 20,
          missionPercent: 91,
          activeCount: 9,
          totalCount: 10,
          memberPercent: '90%',
          activeBars: 9,
          members: [
            { rank: 1, name: 'Ali_Pro', level: 28, xp: '26,450 XP', pct: 24, avatar: require('../assets/clan_avatar_1.png') },
            { rank: 2, name: 'Sardor', level: 24, xp: '21,980 XP', pct: 19, avatar: require('../assets/clan_avatar_2.png') },
            { rank: 3, name: 'Bekzod', level: 22, xp: '18,720 XP', pct: 16, avatar: require('../assets/clan_avatar_3.png') },
          ],
        };
      case 'Barchasi':
        return {
          dateRange: 'Umumiy tarix',
          clanXp: '340,000',
          xpTrend: '+62%',
          missions: '2,150',
          missionsTrend: '+54%',
          battles: '680',
          battlesTrend: '+35%',
          activity: '96%',
          activityTrend: '+12%',
          totalXp: '340,000 XP',
          chartPoints: [
            { label: 'M1', val: 50000, x: 20, y: 115 },
            { label: 'M2', val: 140000, x: 80, y: 85 },
            { label: 'M3', val: 210000, x: 140, y: 60 },
            { label: 'M4', val: 275000, x: 200, y: 40 },
            { label: 'M5', val: 340000, x: 260, y: 18 },
          ],
          chartPath: 'M 20 115 Q 50 100, 80 85 T 140 60 T 200 40 T 260 18',
          chartArea: 'M 20 115 Q 50 100, 80 85 T 140 60 T 200 40 T 260 18 L 260 135 L 20 135 Z',
          completedMissions: 1980,
          inProgressMissions: 110,
          failedMissions: 60,
          missionPercent: 92,
          activeCount: 10,
          totalCount: 10,
          memberPercent: '100%',
          activeBars: 10,
          members: [
            { rank: 1, name: 'Ali_Pro', level: 28, xp: '74,500 XP', pct: 25, avatar: require('../assets/clan_avatar_1.png') },
            { rank: 2, name: 'Sardor', level: 24, xp: '59,200 XP', pct: 19, avatar: require('../assets/clan_avatar_2.png') },
            { rank: 3, name: 'Bekzod', level: 22, xp: '48,100 XP', pct: 15, avatar: require('../assets/clan_avatar_3.png') },
          ],
        };
      case 'Hafta':
      default:
        return {
          dateRange: '6 - 13 okt',
          clanXp: '12,480',
          xpTrend: '+18%',
          missions: '86',
          missionsTrend: '+24%',
          battles: '24',
          battlesTrend: '+14%',
          activity: '92%',
          activityTrend: '+6%',
          totalXp: '12,480 XP',
          chartPoints: [
            { label: 'Du', val: '3.8K', x: 18, y: 108 },
            { label: 'Se', val: '6.5K', x: 58, y: 88 },
            { label: 'Ch', val: '6.9K', x: 98, y: 86 },
            { label: 'Pa', val: '7.8K', x: 138, y: 80 },
            { label: 'Ju', val: '10.2K', x: 178, y: 64 },
            { label: 'Sh', val: '11.1K', x: 218, y: 55 },
            { label: 'Ya', val: '12.48K', x: 258, y: 44 },
          ],
          // Smooth curve matching the screenshot precisely
          chartPath: 'M 18 108 C 38 102, 45 92, 58 88 C 72 84, 84 87, 98 86 C 112 85, 124 82, 138 80 C 152 78, 164 68, 178 64 C 192 60, 204 57, 218 55 C 234 52, 246 47, 258 44',
          chartArea: 'M 18 108 C 38 102, 45 92, 58 88 C 72 84, 84 87, 98 86 C 112 85, 124 82, 138 80 C 152 78, 164 68, 178 64 C 192 60, 204 57, 218 55 C 234 52, 246 47, 258 44 L 258 135 L 18 135 Z',
          completedMissions: 86,
          inProgressMissions: 10,
          failedMissions: 4,
          missionPercent: 86,
          activeCount: 8,
          totalCount: 10,
          memberPercent: '80%',
          activeBars: 8,
          members: [
            { rank: 1, name: 'Ali_Pro', level: 28, xp: '2,450 XP', pct: 20, avatar: require('../assets/clan_avatar_1.png') },
            { rank: 2, name: 'Sardor', level: 24, xp: '1,980 XP', pct: 16, avatar: require('../assets/clan_avatar_2.png') },
            { rank: 3, name: 'Bekzod', level: 22, xp: '1,720 XP', pct: 14, avatar: require('../assets/clan_avatar_3.png') },
          ],
        };
    }
  };

  const data = getFilterData();

  return (
    <View style={styles.screenRoot}>
      <StatusBar barStyle="light-content" backgroundColor="#070814" />

      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.backCircleBtn}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerTextCol}>
            <Text style={styles.headerTitle}>Clan Statistics</Text>
            <Text style={styles.headerSubtitle}>Claningizning batafsil ko'rsatkichlari</Text>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={[styles.scrollInner, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. TOP CLAN BANNER CARD */}
          <View style={styles.clanHeroCard}>
            <LinearGradient
              colors={['#17123A', '#130E2A', '#0B0A18']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />

            {/* Glowing orb in background */}
            <View style={styles.clanHeroGlow} />

            <View style={styles.clanHeroRow}>
              {/* Left: Shield Crown Emblem */}
              <View style={styles.clanEmblemBox}>
                <Image
                  source={require('../assets/clan_shield_crown.png')}
                  style={styles.clanEmblemImg}
                  contentFit="contain"
                />
              </View>

              {/* Center: Info */}
              <View style={styles.clanMetaCol}>
                <Text style={styles.clanNameText} numberOfLines={1}>
                  {userClan?.name || 'Wolf Legends'}
                </Text>
                <Text style={styles.clanSubText}>
                  Lv. {userClan?.level || 12} · {userClan?.membersCount || 8}/{userClan?.maxMembers || 10} Members
                </Text>
                <View style={styles.clanStatusPill}>
                  <View style={styles.clanGreenDot} />
                  <Text style={styles.clanStatusText}>Active Clan</Text>
                </View>
              </View>

              {/* Right: Wolf Head Art */}
              <Image
                source={require('../assets/clan_active_wolf.png')}
                style={styles.clanWolfImg}
                contentFit="cover"
              />
            </View>
          </View>

          {/* 2. TIME FILTER PILLS & DATE RANGE */}
          <View style={styles.filterRow}>
            {/* Segmented Filter Pills */}
            <View style={styles.segmentedContainer}>
              {['Hafta', 'Oy', 'Season', 'Barchasi'].map((filter) => {
                const isActive = selectedFilter === filter;
                return (
                  <TouchableOpacity
                    key={filter}
                    activeOpacity={0.8}
                    style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
                    onPress={() => handleFilterChange(filter)}
                  >
                    {isActive ? (
                      <LinearGradient
                        colors={['#8B5CF6', '#7C3AED']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.segmentGradient}
                      >
                        <Text style={styles.segmentTextActive}>{filter}</Text>
                      </LinearGradient>
                    ) : (
                      <Text style={styles.segmentTextInactive}>{filter}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Date Range Pill */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.dateRangeBtn}
              onPress={() => Alert.alert("Sana oralig'i", `Tanlangan oraliq: ${data.dateRange}`)}
            >
              <Feather name="calendar" size={13} color="#C084FC" />
              <Text style={styles.dateRangeText}>{data.dateRange}</Text>
            </TouchableOpacity>
          </View>

          <Animated.View style={{ opacity: fadeAnim }}>
            {/* 3. 4 METRIC STAT CARDS ROW */}
            <View style={styles.statsCardsRow}>
              {/* Card 1: Clan XP */}
              <View style={styles.statCard}>
                <Ionicons name="layers" size={20} color="#C084FC" />
                <Text style={styles.statValueText}>{data.clanXp}</Text>
                <Text style={styles.statLabelText}>Clan XP</Text>
                <View style={styles.trendPill}>
                  <Text style={styles.trendText}>↑ {data.xpTrend}</Text>
                </View>
              </View>

              {/* Card 2: Missions */}
              <View style={styles.statCard}>
                <MaterialCommunityIcons name="target" size={20} color="#10B981" />
                <Text style={styles.statValueText}>{data.missions}</Text>
                <Text style={styles.statLabelText}>Missions</Text>
                <View style={styles.trendPill}>
                  <Text style={styles.trendText}>↑ {data.missionsTrend}</Text>
                </View>
              </View>

              {/* Card 3: G'alaba */}
              <View style={styles.statCard}>
                <Ionicons name="trophy-outline" size={20} color="#FBBF24" />
                <Text style={styles.statValueText}>{data.battles}</Text>
                <Text style={styles.statLabelText}>G'alaba</Text>
                <View style={styles.trendPill}>
                  <Text style={styles.trendText}>↑ {data.battlesTrend}</Text>
                </View>
              </View>

              {/* Card 4: Faollik */}
              <View style={styles.statCard}>
                <Ionicons name="people-outline" size={20} color="#38BDF8" />
                <Text style={styles.statValueText}>{data.activity}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.statLabelText}>Faollik</Text>
                  <Feather name="info" size={10} color="#94A3B8" style={{ marginLeft: 2 }} />
                </View>
                <View style={styles.trendPill}>
                  <Text style={styles.trendText}>↑ {data.activityTrend}</Text>
                </View>
              </View>
            </View>

            {/* 4. CLAN XP O'SISHI (INTERACTIVE AREA LINE CHART) */}
            <View style={styles.chartCard}>
              {/* Card Header */}
              <View style={styles.chartHeaderRow}>
                <View style={styles.chartHeaderLeft}>
                  <Feather name="bar-chart-2" size={18} color="#C084FC" />
                  <Text style={styles.chartTitle}>Clan XP o'sishi</Text>
                </View>

                <View style={styles.chartHeaderRight}>
                  <Text style={styles.chartTotalLabel}>Jami: </Text>
                  <Text style={styles.chartTotalValue}>{data.totalXp}</Text>
                  <View style={[styles.trendPill, { marginLeft: 8 }]}>
                    <Text style={styles.trendText}>↑ {data.xpTrend}</Text>
                  </View>
                </View>
              </View>

              {/* Chart Graphic Area */}
              <View style={styles.chartPlotContainer}>
                {/* Y-Axis Labels */}
                <View style={styles.yAxisCol}>
                  <Text style={styles.axisLabel}>15K</Text>
                  <Text style={styles.axisLabel}>12K</Text>
                  <Text style={styles.axisLabel}>9K</Text>
                  <Text style={styles.axisLabel}>6K</Text>
                  <Text style={styles.axisLabel}>3K</Text>
                  <Text style={styles.axisLabel}>0</Text>
                </View>

                {/* SVG Curves and Dots */}
                <View style={styles.svgWrapper}>
                  {/* Floating tooltip on highest point */}
                  <View style={styles.floatingTooltipBox}>
                    <Text style={styles.floatingTooltipText}>{data.totalXp}</Text>
                  </View>

                  <Svg width="100%" height={145} viewBox="0 0 280 145">
                    <Defs>
                      <SvgGradient id="xpAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0%" stopColor="#A855F7" stopOpacity="0.45" />
                        <Stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.18" />
                        <Stop offset="100%" stopColor="#4C1D95" stopOpacity="0.0" />
                      </SvgGradient>
                    </Defs>

                    {/* Subtle Horizontal Grid lines */}
                    <Line x1="0" y1="20" x2="280" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                    <Line x1="0" y1="50" x2="280" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                    <Line x1="0" y1="80" x2="280" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                    <Line x1="0" y1="110" x2="280" y2="110" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                    <Line x1="0" y1="135" x2="280" y2="135" stroke="rgba(255,255,255,0.08)" />

                    {/* Gradient Area Fill */}
                    <Path
                      d={data.chartArea}
                      fill="url(#xpAreaGrad)"
                    />

                    {/* Glowing Purple Trend Line */}
                    <Path
                      d={data.chartPath}
                      fill="none"
                      stroke="#C084FC"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />

                    {/* Data Points / Knots */}
                    {data.chartPoints.map((pt, i) => {
                      const isLast = i === data.chartPoints.length - 1;
                      return (
                        <React.Fragment key={i}>
                          {isLast ? (
                            <>
                              <Circle cx={pt.x} cy={pt.y} r={7} fill="rgba(192, 132, 252, 0.35)" />
                              <Circle cx={pt.x} cy={pt.y} r={4.2} fill="#FFFFFF" stroke="#A855F7" strokeWidth={2} />
                            </>
                          ) : (
                            <Circle cx={pt.x} cy={pt.y} r={3} fill="#FFFFFF" opacity={0.85} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </Svg>

                  {/* X-Axis Days Labels */}
                  <View style={styles.xAxisRow}>
                    {data.chartPoints.map((pt, i) => (
                      <Text key={i} style={styles.xAxisLabel}>
                        {pt.label}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {/* 5. TWO SPLIT CARDS (MISSIYALAR + A'ZOLAR FAOLLIGI) */}
            <View style={styles.twoSplitRow}>
              {/* Left Card: Missiyalar Bajarilishi */}
              <View style={styles.splitCard}>
                <View style={styles.splitHeaderRow}>
                  <MaterialCommunityIcons name="target" size={17} color="#C084FC" />
                  <Text style={styles.splitTitle}>Missiyalar bajarilishi</Text>
                </View>

                <View style={styles.donutAndLegendRow}>
                  {/* Donut Progress Circle */}
                  <View style={styles.donutWrap}>
                    <Svg width={76} height={76} viewBox="0 0 76 76">
                      <Defs>
                        <SvgGradient id="donutGrad" x1="0" y1="0" x2="1" y2="1">
                          <Stop offset="0%" stopColor="#C084FC" />
                          <Stop offset="100%" stopColor="#7C3AED" />
                        </SvgGradient>
                      </Defs>
                      {/* Background track */}
                      <Circle
                        cx="38"
                        cy="38"
                        r="31"
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeWidth="7"
                        fill="none"
                      />
                      {/* Active progress stroke (86%) */}
                      <Circle
                        cx="38"
                        cy="38"
                        r="31"
                        stroke="url(#donutGrad)"
                        strokeWidth="7"
                        strokeDasharray="195"
                        strokeDashoffset={195 * (1 - data.missionPercent / 100)}
                        strokeLinecap="round"
                        fill="none"
                        transform="rotate(-90 38 38)"
                      />
                    </Svg>
                    <View style={styles.donutCenterTextWrap}>
                      <Text style={styles.donutPercentText}>{data.missionPercent}%</Text>
                      <Text style={styles.donutSubText}>86 / 100</Text>
                    </View>
                  </View>

                  {/* Legend */}
                  <View style={styles.donutLegendCol}>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#10B981' }]}>
                        <Feather name="check" size={8} color="#FFFFFF" />
                      </View>
                      <Text style={styles.legendLabel}>Bajarilgan</Text>
                      <Text style={styles.legendValue}>{data.completedMissions}</Text>
                    </View>

                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#38BDF8' }]}>
                        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#FFFFFF' }} />
                      </View>
                      <Text style={styles.legendLabel}>Jarayonda</Text>
                      <Text style={styles.legendValue}>{data.inProgressMissions}</Text>
                    </View>

                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#64748B' }]}>
                        <Feather name="x" size={8} color="#FFFFFF" />
                      </View>
                      <Text style={styles.legendLabel}>Bajarilmagan</Text>
                      <Text style={styles.legendValue}>{data.failedMissions}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Right Card: A'zolar Faolligi */}
              <View style={styles.splitCard}>
                <View style={styles.splitHeaderRow}>
                  <Ionicons name="people-outline" size={17} color="#C084FC" />
                  <Text style={styles.splitTitle}>A'zolar faolligi</Text>
                </View>

                <View style={styles.memberActivityBody}>
                  <Text style={styles.memberCountText}>
                    {data.activeCount} / {data.totalCount}
                  </Text>
                  <Text style={styles.memberCountSub}>Faol a'zolar</Text>

                  {/* Activity Equalizer Bars */}
                  <View style={styles.equalizerRow}>
                    <View style={styles.barsGroup}>
                      {[...Array(10)].map((_, idx) => {
                        const isLit = idx < data.activeBars;
                        return (
                          <View
                            key={idx}
                            style={[
                              styles.equalizerBar,
                              isLit ? styles.equalizerBarLit : styles.equalizerBarDim,
                            ]}
                          />
                        );
                      })}
                    </View>
                    <Text style={styles.equalizerPctText}>{data.memberPercent}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 6. A'ZOLAR HISSASI (CLAN XP) - MEMBER CONTRIBUTION RANKING */}
            <View style={styles.rankingCard}>
              {/* Header */}
              <View style={styles.rankingHeaderRow}>
                <View style={styles.rankingHeaderLeft}>
                  <FontAwesome5 name="crown" size={15} color="#F59E0B" />
                  <Text style={styles.rankingTitle}>A'zolar hissasi (Clan XP)</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => Alert.alert("Barcha a'zolar", "Clan a'zolarining to'liq hissasi ro'yxati")}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <Text style={styles.rankingSeeAllText}>Barchasini ko'rish</Text>
                  <Feather name="chevron-right" size={13} color="#A855F7" style={{ marginLeft: 2 }} />
                </TouchableOpacity>
              </View>

              {/* Members List */}
              <View style={styles.membersListWrap}>
                {data.members.map((member) => {
                  let badgeBg = '#F59E0B';
                  let badgeText = '#1A1202';
                  if (member.rank === 2) {
                    badgeBg = '#94A3B8';
                    badgeText = '#0F172A';
                  } else if (member.rank === 3) {
                    badgeBg = '#D97706';
                    badgeText = '#FFFFFF';
                  }

                  return (
                    <View key={member.rank} style={styles.memberRankRowItem}>
                      {/* Rank Number Circle Badge */}
                      <View style={[styles.rankCircleBadge, { backgroundColor: badgeBg }]}>
                        <Text style={[styles.rankCircleText, { color: badgeText }]}>{member.rank}</Text>
                      </View>

                      {/* Avatar */}
                      <Image
                        source={member.avatar}
                        style={styles.memberRankAvatar}
                        contentFit="cover"
                      />

                      {/* Name & Level */}
                      <View style={styles.memberRankNameCol}>
                        <Text style={styles.memberRankName}>{member.name}</Text>
                        <Text style={styles.memberRankLevel}>Lv. {member.level}</Text>
                      </View>

                      {/* XP & Contribution Percent Bar */}
                      <View style={styles.memberRankXpCol}>
                        <View style={styles.memberRankXpHeader}>
                          <Text style={styles.memberRankXpText}>{member.xp}</Text>
                          <Text style={styles.memberRankPctText}>{member.pct}%</Text>
                        </View>
                        <View style={styles.memberRankProgressBarTrack}>
                          <LinearGradient
                            colors={['#8B5CF6', '#C084FC']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.memberRankProgressBarFill, { width: `${member.pct * 4}%` }]}
                          />
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </Animated.View>
        </ScrollView>
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
    paddingVertical: 10,
  },
  backCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  headerTextCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 21,
    fontFamily: 'Inter_900Black',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 12.5,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginTop: 2,
  },

  /* Scrollable Content */
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: 16,
    paddingTop: 6,
  },

  /* Clan Hero Banner */
  clanHeroCard: {
    backgroundColor: '#14102C',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.28)',
    padding: 14,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 6,
  },
  clanHeroGlow: {
    position: 'absolute',
    top: -20,
    right: 50,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(168, 85, 247, 0.16)',
  },
  clanHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clanEmblemBox: {
    width: 58,
    height: 58,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clanEmblemImg: {
    width: 58,
    height: 58,
  },
  clanMetaCol: {
    flex: 1,
    justifyContent: 'center',
  },
  clanNameText: {
    fontSize: 18,
    fontFamily: 'Inter_900Black',
    color: '#FFFFFF',
  },
  clanSubText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#A78BFA',
    marginTop: 2,
  },
  clanStatusPill: {
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
  clanGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 5,
  },
  clanStatusText: {
    fontSize: 10.5,
    fontFamily: 'Inter_700Bold',
    color: '#34D399',
  },
  clanWolfImg: {
    width: 82,
    height: 60,
    borderRadius: 10,
  },

  /* Time Filter Pills & Date Range */
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  segmentedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#110F24',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 3,
  },
  segmentBtn: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  segmentBtnActive: {},
  segmentGradient: {
    paddingVertical: 6,
    paddingHorizontal: 13,
    borderRadius: 18,
  },
  segmentTextActive: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  segmentTextInactive: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#94A3B8',
    paddingVertical: 6,
    paddingHorizontal: 11,
  },
  dateRangeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#110F24',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  dateRangeText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    marginLeft: 6,
  },

  /* 4 Metric Stat Cards */
  statsCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#131126',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  statValueText: {
    fontSize: 16,
    fontFamily: 'Inter_900Black',
    color: '#FFFFFF',
    marginTop: 6,
  },
  statLabelText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginTop: 2,
  },
  trendPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.14)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 5,
  },
  trendText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: '#34D399',
  },

  /* Clan XP Chart Card */
  chartCard: {
    backgroundColor: '#131126',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
    padding: 16,
    marginTop: 14,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 15.5,
    fontFamily: 'Inter_800ExtraBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  chartHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartTotalLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
  },
  chartTotalValue: {
    fontSize: 12.5,
    fontFamily: 'Inter_800ExtraBold',
    color: '#FFFFFF',
  },
  chartPlotContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 6,
  },
  yAxisCol: {
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingRight: 8,
    alignItems: 'flex-end',
    width: 32,
  },
  axisLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
  },
  svgWrapper: {
    flex: 1,
    position: 'relative',
  },
  floatingTooltipBox: {
    position: 'absolute',
    top: 15,
    right: 2,
    zIndex: 10,
    backgroundColor: '#9333EA',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    shadowColor: '#9333EA',
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  floatingTooltipText: {
    fontSize: 10.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  xAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingHorizontal: 6,
  },
  xAxisLabel: {
    fontSize: 10.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#94A3B8',
  },

  /* Two Split Cards */
  twoSplitRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
  splitCard: {
    flex: 1,
    backgroundColor: '#131126',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
    padding: 14,
    marginHorizontal: 3,
  },
  splitHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  splitTitle: {
    fontSize: 12.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  donutAndLegendRow: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  donutWrap: {
    position: 'relative',
    width: 76,
    height: 76,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  donutCenterTextWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutPercentText: {
    fontSize: 15,
    fontFamily: 'Inter_900Black',
    color: '#FFFFFF',
  },
  donutSubText: {
    fontSize: 9,
    fontFamily: 'Inter_600SemiBold',
    color: '#94A3B8',
  },
  donutLegendCol: {
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2.5,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  legendLabel: {
    flex: 1,
    fontSize: 10.5,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
  },
  legendValue: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },

  /* Member Activity Body */
  memberActivityBody: {
    flex: 1,
    justifyContent: 'space-between',
  },
  memberCountText: {
    fontSize: 22,
    fontFamily: 'Inter_900Black',
    color: '#FFFFFF',
    marginTop: 4,
  },
  memberCountSub: {
    fontSize: 11.5,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginTop: 2,
  },
  equalizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  barsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  equalizerBar: {
    width: 6.5,
    height: 24,
    borderRadius: 3.5,
    marginRight: 3,
  },
  equalizerBarLit: {
    backgroundColor: '#A855F7',
  },
  equalizerBarDim: {
    backgroundColor: '#231F3D',
  },
  equalizerPctText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },

  /* Member Ranking Card */
  rankingCard: {
    backgroundColor: '#131126',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
    padding: 16,
    marginTop: 14,
    marginBottom: 10,
  },
  rankingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  rankingHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankingTitle: {
    fontSize: 14.5,
    fontFamily: 'Inter_800ExtraBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  rankingSeeAllText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#A855F7',
  },
  membersListWrap: {},
  memberRankRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  rankCircleBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rankCircleText: {
    fontSize: 11,
    fontFamily: 'Inter_900Black',
  },
  memberRankAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
  },
  memberRankNameCol: {
    flex: 1,
  },
  memberRankName: {
    fontSize: 13.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  memberRankLevel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginTop: 1,
  },
  memberRankXpCol: {
    width: 140,
    alignItems: 'flex-end',
  },
  memberRankXpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },
  memberRankXpText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  memberRankPctText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#94A3B8',
  },
  memberRankProgressBarTrack: {
    width: '100%',
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  memberRankProgressBarFill: {
    height: '100%',
    borderRadius: 2.5,
  },
});
