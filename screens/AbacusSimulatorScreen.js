import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, PanResponder, Platform, StatusBar, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Audio } from '../src/utils/safeAudio';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MentalMathGenerator } from '../src/lib/mathGenerator';
import { API_URL } from '../src/config/api';

const TRANSLATIONS = {
  en: { title: "ABACUS SIMULATOR", mathTitle: "ABACUS CALCULATION", subtitle: "TEACHING MODE", mathSubtitle: "PRACTICE MODE", reset: "RESET", step: "Step", time: "Time", winTitle: "VICTORY!", winSub: "You solved all steps on the abacus!", gainedXp: "Gained XP", playAgain: "PLAY AGAIN", goHome: "RETURN HOME" },
  ru: { title: "СИМУЛЯТОР АБАКУСА", mathTitle: "СЧЕТ НА АБАКУСЕ", subtitle: "РЕЖИМ ОБУЧЕНИЯ", mathSubtitle: "РЕЖИМ ТРЕНИРОВКИ", reset: "СБРОС", step: "Шаг", time: "Время", winTitle: "ПОБЕДА!", winSub: "Вы успешно решили все примеры на абакусе!", gainedXp: "Получено XP", playAgain: "ИГРАТЬ СНОВА", goHome: "НА ГЛАВНУЮ" },
  uz: { title: "ABAKUS SIMULYATORI", mathTitle: "ABAKUSDA HISOBLASH", subtitle: "O'RGANISH REJIMI", mathSubtitle: "MASHQ REJIMI", reset: "QAYTA O'RNATISH", step: "Had", time: "Vaqt", winTitle: "G'ALABA!", winSub: "Barcha misollarni abakusda muvaffaqiyatli yechdingiz!", gainedXp: "Olingan XP", playAgain: "YANA BIR BOR", goHome: "BOSH SAHIFAGA" },
  ar: { title: "محاكي المعداد", mathTitle: "الحساب على المعداد", subtitle: "وضع التعليم", mathSubtitle: "وضع التدريب", reset: "إعادة ضبط", step: "خطوة", time: "الوقت", winTitle: "انتصار!", winSub: "لقد حبلت جميع الأمثلة على المعداد بنجاح!", gainedXp: "XP المكتسبة", playAgain: "العب مرة أخرى", goHome: "الرئيسية" },
  tr: { title: "ABAKÜS SİMÜLATÖRÜ", mathTitle: "ABAKÜSTE HESAPLAMA", subtitle: "ÖĞRETİM MODU", mathSubtitle: "PRATİK MODU", reset: "SIFIRLA", step: "Adım", time: "Süre", winTitle: "ZAFER!", winSub: "Tüm örnekleri abaküste başarıyla çözdün!", gainedXp: "Kazanılan XP", playAgain: "TEKRAR OYNA", goHome: "ANASAYFA" },
  zh: { title: "算盘模拟器", mathTitle: "算盘计算", subtitle: "教学模式", mathSubtitle: "练习模式", reset: "重置", step: "步骤", time: "时间", winTitle: "胜利！", winSub: "你成功在算盘上解答了所有题目！", gainedXp: "获得的 XP", playAgain: "再玩一次", goHome: "返回主页" },
  ky: { title: "АБАКУС СИМУЛЯТОРУ", mathTitle: "АБАКУСТА ЭСЕПТӨӨ", subtitle: "ОКУТУУ РЕЖИМИ", mathSubtitle: "МАШГУУЛАНУУ РЕЖИМИ", reset: "КАЙРА КОЮУ", step: "Кадам", time: "Убакыт", winTitle: "ЖЕҢИШ!", winSub: "Абакуста бардык мисалдарды ийгиликтүү аткардыңыз!", gainedXp: "Алынган XP", playAgain: "КАЙРА ОЙНОО", goHome: "БАШКЫ БЕТКЕ" },
  kk: { title: "АБАКУС СИМУЛЯТОРЫ", mathTitle: "АБАКУСТА ЕСЕПТЕУ", subtitle: "ОҚЫТУ РЕЖІМІ", mathSubtitle: "ЖАТТЫҒУ РЕЖІМІ", reset: "ҚАЛПЫНА КЕЛТІРУ", step: "Қадам", time: "Уақыт", winTitle: "ЖЕҢІС!", winSub: "Абакуста барлық мысалдарды сәтті шештіңіз!", gainedXp: "Алынған XP", playAgain: "ҚАЙТА ОЙНАУ", goHome: "БАСТЫ БЕТКЕ" },
  tg: { title: "СИМУЛЯТОРИ АБАКУС", mathTitle: "ҲИСОБ ДАР АБАКУС", subtitle: "РЕҶАИ ОМӮЗИШ", mathSubtitle: "РЕҶАИ МАШҚ", reset: "БОЗНАШОНДАН", step: "Қадам", time: "Вақт", winTitle: "ҒАЛАБА!", winSub: "Ҳамаи мисолҳоро дар абакус бомуваффақият ҳал кардед!", gainedXp: "XP гирифта шуд", playAgain: "БОЗ БОЗӢ КУНЕД", goHome: "БА САҲИФАИ АСОСӢ" },
  ja: { title: "そろばんシミュレーター", mathTitle: "そろばん計算", subtitle: "ティーチングモード", mathSubtitle: "練習モード", reset: "リセット", step: "ステップ", time: "時間", winTitle: "勝利！", winSub: "そろばんですべての問題をクリアしました！", gainedXp: "獲得 XP", playAgain: "もう一度プレイ", goHome: "ホームに戻る" },
  ko: { title: "주판 시뮬레이터", mathTitle: "주판 계산", subtitle: "교육 모드", mathSubtitle: "연습 모드", reset: "초기화", step: "단계", time: "시간", winTitle: "승리!", winSub: "주판으로 모든 문제를 성공적으로 풀었습니다!", gainedXp: "획득 XP", playAgain: "다시 플레이", goHome: "홈으로 돌아가기" }
};

