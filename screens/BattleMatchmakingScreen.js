import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Easing, SafeAreaView, Dimensions } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');


const TRANSLATIONS = {
  uz: {
    title: "BATTLE BOSHLANDI", search: "Raqibingiz qidirilmoqda...", stake: "Stavkangiz",
    sec: "soniya", found: "Raqib topildi!", you: "Siz", level: "Daraja",
    rating: "Reyting", accuracy: "Aniqlik", avgTime: "O'rtacha vaqt", maxCombo: "Eng uzun combo",
    opponent: "Raqib", howToPlay: "Qanday o'ynaladi?", 
    rules: "Hisob-kitoblarni to'g'ri va tezroq yeching.\n3 ta xato bo'lsa, yutqazasiz!",
    leave: "BATTLE'DAN CHIQISH", fairPlay: "Adolatli o'yin ta'minlanadi"
  },
  en: {
    title: "BATTLE STARTED", search: "Searching for opponent...", stake: "Your stake",
    sec: "sec", found: "Opponent found!", you: "You", level: "Level",
    rating: "Rating", accuracy: "Accuracy", avgTime: "Avg time", maxCombo: "Longest combo",
    opponent: "Opponent", howToPlay: "How to play?", 
    rules: "Solve calculations correctly and fast.\n3 mistakes and you lose!",
    leave: "LEAVE BATTLE", fairPlay: "Fair play guaranteed"
  },
  ru: {
    title: "БИТВА НАЧАЛАСЬ", search: "Поиск противника...", stake: "Ваша ставка",
    sec: "сек", found: "Противник найден!", you: "Вы", level: "Уровень",
    rating: "Рейтинг", accuracy: "Точность", avgTime: "Ср. время", maxCombo: "Макс. комбо",
    opponent: "Противник", howToPlay: "Как играть?", 
    rules: "Решайте примеры правильно и быстро.\n3 ошибки - вы проиграли!",
    leave: "ПОКИНУТЬ БИТВУ", fairPlay: "Честная игра гарантирована"
  },
  ar: {
    title: "بدأت المعركة", search: "جاري البحث عن خصم...", stake: "رهانك",
    sec: "ثانية", found: "تم العثور على خصم!", you: "أنت", level: "مستوى",
    rating: "تقييم", accuracy: "دقة", avgTime: "متوسط الوقت", maxCombo: "أطول سلسلة",
    opponent: "الخصم", howToPlay: "كيف تلعب؟", 
    rules: "حل العمليات الحسابية بشكل صحيح وسريع.\n3 أخطاء وتخسر!",
    leave: "مغادرة المعركة", fairPlay: "اللعب النظيف مضمون"
  },
  tr: {
    title: "SAVAŞ BAŞLADI", search: "Rakip aranıyor...", stake: "Bahsiniz",
    sec: "saniye", found: "Rakip bulundu!", you: "Sen", level: "Seviye",
    rating: "Derece", accuracy: "Doğruluk", avgTime: "Ort. süre", maxCombo: "En uzun kombo",
    opponent: "Rakip", howToPlay: "Nasıl oynanır?", 
    rules: "Hesaplamaları doğru ve hızlı çöz.\n3 hatada kaybedersin!",
    leave: "SAVAŞTAN ÇIK", fairPlay: "Adil oyun garantilidir"
  },
  zh: {
    title: "战斗开始", search: "正在寻找对手...", stake: "你的赌注",
    sec: "秒", found: "找到对手！", you: "你", level: "等级",
    rating: "评分", accuracy: "准确度", avgTime: "平均时间", maxCombo: "最长连击",
    opponent: "对手", howToPlay: "怎么玩？", 
    rules: "快速正确地解答。\n错3次你就输了！",
    leave: "离开战斗", fairPlay: "保证公平游戏"
  },
  ky: {
    title: "САЛМАШ БАШТАЛДЫ", search: "Атаандаш изделүүдө...", stake: "Сиздин коюм",
    sec: "секунд", found: "Атаандаш табылды!", you: "Сиз", level: "Деңгээл",
    rating: "Рейтинг", accuracy: "Тактык", avgTime: "Орточо убакыт", maxCombo: "Эң узун комбо",
    opponent: "Атаандаш", howToPlay: "Кантип ойнойт?", 
    rules: "Эсептөөлөрдү туура жана тез чыгар.\n3 ката болсо, утуласыз!",
    leave: "САЛМАШТАН ЧЫГУУ", fairPlay: "Адилет оюн кепилденет"
  },
  kk: {
    title: "ЖЕКПЕ-ЖЕК БАСТАЛДЫ", search: "Қарсылас ізделуде...", stake: "Сіздің бәс",
    sec: "секунд", found: "Қарсылас табылды!", you: "Сіз", level: "Деңгей",
    rating: "Рейтинг", accuracy: "Дәлдік", avgTime: "Орташа уақыт", maxCombo: "Ең ұзын комбо",
    opponent: "Қарсылас", howToPlay: "Қалай ойнайды?", 
    rules: "Есептерді дұрыс әрі жылдам шешіңіз.\n3 қате жіберсеңіз, ұтыласыз!",
    leave: "ЖЕКПЕ-ЖЕКТЕН ШЫҒУ", fairPlay: "Әділ ойынға кепілдік беріледі"
  },
  tg: {
    title: "ҶАНГ ОҒОЗ ЁФТ", search: "Ҷустуҷӯи ҳариф...", stake: "Шартгузории шумо",
    sec: "сония", found: "Ҳариф ёфт шуд!", you: "Шумо", level: "Сатҳ",
    rating: "Рейтинг", accuracy: "Дақиқӣ", avgTime: "Вақти миёна", maxCombo: "Тӯлонитарин комбо",
    opponent: "Ҳариф", howToPlay: "Чӣ тавр бозӣ кардан мумкин?", 
    rules: "Ҳисобҳоро зуд ва дуруст ҳал кунед.\nБо 3 хато шумо мағлуб мешавед!",
    leave: "ТАРК КАРДАНИ ҶАНГ", fairPlay: "Бозии одилона кафолат дода мешавад"
  },
  ja: {
    title: "バトル開始", search: "対戦相手を検索中...", stake: "あなたの賭け",
    sec: "秒", found: "対戦相手が見つかりました！", you: "あなた", level: "レベル",
    rating: "レーティング", accuracy: "正確さ", avgTime: "平均時間", maxCombo: "最大コンボ",
    opponent: "対戦相手", howToPlay: "遊び方", 
    rules: "計算を正確かつ速く解きましょう。\n3回間違えると負けです！",
    leave: "バトルから退出", fairPlay: "公平なプレイを保証"
  },
  ko: {
    title: "배틀 시작", search: "상대 검색 중...", stake: "당신의 베팅",
    sec: "초", found: "상대를 찾았습니다!", you: "당신", level: "레벨",
    rating: "평점", accuracy: "정확도", avgTime: "평균 시간", maxCombo: "최대 콤보",
    opponent: "상대", howToPlay: "게임 방법", 
    rules: "계산을 정확하고 빠르게 푸세요.\n3번 틀리면 패배합니다!",
    leave: "배틀 나가기", fairPlay: "공정한 플레이 보장"
  }
};


