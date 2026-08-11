import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, StatusBar, Platform, Animated, Modal, DeviceEventEmitter, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';
import { API_URL, SOCKET_URL } from '../src/config/api';
import { io } from 'socket.io-client';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEnergy } from '../src/hooks/useEnergy';

const TRANSLATIONS = {
  uz: { title: "ENERGIYA MARKAZI", full: "To'lgan", regenTime: "1 ta energiya tiklanish vaqti: 3 daqiqa", maxEnergy: "Maksimum energiya: 10", whatGives: "ENERGIYA NIMA BERADI?", basicMath: "Oddiy hisob", abacus: "Abakus", fastMath: "Tezkor hisob", battle: "Battle", waysToGet: "ENERGIYA OLISH USULLARI", dailyGift: "BUGUNGI SOVG'A", dailyGiftDesc: "Har kuni kirib energiya oling!", claim: "OLISH", missions: "MISSIYALAR", missionsDesc: "Missiyalarni bajaring va energiya oling!", missionProgress: "5 ta mashq bajaring", dailyBonus: "KUNLIK BONUS", dailyBonusDesc: "Ketma-ket kirish orqali ko'proq energiya oling!", streakDays: "7 kunlik kirish", watchVideo: "VIDEO KO'RISH", watchVideoDesc: "30 soniyalik video ko'rib energiya oling!", watchReward: "Video ko'rish orqali mukofot oling", watchBtn: "KO'RISH", inviteFriends: "DO'STLARNI TAKLIF QILING", inviteDesc: "Do'st taklif qiling va mukofot oling!", inviteBtn: "TAKLIF QILISH", reward: "Mukofot:", energyFullAlertTitle: "Diqqat", energyFullAlertDesc: "Sizning energiyangiz to'la. Sovg'ani olish uchun avval misol ishlang", close: "Yopish", practice: "Mashq", claimed: "OLINDI" },
  en: { title: "ENERGY CENTER", full: "Full", regenTime: "1 energy recovery time: 3 mins", maxEnergy: "Maximum energy: 10", whatGives: "WHAT DOES ENERGY GIVE?", basicMath: "Basic Math", abacus: "Abacus", fastMath: "Fast Math", battle: "Battle", waysToGet: "WAYS TO GET ENERGY", dailyGift: "DAILY GIFT", dailyGiftDesc: "Log in daily and get energy!", claim: "CLAIM", missions: "MISSIONS", missionsDesc: "Complete missions and get energy!", missionProgress: "Complete 5 exercises", dailyBonus: "DAILY BONUS", dailyBonusDesc: "Log in consecutively for more energy!", streakDays: "7 day login streak", watchVideo: "WATCH VIDEO", watchVideoDesc: "Watch a 30 sec video to get energy!", watchReward: "Get a reward by watching a video", watchBtn: "WATCH", inviteFriends: "INVITE FRIENDS", inviteDesc: "Invite a friend and get a reward!", inviteBtn: "INVITE", reward: "Reward:", energyFullAlertTitle: "Attention", energyFullAlertDesc: "Your energy is full. Solve examples first to claim the gift", close: "Close", practice: "Practice", claimed: "CLAIMED" },
  ru: { title: "ЦЕНТР ЭНЕРГИИ", full: "Полная", regenTime: "Время восстановления 1 энергии: 3 мин", maxEnergy: "Максимальная энергия: 10", whatGives: "ЧТО ДАЕТ ЭНЕРГИЯ?", basicMath: "Простой счет", abacus: "Абакус", fastMath: "Быстрый счет", battle: "Баттл", waysToGet: "СПОСОБЫ ПОЛУЧЕНИЯ ЭНЕРГИИ", dailyGift: "ЕЖЕДНЕВНЫЙ ПОДАРОК", dailyGiftDesc: "Заходите каждый день и получайте энергию!", claim: "ПОЛУЧИТЬ", missions: "МИССИИ", missionsDesc: "Выполняйте миссии и получайте энергию!", missionProgress: "Выполните 5 упражнений", dailyBonus: "ЕЖЕДНЕВНЫЙ БОНУС", dailyBonusDesc: "Заходите подряд и получайте больше энергии!", streakDays: "7 дней подряд", watchVideo: "СМОТРЕТЬ ВИДЕО", watchVideoDesc: "Смотрите 30-секундное видео и получайте энергию!", watchReward: "Получите награду за просмотр видео", watchBtn: "СМОТРЕТЬ", inviteFriends: "ПРИГЛАСИТЕ ДРУЗЕЙ", inviteDesc: "Пригласи друга и получи награду!", inviteBtn: "ПРИГЛАСИТЬ", reward: "Награда:", energyFullAlertTitle: "Внимание", energyFullAlertDesc: "Ваша энергия полна. Сначала решите примеры, чтобы получить подарок", close: "Закрыть", practice: "Упражнение", claimed: "ПОЛУЧЕНО" },
  ar: { title: "مركز الطاقة", full: "ممتلئ", regenTime: "وقت استعادة 1 طاقة: 3 دقائق", maxEnergy: "الحد الأقصى للطاقة: 10", whatGives: "ماذا تعطي الطاقة؟", basicMath: "حساب بسيط", abacus: "المعداد", fastMath: "رياضيات سريعة", battle: "معركة", waysToGet: "طرق للحصول على الطاقة", dailyGift: "هدية يومية", dailyGiftDesc: "سجل الدخول يومياً واحصل على طاقة!", claim: "احصل", missions: "مهام", missionsDesc: "أكمل المهام واحصل على طاقة!", missionProgress: "أكمل 5 تمارين", dailyBonus: "مكافأة يومية", dailyBonusDesc: "سجل الدخول متتالياً للحصول على المزيد من الطاقة!", streakDays: "تسجيل الدخول لمدة 7 أيام", watchVideo: "مشاهدة الفيديو", watchVideoDesc: "شاهد فيديو لمدة 30 ثانية للحصول على طاقة!", watchReward: "احصل على مكافأة من خلال مشاهدة فيديو", watchBtn: "مشاهدة", inviteFriends: "دعوة الأصدقاء", inviteDesc: "ادعُ صديقاً واحصل على مكافأة!", inviteBtn: "دعوة", reward: "مكافأة:", energyFullAlertTitle: "انتباه", energyFullAlertDesc: "طاقتك ممتلئة. حل الأمثلة أولاً للمطالبة بالهدية", close: "إغلاق", practice: "ممارسة", claimed: "تم الاستلام" },
  tr: { title: "ENERJİ MERKEZİ", full: "Dolu", regenTime: "1 enerji yenilenme süresi: 3 dk", maxEnergy: "Maksimum enerji: 10", whatGives: "ENERJİ NE VERİR?", basicMath: "Basit Matematik", abacus: "Abaküs", fastMath: "Hızlı Matematik", battle: "Savaş", waysToGet: "ENERJİ ALMA YOLLARI", dailyGift: "GÜNLÜK HEDİYE", dailyGiftDesc: "Her gün giriş yap ve enerji al!", claim: "AL", missions: "GÖREVLER", missionsDesc: "Görevleri tamamla ve enerji kazan!", missionProgress: "5 egzersiz tamamla", dailyBonus: "GÜNLÜK BONUS", dailyBonusDesc: "Daha fazla enerji için ardışık giriş yap!", streakDays: "7 günlük seri", watchVideo: "VİDEO İZLE", watchVideoDesc: "30 saniyelik video izle ve enerji kazan!", watchReward: "Video izleyerek ödül kazanın", watchBtn: "İZLE", inviteFriends: "ARKADAŞ DAVET ET", inviteDesc: "Arkadaşını davet et ve ödül kazan!", inviteBtn: "DAVET ET", reward: "Ödül:", energyFullAlertTitle: "Dikkat", energyFullAlertDesc: "Enerjiniz dolu. Hediyeyi almak için önce egzersiz yapın", close: "Kapat", practice: "Egzersiz", claimed: "ALINDI" },
  zh: { title: "能量中心", full: "已满", regenTime: "1 能量恢复时间：3 分钟", maxEnergy: "最大能量：10", whatGives: "能量有什么用？", basicMath: "基础数学", abacus: "算盘", fastMath: "快速计算", battle: "对战", waysToGet: "获取能量的途径", dailyGift: "每日礼物", dailyGiftDesc: "每天登录获取能量！", claim: "领取", missions: "任务", missionsDesc: "完成任务获取能量！", missionProgress: "完成 5 个练习", dailyBonus: "每日奖励", dailyBonusDesc: "连续登录获取更多能量！", streakDays: "7 天连续登录", watchVideo: "观看视频", watchVideoDesc: "观看 30 秒视频获取能量！", watchReward: "通过观看视频获得奖励", watchBtn: "观看", inviteFriends: "邀请好友", inviteDesc: "邀请好友并获得奖励！", inviteBtn: "邀请", reward: "奖励：", energyFullAlertTitle: "注意", energyFullAlertDesc: "您的能量已满。请先解答题目以领取礼物", close: "关闭", practice: "练习", claimed: "已领取" },
  ky: { title: "ЭНЕРГИЯ БОРБОРУ", full: "Толгон", regenTime: "1 энергия калыбына келүү убактысы: 3 мүн", maxEnergy: "Максималдуу энергия: 10", whatGives: "ЭНЕРГИЯ ЭМНЕ БЕРЕТ?", basicMath: "Жөнөкөй эсеп", abacus: "Абакус", fastMath: "Тез эсеп", battle: "Баттл", waysToGet: "ЭНЕРГИЯ АЛУУ ЖОЛДОРУ", dailyGift: "КҮНДӨЛҮК БЕЛЕК", dailyGiftDesc: "Күн сайын кирип энергия алыңыз!", claim: "АЛУУ", missions: "МИССИЯЛАР", missionsDesc: "Миссияларды аткарып энергия алыңыз!", missionProgress: "5 көнүгүү аткарыңыз", dailyBonus: "КҮНДӨЛҮК БОНУС", dailyBonusDesc: "Көбүрөөк энергия үчүн катары менен кириңиз!", streakDays: "7 күндүк серия", watchVideo: "ВИДЕО КӨРҮҮ", watchVideoDesc: "30 секунддук видео көрүп энергия алыңыз!", watchReward: "Видео көрүп сыйлык алыңыз", watchBtn: "КӨРҮҮ", inviteFriends: "ДОСТОРДУ ЧАКЫРУУ", inviteDesc: "Досуңузду чакырып сыйлык алыңыз!", inviteBtn: "ЧАКЫРУУ", reward: "Сыйлык:", energyFullAlertTitle: "Көңүл буруңуз", energyFullAlertDesc: "Энергияңыз толгон. Белекти алуу үчүн алгач мисал иштеңиз", close: "Жабуу", practice: "Көнүгүү", claimed: "АЛЫНДЫ" },
  kk: { title: "ЭНЕРГИЯ ОРТАЛЫҒЫ", full: "Толық", regenTime: "1 энергия қалпына келу уақыты: 3 мин", maxEnergy: "Максималды энергия: 10", whatGives: "ЭНЕРГИЯ НЕ БЕРЕДІ?", basicMath: "Қарапайым есеп", abacus: "Абакус", fastMath: "Жылдам есеп", battle: "Баттл", waysToGet: "ЭНЕРГИЯ АЛУ ЖОЛДАРЫ", dailyGift: "КҮНДЕЛІКТІ СЫЙЛЫҚ", dailyGiftDesc: "Күн сайын кіріп энергия алыңыз!", claim: "АЛУ", missions: "МИССИЯЛАР", missionsDesc: "Миссияларды орындап энергия алыңыз!", missionProgress: "5 жаттығу орындаңыз", dailyBonus: "КҮНДЕЛІКТІ БОНУС", dailyBonusDesc: "Көбірек энергия үшін қатарынан кіріңіз!", streakDays: "7 күндік серия", watchVideo: "ВИДЕО КӨРУ", watchVideoDesc: "30 секундтық видео көріп энергия алыңыз!", watchReward: "Видео көру арқылы сыйлық алыңыз", watchBtn: "КӨРУ", inviteFriends: "ДОСТАРДЫ ШАҚЫРУ", inviteDesc: "Досыңызды шақырып сыйлық алыңыз!", inviteBtn: "ШАҚЫРУ", reward: "Сыйлық:", energyFullAlertTitle: "Назар аударыңыз", energyFullAlertDesc: "Энергияңыз толық. Сыйлықты алу үшін алдымен есеп шығарыңыз", close: "Жабу", practice: "Жаттығу", claimed: "АЛЫНДЫ" },
  tg: { title: "МАРКАЗИ ЭНЕРГИЯ", full: "Пур шуд", regenTime: "Вақти барқароршавии 1 энергия: 3 дақиқа", maxEnergy: "Энергияи ҳадди аксар: 10", whatGives: "ЭНЕРГИЯ ЧӢ МЕДИҲАД?", basicMath: "Ҳисоби оддӣ", abacus: "Абакус", fastMath: "Ҳисоби тез", battle: "Баттл", waysToGet: "РОҲҲОИ ГИРИФТАНИ ЭНЕРГИЯ", dailyGift: "ТУҲФАИ ҲАРРӮЗА", dailyGiftDesc: "Ҳар рӯз дароед ва энергия гиред!", claim: "ГИРИФТАН", missions: "ВАЗИФАҲО", missionsDesc: "Вазифаҳоро иҷро кунед ва энергия гиред!", missionProgress: "5 машқ иҷро кунед", dailyBonus: "БОНУСИ ҲАРРӮЗА", dailyBonusDesc: "Барои энергияи бештар пайдарпай дароед!", streakDays: "7 рӯзи серия", watchVideo: "ВИДЕО БИНЕД", watchVideoDesc: "Видеои 30-сониягиро бинед ва энергия гиред!", watchReward: "Бо тамошои видео мукофот гиред", watchBtn: "ТАМОШО", inviteFriends: "ДӮСТОНРО ДАЪВАТ КУНЕД", inviteDesc: "Дӯстро даъват кунед ва мукофот гиред!", inviteBtn: "ДАЪВАТ", reward: "Мукофот:", energyFullAlertTitle: "Диққат", energyFullAlertDesc: "Энергияи шумо пур аст. Барои гирифтани туҳфа аввал машқ кунед", close: "Пӯшидан", practice: "Машқ", claimed: "ГИРИФТА ШУД" },
  ja: { title: "エネルギーセンター", full: "満タン", regenTime: "1エネルギー回復時間：3分", maxEnergy: "最大エネルギー：10", whatGives: "エネルギーの用途", basicMath: "簡単な計算", abacus: "そろばん", fastMath: "素早い計算", battle: "バトル", waysToGet: "エネルギーの取得方法", dailyGift: "デイリーギフト", dailyGiftDesc: "毎日ログインしてエネルギーをゲット！", claim: "受け取る", missions: "ミッション", missionsDesc: "ミッションを完了してエネルギーを獲得！", missionProgress: "5つの演習を完了する", dailyBonus: "デイリーボーナス", dailyBonusDesc: "連続ログインしてより多くのエネルギーをゲット！", streakDays: "7日間の連続ログイン", watchVideo: "ビデオを見る", watchVideoDesc: "30秒のビデオを見てエネルギーを獲得！", watchReward: "ビデオを見て報酬を獲得する", watchBtn: "視聴", inviteFriends: "友達を招待", inviteDesc: "友達を招待して報酬を獲得！", inviteBtn: "招待", reward: "報酬:", energyFullAlertTitle: "注意", energyFullAlertDesc: "エネルギーが満タンです。ギフトを受け取る前に練習してください", close: "閉じる", practice: "練習", claimed: "受け取り済み" },
  ko: { title: "에너지 센터", full: "가득 참", regenTime: "1 에너지 회복 시간: 3분", maxEnergy: "최대 에너지: 10", whatGives: "에너지 사용처", basicMath: "간단한 계산", abacus: "주판", fastMath: "빠른 계산", battle: "전투", waysToGet: "에너지 얻는 방법", dailyGift: "일일 선물", dailyGiftDesc: "매일 로그인하고 에너지를 받으세요!", claim: "받기", missions: "임무", missionsDesc: "임무를 완료하고 에너지를 얻으세요!", missionProgress: "5개 연습 완료", dailyBonus: "일일 보너스", dailyBonusDesc: "연속 로그인하여 더 많은 에너지를 얻으세요!", streakDays: "7일 연속 로그인", watchVideo: "비디오 시청", watchVideoDesc: "30초 비디오 시청하고 에너지 받기!", watchReward: "비디오를 보고 보상 받기", watchBtn: "시청", inviteFriends: "친구 초대", inviteDesc: "친구를 초대하고 보상을 받으세요!", inviteBtn: "초대", reward: "보상:", energyFullAlertTitle: "주의", energyFullAlertDesc: "에너지가 가득 찼습니다. 선물을 받으려면 먼저 연습하세요", close: "닫기", practice: "연습", claimed: "받음" }
};

