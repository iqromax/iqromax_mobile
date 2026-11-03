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

const { width } = Dimensions.get('window');

// 5 Streak Reward Milestones (matching mockup)
const STREAK_MILESTONES = [
  {
    id: 1,
    day: 3,
    dayLabel: '3 kun',
    reward: '+100 XP',
    status: 'completed', // Green checkmark
    isSpecial: false,
  },
  {
    id: 2,
    day: 7,
    dayLabel: '7 kun',
    reward: '+200 XP',
    status: 'active', // Active glowing golden box with checkmark
    isSpecial: false,
  },
  {
    id: 3,
    day: 14,
    dayLabel: '14 kun',
    reward: '+500 XP',
    status: 'locked',
    isSpecial: false,
  },
  {
    id: 4,
    day: 21,
    dayLabel: '21 kun',
    reward: '+1,000 XP',
    status: 'locked',
    isSpecial: false,
  },
  {
    id: 5,
    day: 30,
    dayLabel: '30 kun',
    reward: 'Maxsus nishon',
    status: 'locked',
    isSpecial: true, // Golden crown badge
  },
];

// 7 Days of Week for Streak Calendar (Du to Ya)
const WEEK_DAYS = [
  { id: 'mon', dayOfWeek: 'Du', dateNum: '19', hasStreak: true, isToday: false },
  { id: 'tue', dayOfWeek: 'Se', dateNum: '20', hasStreak: true, isToday: false },
  { id: 'wed', dayOfWeek: 'Ch', dateNum: '21', hasStreak: true, isToday: false },
  { id: 'thu', dayOfWeek: 'Pa', dateNum: '22', hasStreak: true, isToday: false },
  { id: 'fri', dayOfWeek: 'Ju', dateNum: '23', hasStreak: true, isToday: false },
  { id: 'sat', dayOfWeek: 'Sh', dateNum: '24', hasStreak: true, isToday: false },
  { id: 'sun', dayOfWeek: 'Ya', dateNum: '25', hasStreak: true, isToday: true }, // Current active day with purple glow
];

// 8 Active Members Today
const ACTIVE_MEMBERS = [
  { id: 1, name: 'Ali_Pro', avatar: require('../assets/clan_avatar_1.png') },
  { id: 2, name: 'Sardor', avatar: require('../assets/clan_avatar_2.png') },
  { id: 3, name: 'Bekzod', avatar: require('../assets/clan_avatar_3.png') },
  { id: 4, name: 'Diyor', avatar: require('../assets/clan_avatar_4.png') },
  { id: 5, name: 'Madina', avatar: require('../assets/clan_avatar_5.png') },
  { id: 6, name: 'Aziz', avatar: require('../assets/avatar_alex.jpg') },
  { id: 7, name: 'Umid', avatar: require('../assets/avatar_david.jpg') },
  { id: 8, name: 'Nilufar', avatar: require('../assets/avatar_lily.jpg') },
];

