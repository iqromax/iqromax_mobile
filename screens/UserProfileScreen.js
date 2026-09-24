import React, { useState, useEffect } from 'react';
import {  View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Alert, Dimensions, Platform , Modal } from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Line, Polygon, Circle, Path, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Character3DViewer } from '../components/Character3DViewer';
import { API_URL, SOCKET_URL } from '../src/config/api';
import io from 'socket.io-client';

const { width } = Dimensions.get('window');

const translations = {
  uz: { title: "REYTING", subtitle: "Eng kuchli matematiklar", quote1: "\"Doim oldinga! 💪\"", streak: "Seriya", accuracy: "Aniqlik", wins: "G'alabalar", totalGames: "Jami o'yinlar", chat: "Chat", pending: "Kutilmoqda", follow: "Follow", levelProgress: "Daraja rivojlanishi", playStyle: "O'yin uslubi", logic: "Mantiq", speed: "Tezlik", strategy: "Strategiya", memory: "Xotira", bestResult: "Eng yaxshi natija", noData: "Ma'lumot yo'q", currentStreak: "Hozirgi seriya", games: "o'yin", record: "Rekord:", quote2: "\"Har kuni biroz yaxshiroq bo'l!\"", gotIt: "Tushunarli", error: "Xatolik", networkError: "Tarmoq xatosi", reqSent: "Do'stlik so'rovi yuborildi!", success: "Muvaffaqiyat" },
  en: { title: "RANKING", subtitle: "The strongest mathematicians", quote1: "\"Always forward! 💪\"", streak: "Streak", accuracy: "Accuracy", wins: "Victories", totalGames: "Total games", chat: "Chat", pending: "Pending", follow: "Follow", levelProgress: "Level progress", playStyle: "Play style", logic: "Logic", speed: "Speed", strategy: "Strategy", memory: "Memory", bestResult: "Best result", noData: "No data", currentStreak: "Current streak", games: "games", record: "Record:", quote2: "\"Be a little better every day!\"", gotIt: "Got it", error: "Error", networkError: "Network error", reqSent: "Friend request sent!", success: "Success" },
  ru: { title: "РЕЙТИНГ", subtitle: "Сильнейшие математики", quote1: "\"Только вперед! 💪\"", streak: "Серия", accuracy: "Точность", wins: "Победы", totalGames: "Всего игр", chat: "Чат", pending: "В ожидании", follow: "Подписаться", levelProgress: "Прогресс уровня", playStyle: "Стиль игры", logic: "Логика", speed: "Скорость", strategy: "Стратегия", memory: "Память", bestResult: "Лучший результат", noData: "Нет данных", currentStreak: "Текущая серия", games: "игр", record: "Рекорд:", quote2: "\"Становись лучше каждый день!\"", gotIt: "Понятно", error: "Ошибка", networkError: "Ошибка сети", reqSent: "Запрос отправлен!", success: "Успех" },
  ar: { title: "التصنيف", subtitle: "أقوى علماء الرياضيات", quote1: "\"دائماً إلى الأمام! 💪\"", streak: "سلسلة", accuracy: "الدقة", wins: "انتصارات", totalGames: "إجمالي الألعاب", chat: "دردشة", pending: "قيد الانتظار", follow: "متابعة", levelProgress: "تقدم المستوى", playStyle: "أسلوب اللعب", logic: "المنطق", speed: "السرعة", strategy: "استراتيجية", memory: "الذاكرة", bestResult: "أفضل نتيجة", noData: "لا توجد بيانات", currentStreak: "السلسلة الحالية", games: "ألعاب", record: "رقم قياسي:", quote2: "\"كن أفضل قليلاً كل يوم!\"", gotIt: "مفهوم", error: "خطأ", networkError: "خطأ في الشبكة", reqSent: "تم الإرسال!", success: "نجاح" },
  tr: { title: "SIRALAMA", subtitle: "En güçlü matematikçiler", quote1: "\"Daima ileri! 💪\"", streak: "Seri", accuracy: "Doğruluk", wins: "Zaferler", totalGames: "Toplam oyun", chat: "Sohbet", pending: "Bekliyor", follow: "Takip Et", levelProgress: "Seviye ilerlemesi", playStyle: "Oyun stili", logic: "Mantık", speed: "Hız", strategy: "Strateji", memory: "Hafıza", bestResult: "En iyi sonuç", noData: "Veri yok", currentStreak: "Mevcut seri", games: "oyun", record: "Rekor:", quote2: "\"Her gün biraz daha iyi ol!\"", gotIt: "Anladım", error: "Hata", networkError: "Ağ hatası", reqSent: "İstek gönderildi!", success: "Başarı" },
  zh: { title: "排名", subtitle: "最强的数学家", quote1: "\"永远向前！💪\"", streak: "连胜", accuracy: "准确率", wins: "胜利", totalGames: "总游戏数", chat: "聊天", pending: "等待中", follow: "关注", levelProgress: "等级进度", playStyle: "游戏风格", logic: "逻辑", speed: "速度", strategy: "策略", memory: "记忆", bestResult: "最佳结果", noData: "暂无数据", currentStreak: "当前连胜", games: "场游戏", record: "纪录:", quote2: "\"每天进步一点点！\"", gotIt: "明白了", error: "错误", networkError: "网络错误", reqSent: "已发送！", success: "成功" },
  ky: { title: "РЕЙТИНГ", subtitle: "Эң күчтүү математиктер", quote1: "\"Дайыма алдыга! 💪\"", streak: "Серия", accuracy: "Тактык", wins: "Жеңиштер", totalGames: "Жалпы оюндар", chat: "Чат", pending: "Күтүлүүдө", follow: "Жазылуу", levelProgress: "Деңгээлдин өсүшү", playStyle: "Оюн стили", logic: "Логика", speed: "Ылдамдык", strategy: "Стратегия", memory: "Эс тутум", bestResult: "Эң жакшы натыйжа", noData: "Маалымат жок", currentStreak: "Учурдагы серия", games: "оюн", record: "Рекорд:", quote2: "\"Күн сайын бир аз жакшыраак бол!\"", gotIt: "Түшүнүктүү", error: "Ката", networkError: "Тармак катасы", reqSent: "Сурам жөнөтүлдү!", success: "Ийгилик" },
  kk: { title: "РЕЙТИНГ", subtitle: "Ең мықты математиктер", quote1: "\"Әрдайым алға! 💪\"", streak: "Серия", accuracy: "Дәлдік", wins: "Жеңістер", totalGames: "Жалпы ойындар", chat: "Чат", pending: "Күтілуде", follow: "Жазылу", levelProgress: "Деңгейдің өсуі", playStyle: "Ойын стилі", logic: "Логика", speed: "Жылдамдық", strategy: "Стратегия", memory: "Жад", bestResult: "Ең жақсы нәтиже", noData: "Мәлімет жоқ", currentStreak: "Ағымдағы серия", games: "ойын", record: "Рекорд:", quote2: "\"Күн сайын сәл жақсырақ бол!\"", gotIt: "Түсінікті", error: "Қате", networkError: "Желі қатесі", reqSent: "Сұраныс жіберілді!", success: "Сәттілік" },
  tg: { title: "РЕЙТИНГ", subtitle: "Қавитарин риёзидонон", quote1: "\"Ҳамеша ба пеш! 💪\"", streak: "Силсила", accuracy: "Дақиқият", wins: "Ғалабаҳо", totalGames: "Ҳамаи бозиҳо", chat: "Чат", pending: "Дар интизорӣ", follow: "Пайравӣ кардан", levelProgress: "Пешрафти сатҳ", playStyle: "Услуби бозӣ", logic: "Мантиқ", speed: "Суръат", strategy: "Стратегия", memory: "Хотира", bestResult: "Беҳтарин натиҷа", noData: "Маълумот нест", currentStreak: "Силсилаи ҷорӣ", games: "бозӣ", record: "Рекорд:", quote2: "\"Ҳар рӯз каме беҳтар шав!\"", gotIt: "Фаҳмо", error: "Хатогӣ", networkError: "Хатогии шабака", reqSent: "Дархост фиристода шуд!", success: "Муваффақият" },
  hi: { title: "रैंकिंग", subtitle: "सबसे मजबूत गणितज्ञ", quote1: "\"हमेशा आगे! 💪\"", streak: "लगातार", accuracy: "सटीकता", wins: "जीत", totalGames: "कुल खेल", chat: "चैट", pending: "लंबित", follow: "फ़ॉलो करें", levelProgress: "स्तर की प्रगति", playStyle: "खेलने की शैली", logic: "तर्क", speed: "गति", strategy: "रणनीति", memory: "स्मृति", bestResult: "सर्वश्रेष्ठ परिणाम", noData: "कोई डेटा नहीं", currentStreak: "वर्तमान स्ट्रीक", games: "खेल", record: "रिकॉर्ड:", quote2: "\"हर दिन थोड़ा बेहतर बनें!\"", gotIt: "समझ गया", error: "त्रुटि", networkError: "नेटवर्क त्रुटि", reqSent: "अनुरोध भेजा गया!", success: "सफलता" },
  ur: { title: "رینکنگ", subtitle: "سب سے مضبوط ریاضی دان", quote1: "\"ہمیشہ آگے! 💪\"", streak: "مسلسل", accuracy: "درستگی", wins: "فتوحات", totalGames: "کل کھیل", chat: "چیٹ", pending: "زیر التواء", follow: "فالو کریں", levelProgress: "سطح کی ترقی", playStyle: "کھیلنے کا انداز", logic: "منطق", speed: "رفتار", strategy: "حکمت عملی", memory: "یادداشت", bestResult: "بہترین نتیجہ", noData: "کوئی ڈیٹا نہیں", currentStreak: "موجودہ سلسلہ", games: "کھیل", record: "ریکارڈ:", quote2: "\"ہر دن تھوڑا بہتر بنیں!\"", gotIt: "سمجھ گیا", error: "غلطی", networkError: "خرابی", reqSent: "درخواست بھیجی گئی!", success: "کامیابی" }
};

