import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Modal, TextInput, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { API_URL } from '../src/config/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MOCK_CHILDREN = [
  {
    id: 'c1',
    customId: '#956Z6X',
    name: 'Abdulloh Karimov',
    level: 12,
    xp: 4580,
    streak: 7,
    dailyActivity: 82,
    todayExercises: '18 / 20',
    todayAccuracy: '87%',
    todayTime: '42 daqiqa',
    goalPercent: 75,
    goalProgress: '15 / 20 mashq bajarildi',
    goalRemaining: 'Yana 5 ta mashq qoldi',
    weeklyData: [
      { day: 'Dush', xp: 520, exercises: 14, time: 35 },
      { day: 'Sesh', xp: 680, exercises: 18, time: 42 },
      { day: 'Chor', xp: 450, exercises: 12, time: 30 },
      { day: 'Pay', xp: 720, exercises: 19, time: 45 },
      { day: 'Jum', xp: 810, exercises: 22, time: 50 },
      { day: 'Shan', xp: 600, exercises: 15, time: 38 },
      { day: 'Yak', xp: 800, exercises: 20, time: 48 },
    ],
    achievements: [
      { id: 'a1', title: '7 kunlik seriya', icon: 'fire', color: '#EF4444', unlocked: true },
      { id: 'a2', title: "100 ta to'g'ri javob", icon: 'target', color: '#10B981', unlocked: true },
      { id: 'a3', title: "500 XP to'plandi", icon: 'lightning-bolt', color: '#F59E0B', unlocked: true },
      { id: 'a4', title: 'Gold daraja', icon: 'crown', color: '#EAB308', unlocked: true },
      { id: 'a5', title: "10 ta Battle g'alabasi", icon: 'sword-cross', color: '#3B82F6', unlocked: true },
      { id: 'a6', title: '30 kunlik streak', icon: 'fire', color: '#9CA3AF', unlocked: false },
      { id: 'a7', title: '5 000 XP', icon: 'lightning-bolt', color: '#9CA3AF', unlocked: false },
      { id: 'a8', title: '100 ta Battle', icon: 'sword-cross', color: '#9CA3AF', unlocked: false }
    ],
    subjectStats: [
      { name: 'Matematika', score: 84, color: '#3B82F6' },
      { name: 'Fizika', score: 76, color: '#EAB308' },
      { name: 'Ingliz tili', score: 91, color: '#10B981' },
      { name: 'Mantiq', score: 95, color: '#A855F7' }
    ],
    detailedStats: {
      todayTime: '42 min',
      weekTime: '4 soat 12 min',
      monthTime: '17 soat 45 min',
      totalEx: 428,
      correctEx: 382,
      wrongEx: 46,
      accuracy: '89.3%',
      progressHistory: ['75%', '79%', '82%', '86%', '89%']
    }
  },
  {
    id: 'c2',
    customId: '#VFWZ24',
    name: 'Muhammad Ali',
    level: 15,
    xp: 6840,
    streak: 12,
    dailyActivity: 94,
    todayExercises: '20 / 20',
    todayAccuracy: '95%',
    todayTime: '55 daqiqa',
    goalPercent: 100,
    goalProgress: '20 / 20 mashq bajarildi',
    goalRemaining: 'Bugungi maqsad yakunlandi! 🎉',
    weeklyData: [
      { day: 'Dush', xp: 700, exercises: 18, time: 45 },
      { day: 'Sesh', xp: 850, exercises: 22, time: 55 },
      { day: 'Chor', xp: 900, exercises: 25, time: 60 },
      { day: 'Pay', xp: 950, exercises: 24, time: 58 },
      { day: 'Jum', xp: 880, exercises: 20, time: 50 },
      { day: 'Shan', xp: 920, exercises: 23, time: 56 },
      { day: 'Yak', xp: 940, exercises: 24, time: 58 },
    ],
    achievements: [
      { id: 'a1', title: '12 kunlik seriya', icon: 'fire', color: '#EF4444', unlocked: true },
      { id: 'a2', title: "500 ta to'g'ri javob", icon: 'target', color: '#10B981', unlocked: true },
      { id: 'a3', title: "5000 XP to'plandi", icon: 'lightning-bolt', color: '#F59E0B', unlocked: true }
    ],
    subjectStats: [
      { name: 'Matematika', score: 96, color: '#3B82F6' },
      { name: 'Fizika', score: 88, color: '#EAB308' },
      { name: 'Ingliz tili', score: 94, color: '#10B981' },
      { name: 'Mantiq', score: 98, color: '#A855F7' }
    ],
    detailedStats: {
      todayTime: '55 min',
      weekTime: '6 soat 10 min',
      monthTime: '24 soat 15 min',
      totalEx: 620,
      correctEx: 585,
      wrongEx: 35,
      accuracy: '94.3%',
      progressHistory: ['82%', '85%', '89%', '92%', '95%']
    }
  }
];

