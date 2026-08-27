import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, StatusBar, Animated, 
  ScrollView, Platform, TextInput, Modal, ImageBackground 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import io from 'socket.io-client';
import { API_URL } from '../src/config/api';
import { LinearGradient } from 'expo-linear-gradient';
import { calculateUserRank } from '../src/utils/rankUtils';
import { DASHBOARD_TRANSLATIONS } from './StudentDashboardScreen';

const SOCKET_SERVER_URL = API_URL.replace(/\/api\/?$/, '');

const getAvatarByName = (avatarName) => {
  const avatarMap = {
    'avatar_maks.png': require('../assets/avatar_maks.png'),
    'avatar_alex.jpg': require('../assets/avatar_alex.jpg'),
    'avatar_david.jpg': require('../assets/avatar_david.jpg'),
    'avatar_emma.jpg': require('../assets/avatar_emma.jpg'),
    'avatar_kevin.png': require('../assets/avatar_kevin.png'),
    'avatar_lily.jpg': require('../assets/avatar_lily.jpg'),
    'avatar_maya.jpg': require('../assets/avatar_maya.jpg'),
    'avatar_sophia.png': require('../assets/avatar_sophia.png'),
  };
  return avatarMap[avatarName] || require('../assets/avatar_maks.png');
};

export default function TeacherDashboardScreen({ navigation, route }) {
  const { user, language = 'uz' } = route.params || {};
  const t = DASHBOARD_TRANSLATIONS[language] || DASHBOARD_TRANSLATIONS['uz'];

  // Tabs: 'home' | 'exercise' | 'stats' | 'ranking' | 'profile'
  const [activeTab, setActiveTab] = useState('home');

  // Exercise config tab
  const [activeExerciseType, setActiveExerciseType] = useState('abacus'); // 'abacus' | 'calc' | 'speed'

  // Teacher exercise settings
  const [selectedDigits, setSelectedDigits] = useState(1);
  const [exampleCount, setExampleCount] = useState(10);
  const [selectedOpType, setSelectedOpType] = useState('oddiy');
  const [selectedSpeed, setSelectedSpeed] = useState(1);

  // Real-time deletion modal
  const [isDeletedModalVisible, setIsDeletedModalVisible] = useState(false);

  // Ranking data
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Socket & Real-time deletion check
  useEffect(() => {
    if (!user || !user.id) return;

    const socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      forceNew: true
    });

    socket.on('user_deleted', (deletedData) => {
      if (
        deletedData.id === user.id ||
        (deletedData.customId && user.customId && deletedData.customId.toUpperCase() === user.customId.toUpperCase())
      ) {
        setIsDeletedModalVisible(true);
      }
    });

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/user/status/${user.id}`);
        if (res.status === 444 || (res.ok && (await res.json()).exists === false)) {
          setIsDeletedModalVisible(true);
        }
      } catch (e) {}
    }, 3000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, [user]);

  // Fetch ranking when activeTab === 'ranking'
  useEffect(() => {
    if (activeTab === 'ranking') {
      const fetchRanking = async () => {
        try {
          const res = await fetch(`${API_URL}/ranking?t=${Date.now()}`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              const rankedData = data.map((u, index) => ({
                customId: u.id,
                rank: index + 1,
                name: u.name || '---',
                xp: u.xp || 0,
                avatar: u.avatar && u.avatar.startsWith('http') ? { uri: u.avatar } : getAvatarByName(u.avatar)
              }));
              setLeaderboardData(rankedData);
            }
          }
        } catch (e) {
          console.error('Fetch ranking error:', e);
        }
      };
      fetchRanking();
    }
  }, [activeTab]);

  const handleReturnToHome = async () => {
    try {
      await AsyncStorage.removeItem('user_data');
    } catch (e) {}
    navigation.reset({
      index: 0,
      routes: [{ name: 'StepTwo', params: { language } }]
    });
  };

  const handleStartExercise = () => {
    navigation.navigate('OddiyHisobGame', {
      examplesCount: exampleCount,
      operation: selectedOpType,
      speed: selectedSpeed,
      digits: selectedDigits,
      language,
      isSpeedMode: activeExerciseType === 'speed',
      isTeacher: true
    });
  };

  const userRankInfo = calculateUserRank(user?.xp || 0);
  const filteredLeaderboard = leaderboardData.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    String(item.customId).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05050C" />

      {/* TOP HEADER */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarBox}>
            <Feather name="user-check" size={24} color="#A855F7" />
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.welcomeText}>O'qituvchi</Text>
              <View style={styles.infiniteBadge}>
                <MaterialCommunityIcons name="infinity" size={14} color="#10B981" />
                <Text style={styles.infiniteText}>Cheksiz</Text>
              </View>
            </View>
            <Text style={styles.userName}>{user?.name || "O'qituvchi"}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleReturnToHome}>
          <Feather name="log-out" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* TAB CONTENTS */}
      <View style={{ flex: 1 }}>

        {/* 1. BOSH SAHIFA (HOME) */}
        {activeTab === 'home' && (
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* HERO BANNER CARD */}
            <View style={styles.heroCard}>
              <LinearGradient
                colors={['#1E1035', '#0D0D1F']}
                style={styles.heroGradient}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1, paddingRight: 15 }}>
                    <Text style={styles.heroTitle}>O'qituvchi Portali 🎓</Text>
                    <Text style={styles.heroSub}>
                      Xush kelibsiz! Barcha mashqlar va imkoniyatlar siz uchun cheksiz rejimda ochiq.
                    </Text>
                  </View>
                  <View style={styles.heroIconBox}>
                    <MaterialCommunityIcons name="school-outline" size={40} color="#A855F7" />
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* QUICK ACTIONS GRID */}
            <Text style={styles.sectionTitle}>Tezkor bo'limlar</Text>
            <View style={styles.actionGrid}>
              <TouchableOpacity 
                style={styles.actionCard} 
                activeOpacity={0.8}
                onPress={() => setActiveTab('exercise')}
              >
                <LinearGradient colors={['rgba(168, 85, 247, 0.2)', 'rgba(168, 85, 247, 0.05)']} style={styles.actionGradient}>
                  <MaterialCommunityIcons name="brain" size={32} color="#A855F7" />
                  <Text style={styles.actionTitle}>Mashqlar</Text>
                  <Text style={styles.actionDesc}>3 ta mashq turi cheksiz</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionCard} 
                activeOpacity={0.8}
                onPress={() => setActiveTab('ranking')}
              >
                <LinearGradient colors={['rgba(245, 158, 11, 0.2)', 'rgba(245, 158, 11, 0.05)']} style={styles.actionGradient}>
                  <Ionicons name="trophy" size={32} color="#F59E0B" />
                  <Text style={styles.actionTitle}>Reyting</Text>
                  <Text style={styles.actionDesc}>O'quvchilar ro'yxati</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* TEACHER INFO BOX */}
            <View style={styles.infoBanner}>
              <MaterialCommunityIcons name="shield-check" size={24} color="#10B981" style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoBannerTitle}>Tizim Ta'rif: Premium O'qituvchi</Text>
                <Text style={styles.infoBannerDesc}>
                  Sizning akkauntingizda energiya yoki XP cheklovlari mavjud emas. Xohlagan mashqingizni tanlab mashg'ulot o'tkazishingiz mumkin.
                </Text>
              </View>
            </View>
          </ScrollView>
        )}

        {/* 2. MASHQ SAHIFA (EXERCISE) */}
        {activeTab === 'exercise' && (
          <View style={{ flex: 1 }}>
            <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
              <Text style={styles.sectionTitle}>Mashq turini tanlang</Text>
              
              {/* 3 EXERCISE CARDS */}
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 15 }}>
                {/* 1. ABAKUS */}
                <TouchableOpacity 
                  style={[styles.exTabCard, activeExerciseType === 'abacus' && styles.exTabCardActive]}
                  onPress={() => setActiveExerciseType('abacus')}
                >
                  <MaterialCommunityIcons name="abacus" size={26} color={activeExerciseType === 'abacus' ? '#A855F7' : '#9CA3AF'} />
                  <Text style={[styles.exTabCardText, activeExerciseType === 'abacus' && styles.exTabCardTextActive]}>Abakus</Text>
                </TouchableOpacity>

                {/* 2. TASAVVUR (ODDIY HISOB) */}
                <TouchableOpacity 
                  style={[styles.exTabCard, activeExerciseType === 'calc' && styles.exTabCardActive]}
                  onPress={() => setActiveExerciseType('calc')}
                >
                  <MaterialCommunityIcons name="calculator" size={26} color={activeExerciseType === 'calc' ? '#22C55E' : '#9CA3AF'} />
                  <Text style={[styles.exTabCardText, activeExerciseType === 'calc' && styles.exTabCardTextActive]}>Tasavvur</Text>
                </TouchableOpacity>

                {/* 3. KO'PAYTIRISH VA BO'LISH */}
                <TouchableOpacity 
                  style={[styles.exTabCard, activeExerciseType === 'speed' && styles.exTabCardActive]}
                  onPress={() => setActiveExerciseType('speed')}
                >
                  <MaterialCommunityIcons name="lightning-bolt" size={26} color={activeExerciseType === 'speed' ? '#3B82F6' : '#9CA3AF'} />
                  <Text style={[styles.exTabCardText, activeExerciseType === 'speed' && styles.exTabCardTextActive, { textAlign: 'center' }]}>Ko'paytirish va bo'lish</Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
              {/* 1. ABAKUS TAB CONTENT */}
              {activeExerciseType === 'abacus' && (
                <View style={{ marginTop: 10 }}>
                  <View style={{ backgroundColor: '#0D0D1F', padding: 20, borderWidth: 1.5, borderColor: 'rgba(168, 85, 247, 0.3)', borderRadius: 18, marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <Text style={{ color: '#FFF', fontSize: 16, fontFamily: 'Inter_700Bold' }}>ABAKUS (SOROBAN) HAQIDA</Text>
                      <MaterialCommunityIcons name="information-outline" size={20} color="#9CA3AF" />
                    </View>
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ flex: 1, height: 110 }}>
                        <Image source={require('../assets/abacus_info.png')} style={{ width: '100%', height: '100%' }} contentFit="contain" />
                      </View>
                      <View style={{ flex: 1, paddingLeft: 12 }}>
                        <Text style={{ fontSize: 12, lineHeight: 18, color: '#D1D5DB' }}>
                          Yuqori qatordagi 1 ta boncuk – 5 qiymatni, pastki qatordagi 4 ta boncuk – 1 qiymatni bildiradi.
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ height: 110 }} />
                </View>
              )}

              {/* 2. ODDIY HISOB & TEZKOR HISOB CONFIGURATION CARDS */}
              {(activeExerciseType === 'calc' || activeExerciseType === 'speed') && (
                <>
                  {/* HADLAR SONI SECTION */}
                  <View style={styles.configBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(168, 85, 247, 0.15)', justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="format-list-bulleted" size={20} color="#A855F7" />
                      </View>
                      <View>
                        <Text style={styles.configTitle}>HADLAR SONI</Text>
                        <Text style={{ color: '#6B7280', fontSize: 11, fontFamily: 'Inter_500Medium' }}>5 dan 25 hadgacha tanlang</Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      {[5, 10, 15, 20, 25].map(c => (
                        <TouchableOpacity 
                          key={c}
                          style={[styles.digitBtn, exampleCount === c && styles.digitBtnActive]}
                          onPress={() => setExampleCount(c)}
                        >
                          <Text style={[styles.digitBtnText, exampleCount === c && styles.digitBtnTextActive]}>{c} had</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* AMALLAR SECTION */}
                  <View style={styles.configBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(168, 85, 247, 0.15)', justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="calculator-variant" size={20} color="#A855F7" />
                      </View>
                      <View>
                        <Text style={styles.configTitle}>AMALLAR</Text>
                        <Text style={{ color: '#6B7280', fontSize: 11, fontFamily: 'Inter_500Medium' }}>Amallar turini tanlang</Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      {/* Oddiy */}
                      <TouchableOpacity 
                        style={[styles.opCard, selectedOpType === 'oddiy' && styles.opCardActive]}
                        onPress={() => setSelectedOpType('oddiy')}
                        activeOpacity={0.8}
                      >
                        {selectedOpType === 'oddiy' && (
                          <View style={styles.opCheckBadge}>
                            <MaterialCommunityIcons name="check" size={10} color="#FFF" />
                          </View>
                        )}
                        <MaterialCommunityIcons name="plus" size={26} color={selectedOpType === 'oddiy' ? '#A855F7' : '#9CA3AF'} />
                        <Text style={[styles.opCardText, selectedOpType === 'oddiy' && styles.opCardTextActive]}>Oddiy</Text>
                      </TouchableOpacity>

                      {/* Formula 5 */}
                      <TouchableOpacity 
                        style={[styles.opCard, selectedOpType === 'f5' && styles.opCardActive]}
                        onPress={() => setSelectedOpType('f5')}
                        activeOpacity={0.8}
                      >
                        {selectedOpType === 'f5' && (
                          <View style={styles.opCheckBadge}>
                            <MaterialCommunityIcons name="check" size={10} color="#FFF" />
                          </View>
                        )}
                        <Text style={[styles.opFormulaIcon, selectedOpType === 'f5' && { color: '#A855F7' }]}>f(x)</Text>
                        <Text style={[styles.opCardText, selectedOpType === 'f5' && styles.opCardTextActive]}>Formula 5</Text>
                      </TouchableOpacity>

                      {/* Formula 10 */}
                      <TouchableOpacity 
                        style={[styles.opCard, selectedOpType === 'f10' && styles.opCardActive]}
                        onPress={() => setSelectedOpType('f10')}
                        activeOpacity={0.8}
                      >
                        {selectedOpType === 'f10' && (
                          <View style={styles.opCheckBadge}>
                            <MaterialCommunityIcons name="check" size={10} color="#FFF" />
                          </View>
                        )}
                        <Text style={[styles.opFormulaIcon, selectedOpType === 'f10' && { color: '#A855F7' }]}>f(x)</Text>
                        <Text style={[styles.opCardText, selectedOpType === 'f10' && styles.opCardTextActive]}>Formula 10</Text>
                      </TouchableOpacity>

                      {/* Aralash */}
                      <TouchableOpacity 
                        style={[styles.opCard, selectedOpType === 'aralash' && styles.opCardActive]}
                        onPress={() => setSelectedOpType('aralash')}
                        activeOpacity={0.8}
                      >
                        {selectedOpType === 'aralash' && (
                          <View style={styles.opCheckBadge}>
                            <MaterialCommunityIcons name="check" size={10} color="#FFF" />
                          </View>
                        )}
                        <MaterialCommunityIcons name="shuffle-variant" size={24} color={selectedOpType === 'aralash' ? '#A855F7' : '#9CA3AF'} />
                        <Text style={[styles.opCardText, selectedOpType === 'aralash' && styles.opCardTextActive]}>Aralash</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* TEZLIK SECTION */}
                  <View style={styles.configBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(168, 85, 247, 0.15)', justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="lightning-bolt" size={20} color="#A855F7" />
                      </View>
                      <View>
                        <Text style={styles.configTitle}>TEZLIK</Text>
                        <Text style={{ color: '#6B7280', fontSize: 11, fontFamily: 'Inter_500Medium' }}>Mashq bajarish tezligini tanlang</Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      {[0.5, 1, 1.5, 2].map(s => (
                        <TouchableOpacity 
                          key={s}
                          style={[styles.digitBtn, selectedSpeed === s && styles.digitBtnActive]}
                          onPress={() => setSelectedSpeed(s)}
                        >
                          <Text style={[styles.digitBtnText, selectedSpeed === s && styles.digitBtnTextActive]}>{s} soniya</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* SON XONASI SECTION */}
                  <View style={styles.configBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(168, 85, 247, 0.15)', justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="numeric" size={20} color="#A855F7" />
                      </View>
                      <View>
                        <Text style={styles.configTitle}>SON XONASI</Text>
                        <Text style={{ color: '#6B7280', fontSize: 11, fontFamily: 'Inter_500Medium' }}>Qatnashadigan sonlar xonasini tanlang</Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      {[1, 2, 3, 4].map(d => (
                        <TouchableOpacity 
                          key={d}
                          style={[styles.digitBtn, selectedDigits === d && styles.digitBtnActive]}
                          onPress={() => setSelectedDigits(d)}
                        >
                          <Text style={[styles.digitBtnText, selectedDigits === d && styles.digitBtnTextActive]}>{d} xonali</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={{ height: 110 }} />
                </>
              )}
            </ScrollView>

            {/* STICKY BOTTOM BUTTON ABOVE NAVBAR */}
            <View style={styles.bottomBtnContainer}>
              {activeExerciseType === 'abacus' ? (
                <TouchableOpacity 
                  style={styles.primaryBtn} 
                  activeOpacity={0.8} 
                  onPress={() => navigation.navigate('AbacusSimulator', { language })}
                >
                  <MaterialCommunityIcons name="lightning-bolt" size={24} color="#FFF" />
                  <Text style={styles.primaryBtnText}>ABAKUSNI OCHISH</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8} onPress={handleStartExercise}>
                  <MaterialCommunityIcons name="lightning-bolt" size={24} color="#FFF" />
                  <Text style={styles.primaryBtnText}>MASHQNI BOSHLASH</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* 3. STATISTIKALAR SAHIFA (STATS) */}
        {activeTab === 'stats' && (
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Statistikalar</Text>
            
            <View style={styles.statsCardGrid}>
              <View style={styles.statBoxCard}>
                <MaterialCommunityIcons name="brain" size={28} color="#A855F7" />
                <Text style={styles.statBoxNum}>0%</Text>
                <Text style={styles.statBoxLabel}>Mantiq</Text>
              </View>

              <View style={styles.statBoxCard}>
                <MaterialCommunityIcons name="lightning-bolt" size={28} color="#FBBF24" />
                <Text style={styles.statBoxNum}>0.0s</Text>
                <Text style={styles.statBoxLabel}>Tezlik</Text>
              </View>

              <View style={styles.statBoxCard}>
                <MaterialCommunityIcons name="bullseye-arrow" size={28} color="#10B981" />
                <Text style={styles.statBoxNum}>0%</Text>
                <Text style={styles.statBoxLabel}>Aniqlik</Text>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Faoliyat tarixi</Text>
            <View style={styles.emptyHistoryBox}>
              <Feather name="clock" size={36} color="#4B5563" style={{ marginBottom: 10 }} />
              <Text style={{ color: '#9CA3AF', fontSize: 14, fontFamily: 'Inter_500Medium' }}>Faoliyat tarixi mavjud emas</Text>
              <Text style={{ color: '#6B7280', fontSize: 12, textAlign: 'center', marginTop: 4 }}>
                Mashqlarni bajarib tugatganingizdan so'ng natijalaringiz shu yerda ko'rinadi.
              </Text>
            </View>
          </ScrollView>
        )}

        {/* 4. REYTING SAHIFA (RANKING) */}
        {activeTab === 'ranking' && (
          <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10 }}>
            <Text style={styles.sectionTitle}>{t.rankingTitle || "REYTING"}</Text>
            
            <View style={styles.searchBar}>
              <Feather name="search" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
              <TextInput
                style={{ flex: 1, color: '#FFF', fontSize: 14 }}
                placeholder={t.searchPlaceholder || "Foydalanuvchi qidirish..."}
                placeholderTextColor="#6B7280"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
              {filteredLeaderboard.length === 0 ? (
                <View style={styles.emptyHistoryBox}>
                  <Text style={{ color: '#9CA3AF' }}>O'quvchilar topilmadi</Text>
                </View>
              ) : (
                filteredLeaderboard.map((item) => (
                  <View key={item.customId} style={styles.rankRow}>
                    <Text style={styles.rankNum}>#{item.rank}</Text>
                    <Image source={item.avatar} style={styles.rankAvatar} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.rankName}>{item.name}</Text>
                      <Text style={styles.rankXp}>{item.xp} XP</Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        )}

        {/* 5. PROFILE SAHIFA (PROFILE) */}
        {activeTab === 'profile' && (
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* PRO CARD */}
            <View style={styles.profileCard}>
              <View style={styles.profileAvatarBox}>
                <Feather name="user" size={40} color="#A855F7" />
              </View>
              <Text style={styles.profileName}>{user?.name || "O'qituvchi"}</Text>
              <Text style={styles.profileTag}>{user?.email || "oqituvchi@iqromax.net"}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>O'QITUVCHI AKKAUNTI</Text>
              </View>
            </View>

            {/* DETAILS BOX */}
            <View style={styles.detailsBox}>
              <View style={styles.detailItem}>
                <Feather name="phone" size={18} color="#9CA3AF" />
                <Text style={styles.detailText}>{user?.phone || "+998 -- --- -- --"}</Text>
              </View>

              <View style={styles.detailItem}>
                <Feather name="mail" size={18} color="#9CA3AF" />
                <Text style={styles.detailText}>{user?.email || "Email mavjud emas"}</Text>
              </View>
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
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('home')}
        >
          <Feather name="home" size={22} color={activeTab === 'home' ? '#A855F7' : '#6B7280'} />
          <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>Bosh sahifa</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('exercise')}
        >
          <MaterialCommunityIcons name="brain" size={24} color={activeTab === 'exercise' ? '#A855F7' : '#6B7280'} />
          <Text style={[styles.navText, activeTab === 'exercise' && styles.navTextActive]}>Mashq</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('stats')}
        >
          <Feather name="bar-chart-2" size={22} color={activeTab === 'stats' ? '#A855F7' : '#6B7280'} />
          <Text style={[styles.navText, activeTab === 'stats' && styles.navTextActive]}>Statistika</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('ranking')}
        >
          <Ionicons name="trophy-outline" size={22} color={activeTab === 'ranking' ? '#A855F7' : '#6B7280'} />
          <Text style={[styles.navText, activeTab === 'ranking' && styles.navTextActive]}>Reyting</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setActiveTab('profile')}
        >
          <Feather name="user" size={22} color={activeTab === 'profile' ? '#A855F7' : '#6B7280'} />
          <Text style={[styles.navText, activeTab === 'profile' && styles.navTextActive]}>Profil</Text>
        </TouchableOpacity>
      </View>

      {/* REAL-TIME ACCOUNT DELETED ALERT MODAL */}
      <Modal visible={isDeletedModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconBox}>
              <MaterialCommunityIcons name="account-remove-outline" size={40} color="#EF4444" />
            </View>
            <Text style={styles.modalTitleText}>Hisobingiz O'chirildi</Text>
            <Text style={styles.modalDescText}>
              Sizning hisobingiz admin tomonidan o'chirildi. Qo'shimcha ma'lumot uchun admin bilan bog'laning.
            </Text>
            <TouchableOpacity activeOpacity={0.8} style={styles.modalCloseBtn} onPress={handleReturnToHome}>
              <MaterialCommunityIcons name="home-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.modalCloseBtnText}>Bosh sahifaga qaytish</Text>
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
    paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1A1A2E'
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarBox: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(168, 85, 247, 0.15)',
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#A855F7'
  },
  welcomeText: { color: '#9CA3AF', fontSize: 11, fontFamily: 'Inter_500Medium' },
  userName: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Inter_700Bold' },
  infiniteBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.3)'
  },
  infiniteText: { color: '#10B981', fontSize: 10, fontFamily: 'Inter_700Bold' },
  logoutBtn: {
    padding: 8, borderRadius: 10, backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)'
  },
  scrollContent: { flex: 1, paddingHorizontal: 20, paddingTop: 14 },
  heroCard: { borderRadius: 20, overflow: 'hidden', marginBottom: 20 },
  heroGradient: { padding: 20 },
  heroTitle: { color: '#FFFFFF', fontSize: 20, fontFamily: 'Inter_700Bold', marginBottom: 6 },
  heroSub: { color: '#D1D5DB', fontSize: 13, lineHeight: 18 },
  heroIconBox: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(168, 85, 247, 0.2)',
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#A855F7'
  },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontFamily: 'Inter_700Bold', marginBottom: 12 },
  actionGrid: { flexDirection: 'row', gap: 14, marginBottom: 20 },
  actionCard: { flex: 1, borderRadius: 18, overflow: 'hidden' },
  actionGradient: { padding: 18, alignItems: 'center' },
  actionTitle: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Inter_700Bold', marginTop: 10 },
  actionDesc: { color: '#9CA3AF', fontSize: 11, textAlign: 'center', marginTop: 4 },
  infoBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#0D0D1F',
    borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1A1A35', marginBottom: 30
  },
  infoBannerTitle: { color: '#FFFFFF', fontSize: 14, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  infoBannerDesc: { color: '#9CA3AF', fontSize: 12, lineHeight: 17 },
  
  // EXERCISE TAB STYLES
  exTabCard: {
    flex: 1, backgroundColor: '#0D0D1F', borderRadius: 14, paddingVertical: 14,
    alignItems: 'center', borderWidth: 1, borderColor: '#1A1A35'
  },
  exTabCardActive: { borderColor: '#A855F7', backgroundColor: 'rgba(168, 85, 247, 0.15)' },
  exTabCardText: { color: '#9CA3AF', fontSize: 12, fontFamily: 'Inter_600SemiBold', marginTop: 6 },
  exTabCardTextActive: { color: '#FFFFFF' },
  configBox: { backgroundColor: '#0D0D1F', padding: 16, borderRadius: 16, marginBottom: 14, borderWidth: 1, borderColor: '#1A1A35' },
  configTitle: { color: '#9CA3AF', fontSize: 12, fontFamily: 'Inter_700Bold' },
  digitBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#121228', alignItems: 'center', borderWidth: 1, borderColor: '#1A1A35' },
  digitBtnActive: { backgroundColor: '#A855F7', borderColor: '#A855F7' },
  digitBtnText: { color: '#9CA3AF', fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  digitBtnTextActive: { color: '#FFFFFF' },
  bottomBtnContainer: { position: 'absolute', bottom: 10, left: 20, right: 20 },
  primaryBtn: {
    flexDirection: 'row', backgroundColor: '#A855F7', paddingVertical: 16,
    borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 8
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Inter_700Bold' },

  // STATS STYLES
  statsCardGrid: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statBoxCard: {
    flex: 1, backgroundColor: '#0D0D1F', borderRadius: 16, padding: 16,
    alignItems: 'center', borderWidth: 1, borderColor: '#1A1A35'
  },
  statBoxNum: { color: '#FFFFFF', fontSize: 18, fontFamily: 'Inter_700Bold', marginTop: 8 },
  statBoxLabel: { color: '#9CA3AF', fontSize: 12, marginTop: 2 },
  emptyHistoryBox: {
    backgroundColor: '#0D0D1F', borderRadius: 18, padding: 30, alignItems: 'center',
    borderWidth: 1, borderColor: '#1A1A35', marginTop: 10
  },

  // RANKING STYLES
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#0D0D1F',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: '#1A1A35', marginBottom: 14
  },
  rankRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#0D0D1F',
    padding: 14, borderRadius: 14, marginBottom: 8, borderWidth: 1, borderColor: '#1A1A35'
  },
  rankNum: { color: '#A855F7', fontSize: 14, fontFamily: 'Inter_700Bold', width: 32 },
  rankAvatar: { width: 40, height: 40, borderRadius: 20 },
  opCard: {
    flex: 1, backgroundColor: '#121228', borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1A1A35',
    position: 'relative'
  },
  opCardActive: { borderColor: '#A855F7', backgroundColor: 'rgba(168, 85, 247, 0.2)' },
  opCheckBadge: {
    position: 'absolute', top: 6, right: 6, backgroundColor: '#A855F7',
    borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center'
  },
  opFormulaIcon: { color: '#9CA3AF', fontSize: 16, fontFamily: 'Inter_700Bold' },
  opCardText: { color: '#9CA3AF', fontSize: 11, fontFamily: 'Inter_600SemiBold', marginTop: 4 },
  opCardTextActive: { color: '#FFFFFF' },

  // PROFILE STYLES
  profileCard: {
    backgroundColor: '#0D0D1F', borderRadius: 24, padding: 24, alignItems: 'center',
    borderWidth: 1, borderColor: '#1A1A35', marginBottom: 16
  },
  profileAvatarBox: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(168, 85, 247, 0.15)',
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#A855F7', marginBottom: 12
  },
  profileName: { color: '#FFFFFF', fontSize: 20, fontFamily: 'Inter_700Bold' },
  profileTag: { color: '#9CA3AF', fontSize: 13, marginTop: 2 },
  roleBadge: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)', paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 8, marginTop: 12, borderWidth: 1, borderColor: '#A855F7'
  },
  roleBadgeText: { color: '#A855F7', fontSize: 10, fontFamily: 'Inter_700Bold' },
  detailsBox: {
    backgroundColor: '#0D0D1F', borderRadius: 18, padding: 18, gap: 14,
    borderWidth: 1, borderColor: '#1A1A35', marginBottom: 20
  },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  detailText: { color: '#FFFFFF', fontSize: 14 },
  logoutFullBtn: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingVertical: 14, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)', marginBottom: 30
  },

  // BOTTOM NAV
  bottomNav: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    paddingVertical: 10, backgroundColor: '#05050C', borderTopWidth: 1, borderTopColor: '#1A1A2E'
  },
  navItem: { alignItems: 'center' },
  navText: { color: '#6B7280', fontSize: 10, fontFamily: 'Inter_500Medium', marginTop: 4 },
  navTextActive: { color: '#A855F7' },

  // MODAL
  modalOverlay: { flex: 1, backgroundColor: 'rgba(5, 5, 12, 0.88)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { width: '100%', backgroundColor: '#0D0D1A', borderRadius: 28, padding: 28, alignItems: 'center', borderWidth: 1.5, borderColor: '#EF4444' },
  modalIconBox: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(239, 68, 68, 0.12)', justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1.5, borderColor: '#EF4444' },
  modalTitleText: { color: '#FFFFFF', fontSize: 22, fontFamily: 'Inter_700Bold', textAlign: 'center', marginBottom: 12 },
  modalDescText: { color: '#9CA3AF', fontSize: 14, textAlign: 'center', marginBottom: 28, lineHeight: 22 },
  modalCloseBtn: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16, backgroundColor: '#EF4444' },
  modalCloseBtnText: { color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 16 },
});