export default function ClanStreakScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const triggerHaptic = (type = 'light') => {
    try {
      if (type === 'medium') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (e) {}
  };

  const handleMilestonePress = (milestone) => {
    triggerHaptic();
    setSelectedMilestone(milestone);
  };

  const handleMemberPress = (member) => {
    triggerHaptic();
    Alert.alert(member.name, `Bugun dars va mashqlarni bajardi. Streak'ga o'z hissasini qo'shdi!`);
  };

  // Render the center Flaming Clan Emblem (flame with users silhouette)
  const renderFlameEmblem = () => {
    return (
      <View style={styles.flameContainer}>
        {/* Ambient flame glow circle */}
        <View style={styles.flameGlowCircle} />

        <Svg width={110} height={105} viewBox="0 0 110 105">
          <Defs>
            <SvgGradient id="flameOuter" x1="0%" y1="100%" x2="0%" y2="0%">
              <Stop offset="0%" stopColor="#EA580C" />
              <Stop offset="40%" stopColor="#F97316" />
              <Stop offset="80%" stopColor="#FBBF24" />
              <Stop offset="100%" stopColor="#FEF08A" />
            </SvgGradient>
            <SvgGradient id="flameInner" x1="0%" y1="100%" x2="0%" y2="0%">
              <Stop offset="0%" stopColor="#DC2626" />
              <Stop offset="50%" stopColor="#EA580C" />
              <Stop offset="100%" stopColor="#FBBF24" />
            </SvgGradient>
            <SvgGradient id="coreCircleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#7C2D12" />
              <Stop offset="100%" stopColor="#431407" />
            </SvgGradient>
          </Defs>

          {/* Outer Fiery Tongues */}
          <Path
            d="M 55 5 C 65 24 82 28 88 48 C 96 68 84 94 55 98 C 26 94 14 68 22 48 C 28 28 45 24 55 5 Z"
            fill="url(#flameOuter)"
          />

          {/* Mid Flame Layer */}
          <Path
            d="M 55 18 C 62 32 74 38 78 54 C 84 70 74 88 55 91 C 36 88 26 70 32 54 C 36 38 48 32 55 18 Z"
            fill="url(#flameInner)"
          />

          {/* Dark center circle inside flame */}
          <Circle cx="55" cy="62" r="23" fill="url(#coreCircleGrad)" stroke="#FBBF24" strokeWidth="1.5" />

          {/* 3 Users Group Silhouette */}
          {/* Center Leader User */}
          <Circle cx="55" cy="54" r="5" fill="#FEF08A" />
          <Path d="M 46 71 C 46 64 64 64 64 71 Z" fill="#FEF08A" />

          {/* Left User */}
          <Circle cx="44" cy="57" r="4" fill="#FDE047" opacity="0.9" />
          <Path d="M 37 72 C 37 66 51 66 51 72 Z" fill="#FDE047" opacity="0.9" />

          {/* Right User */}
          <Circle cx="66" cy="57" r="4" fill="#FDE047" opacity="0.9" />
          <Path d="M 59 72 C 59 66 73 66 73 72 Z" fill="#FDE047" opacity="0.9" />
        </Svg>
      </View>
    );
  };

  // Render Royal Purple Curved Ribbon with Golden Laurel branches
  const renderRibbonWithLaurel = () => {
    return (
      <View style={styles.ribbonContainer}>
        {/* Golden Laurel Branches flanking the ribbon */}
        <View style={styles.laurelRow}>
          {/* Left Laurel Leaves */}
          <Svg width={36} height={40} viewBox="0 0 36 40">
            <Defs>
              <SvgGradient id="goldLaurel" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FEF08A" />
                <Stop offset="60%" stopColor="#FBBF24" />
                <Stop offset="100%" stopColor="#D97706" />
              </SvgGradient>
            </Defs>
            {/* Stem */}
            <Path d="M 32 36 Q 16 24 18 4" stroke="url(#goldLaurel)" strokeWidth="2" fill="none" />
            {/* Leaves */}
            <Path d="M 32 30 Q 20 28 24 22 Q 28 25 32 30 Z" fill="url(#goldLaurel)" />
            <Path d="M 27 22 Q 14 18 20 12 Q 24 16 27 22 Z" fill="url(#goldLaurel)" />
            <Path d="M 22 14 Q 10 10 16 4 Q 20 8 22 14 Z" fill="url(#goldLaurel)" />
            <Path d="M 18 4 Q 12 0 16 0 Q 18 2 18 4 Z" fill="url(#goldLaurel)" />
          </Svg>

          {/* Center 3D Purple Ribbon */}
          <View style={styles.ribbonBodyBox}>
            <LinearGradient
              colors={['#8B5CF6', '#6D28D9', '#4C1D95']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.ribbonGradient}
            >
              <Text style={styles.ribbonStreakText}>7 kun</Text>
            </LinearGradient>
            {/* Folded ribbon tails on edges */}
            <View style={styles.ribbonTailLeft} />
            <View style={styles.ribbonTailRight} />
          </View>

          {/* Right Laurel Leaves */}
          <Svg width={36} height={40} viewBox="0 0 36 40" style={{ transform: [{ scaleX: -1 }] }}>
            <Path d="M 32 36 Q 16 24 18 4" stroke="url(#goldLaurel)" strokeWidth="2" fill="none" />
            <Path d="M 32 30 Q 20 28 24 22 Q 28 25 32 30 Z" fill="url(#goldLaurel)" />
            <Path d="M 27 22 Q 14 18 20 12 Q 24 16 27 22 Z" fill="url(#goldLaurel)" />
            <Path d="M 22 14 Q 10 10 16 4 Q 20 8 22 14 Z" fill="url(#goldLaurel)" />
            <Path d="M 18 4 Q 12 0 16 0 Q 18 2 18 4 Z" fill="url(#goldLaurel)" />
          </Svg>
        </View>

        {/* Subtitle below ribbon */}
        <Text style={styles.currentStreakSub}>Joriy Clan Streak</Text>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070514" />

      {/* 1. HEADER ROW */}
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
          <Text style={styles.headerTitle}>Clan Streak</Text>
          <Text style={styles.headerSubtitle}>Jamoaning ketma-ket faol kunlari</Text>
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
      >
        {/* 2. HERO SECTION */}
        <View style={styles.heroSection}>
          {/* Subtle background mountains */}
          <Svg width={width - 32} height={130} viewBox={`0 0 ${width - 32} 130`} style={styles.heroMountainSvg}>
            <Polygon points={`0,130 50,60 110,130`} fill="#1E133D" opacity="0.5" />
            <Polygon points={`30,130 85,45 140,130`} fill="#2B1055" opacity="0.6" />
            <Polygon points={`${width - 160},130 ${width - 100},45 ${width - 40},130`} fill="#2B1055" opacity="0.6" />
            <Polygon points={`${width - 110},130 ${width - 60},60 ${width - 10},130`} fill="#1E133D" opacity="0.5" />
          </Svg>

          {/* Left Mini Stats Card */}
          <View style={styles.heroStatCardLeft}>
            <Ionicons name="flame-outline" size={16} color="#F97316" style={{ marginBottom: 4 }} />
            <Text style={styles.heroStatLabel}>Eng uzun streak</Text>
            <Text style={styles.heroStatValueYellow}>21 kun</Text>
          </View>

          {/* Right Mini Stats Card */}
          <View style={styles.heroStatCardRight}>
            <Ionicons name="calendar-outline" size={16} color="#C084FC" style={{ marginBottom: 4 }} />
            <Text style={styles.heroStatLabel}>Joriy mavsumda</Text>
            <Text style={styles.heroStatValueWhite}>+1,500 XP</Text>
          </View>

          {/* Center Fiery Flame */}
          {renderFlameEmblem()}

          {/* Center Laurel Ribbon */}
          {renderRibbonWithLaurel()}
        </View>

        {/* 3. CARD 1: STREAK MUKOFOTLARI */}
        <View style={styles.milestonesCard}>
          <View style={styles.milestonesHeader}>
            <View style={styles.milestonesHeaderLeft}>
              <MaterialCommunityIcons name="gift-outline" size={20} color="#C084FC" style={{ marginRight: 8 }} />
              <Text style={styles.milestonesTitle}>Streak mukofotlari</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                triggerHaptic();
                Alert.alert(
                  "Keyingi mukofot",
                  "14 kunlik uzluksiz faollik uchun Clan +500 XP ga ega bo'ladi!"
                );
              }}
            >
              <Text style={styles.milestonesNextLink}>Keyingi mukofot: 14-kun ›</Text>
            </TouchableOpacity>
          </View>

          {/* Milestone timeline track & 5 nodes */}
          <View style={styles.milestonesTrackRow}>
            {/* Connecting horizontal line behind nodes */}
            <View style={styles.milestonesLineBg}>
              {/* Purple active line from start to node 2 (7 days) */}
              <View style={[styles.milestonesLineFill, { width: '38%' }]} />
            </View>

            {STREAK_MILESTONES.map((item) => {
              const isCompleted = item.status === 'completed';
              const isActive = item.status === 'active';
              const isLocked = item.status === 'locked';

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  style={styles.milestoneNodeCol}
                  onPress={() => handleMilestonePress(item)}
                >
                  {/* Top Badge (Checkmark or Lock) */}
                  <View style={styles.nodeBadgeWrap}>
                    {isCompleted && (
                      <View style={styles.greenCheckBadge}>
                        <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                      </View>
                    )}
                    {isActive && (
                      <View style={styles.greenCheckBadge}>
                        <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                      </View>
                    )}
                    {isLocked && (
                      <View style={styles.lockedBadge}>
                        <Feather name="lock" size={9} color="#94A3B8" />
                      </View>
                    )}
                  </View>

                  {/* Node Box */}
                  <View
                    style={[
                      styles.nodeBox,
                      isActive && styles.nodeBoxActive,
                      isCompleted && styles.nodeBoxCompleted,
                      isLocked && styles.nodeBoxLocked,
                    ]}
                  >
                    <Text style={[styles.nodeDayText, isActive && styles.nodeDayTextActive]}>
                      {item.dayLabel}
                    </Text>

                    {item.isSpecial ? (
                      <View style={{ alignItems: 'center', marginTop: 4 }}>
                        <FontAwesome5 name="crown" size={14} color="#FBBF24" />
                      </View>
                    ) : (
                      <View style={styles.nodeRewardPill}>
                        <Text style={styles.nodeRewardStar}>★</Text>
                        <Text style={styles.nodeRewardText}>{item.reward}</Text>
                      </View>
                    )}
                  </View>

                  {item.isSpecial && (
                    <Text style={styles.specialBadgeSub}>Maxsus nishon</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 4. CARD 2: BUGUNGI TALAB */}
        <View style={styles.requirementCard}>
          <View style={styles.requirementHeaderRow}>
            <View style={styles.reqHeaderLeft}>
              <View style={styles.reqIconWrap}>
                <MaterialCommunityIcons name="bullseye-arrow" size={20} color="#C084FC" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.reqTitle}>Bugungi talab</Text>
                <Text style={styles.reqSub}>
                  Streak'ni davom ettirish uchun bugun kamida 5 ta a'zo faol bo'lishi kerak.
                </Text>
              </View>
            </View>

            {/* Bajarildi badge */}
            <View style={styles.reqStatusBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#22C55E" style={{ marginRight: 4 }} />
              <Text style={styles.reqStatusText}>Bajarildi</Text>
            </View>
          </View>

          {/* Progress bar (8 / 5) */}
          <View style={styles.reqProgressRow}>
            <View style={styles.reqProgressBarTrack}>
              <LinearGradient
                colors={['#22C55E', '#10B981', '#34D399']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[styles.reqProgressBarFill, { width: '100%' }]}
              />
            </View>
            <Text style={styles.reqProgressValue}>8 / 5</Text>
          </View>
        </View>

        {/* 5. CARD 3: STREAK KALENDARI */}
        <View style={styles.calendarCard}>
          <View style={styles.calendarHeaderRow}>
            <View style={styles.calendarHeaderLeft}>
              <Ionicons name="calendar-outline" size={18} color="#C084FC" style={{ marginRight: 8 }} />
              <Text style={styles.calendarTitle}>Streak kalendari</Text>
            </View>

            {/* Month selector pill */}
            <View style={styles.monthPill}>
              <TouchableOpacity activeOpacity={0.7} onPress={() => triggerHaptic()}>
                <Feather name="chevron-left" size={14} color="#94A3B8" />
              </TouchableOpacity>
              <Text style={styles.monthText}>Oktabr 2026</Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => triggerHaptic()}>
                <Feather name="chevron-right" size={14} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 7 Days of Week Row */}
          <View style={styles.weekDaysRow}>
            {WEEK_DAYS.map((dayItem) => {
              const isToday = dayItem.isToday;
              return (
                <View key={dayItem.id} style={styles.dayCol}>
                  <Text style={styles.dayOfWeekText}>{dayItem.dayOfWeek}</Text>

                  <View style={[styles.dayBox, isToday && styles.dayBoxToday]}>
                    <Ionicons
                      name="flame"
                      size={isToday ? 18 : 16}
                      color="#F97316"
                      style={{ marginBottom: 2 }}
                    />
                    <Text style={[styles.dateNumText, isToday && styles.dateNumTextToday]}>
                      {dayItem.dateNum}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* 6. CARD 4: BUGUN FAOL A'ZOLAR (8) */}
        <View style={styles.activeMembersCard}>
          <View style={styles.activeMembersHeader}>
            <View style={styles.activeMembersHeaderLeft}>
              <Feather name="users" size={17} color="#C084FC" style={{ marginRight: 8 }} />
              <Text style={styles.activeMembersTitle}>Bugun faol a'zolar (8)</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                triggerHaptic();
                navigation.navigate('ClanActivityScreen');
              }}
            >
              <Text style={styles.activeMembersSeeAll}>Barchasini ko'rish ›</Text>
            </TouchableOpacity>
          </View>

          {/* Horizontal scroll of 8 member avatars */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.membersScroll}>
            {ACTIVE_MEMBERS.map((member) => (
              <TouchableOpacity
                key={member.id}
                activeOpacity={0.8}
                style={styles.memberAvatarCol}
                onPress={() => handleMemberPress(member)}
              >
                <View style={styles.avatarWrap}>
                  <Image source={member.avatar} style={styles.memberAvatarImg} contentFit="cover" />
                  {/* Green online dot */}
                  <View style={styles.onlineDot} />
                </View>
                <Text style={styles.memberName} numberOfLines={1}>
                  {member.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 7. CARD 5: BOTTOM MOTIVATIONAL BANNER */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.goalBanner}
          onPress={() => {
            triggerHaptic('medium');
            navigation.navigate('ClanMissionsScreen');
          }}
        >
          <LinearGradient
            colors={['#1E133D', '#2B125B', '#160D30']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />

          <View style={styles.goalBannerLeft}>
            <FontAwesome5 name="trophy" size={26} color="#FBBF24" style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.goalBannerTitle}>
                Streak'ni <Text style={{ color: '#FDE047' }}>davom ettiring!</Text>
              </Text>
              <Text style={styles.goalBannerSub}>
                Ketma-ket faol bo'lib, kattaroq mukofotlarga erishish!
              </Text>
            </View>
          </View>

          {/* Mountain with Golden Victory Flag on Peak */}
          <View style={styles.goalBannerArtwork}>
            <Svg width={90} height={55} viewBox="0 0 90 55">
              <Defs>
                <SvgGradient id="flagMountGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#7C3AED" />
                  <Stop offset="100%" stopColor="#311068" />
                </SvgGradient>
                <SvgGradient id="goldFlagGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#F59E0B" />
                  <Stop offset="50%" stopColor="#FDE047" />
                  <Stop offset="100%" stopColor="#D97706" />
                </SvgGradient>
              </Defs>

              {/* Mountains */}
              <Polygon points="10,55 45,18 78,55" fill="url(#flagMountGrad)" opacity="0.9" />
              <Polygon points="35,55 60,28 85,55" fill="#4C1D95" opacity="0.75" />

              {/* Flag Pole */}
              <Rect x="44" y="8" width="2" height="14" fill="#FFFFFF" rx="1" />
              {/* Golden Flag */}
              <Path d="M 46 8 L 65 11 L 46 16 Z" fill="url(#goldFlagGrad)" />
            </Svg>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* 8. INFO MODAL */}
      <Modal
        visible={infoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Clan Streak haqida</Text>
              <TouchableOpacity onPress={() => setInfoModalVisible(false)} style={styles.modalCloseBtn}>
                <Feather name="x" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 300 }}>
              <Text style={styles.modalBodyText}>
                🔥 <Text style={styles.modalBoldText}>Clan Streak nima?</Text>
                {'\n'}Bu clanning har kuni kamida 5 nafar a'zosi dars yoki mashq bajarib uzluksiz faol bo'lish ko'rsatkichidir.
                {'\n\n'}
                📈 <Text style={styles.modalBoldText}>Mukofotlar:</Text>
                {'\n'}• 3 kun: +100 Clan XP
                {'\n'}• 7 kun: +200 Clan XP
                {'\n'}• 14 kun: +500 Clan XP
                {'\n'}• 21 kun: +1,000 Clan XP
                {'\n'}• 30 kun: Maxsus Afsonaviy Streak Toji va unvoni!
                {'\n\n'}
                ⚠️ <Text style={styles.modalBoldText}>Eslatma:</Text>
                {'\n'}Agar biror kun 5 nafardan kam a'zo faol bo'lsa, jamoa streaki uzilishi mumkin.
              </Text>
            </ScrollView>

            <TouchableOpacity activeOpacity={0.8} style={styles.modalOkBtn} onPress={() => setInfoModalVisible(false)}>
              <Text style={styles.modalOkBtnText}>Tushundim</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 9. MILESTONE DETAIL MODAL */}
      <Modal
        visible={!!selectedMilestone}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedMilestone(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMilestone && (
              <>
                <View style={styles.modalHeaderRow}>
                  <Text style={styles.modalTitle}>{selectedMilestone.dayLabel}lik Streak</Text>
                  <TouchableOpacity onPress={() => setSelectedMilestone(null)} style={styles.modalCloseBtn}>
                    <Feather name="x" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalBodyText}>
                  Mukofot: <Text style={{ color: '#FBBF24', fontFamily: 'Inter_700Bold' }}>{selectedMilestone.reward}</Text>
                  {'\n\n'}
                  {selectedMilestone.status === 'completed' && "✅ Ushbu marra jamoangiz tomonidan muvaffaqiyatli zabt etilgan!"}
                  {selectedMilestone.status === 'active' && "🔥 Hozirgi yetib kelgan marrangiz! Jamoangiz bilan ketma-ket 7 kun faol bo'ldingiz."}
                  {selectedMilestone.status === 'locked' && "🔒 Ushbu marraga yetish uchun uzluksiz faollikni davom ettiring!"}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.modalOkBtn}
                  onPress={() => setSelectedMilestone(null)}
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

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },

  /* 2. Hero Section */
  heroSection: {
    alignItems: 'center',
    position: 'relative',
    marginTop: 6,
    paddingVertical: 14,
    minHeight: 185,
    justifyContent: 'center',
  },
  heroMountainSvg: {
    position: 'absolute',
    bottom: 0,
    zIndex: 0,
  },
  heroStatCardLeft: {
    position: 'absolute',
    top: 10,
    left: 4,
    backgroundColor: 'rgba(20, 16, 42, 0.75)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    minWidth: 95,
    zIndex: 2,
  },
  heroStatCardRight: {
    position: 'absolute',
    top: 10,
    right: 4,
    backgroundColor: 'rgba(20, 16, 42, 0.75)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    minWidth: 95,
    zIndex: 2,
  },
  heroStatLabel: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    marginBottom: 2,
  },
  heroStatValueYellow: {
    fontSize: 13.5,
    fontFamily: 'Inter_700Bold',
    color: '#FBBF24',
  },
  heroStatValueWhite: {
    fontSize: 13.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },

  /* Flame Emblem */
  flameContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  flameGlowCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(249, 115, 22, 0.25)',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
  },

  /* Ribbon Container */
  ribbonContainer: {
    alignItems: 'center',
    marginTop: -8,
    zIndex: 3,
  },
  laurelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ribbonBodyBox: {
    marginHorizontal: -4,
    position: 'relative',
  },
  ribbonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ribbonStreakText: {
    fontSize: 26,
    fontFamily: 'Inter_900Black',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  ribbonTailLeft: {
    position: 'absolute',
    left: -6,
    top: 10,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderTopColor: '#3B0764',
    borderLeftWidth: 6,
    borderLeftColor: 'transparent',
  },
  ribbonTailRight: {
    position: 'absolute',
    right: -6,
    top: 10,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderTopColor: '#3B0764',
    borderRightWidth: 6,
    borderRightColor: 'transparent',
  },
  currentStreakSub: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#DDD6FE',
    marginTop: 4,
  },

  /* 3. Milestones Card */
  milestonesCard: {
    backgroundColor: 'rgba(20, 16, 42, 0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    padding: 16,
    marginTop: 14,
  },
  milestonesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  milestonesHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  milestonesTitle: {
    fontSize: 14.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  milestonesNextLink: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#CBD5E1',
  },
  milestonesTrackRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 16,
    position: 'relative',
    paddingHorizontal: 2,
  },
  milestonesLineBg: {
    position: 'absolute',
    top: 8,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    zIndex: 0,
  },
  milestonesLineFill: {
    height: 2,
    backgroundColor: '#8B5CF6',
  },
  milestoneNodeCol: {
    alignItems: 'center',
    zIndex: 1,
    width: (width - 64) / 5,
  },
  nodeBadgeWrap: {
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  greenCheckBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#070514',
  },
  lockedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#070514',
  },
  nodeBox: {
    width: '92%',
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  nodeBoxCompleted: {
    borderColor: 'rgba(139, 92, 246, 0.35)',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  nodeBoxActive: {
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  nodeBoxLocked: {
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  nodeDayText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  nodeDayTextActive: {
    fontFamily: 'Inter_700Bold',
    color: '#FDE047',
  },
  nodeRewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: 'rgba(139, 92, 246, 0.25)',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1.5,
  },
  nodeRewardStar: {
    fontSize: 8,
    color: '#C084FC',
    marginRight: 2,
  },
  nodeRewardText: {
    fontSize: 8.5,
    fontFamily: 'Inter_700Bold',
    color: '#D8B4FE',
  },
  specialBadgeSub: {
    fontSize: 9,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },

  /* 4. Bugungi talab Card */
  requirementCard: {
    backgroundColor: 'rgba(20, 16, 42, 0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    padding: 16,
    marginTop: 14,
  },
  requirementHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reqHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    paddingRight: 10,
  },
  reqIconWrap: {
    marginRight: 10,
    marginTop: 2,
  },
  reqTitle: {
    fontSize: 14.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  reqSub: {
    fontSize: 11.5,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 16,
  },
  reqStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  reqStatusText: {
    fontSize: 11.5,
    fontFamily: 'Inter_700Bold',
    color: '#4ADE80',
  },
  reqProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  reqProgressBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    marginRight: 12,
  },
  reqProgressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  reqProgressValue: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#22C55E',
  },

  /* 5. Streak Kalendari Card */
  calendarCard: {
    backgroundColor: 'rgba(20, 16, 42, 0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    padding: 16,
    marginTop: 14,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarTitle: {
    fontSize: 14.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  monthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  monthText: {
    fontSize: 11.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  dayCol: {
    alignItems: 'center',
    flex: 1,
  },
  dayOfWeekText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginBottom: 6,
  },
  dayBox: {
    width: 38,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayBoxToday: {
    borderColor: '#C084FC',
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  dateNumText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  dateNumTextToday: {
    fontFamily: 'Inter_700Bold',
  },

  /* 6. Active Members Card */
  activeMembersCard: {
    backgroundColor: 'rgba(20, 16, 42, 0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    padding: 16,
    marginTop: 14,
  },
  activeMembersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeMembersHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeMembersTitle: {
    fontSize: 14.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  activeMembersSeeAll: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#A78BFA',
  },
  membersScroll: {
    gap: 12,
    paddingVertical: 4,
  },
  memberAvatarCol: {
    alignItems: 'center',
    width: 52,
  },
  avatarWrap: {
    position: 'relative',
    width: 44,
    height: 44,
  },
  memberAvatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.5)',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
    borderWidth: 1.5,
    borderColor: '#070514',
  },
  memberName: {
    fontSize: 10.5,
    fontFamily: 'Inter_500Medium',
    color: '#CBD5E1',
    marginTop: 4,
    textAlign: 'center',
  },

  /* 7. Bottom Motivational Banner */
  goalBanner: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.35)',
    padding: 16,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
  },
  goalBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    zIndex: 2,
  },
  goalBannerTitle: {
    fontSize: 14.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  goalBannerSub: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#DDD6FE',
    marginTop: 2,
    lineHeight: 15,
  },
  goalBannerArtwork: {
    zIndex: 2,
    marginLeft: 8,
  },

  /* 8. Modals */
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

