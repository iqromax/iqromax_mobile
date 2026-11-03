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
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

// 5 Clan Members with Contribution Data matching mockup 1:1
const INITIAL_MEMBERS = [
  {
    rank: 1,
    name: 'Ali_Pro',
    level: 28,
    count: 180,
    percent: 25,
    avatar: require('../assets/clan_avatar_1.png'),
    badgeType: 'crown', // gold crown badge
  },
  {
    rank: 2,
    name: 'Sardor',
    level: 24,
    count: 120,
    percent: 17,
    avatar: require('../assets/clan_avatar_2.png'),
    badgeType: 'silver',
  },
  {
    rank: 3,
    name: 'Bekzod',
    level: 22,
    count: 100,
    percent: 14,
    avatar: require('../assets/clan_avatar_3.png'),
    badgeType: 'bronze',
  },
  {
    rank: 4,
    name: 'Diyor',
    level: 21,
    count: 82,
    percent: 11,
    avatar: require('../assets/clan_avatar_4.png'),
    badgeType: 'normal',
  },
  {
    rank: 5,
    name: 'Madina',
    level: 20,
    count: 76,
    percent: 11,
    avatar: require('../assets/clan_avatar_5.png'),
    badgeType: 'normal',
  },
];

// 3 Tabs in the middle
const PROGRESS_TABS = [
  { id: 'members', label: "A'zolar hissasi", icon: 'users', family: 'feather' },
  { id: 'daily', label: 'Kundalik progress', icon: 'calendar', family: 'feather' },
  { id: 'analytics', label: 'Tahlil', icon: 'bar-chart-2', family: 'feather' },
];