export default function ParentDashboardScreen({ navigation, route }) {
  const { user, language = 'uz' } = route.params || {};

  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'ranking' | 'child' | 'profile'
  const [childrenList, setChildrenList] = useState(MOCK_CHILDREN);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [weeklyMetric, setWeeklyMetric] = useState('xp'); // 'xp' | 'exercises' | 'time'
  const [rankingFilter, setRankingFilter] = useState('global'); // 'global' | 'country' | 'school' | 'class'
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isDetailedStatsOpen, setIsDetailedStatsOpen] = useState(false);
  
  // Add Child Modal State
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const [childIdInput, setChildIdInput] = useState('');
  const [addChildFeedback, setAddChildFeedback] = useState({ visible: false, title: '', message: '', type: 'success' });

  const activeChild = childrenList[selectedChildIndex] || childrenList[0];

  // Fetch Leaderboard for Ranking tab
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${API_URL}/ranking?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const formatted = data.map((u, index) => ({
              rank: index + 1,
              name: u.name || "O'quvchi",
              xp: u.xp || 0,
              customId: u.id || u.customId
            }));
            setLeaderboardData(formatted);
          }
        }
      } catch (e) {
        console.error('Fetch ranking error:', e);
      }
    };
    fetchLeaderboard();
  }, []);

  const handleReturnToHome = async () => {
    try {
      await AsyncStorage.removeItem('user_data');
    } catch (e) {}
    navigation.reset({
      index: 0,
      routes: [{ name: 'StepOne', params: { language } }]
    });
  };

  const handleAddChildSubmit = async () => {
    if (!childIdInput.trim()) {
      setAddChildFeedback({ visible: true, title: 'Diqqat', message: 'Iltimos, farzandingizning IQROMAX ID raqamini kiriting!', type: 'error' });
      return;
    }

    const cleanId = childIdInput.trim().toUpperCase();
    const searchId = cleanId.startsWith('#') ? cleanId : '#' + cleanId;

    try {
      const res = await fetch(`${API_URL}/users/search/${encodeURIComponent(searchId)}`);
      if (res.ok) {
        const data = await res.json();
        const newChild = {
          id: data.uuid || 'c_' + Date.now(),
          customId: data.id || searchId,
          name: data.name || 'Farzand',
          level: data.level || 5,
          xp: data.xp || 1200,
          streak: 3,
          dailyActivity: 75,
          todayExercises: '10 / 15',
          todayAccuracy: '85%',
          todayTime: '25 daqiqa',
          goalPercent: 65,
          goalProgress: '10 / 15 mashq bajarildi',
          goalRemaining: 'Yana 5 ta mashq qoldi',
          weeklyData: [
            { day: 'Dush', xp: 300, exercises: 8, time: 20 },
            { day: 'Sesh', xp: 400, exercises: 10, time: 25 },
            { day: 'Chor', xp: 350, exercises: 9, time: 22 },
            { day: 'Pay', xp: 450, exercises: 12, time: 28 },
            { day: 'Jum', xp: 500, exercises: 14, time: 30 },
            { day: 'Shan', xp: 480, exercises: 11, time: 26 },
            { day: 'Yak', xp: 520, exercises: 13, time: 29 },
          ],
          achievements: [
            { id: 'a1', title: '3 kunlik seriya', icon: 'fire', color: '#EF4444', unlocked: true },
            { id: 'a2', title: '50 ta to\'g\'ri javob', icon: 'target', color: '#10B981', unlocked: true }
          ],
          subjectStats: [
            { name: 'Matematika', score: 80, color: '#3B82F6' },
            { name: 'Mantiq', score: 88, color: '#A855F7' }
          ],
          detailedStats: {
            todayTime: '25 min',
            weekTime: '3 soat 10 min',
            monthTime: '12 soat 30 min',
            totalEx: 210,
            correctEx: 180,
            wrongEx: 30,
            accuracy: '85.7%',
            progressHistory: ['70%', '75%', '78%', '82%', '85%']
          }
        };

        setChildrenList(prev => [...prev, newChild]);
        setIsAddChildModalOpen(false);
        setChildIdInput('');
        setAddChildFeedback({
          visible: true,
          title: 'Muvaffaqiyatli! 🎉',
          message: `${data.name} muvaffaqiyatli ulindi va Farzandlarim ro'yxatiga qo'shildi!`,
          type: 'success'
        });
      } else {
        setAddChildFeedback({
          visible: true,
          title: 'Topilmadi',
          message: 'Ushbu ID raqamli o\'quvchi topilmadi. Qayta tekshirib kiriting.',
          type: 'error'
        });
      }
    } catch (e) {
      setAddChildFeedback({
        visible: true,
        title: 'Xatolik',
        message: 'Tarmoqqa ulanib bo\'lmadi. Internetni tekshiring.',
        type: 'error'
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05050C" />

      {/* TOP HEADER BAR */}
      <LinearGradient colors={['#1F1035', '#090914']} style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarBox}>
            <LinearGradient colors={['#A855F7', '#7C3AED']} style={styles.avatarGradient}>
              <MaterialCommunityIcons name="account-child-circle" size={26} color="#FFFFFF" />
            </LinearGradient>
          </View>
          <View>
            <Text style={styles.roleBadgeText}>OTA-ONA TIZIMI</Text>
            <Text style={styles.userName}>{user?.name || "Ergashboy Masharipov"}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8} onPress={handleReturnToHome}>
          <Feather name="log-out" size={18} color="#F87171" />
        </TouchableOpacity>
      </LinearGradient>

      {/* TAB CONTENT VIEWS */}
      <View style={{ flex: 1 }}>
        {/* 1. 🏠 BOSH SAHIFA */}
        {activeTab === 'home' && (
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* GREETING */}
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.greetingTitle}>Assalomu alaykum! 👋</Text>
              <Text style={styles.greetingSub}>Farzandingizning bugungi natijalari bilan tanishing.</Text>
            </View>

            {/* FARZAND QUICK CARD */}
            <View style={styles.childCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={styles.childAvatarBox}>
                    <Text style={{ color: '#FFF', fontSize: 20, fontFamily: 'Inter_700Bold' }}>{activeChild.name.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={{ color: '#FFFFFF', fontSize: 17, fontFamily: 'Inter_700Bold' }}>{activeChild.name}</Text>
                    <Text style={{ color: '#9CA3AF', fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 2 }}>
                      Level {activeChild.level} · ⭐ {activeChild.xp.toLocaleString()} XP
                    </Text>
                  </View>
                </View>

                <View style={styles.streakBadge}>
                  <MaterialCommunityIcons name="fire" size={16} color="#EF4444" />
                  <Text style={styles.streakText}>{activeChild.streak} kun</Text>
                </View>
              </View>

              <View style={styles.activityProgressBox}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ color: '#D1D5DB', fontSize: 12, fontFamily: 'Inter_600SemiBold' }}>Bugungi faollik</Text>
                  <Text style={{ color: '#10B981', fontSize: 12, fontFamily: 'Inter_700Bold' }}>{activeChild.dailyActivity}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${activeChild.dailyActivity}%`, backgroundColor: '#10B981' }]} />
                </View>
              </View>
            </View>

            {/* 📊 BUGUNGI NATIJA (3 KATTA KO'RSATKICH) */}
            <Text style={styles.sectionTitle}>📊 Bugungi natija</Text>
            <View style={styles.threeStatsRow}>
              <View style={styles.statBox}>
                <MaterialCommunityIcons name="target" size={24} color="#3B82F6" />
                <Text style={styles.statBoxNum}>{activeChild.todayExercises}</Text>
                <Text style={styles.statBoxLabel}>🎯 Mashqlar</Text>
              </View>

              <View style={styles.statBox}>
                <MaterialCommunityIcons name="flash-outline" size={24} color="#10B981" />
                <Text style={styles.statBoxNum}>{activeChild.todayAccuracy}</Text>
                <Text style={styles.statBoxLabel}>⚡ To'g'ri javob</Text>
              </View>

              <View style={styles.statBox}>
                <MaterialCommunityIcons name="clock-outline" size={24} color="#A855F7" />
                <Text style={styles.statBoxNum}>{activeChild.todayTime}</Text>
                <Text style={styles.statBoxLabel}>⏱️ O'qish vaqti</Text>
              </View>
            </View>

            {/* 📈 HAFATALIK PROGRESS GRAFIK */}
            <View style={styles.cardBox}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <Text style={styles.cardTitle}>📈 Haftalik progress</Text>
                <View style={{ flexDirection: 'row', gap: 4, backgroundColor: '#0A0A16', padding: 3, borderRadius: 10, borderWidth: 1, borderColor: '#1A1A35' }}>
                  <TouchableOpacity
                    style={[styles.metricFilterBtn, weeklyMetric === 'xp' && styles.metricFilterBtnActive]}
                    onPress={() => setWeeklyMetric('xp')}
                  >
                    <Text style={[styles.metricFilterText, weeklyMetric === 'xp' && styles.metricFilterTextActive]}>XP</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.metricFilterBtn, weeklyMetric === 'exercises' && styles.metricFilterBtnActive]}
                    onPress={() => setWeeklyMetric('exercises')}
                  >
                    <Text style={[styles.metricFilterText, weeklyMetric === 'exercises' && styles.metricFilterTextActive]}>Mashq</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.metricFilterBtn, weeklyMetric === 'time' && styles.metricFilterBtnActive]}
                    onPress={() => setWeeklyMetric('time')}
                  >
                    <Text style={[styles.metricFilterText, weeklyMetric === 'time' && styles.metricFilterTextActive]}>Vaqt</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* BAR CHART */}
              <View style={styles.chartRow}>
                {activeChild.weeklyData.map((item, idx) => {
                  const val = weeklyMetric === 'xp' ? item.xp : (weeklyMetric === 'exercises' ? item.exercises : item.time);
                  const maxVal = weeklyMetric === 'xp' ? 1000 : (weeklyMetric === 'exercises' ? 30 : 60);
                  const barHeight = Math.min(100, Math.max(15, (val / maxVal) * 90));

                  return (
                    <View key={idx} style={styles.chartCol}>
                      <Text style={styles.chartValText}>{val}</Text>
                      <View style={styles.chartBarBg}>
                        <LinearGradient
                          colors={['#A855F7', '#6D28D9']}
                          style={[styles.chartBarFill, { height: `${barHeight}%` }]}
                        />
                      </View>
                      <Text style={styles.chartDayText}>{item.day}</Text>
                    </View>
                  );
                })}
              </View>

              <View style={styles.insightBox}>
                <Feather name="trending-up" size={16} color="#10B981" style={{ marginRight: 8 }} />
                <Text style={styles.insightText}>
                  Farzandingiz o'tgan haftaga nisbatan <Text style={{ color: '#10B981', fontWeight: 'bold' }}>+18% rivojlanmoqda!</Text>
                </Text>
              </View>
            </View>

            {/* 🎯 BUGUNGI MAQSAD */}
            <View style={styles.cardBox}>
              <Text style={styles.cardTitle}>🎯 Bugungi maqsad</Text>
              <View style={{ marginTop: 10 }}>
                <View style={styles.progressBarBgLarge}>
                  <View style={[styles.progressBarFill, { width: `${activeChild.goalPercent}%`, backgroundColor: '#A855F7' }]} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 13, fontFamily: 'Inter_700Bold' }}>{activeChild.goalProgress}</Text>
                  <Text style={{ color: '#A855F7', fontSize: 13, fontFamily: 'Inter_700Bold' }}>{activeChild.goalPercent}%</Text>
                </View>
                <Text style={{ color: '#9CA3AF', fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 4 }}>{activeChild.goalRemaining}</Text>
              </View>
            </View>

            {/* 🏆 SO'NGGI YUTUQLAR */}
            <View style={[styles.cardBox, { marginBottom: 100 }]}>
              <Text style={styles.cardTitle}>🏆 So'nggi yutuqlar</Text>
              <View style={{ gap: 10, marginTop: 10 }}>
                {activeChild.achievements.filter(a => a.unlocked).slice(0, 3).map((ach) => (
                  <View key={ach.id} style={styles.achieveItem}>
                    <View style={[styles.achieveIconBox, { backgroundColor: `${ach.color}20`, borderColor: ach.color }]}>
                      <MaterialCommunityIcons name={ach.icon} size={20} color={ach.color} />
                    </View>
                    <Text style={styles.achieveTitle}>{ach.title}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        )}

        {/* 2. 🏆 REYTING SAHIFA */}
        {activeTab === 'ranking' && (
          <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16 }}>
            <Text style={styles.sectionTitle}>🏆 Reyting (Leaderboard)</Text>

            {/* FILTERS */}
            <View style={styles.filterChipsRow}>
              {[
                { id: 'global', label: '🌍 Global' },
                { id: 'country', label: '🇺🇿 Mamlakat' },
                { id: 'school', label: '🏫 Maktab' },
                { id: 'class', label: '👥 Sinf' }
              ].map((f) => (
                <TouchableOpacity
                  key={f.id}
                  style={[styles.filterChip, rankingFilter === f.id && styles.filterChipActive]}
                  onPress={() => setRankingFilter(f.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterChipText, rankingFilter === f.id && styles.filterChipTextActive]}>{f.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* SIZNING FARZANDINGIZ CARD */}
            <View style={styles.myChildRankCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#A855F7', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#FFF', fontSize: 18, fontFamily: 'Inter_700Bold' }}>🏆</Text>
                </View>
                <View>
                  <Text style={{ color: '#9CA3AF', fontSize: 11, fontFamily: 'Inter_600SemiBold' }}>SIZNING FARZANDINGIZ</Text>
                  <Text style={{ color: '#FFFFFF', fontSize: 16, fontFamily: 'Inter_700Bold' }}>{activeChild.name}</Text>
                </View>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: '#F59E0B', fontSize: 18, fontFamily: 'Inter_900Black' }}>#24</Text>
                <Text style={{ color: '#10B981', fontSize: 11, fontFamily: 'Inter_700Bold' }}>Top 8%</Text>
              </View>
            </View>

            {/* GLOBAL REYTING RO'YXATI */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
              {leaderboardData.length === 0 ? (
                <View style={styles.cardBox}>
                  <Text style={{ color: '#9CA3AF', textAlign: 'center' }}>Reyting ma'lumotlari yuklanmoqda...</Text>
                </View>
              ) : (
                leaderboardData.map((item) => (
                  <View key={item.customId} style={styles.rankRow}>
                    <Text style={[
                      styles.rankNum,
                      item.rank === 1 && { color: '#F59E0B' },
                      item.rank === 2 && { color: '#9CA3AF' },
                      item.rank === 3 && { color: '#B45309' },
                    ]}>
                      {item.rank === 1 ? '🥇 1' : item.rank === 2 ? '🥈 2' : item.rank === 3 ? '🥉 3' : `#${item.rank}`}
                    </Text>
                    <View style={styles.rankAvatarBox}>
                      <Text style={{ color: '#FFF', fontFamily: 'Inter_700Bold' }}>{item.name.charAt(0)}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.rankName}>{item.name}</Text>
                    </View>
                    <Text style={styles.rankXp}>{item.xp.toLocaleString()} XP</Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        )}

        {/* 3. 👦 FARZANDIM SAHIFA */}
        {activeTab === 'child' && (
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* FARZANDLAR TANLASH TABS */}
            <Text style={styles.sectionTitle}>Farzandlarim</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, marginBottom: 16 }}>
              {childrenList.map((ch, idx) => (
                <TouchableOpacity
                  key={ch.id}
                  style={[styles.childSelectTab, selectedChildIndex === idx && styles.childSelectTabActive]}
                  onPress={() => setSelectedChildIndex(idx)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.childSelectTabText, selectedChildIndex === idx && styles.childSelectTabTextActive]}>
                    [ {ch.name.split(' ')[0]} ]
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* FARZAND PROFIL KARTASI */}
            <View style={styles.childProfileCard}>
              <View style={styles.childProfileAvatar}>
                <Text style={{ color: '#FFF', fontSize: 32, fontFamily: 'Inter_900Black' }}>{activeChild.name.charAt(0)}</Text>
              </View>
              <Text style={{ color: '#FFFFFF', fontSize: 20, fontFamily: 'Inter_700Bold', marginTop: 10 }}>{activeChild.name}</Text>
              <Text style={{ color: '#9CA3AF', fontSize: 13, fontFamily: 'Inter_500Medium', marginTop: 2 }}>ID: {activeChild.customId}</Text>

              <View style={{ flexDirection: 'row', gap: 12, marginTop: 14 }}>
                <View style={styles.badgeChip}>
                  <Text style={{ color: '#A855F7', fontSize: 12, fontFamily: 'Inter_700Bold' }}>Level {activeChild.level}</Text>
                </View>
                <View style={styles.badgeChip}>
                  <Text style={{ color: '#F59E0B', fontSize: 12, fontFamily: 'Inter_700Bold' }}>⭐ {activeChild.xp.toLocaleString()} XP</Text>
                </View>
                <View style={styles.badgeChip}>
                  <Text style={{ color: '#EF4444', fontSize: 12, fontFamily: 'Inter_700Bold' }}>🔥 {activeChild.streak} kun</Text>
                </View>
              </View>
            </View>

            {/* 📚 O'QISH STATISTIKASI */}
            <View style={styles.cardBox}>
              <Text style={styles.cardTitle}>📚 O'qish statistikasi</Text>
              <View style={styles.statsList}>
                <View style={styles.statsItemRow}>
                  <Text style={styles.statsItemLabel}>Jami mashqlar:</Text>
                  <Text style={styles.statsItemVal}>{activeChild.detailedStats.totalEx}</Text>
                </View>
                <View style={styles.statsItemRow}>
                  <Text style={styles.statsItemLabel}>To'g'ri javoblar:</Text>
                  <Text style={styles.statsItemVal}>{activeChild.detailedStats.correctEx}</Text>
                </View>
                <View style={styles.statsItemRow}>
                  <Text style={styles.statsItemLabel}>Aniqlik:</Text>
                  <Text style={[styles.statsItemVal, { color: '#10B981' }]}>{activeChild.detailedStats.accuracy}</Text>
                </View>
                <View style={styles.statsItemRow}>
                  <Text style={styles.statsItemLabel}>Jami vaqt:</Text>
                  <Text style={styles.statsItemVal}>{activeChild.detailedStats.monthTime}</Text>
                </View>
                <View style={styles.statsItemRow}>
                  <Text style={styles.statsItemLabel}>Battle g'alabalar:</Text>
                  <Text style={[styles.statsItemVal, { color: '#3B82F6' }]}>22 / 34</Text>
                </View>
              </View>
            </View>

            {/* 🧠 FANLAR BO'YICHA NATIJA */}
            <View style={styles.cardBox}>
              <Text style={styles.cardTitle}>🧠 Fanlar bo'yicha natija</Text>
              <View style={{ gap: 14, marginTop: 12 }}>
                {activeChild.subjectStats.map((subj, idx) => (
                  <View key={idx}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                      <Text style={{ color: '#FFFFFF', fontSize: 13, fontFamily: 'Inter_600SemiBold' }}>{subj.name}</Text>
                      <Text style={{ color: subj.color, fontSize: 13, fontFamily: 'Inter_700Bold' }}>{subj.score}%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${subj.score}%`, backgroundColor: subj.color }]} />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* 4. 📊 BATAFSIL STATISTIKA BUTTON */}
            <TouchableOpacity
              style={styles.detailedStatsBtn}
              activeOpacity={0.85}
              onPress={() => setIsDetailedStatsOpen(true)}
            >
              <MaterialCommunityIcons name="chart-box-outline" size={22} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={{ color: '#FFF', fontSize: 15, fontFamily: 'Inter_700Bold' }}>📊 Batafsil statistika</Text>
            </TouchableOpacity>

            {/* 5. 🏅 YUTUQLAR (ACHIEVEMENTS) */}
            <View style={[styles.cardBox, { marginBottom: 100 }]}>
              <Text style={styles.cardTitle}>🏅 Yutuqlar (Achievements)</Text>
              <View style={{ gap: 10, marginTop: 12 }}>
                {activeChild.achievements.map((ach) => (
                  <View key={ach.id} style={[styles.achieveItem, !ach.unlocked && { opacity: 0.5 }]}>
                    <View style={[styles.achieveIconBox, { backgroundColor: `${ach.color}20`, borderColor: ach.color }]}>
                      <MaterialCommunityIcons name={ach.unlocked ? ach.icon : 'lock'} size={20} color={ach.color} />
                    </View>
                    <Text style={styles.achieveTitle}>{ach.title}</Text>
                    {!ach.unlocked && <Text style={{ color: '#6B7280', fontSize: 11, marginLeft: 'auto' }}>Qulflangan</Text>}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        )}

        {/* 6. 👤 PROFIL SAHIFA */}
        {activeTab === 'profile' && (
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.profileCard}>
              <View style={styles.profileAvatarBox}>
                <MaterialCommunityIcons name="account" size={44} color="#A855F7" />
              </View>
              <Text style={styles.profileName}>{user?.name || "Ergashboy Masharipov"}</Text>
              <Text style={styles.profileTag}>{user?.email || "ergashboy@gmail.com"}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>OTA-ONA AKKAUNTI</Text>
              </View>
            </View>

            {/* SETTINGS MENU */}
            <View style={styles.cardBox}>
              <Text style={styles.cardTitle}>Hisob Sozlamalari</Text>

              <TouchableOpacity style={styles.menuRow}>
                <Feather name="bell" size={18} color="#9CA3AF" />
                <Text style={styles.menuText}>🔔 Bildirishnomalar</Text>
                <Feather name="chevron-right" size={18} color="#6B7280" style={{ marginLeft: 'auto' }} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuRow}>
                <Feather name="globe" size={18} color="#9CA3AF" />
                <Text style={styles.menuText}>🌐 Til (Language)</Text>
                <Feather name="chevron-right" size={18} color="#6B7280" style={{ marginLeft: 'auto' }} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuRow}>
                <Feather name="shield" size={18} color="#9CA3AF" />
                <Text style={styles.menuText}>🔐 Xavfsizlik</Text>
                <Feather name="chevron-right" size={18} color="#6B7280" style={{ marginLeft: 'auto' }} />
              </TouchableOpacity>
            </View>

            {/* 👨‍👩‍👧 FARZANDLARNI BOSHGARISH & FARZAND QO'SHISH */}
            <View style={styles.cardBox}>
              <Text style={styles.cardTitle}>👨‍👩‍👧 Farzandlarni boshqarish</Text>
              <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2, marginBottom: 12 }}>
                Yangi farzandingizni IQROMAX ID raqami orqali ushbu hisobingizga biriktiring.
              </Text>

              <TouchableOpacity
                style={styles.addChildBtn}
                activeOpacity={0.85}
                onPress={() => setIsAddChildModalOpen(true)}
              >
                <Feather name="plus-circle" size={20} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={{ color: '#FFF', fontSize: 15, fontFamily: 'Inter_700Bold' }}>+ Farzand qo'shish</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutFullBtn} onPress={handleReturnToHome}>
              <Feather name="log-out" size={20} color="#EF4444" style={{ marginRight: 8 }} />
              <Text style={{ color: '#EF4444', fontFamily: 'Inter_700Bold', fontSize: 16 }}>Tizimdan chiqish</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>

      {/* BOTTOM NAVIGATION BAR */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('home')}>
          <Feather name="home" size={22} color={activeTab === 'home' ? '#A855F7' : '#6B7280'} />
          <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>Bosh sahifa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('ranking')}>
          <Feather name="award" size={22} color={activeTab === 'ranking' ? '#A855F7' : '#6B7280'} />
          <Text style={[styles.navText, activeTab === 'ranking' && styles.navTextActive]}>Reyting</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('child')}>
          <MaterialCommunityIcons name="account-child" size={24} color={activeTab === 'child' ? '#A855F7' : '#6B7280'} />
          <Text style={[styles.navText, activeTab === 'child' && styles.navTextActive]}>Farzandim</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('profile')}>
          <Feather name="user" size={22} color={activeTab === 'profile' ? '#A855F7' : '#6B7280'} />
          <Text style={[styles.navText, activeTab === 'profile' && styles.navTextActive]}>Profil</Text>
        </TouchableOpacity>
      </View>

      {/* 4. 📊 BATAFSIL STATISTIKA MODAL */}
      <Modal visible={isDetailedStatsOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentCard}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MaterialCommunityIcons name="chart-timeline-variant" size={24} color="#A855F7" />
                <Text style={{ color: '#FFF', fontSize: 17, fontFamily: 'Inter_700Bold' }}>📊 Batafsil statistika</Text>
              </View>
              <TouchableOpacity onPress={() => setIsDetailedStatsOpen(false)}>
                <Feather name="x" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              {/* FAOLLIK VAQT LINIYASI */}
              <Text style={styles.modalSectionTitle}>📅 Faollik Vaqti</Text>
              <View style={styles.modalStatsRow}>
                <View style={styles.miniStatBox}>
                  <Text style={styles.miniStatLabel}>Bugun</Text>
                  <Text style={styles.miniStatVal}>{activeChild.detailedStats.todayTime}</Text>
                </View>
                <View style={styles.miniStatBox}>
                  <Text style={styles.miniStatLabel}>Bu hafta</Text>
                  <Text style={styles.miniStatVal}>{activeChild.detailedStats.weekTime}</Text>
                </View>
                <View style={styles.miniStatBox}>
                  <Text style={styles.miniStatLabel}>Bu oy</Text>
                  <Text style={styles.miniStatVal}>{activeChild.detailedStats.monthTime}</Text>
                </View>
              </View>

              {/* MASHQLAR XULOSASI */}
              <Text style={styles.modalSectionTitle}>🎯 Mashqlar Xulosasi</Text>
              <View style={styles.cardBox}>
                <View style={styles.statsItemRow}>
                  <Text style={styles.statsItemLabel}>Jami mashqlar:</Text>
                  <Text style={styles.statsItemVal}>{activeChild.detailedStats.totalEx}</Text>
                </View>
                <View style={styles.statsItemRow}>
                  <Text style={styles.statsItemLabel}>To'g'ri javoblar:</Text>
                  <Text style={[styles.statsItemVal, { color: '#10B981' }]}>{activeChild.detailedStats.correctEx}</Text>
                </View>
                <View style={styles.statsItemRow}>
                  <Text style={styles.statsItemLabel}>Noto'g'ri javoblar:</Text>
                  <Text style={[styles.statsItemVal, { color: '#EF4444' }]}>{activeChild.detailedStats.wrongEx}</Text>
                </View>
                <View style={styles.statsItemRow}>
                  <Text style={styles.statsItemLabel}>O'rtacha aniqlik:</Text>
                  <Text style={[styles.statsItemVal, { color: '#A855F7' }]}>{activeChild.detailedStats.accuracy}</Text>
                </View>
              </View>

              {/* 📈 RIVOJLANISH TENDENSIYASI (PROGRESS HISTORY) */}
              <Text style={styles.modalSectionTitle}>📈 Rivojlanish Tendensiyasi</Text>
              <View style={styles.progressChainRow}>
                {activeChild.detailedStats.progressHistory.map((p, i) => (
                  <React.Fragment key={i}>
                    <View style={styles.progressChainChip}>
                      <Text style={styles.progressChainText}>{p}</Text>
                    </View>
                    {i < activeChild.detailedStats.progressHistory.length - 1 && (
                      <Feather name="arrow-right" size={14} color="#6B7280" />
                    )}
                  </React.Fragment>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* FARZAND QO'SHISH MODAL */}
      <Modal visible={isAddChildModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={{ color: '#FFF', fontSize: 17, fontFamily: 'Inter_700Bold' }}>➕ Farzand qo'shish</Text>
              <TouchableOpacity onPress={() => setIsAddChildModalOpen(false)}>
                <Feather name="x" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <Text style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 16 }}>
              Farzandingizning IQROMAX ilovasidagi maxsus ID raqamini (masalan: #956Z6X) kiriting.
            </Text>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="pound" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
              <TextInput
                style={{ flex: 1, color: '#FFF', fontSize: 15, fontFamily: 'Inter_600SemiBold' }}
                placeholder="#000000"
                placeholderTextColor="#6B7280"
                value={childIdInput}
                onChangeText={setChildIdInput}
                autoCapitalize="characters"
              />
            </View>

            <TouchableOpacity
              style={styles.addChildSubmitBtn}
              activeOpacity={0.85}
              onPress={handleAddChildSubmit}
            >
              <Text style={{ color: '#FFF', fontSize: 15, fontFamily: 'Inter_700Bold' }}>Ulash va Qo'shish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* FEEDBACK MODAL */}
      <Modal visible={addChildFeedback.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContentCard, { alignItems: 'center', padding: 24 }]}>
            <MaterialCommunityIcons
              name={addChildFeedback.type === 'success' ? 'check-circle' : 'alert-circle'}
              size={48}
              color={addChildFeedback.type === 'success' ? '#10B981' : '#EF4444'}
              style={{ marginBottom: 12 }}
            />
            <Text style={{ color: '#FFF', fontSize: 18, fontFamily: 'Inter_700Bold', marginBottom: 6 }}>{addChildFeedback.title}</Text>
            <Text style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center', marginBottom: 20 }}>{addChildFeedback.message}</Text>
            <TouchableOpacity
              style={[styles.addChildSubmitBtn, { backgroundColor: addChildFeedback.type === 'success' ? '#10B981' : '#EF4444', width: '100%' }]}
              onPress={() => setAddChildFeedback({ visible: false, title: '', message: '', type: 'success' })}
            >
              <Text style={{ color: '#FFF', fontFamily: 'Inter_700Bold' }}>Tushundim</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#05050C' },
  topHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(168, 85, 247, 0.2)'
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarBox: {
    width: 44, height: 44, borderRadius: 22, overflow: 'hidden',
    borderWidth: 1.5, borderColor: '#A855F7'
  },
  avatarGradient: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  roleBadgeText: { color: '#A855F7', fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 0.8 },
  userName: { color: '#FFFFFF', fontSize: 17, fontFamily: 'Inter_700Bold', marginTop: 2 },
  logoutBtn: { padding: 9, borderRadius: 12, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
  scrollContent: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },

  greetingTitle: { color: '#FFFFFF', fontSize: 22, fontFamily: 'Inter_700Bold' },
  greetingSub: { color: '#9CA3AF', fontSize: 13, fontFamily: 'Inter_500Medium', marginTop: 2 },

  childCard: { backgroundColor: '#121228', borderRadius: 20, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#1A1A35' },
  childAvatarBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#A855F7', justifyContent: 'center', alignItems: 'center' },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(239,68,68,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: '#EF4444' },
  streakText: { color: '#EF4444', fontSize: 12, fontFamily: 'Inter_700Bold' },
  activityProgressBox: { marginTop: 4 },
  progressBarBg: { height: 8, backgroundColor: '#0D0D1F', borderRadius: 4, overflow: 'hidden' },
  progressBarBgLarge: { height: 10, backgroundColor: '#0D0D1F', borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 5 },

  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontFamily: 'Inter_700Bold', marginBottom: 12 },
  threeStatsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statBox: { flex: 1, backgroundColor: '#0D0D1F', padding: 14, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#1A1A35' },
  statBoxNum: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Inter_700Bold', marginTop: 6 },
  statBoxLabel: { color: '#9CA3AF', fontSize: 11, marginTop: 4, fontFamily: 'Inter_500Medium' },

  cardBox: { backgroundColor: '#0D0D1F', borderRadius: 20, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#1A1A35' },
  cardTitle: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Inter_700Bold' },

  metricFilterBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  metricFilterBtnActive: { backgroundColor: '#A855F7' },
  metricFilterText: { color: '#9CA3AF', fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  metricFilterTextActive: { color: '#FFFFFF' },

  chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 130, paddingVertical: 10 },
  chartCol: { alignItems: 'center', flex: 1 },
  chartValText: { color: '#9CA3AF', fontSize: 9, marginBottom: 4, fontFamily: 'Inter_600SemiBold' },
  chartBarBg: { width: 14, height: 90, backgroundColor: '#1A1A35', borderRadius: 7, justifyContent: 'flex-end', overflow: 'hidden' },
  chartBarFill: { width: '100%', borderRadius: 7 },
  chartDayText: { color: '#9CA3AF', fontSize: 10, marginTop: 6, fontFamily: 'Inter_600SemiBold' },
  insightBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: 10, borderRadius: 12, marginTop: 12, borderWidth: 1, borderColor: '#10B981' },
  insightText: { color: '#D1D5DB', fontSize: 12, fontFamily: 'Inter_500Medium' },

  achieveItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#121228', padding: 12, borderRadius: 14 },
  achieveIconBox: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  achieveTitle: { color: '#FFFFFF', fontSize: 14, fontFamily: 'Inter_600SemiBold' },

  filterChipsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: '#0D0D1F', borderWidth: 1, borderColor: '#1A1A35' },
  filterChipActive: { backgroundColor: '#A855F7', borderColor: '#A855F7' },
  filterChipText: { color: '#9CA3AF', fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  filterChipTextActive: { color: '#FFFFFF' },

  myChildRankCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#121228', padding: 16, borderRadius: 18, marginBottom: 16, borderWidth: 1.5, borderColor: '#A855F7' },
  rankRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0D0D1F', padding: 14, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#1A1A35' },
  rankNum: { fontSize: 15, fontFamily: 'Inter_900Black', width: 40, color: '#FFFFFF' },
  rankAvatarBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center' },
  rankName: { color: '#FFFFFF', fontSize: 14, fontFamily: 'Inter_700Bold' },
  rankXp: { color: '#F59E0B', fontSize: 14, fontFamily: 'Inter_700Bold' },

  childSelectTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: '#0D0D1F', borderWidth: 1, borderColor: '#1A1A35' },
  childSelectTabActive: { backgroundColor: '#A855F7', borderColor: '#A855F7' },
  childSelectTabText: { color: '#9CA3AF', fontSize: 13, fontFamily: 'Inter_700Bold' },
  childSelectTabTextActive: { color: '#FFFFFF' },

  childProfileCard: { backgroundColor: '#121228', borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#1A1A35' },
  childProfileAvatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#A855F7', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  badgeChip: { backgroundColor: '#0D0D1F', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#1A1A35' },

  statsList: { gap: 10, marginTop: 12 },
  statsItemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#1A1A35' },
  statsItemLabel: { color: '#9CA3AF', fontSize: 13, fontFamily: 'Inter_500Medium' },
  statsItemVal: { color: '#FFFFFF', fontSize: 14, fontFamily: 'Inter_700Bold' },

  detailedStatsBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#A855F7', paddingVertical: 14, borderRadius: 16, marginBottom: 20 },

  profileCard: { backgroundColor: '#121228', borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#1A1A35' },
  profileAvatarBox: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(168, 85, 247, 0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#A855F7' },
  profileName: { color: '#FFFFFF', fontSize: 18, fontFamily: 'Inter_700Bold', marginTop: 10 },
  profileTag: { color: '#9CA3AF', fontSize: 13, marginTop: 2 },
  roleBadge: { backgroundColor: 'rgba(168, 85, 247, 0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginTop: 10, borderWidth: 1, borderColor: '#A855F7' },

  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1A1A35' },
  menuText: { color: '#D1D5DB', fontSize: 14, fontFamily: 'Inter_600SemiBold' },

  addChildBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#10B981', paddingVertical: 14, borderRadius: 16 },
  logoutFullBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.12)', paddingVertical: 16, borderRadius: 16, marginBottom: 100, borderWidth: 1, borderColor: '#EF4444' },

  bottomNav: {
    flexDirection: 'row', position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#090914', borderTopWidth: 1, borderTopColor: '#1A1A35',
    paddingVertical: 10, paddingHorizontal: 16, justifyContent: 'space-around'
  },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navText: { color: '#6B7280', fontSize: 11, fontFamily: 'Inter_600SemiBold', marginTop: 4 },
  navTextActive: { color: '#A855F7' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(5, 5, 12, 0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContentCard: { width: '100%', backgroundColor: '#0D0D1F', borderRadius: 24, padding: 20, borderWidth: 1.5, borderColor: '#A855F7', maxHeight: '85%' },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalSectionTitle: { color: '#A855F7', fontSize: 14, fontFamily: 'Inter_700Bold', marginTop: 14, marginBottom: 10 },
  modalStatsRow: { flexDirection: 'row', gap: 10 },
  miniStatBox: { flex: 1, backgroundColor: '#121228', padding: 12, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#1A1A35' },
  miniStatLabel: { color: '#9CA3AF', fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  miniStatVal: { color: '#FFFFFF', fontSize: 14, fontFamily: 'Inter_700Bold', marginTop: 4 },

  progressChainRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#121228', padding: 14, borderRadius: 14, flexWrap: 'wrap' },
  progressChainChip: { backgroundColor: 'rgba(168, 85, 247, 0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#A855F7' },
  progressChainText: { color: '#A855F7', fontSize: 12, fontFamily: 'Inter_700Bold' },

  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#121228', borderRadius: 14, borderWidth: 1, borderColor: '#1A1A35', paddingHorizontal: 14, height: 50, marginBottom: 16 },
  addChildSubmitBtn: { backgroundColor: '#A855F7', paddingVertical: 14, borderRadius: 14, alignItems: 'center' }
});