export default function EnergyCenterScreen({ navigation, route }) {
  const { language = 'uz' } = route?.params || {};
  const t = TRANSLATIONS[language] || TRANSLATIONS['uz'];
  const { energy: currentEnergy, maxEnergy, formattedTime, addEnergy } = useEnergy();
  
  const borderAnim = useRef(new Animated.Value(0)).current;

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [dailyGiftClaimed, setDailyGiftClaimed] = useState(false);
  const [dailyGiftActive, setDailyGiftActive] = useState(false);
  const [dailyBonusClaimed, setDailyBonusClaimed] = useState(false);
  const [dailyVideoClaimed, setDailyVideoClaimed] = useState(false);
  const [adVideoUrl, setAdVideoUrl] = useState(null);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [isMissionsModalVisible, setIsMissionsModalVisible] = useState(false);
  const [missionsList, setMissionsList] = useState([]);
  const [playingMission, setPlayingMission] = useState(null);
  
  const [adVideoTimestamp, setAdVideoTimestamp] = useState(null);

  useEffect(() => {
    checkClaims();

    const socket = io(SOCKET_URL, {
      path: '/api/socket.io',
      transports: ['websocket', 'polling']
    });

    socket.on('new_mission_added', () => {
      checkClaims();
    });

    socket.on('mission_deleted', () => {
      checkClaims();
    });

    const sub1 = DeviceEventEmitter.addListener('new_ad_video_uploaded', (data) => {
      if (data && data.url) {
        const baseUrl = API_URL.replace('/api', '');
        setAdVideoUrl(baseUrl + data.url);
        setAdVideoTimestamp(data.timestamp);
        setDailyVideoClaimed(false); // Enable the button immediately!
      }
    });

    const sub2 = DeviceEventEmitter.addListener('ad_video_deleted', () => {
      setAdVideoUrl(null);
      setAdVideoTimestamp(null);
    });

    return () => {
      sub1.remove();
      sub2.remove();
      socket.disconnect();
    };
  }, []);

  const checkClaims = async () => {
    try {
      const now = new Date();
      
      // Daily Gift Logic: Active after 12:00 PM today. Resets every day.
      const giftClaimTimeStr = await AsyncStorage.getItem('daily_gift_claim_time');
      let giftClaimedToday = false;
      if (giftClaimTimeStr) {
        const giftClaimTime = new Date(parseInt(giftClaimTimeStr, 10));
        if (giftClaimTime.getDate() === now.getDate() && 
            giftClaimTime.getMonth() === now.getMonth() && 
            giftClaimTime.getFullYear() === now.getFullYear()) {
          giftClaimedToday = true;
        }
      }
      setDailyGiftClaimed(giftClaimedToday);
      setDailyGiftActive(now.getHours() >= 12 && !giftClaimedToday);

      // Daily Bonus Logic: Active all day. Resets every day at midnight.
      const bonusClaimTimeStr = await AsyncStorage.getItem('daily_bonus_claim_time');
      let bonusClaimedToday = false;
      if (bonusClaimTimeStr) {
        const bonusClaimTime = new Date(parseInt(bonusClaimTimeStr, 10));
        if (bonusClaimTime.getDate() === now.getDate() && 
            bonusClaimTime.getMonth() === now.getMonth() && 
            bonusClaimTime.getFullYear() === now.getFullYear()) {
          bonusClaimedToday = true;
        }
      }
      setDailyBonusClaimed(bonusClaimedToday);

      // Daily Video Claim Logic
      const videoClaimTimeStr = await AsyncStorage.getItem('daily_video_claim_time');
      let videoClaimedToday = false;
      if (videoClaimTimeStr) {
        const videoClaimTime = new Date(parseInt(videoClaimTimeStr, 10));
        if (videoClaimTime.getDate() === now.getDate() && 
            videoClaimTime.getMonth() === now.getMonth() && 
            videoClaimTime.getFullYear() === now.getFullYear()) {
          videoClaimedToday = true;
        }
      }
      setDailyVideoClaimed(videoClaimedToday);

      // Fetch active ad video
      try {
        const res = await fetch(`${API_URL}/ad-video`);
        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            const baseUrl = API_URL.replace('/api', '');
            setAdVideoUrl(baseUrl + data.url);
            setAdVideoTimestamp(data.timestamp);
            
            // Check if THIS specific video was already claimed
            const claimedVideoTs = await AsyncStorage.getItem('claimed_video_timestamp');
            if (claimedVideoTs && data.timestamp && claimedVideoTs === String(data.timestamp)) {
              setDailyVideoClaimed(true);
            } else {
              setDailyVideoClaimed(false);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch ad video:', err);
      }

      // Fetch dynamic missions
      try {
        const dataStr = await AsyncStorage.getItem('user_data');
        if (dataStr) {
          const userData = JSON.parse(dataStr);
          if (userData.customId) {
            const cleanId = userData.customId.replace(/^#+/, '');
            const res = await fetch(`${API_URL}/missions/${encodeURIComponent(cleanId)}`);
            if (res.ok) {
              const data = await res.json();
              setMissionsList(data);
            }
          }
        }
      } catch (e) {
        console.error('Failed to fetch missions:', e);
      }

    } catch (e) {
      console.error('Error checking claims:', e);
    }
  };

  const handleClaim = async (type) => {
    if (currentEnergy >= maxEnergy) {
      setIsAlertVisible(true);
      return;
    }
    
    try {
      const now = Date.now().toString();
      if (type === 'gift') {
        await addEnergy(2);
        await AsyncStorage.setItem('daily_gift_claim_time', now);
        setDailyGiftClaimed(true);
        setDailyGiftActive(false);
      } else if (type === 'bonus') {
        await addEnergy(3);
        await AsyncStorage.setItem('daily_bonus_claim_time', now);
        setDailyBonusClaimed(true);
      }
    } catch (e) {
      console.error('Error claiming:', e);
    }
  };

  const handleCompleteMission = async (mission) => {
    if (mission.isCompleted) return;
    if (currentEnergy >= maxEnergy) {
      setIsAlertVisible(true);
      return;
    }
    
    if (mission.link) {
      Linking.openURL(mission.link).catch(err => console.error('Error opening link:', err));
    }
    
    try {
      const dataStr = await AsyncStorage.getItem('user_data');
      if (dataStr) {
        const userData = JSON.parse(dataStr);
        if (userData.customId) {
          const cleanId = userData.customId.replace(/^#+/, '');
          const res = await fetch(`${API_URL}/missions/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customId: cleanId, missionId: mission.id })
          });
          if (res.ok) {
            const result = await res.json();
            setMissionsList(prev => prev.map(m => m.id === mission.id ? { ...m, isCompleted: true } : m));
            if (result.energyAdded) {
               await addEnergy(result.energyAdded);
            }
          }
        }
      }
    } catch(e) {
      console.error('Error completing mission', e);
    }
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(borderAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const borderColorInterp = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(168, 85, 247, 0.2)', 'rgba(168, 85, 247, 1)']
  });
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05050C" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerCenter}>
          <MaterialCommunityIcons name="lightning-bolt" size={20} color="#FBBF24" />
          <Text style={styles.headerTitle}>{t.title}</Text>
        </View>

        <View style={styles.headerRight}>
          {/* Empty to balance headerLeft */}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* TOP INFO ROW (Lightning + Energy Costs) */}
        <View style={styles.topInfoRow}>
          {/* MAIN ENERGY CARD */}
          <View style={styles.mainEnergyCard}>
            <View style={styles.mainEnergyTopRow}>
              <View style={styles.mainEnergyLeft}>
                <Image source={require('../assets/ec_lightning.png')} style={styles.mainLightningIcon} contentFit="contain" />
              </View>
              <View style={styles.mainEnergyRight}>
                <Text style={styles.energyBigText}>
                  <Text style={styles.energyBigValue}>{currentEnergy}</Text>
                  <Text style={styles.energyBigDivider}> / {maxEnergy}</Text>
                </Text>
                <View style={[styles.timerRow, { marginTop: 4 }]}>
                  <MaterialCommunityIcons name="timer-outline" size={16} color="#FBBF24" />
                  <Text style={styles.timerText}>{currentEnergy >= maxEnergy ? t.full : formattedTime}</Text>
                </View>
                <Text style={styles.energyRecoveryInfo}>{t.regenTime}</Text>
              </View>
            </View>

            <View style={styles.energyDotsContainer}>
              {Array.from({ length: 10 }).map((_, i) => (
                <MaterialCommunityIcons 
                  key={i} 
                  name="lightning-bolt" 
                  size={16} 
                  color={i < currentEnergy ? "#FBBF24" : "#1E293B"} 
                  style={{ marginHorizontal: 1 }}
                />
              ))}
            </View>
            <Text style={styles.maxEnergyText}>{t.maxEnergy}</Text>
          </View>

          {/* ENERGY COSTS PANEL */}
          <View style={styles.costsPanel}>
            <Text style={styles.costsTitle}>{t.whatGives}</Text>
            <View style={styles.costItemRow}>
              <View style={styles.costItemLeft}>
                <MaterialCommunityIcons name="calculator" size={16} color="#3B82F6" />
                <Text style={styles.costItemText}>{t.basicMath}</Text>
              </View>
              <View style={styles.costItemRight}>
                <MaterialCommunityIcons name="lightning-bolt" size={14} color="#FBBF24" />
                <Text style={styles.costItemValue}>1</Text>
              </View>
            </View>
            <View style={styles.costItemRow}>
              <View style={styles.costItemLeft}>
                <MaterialCommunityIcons name="abacus" size={16} color="#F59E0B" />
                <Text style={styles.costItemText}>{t.abacus}</Text>
              </View>
              <View style={styles.costItemRight}>
                <MaterialCommunityIcons name="lightning-bolt" size={14} color="#FBBF24" />
                <Text style={styles.costItemValue}>1</Text>
              </View>
            </View>
            <View style={styles.costItemRow}>
              <View style={styles.costItemLeft}>
                <MaterialCommunityIcons name="timer-outline" size={16} color="#10B981" />
                <Text style={styles.costItemText}>{t.fastMath}</Text>
              </View>
              <View style={styles.costItemRight}>
                <MaterialCommunityIcons name="lightning-bolt" size={14} color="#FBBF24" />
                <Text style={styles.costItemValue}>2</Text>
              </View>
            </View>
            <View style={styles.costItemRow}>
              <View style={styles.costItemLeft}>
                <MaterialCommunityIcons name="target" size={16} color="#EF4444" />
                <Text style={styles.costItemText}>{t.battle}</Text>
              </View>
              <View style={styles.costItemRight}>
                <MaterialCommunityIcons name="lightning-bolt" size={14} color="#FBBF24" />
                <Text style={styles.costItemValue}>2</Text>
              </View>
            </View>
          </View>
        </View>

        {/* WAYS TO GET ENERGY SECTION */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLine} />
          <Text style={styles.sectionTitle}>{t.waysToGet}</Text>
          <View style={styles.sectionHeaderLine} />
        </View>

        {/* Gift Box */}
        <View style={styles.taskCard}>
          <View style={styles.taskIconContainer}>
            <Image source={require('../assets/ec_gift.png')} style={styles.taskIcon} contentFit="contain" />
          </View>
          <View style={styles.taskContent}>
            <Text style={[styles.taskTitle, { color: '#C084FC' }]}>{t.dailyGift}</Text>
            <Text style={styles.taskDesc}>{t.dailyGiftDesc}</Text>
            <Text style={styles.taskReward}>{t.reward} <MaterialCommunityIcons name="lightning-bolt" size={12} color="#FBBF24" /> +2</Text>
          </View>
          <TouchableOpacity 
            style={[styles.primaryButton, dailyGiftClaimed || !dailyGiftActive ? { backgroundColor: '#334155', shadowOpacity: 0 } : {}]}
            disabled={dailyGiftClaimed || !dailyGiftActive}
            onPress={() => handleClaim('gift')}
          >
            <Text style={[styles.primaryButtonText, dailyGiftClaimed || !dailyGiftActive ? { color: '#9CA3AF' } : {}]}>
              {dailyGiftClaimed ? t.claimed : t.claim}
            </Text>
            {dailyGiftActive && !dailyGiftClaimed && <View style={styles.notificationDot} />}
          </TouchableOpacity>
        </View>

        {/* Generic Missions Card */}
        {missionsList.length > 0 && missionsList.some(m => !m.isCompleted) && (
          <TouchableOpacity 
            style={[styles.taskCard, { paddingVertical: 20 }]} 
            activeOpacity={0.8}
            onPress={() => setIsMissionsModalVisible(true)}
          >
            <View style={[styles.taskIconContainer, { backgroundColor: 'rgba(56, 189, 248, 0.1)', borderColor: 'rgba(56, 189, 248, 0.3)' }]}>
              <Image source={require('../assets/ec_missions.png')} style={styles.taskIcon} contentFit="contain" />
            </View>
            <View style={[styles.taskContent, { flex: 1, paddingRight: 16 }]}>
              <Text style={[styles.taskTitle, { color: '#38BDF8' }]}>{t.missions}</Text>
              <Text style={[styles.taskDesc, { marginBottom: 10, lineHeight: 16 }]}>{t.missionsDesc}</Text>
              
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                 <View style={{ width: 100, height: 6, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 3, marginRight: 8, overflow: 'hidden' }}>
                    <View style={{ width: `${(missionsList.filter(m => m.isCompleted).length / missionsList.length) * 100}%`, height: '100%', backgroundColor: '#38BDF8', borderRadius: 3 }} />
                 </View>
                 <Text style={{ color: '#9CA3AF', fontSize: 11, fontFamily: 'Inter_600SemiBold' }}>
                   {missionsList.filter(m => m.isCompleted).length} / {missionsList.length}
                 </Text>
              </View>
            </View>
            <View 
              style={[styles.primaryButton, { backgroundColor: 'rgba(56, 189, 248, 0.1)', borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.3)', paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', borderRadius: 16, shadowOpacity: 0 }]}
            >
              <MaterialCommunityIcons name="lightning-bolt" size={16} color="#38BDF8" />
              <Text style={[styles.primaryButtonText, { color: '#38BDF8', marginLeft: 4, fontSize: 13 }]}>+{missionsList.filter(m => !m.isCompleted).length}</Text>
            </View>
          </TouchableOpacity>
        )}


        {/* Watch Video */}
        <View style={styles.taskCard}>
          <View style={styles.taskIconContainer}>
            <Image source={require('../assets/ec_video.png')} style={styles.taskIcon} contentFit="contain" />
          </View>
          <View style={styles.taskContent}>
            <Text style={[styles.taskTitle, { color: '#60A5FA' }]}>{t.watchVideo}</Text>
            <Text style={styles.taskDesc}>{t.watchVideoDesc}</Text>
          </View>
          <View style={styles.taskProgressArea}>
             <Text style={styles.taskProgressText}>{t.watchReward}</Text>
             <TouchableOpacity 
               style={[styles.videoButton, (!adVideoUrl || dailyVideoClaimed) ? { backgroundColor: '#334155' } : {}]}
               disabled={!adVideoUrl || dailyVideoClaimed}
               onPress={() => {
                 if (currentEnergy >= maxEnergy) {
                   setIsAlertVisible(true);
                   return;
                 }
                 setIsVideoModalVisible(true);
               }}
             >
               <Ionicons name="play" size={12} color={(!adVideoUrl || dailyVideoClaimed) ? "#9CA3AF" : "#FFF"} />
               <Text style={[styles.videoButtonText, (!adVideoUrl || dailyVideoClaimed) ? { color: '#9CA3AF' } : {}]}>
                 {dailyVideoClaimed ? t.claimed : t.watchBtn}
               </Text>
               <MaterialCommunityIcons name="lightning-bolt" size={12} color={(!adVideoUrl || dailyVideoClaimed) ? "#9CA3AF" : "#FBBF24"} />
               <Text style={[styles.videoButtonText, (!adVideoUrl || dailyVideoClaimed) ? { color: '#9CA3AF' } : {}]}>+1</Text>
             </TouchableOpacity>
          </View>
        </View>

        {/* FOOTER CALL TO ACTIONS */}

        <Animated.View style={[styles.footerCard, { borderColor: borderColorInterp, opacity: 0.5 }]}>
          <LinearGradient colors={['rgba(168, 85, 247, 0.1)', 'transparent']} style={StyleSheet.absoluteFill} />
          <Ionicons name="people" size={40} color="#C084FC" style={{ marginRight: 12 }} />
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={[styles.footerTitle, { color: '#C084FC' }]}>{t.inviteFriends}</Text>
            <Text style={styles.footerDesc}>{t.inviteDesc}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
              <MaterialCommunityIcons name="lightning-bolt" size={20} color="#FBBF24" />
              <Text style={{ color: '#FBBF24', fontFamily: 'Inter_800ExtraBold', fontSize: 18 }}>+2</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.premiumButton, { paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#374151' }]} activeOpacity={1}>
            <Ionicons name="lock-closed" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* FULL ENERGY ALERT MODAL */}
      <Modal visible={isAlertVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <MaterialCommunityIcons name="lightning-bolt" size={40} color="#FBBF24" />
            </View>
            <Text style={styles.modalTitle}>{t.energyFullAlertTitle}</Text>
            <Text style={styles.modalDesc}>{t.energyFullAlertDesc}</Text>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setIsAlertVisible(false)}>
                <Text style={styles.modalCloseText}>{t.close}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalActionBtn} 
                onPress={() => {
                  setIsAlertVisible(false);
                  navigation.goBack();
                }}
              >
                <Text style={styles.modalActionText}>{t.practice}</Text>
                <Ionicons name="arrow-forward" size={16} color="#000" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* AD VIDEO MODAL */}
      <Modal visible={isVideoModalVisible} transparent={false} animationType="slide" hardwareAccelerated={true}>
        <View style={{ flex: 1, backgroundColor: '#05050C' }}>
          <SafeAreaView style={{ flex: 1 }}>
            {/* Custom Header for Video Modal */}
            <View style={{
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              paddingHorizontal: 20, 
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(255,255,255,0.05)'
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(251, 191, 36, 0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                  <Ionicons name="play" size={18} color="#FBBF24" style={{ marginLeft: 2 }} />
                </View>
                <View>
                  <Text style={{ color: '#FFF', fontSize: 14, fontFamily: 'Inter_800ExtraBold', textTransform: 'uppercase' }}>
                    {playingMission ? playingMission.title : t.watchVideo}
                  </Text>
                  <Text style={{ color: '#FBBF24', fontSize: 11, fontFamily: 'Inter_600SemiBold', marginTop: 2 }}>
                    Mukofot: +1 Energiya
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  paddingHorizontal: 16, 
                  paddingVertical: 8, 
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.05)'
                }}
                onPress={() => {
                  setIsVideoModalVisible(false);
                  setPlayingMission(null);
                }}
              >
                <Text style={{ color: '#E2E8F0', fontFamily: 'Inter_700Bold', fontSize: 12, marginRight: 6 }}>{t.close}</Text>
                <Ionicons name="close" size={16} color="#E2E8F0" />
              </TouchableOpacity>
            </View>

            {/* Video Container */}
            <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
              {(playingMission && playingMission.fileUrl) || adVideoUrl ? (
                <Video
                  source={{ uri: playingMission ? `${API_URL.replace('/api', '')}${playingMission.fileUrl}` : adVideoUrl }}
                  style={{ width: '100%', flex: 1 }}
                  useNativeControls={true}
                  resizeMode="contain"
                  shouldPlay={isVideoModalVisible}
                  onError={(error) => {
                    console.error('Video error:', error);
                    alert('Video o\'qishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring.');
                    setIsVideoModalVisible(false);
                    setPlayingMission(null);
                  }}
                  onPlaybackStatusUpdate={async (status) => {
                    if (status.didJustFinish) {
                      setIsVideoModalVisible(false);
                      try {
                        if (playingMission) {
                          handleCompleteMission(playingMission);
                          setPlayingMission(null);
                        } else {
                          await addEnergy(1);
                          await AsyncStorage.setItem('daily_video_claim_time', Date.now().toString());
                          if (adVideoTimestamp) {
                            await AsyncStorage.setItem('claimed_video_timestamp', String(adVideoTimestamp));
                          }
                          setDailyVideoClaimed(true);
                        }
                      } catch (e) {
                        console.error('Error claiming video:', e);
                      }
                    }
                  }}
                />
              ) : (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="videocam-off-outline" size={48} color="rgba(255,255,255,0.2)" />
                  <Text style={{ color: 'rgba(255,255,255,0.4)', marginTop: 12, fontFamily: 'Inter_500Medium', fontSize: 13 }}>Video topilmadi</Text>
                </View>
              )}
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      {/* MISSIONS MODAL */}
      <Modal visible={isMissionsModalVisible} transparent={false} animationType="slide" hardwareAccelerated={true}>
        <View style={{ flex: 1, backgroundColor: '#05050C' }}>
          <SafeAreaView style={{ flex: 1 }}>
            {/* Custom Header for Missions Modal */}
            <View style={{
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              paddingHorizontal: 20, 
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(255,255,255,0.05)'
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(56, 189, 248, 0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                  <Image source={require('../assets/ec_missions.png')} style={{ width: 20, height: 20 }} contentFit="contain" />
                </View>
                <View>
                  <Text style={{ color: '#FFF', fontSize: 14, fontFamily: 'Inter_800ExtraBold', textTransform: 'uppercase' }}>
                    {t.missions}
                  </Text>
                  <Text style={{ color: '#38BDF8', fontSize: 11, fontFamily: 'Inter_600SemiBold', marginTop: 2 }}>
                    Har bir missiya uchun 1 energiya
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  paddingHorizontal: 16, 
                  paddingVertical: 8, 
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.05)'
                }}
                onPress={() => setIsMissionsModalVisible(false)}
              >
                <Text style={{ color: '#E2E8F0', fontFamily: 'Inter_700Bold', fontSize: 12, marginRight: 6 }}>{t.close}</Text>
                <Ionicons name="close" size={16} color="#E2E8F0" />
              </TouchableOpacity>
            </View>

            {/* Missions List Container */}
            <ScrollView contentContainerStyle={{ padding: 20 }}>
              {missionsList.length === 0 ? (
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 100 }}>
                  <Ionicons name="file-tray-outline" size={48} color="rgba(255,255,255,0.2)" />
                  <Text style={{ color: 'rgba(255,255,255,0.4)', marginTop: 12, fontFamily: 'Inter_500Medium', fontSize: 13 }}>Hozircha missiyalar yo'q</Text>
                </View>
              ) : (
                missionsList.map(mission => (
                  <View key={mission.id} style={styles.taskCard}>
                    <View style={styles.taskIconContainer}>
                      <Image source={
                        mission.type === 'YOUTUBE' ? require('../assets/ec_youtube.png') :
                        mission.type === 'TELEGRAM' ? require('../assets/ec_telegram.png') :
                        mission.type === 'VIDEO_UPLOAD' ? require('../assets/ec_video.png') :
                        require('../assets/ec_instagram.png')
                      } style={styles.taskIcon} contentFit="contain" />
                    </View>
                    <View style={[styles.taskContent, { flex: 1 }]}>
                      <Text style={[styles.taskTitle, { color: '#38BDF8' }]}>{mission.title}</Text>
                      <Text style={styles.taskDesc}>
                        {mission.type === 'VIDEO_UPLOAD' ? 'Video ko\'rish' :
                         mission.type === 'YOUTUBE' ? 'YouTube videoni ko\'rish' :
                         mission.type === 'TELEGRAM' ? 'Telegram kanalga obuna' : 'Instagram sahifaga obuna'}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={[styles.primaryButton, mission.isCompleted ? { backgroundColor: '#334155' } : { backgroundColor: '#38BDF8' }]}
                      disabled={mission.isCompleted}
                      onPress={() => {
                        if (mission.type === 'VIDEO_UPLOAD') {
                          setIsMissionsModalVisible(false);
                          setPlayingMission(mission);
                          setIsVideoModalVisible(true);
                        } else {
                          handleCompleteMission(mission);
                          setIsMissionsModalVisible(false);
                        }
                      }}
                    >
                      <Text style={[styles.primaryButtonText, mission.isCompleted ? { color: '#9CA3AF' } : {}]}>
                        {mission.isCompleted ? t.claimed : "BAJARISH"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </ScrollView>
          </SafeAreaView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 20,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_800ExtraBold',
    marginLeft: 4,
  },
  headerSubtitle: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
  },
  headerStatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  headerStatText: {
    color: '#FFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    marginHorizontal: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  topInfoRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  mainEnergyCard: {
    flex: 1.5,
    backgroundColor: '#0F1320',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.2)',
    marginRight: 12,
  },
  mainEnergyTopRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  mainEnergyLeft: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mainLightningIcon: {
    width: 70,
    height: 70,
  },
  mainEnergyRight: {
    flex: 1,
    justifyContent: 'center',
  },
  energyBigText: {
    marginBottom: 4,
  },
  energyBigValue: {
    color: '#FBBF24',
    fontSize: 32,
    fontFamily: 'Inter_800ExtraBold',
  },
  energyBigDivider: {
    color: '#9CA3AF',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  nextEnergyLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 4,
  },
  timerText: {
    color: '#FBBF24',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    marginLeft: 4,
  },
  energyRecoveryInfo: {
    color: '#64748B',
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
  energyDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  maxEnergyText: {
    color: '#64748B',
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
  costsPanel: {
    flex: 1,
    backgroundColor: '#0F1320',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  costsTitle: {
    color: '#FBBF24',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  costItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  costItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  costItemText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 6,
  },
  costItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  costItemValue: {
    color: '#FBBF24',
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    marginLeft: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    marginHorizontal: 16,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0E17',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  taskIconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  taskIcon: {
    width: '100%',
    height: '100%',
  },
  taskContent: {
    flex: 1.2,
  },
  taskTitle: {
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  taskDesc: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    lineHeight: 14,
  },
  taskReward: {
    color: '#E2E8F0',
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 4,
  },
  taskProgressArea: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  taskProgressText: {
    color: '#9CA3AF',
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    marginBottom: 4,
  },
  taskProgressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  taskProgressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    marginRight: 8,
  },
  taskProgressBarFill: {
    height: '100%',
    backgroundColor: '#FBBF24',
    borderRadius: 3,
  },
  taskProgressCount: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
  primaryButton: {
    backgroundColor: '#FBBF24',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
  },
  notificationDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#0A0E17',
  },
  secondaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  secondaryBadgeText: {
    color: '#FBBF24',
    fontSize: 14,
    fontFamily: 'Inter_800ExtraBold',
    marginLeft: 2,
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
  },
  videoButtonText: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    marginHorizontal: 4,
  },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 4,
  },
  premiumButtonText: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Inter_800ExtraBold',
    marginLeft: 6,
  },
  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1320',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  footerTitle: {
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
    marginBottom: 2,
  },
  footerDesc: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    lineHeight: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#0F1320',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Inter_800ExtraBold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDesc: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCloseBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  modalCloseText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  modalActionBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FBBF24',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalActionText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Inter_800ExtraBold',
  },
});
