import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, Platform, ScrollView, Animated, StatusBar } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { calculateUserRank } from '../src/utils/rankUtils';
import { API_URL } from '../src/config/api';

const { width } = Dimensions.get('window');

const TRANSLATIONS = {
  uz: {
    winTitle: "G'ALABA!", loseTitle: "MAG'LUBIYAT", winSub: "Siz g'alaba qozondingiz!", loseSub: "Raqibingiz g'alaba qozondi",
    correctAnswer: "To'g'ri javob:", yourAnswer: "Sizning javobingiz:", you: "O'yinchi", opponent: "Raqib", level: "Daraja",
    correctAnswers: "To'g'ri javoblar", wrongAnswers: "Xato javoblar", avgTime: "O'rtacha vaqt", gainedXp: "Olingan XP",
    chat: "CHAT", playAgain: "YANA BIR O'YIN", home: "BOSH SAHIFAGA QAYTISH",
    winPhrases: ["A'lo!", "Qoyil!", "Zo'r!", "Yaxshi!"],
    losePhrases: ["Afsus", "Taslim bo'lmang!", "Keyingi safar"]
  },
  en: {
    winTitle: "VICTORY!", loseTitle: "DEFEAT", winSub: "You won the battle!", loseSub: "Your opponent won",
    correctAnswer: "Correct answer:", yourAnswer: "Your answer:", you: "Player", opponent: "Opponent", level: "Level",
    correctAnswers: "Correct answers", wrongAnswers: "Wrong answers", avgTime: "Average time", gainedXp: "Gained XP",
    chat: "CHAT", playAgain: "PLAY AGAIN", home: "RETURN TO HOME",
    winPhrases: ["Excellent!", "Wow!", "Great!", "Good job!"],
    losePhrases: ["Alas", "Don't give up!", "Next time"]
  },
  ru: {
    winTitle: "ПОБЕДА!", loseTitle: "ПОРАЖЕНИЕ", winSub: "Вы выиграли битву!", loseSub: "Ваш противник выиграл",
    correctAnswer: "Правильный ответ:", yourAnswer: "Ваш ответ:", you: "Игрок", opponent: "Противник", level: "Уровень",
    correctAnswers: "Правильные ответы", wrongAnswers: "Неверные ответы", avgTime: "Среднее время", gainedXp: "Получено XP",
    chat: "ЧАТ", playAgain: "ИГРАТЬ СНОВА", home: "ВЕРНУТЬСЯ ДОМОЙ",
    winPhrases: ["Отлично!", "Ого!", "Супер!", "Хорошо!"],
    losePhrases: ["Увы", "Не сдавайся!", "В следующий раз"]
  },
  ar: {
    winTitle: "انتصار!", loseTitle: "هزيمة", winSub: "لقد فزت بالمعركة!", loseSub: "فاز خصمك",
    correctAnswer: "الإجابة الصحيحة:", yourAnswer: "إجابتك:", you: "لاعب", opponent: "الخصم", level: "مستوى",
    correctAnswers: "إجابات صحيحة", wrongAnswers: "إجابات خاطئة", avgTime: "متوسط الوقت", gainedXp: "XP المكتسبة",
    chat: "دردشة", playAgain: "العب مرة أخرى", home: "العودة إلى الرئيسية",
    winPhrases: ["ممتاز!", "رائع!", "عظيم!", "عمل جيد!"],
    losePhrases: ["للأسف", "لا تستسلم!", "في المرة القادمة"]
  },
  tr: {
    winTitle: "ZAFER!", loseTitle: "YENİLGİ", winSub: "Savaşı kazandın!", loseSub: "Rakibin kazandı",
    correctAnswer: "Doğru cevap:", yourAnswer: "Senin cevabın:", you: "Oyuncu", opponent: "Rakip", level: "Seviye",
    correctAnswers: "Doğru cevaplar", wrongAnswers: "Yanlış cevaplar", avgTime: "Ortalama süre", gainedXp: "Kazanılan XP",
    chat: "SOHBET", playAgain: "TEKRAR OYNA", home: "ANASAYFAYA DÖN",
    winPhrases: ["Mükemmel!", "Vay!", "Harika!", "İyi iş!"],
    losePhrases: ["Maalesef", "Pes etme!", "Bir dahaki sefere"]
  },
  zh: {
    winTitle: "胜利！", loseTitle: "失败", winSub: "你赢得了战斗！", loseSub: "你的对手赢了",
    correctAnswer: "正确答案：", yourAnswer: "你的答案：", you: "玩家", opponent: "对手", level: "等级",
    correctAnswers: "正确答案", wrongAnswers: "错误答案", avgTime: "平均时间", gainedXp: "获得的 XP",
    chat: "聊天", playAgain: "再玩一次", home: "返回主页",
    winPhrases: ["优秀！", "哇！", "太棒了！", "干得好！"],
    losePhrases: ["唉", "别放弃！", "下次再来"]
  },
  ky: {
    winTitle: "ЖЕҢИШ!", loseTitle: "ЖЕҢИЛҮҮ", winSub: "Сиз жеңдиңиз!", loseSub: "Атаандашыңыз жеңди",
    correctAnswer: "Туура жооп:", yourAnswer: "Сиздин жообуңуз:", you: "Оюнчу", opponent: "Атаандаш", level: "Деңгээл",
    correctAnswers: "Туура жооптор", wrongAnswers: "Ката жооптор", avgTime: "Орточо убакыт", gainedXp: "Алынган XP",
    chat: "ЧАТ", playAgain: "КАЙРА ОЙНОО", home: "БАШКЫ БЕТКЕ КАЙТУУ",
    winPhrases: ["Мыкты!", "Ой!", "Сонун!", "Жакшы!"],
    losePhrases: ["Тилекке каршы", "Багынбаңыз!", "Кийинки жолу"]
  },
  kk: {
    winTitle: "ЖЕҢІС!", loseTitle: "ЖЕҢІЛІС", winSub: "Сіз жеңдіңіз!", loseSub: "Қарсыласыңыз жеңді",
    correctAnswer: "Дұрыс жауап:", yourAnswer: "Сіздің жауабыңыз:", you: "Ойыншы", opponent: "Қарсылас", level: "Деңгей",
    correctAnswers: "Дұрыс жауаптар", wrongAnswers: "Қате жауаптар", avgTime: "Орташа уақыт", gainedXp: "Алынған XP",
    chat: "ЧАТ", playAgain: "ҚАЙТА ОЙНАУ", home: "БАСТЫ БЕТКЕ ҚАЙТУ",
    winPhrases: ["Керемет!", "Оу!", "Тамаша!", "Жарайсың!"],
    losePhrases: ["Өкінішке орай", "Берілмеңіз!", "Келесі жолы"]
  },
  tg: {
    winTitle: "ҒАЛАБА!", loseTitle: "МАҒЛУБИЯТ", winSub: "Шумо ғолиб шудед!", loseSub: "Ҳарифи шумо ғолиб шуд",
    correctAnswer: "Ҷавоби дуруст:", yourAnswer: "Ҷавоби шумо:", you: "Бозингар", opponent: "Ҳариф", level: "Сатҳ",
    correctAnswers: "Ҷавобҳои дуруст", wrongAnswers: "Ҷавобҳои хато", avgTime: "Вақти миёна", gainedXp: "XP гирифта шуд",
    chat: "ЧАТ", playAgain: "БОЗ БОЗӢ КУНЕД", home: "БА САҲИФАИ АСОСӢ",
    winPhrases: ["Аъло!", "Оҳо!", "Зӯр!", "Хуб!"],
    losePhrases: ["Афсӯс", "Таслим нашавед!", "Дафъаи дигар"]
  },
  ja: {
    winTitle: "勝利！", loseTitle: "敗北", winSub: "あなたは戦いに勝ちました！", loseSub: "対戦相手の勝利",
    correctAnswer: "正解：", yourAnswer: "あなたの答え：", you: "プレイヤー", opponent: "対戦相手", level: "レベル",
    correctAnswers: "正解数", wrongAnswers: "不正解数", avgTime: "平均時間", gainedXp: "獲得 XP",
    chat: "チャット", playAgain: "もう一度プレイ", home: "ホームに戻る",
    winPhrases: ["素晴らしい！", "すごい！", "いいね！", "よくやった！"],
    losePhrases: ["残念", "諦めないで！", "次回"]
  },
  ko: {
    winTitle: "승리!", loseTitle: "패배", winSub: "배틀에서 승리했습니다!", loseSub: "상대가 승리했습니다",
    correctAnswer: "정답:", yourAnswer: "당신의 답:", you: "플레이어", opponent: "상대", level: "레벨",
    correctAnswers: "정답 수", wrongAnswers: "오답 수", avgTime: "평균 시간", gainedXp: "획득 XP",
    chat: "채팅", playAgain: "다시 플레이", home: "홈으로 돌아가기",
    winPhrases: ["훌륭해요!", "와우!", "멋져요!", "잘했어요!"],
    losePhrases: ["아쉽네요", "포기하지 마세요!", "다음 기회에"]
  }
};