const BEAD_WIDTH = 62;
const BEAD_HEIGHT = 36;
const ROD_WIDTH = 8;
const TOP_SLIDE_DISTANCE = 34;
const BOTTOM_SLIDE_DISTANCE = 42;

let globalTickSound = null;

const playBeadSound = async () => {
  try {
    if (globalTickSound) {
      await globalTickSound.replayAsync();
    } else {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/tick.wav'),
        { shouldPlay: true, volume: 1.0 }
      );
      globalTickSound = sound;
    }
  } catch (e) {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/tick.wav'),
        { shouldPlay: true, volume: 1.0 }
      );
      globalTickSound = sound;
    } catch (err) {}
  }
};

const TopBead = ({ onValueChange, resetFlag }) => {
  const panY = useRef(new Animated.Value(0)).current; // 0 = UP (rest), TOP_SLIDE_DISTANCE = DOWN (active)
  const isDown = useRef(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    Animated.spring(panY, { toValue: 0, useNativeDriver: true }).start();
    isDown.current = false;
    setIsActive(false);
    onValueChange(0);
  }, [resetFlag]);

  const handleToggle = (gesture) => {
    const swipedDown = gesture.dy > 10;
    const swipedUp = gesture.dy < -10;
    const tapped = Math.abs(gesture.dy) <= 10;

    if (swipedDown || (tapped && !isDown.current)) {
      isDown.current = true;
      setIsActive(true);
      playBeadSound();
      Animated.spring(panY, { toValue: TOP_SLIDE_DISTANCE, useNativeDriver: true }).start();
      onValueChange(5);
    } else if (swipedUp || (tapped && isDown.current)) {
      isDown.current = false;
      setIsActive(false);
      playBeadSound();
      Animated.spring(panY, { toValue: 0, useNativeDriver: true }).start();
      onValueChange(0);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        playBeadSound();
      },
      onPanResponderRelease: (_, gesture) => {
        handleToggle(gesture);
      },
      onPanResponderTerminate: (_, gesture) => {
        handleToggle(gesture);
      }
    })
  ).current;

  const beadColors = isActive 
    ? ['#D97706', '#B45309', '#78350F', '#451A03'] 
    : ['#FFF176', '#F59E0B', '#B45309', '#78350F'];
  const beadBorderColor = isActive ? '#B45309' : '#FEF08A';

  return (
    <Animated.View style={[styles.beadWrapper, { transform: [{ translateY: panY }] }]} {...panResponder.panHandlers}>
      <LinearGradient colors={beadColors} locations={[0, 0.35, 0.75, 1]} style={[styles.bead, { borderColor: beadBorderColor }]} />
    </Animated.View>
  );
};

