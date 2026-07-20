import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, SafeAreaView, Dimensions, ScrollView, Image, Animated, Easing } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import ConfettiCannon from 'react-native-confetti-cannon';
import { MentalMathGenerator } from '../src/lib/mathGenerator';

const TRANSLATIONS = {
  en: { getReady: "GET READY", rememberNumber: "REMEMBER THE NUMBER!", correctAnswer: "Correct answer!", incorrectAnswer: "Incorrect answer", awesome: "Awesome!", oops: "Oops...", exerciseCompleted: "Exercise completed successfully", tryAgainFeedback: "Try again!", correctLabel: "Correct answer:", yourAnswer: "Your answer:", answerTime: "Answer time:", sequence: "Sequence of examples:", iqromaxRecommendation: "IQROMAX recommendation", championText: "Great job!\nYou are a real IQROMAX champion!", rushText: "Don't rush!\nFocus and try again.", back: "Back", nextExercise: "Next exercise", retry: "Try again", newExercise: "New exercise", enterAnswer: "Enter answer...", timeLabel: "Time", accuracy: "ACCURACY", averageTime: "AVERAGE TIME", gameTitle: "SIMPLE MATH", tipTitle: "Tip", tipDesc: "Helps in the next question" },
  ru: { getReady: "ПРИГОТОВЬТЕСЬ", rememberNumber: "ЗАПОМНИТЕ ЧИСЛО!", correctAnswer: "Правильный ответ!", incorrectAnswer: "Неправильный ответ", awesome: "Отлично!", oops: "Увы...", exerciseCompleted: "Упражнение успешно завершено", tryAgainFeedback: "Попробуйте еще раз!", correctLabel: "Правильный ответ:", yourAnswer: "Ваш ответ:", answerTime: "Время ответа:", sequence: "Последовательность примеров:", iqromaxRecommendation: "Рекомендация IQROMAX", championText: "Отличная работа!\nВы настоящий чемпион IQROMAX!", rushText: "Не торопитесь!\nСосредоточьтесь и попробуйте снова.", back: "Назад", nextExercise: "След. упражнение", retry: "Повторить", newExercise: "Новое упражнение", enterAnswer: "Введите ответ...", timeLabel: "Время", accuracy: "ТОЧНОСТЬ", averageTime: "СРЕДНЕЕ ВРЕМЯ", gameTitle: "ПРОСТОЙ СЧЕТ", tipTitle: "Подсказка", tipDesc: "Поможет в следующем вопросе" },
  uz: { getReady: "TAYYORLANING", rememberNumber: "SONNI YODDA SAQLANG!", correctAnswer: "To'g'ri javob!", incorrectAnswer: "Noto'g'ri javob", awesome: "Ajoyib!", oops: "Afsus...", exerciseCompleted: "Mashq muvaffaqiyatli yakunlandi", tryAgainFeedback: "Yana urinib ko'ring!", correctLabel: "To'g'ri javob:", yourAnswer: "Sizning javobingiz:", answerTime: "Javob vaqti:", sequence: "Misollar ketma-ketligi:", iqromaxRecommendation: "IQROMAX tavsiya", championText: "Ajoyib ish!\nSiz haqiqiy IQROMAX chempionisiz!", rushText: "Shoshilmang!\nDiqqatni jamlab, qaytadan urinib ko'ring.", back: "Orqaga", nextExercise: "Keyingi mashq", retry: "Qayta urinish", newExercise: "Yangi mashq", enterAnswer: "Javob kiriting...", timeLabel: "Vaqt", accuracy: "ANIQLIK", averageTime: "O'RTACHA VAQT", gameTitle: "ODDIY HISOB", tipTitle: "Maslahat", tipDesc: "Keyingi savolda yordam beradi" },
  ar: { getReady: "استعد", rememberNumber: "تذكر الرقم!", correctAnswer: "إجابة صحيحة!", incorrectAnswer: "إجابة خاطئة", awesome: "رائع!", oops: "عذراً...", exerciseCompleted: "تم إكمال التمرين بنجاح", tryAgainFeedback: "حاول مرة أخرى!", correctLabel: "الإجابة الصحيحة:", yourAnswer: "إجابتك:", answerTime: "وقت الإجابة:", sequence: "تسلسل الأمثلة:", iqromaxRecommendation: "توصية IQROMAX", championText: "عمل رائع!\nأنت بطل IQROMAX الحقيقي!", rushText: "لا تتعجل!\nركز وحاول مرة أخرى.", back: "رجوع", nextExercise: "التمرين التالي", retry: "حاول مجدداً", newExercise: "تمرين جديد", enterAnswer: "أدخل الإجابة...", timeLabel: "وقت", accuracy: "دقة", averageTime: "متوسط الوقت", gameTitle: "حساب بسيط", tipTitle: "تلميح", tipDesc: "يساعد في السؤال التالي" },
  tr: { getReady: "HAZIRLAN", rememberNumber: "SAYIYI UNUTMA!", correctAnswer: "Doğru cevap!", incorrectAnswer: "Yanlış cevap", awesome: "Harika!", oops: "Maalesef...", exerciseCompleted: "Egzersiz başarıyla tamamlandı", tryAgainFeedback: "Tekrar dene!", correctLabel: "Doğru cevap:", yourAnswer: "Senin cevabın:", answerTime: "Cevap süresi:", sequence: "Örnek sırası:", iqromaxRecommendation: "IQROMAX tavsiyesi", championText: "Harika iş!\nSen gerçek bir IQROMAX şampiyonusun!", rushText: "Acele etme!\nOdaklan ve tekrar dene.", back: "Geri", nextExercise: "Sonraki egzersiz", retry: "Tekrar dene", newExercise: "Yeni egzersiz", enterAnswer: "Cevabı girin...", timeLabel: "Zaman", accuracy: "DOĞRULUK", averageTime: "ORTALAMA SÜRE", gameTitle: "BASİT HESAP", tipTitle: "İpucu", tipDesc: "Sonraki soruda yardımcı olur" },
  zh: { getReady: "准备", rememberNumber: "记住数字！", correctAnswer: "回答正确！", incorrectAnswer: "回答错误", awesome: "太棒了！", oops: "哎呀...", exerciseCompleted: "练习圆满完成", tryAgainFeedback: "再试一次！", correctLabel: "正确答案：", yourAnswer: "你的答案：", answerTime: "回答时间：", sequence: "示例顺序：", iqromaxRecommendation: "IQROMAX 建议", championText: "做得好！\n你是真正的 IQROMAX 冠军！", rushText: "别着急！\n集中注意力再试一次。", back: "返回", nextExercise: "下一个练习", retry: "重试", newExercise: "新练习", enterAnswer: "输入答案...", timeLabel: "时间", accuracy: "准确率", averageTime: "平均时间", gameTitle: "简单算术", tipTitle: "提示", tipDesc: "在下一个问题中会有帮助" },
  ky: { getReady: "ДАЯРДАН", rememberNumber: "САНДЫ ЭСТЕП КАЛ!", correctAnswer: "Туура жооп!", incorrectAnswer: "Туура эмес жооп", awesome: "Сонун!", oops: "Аттиң...", exerciseCompleted: "Көнүгүү ийгиликтүү аяктады", tryAgainFeedback: "Дагы аракет кыл!", correctLabel: "Туура жооп:", yourAnswer: "Сенин жообуң:", answerTime: "Жооп убактысы:", sequence: "Мисалдардын ырааты:", iqromaxRecommendation: "IQROMAX сунушу", championText: "Мыкты жумуш!\nСен чыныгы IQROMAX чемпионусуң!", rushText: "Шашпа!\nКөңүлүңдү топтоп, кайра аракет кыл.", back: "Артка", nextExercise: "Кийинки көнүгүү", retry: "Кайра аракет кыл", newExercise: "Жаңы көнүгүү", enterAnswer: "Жоопту киргиз...", timeLabel: "Убакыт", accuracy: "ТАКТЫК", averageTime: "ОРТОЧО УБАКЫТ", gameTitle: "ЖӨНӨКӨЙ ЭСЕП", tipTitle: "Кеңеш", tipDesc: "Кийинки суроодо жардам берет" },
  kk: { getReady: "ДАЙЫНДЫЛ", rememberNumber: "САНДЫ ЕСТЕ САҚТА!", correctAnswer: "Дұрыс жауап!", incorrectAnswer: "Қате жауап", awesome: "Керемет!", oops: "Әттең...", exerciseCompleted: "Жаттығу сәтті аяқталды", tryAgainFeedback: "Қайта байқап көр!", correctLabel: "Дұрыс жауап:", yourAnswer: "Сенің жауабың:", answerTime: "Жауап уақыты:", sequence: "Мысалдар реті:", iqromaxRecommendation: "IQROMAX ұсынысы", championText: "Керемет жұмыс!\nСен нағыз IQROMAX чемпионысың!", rushText: "Асықпа!\nНазарыңды жинап, қайта байқап көр.", back: "Артқа", nextExercise: "Келесі жаттығу", retry: "Қайта байқап көр", newExercise: "Жаңа жаттығу", enterAnswer: "Жауапты енгіз...", timeLabel: "Уақыт", accuracy: "ДӘЛДІК", averageTime: "ОРТАША УАҚЫТ", gameTitle: "ҚАРАПАЙЫМ ЕСЕП", tipTitle: "Кеңес", tipDesc: "Келесі сұрақта көмектеседі" },
  tg: { getReady: "ТАЙЁР ШАВЕД", rememberNumber: "РАҚАМРО ДАР ХОТИР НИГОҲ ДОРЕД!", correctAnswer: "Ҷавоби дуруст!", incorrectAnswer: "Ҷавоби нодуруст", awesome: "Олӣ!", oops: "Мутаассифона...", exerciseCompleted: "Машқ бомуваффақият ба анҷом расид", tryAgainFeedback: "Боз кӯшиш кунед!", correctLabel: "Ҷавоби дуруст:", yourAnswer: "Ҷавоби шумо:", answerTime: "Вақти ҷавоб:", sequence: "Пайдарпайии мисолҳо:", iqromaxRecommendation: "Тавсияи IQROMAX", championText: "Кори олӣ!\nШумо қаҳрамони воқеии IQROMAX ҳастед!", rushText: "Шитоб накунед!\nТаваҷҷӯҳ кунед ва боз кӯшиш кунед.", back: "Ба қафо", nextExercise: "Машқи навбатӣ", retry: "Боз кӯшиш кунед", newExercise: "Машқи нав", enterAnswer: "Ҷавобро ворид кунед...", timeLabel: "Вақт", accuracy: "ДАҚИҚИЯТ", averageTime: "ВАҚТИ МИЁНА", gameTitle: "ҲИСОБИ ОДДӢ", tipTitle: "Маслиҳат", tipDesc: "Дар саволи навбатӣ кӯмак мекунад" },
  ja: { getReady: "準備", rememberNumber: "数字を覚えて！", correctAnswer: "正解！", incorrectAnswer: "不正解", awesome: "素晴らしい！", oops: "おっと...", exerciseCompleted: "演習が正常に完了しました", tryAgainFeedback: "もう一度お試しください！", correctLabel: "正解：", yourAnswer: "あなたの答え：", answerTime: "回答時間：", sequence: "問題の順序：", iqromaxRecommendation: "IQROMAX のおすすめ", championText: "よくできました！\nあなたは真の IQROMAX チャンピオンです！", rushText: "焦らないで！\n集中してもう一度お試しください。", back: "戻る", nextExercise: "次の演習", retry: "再試行", newExercise: "新しい演習", enterAnswer: "答えを入力...", timeLabel: "時間", accuracy: "正確さ", averageTime: "平均時間", gameTitle: "簡単な計算", tipTitle: "ヒント", tipDesc: "次の問題で役立ちます" },
  ko: { getReady: "준비", rememberNumber: "숫자를 기억하세요!", correctAnswer: "정답!", incorrectAnswer: "오답", awesome: "멋져요!", oops: "이런...", exerciseCompleted: "연습이 성공적으로 완료되었습니다", tryAgainFeedback: "다시 시도하세요!", correctLabel: "정답:", yourAnswer: "귀하의 답변:", answerTime: "답변 시간:", sequence: "문제 순서:", iqromaxRecommendation: "IQROMAX 추천", championText: "잘했어요!\n당신은 진정한 IQROMAX 챔피언입니다!", rushText: "서두르지 마세요!\n집중해서 다시 시도하세요.", back: "뒤로", nextExercise: "다음 연습", retry: "다시 시도", newExercise: "새로운 연습", enterAnswer: "답변 입력...", timeLabel: "시간", accuracy: "정확도", averageTime: "평균 시간", gameTitle: "간단한 계산", tipTitle: "팁", tipDesc: "다음 질문에 도움이 됩니다" }
};

