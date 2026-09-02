import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Modal, TextInput, Image, Dimensions, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { io } from 'socket.io-client';
import { SOCKET_URL, API_URL } from '../src/config/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ParentDashboardScreen({ navigation, route }) {
  const { user, language = 'uz', isAuthVerified = false } = route.params || {};

  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'ranking' | 'child' | 'profile'
  const [childrenList, setChildrenList] = useState([]); // Empty by default for new guest parent
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [weeklyMetric, setWeeklyMetric] = useState('xp'); // 'xp' | 'exercises' | 'time'
  const [rankingFilter, setRankingFilter] = useState('global'); // 'global' | 'country' | 'school' | 'class'
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isDetailedStatsOpen, setIsDetailedStatsOpen] = useState(false);

  // Authentication & Child Binding Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [authEmail, setAuthEmail] = useState(user?.email || '');
  const [authPhone, setAuthPhone] = useState(user?.phone || '');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [childIdInput, setChildIdInput] = useState(route.params?.studentCustomId || '');
  const [showPassword, setShowPassword] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Feedback Alert Modal
  const [feedbackAlert, setFeedbackAlert] = useState({ visible: false, title: '', message: '', type: 'error' });

  // Waiting for child acceptance status
  const [isWaitingChildAccept, setIsWaitingChildAccept] = useState(false);

  const activeChild = childrenList[selectedChildIndex] || null;

  // Real-time socket listener for parent invite acceptance by student
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      path: '/api/socket.io',
      transports: ['websocket']
    });

    socket.on('parent_invite_accepted', (data) => {
      if (data && data.student) {
        const studentObj = data.student;
        const newChild = {
          id: studentObj.uuid || studentObj.id || 'c_' + Date.now(),
          customId: studentObj.customId || '#' + studentObj.id,
          name: studentObj.name || 'Farzand',
          level: studentObj.level || 1,
          xp: studentObj.xp || 0,
          streak: 1,
          dailyActivity: 80,
          todayExercises: '15 / 20',
          todayAccuracy: '85%',
          todayTime: '35 daqiqa',
          goalPercent: 75,
          goalProgress: '15 / 20 mashq bajarildi',
          goalRemaining: 'Yana 5 ta mashq qoldi',
          weeklyData: [
            { day: 'Dush', xp: 400, exercises: 10, time: 25 },
            { day: 'Sesh', xp: 550, exercises: 14, time: 32 },
            { day: 'Chor', xp: 350, exercises: 8, time: 20 },
            { day: 'Pay', xp: 600, exercises: 15, time: 35 },
            { day: 'Jum', xp: 750, exercises: 18, time: 42 },
            { day: 'Shan', xp: 500, exercises: 12, time: 30 },
            { day: 'Yak', xp: 650, exercises: 16, time: 38 },
          ],
          achievements: [
            { id: 'a1', title: '7 kunlik seriya', icon: 'fire', color: '#EF4444', unlocked: true },
            { id: 'a2', title: "100 ta to'g'ri javob", icon: 'target', color: '#10B981', unlocked: true },
            { id: 'a3', title: "500 XP to'plandi", icon: 'lightning-bolt', color: '#F59E0B', unlocked: true }
          ],
          subjectStats: [
            { name: 'Matematika', score: 85, color: '#3B82F6' },
            { name: 'Fizika', score: 78, color: '#EAB308' },
            { name: 'Ingliz tili', score: 90, color: '#10B981' },
            { name: 'Mantiq', score: 94, color: '#A855F7' }
          ],
          detailedStats: {
            todayTime: '35 min',
            weekTime: '3 soat 45 min',
            monthTime: '15 soat 20 min',
            totalEx: 310,
            correctEx: 275,
            wrongEx: 35,
            accuracy: '88.7%',
            progressHistory: ['72%', '76%', '80%', '84%', '88%']
          }
        };

        setChildrenList(prev => {
          const exists = prev.some(c => c.customId === newChild.customId);
          if (exists) return prev;
          return [...prev, newChild];
        });
        setIsWaitingChildAccept(false);
        setFeedbackAlert({
          visible: true,
          title: 'Farzand tasdiqladi! 🎉',
          message: `${studentObj.name} bog'lanish so'rovini qabul qildi. Endi uning barcha natijalarini ko'rishingiz mumkin!`,
          type: 'success'
        });
      }
    });

    return () => socket.disconnect();
  }, []);

  // Fetch linked child for logged-in parent
  useEffect(() => {
    const fetchLinkedChild = async () => {
      if (user && user.country && user.country.trim()) {
        try {
          const res = await fetch(`${API_URL}/admin/users?role=student`);
          if (res.ok) {
            const allStudents = await res.json();
            const childCustomId = user.country.trim().toUpperCase();
            const matched = allStudents.find(s => 
              (s.customId && s.customId.toUpperCase() === childCustomId) ||
              (s.customId && s.customId.toUpperCase() === '#' + childCustomId) ||
              (s.id === user.country.trim())
            );

            if (matched) {
              const formattedChild = {
                id: matched.id || 'c_' + Date.now(),
                customId: matched.customId || '#' + matched.id,
                name: matched.name || 'Farzand',
                level: matched.level || 1,
                xp: matched.xp || 0,
                streak: 1,
                dailyActivity: 80,
                todayExercises: '15 / 20',
                todayAccuracy: '85%',
                todayTime: '35 daqiqa',
                goalPercent: 75,
                goalProgress: '15 / 20 mashq bajarildi',
                goalRemaining: 'Yana 5 ta mashq qoldi',
                weeklyData: [
                  { day: 'Dush', xp: 400, exercises: 10, time: 25 },
                  { day: 'Sesh', xp: 550, exercises: 14, time: 32 },
                  { day: 'Chor', xp: 350, exercises: 8, time: 20 },
                  { day: 'Pay', xp: 600, exercises: 15, time: 35 },
                  { day: 'Jum', xp: 750, exercises: 18, time: 42 },
                  { day: 'Shan', xp: 500, exercises: 12, time: 30 },
                  { day: 'Yak', xp: 650, exercises: 16, time: 38 },
                ],
                achievements: [
                  { id: 'a1', title: '7 kunlik seriya', icon: 'fire', color: '#EF4444', unlocked: true },
                  { id: 'a2', title: "100 ta to'g'ri javob", icon: 'target', color: '#10B981', unlocked: true },
                  { id: 'a3', title: "500 XP to'plandi", icon: 'lightning-bolt', color: '#F59E0B', unlocked: true }
                ],
                subjectStats: [
                  { name: 'Matematika', score: 85, color: '#3B82F6' },
                  { name: 'Fizika', score: 78, color: '#EAB308' },
                  { name: 'Ingliz tili', score: 90, color: '#10B981' },
                  { name: 'Mantiq', score: 94, color: '#A855F7' }
                ],
                detailedStats: {
                  todayTime: '35 min',
                  weekTime: '3 soat 45 min',
                  monthTime: '15 soat 20 min',
                  totalEx: 310,
                  correctEx: 275,
                  wrongEx: 35,
                  accuracy: '88.7%',
                  progressHistory: ['72%', '76%', '80%', '84%', '88%']
                }
              };

              setChildrenList([formattedChild]);
            }
          }
        } catch (e) {
          console.error('Fetch linked child error:', e);
        }
      }
    };

    fetchLinkedChild();
  }, [user]);

  // Handle returning from OTP verification
  useEffect(() => {
    if (isAuthVerified && (authEmail || user?.email)) {
      const registerParentAndInvite = async () => {
        try {
          // Register parent user in backend DB
          const pName = user?.name || authEmail.split('@')[0] || 'Ota-ona';
          const pEmail = authEmail.trim() || user?.email;
          const pPhone = authPhone.trim() || user?.phone || '+998900000000';
          const pPass = authPassword.trim() || '123456';

          const regRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: pName,
              email: pEmail,
              phone: pPhone,
              password: pPass,
              role: 'parent',
              country: childIdInput.trim() || ''
            })
          });
          const regData = await regRes.json();
          if (regData.user) {
            await AsyncStorage.setItem('user_data', JSON.stringify(regData.user));
          }
        } catch (e) {
          console.error('Parent registration DB error:', e);
        }

        if (childIdInput.trim()) {
          sendParentInviteToStudent();
        }
      };

      registerParentAndInvite();
    }
  }, [isAuthVerified]);

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

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // Submit Parent Login
  const handleParentLogin = async () => {
    const loginIdent = authPhone.trim() || authEmail.trim();
    if (!loginIdent || !authPassword.trim()) {
      setFeedbackAlert({
        visible: true,
        title: 'Diqqat',
        message: 'Iltimos, telefon raqam (yoki email) va parolingizni kiriting!',
        type: 'error'
      });
      return;
    }

    setIsLoggingIn(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: loginIdent,
          username: loginIdent,
          password: authPassword.trim(),
          language
        })
      });

      const data = await response.json();
      if (response.ok && data.user) {
        try {
          await AsyncStorage.setItem('user_data', JSON.stringify(data.user));
        } catch (e) {}

        setIsAuthModalOpen(false);
        setIsLoggingIn(false);

        // Reset navigation to update logged in parent user
        navigation.reset({
          index: 0,
          routes: [{
            name: 'ParentDashboard',
            params: {
              user: data.user,
              language: language
            }
          }]
        });
      } else {
        setFeedbackAlert({
          visible: true,
          title: 'Xatolik',
          message: data.error || 'Telefon raqam yoki parol noto\'g\'ri!',
          type: 'error'
        });
        setIsLoggingIn(false);
      }
    } catch (e) {
      setFeedbackAlert({
        visible: true,
        title: 'Tarmoq Xatosi',
        message: 'Internet aloqasini tekshiring.',
        type: 'error'
      });
      setIsLoggingIn(false);
    }
  };

  // Submit Parent Auth & Invite Form
  const handleAuthAndInviteSubmit = async () => {
    if (!authEmail.trim() || !authPhone.trim() || !childIdInput.trim()) {
      setFeedbackAlert({
        visible: true,
        title: 'Diqqat',
        message: 'Iltimos, Email, Telefon raqam va Farzand ID sini kiriting!',
        type: 'error'
      });
      return;
    }

    if (authPassword && authConfirmPassword && authPassword !== authConfirmPassword) {
      setFeedbackAlert({
        visible: true,
        title: 'Xatolik',
        message: 'Parollar bir-biriga mos kelmadi!',
        type: 'error'
      });
      return;
    }

    setIsSendingOtp(true);
    try {
      console.log('Sending OTP request to:', `${API_URL}/auth/send-otp`);
      // Send OTP to parent email
      const res = await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: authEmail.trim(),
          name: user?.name || 'Ota-ona',
          language
        })
      });

      console.log('Send OTP status:', res.status);
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setIsAuthModalOpen(false);
        setIsSendingOtp(false);
        // Navigate to OtpScreen for verification
        navigation.navigate('OtpScreen', {
          email: authEmail.trim(),
          phone: authPhone.trim(),
          password: authPassword.trim() || '123456',
          name: user?.name || 'Ota-ona',
          role: 'parent',
          studentCustomId: childIdInput.trim(),
          parentAuthRedirect: true,
          language
        });
      } else {
        setFeedbackAlert({
          visible: true,
          title: 'Xatolik',
          message: data.error || 'OTP kodini yuborishda xatolik yuz berdi.',
          type: 'error'
        });
        setIsSendingOtp(false);
      }
    } catch (e) {
      console.error('Send OTP fetch error:', e);
      // Fallback: If network blocks email send, still navigate to OTP screen for demo
      setIsAuthModalOpen(false);
      setIsSendingOtp(false);
      navigation.navigate('OtpScreen', {
        email: authEmail.trim(),
        phone: authPhone.trim(),
        password: authPassword.trim() || '123456',
        name: user?.name || 'Ota-ona',
        role: 'parent',
        studentCustomId: childIdInput.trim(),
        parentAuthRedirect: true,
        language
      });
    }
  };

  const sendParentInviteToStudent = async () => {
    try {
      const res = await fetch(`${API_URL}/parent/send-invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: user?.name || 'Ota-onangiz',
          parentEmail: authEmail || user?.email,
          parentPhone: authPhone || user?.phone,
          studentCustomId: childIdInput.trim()
        })
      });

      if (res.ok) {
        setIsWaitingChildAccept(true);
        setFeedbackAlert({
          visible: true,
          title: 'So\'rov Yuborildi! 📩',
          message: `Farzandingizning ilovasiga bog'lanish so'rovi yuborildi. Farzandingiz ilovasida "Qabul qilish" tugmasini bosishi bilanoq ma'lumotlar ko'rinadi.`,
          type: 'success'
        });
      } else {
        const errData = await res.json();
        setFeedbackAlert({
          visible: true,
          title: 'Topilmadi',
          message: errData.error || 'Ushbu ID raqamli o\'quvchi topilmadi.',
          type: 'error'
        });
      }
    } catch (e) {
      console.error('Send parent invite error:', e);
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
            <Text style={styles.userName}>{user?.name || "Ota-ona"}</Text>
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
            {childrenList.length > 0 && activeChild ? (
              <>
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

                {/* 📊 BUGUNGI NATIJA */}
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
              </>
            ) : (
              /* INTRO INTRODUCTORY SCREEN FOR FIRST TIME PARENTS */
              <View style={styles.introContainer}>
                <View style={styles.introHeroCardCompact}>
                  <LinearGradient
                    colors={['#2D1454', '#120926']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.introHeroGradientCompact}
                  >
                    {isWaitingChildAccept ? (
                      <View style={{ paddingVertical: 4 }}>
                        <View style={styles.introHeaderRow}>
                          <View style={[styles.introBadgeIcon, { backgroundColor: 'rgba(245, 158, 11, 0.2)', borderColor: '#F59E0B' }]}>
                            <MaterialCommunityIcons name="clock-outline" size={26} color="#F59E0B" />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.introHeroTitleCompact}>So'rov Yuborildi! ⏳</Text>
                            <Text style={styles.introHeroSubCompact}>
                              Farzandingiz ilovada "Tasdiqlash" tugmasini bosishi kutilmoqda.
                            </Text>
                          </View>
                        </View>
                        <View style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.3)', marginTop: 6 }}>
                          <Text style={{ color: '#FDE047', fontSize: 12, fontFamily: 'Inter_600SemiBold', textAlign: 'center' }}>
                            🔔 Farzandingiz IQROMAX mobil ilovasiga kirganida uning notification bo'limiga "O'qituvchingni/Ota-onangni tasdiqla" xabari boradi.
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <>
                        <View style={styles.introHeaderRow}>
                          <View style={styles.introBadgeIcon}>
                            <MaterialCommunityIcons name="shield-account-outline" size={24} color="#C084FC" />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.introHeroTitleCompact}>IQROMAX Ota-ona Tizimi 👨‍👩‍👧‍👦</Text>
                            <Text style={styles.introHeroSubCompact}>Farzandingizning bilim va kunlik rivojlanishini kuzating.</Text>
                          </View>
                        </View>

                        <TouchableOpacity
                          style={styles.introBindBtnCompact}
                          activeOpacity={0.85}
                          onPress={() => setIsAuthModalOpen(true)}
                        >
                          <MaterialCommunityIcons name="account-plus-outline" size={18} color="#FFF" style={{ marginRight: 6 }} />
                          <Text style={{ color: '#FFF', fontSize: 14, fontFamily: 'Inter_700Bold' }}>Farzandni Biriktirish</Text>
                          <Feather name="arrow-right" size={16} color="#FFF" style={{ marginLeft: 'auto' }} />
                        </TouchableOpacity>
                      </>
                    )}
                  </LinearGradient>
                </View>

                {/* FEATURE CARDS LIST */}
                <Text style={styles.sectionTitle}>Nimalarni Kuzatishingiz Mumkin?</Text>
                
                <View style={styles.introFeatureCard}>
                  <View style={[styles.introIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderColor: '#3B82F6' }]}>
                    <MaterialCommunityIcons name="chart-line" size={26} color="#3B82F6" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.introFeatureTitle}>Kunlik Progress va Aniqlik</Text>
                    <Text style={styles.introFeatureSub}>Farzandingiz nechtadan mashq bajarayotgani va to'g'ri javoblar foizini jonli kuzatasiz.</Text>
                  </View>
                </View>

                <View style={styles.introFeatureCard}>
                  <View style={[styles.introIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10B981' }]}>
                    <MaterialCommunityIcons name="medal-outline" size={26} color="#10B981" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.introFeatureTitle}>Reyting va O'rinlar</Text>
                    <Text style={styles.introFeatureSub}>Farzandingiz mamlakat va maktab bo'yicha nechanchi o'rinda borayotganini ko'rib borasiz.</Text>
                  </View>
                </View>

                <View style={[styles.introFeatureCard, { marginBottom: 100 }]}>
                  <View style={[styles.introIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: '#F59E0B' }]}>
                    <MaterialCommunityIcons name="brain" size={26} color="#F59E0B" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.introFeatureTitle}>Fanlar va Rivojlanish Tahlili</Text>
                    <Text style={styles.introFeatureSub}>Matematika, Mantiq va Mental Arifmetika bo'yicha farzandingizning o'zlashtirish va bilim darajasini tahlil qilasiz.</Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        )}

        {/* 2. 🏆 REYTING SAHIFA */}
        {activeTab === 'ranking' && (
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {childrenList.length > 0 && activeChild ? (
              <>
                <Text style={styles.sectionTitle}>🏆 Reyting (Leaderboard)</Text>

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

                <View style={{ paddingBottom: 100 }}>
                  {leaderboardData.map((item) => (
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
                  ))}
                </View>
              </>
            ) : (
              /* INTRO RANKING SCREEN FOR UNLINKED PARENT */
              <View style={{ paddingBottom: 100 }}>
                <Text style={styles.sectionTitle}>🏆 Reyting Tizimi Nima?</Text>
                
                <View style={styles.introHeroCardCompact}>
                  <LinearGradient colors={['#1E1B4B', '#0F172A']} style={{ padding: 18 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <View style={[styles.introBadgeIcon, { backgroundColor: 'rgba(245, 158, 11, 0.2)', borderColor: '#F59E0B' }]}>
                        <FontAwesome5 name="trophy" size={22} color="#F59E0B" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.introHeroTitleCompact}>Musobaqa va O'rinlar</Text>
                        <Text style={styles.introHeroSubCompact}>Farzandingiz do'stlari va tengdoshlari orasida nechanchi o'rinda ekanini kuzatasiz.</Text>
                      </View>
                    </View>

                    <View style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', padding: 12, borderRadius: 14, borderWidth: 1, borderColor: '#334155' }}>
                      <Text style={{ color: '#94A3B8', fontSize: 12, lineHeight: 18 }}>
                        💡 Farzandingiz har bir to'g'ri bajarilgan mashq uchun <Text style={{ color: '#F59E0B', fontWeight: 'bold' }}>XP ballar</Text> to'playdi. Reyting sahifasida uning sinfdagilar, maktabdagi va umumiy mamlakatdagi o'rnini jonli tahlil qilishingiz mumkin bo'ladi.
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[styles.introBindBtnCompact, { marginTop: 14, backgroundColor: '#F59E0B' }]}
                      activeOpacity={0.85}
                      onPress={() => setIsAuthModalOpen(true)}
                    >
                      <MaterialCommunityIcons name="account-plus-outline" size={18} color="#FFF" style={{ marginRight: 6 }} />
                      <Text style={{ color: '#FFF', fontSize: 14, fontFamily: 'Inter_700Bold' }}>Farzandni Biriktirish</Text>
                      <Feather name="arrow-right" size={16} color="#FFF" style={{ marginLeft: 'auto' }} />
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </View>
            )}
          </ScrollView>
        )}

        {/* 3. 👦 FARZANDIM SAHIFA */}
        {activeTab === 'child' && (
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {childrenList.length > 0 && activeChild ? (
              <>
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

                <TouchableOpacity
                  style={styles.detailedStatsBtn}
                  activeOpacity={0.85}
                  onPress={() => setIsDetailedStatsOpen(true)}
                >
                  <MaterialCommunityIcons name="chart-box-outline" size={22} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={{ color: '#FFF', fontSize: 15, fontFamily: 'Inter_700Bold' }}>📊 Batafsil statistika</Text>
                </TouchableOpacity>

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
              </>
            ) : (
              /* INTRO CHILD STATS SCREEN FOR UNLINKED PARENT */
              <View style={{ paddingBottom: 100 }}>
                <Text style={styles.sectionTitle}>👦 Farzandim Bo'limi Nima?</Text>

                <View style={styles.introHeroCardCompact}>
                  <LinearGradient colors={['#0F291E', '#061710']} style={{ padding: 18 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <View style={[styles.introBadgeIcon, { backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: '#10B981' }]}>
                        <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={24} color="#10B981" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.introHeroTitleCompact}>Chuqurlashtirilgan Statistika</Text>
                        <Text style={styles.introHeroSubCompact}>Farzandingizning bilim darajasi va kunlik faolligini batafsil kuzatasiz.</Text>
                      </View>
                    </View>

                    <View style={{ backgroundColor: 'rgba(6, 23, 16, 0.7)', padding: 12, borderRadius: 14, borderWidth: 1, borderColor: '#134E3A' }}>
                      <Text style={{ color: '#A7F3D0', fontSize: 12, lineHeight: 18 }}>
                        📈 Farzandingizni biriktirgandan so'ng bu sahifada uning <Text style={{ color: '#10B981', fontWeight: 'bold' }}>bajarilgan mashqlar soni, to'g'ri javoblar aniqlik foizi, har bir fandan erishgan darajasi va yutuqlari (medal & badges)</Text> namoyon bo'ladi.
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[styles.introBindBtnCompact, { marginTop: 14, backgroundColor: '#10B981' }]}
                      activeOpacity={0.85}
                      onPress={() => setIsAuthModalOpen(true)}
                    >
                      <MaterialCommunityIcons name="account-plus-outline" size={18} color="#FFF" style={{ marginRight: 6 }} />
                      <Text style={{ color: '#FFF', fontSize: 14, fontFamily: 'Inter_700Bold' }}>Farzandni Biriktirish</Text>
                      <Feather name="arrow-right" size={16} color="#FFF" style={{ marginLeft: 'auto' }} />
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </View>
            )}
          </ScrollView>
        )}

        {/* 4. 👤 PROFIL SAHIFA */}
        {activeTab === 'profile' && (
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* SLEEK GLASSMORPHIC PARENT PROFILE HEADER */}
            <View style={styles.profileCardModern}>
              <LinearGradient colors={['rgba(168, 85, 247, 0.15)', 'rgba(31, 16, 53, 0.6)']} style={styles.profileCardGradient}>
                <View style={styles.profileAvatarBoxModern}>
                  <Text style={{ color: '#FFF', fontSize: 32, fontFamily: 'Inter_900Black' }}>
                    {(user?.name || "Ota-ona").charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.profileNameModern}>{user?.name || "Ota-ona"}</Text>
                <Text style={styles.profileTagModern}>{user?.email || "Email tasdiqlanmagan"}</Text>
                <View style={styles.roleBadgeModern}>
                  <MaterialCommunityIcons name="shield-check" size={14} color="#A855F7" style={{ marginRight: 4 }} />
                  <Text style={styles.roleBadgeTextModern}>OTA-ONA TIZIMI</Text>
                </View>
              </LinearGradient>
            </View>

            {/* PARENT QUICK STATUS & CHILD SUMMARY CARD */}
            <View style={styles.cardBox}>
              <Text style={styles.cardTitle}>👨‍👩‍👧 Farzandlar Holati</Text>
              <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2, marginBottom: 14 }}>
                Biriktirilgan farzandlaringiz va ularning ilovaga ulanish darajasi.
              </Text>

              {childrenList.length > 0 ? (
                childrenList.map((ch) => (
                  <View key={ch.id} style={styles.linkedChildRow}>
                    <View style={styles.linkedChildAvatar}>
                      <Text style={{ color: '#FFF', fontFamily: 'Inter_700Bold' }}>{ch.name.charAt(0)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#FFF', fontSize: 15, fontFamily: 'Inter_700Bold' }}>{ch.name}</Text>
                      <Text style={{ color: '#9CA3AF', fontSize: 12 }}>ID: {ch.customId} • Level {ch.level}</Text>
                    </View>
                    <View style={styles.connectedBadge}>
                      <View style={styles.greenDot} />
                      <Text style={{ color: '#10B981', fontSize: 11, fontFamily: 'Inter_700Bold' }}>Ulangan</Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.noChildRow}>
                  <MaterialCommunityIcons name="account-search-outline" size={24} color="#9CA3AF" style={{ marginRight: 10 }} />
                  <Text style={{ color: '#9CA3AF', fontSize: 13, flex: 1 }}>Hozircha farzand biriktirilmagan</Text>
                </View>
              )}

              {/* FARZAND QO'SHISH SLEEK BUTTON */}
              <TouchableOpacity
                style={styles.addChildBtnModern}
                activeOpacity={0.85}
                onPress={() => setIsAuthModalOpen(true)}
              >
                <Feather name="plus-circle" size={18} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={{ color: '#FFF', fontSize: 15, fontFamily: 'Inter_700Bold' }}>+ Farzand qo'shish</Text>
              </TouchableOpacity>
            </View>

            {/* QUICK ACTIONS & NOTIFICATIONS INFO */}
            <View style={styles.cardBox}>
              <Text style={styles.cardTitle}>⚡ Tezkor Amallar</Text>
              
              <TouchableOpacity style={styles.quickActionRow} onPress={() => setIsAuthModalOpen(true)}>
                <View style={[styles.actionIconBox, { backgroundColor: 'rgba(168, 85, 247, 0.15)', borderColor: '#A855F7' }]}>
                  <MaterialCommunityIcons name="shield-key-outline" size={20} color="#A855F7" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#FFF', fontSize: 14, fontFamily: 'Inter_600SemiBold' }}>Akkaunt Autentifikatsiyasi</Text>
                  <Text style={{ color: '#9CA3AF', fontSize: 11 }}>Pochta va parolni yangilash</Text>
                </View>
                <Feather name="chevron-right" size={18} color="#6B7280" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickActionRow} onPress={() => setActiveTab('home')}>
                <View style={[styles.actionIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderColor: '#3B82F6' }]}>
                  <MaterialCommunityIcons name="chart-box-outline" size={20} color="#3B82F6" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#FFF', fontSize: 14, fontFamily: 'Inter_600SemiBold' }}>Farzand Natijalari Monitoringi</Text>
                  <Text style={{ color: '#9CA3AF', fontSize: 11 }}>Bugungi va haftalik progress</Text>
                </View>
                <Feather name="chevron-right" size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* TIZIMDAN CHIQISH BUTTON */}
            <TouchableOpacity style={styles.logoutFullBtnModern} onPress={handleReturnToHome}>
              <Feather name="log-out" size={20} color="#EF4444" style={{ marginRight: 8 }} />
              <Text style={{ color: '#EF4444', fontFamily: 'Inter_700Bold', fontSize: 16 }}>Tizimdan chiqish</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>

      {/* BOTTOM NAVIGATION BAR */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => handleTabClick('home')}>
          <Feather name="home" size={22} color={activeTab === 'home' ? '#A855F7' : '#6B7280'} />
          <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>Bosh sahifa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => handleTabClick('ranking')}>
          <Feather name="award" size={22} color={activeTab === 'ranking' ? '#A855F7' : '#6B7280'} />
          <Text style={[styles.navText, activeTab === 'ranking' && styles.navTextActive]}>Reyting</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => handleTabClick('child')}>
          <MaterialCommunityIcons name="account-child" size={24} color={activeTab === 'child' ? '#A855F7' : '#6B7280'} />
                  <Text style={[styles.navText, activeTab === 'child' && styles.navTextActive]}>Farzandim</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => handleTabClick('profile')}>
          <Feather name="user" size={22} color={activeTab === 'profile' ? '#A855F7' : '#6B7280'} />
          <Text style={[styles.navText, activeTab === 'profile' && styles.navTextActive]}>Profil</Text>
        </TouchableOpacity>
      </View>

      {/* AUTHENTICATION & CHILD ID BINDING MODAL */}
      <Modal visible={isAuthModalOpen} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContentCard, { maxHeight: '90%' }]}>
              <View style={styles.modalHeaderRow}>
                <Text style={{ color: '#FFF', fontSize: 18, fontFamily: 'Inter_700Bold' }}>🔒 Autentifikatsiya va Farzand ID</Text>
                <TouchableOpacity onPress={() => setIsAuthModalOpen(false)}>
                  <Feather name="x" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }} keyboardShouldPersistTaps="handled">
                <Text style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 16 }}>
                  Farzandingiz natijalarini ko'rish uchun elektron pochtangiz, telefon raqamingiz, parol va Farzandingiz ID sini kiriting.
                </Text>

                {/* EMAIL INPUT */}
                <View style={styles.inputContainer}>
                  <Feather name="mail" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Elektron pochtangiz (Email)"
                    placeholderTextColor="#6B7280"
                    keyboardType="email-address"
                    value={authEmail}
                    onChangeText={setAuthEmail}
                  />
                </View>

                {/* PHONE INPUT */}
                <View style={styles.inputContainer}>
                  <Feather name="phone" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Telefon raqamingiz"
                    placeholderTextColor="#6B7280"
                    keyboardType="phone-pad"
                    value={authPhone}
                    onChangeText={setAuthPhone}
                  />
                </View>

                {/* PASSWORD INPUT */}
                <View style={styles.inputContainer}>
                  <Feather name="lock" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Parol o'ylab toping"
                    placeholderTextColor="#6B7280"
                    secureTextEntry={!showPassword}
                    value={authPassword}
                    onChangeText={setAuthPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Feather name={showPassword ? "eye" : "eye-off"} size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                {/* CONFIRM PASSWORD INPUT */}
                <View style={styles.inputContainer}>
                  <Feather name="check-circle" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Parolni tasdiqlang"
                    placeholderTextColor="#6B7280"
                    secureTextEntry={!showPassword}
                    value={authConfirmPassword}
                    onChangeText={setAuthConfirmPassword}
                  />
                </View>

                {/* EYE CATCHING CHILD ID INPUT */}
                <View style={styles.eyeCatchingIdBox}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <MaterialCommunityIcons name="star-face" size={22} color="#F59E0B" style={{ marginRight: 6 }} />
                    <Text style={{ color: '#F59E0B', fontSize: 14, fontFamily: 'Inter_700Bold' }}>Farzandingiz IDsi</Text>
                  </View>
                  <View style={styles.idInputInner}>
                    <MaterialCommunityIcons name="pound" size={20} color="#A855F7" style={{ marginRight: 8 }} />
                    <TextInput
                      style={{ flex: 1, color: '#FFF', fontSize: 17, fontFamily: 'Inter_700Bold', letterSpacing: 1 }}
                      placeholder="#956Z6X"
                      placeholderTextColor="#6B7280"
                      value={childIdInput}
                      onChangeText={setChildIdInput}
                      autoCapitalize="characters"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.addChildSubmitBtn, isSendingOtp && { opacity: 0.5 }]}
                  activeOpacity={0.85}
                  onPress={handleAuthAndInviteSubmit}
                  disabled={isSendingOtp}
                >
                  {isSendingOtp ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={{ color: '#FFF', fontSize: 16, fontFamily: 'Inter_700Bold' }}>Saqlash va Tasdiqlash (OTP)</Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* FEEDBACK ALERT MODAL */}
      <Modal visible={feedbackAlert.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContentCard, { alignItems: 'center', padding: 24 }]}>
            <MaterialCommunityIcons
              name={feedbackAlert.type === 'success' ? 'check-circle' : 'alert-circle'}
              size={48}
              color={feedbackAlert.type === 'success' ? '#10B981' : '#EF4444'}
              style={{ marginBottom: 12 }}
            />
            <Text style={{ color: '#FFF', fontSize: 18, fontFamily: 'Inter_700Bold', marginBottom: 6 }}>{feedbackAlert.title}</Text>
            <Text style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center', marginBottom: 20, lineHeight: 18 }}>{feedbackAlert.message}</Text>
            <TouchableOpacity
              style={[styles.addChildSubmitBtn, { backgroundColor: feedbackAlert.type === 'success' ? '#10B981' : '#EF4444', width: '100%' }]}
              onPress={() => setFeedbackAlert({ visible: false, title: '', message: '', type: 'success' })}
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

  introContainer: { paddingBottom: 20 },
  introHeroCardCompact: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.3)',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8
  },
  introHeroGradientCompact: {
    padding: 16
  },
  introHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14
  },
  introBadgeIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.4)'
  },
  introHeroTitleCompact: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold'
  },
  introHeroSubCompact: {
    color: '#D1D5DB',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
    lineHeight: 16
  },
  introBindBtnCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9333EA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },

  introFeatureCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#0D0D1F', padding: 16, borderRadius: 18, marginBottom: 12, borderWidth: 1, borderColor: '#1A1A35' },
  introIconBox: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5 },
  introFeatureTitle: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  introFeatureSub: { color: '#9CA3AF', fontSize: 12, lineHeight: 17 },

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

  profileCardModern: { borderRadius: 24, overflow: 'hidden', marginBottom: 20, borderWidth: 1.5, borderColor: '#A855F7' },
  profileCardGradient: { padding: 22, alignItems: 'center' },
  profileAvatarBoxModern: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#A855F7', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF', marginBottom: 10 },
  profileNameModern: { color: '#FFFFFF', fontSize: 20, fontFamily: 'Inter_700Bold' },
  profileTagModern: { color: '#9CA3AF', fontSize: 13, marginTop: 2 },
  roleBadgeModern: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(168, 85, 247, 0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, marginTop: 10, borderWidth: 1, borderColor: '#A855F7' },
  roleBadgeTextModern: { color: '#A855F7', fontSize: 11, fontFamily: 'Inter_700Bold', letterSpacing: 0.8 },

  linkedChildRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#121228', padding: 12, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: '#1A1A35' },
  linkedChildAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#A855F7', justifyContent: 'center', alignItems: 'center' },
  connectedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#10B981' },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  noChildRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#121228', padding: 14, borderRadius: 14, marginBottom: 14 },
  addChildBtnModern: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#10B981', paddingVertical: 14, borderRadius: 16, marginTop: 4 },

  quickActionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1A1A35' },
  actionIconBox: { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  logoutFullBtnModern: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.12)', paddingVertical: 16, borderRadius: 16, marginBottom: 100, borderWidth: 1, borderColor: '#EF4444' },

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

  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#121228', borderRadius: 14, borderWidth: 1, borderColor: '#1A1A35', paddingHorizontal: 14, height: 50, marginBottom: 14 },
  modalInput: { flex: 1, color: '#FFF', fontSize: 14, fontFamily: 'Inter_500Medium' },

  eyeCatchingIdBox: { backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: 14, borderRadius: 16, borderWidth: 1.5, borderColor: '#F59E0B', marginBottom: 20 },
  idInputInner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0D0D1F', borderRadius: 12, paddingHorizontal: 14, height: 50, borderWidth: 1, borderColor: '#A855F7' },
  addChildSubmitBtn: { backgroundColor: '#A855F7', paddingVertical: 16, borderRadius: 16, alignItems: 'center' }
});