// Helper to determine rank based on XP
const getRankInfo = (xp) => {
  if (xp >= 10000) return { name: 'CHAMPION', color: '#F59E0B', stars: 3, icon: 'shield-crown' };
  if (xp >= 5000) return { name: 'DIAMOND', color: '#38BDF8', stars: 3, icon: 'shield-star' };
  if (xp >= 2000) return { name: 'PLATINUM', color: '#A855F7', stars: 2, icon: 'shield-star' };
  if (xp >= 1000) return { name: 'GOLD', color: '#FCD34D', stars: 1, icon: 'shield-star' };
  if (xp >= 500) return { name: 'SILVER', color: '#9CA3AF', stars: 2, icon: 'shield-outline' };
  return { name: 'BRONZE', color: '#D97706', stars: 1, icon: 'shield-outline' };
};

export default function UserProfileScreen({ route, navigation }) {
  const { user, selectedUser, selectedUserSkins, language } = route.params;
  const t = translations[language] || translations[user?.language] || translations['uz'];
  const [activeTab, setActiveTab] = useState('statistika');

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '', type: 'success' });
  const [followState, setFollowState] = useState('loading');

  const showCustomAlert = (title, message, type = 'success') => {
    setAlertMessage({ title, message, type });
    setAlertVisible(true);
  };
    
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user?.customId || !selectedUser?.customId) {
        setFollowState('none');
        return;
      }
      try {
        const friendsRes = await fetch(`${API_URL}/user/friends/${encodeURIComponent(user.customId)}`);
        if (friendsRes.ok) {
          const friendsList = await friendsRes.json();
          if (friendsList.some(f => f.customId === selectedUser.customId)) {
            setFollowState('friends');
            return;
          }
        }
        
        const reqsRes = await fetch(`${API_URL}/user/friend-requests/${encodeURIComponent(selectedUser.customId)}`);
        if (reqsRes.ok) {
          const reqsList = await reqsRes.json();
          if (reqsList.some(r => (r.senderId === user.customId || r.customId === user.customId) && r.status !== 'REJECTED' && r.status !== 'rejected')) {
            setFollowState('pending');
            return;
          }
        }
        setFollowState('none');
      } catch(e) {
        setFollowState('none');
      }
    };
    checkFollowStatus();
  }, [user?.customId, selectedUser?.customId]);
    
  useEffect(() => {
    if (!user?.customId || !selectedUser?.customId) return;
    
    const socket = io(SOCKET_URL, {
      path: '/api/socket.io',
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      socket.emit('register', user.customId);
    });

    socket.on('friend_request_handled', (data) => {
      if ((data.senderId === user.customId && data.receiverId === selectedUser.customId) ||
          (data.receiverId === user.customId && data.senderId === selectedUser.customId)) {
        if (data.action === 'ACCEPT') {
          setFollowState('friends');
        } else if (data.action === 'REJECT') {
          setFollowState('none');
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.customId, selectedUser?.customId]);


  
  const [characterPath, setCharacterPath] = useState(null);
  const [accessoryPath, setAccessoryPath] = useState(null);
  const [topsPath, setTopsPath] = useState(null);
  const [headwearPath, setHeadwearPath] = useState(null);
  const [pantsPath, setPantsPath] = useState(null);
  const [shoesPath, setShoesPath] = useState(null);
  const [backpackPath, setBackpackPath] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/inventory-skins`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        
        const getModelPath = (itemId) => {
          const item = data.find(i => String(i.id) === String(itemId));
          if (item && item.modelUrl) {
            return `${API_URL.replace(/\/api\/?$/, '')}${item.modelUrl}`;
          }
          return null;
        };

        let avatar = null;
        if (selectedUserSkins?.avatarIndex) {
          avatar = data.find(i => String(i.id) === String(selectedUserSkins.avatarIndex) && i.category === 'personajlar');
        }
        if (!avatar) {
           avatar = data.find(i => i.category === 'personajlar');
        }
        if (avatar && avatar.modelUrl) {
          setCharacterPath(`${API_URL.replace(/\/api\/?$/, '')}${avatar.modelUrl}`);
        }

        if (selectedUserSkins?.accessories?.[0]) setAccessoryPath(getModelPath(selectedUserSkins.accessories[0]));
        if (selectedUserSkins?.tops?.[0]) setTopsPath(getModelPath(selectedUserSkins.tops[0]));
        if (selectedUserSkins?.headwears?.[0]) setHeadwearPath(getModelPath(selectedUserSkins.headwears[0]));
        if (selectedUserSkins?.pants?.[0]) setPantsPath(getModelPath(selectedUserSkins.pants[0]));
        if (selectedUserSkins?.shoes?.[0]) setShoesPath(getModelPath(selectedUserSkins.shoes[0]));
        if (selectedUserSkins?.backpacks?.[0]) setBackpackPath(getModelPath(selectedUserSkins.backpacks[0]));
      })
      .catch(console.error);
  }, [selectedUserSkins]);

  const handleSendFriendRequest = async (targetId) => {
    if (!user?.customId || targetId === user.customId) return;
    try {
      const res = await fetch(`${API_URL}/user/friend-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: user.customId, receiverId: targetId })
      });
      
      const data = await res.json();
      if (res.ok) {
        setFollowState('pending');
      } else {
        if (data.error && data.error.toLowerCase().includes('rad etgan')) {
          setFollowState('pending');
        } else {
          showCustomAlert(t.error, data.error || t.error, 'error');
        }
      }
    } catch (e) {
      console.error(e);
      showCustomAlert(t.error, t.networkError, 'error');
    }
  };

  if (!selectedUser) return null;

  const xp = selectedUser.xp || 0;
  const rankInfo = getRankInfo(xp);
  const nextXp = Math.ceil((xp + 1) / 1000) * 1000 || 1000;
  const progressPercent = Math.min(100, Math.max(0, (xp / nextXp) * 100));

  const lvl = selectedUser.level || Math.max(1, Math.floor(xp / 100));
  const userAccuracy = selectedUser.accuracy || selectedUser.stats?.accuracy || Math.min(100, Math.max(65, 80 + Math.floor(xp % 20)));
  const userWins = selectedUser.wins || selectedUser.stats?.wins || Math.floor(xp / 50);
  const userTotalGames = selectedUser.totalGames || selectedUser.stats?.totalGames || (userWins + Math.floor(xp / 30) + 10);
  const userStreak = selectedUser.streak || Math.floor(xp / 100) || 12;

  const logic = selectedUser.logic || Math.min(100, 60 + (xp % 40));
  const speed = selectedUser.speed || Math.min(100, 50 + (xp % 50));
  const memory = selectedUser.memory || Math.min(100, 70 + (xp % 30));
  const focus = selectedUser.focus || Math.min(100, 65 + (xp % 35));

  const p1 = `${80},${80 - 70 * (logic / 100)}`;
  const p2 = `${80 + 70 * 0.951 * (speed / 100)},${80 - 70 * 0.309 * (speed / 100)}`;
  const p3 = `${80 + 70 * 0.588 * (memory / 100)},${80 + 70 * 0.809 * (memory / 100)}`;
  const p4 = `${80 - 70 * 0.588 * (userAccuracy / 100)},${80 + 70 * 0.809 * (userAccuracy / 100)}`;
  const p5 = `${80 - 70 * 0.951 * (focus / 100)},${80 - 70 * 0.309 * (focus / 100)}`;
  const radarPoints = `${p1} ${p2} ${p3} ${p4} ${p5}`;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="trophy" size={20} color="#F59E0B" />
            <Text style={styles.headerTitle}>{t.title}</Text>
          </View>
          <Text style={styles.headerSubtitle}>{t.subtitle}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* TOP SECTION: Avatar + Info */}
        <View style={styles.topSection}>
          
          {/* LEFT: 3D Avatar Area */}
          <View style={styles.avatarArea}>
            {/* Rank Badge Removed */}

            {/* Background Pedestal */}
            <Image source={require('../assets/pedestal_bg.jpg')} style={{ position: 'absolute', width: '130%', height: '90%', bottom: -20, alignSelf: 'center', zIndex: -1 }} resizeMode="contain" />

            {/* 3D Character */}
            <View style={styles.characterContainer}>
              <View style={{ width: '100%', height: '100%', position: 'absolute', bottom: Platform.OS === 'android' ? -13 : -20, left: 0, transform: [{ scale: 1.25 }] }}>
                {characterPath ? (
                  <Character3DViewer 
                    characterPath={characterPath} 
                    accessoryPath={accessoryPath} 
                    topsPath={topsPath} 
                    headwearPath={headwearPath} 
                    pantsPath={pantsPath} 
                    shoesPath={shoesPath} 
                    backpackPath={backpackPath}
                  />
                ) : null}
              </View>
            </View>

          </View>

          {/* RIGHT: User Info */}
          <View style={styles.infoArea}>
            <Text style={styles.userName} numberOfLines={1}>{selectedUser.name}</Text>
            <Text style={styles.userHandle}>{selectedUser.customId}</Text>
            <Text style={styles.userQuote}>{t.quote1}</Text>

            {/* Rank Card */}
            <View style={styles.rankCard}>
              <MaterialCommunityIcons name={rankInfo.icon} size={36} color={rankInfo.color} style={{ marginRight: 8 }} />
              <View>
                <Text style={[styles.rankCardTitle, { color: rankInfo.color }]}>{rankInfo.name} II</Text>
                <View style={{ flexDirection: 'row', marginTop: 2 }}>
                  <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
                  <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
                  <MaterialCommunityIcons name="star" size={14} color="#4B5563" />
                </View>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: rankInfo.color }]} />
              </View>
              <Text style={styles.progressText}>{xp} / {nextXp} XP</Text>
            </View>

            {/* 4 Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <MaterialCommunityIcons name="fire" size={20} color="#EF4444" />
                <View style={{ marginLeft: 6 }}>
                  <Text style={styles.statBoxValue}>{userStreak}</Text>
                  <Text style={styles.statBoxLabel}>{t.streak}</Text>
                </View>
              </View>
              <View style={styles.statBox}>
                <MaterialCommunityIcons name="bullseye-arrow" size={20} color="#EF4444" />
                <View style={{ marginLeft: 6 }}>
                  <Text style={styles.statBoxValue}>{userAccuracy}%</Text>
                  <Text style={styles.statBoxLabel}>{t.accuracy}</Text>
                </View>
              </View>
              <View style={styles.statBox}>
                <MaterialCommunityIcons name="trophy" size={20} color="#F59E0B" />
                <View style={{ marginLeft: 6 }}>
                  <Text style={styles.statBoxValue}>{userWins}</Text>
                  <Text style={styles.statBoxLabel}>{t.wins}</Text>
                </View>
              </View>
              <View style={styles.statBox}>
                <MaterialCommunityIcons name="chart-bar" size={20} color="#3B82F6" />
                <View style={{ marginLeft: 6 }}>
                  <Text style={styles.statBoxValue}>{userTotalGames}</Text>
                  <Text style={styles.statBoxLabel} numberOfLines={1} adjustsFontSizeToFit>{t.totalGames}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Actions Row */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, marginTop: 20, gap: 10 }}>
          <TouchableOpacity 
            style={[styles.chatButton, { flex: 1, marginTop: 0, marginHorizontal: 0 }]} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ChatScreen', { friend: selectedUser })}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <MaterialCommunityIcons name="chat-processing-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.chatButtonText}>{t.chat}</Text>
            </View>
          </TouchableOpacity>
          
          {followState !== 'friends' && (
            <TouchableOpacity 
              style={[
                styles.chatButton, 
                { 
                  flex: 1, 
                  marginTop: 0, 
                  marginHorizontal: 0, 
                  backgroundColor: followState === 'pending' ? '#334155' : '#3B82F6' 
                }
              ]} 
              activeOpacity={0.8}
              disabled={followState === 'pending' || followState === 'loading'}
              onPress={() => handleSendFriendRequest(selectedUser.customId)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <MaterialCommunityIcons 
                  name={followState === 'pending' ? 'clock-outline' : 'account-plus'} 
                  size={20} 
                  color={followState === 'pending' ? '#94A3B8' : '#FFF'} 
                  style={{ marginRight: 8 }} 
                />
                <Text style={[styles.chatButtonText, followState === 'pending' && { color: '#94A3B8' }]}>
                  {followState === 'pending' ? t.pending : t.follow}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>


        
        {/* Tab Content (Tabs Removed) */}
        <View style={styles.tabContent}>
            
            <View style={styles.chartsRow}>
              {/* Line Chart Card */}
              <View style={styles.chartCard}>
                <View style={styles.chartHeader}>
                  <MaterialCommunityIcons name="chart-line-variant" size={18} color="#D8B4FE" />
                  <Text style={styles.chartTitle}>{t.levelProgress}</Text>
                </View>
                <View style={styles.lineChartArea}>
                  {/* Fake XP Tag */}
                  <View style={styles.lineChartTag}>
                    <Text style={styles.lineChartTagText}>{xp} XP</Text>
                  </View>
                  <Svg width="100%" height="100" viewBox="0 0 160 100">
                    {/* Grid */}
                    <Line x1="0" y1="20" x2="160" y2="20" stroke="#1E293B" strokeWidth="1" />
                    <Line x1="0" y1="50" x2="160" y2="50" stroke="#1E293B" strokeWidth="1" />
                    <Line x1="0" y1="80" x2="160" y2="80" stroke="#1E293B" strokeWidth="1" />
                    
                    {/* Labels */}
                    <SvgText x="5" y="23" fill="#64748B" fontSize="8">1k</SvgText>
                    <SvgText x="5" y="53" fill="#64748B" fontSize="8">500</SvgText>
                    <SvgText x="5" y="83" fill="#64748B" fontSize="8">0</SvgText>
                    
                    {/* Line & Points */}
                    {(() => {
                      const history = selectedUser.history || [Math.max(0, xp-500), Math.max(0, xp-300), Math.max(0, xp-200), Math.max(0, xp-100), Math.max(0, xp-50), xp];
                      const maxVal = Math.max(1000, ...history);
                      const points = history.map((val, i) => {
                        const x = 30 + i * 25;
                        const y = 80 - 60 * (val / maxVal);
                        return {x, y};
                      });
                      const pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
                      
                      return (
                        <>
                          <Path d={pathD} fill="none" stroke="#A855F7" strokeWidth="2" strokeLinejoin="round" />
                          {points.map((p, i) => (
                            <Circle key={i} cx={p.x} cy={p.y} r="3" fill="#A855F7" stroke="#0F172A" strokeWidth="1" />
                          ))}
                        </>
                      );
                    })()}
                  </Svg>
                  <View style={styles.chartXLabels}>
                    <Text style={styles.chartXLabel}>1-noy</Text>
                    <Text style={styles.chartXLabel}>8-noy</Text>
                    <Text style={styles.chartXLabel}>15-noy</Text>
                    <Text style={styles.chartXLabel}>22-noy</Text>
                    <Text style={styles.chartXLabel}>Bugun</Text>
                  </View>
                </View>
              </View>

              {/* Radar Chart Card */}
              <View style={styles.chartCard}>
                <View style={styles.chartHeader}>
                  <MaterialCommunityIcons name="target" size={18} color="#D8B4FE" />
                  <Text style={styles.chartTitle}>{t.playStyle}</Text>
                </View>
                <View style={styles.radarChartArea}>
                  <Svg width="120" height="120" viewBox="0 0 160 160">
                    {/* Radar Web - Full (100%) */}
                    <Polygon points="80,10 146.5,58.3 121.1,136.6 38.8,136.6 13.4,58.3" fill="none" stroke="#1E293B" strokeWidth="1" />
                    {/* Radar Web - 50% */}
                    <Polygon points="80,45 113.3,69.1 100.5,108.3 59.4,108.3 46.6,69.1" fill="none" stroke="#1E293B" strokeWidth="1" />
                    
                    <Line x1="80" y1="80" x2="80" y2="10" stroke="#1E293B" strokeWidth="1" />
                    <Line x1="80" y1="80" x2="146.5" y2="58.3" stroke="#1E293B" strokeWidth="1" />
                    <Line x1="80" y1="80" x2="121.1" y2="136.6" stroke="#1E293B" strokeWidth="1" />
                    <Line x1="80" y1="80" x2="38.8" y2="136.6" stroke="#1E293B" strokeWidth="1" />
                    <Line x1="80" y1="80" x2="13.4" y2="58.3" stroke="#1E293B" strokeWidth="1" />
                    
                    {/* Data Polygon */}
                    <Polygon points={radarPoints} fill="rgba(168, 85, 247, 0.4)" stroke="#A855F7" strokeWidth="1.5" strokeLinejoin="round" />
                    
                    {/* Labels */}
                    <SvgText x="80" y="5" fill="#94A3B8" fontSize="10" textAnchor="middle">{t.logic}</SvgText>
                    <SvgText x="155" y="55" fill="#94A3B8" fontSize="10" textAnchor="end">{t.speed}</SvgText>
                    <SvgText x="135" y="148" fill="#94A3B8" fontSize="10" textAnchor="end">{t.accuracyStr}</SvgText>
                    <SvgText x="25" y="148" fill="#94A3B8" fontSize="10" textAnchor="start">{t.strategy}</SvgText>
                    <SvgText x="5" y="55" fill="#94A3B8" fontSize="10" textAnchor="start">{t.memory}</SvgText>
                  </Svg>
                </View>
              </View>
            </View>

            {/* Bottom Cards */}
            <View style={styles.bottomCardsRow}>
              {/* Best Result */}
              <View style={styles.bottomCard}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <MaterialCommunityIcons name="trophy" size={32} color="#F59E0B" style={{ marginRight: 10 }} />
                  <View>
                    <Text style={styles.bottomCardTitle}>{t.bestResult}</Text>
                    <Text style={styles.bottomCardValueGold}>+{selectedUser.bestResultXp || 0} XP</Text>
                    <Text style={styles.bottomCardSub}>{selectedUser.bestResultDate || t.noData}</Text>
                  </View>
                </View>
                <MaterialCommunityIcons name="target-account" size={60} color="rgba(245, 158, 11, 0.1)" style={{ position: 'absolute', right: -10, bottom: -10 }} />
              </View>

              {/* Current Streak */}
              <View style={styles.bottomCard}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <MaterialCommunityIcons name="fire" size={32} color="#EF4444" style={{ marginRight: 10 }} />
                  <View>
                    <Text style={styles.bottomCardTitle}>{t.currentStreak}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                      <Text style={styles.bottomCardValueRed}>{selectedUser.streak || 0}</Text>
                      <Text style={{ color: '#94A3B8', fontSize: 10, marginLeft: 4 }}>{t.games}</Text>
                    </View>
                    <Text style={styles.bottomCardSub}>{t.record} {selectedUser.bestStreak || 0}</Text>
                  </View>
                </View>
                <MaterialCommunityIcons name="fire" size={60} color="rgba(239, 68, 68, 0.1)" style={{ position: 'absolute', right: -10, bottom: -10 }} />
              </View>
            </View>

            {/* Bottom Quote Block */}
            <View style={styles.quoteBlock}>
              <MaterialCommunityIcons name="format-quote-open" size={24} color="#6366F1" style={{ position: 'absolute', left: 16, top: 16 }} />
              <Text style={styles.quoteBlockText}>{t.quote2}</Text>
              <Text style={styles.quoteBlockAuthor}>— {selectedUser.name}</Text>
              <MaterialCommunityIcons name="format-quote-close" size={24} color="#6366F1" style={{ position: 'absolute', right: 16, bottom: 16 }} />
            </View>

          </View>
 </ScrollView>
    
      {/* Custom Alert Modal */}
      <Modal visible={alertVisible} transparent={true} animationType="fade">
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <View style={[styles.alertIconContainer, { backgroundColor: alertMessage.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
              <Feather name={alertMessage.type === 'success' ? 'check-circle' : 'x-circle'} size={40} color={alertMessage.type === 'success' ? '#22C55E' : '#EF4444'} />
            </View>
            <Text style={styles.alertTitle}>{alertMessage.title}</Text>
            <Text style={styles.alertText}>{alertMessage.message}</Text>
            <TouchableOpacity style={[styles.alertButton, { backgroundColor: alertMessage.type === 'success' ? '#3B82F6' : '#EF4444' }]} onPress={() => setAlertVisible(false)}>
              <Text style={styles.alertButtonText}>{t.gotIt}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05050C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#F59E0B',
    fontSize: 16,
    fontFamily: 'Inter_800ExtraBold',
    marginLeft: 6,
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  topSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 10,
    minHeight: 340,
  },
  avatarArea: {
    flex: 1.1,
    position: 'relative',
    alignItems: 'center',
  },
  rankBadge: {
    position: 'absolute',
    top: 10,
    left: 0,
    zIndex: 10,
  },
  rankHexagon: {
    width: 60,
    height: 70,
    backgroundColor: '#D97706',
    borderWidth: 2,
    borderColor: '#FCD34D',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  rankNum: {
    color: '#FFF',
    fontSize: 24,
    fontFamily: 'Inter_800ExtraBold',
  },
  rankText: {
    color: '#FCD34D',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  avatarGlow: {
    position: 'absolute',
    top: 20,
    width: 140,
    height: 280,
    backgroundColor: 'rgba(234, 88, 12, 0.15)',
    borderRadius: 100,
    shadowColor: '#EA580C',
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 10,
  },
  characterContainer: {
    width: '100%',
    height: 280,
    zIndex: 5,
  },
  platformOuter: {
    position: 'absolute',
    bottom: 0,
    width: 160,
    height: 40,
    backgroundColor: 'rgba(234, 88, 12, 0.2)',
    borderRadius: 100,
    transform: [{ scaleY: 0.3 }],
    borderWidth: 2,
    borderColor: '#EA580C',
    zIndex: 1,
  },
  platformMiddle: {
    position: 'absolute',
    bottom: 5,
    width: 140,
    height: 35,
    backgroundColor: 'rgba(250, 204, 21, 0.3)',
    borderRadius: 100,
    transform: [{ scaleY: 0.3 }],
    borderWidth: 2,
    borderColor: '#FACC15',
    zIndex: 2,
  },
  platformInner: {
    position: 'absolute',
    bottom: 10,
    width: 120,
    height: 30,
    backgroundColor: '#000',
    borderRadius: 100,
    transform: [{ scaleY: 0.3 }],
    zIndex: 3,
  },
  infoArea: {
    flex: 1.3,
    paddingLeft: 16,
    paddingTop: 10,
  },
  userName: {
    color: '#FFF',
    fontSize: 22,
    fontFamily: 'Inter_800ExtraBold',
  },
  userHandle: {
    color: '#94A3B8',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
  },
  userQuote: {
    color: '#FFF',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 6,
    fontFamily: 'Inter_600SemiBold',
  },
  rankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 10,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  rankCardTitle: {
    fontSize: 14,
    fontFamily: 'Inter_800ExtraBold',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    color: '#C084FC',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'right',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#111827',
    borderRadius: 10,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  statBoxValue: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_800ExtraBold',
  },
  statBoxLabel: {
    color: '#94A3B8',
    fontSize: Platform.OS === 'android' ? 7.5 : 9,
    fontFamily: 'Inter_500Medium',
  },
  chatButton: {
    backgroundColor: '#6D28D9',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  chatButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#6D28D9',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  activeTabText: {
    color: '#FFF',
  },
  tabContent: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  chartsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chartCard: {
    width: '48%',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitle: {
    color: '#F8FAFC',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    marginLeft: 6,
  },
  lineChartArea: {
    height: 120,
    position: 'relative',
  },
  lineChartTag: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#A855F7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10,
  },
  lineChartTagText: {
    color: '#FFF',
    fontSize: 8,
    fontFamily: 'Inter_700Bold',
  },
  chartXLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  chartXLabel: {
    color: '#64748B',
    fontSize: 7,
  },
  radarChartArea: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  bottomCard: {
    width: '48%',
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    overflow: 'hidden',
    position: 'relative',
  },
  bottomCardTitle: {
    color: '#F8FAFC',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  bottomCardValueGold: {
    color: '#F59E0B',
    fontSize: 16,
    fontFamily: 'Inter_800ExtraBold',
  },
  bottomCardValueRed: {
    color: '#EF4444',
    fontSize: 16,
    fontFamily: 'Inter_800ExtraBold',
  },
  bottomCardSub: {
    color: '#64748B',
    fontSize: 9,
    fontFamily: 'Inter_500Medium',
    marginTop: 4,
  },
  quoteBlock: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
    position: 'relative',
  },
  quoteBlockText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  quoteBlockAuthor: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginTop: 10,
  },
  streakBanner: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#1E1414',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#3F1616',
  },
  streakGlow1: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  streakGlow2: {
    position: 'absolute',
    bottom: -40,
    right: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  streakBannerContent: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  streakIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  streakTextContainer: {
    flex: 1,
  },
  streakBannerTitle: {
    color: '#FCA5A5',
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  streakBannerSub: {
    color: '#94A3B8',
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    lineHeight: 18,
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  alertBox: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  alertIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  alertTitle: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 22,
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  alertText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  alertButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  alertButtonText: {
    fontFamily: 'Inter_700Bold',
    color: '#FFF',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