const BottomBeads = ({ onValueChange, resetFlag }) => {
  const beadAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;
  
  const beadStates = useRef([false, false, false, false]); // true = UP, false = DOWN
  const [activeStates, setActiveStates] = useState([false, false, false, false]);

  const updateBeads = (newStates) => {
    beadStates.current = newStates;
    setActiveStates([...newStates]);
    playBeadSound();
    const val = newStates.filter(s => s).length;
    onValueChange(val);
    newStates.forEach((state, i) => {
      Animated.spring(beadAnims[i], { toValue: state ? -BOTTOM_SLIDE_DISTANCE : 0, useNativeDriver: true }).start();
    });
  };

  useEffect(() => {
    beadStates.current = [false, false, false, false];
    setActiveStates([false, false, false, false]);
    onValueChange(0);
    [0, 1, 2, 3].forEach(i => {
      Animated.spring(beadAnims[i], { toValue: 0, useNativeDriver: true }).start();
    });
  }, [resetFlag]);

  const handleBeadToggle = (index, gesture) => {
    const swipedUp = gesture.dy < -10;
    const swipedDown = gesture.dy > 10;
    const tapped = Math.abs(gesture.dy) <= 10;

    let newStates = [...beadStates.current];

    if (swipedUp || (tapped && !beadStates.current[index])) {
      for (let i = 0; i <= index; i++) {
        newStates[i] = true;
      }
    } else if (swipedDown || (tapped && beadStates.current[index])) {
      for (let i = index; i < 4; i++) {
        newStates[i] = false;
      }
    }
    updateBeads(newStates);
  };

  const responders = useRef([0, 1, 2, 3].map(index => 
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        playBeadSound();
      },
      onPanResponderRelease: (_, gesture) => {
        handleBeadToggle(index, gesture);
      },
      onPanResponderTerminate: (_, gesture) => {
        handleBeadToggle(index, gesture);
      }
    })
  )).current;

  return (
    <View style={styles.bottomBeadsContainer}>
      {[0, 1, 2, 3].map(i => {
        const isActive = activeStates[i];
        const beadColors = isActive 
          ? ['#D97706', '#B45309', '#78350F', '#451A03'] 
          : ['#FFF176', '#F59E0B', '#B45309', '#78350F'];
        const beadBorderColor = isActive ? '#B45309' : '#FEF08A';

        return (
          <Animated.View key={i} style={[styles.beadWrapper, { transform: [{ translateY: beadAnims[i] }] }]} {...responders[i].panHandlers}>
            <LinearGradient colors={beadColors} locations={[0, 0.35, 0.75, 1]} style={[styles.bead, { borderColor: beadBorderColor }]} />
          </Animated.View>
        );
      })}
    </View>
  );
};

const AbacusColumn = ({ label, onValueChange, resetFlag }) => {
  const [topVal, setTopVal] = useState(0);
  const [bottomVal, setBottomVal] = useState(0);

  useEffect(() => {
    onValueChange(topVal + bottomVal);
  }, [topVal, bottomVal]);

  return (
    <View style={styles.column}>
      {/* Rod */}
      <LinearGradient colors={['#94A3B8', '#CBD5E1', '#64748B']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.rod} />

      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.topBeadArea}>
          <TopBead onValueChange={setTopVal} resetFlag={resetFlag} />
        </View>
      </View>

      {/* Middle Bar Piece */}
      <View style={styles.middleBarPiece} />

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.bottomBeadArea}>
           <BottomBeads onValueChange={setBottomVal} resetFlag={resetFlag} />
        </View>
      </View>
    </View>
  );
};