export default function BattleResultScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const [userData, setUserData] = useState(null);

  const baseAvatarsList = [
    { id: 0, name: 'Alex', img: require('../assets/avatar_alex.jpg') },
    { id: 1, name: 'Maks', img: require('../assets/avatar_maks.png') },
    { id: 2, name: 'David', img: require('../assets/avatar_david.jpg') },
    { id: 3, name: 'Kevin', img: require('../assets/avatar_kevin.png') },
    { id: 4, name: 'Lily', img: require('../assets/avatar_lily.jpg') },
    { id: 5, name: 'Maya', img: require('../assets/avatar_maya.jpg') },
    { id: 6, name: 'Emma', img: require('../assets/avatar_emma.jpg') },
    { id: 7, name: 'Sophia', img: require('../assets/avatar_sophia.png') }
  ];

  const getAvatarImg = (userData) => {
    if (!userData) return require('../assets/avatar_maks.png');
    if (userData.character) {
      const found = baseAvatarsList.find(a => a.name.toLowerCase() === userData.character.toLowerCase());
      if (found) return found.img;
    }
    return require('../assets/avatar_maks.png');
  };

  const userLevel = userData ? calculateUserRank(userData.xp || 0).levelNumber : 1;

  const {
    correct = 0,
    incorrect = 0,
    avgTime = "0.0",
    maxCombo = 0,
    xp = 0,
    coins = 0,
    oppCorrect = 0,
    oppIncorrect = 0,
    oppAvgTime = "0.0",
    oppMaxCombo = 0,
    language = 'uz'
  } = route.params || {};

  const t = TRANSLATIONS[language] || TRANSLATIONS['uz'];
  const isWin = correct >= oppCorrect; // Simple logic: whoever has more correct answers wins

  useEffect(() => {
    async function fetchUserAndSaveXP() {
      try {
        let uData = null;
        const data = await AsyncStorage.getItem('user_data');
        if (data) {
          uData = JSON.parse(data);
          setUserData(uData);

          if (isWin) {
            try {
              const res = await fetch(`${API_URL}/user/xp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customId: uData.customId || uData.id, xpToAdd: 25 })
              });
              if (res.ok) {
                const resData = await res.json();
                uData.xp = resData.xp;
                await AsyncStorage.setItem('user_data', JSON.stringify(uData));
                setUserData({ ...uData });
              }
            } catch (err) {
              console.log('Error saving battle win xp', err);
            }
          }
        }

        // Save real game stats for Battle mode (Mantiq, Tezlik, Aniqlik)
        const total = (correct || 0) + (incorrect || 0);
        const accuracyPercent = total > 0 ? Math.round((correct / total) * 100) : 100;
        const currentSpeed = parseFloat(avgTime) || 1.8;
        const logicScore = Math.min(100, Math.round(accuracyPercent * (isWin ? 1.2 : 0.9)));
        const userIdKey = uData?.customId || uData?.id || 'guest';

        // 1. Save Battle Best Results (Victories, Streak, Fastest Time)
        try {
          const battleVal = await AsyncStorage.getItem(`user_battle_stats_${userIdKey}`);
          const globalBattleVal = await AsyncStorage.getItem('user_battle_stats');
          const rawVal = battleVal || globalBattleVal;

          let battleStats = rawVal ? JSON.parse(rawVal) : { victories: 0, currentStreak: 0, bestStreak: 0, fastestTime: '0.0' };
          
          const newVictories = isWin ? (battleStats.victories || 0) + 1 : (battleStats.victories || 0);
          const newCurrentStreak = isWin ? (battleStats.currentStreak || 0) + 1 : 0;
          const newBestStreak = Math.max(battleStats.bestStreak || 0, newCurrentStreak);
          
          let newFastest = battleStats.fastestTime && battleStats.fastestTime !== '0.0' ? parseFloat(battleStats.fastestTime) : 0;
          if (currentSpeed > 0) {
            newFastest = newFastest > 0 ? Math.min(newFastest, currentSpeed) : currentSpeed;
          }
          const fastestStr = newFastest > 0 ? newFastest.toFixed(1) : '0.0';

          const updatedBattleStats = {
            victories: newVictories,
            currentStreak: newCurrentStreak,
            bestStreak: newBestStreak,
            fastestTime: fastestStr
          };

          await AsyncStorage.setItem('user_battle_stats', JSON.stringify(updatedBattleStats));
          await AsyncStorage.setItem(`user_battle_stats_${userIdKey}`, JSON.stringify(updatedBattleStats));
        } catch (err) {
          console.log('Error saving battle best results:', err);
        }

        // 2. Save General Game Stats (Logic, Speed, Accuracy)
        try {
          const existing = await AsyncStorage.getItem('user_game_stats');
          let updatedStats;
          if (!existing) {
            updatedStats = {
              logic: logicScore,
              speedTime: currentSpeed.toFixed(1),
              accuracy: accuracyPercent,
              gamesCount: 1
            };
          } else {
            const stats = JSON.parse(existing);
            const prevGames = stats.gamesCount || 1;
            const newGames = prevGames + 1;

            const newLogic = Math.round(((stats.logic || 0) * prevGames + logicScore) / newGames);
            const newAccuracy = Math.round(((stats.accuracy || 0) * prevGames + accuracyPercent) / newGames);

            const prevSpeed = parseFloat(stats.speedTime || '0.0');
            const newSpeed = prevSpeed > 0 ? (((prevSpeed * prevGames) + currentSpeed) / newGames).toFixed(1) : currentSpeed.toFixed(1);

            updatedStats = {
              logic: Math.min(100, newLogic),
              speedTime: newSpeed,
              accuracy: Math.min(100, newAccuracy),
              gamesCount: newGames
            };
          }
          await AsyncStorage.setItem('user_game_stats', JSON.stringify(updatedStats));
          await AsyncStorage.setItem(`user_game_stats_${userIdKey}`, JSON.stringify(updatedStats));
        } catch (err) {
          console.log('Error saving game stats:', err);
        }

            // Save to user activity history (last 3 entries)
            AsyncStorage.getItem('user_activity_history').then(histVal => {
              let history = histVal ? JSON.parse(histVal) : [];
              const now = new Date();
              const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
              
              const newEntry = {
                id: Date.now(),
                title: "1v1 Boshma-bosh o'yin",
                time: `${t.actToday || 'Bugun'}, ${timeStr}`,
                xpGained: isWin ? 25 : 0
              };

              history = [newEntry, ...history].slice(0, 3);
              AsyncStorage.setItem('user_activity_history', JSON.stringify(history)).catch(e => console.log(e));
              AsyncStorage.setItem(`user_activity_history_${userIdKey}`, JSON.stringify(history)).catch(e => console.log(e));
            }).catch(e => console.log(e));
          }).catch(e => console.log(e));
      } catch (e) {}
    }
    fetchUserAndSaveXP();

    async function playResultSound() {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, allowsRecordingIOS: false, staysActiveInBackground: false });
        const soundAsset = isWin ? require('../assets/sounds/correct.wav') : require('../assets/sounds/wrong.wav');
        const { sound } = await Audio.Sound.createAsync(soundAsset);
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) sound.unloadAsync();
        });
      } catch (e) {
        console.log('Error playing result sound', e);
      }
    }
    playResultSound();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [isWin]);

  const winPhrase = useRef(t.winPhrases[Math.floor(Math.random() * t.winPhrases.length)]).current;
  const losePhrase = useRef(t.losePhrases[Math.floor(Math.random() * t.losePhrases.length)]).current;

  const playerFeedback = isWin ? winPhrase : losePhrase;
  const oppFeedback = !isWin ? winPhrase : losePhrase;
  
  const winnerColor = '#0ea5e9';
  const winnerBorder = 'rgba(14, 165, 233, 0.4)';
  const loserColor = '#ef4444';
  const loserBorder = 'rgba(239, 68, 68, 0.4)';

  const playerColor = isWin ? winnerColor : loserColor;
  const playerBorder = isWin ? winnerBorder : loserBorder;

  const oppColor = !isWin ? winnerColor : loserColor;
  const oppBorder = !isWin ? winnerBorder : loserBorder;
  
  const userScore = (correct * 100) - (incorrect * 20) + (maxCombo * 5);
  const oppScore = (oppCorrect * 100) - (oppIncorrect * 20) + (oppMaxCombo * 5);

  const mainColor = isWin ? '#f59e0b' : '#ef4444'; // Orange for Victory, Red for Defeat
  const mainTitle = isWin ? t.winTitle : t.loseTitle;
  const subTitle = isWin ? t.winSub : t.loseSub;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Removed */}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.cardsWrapper, { opacity: fadeAnim }]}>
        {/* Main Title Area */}
        <View style={styles.titleArea}>
          {isWin && <MaterialCommunityIcons name="crown" size={40} color="#f59e0b" style={styles.crownIcon} />}
          <Text style={[styles.mainTitleText, { color: mainColor }]}>{mainTitle}</Text>
          <Text style={styles.subTitleText}>{subTitle}</Text>
        </View>

        <View style={styles.answerArea}>
          <Text style={styles.answerText}>{t.correctAnswer} <Text style={styles.correctAnswerVal}>{route.params?.actualAnswer}</Text></Text>
          <Text style={styles.answerText}>{t.yourAnswer} <Text style={[styles.userAnswerVal, { color: isWin ? '#22c55e' : '#ef4444' }]}>{route.params?.userAnswer}</Text></Text>
        </View>

        {/* Player Card */}
        <Animated.View style={[styles.playerCard, { borderColor: playerBorder, shadowColor: playerColor }, { transform: [{ scale: pulseAnim }], shadowOpacity: 0.8, shadowRadius: 20 }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardInfo}>
              <View style={[styles.avatarGlow, { borderColor: playerColor }]}>
                <Image source={getAvatarImg(userData)} style={styles.avatarImage} />
              </View>
              <View style={styles.cardDetails}>
                <View style={styles.nameRow}>
                  <Text style={styles.flag}>🇺🇿</Text>
                  <Text style={styles.playerName}>{userData?.name || t.you}</Text>
                </View>
                <View style={styles.trophyRow}>
                  <MaterialCommunityIcons name="star" size={12} color="#facc15" />
                  <Text style={styles.trophyText}>{t.level} {userLevel}</Text>
                </View>
                <View style={styles.healthBarTrack}>
                  <View style={[styles.healthBarFill, { backgroundColor: playerColor, width: '100%' }]} />
                </View>
              </View>
            </View>
            <Text style={[styles.scoreText, { color: isWin ? '#22c55e' : '#ef4444', fontSize: 18, textAlign: 'right', flex: 1, flexWrap: 'wrap' }]}>{playerFeedback}</Text>
          </View>

          <View style={styles.statsDivider} />

          <View style={styles.cardStats}>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="check-circle-outline" size={20} color="#22c55e" />
              <Text style={styles.statBoxLabel}>{t.correctAnswers}</Text>
              <Text style={styles.statBoxValue}>{correct}</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="close-circle-outline" size={20} color="#ef4444" />
              <Text style={styles.statBoxLabel}>{t.wrongAnswers}</Text>
              <Text style={styles.statBoxValue}>{incorrect}</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="timer-outline" size={20} color="#9ca3af" />
              <Text style={styles.statBoxLabel}>{t.avgTime}</Text>
              <Text style={styles.statBoxValue}>{avgTime}s</Text>
            </View>
            <View style={styles.statBox}>
              <View style={styles.xpIconBadge}>
                <Text style={styles.xpIconText}>XP</Text>
              </View>
              <Text style={styles.statBoxLabel}>{t.gainedXp}</Text>
              <Text style={styles.statBoxValue}>{isWin ? `+25` : '-'}</Text>
            </View>
          </View>
        </Animated.View>

        {/* VS Badge */}
        <View style={styles.vsBadgeContainer}>
          <View style={styles.vsBadgeGlow}>
            <Text style={styles.vsBadgeText}>VS</Text>
          </View>
        </View>

        {/* Opponent Card */}
        <Animated.View style={[styles.playerCard, { borderColor: oppBorder, shadowColor: oppColor }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardInfo}>
              <View style={[styles.avatarGlow, { borderColor: oppColor }]}>
                <Image source={require('../assets/avatar_david.jpg')} style={styles.avatarImage} />
              </View>
              <View style={styles.cardDetails}>
                <View style={styles.nameRow}>
                  <Text style={styles.flag}>🇺🇿</Text>
                  <Text style={styles.playerName}>{t.opponent}</Text>
                </View>
                <View style={styles.trophyRow}>
                  <MaterialCommunityIcons name="star" size={12} color="#facc15" />
                  <Text style={styles.trophyText}>{t.level} 10</Text>
                </View>
                <View style={styles.healthBarTrack}>
                  <View style={[styles.healthBarFill, { backgroundColor: oppColor, width: '100%' }]} />
                </View>
              </View>
            </View>
            <Text style={[styles.scoreText, { color: !isWin ? '#22c55e' : '#ef4444', fontSize: 18, textAlign: 'right', flex: 1, flexWrap: 'wrap' }]}>{oppFeedback}</Text>
          </View>

          <View style={styles.statsDivider} />

          <View style={styles.cardStats}>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="check-circle-outline" size={20} color="#22c55e" />
              <Text style={styles.statBoxLabel}>{t.correctAnswers}</Text>
              <Text style={styles.statBoxValue}>{oppCorrect}</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="close-circle-outline" size={20} color="#ef4444" />
              <Text style={styles.statBoxLabel}>{t.wrongAnswers}</Text>
              <Text style={styles.statBoxValue}>{oppIncorrect}</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="timer-outline" size={20} color="#9ca3af" />
              <Text style={styles.statBoxLabel}>{t.avgTime}</Text>
              <Text style={styles.statBoxValue}>{oppAvgTime}s</Text>
            </View>
            <View style={styles.statBox}>
              <View style={styles.xpIconBadge}>
                <Text style={styles.xpIconText}>XP</Text>
              </View>
              <Text style={styles.statBoxLabel}>{t.gainedXp}</Text>
              <Text style={styles.statBoxValue}>{!isWin ? `+${oppCorrect * 15}` : '-'}</Text>
            </View>
          </View>
        </Animated.View>

        </Animated.View>

        {/* Actions - Pushed to bottom */}
        <View style={styles.bottomActions}>
          <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.chatBtn}>
            <MaterialCommunityIcons name="chat-processing-outline" size={18} color="#d1d5db" />
            <Text style={styles.chatBtnText}>{t.chat}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.playAgainBtn} onPress={() => navigation.navigate('BattleSettings', { language })}>
            <Text style={styles.playAgainBtnText}>{t.playAgain}</Text>
            <MaterialCommunityIcons name="refresh" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

          <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('StudentDashboard', { initialTab: 'exercise', initialExerciseType: 'battle', language, updatedTimestamp: Date.now() })}>
            <MaterialCommunityIcons name="home" size={20} color="#fff" />
            <Text style={styles.homeBtnText}>{t.home}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05050A',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  battleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  battleTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_800ExtraBold',
    marginLeft: 6,
  },
  badge1v1: {
    color: '#f97316',
    fontSize: 12,
  },
  battleSubtitle: {
    color: '#d1d5db',
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
    marginLeft: 4,
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  energyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 4,
  },
  energyText: { color: '#fff', fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 4,
  },
  coinText: { color: '#fff', fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexGrow: 1,
  },
  cardsWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  bottomActions: {
    marginTop: 'auto',
  },
  titleArea: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  crownIcon: {
    marginBottom: 5,
    textShadowColor: 'rgba(245, 158, 11, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  mainTitleText: {
    fontSize: 32,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  subTitleText: {
    color: '#d1d5db',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginTop: 4,
  },
  answerArea: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  answerText: {
    color: '#9ca3af',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    marginVertical: 2,
  },
  correctAnswerVal: {
    color: '#10b981',
    fontFamily: 'Inter_800ExtraBold',
  },
  userAnswerVal: {
    fontFamily: 'Inter_800ExtraBold',
  },
  playerCard: {
    backgroundColor: 'rgba(10, 15, 28, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarGlow: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  avatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  cardDetails: {
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flag: { fontSize: 12 },
  playerName: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  trophyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  trophyText: {
    color: '#d1d5db',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  healthBarTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginTop: 6,
    width: 100,
  },
  healthBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  scoreText: {
    fontSize: 32,
    fontFamily: 'Inter_900Black',
  },
  statsDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 15,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statBoxLabel: {
    color: '#6b7280',
    fontSize: 8,
    fontFamily: 'Inter_500Medium',
    marginTop: 6,
    marginBottom: 4,
    textAlign: 'center',
  },
  statBoxValue: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  vsBadgeContainer: {
    alignItems: 'center',
    marginVertical: -15,
    zIndex: 10,
  },
  vsBadgeGlow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#05050A',
    borderWidth: 2,
    borderColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  vsBadgeText: {
    color: '#f97316',
    fontSize: 18,
    fontFamily: 'Inter_900Black',
    fontStyle: 'italic',
  },
  rewardsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(10, 15, 28, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  rewardBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  xpIconBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#a855f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  xpIconText: {
    color: '#fff',
    fontSize: 8,
    fontFamily: 'Inter_800ExtraBold',
  },
  rewardLabel: {
    color: '#9ca3af',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  rewardValue: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_800ExtraBold',
  },
  rewardDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  chatBtn: {
    flex: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 6,
  },
  chatBtnText: {
    color: '#d1d5db',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  playAgainBtn: {
    flex: 0.6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  playAgainBtnText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
  },
  homeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 12,
    gap: 8,
  },
  homeBtnText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  }
});