const { width, height } = Dimensions.get('window');

export default function OddiyHisobGameScreen({ navigation, route }) {
  // Config from params
  const { examplesCount = 3, operation = 'oddiy', speed = 1, digits = 1, language = 'uz' } = route.params || {};
  const t = TRANSLATIONS[language] || TRANSLATIONS['uz'];

  // Game phases: 'countdown' | 'flashing' | 'input' | 'feedback'
  const [phase, setPhase] = useState('countdown');
  const [countdown, setCountdown] = useState(3);
  
  // Game states
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [seqIndex, setSeqIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  
  const [isLastAnswerCorrect, setIsLastAnswerCorrect] = useState(false);
  const [lastElapsed, setLastElapsed] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;

  // Stats
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [xp, setXp] = useState(0);
  const [combo, setCombo] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  
  // Initialize game
  useEffect(() => {
    const generated = [];
    for (let i = 0; i < 10; i++) {
      generated.push(MentalMathGenerator.generate(operation, digits, examplesCount));
    }
    setQuestions(generated);
  }, []);

  // Timer starts only after countdown
  useEffect(() => {
    if (phase === 'countdown') return;
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime, phase]);

  // Countdown Logic
  useEffect(() => {
    if (phase === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setStartTime(Date.now()); // reset timer at start of flashing
        setPhase('flashing');
      }
    } else if (phase === 'feedback') {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.5);
      translateYAnim.setValue(50);
      shakeAnim.setValue(0);
      flashAnim.setValue(0);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        })
      ]).start(() => {
        if (isLastAnswerCorrect) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2500);
        } else {
          flashAnim.setValue(0.4);
          Animated.parallel([
            Animated.timing(flashAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
            Animated.sequence([
              Animated.timing(shakeAnim, { toValue: 15, duration: 60, useNativeDriver: true }),
              Animated.timing(shakeAnim, { toValue: -15, duration: 60, useNativeDriver: true }),
              Animated.timing(shakeAnim, { toValue: 15, duration: 60, useNativeDriver: true }),
              Animated.timing(shakeAnim, { toValue: -15, duration: 60, duration: 60, useNativeDriver: true }),
              Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true })
            ])
          ]).start();
        }
      });
    }
  }, [phase, countdown, isLastAnswerCorrect]);

  // Handle sequence parsing and flashing
  useEffect(() => {
    if (questions.length > 0 && currentQIndex < questions.length) {
      const q = questions[currentQIndex];
      // For add-sub, split by spaces (e.g. "15 + 12 - 5" -> ["15", "+", "12", "-", "5"])
      // For multiply/divide, maybe just show the whole string, but let's parse it too.
      let parts = q.display.split(' ');
      let newSeq = [];
      if (['multiply', 'kopaytirish', 'divide', 'bolish'].includes(operation)) {
         newSeq = [{ num: parts[0], op: '' }, { num: parts[2], op: parts[1] }];
      } else {
         newSeq.push({ num: parts[0], op: '' });
         for (let i = 1; i < parts.length; i += 2) {
           newSeq.push({ num: parts[i+1], op: parts[i] });
         }
      }
      setSequence(newSeq);
      setSeqIndex(0);
      if (currentQIndex === 0) {
        setPhase('countdown');
        setCountdown(3);
      } else {
        setPhase('flashing');
      }
      setInputValue('');
    }
  }, [currentQIndex, questions]);

  // Sequence tick
  useEffect(() => {
    let timeout;
    if (phase === 'flashing' && sequence.length > 0) {
      if (seqIndex < sequence.length) {
        // user's speed is in seconds (0.1 to 3)
        const delay = speed * 1000;
        timeout = setTimeout(() => {
          if (seqIndex + 1 < sequence.length) {
            setSeqIndex(seqIndex + 1);
          } else {
            setQuestionStartTime(Date.now());
            setPhase('input');
          }
        }, delay);
      }
    }
    return () => clearTimeout(timeout);
  }, [seqIndex, phase, sequence, speed]);

  const handleKeyPress = (val) => {
    if (phase !== 'input') return;
    
    if (val === 'del') {
      setInputValue(prev => prev.slice(0, -1));
    } else if (val === 'enter') {
      submitAnswer();
    } else {
      setInputValue(prev => prev + val);
    }
  };

  const submitAnswer = () => {
    if (!inputValue) return;
    const currentQ = questions[currentQIndex];
    const isCorrect = parseInt(inputValue, 10) === currentQ.answer;
    
    setIsLastAnswerCorrect(isCorrect);
    
    // Calculate accurate answer time for this question
    const timeForThisQuestion = (Date.now() - questionStartTime) / 1000;
    setLastElapsed(timeForThisQuestion.toFixed(1));

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setXp(prev => prev + 15);
      setCombo(prev => prev + 1);
    } else {
      setIncorrectAnswers(prev => prev + 1);
      setCombo(0);
    }

    setPhase('feedback');
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(prev => prev + 1);
      // Wait, currentQIndex change will trigger the useEffect that sets phase to countdown/flashing automatically!
    } else {
      // Game over logic
      navigation.goBack();
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const renderTopBar = () => (
    <View style={styles.topBar}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <MaterialCommunityIcons name="calculator" size={20} color="#3B82F6" />
        <Text style={styles.titleText}>{t.gameTitle}</Text>
      </View>
      <View style={styles.resourceContainer}>
        <View style={styles.energyBadge}>
          <MaterialCommunityIcons name="lightning-bolt" size={16} color="#FBBF24" />
          <Text style={styles.resourceText}>2</Text>
          <MaterialCommunityIcons name="plus" size={14} color="#FBBF24" />
        </View>
        <View style={styles.coinBadge}>
          <Image source={require('../assets/s_coin.png')} style={{ width: 16, height: 16, resizeMode: 'contain' }} />
          <Text style={styles.resourceText}>12 450</Text>
          <MaterialCommunityIcons name="plus" size={14} color="#FBBF24" />
        </View>
      </View>
    </View>
  );

  const renderStatsHeader = () => null;

  const renderFeedbackArea = () => {
    const currentQ = questions[currentQIndex];
    if (!currentQ) return null;
    
    const bgColor = isLastAnswerCorrect ? '#10B981' : '#EF4444';
    const mainTitle = isLastAnswerCorrect ? t.awesome : t.oops;
    const subTitle = isLastAnswerCorrect ? t.exerciseCompleted : "";
    const resultText = isLastAnswerCorrect ? t.correctAnswer : t.incorrectAnswer;
    
    const shieldSrc = isLastAnswerCorrect ? require('../assets/shield_green.png') : require('../assets/shield_red_broken.png');
    const botSrc = isLastAnswerCorrect ? require('../assets/bot_chempion.png') : require('../assets/bot_sad.png');

    const botTextCorrect = t.championText;
    const botTextIncorrect = t.rushText;

    const difference = parseInt(inputValue, 10) - currentQ.answer;
    const diffString = difference > 0 ? `+${difference}` : `${difference}`;

    return (
      <Animated.View style={[styles.feedbackContainer, { opacity: fadeAnim }]}>
        {isLastAnswerCorrect && showConfetti && (
          <View style={[StyleSheet.absoluteFillObject, { zIndex: 100 }]} pointerEvents="none">
            <ConfettiCannon
              count={120}
              origin={{x: width / 2, y: height * 0.3}}
              explosionSpeed={300}
              fallSpeed={1800}
              colors={['#10B981', '#EF4444', '#FBBF24', '#A855F7', '#3B82F6']}
              fadeOut={true}
            />
          </View>
        )}
        <View style={styles.feedbackHeader}>
          <Text style={[styles.feedbackTitle, { color: bgColor }]}>{mainTitle}</Text>
          <Text style={styles.feedbackSubtitle}>{subTitle}</Text>
        </View>

        <Animated.Image source={shieldSrc} style={[styles.shieldImg, !isLastAnswerCorrect && { width: 240, height: 240, marginTop: -30, marginBottom: -15 }, { transform: [{scale: scaleAnim}, {translateX: shakeAnim}] }]} />

        <Animated.Text style={[styles.feedbackResultText, { color: bgColor, marginBottom: isLastAnswerCorrect ? 15 : 4, marginTop: isLastAnswerCorrect ? 0 : -15, transform: [{scale: scaleAnim}] }]}>{resultText}</Animated.Text>
        {!isLastAnswerCorrect && (
          <Animated.Text style={{color: '#D1D5DB', fontFamily: 'Inter_500Medium', fontSize: 16, marginBottom: 15, transform: [{translateX: shakeAnim}]}}>{t.tryAgainFeedback}</Animated.Text>
        )}
        
        {isLastAnswerCorrect && (
          <Animated.View style={[styles.feedbackRewards, { transform: [{translateY: translateYAnim}] }]}>
            <View style={styles.rewardBadge}>
               <Image source={require('../assets/xp_icon.jpg')} style={{width: 24, height: 24, borderRadius: 12}} resizeMode="cover" />
               <Text style={styles.rewardBadgeText}>+15 XP</Text>
            </View>
          </Animated.View>
        )}

        <Animated.View style={[styles.feedbackStatsBox, { transform: [{translateY: translateYAnim}] }]}>
          <Text style={styles.feedbackStatsTitle}>{t.sequence}</Text>
          <Text style={styles.feedbackSequenceText}>{currentQ.display} = <Text style={{color: '#10B981'}}>{currentQ.answer}</Text></Text>

          <View style={styles.feedbackStatRow}>
            <MaterialCommunityIcons name="bullseye" size={16} color="#A855F7" />
            <Text style={styles.fbStatLabel}>{t.correctLabel}</Text>
            <Text style={[styles.fbStatValue, {color: '#10B981'}]}>{currentQ.answer}</Text>
          </View>
          <View style={styles.feedbackStatRow}>
            <MaterialCommunityIcons name="pencil" size={16} color="#A855F7" />
            <Text style={styles.fbStatLabel}>{t.yourAnswer}</Text>
            <Text style={[styles.fbStatValue, {color: bgColor}]}>{inputValue}</Text>
          </View>
          
          {!isLastAnswerCorrect && (
            <View style={styles.feedbackStatRow}>
              <MaterialCommunityIcons name="plus-thick" size={16} color="#A855F7" />
              <Text style={styles.fbStatLabel}>Farq:</Text>
              <Text style={[styles.fbStatValue, {color: '#EF4444'}]}>{diffString}</Text>
            </View>
          )}

          <View style={styles.feedbackStatRow}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#A855F7" />
            <Text style={styles.fbStatLabel}>{t.answerTime}</Text>
            <Text style={[styles.fbStatValue, {color: '#FBBF24'}]}>{lastElapsed}s</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.botContainer, { transform: [{translateY: translateYAnim}] }]}>
          <Image source={botSrc} style={styles.botImg} />
          <View style={[styles.botSpeechBubble, !isLastAnswerCorrect && {backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)'}]}>
            {!isLastAnswerCorrect && (
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 6}}>
                <MaterialCommunityIcons name="lightbulb-on" size={16} color="#EF4444" />
                <Text style={{color: '#EF4444', fontFamily: 'Inter_700Bold', marginLeft: 6}}>{t.iqromaxRecommendation}</Text>
              </View>
            )}
            <Text style={styles.botSpeechText}>{isLastAnswerCorrect ? botTextCorrect : botTextIncorrect}</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.feedbackActions, { transform: [{translateY: translateYAnim}] }]}>
          <TouchableOpacity 
            style={[styles.fbBackBtn, !isLastAnswerCorrect && {backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)'}]} 
            onPress={() => isLastAnswerCorrect ? navigation.goBack() : handleNextQuestion()} // Just a placeholder behavior, but let's make it goback for both or we can define retry logic.
          >
            <MaterialCommunityIcons name={isLastAnswerCorrect ? "chevron-left" : "refresh"} size={20} color={isLastAnswerCorrect ? "#A855F7" : "#F87171"} />
            <Text style={[styles.fbBackBtnText, !isLastAnswerCorrect && {color: '#F87171'}]}>
              {isLastAnswerCorrect ? t.back : t.retry}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.fbNextBtn, !isLastAnswerCorrect && {backgroundColor: '#7C3AED'}]} 
            onPress={handleNextQuestion}
          >
            <Text style={styles.fbNextBtnText}>{isLastAnswerCorrect ? t.nextExercise : t.newExercise}</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#FFF" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {sequence.map((_, i) => (
          <View key={i} style={[styles.dot, i === seqIndex && styles.dotActive]} />
        ))}
      </View>
    );
  };

  const renderFlashingArea = () => {
    if (phase === 'countdown') {
      return (
        <View style={styles.flashingCard}>
          <Text style={{color: '#3B82F6', fontFamily: 'Inter_700Bold', fontSize: 24, marginBottom: 20}}>{t.getReady}</Text>
          <Text style={[styles.hugeNumberText, { fontSize: 100, color: '#FBBF24' }]}>{countdown}</Text>
        </View>
      );
    }

    const currentTerm = sequence[seqIndex] || { num: '?', op: '' };
    const isPlus = currentTerm.op === '+';
    const isMinus = currentTerm.op === '-';
    const isMult = currentTerm.op === 'x';
    const opColor = isPlus ? '#10B981' : isMinus ? '#EF4444' : isMult ? '#A855F7' : '#F59E0B';

    return (
      <View style={styles.flashingCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <View style={[styles.flashingCardOperator, !currentTerm.op && { opacity: 0 }, { marginRight: 20, marginBottom: 15 }]}>
            <Text style={[styles.flashingCardOperatorText, { color: opColor, textShadowColor: opColor }]}>{currentTerm.op || '+'}</Text>
          </View>
          <Text style={[styles.flashingCardNumber, { marginBottom: 0 }]}>{currentTerm.num}</Text>
        </View>
        <Text style={styles.flashingCardText}>{t.rememberNumber}</Text>
        <View style={styles.flashingCardDots}>
          {renderDots()}
        </View>
      </View>
    );
  };

  const renderKeypad = () => {
    const rows = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['del', '0', 'enter']
    ];

    return (
      <View style={styles.keypadContainer}>
        {rows.map((row, ri) => (
          <View key={ri} style={styles.keypadRow}>
            {row.map((btn) => (
              <TouchableOpacity
                key={btn}
                style={[styles.keypadBtn, btn === 'enter' && styles.keypadBtnEnter, btn === 'del' && styles.keypadBtnDel]}
                onPress={() => handleKeyPress(btn)}
              >
                {btn === 'del' ? (
                   <MaterialCommunityIcons name="backspace-outline" size={24} color="#EF4444" />
                ) : btn === 'enter' ? (
                   <MaterialCommunityIcons name="check" size={32} color="#FFF" />
                ) : (
                  <Text style={styles.keypadBtnText}>{btn}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const renderInputArea = () => (
    <View style={styles.inputPhaseWrapper}>
      <View style={styles.inputSection}>
        <Text style={styles.inputSectionTitle}>{t.enterAnswer}</Text>
        <View style={styles.inputField}>
          <Text style={[styles.inputText, !inputValue && {color: '#6B7280'}]}>
            {inputValue || t.enterAnswer}
          </Text>
          {!!inputValue && (
            <TouchableOpacity onPress={() => setInputValue('')} style={styles.clearBtn}>
              <MaterialCommunityIcons name="close-circle" size={16} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
        {renderKeypad()}
      </View>

      <View style={styles.inputBottomActions}>
        <TouchableOpacity style={styles.tipBtnBox}>
          <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color="#3B82F6" />
          <View style={styles.tipTexts}>
            <Text style={styles.tipTitle}>{t.tipTitle}</Text>
            <Text style={styles.tipDesc}>{t.tipDesc}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFlashingBottom = () => {
    if (phase === 'countdown' || phase === 'flashing') {
      return null;
    }
    
    return (
      <View style={styles.flashingBottomWrapper}>
        <View style={styles.maslahatContainer}>
          <MaterialCommunityIcons name="brain" size={32} color="#3B82F6" style={styles.brainIcon} />
          <View>
            <Text style={styles.maslahatTitle}>{t.iqromaxRecommendation}</Text>
            <Text style={styles.maslahatDesc}>{t.rushText}</Text>
          </View>
        </View>
        <View style={{flex: 1}} />

        <View style={styles.bottomStatsContainer}>
          <View style={styles.bottomStatItem}>
            <MaterialCommunityIcons name="bullseye-arrow" size={24} color="#3B82F6" />
            <View style={styles.bottomStatTexts}>
              <Text style={styles.bottomStatLabel}>{t.accuracy}</Text>
              <Text style={styles.bottomStatValueBlue}>
                {currentQIndex === 0 ? '0%' : Math.round((correctAnswers / currentQIndex) * 100) + '%'}
              </Text>
            </View>
          </View>
          <View style={styles.bottomStatDivider} />
          <View style={styles.bottomStatItem}>
            <MaterialCommunityIcons name="timer-outline" size={24} color="#3B82F6" />
            <View style={styles.bottomStatTexts}>
              <Text style={styles.bottomStatLabel}>{t.averageTime}</Text>
              <Text style={styles.bottomStatValueYellow}>
                {currentQIndex === 0 ? '0.0s' : (elapsedTime / currentQIndex).toFixed(1) + 's'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const ScreenContent = (
    <SafeAreaView style={styles.container}>
      
        
      {phase !== 'feedback' && renderTopBar()}
      {!isLastAnswerCorrect && phase === 'feedback' && (
        <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#EF4444', opacity: flashAnim, zIndex: 10 }]} pointerEvents="none" />
      )}
      <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}} showsVerticalScrollIndicator={false}>

        {(phase === 'flashing' || phase === 'countdown') && renderFlashingArea()}

        {phase === 'input' && renderInputArea()}
        
        {phase === 'feedback' && renderFeedbackArea()}
        
        <View style={{height: 30}} />
      </ScrollView>
    
      
    </SafeAreaView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#050510' }}>
      {phase !== 'feedback' ? (
        <ImageBackground source={require('../assets/oddiy_hisob_bg_new.png')} style={styles.bgImage} resizeMode="contain">
          {ScreenContent}
        </ImageBackground>
      ) : (
        <View style={styles.bgImage}>
          {ScreenContent}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 15,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(10, 20, 40, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    color: '#FFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  resourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  energyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 20, 40, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#FBBF24',
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 20, 40, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FBBF24',
  },
  resourceText: {
    color: '#FFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    marginHorizontal: 4,
  },
  statsHeaderContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  statsTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionCounterBox: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  questionLabel: {
    color: '#9CA3AF',
    fontFamily: 'Inter_500Medium',
    fontSize: 9,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  questionValue: {
    color: '#FFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
  questionTotal: {
    color: '#3B82F6',
    fontSize: 14,
  },
  progressBarContainer: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    marginRight: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    color: '#3B82F6',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
  },
  comboCounterBox: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  comboLabel: {
    color: '#9CA3AF',
    fontFamily: 'Inter_500Medium',
    fontSize: 9,
    marginBottom: 2,
  },
  comboValue: {
    color: '#FBBF24',
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    marginLeft: 4,
  },
  statsBottomRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statTexts: {
    marginLeft: 6,
  },
  statItemValue: {
    color: '#FFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
  },
  statItemLabel: {
    color: '#9CA3AF',
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  flashingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashingCard: {
    width: '85%',
    aspectRatio: 1.05,
    backgroundColor: 'rgba(10, 20, 40, 0.6)',
    borderColor: '#3B82F6',
    borderWidth: 1,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  flashingCardNumber: {
    fontSize: 80,
    color: '#FFF',
    fontFamily: 'Inter_700Bold',
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginBottom: 20,
  },
  flashingCardOperator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashingCardOperatorText: {
    fontSize: 90,
    fontFamily: 'Inter_700Bold',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  flashingCardText: {
    marginTop: 30,
    color: '#3B82F6',
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  flashingCardDots: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },

  flashingHeader: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3B82F6',
    position: 'absolute',
    top: -14,
  },
  flashingHeaderText: {
    color: '#60A5FA',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  hugeNumberText: {
    color: '#FFF',
    fontFamily: 'Inter_900Black',
    fontSize: 80,
    marginTop: 10,
  },
  operatorCircle: {
    width: 70,
    height: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  operatorText: {
    color: '#FFF',
    fontFamily: 'Inter_900Black',
    fontSize: 45,
    lineHeight: 50,
  },
  rememberText: {
    color: '#3B82F6',
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 15,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#3B82F6',
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  maslahatContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  brainIcon: {
    marginRight: 12,
  },
  maslahatTitle: {
    color: '#60A5FA',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    marginBottom: 4,
  },
  maslahatDesc: {
    color: '#9CA3AF',
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  bottomStatsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  bottomStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomStatTexts: {
    marginLeft: 8,
  },
  bottomStatLabel: {
    color: '#9CA3AF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 8,
    marginBottom: 2,
  },
  bottomStatValueBlue: {
    color: '#3B82F6',
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
  },
  bottomStatValueYellow: {
    color: '#FBBF24',
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
  },
  bottomStatValueOrange: {
    color: '#F97316',
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
  },
  bottomStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  flashingBottomActions: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
  },
  skipBtn: {
    flex: 1,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginRight: 10,
  },
  skipBtnText: {
    color: '#E9D5FF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    marginHorizontal: 6,
  },
  skipCost: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  skipCostText: {
    color: '#FFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    marginLeft: 2,
  },
  tipBtnBox: {
    flex: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tipTexts: {
    marginLeft: 10,
    flex: 1,
  },
  tipTitle: {
    color: '#60A5FA',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    marginBottom: 2,
  },
  tipDesc: {
    color: '#9CA3AF',
    fontFamily: 'Inter_400Regular',
    fontSize: 9,
  },
  floatingTimerContainer: {
    position: 'absolute',
    bottom: 80,
    right: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingTimerText: {
    color: '#3B82F6',
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    marginLeft: 8,
    textShadowColor: 'rgba(59,130,246,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  flashingBottomWrapper: {
    flex: 1,
  },
  inputPhaseWrapper: {
    marginHorizontal: 16,
  },
  countdownContainer: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  countdownLabel: {
    color: '#9CA3AF',
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  countdownNumber: {
    color: '#FFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    marginTop: 8,
  },
  inputSection: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 16,
    marginTop: 5,
  },
  inputSectionTitle: {
    color: '#3B82F6',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  inputField: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  inputText: {
    color: '#FFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    letterSpacing: 2,
  },
  clearBtn: {
    position: 'absolute',
    right: 15,
  },
  keypadContainer: {
    marginTop: 5,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  keypadBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  keypadBtnText: {
    color: '#FFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 24,
  },
  keypadBtnDel: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  keypadBtnEnter: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  inputBottomActions: {
    flexDirection: 'row',
    marginTop: 16,
  },
  
  // Feedback styles
  feedbackContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  feedbackHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  feedbackTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    marginBottom: 4,
  },
  feedbackSubtitle: {
    color: '#D1D5DB',
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  shieldImg: {
    width: 220,
    height: 150,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  feedbackResultText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    marginBottom: 15,
  },
  feedbackRewards: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 8,
  },
  rewardBadgeText: {
    color: '#FBBF24',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    marginLeft: 6,
  },
  feedbackStatsBox: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  feedbackStatsTitle: {
    color: '#A855F7',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  feedbackSequenceText: {
    color: '#FFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  feedbackStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fbStatLabel: {
    color: '#D1D5DB',
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  fbStatValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  botContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  botImg: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    transform: [{scale: 1.3}],
  },
  botSpeechBubble: {
    flex: 1,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 16,
    borderBottomLeftRadius: 0,
    padding: 12,
    marginLeft: 10,
  },
  botSpeechText: {
    color: '#D1D5DB',
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    lineHeight: 20,
  },
  feedbackActions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  fbBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 0.45,
    justifyContent: 'center',
  },
  fbBackBtnText: {
    color: '#FFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    marginLeft: 4,
  },
  fbNextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 0.5,
    justifyContent: 'center',
  },
  fbNextBtnText: {
    color: '#FFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    marginRight: 4,
  }
});
