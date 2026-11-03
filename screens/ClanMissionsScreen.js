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
  Modal,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Feather,
  MaterialCommunityIcons,
  Ionicons,
} from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Feature navigation tabs (5 items horizontally)
const FEATURE_TABS = [
  { id: 'vazifalar', label: 'Vazifalar', icon: 'target', family: 'materialCommunity' },
  { id: 'progress', label: 'Progress', icon: 'bar-chart-2', family: 'feather' },
  { id: 'mukofotlar', label: 'Mukofotlar', icon: 'treasure-chest', family: 'materialCommunity' },
  { id: 'streak', label: 'Streak', icon: 'flame-outline', family: 'ionicons' },
  { id: 'reyting', label: 'Reyting', icon: 'trophy-outline', family: 'ionicons' },
];

// Daily Tasks (from screenshot)
const DAILY_TASKS = [
  {
    id: 'daily_1',
    title: '10 ta masala yechish',
    subtitle: "Har qanday bo'limdan 10 ta masalani yeching.",
    xp: 100,
    coins: 20,
    status: 'completed',
    current: 10,
    target: 10,
    icon: 'book-open',
    family: 'feather',
    iconColor: '#C084FC',
  },
  {
    id: 'daily_2',
    title: "5 ta a'zo faol bo'lsin",
    subtitle: "Bugun kamida 5 ta a'zo dars yoki mashq bajarsin.",
    xp: 200,
    coins: 40,
    status: 'in_progress',
    current: 3,
    target: 5,
    icon: 'users',
    family: 'feather',
    iconColor: '#C084FC',
  },
  {
    id: 'daily_3',
    title: '3 ta darsni yakunlash',
    subtitle: "Istalgan fan bo'yicha 3 ta darsni to'liq tugating.",
    xp: 150,
    coins: 30,
    status: 'in_progress',
    current: 2,
    target: 3,
    icon: 'target',
    family: 'materialCommunity',
    iconColor: '#C084FC',
  },
  {
    id: 'daily_4',
    title: 'Kundalik kirish (Streak)',
    subtitle: "Ilovaga bugun kirib faolligingizni davom ettiring.",
    xp: 50,
    coins: 10,
    status: 'completed',
    current: 1,
    target: 1,
    icon: 'zap',
    family: 'feather',
    iconColor: '#FBBF24',
  },
];

// Weekly Tasks
const WEEKLY_TASKS = [
  {
    id: 'weekly_1',
    title: 'Haftalik 50 ta masala',
    subtitle: "Clan bo'yicha jami 50 ta masalani muvaffaqiyatli yeching.",
    xp: 500,
    coins: 100,
    status: 'in_progress',
    current: 38,
    target: 50,
    icon: 'book-open',
    family: 'feather',
    iconColor: '#C084FC',
  },
  {
    id: 'weekly_2',
    title: "Clan sandig'ini ochish",
    subtitle: "Haftalik barcha bosqichlarni bajarib sandiqni oching.",
    xp: 1000,
    coins: 250,
    status: 'completed',
    current: 1,
    target: 1,
    icon: 'treasure-chest',
    family: 'materialCommunity',
    iconColor: '#F59E0B',
  },
  {
    id: 'weekly_3',
    title: "15 ta do'stona jang",
    subtitle: "Clan a'zolari bilan 15 ta sparring o'yin o'tkazing.",
    xp: 400,
    coins: 80,
    status: 'in_progress',
    current: 11,
    target: 15,
    icon: 'sword-cross',
    family: 'materialCommunity',
    iconColor: '#EC4899',
  },
  {
    id: 'weekly_4',
    title: "Haftalik liga top 10",
    subtitle: "Clanni haftalik global reytingda kuchli 10 talikka olib chiqing.",
    xp: 800,
    coins: 200,
    status: 'completed',
    current: 1,
    target: 1,
    icon: 'trophy',
    family: 'ionicons',
    iconColor: '#FBBF24',
  },
];