export default function AbacusSimulatorScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const language = route.params?.language || 'uz';
  const mode = route.params?.mode || 'classic'; // 'classic' | 'math'
  const examplesCount = route.params?.examplesCount || 7;
  const digits = route.params?.digits || 1;
  const t = TRANSLATIONS[language] || TRANSLATIONS['uz'];

  const [resetFlag, setResetFlag] = useState(0);
  const [values, setValues] = useState({ 1000: 0, 100: 0, 10: 0, 1: 0 });

  // Math game mode state
  const [sequence, setSequence] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [timerMs, setTimerMs] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);

  // Initialize Audio
  useEffect(() => {
    async function setupAudio() {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, allowsRecordingIOS: false, staysActiveInBackground: false });
        if (!globalTickSound) {
          const { sound } = await Audio.Sound.createAsync(
            require('../assets/sounds/tick.wav'),
            { shouldPlay: false, volume: 1.0 }
          );
          globalTickSound = sound;
        }
      } catch (e) {}
    }
    setupAudio();

    // Activity logging
    AsyncStorage.getItem('user_data').then(dataStr => {
      const userData = dataStr ? JSON.parse(dataStr) : null;
      const userIdKey = userData?.customId || userData?.id || 'guest';

      AsyncStorage.getItem('user_activity_history').then(histVal => {
        let history = histVal ? JSON.parse(histVal) : [];
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const title = mode === 'math' ? `Abakusda hisoblash (${examplesCount} had)` : "Abakus simulyatori";
        const newEntry = {
          id: Date.now(),
          title,
          time: `Bugun, ${timeStr}`,
          xpGained: mode === 'math' ? 0 : 10
        };

        history = [newEntry, ...history.filter(h => h.title !== title)].slice(0, 3);
        AsyncStorage.setItem('user_activity_history', JSON.stringify(history)).catch(() => {});
        AsyncStorage.setItem(`user_activity_history_${userIdKey}`, JSON.stringify(history)).catch(() => {});
      }).catch(() => {});
    });

    return () => {};
  }, []);

  // Initialize Math Problem for 'math' mode
  const initMathProblem = () => {
    try {
      const q = MentalMathGenerator.generate('aralash', digits, examplesCount);
      let parts = q.display.split(' ');
      let steps = [];
      let currentSum = 0;

      const firstVal = parseInt(parts[0]);
      currentSum += firstVal;
      steps.push({
        displayStr: `${firstVal >= 0 ? '+' : ''}${firstVal}`,
        val: firstVal,
        targetSum: currentSum
      });

      for (let i = 1; i < parts.length; i += 2) {
        const op = parts[i];
        const num = parseInt(parts[i + 1]);
        const signedVal = op === '-' ? -num : num;
        currentSum += signedVal;
        steps.push({
          displayStr: `${op}${num}`,
          val: signedVal,
          targetSum: currentSum
        });
      }

      setSequence(steps);
      setStepIndex(0);
      setIsCompleted(false);
      setTimerMs(0);
      setShowResultModal(false);
      setResetFlag(prev => prev + 1);
    } catch (e) {
      console.log('Math problem init error:', e);
    }
  };

  useEffect(() => {
    if (mode === 'math') {
      initMathProblem();
    }
  }, [mode, digits, examplesCount]);

  // Live Timer for Math mode
  useEffect(() => {
    let interval;
    if (mode === 'math' && !isCompleted && sequence.length > 0) {
      interval = setInterval(() => {
        setTimerMs(prev => prev + 100);
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mode, isCompleted, sequence.length]);

  const totalValue = values[1000] * 1000 + values[100] * 100 + values[10] * 10 + values[1];

  // Check Bead Value against current step target sum
  useEffect(() => {
    if (mode === 'math' && sequence.length > 0 && !isCompleted) {
      const currentStep = sequence[stepIndex];
      if (currentStep && totalValue === currentStep.targetSum) {
        // Play positive correct sound
        try {
          Audio.Sound.createAsync(require('../assets/sounds/correct.wav'), { shouldPlay: true });
        } catch (e) {}

        if (stepIndex + 1 < sequence.length) {
          // Advance to next step
          setStepIndex(prev => prev + 1);
        } else {
          // Problem fully completed!
          setIsCompleted(true);
          const timeInSec = (timerMs / 1000).toFixed(1);
          const xp = Math.round(20 + (examplesCount * digits * 2));
          setEarnedXp(xp);
          setShowResultModal(true);

          // Save XP reward
          saveMathRewards(xp, timeInSec);
        }
      }
    }
  }, [totalValue, stepIndex, sequence, mode, isCompleted]);

  const saveMathRewards = async (xpToAdd, timeSec) => {
    try {
      const userDataStr = await AsyncStorage.getItem('user_data');
      if (userDataStr) {
        const uData = JSON.parse(userDataStr);
        uData.xp = (uData.xp || 0) + xpToAdd;
        await AsyncStorage.setItem('user_data', JSON.stringify(uData));

        fetch(`${API_URL}/user/xp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customId: uData.customId || uData.id, xpToAdd })
        }).catch(() => {});
      }
    } catch (e) {}
  };

  const handleReset = () => {
    setResetFlag(prev => prev + 1);
  };

  const formattedTimer = (timerMs / 1000).toFixed(1);
  const currentStepData = sequence[stepIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>{mode === 'math' ? t.mathTitle : t.title}</Text>
            <View style={styles.subtitleContainer}>
              <LinearGradient colors={['transparent', 'rgba(168, 85, 247, 0.5)', 'transparent']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.subtitleLine} />
              <Text style={styles.headerSubtitle}>{mode === 'math' ? t.mathSubtitle : t.subtitle}</Text>
              <LinearGradient colors={['transparent', 'rgba(168, 85, 247, 0.5)', 'transparent']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.subtitleLine} />
            </View>
          </View>
        </View>

        {/* Math Mode Live Problem Banner */}
        {mode === 'math' && (
          <View style={styles.mathBannerContainer}>
            <View style={styles.mathTopInfoRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>
                  {t.step} {stepIndex + 1} / {sequence.length}
                </Text>
              </View>
              <View style={styles.timerBadge}>
                <MaterialCommunityIcons name="timer-outline" size={16} color="#3B82F6" style={{ marginRight: 4 }} />
                <Text style={styles.timerBadgeText}>{formattedTimer}s</Text>
              </View>
            </View>

            {/* Current Step Value Display */}
            {currentStepData && (
              <View style={styles.currentStepDisplay}>
                <Text style={[
                  styles.currentStepText,
                  { color: currentStepData.val >= 0 ? '#10B981' : '#EF4444' }
                ]}>
                  {currentStepData.displayStr}
                </Text>
                
                {/* Target & Current Abacus Helper Row */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 }}>
                  <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.4)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                    <Text style={{ color: '#34D399', fontFamily: 'Inter_700Bold', fontSize: 12 }}>
                      Natija: {currentStepData.targetSum}
                    </Text>
                  </View>
                  <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                    <Text style={{ color: '#D1D5DB', fontFamily: 'Inter_600SemiBold', fontSize: 12 }}>
                      Abakusda: {totalValue}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Main Content Area */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', paddingBottom: 40 }}>

        {/* Abacus Frame */}
        <View style={styles.abacusContainer}>
          <LinearGradient colors={['#5D4037', '#3E2723']} style={styles.outerFrame}>
            {/* Golden Corners */}
            <LinearGradient colors={['#FDE047', '#D97706']} style={[styles.corner, styles.cornerTL]} />
            <LinearGradient colors={['#FDE047', '#D97706']} style={[styles.corner, styles.cornerTR]} />
            <LinearGradient colors={['#FDE047', '#D97706']} style={[styles.corner, styles.cornerBL]} />
            <LinearGradient colors={['#FDE047', '#D97706']} style={[styles.corner, styles.cornerBR]} />

            <View style={styles.innerShadow}>
              <View style={styles.abacusInner}>

                {/* Horizontal Bar (Metallic Beam) */}
                <LinearGradient colors={['#FFFFFF', '#E2E8F0', '#94A3B8', '#F8FAFC']} start={{x:0, y:0}} end={{x:0, y:1}} style={styles.horizontalBar} />

                {/* Columns */}
                <View style={styles.columnsRow}>
                  <AbacusColumn label="1000" resetFlag={resetFlag} onValueChange={(v) => setValues(prev => ({...prev, 1000: v}))} />
                  <AbacusColumn label="100" resetFlag={resetFlag} onValueChange={(v) => setValues(prev => ({...prev, 100: v}))} />
                  <AbacusColumn label="10" resetFlag={resetFlag} onValueChange={(v) => setValues(prev => ({...prev, 10: v}))} />
                  <AbacusColumn label="1" resetFlag={resetFlag} onValueChange={(v) => setValues(prev => ({...prev, 1: v}))} />
                </View>

              </View>
            </View>
          </LinearGradient>
        </View>


        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.7}>
            <MaterialCommunityIcons name="refresh" size={20} color="#D1D5DB" />
            <Text style={styles.resetBtnText}>{t.reset}</Text>
          </TouchableOpacity>
        </View>
        
        </View>

        {/* MATH MODE COMPLETION MODAL */}
        <Modal visible={showResultModal} transparent animationType="fade" onRequestClose={() => {}}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalTrophyBadge}>
                <MaterialCommunityIcons name="crown" size={50} color="#F59E0B" />
              </View>

              <Text style={styles.modalWinTitle}>{t.winTitle}</Text>
              <Text style={styles.modalWinSub}>{t.winSub}</Text>

              {/* Stats Box */}
              <View style={styles.resultStatsGrid}>
                <View style={styles.resultStatBox}>
                  <MaterialCommunityIcons name="timer-outline" size={22} color="#3B82F6" />
                  <Text style={styles.resultStatLabel}>{t.time}</Text>
                  <Text style={styles.resultStatVal}>{formattedTimer} s</Text>
                </View>

                <View style={styles.resultStatBox}>
                  <MaterialCommunityIcons name="format-list-numbered" size={22} color="#10B981" />
                  <Text style={styles.resultStatLabel}>{t.step}</Text>
                  <Text style={styles.resultStatVal}>{sequence.length}</Text>
                </View>

                <View style={styles.resultStatBox}>
                  <View style={styles.xpIconBadge}>
                    <Text style={styles.xpIconText}>XP</Text>
                  </View>
                  <Text style={styles.resultStatLabel}>{t.gainedXp}</Text>
                  <Text style={[styles.resultStatVal, { color: '#F59E0B' }]}>+{earnedXp} XP</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.modalButtonsRow}>
                <TouchableOpacity style={styles.modalPlayAgainBtn} onPress={initMathProblem} activeOpacity={0.8}>
                  <MaterialCommunityIcons name="refresh" size={18} color="#FFF" style={{ marginRight: 6 }} />
                  <Text style={styles.modalBtnText}>{t.playAgain}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalHomeBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
                  <MaterialCommunityIcons name="home" size={18} color="#FFF" style={{ marginRight: 6 }} />
                  <Text style={styles.modalBtnText}>{t.goHome}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#05050C',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#05050C',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 40,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  subtitleLine: {
    height: 1,
    width: 30,
    marginHorizontal: 8,
  },
  headerSubtitle: {
    color: '#A855F7',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  mathBannerContainer: {
    width: '90%',
    backgroundColor: 'rgba(10, 15, 30, 0.8)',
    borderWidth: 1.5,
    borderColor: 'rgba(59, 130, 246, 0.4)',
    borderRadius: 16,
    padding: 14,
    marginTop: 5,
    alignItems: 'center',
  },
  mathTopInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  stepBadge: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.4)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stepBadgeText: {
    color: '#E9D5FF',
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  timerBadgeText: {
    color: '#60A5FA',
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
  },
  currentStepDisplay: {
    marginTop: 10,
    alignItems: 'center',
  },
  currentStepText: {
    fontSize: 48,
    fontFamily: 'Inter_900Black',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  abacusContainer: {
    width: 350,
    height: 310,
    marginTop: 10,
  },
  outerFrame: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#795548',
    elevation: 10,
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 6,
    zIndex: 10,
  },
  cornerTL: { top: -2, left: -2 },
  cornerTR: { top: -2, right: -2 },
  cornerBL: { bottom: -2, left: -2 },
  cornerBR: { bottom: -2, right: -2 },
  innerShadow: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#2D1B15',
  },
  abacusInner: {
    flex: 1,
    position: 'relative',
  },
  horizontalBar: {
    position: 'absolute',
    top: 72,
    left: 0,
    right: 0,
    height: 12,
    zIndex: 5,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#FDE047',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
  },
  columnsRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
  },
  column: {
    width: 70,
    height: '100%',
    alignItems: 'center',
    zIndex: 2,
  },
  topSection: {
    height: 70,
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  topBeadArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  middleBarPiece: {
    height: 16,
    width: '100%',
  },
  bottomSection: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  bottomBeadArea: {
    position: 'absolute',
    top: 0,
    bottom: 4,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  bottomBeadsContainer: {
    height: BEAD_HEIGHT * 4 + BOTTOM_SLIDE_DISTANCE,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  rod: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: ROD_WIDTH,
    borderRadius: ROD_WIDTH / 2,
    zIndex: 1,
  },
  beadWrapper: {
    width: BEAD_WIDTH,
    height: BEAD_HEIGHT,
    paddingVertical: 1,
  },
  bead: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#FEF08A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 6,
  },
  bottomControls: {
    flexDirection: 'row',
    marginTop: 40,
    paddingHorizontal: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  resetBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  resetBtnText: {
    color: '#D1D5DB',
    marginLeft: 8,
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 5, 12, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#0F0F24',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  modalTrophyBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalWinTitle: {
    color: '#F59E0B',
    fontSize: 28,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1,
    marginBottom: 6,
  },
  modalWinSub: {
    color: '#D1D5DB',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    marginBottom: 20,
  },
  resultStatsGrid: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
  },
  resultStatBox: {
    flex: 1,
    alignItems: 'center',
  },
  resultStatLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    marginTop: 4,
    marginBottom: 2,
  },
  resultStatVal: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
  xpIconBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  xpIconText: {
    color: '#FFF',
    fontSize: 9,
    fontFamily: 'Inter_900Black',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  modalPlayAgainBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    borderRadius: 14,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHomeBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#FFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
  },
});
