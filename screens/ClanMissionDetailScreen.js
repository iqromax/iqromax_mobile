import React from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import {
  Feather,
  MaterialCommunityIcons,
  Ionicons,
} from '@expo/vector-icons';
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Polygon,
} from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { getClanTranslations } from '../src/utils/clanTranslations';

const { width } = Dimensions.get('window');

export default function ClanMissionDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const language = route?.params?.language || 'uz';
  const t = getClanTranslations(language);

  // Task data passed via navigation or fallback default matching mockup 1:1
  const task = route.params?.task || {
    id: 'daily_1',
    title: '10 ta masala yechish',
    subtitle: "Bugun ixtiyoriy bo'limdan 10 ta masalani yeching\nva vazifani bajaring.",
    missionType: 'Daily Mission',
    category: "O'qish va mashq",
    type: 'Individual',
    deadline: 'Bugun, 23:59 gacha',
    repeat: 'Har kuni',
    xp: 100,
    coins: 20,
    current: 7,
    target: 10,
    status: 'in_progress',
    icon: 'book-open',
    family: 'feather',
    actionText: "Masalalarni yechishga o'tish",
    actionScreen: 'TeacherCourseLessonsScreen',
    checklist: [
      { text: "Ixtiyoriy bo'limni tanlang", done: true },
      { text: "Kamida 10 ta masalani yeching", done: true },
      { text: "Progress 10 / 10 ga yetishi kerak", done: false },
    ],
  };

  const triggerHaptic = (type = 'light') => {
    try {
      if (type === 'medium') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (e) {}
  };

  const handleActionButton = () => {
    triggerHaptic('medium');
    if (task.actionScreen && task.actionScreen !== 'ClanActivityScreen') {
      navigation.navigate(task.actionScreen);
    } else {
      Alert.alert(
        "Vazifaga o'tish",
        `"${task.title}" vazifasi bo'yicha masalalarni yechish bo'limiga yo'naltirilmoqda.`,
        [
          { text: "Bekor qilish", style: "cancel" },
          {
            text: "Boshlash",
            onPress: () => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              }
            },
          },
        ]
      );
    }
  };

  // Ensure checklist exists
  const checklist = task.checklist || [
    { text: "Ixtiyoriy bo'limni tanlang", done: true },
    { text: `Kamida ${task.target || 10} ta topshiriqni bajaring`, done: task.current >= task.target },
    { text: `Progress ${task.target || 10} / ${task.target || 10} ga yetishi kerak`, done: task.current >= task.target },
  ];

  const progressPercent = Math.min(100, Math.round(((task.current || 7) / (task.target || 10)) * 100));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Ambient Deep Dark Space Background Gradient */}
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
            <Text style={styles.headerTitle}>{t.tabMissions || 'Vazifa tafsilotlari'}</Text>
            <Text style={styles.headerSubtitle}>Vazifa haqida batafsil ma'lumot</Text>
          </View>
        </View>

        {/* SCROLLABLE CONTENT */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 16) + 85 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. HERO EMBLEM WITH MOUNTAIN SILHOUETTE & NEON AURA */}
          <View style={styles.heroContainer}>
            {/* Mountain Backdrop Silhouette */}
            <Svg width={width} height={155} viewBox="0 0 400 155" style={styles.mountainSvg}>
              {/* Back Mountains Layer */}
              <Path
                d="M-20 155 L35 75 L95 125 L165 55 L235 120 L305 65 L375 115 L430 70 L460 155 Z"
                fill="#24144E"
                opacity={0.45}
              />
              {/* Mid Layer Mountain Peaks */}
              <Path
                d="M-30 155 L50 95 L115 135 L180 75 L255 130 L330 85 L410 140 L450 155 Z"
                fill="#180E38"
                opacity={0.75}
              />
              {/* Foreground Dark Mountain Horizon */}
              <Path
                d="M-20 155 L70 120 L140 142 L210 105 L285 138 L360 115 L430 155 Z"
                fill="#0F0924"
                opacity={0.95}
              />
            </Svg>

            {/* Glowing Nebula Aura */}
            <View style={styles.auraGlow} />

            {/* 3D Hexagonal Badge Container */}
            <View style={styles.hexagonWrapper}>
              <Svg width={115} height={115} viewBox="0 0 100 100">
                <Defs>
                  <SvgGradient id="hexBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#E9D5FF" />
                    <Stop offset="40%" stopColor="#A855F7" />
                    <Stop offset="100%" stopColor="#4F46E5" />
                  </SvgGradient>
                  <SvgGradient id="hexBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor="#2A1658" />
                    <Stop offset="100%" stopColor="#120A2B" />
                  </SvgGradient>
                  <SvgGradient id="innerGlow" x1="50%" y1="0%" x2="50%" y2="100%">
                    <Stop offset="0%" stopColor="rgba(216, 180, 254, 0.4)" />
                    <Stop offset="100%" stopColor="rgba(147, 51, 234, 0.05)" />
                  </SvgGradient>
                </Defs>

                {/* Outer 3D Hexagon with beveled gradient stroke */}
                <Polygon
                  points="50,4 93,27 93,73 50,96 7,73 7,27"
                  fill="url(#hexBgGrad)"
                  stroke="url(#hexBorderGrad)"
                  strokeWidth="3.5"
                />

                {/* Inner Hexagon Layer */}
                <Polygon
                  points="50,11 86,30 86,70 50,89 14,70 14,30"
                  fill="url(#innerGlow)"
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="1.2"
                />
              </Svg>

              {/* Central Glowing Open Book Icon */}
              <View style={styles.emblemIconCenter}>
                <MaterialCommunityIcons name="book-open-page-variant" size={44} color="#EDE9FE" />
              </View>
            </View>

            {/* Daily Mission Pill Badge */}
            <View style={styles.missionTypePill}>
              <Feather name="calendar" size={13} color="#C084FC" />
              <Text style={styles.missionTypePillText}>{task.missionType || 'Daily Mission'}</Text>
            </View>

            {/* Mission Title */}
            <Text style={styles.missionTitleText}>{task.title}</Text>

            {/* Mission Description */}
            <Text style={styles.missionDescText}>
              {task.subtitle || "Bugun ixtiyoriy bo'limdan 10 ta masalani yeching va vazifani bajaring."}
            </Text>
          </View>

          {/* 2. REWARD BAR CARD */}
          <View style={styles.rewardCard}>
            <View style={styles.rewardLeftGroup}>
              <Feather name="gift" size={18} color="#C084FC" />
              <Text style={styles.rewardLabelText}>Mukofot</Text>
            </View>

            <View style={styles.rewardDivider} />

            {/* +XP Badge */}
            <View style={styles.rewardXpBadge}>
              <MaterialCommunityIcons name="shield-star" size={15} color="#C084FC" />
              <Text style={styles.rewardXpText}>+{task.xp || 100} XP</Text>
            </View>

            {/* +Coin Badge */}
            <View style={styles.rewardCoinBadge}>
              <MaterialCommunityIcons name="circle-multiple" size={15} color="#FBBF24" />
              <Text style={styles.rewardCoinText}>+{task.coins || 20} Coin</Text>
            </View>
          </View>

          {/* 3. USER PROGRESS CARD */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeaderRow}>
              <View style={styles.progressLabelWrap}>
                <Feather name="user" size={17} color="#C084FC" />
                <Text style={styles.progressLabelText}>Sizning progressingiz</Text>
              </View>
              <Text style={styles.progressCountText}>
                {task.current ?? 7} / {task.target ?? 10}
              </Text>
            </View>

            <View style={styles.progressBarTrack}>
              <LinearGradient
                colors={['#8B5CF6', '#C084FC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
              />
            </View>
          </View>

          {/* 4. 2x2 GRID METADATA CARDS */}
          <View style={styles.gridContainer}>
            {/* Row 1 */}
            <View style={styles.gridRow}>
              {/* Card 1: Vazifa turi */}
              <View style={styles.metaCard}>
                <View style={styles.metaIconBox}>
                  <MaterialCommunityIcons name="target" size={20} color="#C084FC" />
                </View>
                <View style={styles.metaTextCol}>
                  <Text style={styles.metaLabelText}>Vazifa turi</Text>
                  <Text style={styles.metaValueText}>{task.type || 'Individual'}</Text>
                </View>
              </View>

              {/* Card 2: Kategoriya */}
              <View style={styles.metaCard}>
                <View style={styles.metaIconBox}>
                  <Feather name="users" size={18} color="#C084FC" />
                </View>
                <View style={styles.metaTextCol}>
                  <Text style={styles.metaLabelText}>Kategoriya</Text>
                  <Text style={styles.metaValueText}>{task.category || "O'qish va mashq"}</Text>
                </View>
              </View>
            </View>

            {/* Row 2 */}
            <View style={styles.gridRow}>
              {/* Card 3: Muddati */}
              <View style={styles.metaCard}>
                <View style={styles.metaIconBox}>
                  <MaterialCommunityIcons name="calendar-month-outline" size={20} color="#C084FC" />
                </View>
                <View style={styles.metaTextCol}>
                  <Text style={styles.metaLabelText}>Muddati</Text>
                  <Text style={styles.metaValueText}>
                    Bugun, <Text style={styles.metaValueHighlight}>23:59 gacha</Text>
                  </Text>
                </View>
              </View>

              {/* Card 4: Takrorlanish */}
              <View style={styles.metaCard}>
                <View style={styles.metaIconBox}>
                  <Feather name="repeat" size={18} color="#C084FC" />
                </View>
                <View style={styles.metaTextCol}>
                  <Text style={styles.metaLabelText}>Takrorlanish</Text>
                  <Text style={styles.metaValueText}>{task.repeat || 'Har kuni'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 5. REQUIREMENTS CHECKLIST CARD */}
          <View style={styles.checklistCard}>
            <View style={styles.checklistHeaderRow}>
              <MaterialCommunityIcons name="clipboard-text-outline" size={20} color="#C084FC" />
              <Text style={styles.checklistHeaderTitle}>Bajarish shartlari</Text>
            </View>

            <View style={styles.checklistTable}>
              {checklist.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.checklistItemRow,
                    index === checklist.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  {item.done ? (
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  ) : (
                    <Ionicons name="ellipse-outline" size={20} color="#64748B" />
                  )}
                  <Text
                    style={[
                      styles.checklistText,
                      !item.done && styles.checklistTextPending,
                    ]}
                  >
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* 6. BOTTOM FLOATING ACTION BUTTON */}
        <View style={[styles.bottomActionWrap, { paddingBottom: Math.max(insets.bottom, 14) }]}>
          <TouchableOpacity
            activeOpacity={0.88}
            style={styles.actionBtnTouch}
            onPress={handleActionButton}
          >
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionBtnGradient}
            >
              <Ionicons name="play" size={18} color="#FFFFFF" style={styles.actionPlayIcon} />
              <Text style={styles.actionBtnText}>
                {task.actionText || "Masalalarni yechishga o'tish"}
              </Text>
              <Feather name="chevron-right" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
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

  /* Header */
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

  /* Scroll Area */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
  },

  /* 1. Hero Container */
  heroContainer: {
    alignItems: 'center',
    position: 'relative',
    marginTop: 4,
    marginBottom: 16,
  },
  mountainSvg: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    zIndex: 0,
  },
  auraGlow: {
    position: 'absolute',
    top: 15,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(168, 85, 247, 0.4)',
    filter: 'blur(30px)',
  },
  hexagonWrapper: {
    width: 115,
    height: 115,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
    marginTop: 10,
    marginBottom: 14,
  },
  emblemIconCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  missionTypePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.4)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 6,
    marginBottom: 10,
  },
  missionTypePillText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#DDD6FE',
  },
  missionTitleText: {
    fontSize: 23,
    fontFamily: 'Inter_900Black',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  missionDescText: {
    fontSize: 12.5,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 14,
  },

  /* 2. Reward Bar Card */
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#110F27',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  rewardLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rewardLabelText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#E2E8F0',
  },
  rewardDivider: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 12,
  },
  rewardXpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.18)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
    marginRight: 8,
  },
  rewardXpText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#C084FC',
  },
  rewardCoinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  rewardCoinText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#FBBF24',
  },

  /* 3. User Progress Card */
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
    marginBottom: 12,
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
  progressCountText: {
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

  /* 4. 2x2 Grid Metadata Cards */
  gridContainer: {
    gap: 10,
    marginBottom: 12,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metaCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#110F27',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 10,
  },
  metaIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaTextCol: {
    flex: 1,
  },
  metaLabelText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
  },
  metaValueText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  metaValueHighlight: {
    color: '#C084FC',
  },

  /* 5. Requirements Checklist Card */
  checklistCard: {
    backgroundColor: '#110F27',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  checklistHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  checklistHeaderTitle: {
    fontSize: 14.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  checklistTable: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    overflow: 'hidden',
  },
  checklistItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  checklistText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#FFFFFF',
    flex: 1,
  },
  checklistTextPending: {
    color: '#94A3B8',
  },

  /* 6. Bottom Floating Action Button */
  bottomActionWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: '#070814',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  actionBtnTouch: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  actionBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 18,
    gap: 8,
  },
  actionPlayIcon: {
    marginRight: 2,
  },
  actionBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
});

