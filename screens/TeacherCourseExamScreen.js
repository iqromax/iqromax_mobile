import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Animated,
  Easing
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import { MentalMathGenerator } from '../src/lib/mathGenerator';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');

const SOCKET_URL = Constants.expoConfig?.extra?.apiUrl || 'http://192.168.1.10:3000';
const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://192.168.1.10:3000';

export default function TeacherCourseExamScreen({ route, navigation }) {
  const { examId, autoOpenNextFor } = route.params || {};

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  // Phases: 'theory', 'practical', 'result'
  const [phase, setPhase] = useState('theory');

  // Unified Timer
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // Theory State
  const [theoryQuestions, setTheoryQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [theoryScore, setTheoryScore] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Result State
  const [overallResult, setOverallResult] = useState(''); // 'pass' or 'fail'

  useEffect(() => {
    fetchExamData();
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    let timer;
    if (timerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerRunning, timeLeft]);

  const fetchExamData = async () => {
    try {
      // NOTE: Using general exams list and finding by ID since we don't have a dedicated /exams/:id yet
      const res = await fetch(`${API_URL}/api/courses/exams`);
      const exams = await res.json();
      const currentExam = exams.find(e => e.id === examId);
      
      if (!currentExam) {
        throw new Error("Imtihon topilmadi");
      }

      setExam(currentExam);
      setTheoryQuestions(currentExam.questions || []);

      const durationMinutes = parseInt(currentExam.duration) || 30;
      const totalSec = durationMinutes * 60;
      setTotalTime(totalSec);
      setTimeLeft(totalSec);
      setTimerRunning(true);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Xatolik", "Imtihon ma'lumotlarini yuklab bo'lmadi");
      navigation.goBack();
    }
  };

  const handleTimeUp = () => {
    setTimerRunning(false);
    setOverallResult('fail');
    setPhase('result');
  };

  // ================== THEORY HANDLERS ==================

  const handleSelectAnswer = (qId, answerText) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: answerText }));
  };

  const animateNextTheory = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -50, duration: 200, useNativeDriver: true })
    ]).start(() => {
      setCurrentQIndex(prev => prev + 1);
      slideAnim.setValue(50);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 300, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true })
      ]).start();
    });
  };

  const nextTheoryQuestion = () => {
    const q = theoryQuestions[currentQIndex];
    if (!selectedAnswers[q.id]) {
      return alert("Iltimos, javobni tanlang!");
    }
    if (currentQIndex < theoryQuestions.length - 1) {
      animateNextTheory();
    } else {
      finishTheory();
    }
  };

  const finishTheory = () => {
    let correct = 0;
    theoryQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.answer) correct++;
    });
    const percent = Math.round((correct / theoryQuestions.length) * 100);
    setTheoryScore(percent);

    if (percent < 80) {
      setTimerRunning(false);
      setOverallResult('fail');
      setPhase('result');
    } else {
      setTimerRunning(false);
      setOverallResult('pass');
      saveExamResult(true);
      setPhase('result');
    }
  };



  const saveExamResult = async (passed) => {
    if (!passed) return;
    try {
      const userDataStr = await AsyncStorage.getItem('user_data');
      let userId = "unknown";
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        userId = userData.customId || userData.id || "unknown";
      }

      // Add to completed exams list
      const saved = await AsyncStorage.getItem(`${userId}_teacher_exams_completed`);
      let completedExamIds = saved ? JSON.parse(saved) : [];
      if (!completedExamIds.includes(examId)) {
        completedExamIds.push(examId);
        await AsyncStorage.setItem(`${userId}_teacher_exams_completed`, JSON.stringify(completedExamIds));
      }

      // Update progress on backend
      const progressPayload = { userId, progress: 100 }; // E.g., Exam completes course
      await fetch(`${API_URL}/api/courses/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progressPayload)
      });
    } catch (e) {
      console.log('Error saving exam result', e);
    }
  };

  // ================== RENDERERS ==================

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Imtihon tayyorlanmoqda...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{exam.title}</Text>
        <View style={styles.timerBadge}>
          <MaterialCommunityIcons name="clock-outline" size={16} color={timeLeft < 60 ? "#EF4444" : "#8B5CF6"} />
          <Text style={[styles.timerText, timeLeft < 60 && { color: "#EF4444" }]}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

      {/* PROGRESS BAR (Unified) */}
      {phase !== 'result' && (
        <View style={styles.progressHeader}>
          <View style={styles.progressBarBg}>
            <Animated.View style={[
              styles.progressBarFill, 
              { 
                width: `${(currentQIndex / theoryQuestions.length) * 100}%` 
              }
            ]} />
          </View>
          <Text style={styles.progressText}>
            {`Nazariy: ${currentQIndex + 1}/${theoryQuestions.length}`}
          </Text>
        </View>
      )}

      {/* THEORY PHASE */}
      {phase === 'theory' && (
        <Animated.View style={[styles.phaseContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.questionCard}>
              <View style={styles.qBadge}>
                <Text style={styles.qBadgeText}>{currentQIndex + 1}-savol</Text>
              </View>
              <Text style={styles.questionText}>{theoryQuestions[currentQIndex]?.question}</Text>
            </View>

            <View style={styles.optionsContainer}>
              {theoryQuestions[currentQIndex]?.options.map((opt, idx) => {
                const isSelected = selectedAnswers[theoryQuestions[currentQIndex].id] === opt;
                return (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.7}
                    onPress={() => handleSelectAnswer(theoryQuestions[currentQIndex].id, opt)}
                    style={[styles.optionBtn, isSelected && styles.optionBtnSelected]}
                  >
                    <View style={[styles.optionRadio, isSelected && styles.optionRadioSelected]}>
                      {isSelected && <View style={styles.optionRadioInner} />}
                    </View>
                    <Text style={styles.optionText}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.bottomBar}>
            <TouchableOpacity 
              style={[styles.nextBtn, !selectedAnswers[theoryQuestions[currentQIndex]?.id] && { opacity: 0.5 }]} 
              onPress={nextTheoryQuestion}
              activeOpacity={0.8}
            >
              <LinearGradient colors={['#8B5CF6', '#D946EF']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.nextBtnGrad}>
                <Text style={styles.nextBtnText}>
                  {currentQIndex === theoryQuestions.length - 1 ? 'Yakunlash' : 'Keyingisi'}
                </Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

    
      {/* RESULT PHASE */}
      {phase === 'result' && (
        <View style={styles.resultContainer}>
          <LinearGradient
            colors={overallResult === 'pass' ? ['rgba(16,185,129,0.1)', 'transparent'] : ['rgba(239,68,68,0.1)', 'transparent']}
            style={styles.resultBg}
          />
          <View style={[styles.resultIconWrapper, overallResult === 'pass' ? { backgroundColor: 'rgba(16,185,129,0.2)' } : { backgroundColor: 'rgba(239,68,68,0.2)' }]}>
            <MaterialCommunityIcons 
              name={overallResult === 'pass' ? "check-decagram" : "close-octagon-outline"} 
              size={80} 
              color={overallResult === 'pass' ? "#10B981" : "#EF4444"} 
            />
          </View>
          <Text style={styles.resultTitle}>
            {overallResult === 'pass' ? 'Tabriklaymiz!' : 'Imtihondan o\'ta olmadingiz'}
          </Text>
          <Text style={styles.resultDesc}>
            {overallResult === 'pass' 
              ? 'Siz imtihondan muvaffaqiyatli o\'tdingiz va sertifikatni qo\'lga kiritdingiz!' 
              : 'Nazariy va amaliy qismlardan kamida 80% to\'plashingiz kerak edi.'}
          </Text>

          <View style={styles.scoreCards}>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreCardTitle}>Nazariy natija</Text>
              <Text style={[styles.scoreCardValue, theoryScore >= 80 ? { color: '#10B981' } : { color: '#EF4444' }]}>{theoryScore}%</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.finishBtn}
            onPress={() => {
              navigation.navigate('TeacherCourseLessons', { autoOpenNextFor: autoOpenNextFor });
            }}
          >
            <LinearGradient colors={['#8B5CF6', '#D946EF']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.finishBtnGrad}>
              <MaterialCommunityIcons name="home" size={24} color="#FFF" />
              <Text style={styles.finishBtnText}>Darslarga qaytish</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050510' },
  loadingContainer: { flex: 1, backgroundColor: '#050510', alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#FFF', marginTop: 12, fontSize: 16, fontFamily: 'Outfit_500Medium' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, color: '#FFF', fontSize: 18, fontFamily: 'Outfit_600SemiBold', textAlign: 'center', marginHorizontal: 15 },
  timerBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(139,92,246,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  timerText: { color: '#8B5CF6', fontSize: 14, fontFamily: 'Outfit_700Bold', marginLeft: 6 },
  progressHeader: { paddingHorizontal: 20, paddingVertical: 15 },
  progressBarBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#8B5CF6', borderRadius: 4 },
  progressText: { color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: 'Outfit_500Medium', marginTop: 8, textAlign: 'right' },
  phaseContainer: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  questionCard: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 24, rounded: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 20 },
  qBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(139,92,246,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 16 },
  qBadgeText: { color: '#8B5CF6', fontSize: 13, fontFamily: 'Outfit_600SemiBold' },
  questionText: { color: '#FFF', fontSize: 20, fontFamily: 'Outfit_600SemiBold', lineHeight: 28 },
  optionsContainer: { spaceY: 12 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 12 },
  optionBtnSelected: { backgroundColor: 'rgba(139,92,246,0.1)', borderColor: '#8B5CF6' },
  optionRadio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  optionRadioSelected: { borderColor: '#8B5CF6' },
  optionRadioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#8B5CF6' },
  optionText: { flex: 1, color: '#FFF', fontSize: 16, fontFamily: 'Outfit_500Medium', lineHeight: 24 },
  bottomBar: { padding: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', backgroundColor: '#050510' },
  nextBtn: { width: '100%', borderRadius: 16, overflow: 'hidden' },
  nextBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18 },
  nextBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Outfit_600SemiBold', marginRight: 8 },
  
  // Practical Styles
  abacusContainer: { height: 200, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 20 },
  flashNumber: { fontSize: 80, fontFamily: 'Outfit_700Bold', color: '#FFF', textShadowColor: 'rgba(139,92,246,0.5)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20 },
  readyContainer: { alignItems: 'center' },
  playBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center', marginBottom: 15, shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  readyText: { color: 'rgba(255,255,255,0.6)', fontSize: 16, fontFamily: 'Outfit_500Medium' },
  answerInputContainer: { marginTop: 20 },
  answerLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 14, fontFamily: 'Outfit_500Medium', marginBottom: 10 },
  numpad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  numBtn: { width: '31%', aspectRatio: 2, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  numBtnText: { color: '#FFF', fontSize: 24, fontFamily: 'Outfit_600SemiBold' },
  answerDisplayBox: { marginTop: 20, padding: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, alignItems: 'center' },
  answerDisplayText: { color: '#FFF', fontSize: 32, fontFamily: 'Outfit_700Bold' },

  // Result Styles
  resultContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  resultBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  resultIconWrapper: { width: 140, height: 140, borderRadius: 70, alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  resultTitle: { color: '#FFF', fontSize: 28, fontFamily: 'Outfit_700Bold', textAlign: 'center', marginBottom: 10 },
  resultDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 16, fontFamily: 'Outfit_400Regular', textAlign: 'center', marginBottom: 40, paddingHorizontal: 20, lineHeight: 24 },
  scoreCards: { flexDirection: 'row', gap: 20, marginBottom: 40, width: '100%' },
  scoreCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  scoreCardTitle: { color: 'rgba(255,255,255,0.6)', fontSize: 14, fontFamily: 'Outfit_500Medium', marginBottom: 10 },
  scoreCardValue: { fontSize: 32, fontFamily: 'Outfit_700Bold' },
  finishBtn: { width: '100%', borderRadius: 16, overflow: 'hidden' },
  finishBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, gap: 10 },
  finishBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Outfit_600SemiBold' }
});
