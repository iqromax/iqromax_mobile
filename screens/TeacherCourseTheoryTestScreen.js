import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Dimensions, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../src/config/api';

const { width } = Dimensions.get('window');

const TEST_DURATION_SECONDS = 10 * 60; // Default 10 minutes

export default function TeacherCourseTheoryTestScreen({ route, navigation }) {
  const history = route?.params?.history || [];
  const testId = route?.params?.testId;
  const [showHistory, setShowHistory] = useState(history.length > 0);
  
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_SECONDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { 0: 1, 1: 0, ... }
  const [isFinished, setIsFinished] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testDurationMinutes, setTestDurationMinutes] = useState(10);

  useEffect(() => {
    fetchTest();
  }, [testId]);

  const fetchTest = async () => {
    if (!testId) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/courses/tests/${testId}`);
      const data = await res.json();
      if (data && data.questions) {
        const formatted = data.questions.map((q) => {
          const correctIdx = q.options.findIndex(o => o.isCorrect);
          return {
            id: q.id,
            question: q.text,
            options: q.options.map(o => o.text),
            correctIndex: correctIdx >= 0 ? correctIdx : 0
          };
        });
        setQuestions(formatted);
        if (data.duration) {
          const durationMins = parseInt(data.duration);
          setTimeLeft(durationMins * 60);
          setTestDurationMinutes(durationMins);
        }
      }
    } catch (error) {
      console.error('Fetch test error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (hasStarted && !isFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isFinished) {
      setIsFinished(true); // auto submit
    }
    return () => clearInterval(timer);
  }, [hasStarted, isFinished, timeLeft]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const currentSelected = selectedAnswers[currentIndex];
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const handleSelectOption = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: optionIndex
    });
  };

  const handleNext = () => {
    if (currentSelected === undefined) return;

    if (isLastQuestion) {
      setIsFinished(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });
    return correctCount;
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Result Screen
  if (isFinished) {
    const score = calculateScore();
    const percent = Math.round((score / totalQuestions) * 100);

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#050510" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: '#FFF', fontSize: 16, fontFamily: 'Inter_700Bold' }]}>Natija</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Score Card */}
            <View style={styles.resultCard}>
              <View style={styles.scoreCircle}>
                <Text style={styles.scorePercent}>{percent}%</Text>
              </View>
              <Text style={styles.resultText}>Siz {totalQuestions} ta savoldan {score} tasiga to'g'ri javob berdingiz!</Text>
            </View>

            <Text style={styles.reviewTitle}>Batafsil tahlil</Text>

            {/* Questions Review */}
            {questions.map((q, idx) => {
              const userAnswer = selectedAnswers[idx];
              const isCorrect = userAnswer === q.correctIndex;
              
              return (
                <View key={q.id} style={[styles.reviewBox, isCorrect ? styles.reviewBoxCorrect : styles.reviewBoxWrong]}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewQNum}>{idx + 1}-savol</Text>
                    <MaterialCommunityIcons 
                      name={isCorrect ? "check-circle" : "close-circle"} 
                      size={20} 
                      color={isCorrect ? "#10B981" : "#EF4444"} 
                    />
                  </View>
                  <Text style={styles.reviewQuestion}>{q.question}</Text>
                  
                  <View style={styles.reviewOptionsList}>
                    {q.options.map((opt, oIdx) => {
                      const isUserChoice = userAnswer === oIdx;
                      const isActualCorrect = q.correctIndex === oIdx;
                      
                      let optionStyle = styles.reviewOption;
                      let textStyle = styles.reviewOptionText;
                      let iconName = "circle-outline";
                      let iconColor = "#6B7280";

                      if (isActualCorrect) {
                        optionStyle = styles.reviewOptionCorrect;
                        textStyle = styles.reviewOptionTextCorrect;
                        iconName = "check-circle";
                        iconColor = "#10B981";
                      } else if (isUserChoice && !isCorrect) {
                        optionStyle = styles.reviewOptionWrong;
                        textStyle = styles.reviewOptionTextWrong;
                        iconName = "close-circle";
                        iconColor = "#EF4444";
                      }

                      return (
                        <View key={oIdx} style={optionStyle}>
                          <MaterialCommunityIcons name={iconName} size={18} color={iconColor} style={{ marginRight: 8 }} />
                          <Text style={textStyle}>{opt}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </ScrollView>
          
          <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', backgroundColor: '#050510' }}>
            <TouchableOpacity 
              activeOpacity={0.9} 
              style={{ width: '100%' }}
              onPress={async () => {
                if (percent >= 60 && route?.params?.lessonId) {
                  try {
                    const saved = await AsyncStorage.getItem('teacher_course_completed');
                    let completedLessonIds = saved ? JSON.parse(saved) : [];
                    if (!completedLessonIds.includes(route.params.lessonId)) {
                      completedLessonIds.push(route.params.lessonId);
                      await AsyncStorage.setItem('teacher_course_completed', JSON.stringify(completedLessonIds));
                    }
                  } catch (e) { console.log(e); }
                }
                navigation.goBack();
              }}
            >
              <LinearGradient
                colors={['#8B5CF6', '#D946EF']}
                start={{x:0, y:0}} end={{x:1, y:0}}
                style={styles.introStartBtn}
              >
                <MaterialCommunityIcons name="check-all" size={20} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.introStartBtnText}>Darslarga qaytish</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

        </SafeAreaView>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#D946EF" />
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <TouchableOpacity style={styles.introCloseModalBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        <Text style={{color: '#9CA3AF', fontSize: 16, fontFamily: 'Inter_500Medium'}}>Test savollari topilmadi!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050510" />
      
      {/* Intro or History Modal Alert */}
      <Modal visible={showHistory || !hasStarted} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          {showHistory ? (
            <View style={styles.introCard}>
              <TouchableOpacity style={styles.introCloseModalBtn} onPress={() => navigation.goBack()}>
                <MaterialCommunityIcons name="close" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <View style={[styles.introIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)' }]}>
                <MaterialCommunityIcons name="history" size={48} color="#3B82F6" />
              </View>
              
              <Text style={styles.introTitle}>Natijalar tarixi</Text>
              <Text style={styles.introDesc}>
                Siz bu testni avval ishlagansiz. Quyida oldingi urinishlaringiz natijalari bilan tanishishingiz mumkin.
              </Text>

              <View style={styles.introInfoBox}>
                {history.map((h, i) => {
                  const isFailed = h.score < 60;
                  return (
                    <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: i === history.length - 1 ? 0 : 12 }}>
                      <Text style={{ color: '#9CA3AF', fontSize: 14, fontFamily: 'Inter_500Medium' }}>
                        {i + 1}-urinish
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: isFailed ? '#EF4444' : '#10B981', fontSize: 15, fontFamily: 'Inter_700Bold', marginRight: 6 }}>
                          {h.score}%
                        </Text>
                        <MaterialCommunityIcons name={isFailed ? "close-circle" : "check-circle"} size={16} color={isFailed ? "#EF4444" : "#10B981"} />
                      </View>
                    </View>
                  );
                })}
              </View>

              <TouchableOpacity style={{ width: '100%', marginTop: 10 }} activeOpacity={0.9} onPress={() => { setShowHistory(false); setHasStarted(true); }}>
                <LinearGradient
                  colors={['#8B5CF6', '#D946EF']}
                  start={{x:0, y:0}} end={{x:1, y:0}}
                  style={styles.introStartBtn}
                >
                  <MaterialCommunityIcons name="refresh" size={20} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.introStartBtnText}>Qayta topshirish</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.introCard}>
              <TouchableOpacity style={styles.introCloseModalBtn} onPress={() => navigation.goBack()}>
                <MaterialCommunityIcons name="close" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <View style={styles.introIconBox}>
                <MaterialCommunityIcons name="clipboard-text-clock-outline" size={48} color="#D946EF" />
              </View>
              
              <Text style={styles.introTitle}>Nazariy Test</Text>
              <Text style={styles.introDesc}>
                Test jami {totalQuestions} ta savoldan iborat. Vaqt tugagach test avtomatik yakunlanadi.
              </Text>

              <View style={styles.introInfoBox}>
                <View style={styles.introInfoRow}>
                  <View style={styles.introInfoIcon}>
                    <MaterialCommunityIcons name="timer-sand" size={20} color="#3B82F6" />
                  </View>
                  <View>
                    <Text style={styles.introInfoLabel}>Ajratilgan vaqt</Text>
                    <Text style={styles.introInfoValue}>{testDurationMinutes} daqiqa</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={{ width: '100%', marginTop: 10 }} activeOpacity={0.9} onPress={() => setHasStarted(true)}>
                <LinearGradient
                  colors={['#8B5CF6', '#D946EF']}
                  start={{x:0, y:0}} end={{x:1, y:0}}
                  style={styles.introStartBtn}
                >
                  <Text style={styles.introStartBtnText}>Tayyorman, Boshlash</Text>
                  <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>

      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.timerBox}>
            <MaterialCommunityIcons name="timer-outline" size={18} color="#EF4444" />
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressWrap}>
          <Text style={styles.progressText}>Savol {currentIndex + 1} / {totalQuestions}</Text>
          <View style={styles.progressBg}>
            <LinearGradient
              colors={['#8B5CF6', '#D946EF']}
              start={{x:0, y:0}} end={{x:1, y:0}}
              style={[styles.progressFill, { width: `${((currentIndex + 1) / totalQuestions) * 100}%` }]}
            />
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          
          {/* Question Box */}
          <View style={styles.questionBox}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </View>

          {/* Options */}
          <View style={styles.optionsWrap}>
            {currentQuestion.options.map((option, index) => {
              const isSelected = currentSelected === index;
              return (
                <TouchableOpacity 
                  key={index} 
                  activeOpacity={0.8}
                  style={[styles.optionBtn, isSelected && styles.optionBtnSelected]}
                  onPress={() => handleSelectOption(index)}
                >
                  <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={[styles.navBtnLine, currentIndex === 0 && { opacity: 0 }]} 
            onPress={handlePrev}
            disabled={currentIndex === 0}
          >
            <Text style={styles.navBtnLineText}>Orqaga</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navBtnPrimary, currentSelected === undefined && { opacity: 0.5 }]}
            onPress={handleNext}
            disabled={currentSelected === undefined}
          >
            <LinearGradient
              colors={['#8B5CF6', '#D946EF']}
              start={{x:0, y:0}} end={{x:1, y:0}}
              style={styles.navBtnGradient}
            >
              <Text style={styles.navBtnPrimaryText}>{isLastQuestion ? 'Yakunlash' : 'Keyingi'}</Text>
              <MaterialCommunityIcons name={isLastQuestion ? "check" : "chevron-right"} size={20} color="#FFF" style={{ marginLeft: 4 }} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050510',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  timerText: {
    color: '#EF4444',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  introCard: {
    backgroundColor: '#121228',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  introCloseModalBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  introIconBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(217, 70, 239, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
    borderWidth: 2,
    borderColor: 'rgba(217, 70, 239, 0.3)',
  },
  introTitle: {
    color: '#FFF',
    fontSize: 24,
    fontFamily: 'Inter_900Black',
    textAlign: 'center',
    marginBottom: 12,
  },
  introDesc: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  introInfoBox: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 24,
    width: '100%',
  },
  introInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  introInfoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  introInfoLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginBottom: 2,
  },
  introInfoValue: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
  introStartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  introStartBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    marginRight: 8,
  },
  progressWrap: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    marginBottom: 8,
  },
  progressBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionBox: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  questionText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    lineHeight: 28,
  },
  optionsWrap: {
    gap: 12,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
  },
  optionBtnSelected: {
    backgroundColor: 'rgba(217, 70, 239, 0.1)',
    borderColor: '#D946EF',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4B5563',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: '#D946EF',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D946EF',
  },
  optionText: {
    flex: 1,
    color: '#D1D5DB',
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    lineHeight: 22,
  },
  optionTextSelected: {
    color: '#FFF',
    fontFamily: 'Inter_600SemiBold',
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    backgroundColor: '#050510',
  },
  navBtnLine: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  navBtnLineText: {
    color: '#E5E7EB',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  navBtnPrimary: {
    flex: 1,
    marginLeft: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  navBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  navBtnPrimaryText: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
  // Result View Styles
  resultCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 24,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 30,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(217, 70, 239, 0.1)',
    borderWidth: 4,
    borderColor: '#D946EF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  scorePercent: {
    color: '#FFF',
    fontSize: 24,
    fontFamily: 'Inter_900Black',
  },
  resultText: {
    color: '#E5E7EB',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    lineHeight: 24,
  },
  reviewTitle: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
    marginBottom: 16,
  },
  reviewBox: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  reviewBoxCorrect: {
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  reviewBoxWrong: {
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewQNum: {
    color: '#9CA3AF',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  reviewQuestion: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    lineHeight: 22,
    marginBottom: 16,
  },
  reviewOptionsList: {
    gap: 8,
  },
  reviewOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  reviewOptionCorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  reviewOptionWrong: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  reviewOptionText: {
    flex: 1,
    color: '#9CA3AF',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  reviewOptionTextCorrect: {
    flex: 1,
    color: '#10B981',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  reviewOptionTextWrong: {
    flex: 1,
    color: '#EF4444',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
});