// Clan Co-op Tasks
const CLAN_TASKS = [
  {
    id: 'clan_1',
    title: "Clan XP ni 50,000 ga yetkazish",
    subtitle: "Barcha a'zolar birgalikda umumiy XP ni oshiradi.",
    xp: 2500,
    coins: 500,
    status: 'in_progress',
    current: 42500,
    target: 50000,
    icon: 'layers',
    family: 'ionicons',
    iconColor: '#38BDF8',
  },
  {
    id: 'clan_2',
    title: "10 nafar faol a'zo to'plash",
    subtitle: "Clanga 10 ta bilimdon a'zoni jalb qiling.",
    xp: 1500,
    coins: 300,
    status: 'in_progress',
    current: 8,
    target: 10,
    icon: 'account-group',
    family: 'materialCommunity',
    iconColor: '#C084FC',
  },
  {
    id: 'clan_3',
    title: "Umumiy 100 ta g'alaba",
    subtitle: "Clan a'zolarining umumiy janglardagi g'alabalari soni.",
    xp: 3000,
    coins: 750,
    status: 'completed',
    current: 100,
    target: 100,
    icon: 'crown',
    family: 'materialCommunity',
    iconColor: '#F59E0B',
  },
];

// Reusable Missions Content for both ClanHomeScreen tab and Standalone Screen
export function MissionsTabContent({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeFeatureTab, setActiveFeatureTab] = useState('vazifalar');
  const [activePeriod, setActivePeriod] = useState('Daily');
  const [tasks, setTasks] = useState(DAILY_TASKS);

  const triggerHaptic = (type = 'light') => {
    try {
      if (type === 'medium') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (e) {}
  };

  const handlePeriodChange = (period) => {
    triggerHaptic();
    setActivePeriod(period);
    if (period === 'Daily') {
      setTasks(DAILY_TASKS);
    } else if (period === 'Weekly') {
      setTasks(WEEKLY_TASKS);
    } else {
      setTasks(CLAN_TASKS);
    }
  };

  const handleFeatureTabPress = (tabId) => {
    triggerHaptic();
    setActiveFeatureTab(tabId);
    if (tabId === 'progress') {
      Alert.alert(
        "Missions Progress",
        "Bugun: 4/6 bajarildi (67%)\nHaftalik: 2/4 bajarildi (50%)\nClan: 1/3 bajarildi (33%)\n\nUmumiy to'plangan XP: +450 XP bugun!"
      );
    } else if (tabId === 'mukofotlar') {
      Alert.alert(
        "Clan Mukofotlari 🎁",
        "1. Kichik Sandiq: 500 XP + 100 Coin\n2. Oltin Sandiq: 2,500 XP + 500 Coin\n3. Afsonaviy Sandiq: Maxsus Emblem + 5,000 XP"
      );
    } else if (tabId === 'streak') {
      Alert.alert(
        "Clan Streak 🔥",
        "Sizning shaxsiy streakingiz: 7 kun!\nClan umumiy faollik streaki: 14 kun ketma-ket!"
      );
    } else if (tabId === 'reyting') {
      navigation.navigate('ClanLeaderboardScreen');
    }
  };

  const handleTaskPress = (task) => {
    triggerHaptic();
    navigation.navigate('ClanMissionDetailScreen', { task });
  };

  const renderTaskIcon = (task) => {
    if (task.family === 'materialCommunity') {
      return <MaterialCommunityIcons name={task.icon} size={20} color={task.iconColor} />;
    } else if (task.family === 'ionicons') {
      return <Ionicons name={task.icon} size={20} color={task.iconColor} />;
    }
    return <Feather name={task.icon} size={20} color={task.iconColor} />;
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 16) + 75 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. CLAN MISSIONS HERO CARD */}
      <View style={styles.heroCard}>
        <LinearGradient
          colors={['#23154E', '#130D30', '#0E0922']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Left Content */}
        <View style={styles.heroLeftCol}>
          {/* Concentric Golden Target Badge */}
          <View style={styles.heroTargetBadge}>
            <View style={styles.heroTargetOuterRing}>
              <View style={styles.heroTargetInnerRing}>
                <MaterialCommunityIcons name="bullseye-arrow" size={32} color="#FBBF24" />
              </View>
            </View>
          </View>

          <Text style={styles.heroTitle}>Clan Missions</Text>
          <Text style={styles.heroSubtitle}>
            Jamoa bo'lib vazifalarni bajaring{'\n'}va katta mukofotlar oling!
          </Text>
        </View>

        {/* Right 3D Purple Treasure Chest */}
        <View style={styles.heroChestWrap}>
          <View style={styles.chestGlowBehind} />
          <Image
            source={require('../assets/clan_chest_purple.jpg')}
            style={styles.heroChestImage}
            contentFit="contain"
          />
        </View>
      </View>

      {/* 2. HORIZONTAL FEATURE TABS (5 ITEMS) */}
      <View style={styles.featureTabsRow}>
        {FEATURE_TABS.map((tab) => {
          const isSelected = activeFeatureTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.8}
              style={[
                styles.featureTabBox,
                isSelected ? styles.featureTabBoxActive : styles.featureTabBoxInactive,
              ]}
              onPress={() => handleFeatureTabPress(tab.id)}
            >
              {isSelected && (
                <LinearGradient
                  colors={['rgba(139, 92, 246, 0.28)', 'rgba(109, 40, 217, 0.12)']}
                  style={StyleSheet.absoluteFillObject}
                />
              )}

              {tab.family === 'materialCommunity' ? (
                <MaterialCommunityIcons
                  name={tab.icon}
                  size={21}
                  color={isSelected ? '#C084FC' : '#94A3B8'}
                />
              ) : tab.family === 'ionicons' ? (
                <Ionicons
                  name={tab.icon}
                  size={21}
                  color={isSelected ? '#C084FC' : '#94A3B8'}
                />
              ) : (
                <Feather
                  name={tab.icon}
                  size={21}
                  color={isSelected ? '#C084FC' : '#94A3B8'}
                />
              )}
              <Text
                style={[
                  styles.featureTabLabel,
                  isSelected ? styles.featureTabLabelActive : styles.featureTabLabelInactive,
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 3. PERIOD FILTER TABS (Daily / Weekly / Clan) */}
      <View style={styles.periodFilterWrap}>
        {/* Daily */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.periodBtn}
          onPress={() => handlePeriodChange('Daily')}
        >
          {activePeriod === 'Daily' ? (
            <LinearGradient
              colors={['#8B5CF6', '#6D28D9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.periodActiveGradient}
            >
              <Feather name="calendar" size={14} color="#FFFFFF" />
              <Text style={styles.periodTextActive}>Daily</Text>
            </LinearGradient>
          ) : (
            <View style={styles.periodInactiveInner}>
              <Feather name="calendar" size={14} color="#94A3B8" />
              <Text style={styles.periodTextInactive}>Daily</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Weekly */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.periodBtn}
          onPress={() => handlePeriodChange('Weekly')}
        >
          {activePeriod === 'Weekly' ? (
            <LinearGradient
              colors={['#8B5CF6', '#6D28D9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.periodActiveGradient}
            >
              <Feather name="calendar" size={14} color="#FFFFFF" />
              <Text style={styles.periodTextActive}>Weekly</Text>
            </LinearGradient>
          ) : (
            <View style={styles.periodInactiveInner}>
              <Feather name="calendar" size={14} color="#94A3B8" />
              <Text style={styles.periodTextInactive}>Weekly</Text>
              <View style={styles.periodUnreadDot} />
            </View>
          )}
        </TouchableOpacity>

        {/* Clan */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.periodBtn}
          onPress={() => handlePeriodChange('Clan')}
        >
          {activePeriod === 'Clan' ? (
            <LinearGradient
              colors={['#8B5CF6', '#6D28D9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.periodActiveGradient}
            >
              <Feather name="users" size={14} color="#FFFFFF" />
              <Text style={styles.periodTextActive}>Clan</Text>
            </LinearGradient>
          ) : (
            <View style={styles.periodInactiveInner}>
              <Feather name="users" size={14} color="#94A3B8" />
              <Text style={styles.periodTextInactive}>Clan</Text>
              <View style={styles.periodUnreadDot} />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* 4. SUMMARY PROGRESS CARD */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryTopRow}>
          {/* Purple calendar-check badge */}
          <View style={styles.summaryIconBox}>
            <MaterialCommunityIcons name="calendar-check" size={24} color="#C084FC" />
          </View>

          {/* Title & Count */}
          <View style={styles.summaryTextCol}>
            <Text style={styles.summaryTitle}>
              {activePeriod === 'Daily'
                ? 'Bugungi vazifalar'
                : activePeriod === 'Weekly'
                ? 'Haftalik vazifalar'
                : 'Clan jamoaviy vazifalar'}
            </Text>
            <Text style={styles.summarySubtitle}>
              {activePeriod === 'Daily'
                ? '4 / 6 ta bajarildi'
                : activePeriod === 'Weekly'
                ? '2 / 4 ta bajarildi'
                : '1 / 3 ta bajarildi'}
            </Text>
          </View>

          {/* Remaining Time Badge */}
          <View style={styles.countdownBadge}>
            <Feather name="clock" size={13} color="#FBBF24" />
            <Text style={styles.countdownText}>
              {activePeriod === 'Daily'
                ? '12 soat 18 daqiqa'
                : activePeriod === 'Weekly'
                ? '4 kun qoldi'
                : 'Mavsum oxirigacha'}
            </Text>
          </View>
        </View>

        {/* Progress Bar & Percentage */}
        <View style={styles.summaryProgressRow}>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={['#8B5CF6', '#C084FC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.progressFill,
                {
                  width:
                    activePeriod === 'Daily'
                      ? '67%'
                      : activePeriod === 'Weekly'
                      ? '50%'
                      : '33%',
                },
              ]}
            />
          </View>
          <Text style={styles.percentageText}>
            {activePeriod === 'Daily'
              ? '67%'
              : activePeriod === 'Weekly'
              ? '50%'
              : '33%'}
          </Text>
        </View>
      </View>

      {/* 5. SECTION HEADER */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>
          {activePeriod === 'Daily'
            ? 'Bugungi vazifalar'
            : activePeriod === 'Weekly'
            ? 'Haftalik vazifalar'
            : 'Clan missiyalari'}
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            triggerHaptic();
            Alert.alert(
              "Barcha vazifalar",
              "Vazifalarni bajarib umumiy Clan sandig'i darajasini ko'taring va ko'proq mukofotlarga ega bo'ling!"
            );
          }}
        >
          <Text style={styles.sectionSeeAll}>Barchasini ko'rish ›</Text>
        </TouchableOpacity>
      </View>

      {/* 6. TASK CARDS LIST */}
      <View style={styles.tasksList}>
        {tasks.map((task) => {
          const isCompleted = task.status === 'completed';
          return (
            <TouchableOpacity
              key={task.id}
              activeOpacity={0.85}
              style={[
                styles.taskCard,
                isCompleted ? styles.taskCardCompleted : styles.taskCardInProgress,
              ]}
              onPress={() => handleTaskPress(task)}
            >
              {/* Left Circular Icon Box */}
              <View
                style={[
                  styles.taskIconBox,
                  isCompleted && styles.taskIconBoxCompleted,
                ]}
              >
                {renderTaskIcon(task)}
              </View>

              {/* Center Text Info */}
              <View style={styles.taskCenterCol}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskSubtitle} numberOfLines={2}>
                  {task.subtitle}
                </Text>

                {/* Reward Badges */}
                <View style={styles.taskRewardsRow}>
                  <View style={styles.rewardXpBadge}>
                    <MaterialCommunityIcons name="shield-star" size={12} color="#C084FC" />
                    <Text style={styles.rewardXpText}>+{task.xp} XP</Text>
                  </View>

                  <View style={styles.rewardCoinBadge}>
                    <MaterialCommunityIcons name="circle-multiple" size={12} color="#FBBF24" />
                    <Text style={styles.rewardCoinText}>+{task.coins}</Text>
                  </View>
                </View>
              </View>

              {/* Right Status or Mini Progress */}
              {isCompleted ? (
                <View style={styles.completedBadgePill}>
                  <Feather name="check" size={13} color="#FFFFFF" />
                  <Text style={styles.completedBadgeText}>Bajarildi</Text>
                </View>
              ) : (
                <View style={styles.inProgressCol}>
                  <Text style={styles.progressFraction}>
                    {task.current} / {task.target}
                  </Text>
                  <View style={styles.miniProgressTrack}>
                    <LinearGradient
                      colors={['#8B5CF6', '#C084FC']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[
                        styles.miniProgressFill,
                        {
                          width: `${Math.min(
                            100,
                            Math.round((task.current / task.target) * 100)
                          )}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

// Standalone Screen Export (matches ClanHomeScreen style 1:1)
export default function ClanMissionsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [infoModalVisible, setInfoModalVisible] = useState(false);

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
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Ambient background gradient */}
      <LinearGradient
        colors={['#170F38', '#0A081C', '#070814']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.45 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* TOP HEADER: EXACT IQROMAX CLAN BUTTON MATCHING HOME */}
        <View style={styles.headerRow}>
          <View style={styles.headerTitleCol}>
            {/* The standard IQROMAX Clan back button */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                triggerHaptic();
                navigation.navigate('StudentDashboard');
              }}
              style={styles.backBreadcrumb}
            >
              <View style={styles.backArrowBadge}>
                <Feather name="chevron-left" size={16} color="#C084FC" />
              </View>
              <Text style={styles.headerSubtitleBadge}>IQROMAX Clan</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Missions</Text>
            <Text style={styles.headerSubtitle}>Jamoaviy vazifalar va mukofotlar</Text>
          </View>

          <View style={styles.headerRightActions}>
            {/* Notification Bell */}
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.headerActionBtn}
              onPress={() => {
                triggerHaptic();
                navigation.navigate('ClanNotificationsScreen');
              }}
            >
              <Feather name="bell" size={20} color="#FFFFFF" />
              <View style={styles.headerNotifDot} />
            </TouchableOpacity>

            {/* Info Button */}
            <TouchableOpacity
              activeOpacity={0.75}
              style={[styles.headerActionBtn, { marginLeft: 10 }]}
              onPress={() => {
                triggerHaptic();
                setInfoModalVisible(true);
              }}
            >
              <Feather name="info" size={19} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* MISSIONS MAIN CONTENT */}
        <MissionsTabContent navigation={navigation} />

        {/* BOTTOM NAVIGATION BAR: VERTICAL ACTIVE PILL MATCHING HOME 1:1 */}
        <View style={[styles.bottomNavBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          {/* Tab 1: Home */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              triggerHaptic();
              navigation.navigate('ClanHomeScreen');
            }}
            style={styles.navTabItem}
          >
            <View style={styles.inactiveTabCol}>
              <Ionicons name="home-outline" size={21} color="#94A3B8" />
              <Text style={styles.inactiveTabLabel}>Home</Text>
            </View>
          </TouchableOpacity>

          {/* Tab 2: Missions (ACTIVE - VERTICAL PILL LIKE HOME) */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.navTabItem}
          >
            <LinearGradient
              colors={['rgba(168, 85, 247, 0.35)', 'rgba(99, 102, 241, 0.22)']}
              style={styles.activeTabPill}
            >
              <MaterialCommunityIcons name="target" size={20} color="#FFFFFF" />
              <Text style={styles.activeTabLabel}>Missions</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Tab 3: Season */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              triggerHaptic();
              navigation.navigate('ClanLeaderboardScreen');
            }}
            style={styles.navTabItem}
          >
            <View style={styles.inactiveTabCol}>
              <MaterialCommunityIcons name="trophy-outline" size={22} color="#94A3B8" />
              <Text style={styles.inactiveTabLabel}>Season</Text>
            </View>
          </TouchableOpacity>

          {/* Tab 4: Clan */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              triggerHaptic();
              navigation.navigate('ClanActivityScreen');
            }}
            style={styles.navTabItem}
          >
            <View style={styles.inactiveTabCol}>
              <MaterialCommunityIcons name="shield-outline" size={22} color="#94A3B8" />
              <Text style={styles.inactiveTabLabel}>Clan</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* INFO MODAL */}
        <Modal
          visible={infoModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setInfoModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={StyleSheet.absoluteFillObject}
              activeOpacity={1}
              onPress={() => setInfoModalVisible(false)}
            />
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View style={styles.modalIconWrap}>
                  <MaterialCommunityIcons name="bullseye-arrow" size={24} color="#8B5CF6" />
                </View>
                <Text style={styles.modalTitle}>Clan Missions Qoidalari</Text>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setInfoModalVisible(false)}
                >
                  <Feather name="x" size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalBodyText}>
                • <Text style={styles.boldText}>Daily vazifalar</Text> har kuni 00:00 da yangilanadi. Ularni bajarib tezkor XP va tangalar yig'asiz.{'\n\n'}
                • <Text style={styles.boldText}>Weekly vazifalar</Text> har dushanba yangilanadi va Clan sandig'ini ochish uchun kalit hisoblanadi.{'\n\n'}
                • <Text style={styles.boldText}>Clan missiyalari</Text> barcha a'zolarning birgalikdagi faolligi orqali bajariladi. Katta mukofotlar butun jamoga taqsimlanadi!
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.modalOkBtn}
                onPress={() => setInfoModalVisible(false)}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#6D28D9']}
                  style={styles.modalOkGradient}
                >
                  <Text style={styles.modalOkText}>Tushundim</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  headerTitleCol: {
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
    fontSize: 25,
    fontFamily: 'Inter_900Black',
    color: '#FFFFFF',
    letterSpacing: 0.2,
    marginTop: 2,
  },
  headerSubtitle: {
    fontSize: 12.5,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginTop: 2,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerNotifDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#C084FC',
  },

  /* Main Scroll View */
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
    borderColor: 'rgba(168, 85, 247, 0.28)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
    marginTop: 6,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  heroLeftCol: {
    flex: 1,
    paddingRight: 10,
  },
  heroTargetBadge: {
    marginBottom: 8,
  },
  heroTargetOuterRing: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTargetInnerRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 19,
    fontFamily: 'Inter_900Black',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  heroSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#DDD6FE',
    marginTop: 4,
    lineHeight: 16.5,
  },
  heroChestWrap: {
    width: 105,
    height: 95,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  chestGlowBehind: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(168, 85, 247, 0.35)',
  },
  heroChestImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },

  /* 2. Horizontal Feature Tabs (5 items) */
  featureTabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 6,
  },
  featureTabBox: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  featureTabBoxActive: {
    borderWidth: 1.5,
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.14)',
  },
  featureTabBoxInactive: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#110F24',
  },
  featureTabLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  featureTabLabelActive: {
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  featureTabLabelInactive: {
    fontFamily: 'Inter_600SemiBold',
    color: '#94A3B8',
  },

  /* 3. Period Filter Tabs Capsule */
  periodFilterWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#110F24',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 3,
    marginTop: 14,
  },
  periodBtn: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  periodActiveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 18,
    gap: 6,
  },
  periodInactiveInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 18,
    gap: 6,
    position: 'relative',
  },
  periodTextActive: {
    fontSize: 12.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  periodTextInactive: {
    fontSize: 12.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#94A3B8',
  },
  periodUnreadDot: {
    position: 'absolute',
    top: 5,
    right: 14,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8B5CF6',
  },

  /* 4. Summary Progress Card */
  summaryCard: {
    backgroundColor: '#121028',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14,
    marginTop: 14,
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  summaryTextCol: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 14.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  summarySubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginTop: 2,
  },
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 5,
    gap: 5,
  },
  countdownText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#FBBF24',
  },
  summaryProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  progressTrack: {
    flex: 1,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#1F1B38',
    overflow: 'hidden',
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3.5,
  },
  percentageText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },

  /* 5. Section Header */
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  sectionSeeAll: {
    fontSize: 12.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#C084FC',
  },

  /* 6. Tasks List */
  tasksList: {
    gap: 10,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121028',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 13,
  },
  taskCardCompleted: {
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  taskCardInProgress: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  taskIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },
  taskIconBoxCompleted: {
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  taskCenterCol: {
    flex: 1,
    paddingRight: 8,
  },
  taskTitle: {
    fontSize: 13.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  taskSubtitle: {
    fontSize: 11.5,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 15.5,
  },
  taskRewardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  rewardXpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 4,
  },
  rewardXpText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#C084FC',
  },
  rewardCoinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 4,
  },
  rewardCoinText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#FBBF24',
  },

  /* Completed Status Badge */
  completedBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    borderRadius: 14,
    paddingHorizontal: 11,
    paddingVertical: 6,
    gap: 4,
  },
  completedBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },

  /* In Progress Indicator */
  inProgressCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: 68,
  },
  progressFraction: {
    fontSize: 11.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#94A3B8',
  },
  miniProgressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1F1B38',
    overflow: 'hidden',
    marginTop: 4,
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 3,
  },

  /* 7. Bottom Navigation Bar - Identical to ClanHomeScreen */
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 22,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.5)',
  },
  activeTabLabel: {
    fontSize: 10.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  inactiveTabCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveTabLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginTop: 3,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#12102B',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  modalTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBodyText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#CBD5E1',
    lineHeight: 19,
  },
  boldText: {
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  modalOkBtn: {
    marginTop: 18,
    borderRadius: 14,
    overflow: 'hidden',
  },
  modalOkGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOkText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
});