export default function ClanMissionProgressScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('members');
  const [members] = useState(INITIAL_MEMBERS);

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
    if (tabId === 'daily') {
      Alert.alert(
        "Kundalik Progress 📅",
        "Bugun: +240 ta masala\nKecha: +210 ta masala\nO'tgan kun: +185 ta masala\n\nJamoa har kuni o'rtacha 200+ masala yechmoqda!"
      );
    } else if (tabId === 'analytics') {
      Alert.alert(
        "Tahlil va Statistika 📊",
        "O'rtacha faollik: 80%\nEng faol vaqt: 18:00 - 22:00\nPrognoz: Maqsadga 2 kunda erishiladi!"
      );
    }
  };

  const handleMemberPress = (member) => {
    triggerHaptic();
    Alert.alert(
      member.name,
      `Reyting: #${member.rank}\nDaraja: Lv. ${member.level}\nQo'shgan hissasi: ${member.count} ta masala (${member.percent}%)\nHolat: Faol o'yinchi`
    );
  };

  const handleAllMembersPress = () => {
    triggerHaptic();
    navigation.navigate('ClanActivityScreen');
  };

  const handleGoalBannerPress = () => {
    triggerHaptic('medium');
    navigation.navigate('TeacherCourseLessonsScreen');
  };

  // Render rank badge (1: Gold crown, 2: Silver circle, 3: Bronze circle, 4-5: Slate circle)
  const renderRankBadge = (member) => {
    if (member.badgeType === 'crown') {
      return (
        <View style={styles.crownBadge}>
          <FontAwesome5 name="crown" size={12} color="#FFFFFF" style={styles.crownIcon} />
          <Text style={styles.crownRankText}>1</Text>
        </View>
      );
    }
    if (member.badgeType === 'silver') {
      return (
        <View style={styles.silverBadge}>
          <Text style={styles.badgeText}>2</Text>
        </View>
      );
    }
    if (member.badgeType === 'bronze') {
      return (
        <View style={styles.bronzeBadge}>
          <Text style={styles.badgeText}>3</Text>
        </View>
      );
    }
    return (
      <View style={styles.normalBadge}>
        <Text style={styles.normalBadgeText}>{member.rank}</Text>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Ambient background glow */}
      <LinearGradient
        colors={['#170F38', '#0A081C', '#070814']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.4 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* TOP HEADER */}
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

          <View style={styles.headerTextCol}>
            <Text style={styles.headerTitle}>Mission Progress</Text>
            <Text style={styles.headerSubtitle}>Jamoaviy vazifaning umumiy va a'zolar hissasi</Text>
          </View>
        </View>

        {/* SCROLLABLE MAIN CONTENT */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 30 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. TOP HERO CARD (Clan Mission: Jamoaviy 1,000 ta masala yechish) */}
          <View style={styles.heroCard}>
            <LinearGradient
              colors={['#23154E', '#130D30', '#0E0922']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />

            {/* Background Mountains Silhouette */}
            <Svg width={width - 32} height={130} viewBox="0 0 350 130" style={styles.heroMountainSvg}>
              <Path
                d="M-20 130 L40 60 L110 100 L180 40 L250 95 L320 50 L380 130 Z"
                fill="#2E185E"
                opacity={0.35}
              />
              <Path
                d="M-10 130 L60 80 L130 115 L200 65 L270 105 L350 75 L380 130 Z"
                fill="#1B0F38"
                opacity={0.65}
              />
            </Svg>

            {/* Top Info Row */}
            <View style={styles.heroTopRow}>
              {/* 3D Purple/Gold Target with Dart */}
              <View style={styles.heroTargetWrap}>
                <View style={styles.targetAura} />
                <View style={styles.heroTargetOuterCircle}>
                  <View style={styles.heroTargetInnerCircle}>
                    <MaterialCommunityIcons name="bullseye-arrow" size={38} color="#FBBF24" />
                  </View>
                </View>
              </View>

              {/* Title & Subtitle */}
              <View style={styles.heroTextCol}>
                <View style={styles.clanMissionPill}>
                  <Feather name="users" size={11} color="#DDD6FE" />
                  <Text style={styles.clanMissionPillText}>Clan Mission</Text>
                </View>
                <Text style={styles.heroTitle}>Jamoaviy 1,000 ta masala yechish</Text>
                <Text style={styles.heroSubtitle}>
                  Barcha a'zolar birgalikda 1,000 ta masalani yechishi kerak.
                </Text>
              </View>
            </View>

            {/* Reward Pill Row */}
            <View style={styles.rewardRow}>
              <View style={styles.rewardLeftGroup}>
                <Feather name="gift" size={16} color="#C084FC" />
                <Text style={styles.rewardLabel}>Mukofot</Text>
              </View>

              <View style={styles.rewardDivider} />

              <View style={styles.rewardXpPill}>
                <MaterialCommunityIcons name="shield-star" size={14} color="#C084FC" />
                <Text style={styles.rewardXpText}>+500 Clan XP</Text>
              </View>

              <View style={styles.rewardCoinPill}>
                <MaterialCommunityIcons name="circle-multiple" size={14} color="#FBBF24" />
                <Text style={styles.rewardCoinText}>+100 Coin</Text>
              </View>
            </View>
          </View>

          {/* 2. CLAN PROGRESS CARD ("Jamoa progressi") */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeaderRow}>
              <View style={styles.progressLabelWrap}>
                <Feather name="users" size={18} color="#C084FC" />
                <Text style={styles.progressLabelText}>Jamoa progressi</Text>
              </View>
              <Text style={styles.progressValueText}>720 / 1,000</Text>
            </View>

            {/* Progress bar */}
            <View style={styles.progressBarTrack}>
              <LinearGradient
                colors={['#8B5CF6', '#C084FC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: '72%' }]}
              />
            </View>
            <Text style={styles.progressPercentageText}>72%</Text>

            {/* 3 Stats Column */}
            <View style={styles.statsThreeColRow}>
              {/* Col 1 */}
              <View style={styles.statCol}>
                <View style={styles.statColHeader}>
                  <Feather name="clock" size={13} color="#C084FC" />
                  <Text style={styles.statColLabel}>Qolgan vaqt</Text>
                </View>
                <Text style={styles.statColValue}>2 kun 14 soat</Text>
              </View>

              {/* Col 2 */}
              <View style={styles.statCol}>
                <View style={styles.statColHeader}>
                  <Feather name="users" size={13} color="#C084FC" />
                  <Text style={styles.statColLabel}>Faol a'zolar</Text>
                </View>
                <Text style={styles.statColValue}>8 / 10</Text>
              </View>

              {/* Col 3 */}
              <View style={styles.statCol}>
                <View style={styles.statColHeader}>
                  <Feather name="trending-up" size={13} color="#C084FC" />
                  <Text style={styles.statColLabel}>Kerakli natija</Text>
                </View>
                <Text style={styles.statColValue}>280 ta masala</Text>
              </View>
            </View>
          </View>

          {/* 3. SECTION TABS (A'zolar hissasi | Kundalik progress | Tahlil) */}
          <View style={styles.tabsWrap}>
            {PROGRESS_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  activeOpacity={0.8}
                  style={styles.tabPillBtn}
                  onPress={() => handleTabPress(tab.id)}
                >
                  {isActive ? (
                    <LinearGradient
                      colors={['#8B5CF6', '#6D28D9']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.tabActiveGradient}
                    >
                      <Feather name={tab.icon} size={14} color="#FFFFFF" />
                      <Text style={styles.tabTextActive}>{tab.label}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.tabInactiveInner}>
                      <Feather name={tab.icon} size={14} color="#94A3B8" />
                      <Text style={styles.tabTextInactive}>{tab.label}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 4. MEMBERS CONTRIBUTION LIST */}
          <View style={styles.membersSectionHeader}>
            <Text style={styles.membersSectionTitle}>A'zolar bo'yicha hissa</Text>
            <Text style={styles.membersSectionTotal}>Jami: 720 ta</Text>
          </View>

          <View style={styles.membersListCard}>
            {members.map((member, index) => (
              <TouchableOpacity
                key={member.rank}
                activeOpacity={0.82}
                style={[
                  styles.memberRow,
                  index === members.length - 1 && { borderBottomWidth: 0 },
                ]}
                onPress={() => handleMemberPress(member)}
              >
                {/* Rank Badge */}
                <View style={styles.rankBadgeCol}>{renderRankBadge(member)}</View>

                {/* Avatar with Online Dot */}
                <View style={styles.avatarWrap}>
                  <Image source={member.avatar} style={styles.avatarImg} contentFit="cover" />
                  <View style={styles.onlineDot} />
                </View>

                {/* User Info */}
                <View style={styles.userInfoCol}>
                  <Text style={styles.userNameText}>{member.name}</Text>
                  <Text style={styles.userLevelText}>Lv. {member.level}</Text>
                </View>

                {/* Contribution Progress Col */}
                <View style={styles.userProgressCol}>
                  <View style={styles.countAndPercentRow}>
                    <Text style={styles.userCountText}>{member.count} ta</Text>
                    <Text style={styles.userPercentText}>{member.percent}%</Text>
                  </View>

                  <View style={styles.userMiniTrack}>
                    <LinearGradient
                      colors={['#8B5CF6', '#C084FC']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.userMiniFill, { width: `${member.percent * 2.5}%` }]}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {/* "Barcha a'zolarni ko'rish" Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.seeAllMembersBtn}
              onPress={handleAllMembersPress}
            >
              <Feather name="users" size={16} color="#94A3B8" />
              <Text style={styles.seeAllMembersText}>Barcha a'zolarni ko'rish</Text>
              <Feather name="chevron-right" size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* 5. BOTTOM GOAL / MOUNTAIN BANNER ("Maqsadga 280 ta masala qoldi!") */}
          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.goalBanner}
            onPress={handleGoalBannerPress}
          >
            <LinearGradient
              colors={['#241552', '#140D30', '#0E0922']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />

            {/* Target Icon */}
            <View style={styles.goalIconWrap}>
              <MaterialCommunityIcons name="bullseye-arrow" size={32} color="#FBBF24" />
            </View>

            {/* Text Message */}
            <View style={styles.goalTextCol}>
              <Text style={styles.goalTitle}>
                Maqsadga <Text style={styles.goalHighlight}>280 ta masala</Text> qoldi!
              </Text>
              <Text style={styles.goalSubtitle}>
                Jamoa bilan birga vazifani yakunlang va mukofotni oling!
              </Text>
            </View>

            {/* Mountain Summit with Golden Victory Flag Artwork */}
            <View style={styles.mountainFlagWrap}>
              <Svg width={72} height={55} viewBox="0 0 72 55">
                <Defs>
                  <SvgGradient id="mountainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#4C1D95" />
                    <Stop offset="100%" stopColor="#1E1038" />
                  </SvgGradient>
                </Defs>
                {/* Mountain peak */}
                <Polygon points="36,18 72,55 0,55" fill="url(#mountainGrad)" />
                <Polygon points="36,18 54,55 36,55" fill="rgba(168, 85, 247, 0.4)" />
                {/* Flag pole */}
                <Path d="M36,6 L36,20" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
                {/* Waving Golden Flag */}
                <Path
                  d="M36,6 Q45,3 52,7 Q45,11 36,13 Z"
                  fill="#F59E0B"
                  stroke="#FBBF24"
                  strokeWidth="1"
                />
              </Svg>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#070814',
  },
  safeArea: {
    flex: 1,
  },

  /* Top Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  backCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginTop: 2,
  },

  /* Scrollable Content */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },

  /* 1. Hero Card */
  heroCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.25)',
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 6,
    marginBottom: 12,
  },
  heroMountainSvg: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 0,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  heroTargetWrap: {
    width: 68,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    position: 'relative',
  },
  targetAura: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(168, 85, 247, 0.45)',
  },
  heroTargetOuterCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(36, 17, 78, 0.9)',
    borderWidth: 2,
    borderColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTargetInnerCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTextCol: {
    flex: 1,
  },
  clanMissionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(139, 92, 246, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.4)',
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    gap: 5,
    marginBottom: 6,
  },
  clanMissionPillText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#DDD6FE',
  },
  heroTitle: {
    fontSize: 17.5,
    fontFamily: 'Inter_900Black',
    color: '#FFFFFF',
    letterSpacing: 0.1,
    lineHeight: 22,
  },
  heroSubtitle: {
    fontSize: 11.5,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    marginTop: 4,
    lineHeight: 16,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginTop: 14,
    zIndex: 1,
  },
  rewardLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rewardLabel: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#E2E8F0',
  },
  rewardDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 10,
  },
  rewardXpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 5,
    marginRight: 8,
  },
  rewardXpText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#C084FC',
  },
  rewardCoinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 5,
  },
  rewardCoinText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#FBBF24',
  },

  /* 2. Clan Progress Card */
  progressCard: {
    backgroundColor: '#110F27',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressLabelText: {
    fontSize: 14.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  progressValueText: {
    fontSize: 14.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  progressBarTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E1B38',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentageText: {
    alignSelf: 'flex-end',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginTop: 4,
    marginBottom: 12,
  },
  statsThreeColRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 12,
  },
  statCol: {
    flex: 1,
  },
  statColHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  statColLabel: {
    fontSize: 10.5,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
  },
  statColValue: {
    fontSize: 12.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },

  /* 3. Section Switcher Tabs */
  tabsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#110F24',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 3,
    marginBottom: 14,
    gap: 4,
  },
  tabPillBtn: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  tabActiveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 18,
    gap: 6,
  },
  tabInactiveInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 18,
    gap: 6,
  },
  tabTextActive: {
    fontSize: 11.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  tabTextInactive: {
    fontSize: 11.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#94A3B8',
  },

  /* 4. Members Contribution List */
  membersSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  membersSectionTitle: {
    fontSize: 14.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  membersSectionTotal: {
    fontSize: 12.5,
    fontFamily: 'Inter_700Bold',
    color: '#C084FC',
  },
  membersListCard: {
    backgroundColor: '#110F27',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  rankBadgeCol: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  crownBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  crownIcon: {
    position: 'absolute',
    top: -5,
  },
  crownRankText: {
    fontSize: 11,
    fontFamily: 'Inter_900Black',
    color: '#FFFFFF',
    marginTop: 1,
  },
  silverBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bronzeBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  normalBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  normalBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#94A3B8',
  },
  avatarWrap: {
    position: 'relative',
    marginRight: 10,
  },
  avatarImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#8B5CF6',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#110F27',
  },
  userInfoCol: {
    width: 80,
  },
  userNameText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  userLevelText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginTop: 1,
  },
  userProgressCol: {
    flex: 1,
    paddingLeft: 8,
  },
  countAndPercentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userCountText: {
    fontSize: 12.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  userPercentText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#94A3B8',
  },
  userMiniTrack: {
    width: '100%',
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#1E1B38',
    overflow: 'hidden',
  },
  userMiniFill: {
    height: '100%',
    borderRadius: 2.5,
  },
  seeAllMembersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingVertical: 10,
    gap: 8,
    marginTop: 8,
  },
  seeAllMembersText: {
    fontSize: 12.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#CBD5E1',
  },

  /* 5. Goal Motivation Banner */
  goalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.35)',
    padding: 14,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 4,
  },
  goalIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  goalTextCol: {
    flex: 1,
    paddingRight: 6,
  },
  goalTitle: {
    fontSize: 13.5,
    fontFamily: 'Inter_800ExtraBold',
    color: '#FFFFFF',
    lineHeight: 18,
  },
  goalHighlight: {
    color: '#FBBF24',
  },
  goalSubtitle: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 15,
  },
  mountainFlagWrap: {
    width: 65,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