export default function BattleMatchmakingScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { language = 'uz', examplesCount = 10, operation = 'oddiy', speed = 1, digits = 1 } = route.params || {};
  const t = TRANSLATIONS[language] || TRANSLATIONS['uz'];
  const [countdown, setCountdown] = useState(9);
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const opponentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (countdown <= 5) {
      Animated.spring(opponentAnim, {
        toValue: 1,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }).start();
    }
  }, [countdown]);

  useEffect(() => {
    // Pulse animation for the countdown ring
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        })
      ])
    ).start();

    // Spin animation for the outer ring
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-navigate when timer reaches 0
          setTimeout(() => {
            navigation.replace('BattleGame', {
              mode: 'battle',
              examplesCount,
              operation,
              speed,
              digits
            });
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.container}>
      
      <View style={[styles.header, { marginTop: Math.max(insets.top, 10) }]}>
        <View style={styles.headerTitleContainer}>
          <MaterialCommunityIcons name="sword-cross" size={24} color="#A855F7" style={{ marginRight: 8 }} />
          <Text style={styles.headerTitle}>{t.title}</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>{t.search}</Text>

      <View style={[styles.stakesCard, { justifyContent: 'center' }]}>
        <View style={[styles.stakeHalf, { flex: 0 }]}>
          <Image source={require('../assets/xp_icon.jpg')} style={{ width: 32, height: 32, borderRadius: 16, marginRight: 10 }} resizeMode="cover" />
          <View style={styles.stakeTextContainer}>
            <Text style={styles.stakeLabel}>{t.stake}</Text>
            <Text style={styles.stakeValue}>+25 XP</Text>
          </View>
        </View>
      </View>

      <View style={styles.timerContainer}>
        <View style={{ width: 140, height: 140, alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View style={[styles.timerCircleOuter, { borderStyle: 'dashed', transform: [{ rotate: spin }] }]} />
          
          <Animated.View style={[styles.timerCircleInner, { position: 'absolute', transform: [{ rotate: '45deg' }, { scale: pulseAnim }] }]}>
            <View style={{ transform: [{ rotate: '-45deg' }], alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.timerNumber}>{countdown}</Text>
              <Text style={styles.timerSoniya}>{t.sec}</Text>
            </View>
          </Animated.View>
        </View>
        <Text style={styles.opponentFoundText}>{countdown <= 5 ? t.found : t.search}</Text>
      </View>

      <View style={{ flex: 1, justifyContent: 'center' }}>
      <View style={styles.playersHorizontalContainer}>
        {/* Player (Left) */}
        <View style={[styles.fighterCard, { borderColor: 'rgba(16, 185, 129, 0.4)', shadowColor: '#10B981' }]}>
          <View style={[styles.avatarGlowWrapper, { shadowColor: '#10B981' }]}>
            <Image source={require('../assets/avatar_maks.png')} style={styles.fighterAvatar} resizeMode="cover" />
            <View style={[styles.fighterLevel, { backgroundColor: '#10B981' }]}>
              <Text style={styles.fighterLevelText}>12</Text>
            </View>
          </View>
          <Text style={styles.fighterName}>{t.you}</Text>
          <View style={styles.fighterRating}>
            <MaterialCommunityIcons name="trophy" size={14} color="#F59E0B" />
            <Text style={styles.fighterRatingText}>1250</Text>
          </View>
          <View style={[styles.fighterStats, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
            <MaterialCommunityIcons name="target" size={12} color="#10B981" />
            <Text style={[styles.fighterStatText, { color: '#10B981' }]}>94%</Text>
          </View>
        </View>

        {/* VS Orb (Center) */}
        <View style={styles.vsOrbContainer}>
          <View style={styles.vsOrbInner}>
            <Text style={styles.vsOrbText}>VS</Text>
          </View>
        </View>

        {/* Opponent (Right) */}
        <Animated.View style={[styles.fighterCard, { borderColor: 'rgba(239, 68, 68, 0.4)', shadowColor: '#EF4444' }, {
          opacity: opponentAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1, 1], extrapolate: 'clamp' }), 
          transform: [
            { scale: opponentAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }
          ]
        }]}>
          <View style={[styles.avatarGlowWrapper, { shadowColor: '#EF4444' }]}>
            <Image source={require('../assets/opponent_1.png')} style={styles.fighterAvatar} resizeMode="cover" />
            <View style={[styles.fighterLevel, { backgroundColor: '#EF4444' }]}>
              <Text style={styles.fighterLevelText}>10</Text>
            </View>
          </View>
          <Text style={styles.fighterName}>{t.opponent}</Text>
          <View style={styles.fighterRating}>
            <MaterialCommunityIcons name="trophy" size={14} color="#F59E0B" />
            <Text style={styles.fighterRatingText}>1312</Text>
          </View>
          <View style={[styles.fighterStats, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
            <MaterialCommunityIcons name="target" size={12} color="#EF4444" />
            <Text style={[styles.fighterStatText, { color: '#EF4444' }]}>89%</Text>
          </View>
        </Animated.View>
      </View>
      </View>

      
      <TouchableOpacity 
        style={styles.cancelBtn}
        activeOpacity={0.8}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelBtnText}>{t.leave}</Text>
      </TouchableOpacity>

      
      <View style={styles.footerContainer}>
        <MaterialCommunityIcons name="shield-check" size={14} color="#6B7280" style={{ marginRight: 6 }} />
        <Text style={styles.footerText}>{t.fairPlay}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05050C',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    marginBottom: 10,
  },
  stakesCard: {
    flexDirection: 'row',
    backgroundColor: '#0B0B14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  stakeHalf: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 5,
  },
  xpIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#9333EA',
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  xpIconText: {
    color: '#FFF',
    fontFamily: 'Inter_900Black',
    fontSize: 10,
    transform: [{ rotate: '-45deg' }],
  },
  stakeTextContainer: {
    justifyContent: 'center',
  },
  stakeLabel: {
    color: '#6B7280',
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    marginBottom: 2,
  },
  stakeValue: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    height: 160,
  },
  timerCircleOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(168, 85, 247, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  timerCircleInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
    shadowColor: '#A855F7',
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  timerNumber: {
    color: '#FFF',
    fontSize: 48,
    fontFamily: 'Inter_700Bold',
    includeFontPadding: false,
    textShadowColor: 'rgba(255,255,255,0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  timerSoniya: {
    color: '#A855F7',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginTop: -5,
  },
  opponentFoundText: {
    color: '#A855F7',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 15,
  },
  playersHorizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 20,
    position: 'relative',
  },
  fighterCard: {
    width: '42%',
    backgroundColor: 'rgba(10, 15, 28, 0.8)',
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 5,
  },
  avatarGlowWrapper: {
    marginBottom: 12,
    position: 'relative',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  fighterAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  fighterLevel: {
    position: 'absolute',
    bottom: -5,
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  fighterLevelText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Inter_800ExtraBold',
  },
  fighterName: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_800ExtraBold',
    marginBottom: 4,
  },
  fighterRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  fighterRatingText: {
    color: '#F59E0B',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  fighterStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  fighterStatText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  vsOrbContainer: {
    position: 'absolute',
    left: '50%',
    marginLeft: -25, // half of width
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#05050C',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  vsOrbInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    borderWidth: 2,
    borderColor: '#A855F7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  vsOrbText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_900Black',
    fontStyle: 'italic',
  },
  howToPlayCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(168, 85, 247, 0.05)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  howToPlayIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  howToPlayContent: {
    flex: 1,
  },
  howToPlayTitle: {
    color: '#A855F7',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 2,
  },
  howToPlayText: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    lineHeight: 16,
  },
  cancelBtn: {
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.2)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 15,
  },
  cancelBtnText: {
    color: '#EF4444',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
});
