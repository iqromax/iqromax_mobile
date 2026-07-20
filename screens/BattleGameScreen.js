import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground, Image, SafeAreaView, Platform, Modal } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MentalMathGenerator } from '../src/lib/mathGenerator';

const { width } = Dimensions.get('window');

export default function BattleGameScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { examplesCount = 10, operation = 'oddiy', speed = 1, digits = 1 } = route.params || {};
  
  const totalQuestions = 1;
  const [phase, setPhase] = useState('countdown'); // 'countdown' | 'flashing' | 'input'
  const [startCountdown, setStartCountdown] = useState(3);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [seqIndex, setSeqIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);



  const [isExitModalVisible, setIsExitModalVisible] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - questionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [questionStartTime]);

  useEffect(() => {
    const generated = [];
    for (let i = 0; i < totalQuestions; i++) {
      generated.push(MentalMathGenerator.generate(operation, digits, examplesCount));
    }
    setQuestions(generated);
  }, []);

  useEffect(() => {
    if (questions.length > 0 && currentQIndex < questions.length) {
      const q = questions[currentQIndex];
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
        setStartCountdown(3);
      } else {
        setPhase('flashing');
        setQuestionStartTime(Date.now());
      }
      setInputValue('');
    }
  }, [currentQIndex, questions]);

  useEffect(() => {
    if (phase === 'countdown') {
      if (startCountdown > 0) {
        const timer = setTimeout(() => {
          setStartCountdown(prev => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        setPhase('flashing');
        setQuestionStartTime(Date.now());
      }
    }
  }, [phase, startCountdown]);

  useEffect(() => {
    let timeout;
    if (phase === 'flashing' && sequence.length > 0) {
      if (seqIndex < sequence.length) {
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
    
    const timeForThisQuestion = (Date.now() - questionStartTime) / 1000;
    setTotalTime(prev => prev + timeForThisQuestion);

    let newCombo = combo;
    let newMaxCombo = maxCombo;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      newCombo += 1;
      setCombo(newCombo);
      if (newCombo > newMaxCombo) {
         setMaxCombo(newCombo);
      }
    } else {
      setIncorrectCount(prev => prev + 1);
      setCombo(0);
    }

    if (currentQIndex + 1 < totalQuestions) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
      const finalIncorrect = isCorrect ? incorrectCount : incorrectCount + 1;
      const xp = finalCorrect * 15;
      const coins = finalCorrect * 40;
      const avgTime = (totalTime + timeForThisQuestion) / totalQuestions;
      const finalMaxCombo = isCorrect ? Math.max(newMaxCombo, newCombo) : newMaxCombo;
      
      navigation.replace('BattleResult', {
         correct: finalCorrect,
         incorrect: finalIncorrect,
         avgTime: avgTime.toFixed(1),
         maxCombo: finalMaxCombo,
         xp: xp,
         coins: coins,
         oppCorrect: isCorrect ? 0 : 1,
         oppIncorrect: isCorrect ? 1 : 0,
         oppAvgTime: (Math.random() * 2 + 1).toFixed(1),
         oppMaxCombo: 0,
         oppName: 'Raqib',
         actualAnswer: currentQ.answer,
         userAnswer: inputValue,
      });
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { marginTop: Platform.OS === 'android' ? 10 : 0 }]}>
        <View style={styles.headerCenter}>
          <View style={styles.battleTitleRow}>
            <MaterialCommunityIcons name="sword-cross" size={18} color="#f97316" />
            <Text style={styles.battleTitle}>BATTLE <Text style={styles.badge1v1}>1v1</Text></Text>
          </View>
          <Text style={styles.battleSubtitle}>Real vaqtda raqobat</Text>
        </View>
      </View>



      {/* VS Bar */}
      <View style={styles.vsBarContainer}>
        {/* Player Side */}
        <View style={styles.vsSide}>
          <View style={[styles.avatarGlow, { borderColor: '#0ea5e9', shadowColor: '#0ea5e9' }]}>
            <Image source={require('../assets/avatar_maks.png')} style={styles.avatarImage} />
          </View>
          <View style={styles.playerInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.flag}>🇺🇿</Text>
              <Text style={styles.playerName}>IQROMAX</Text>
            </View>
            <View style={styles.trophyRow}>
              <MaterialCommunityIcons name="trophy" size={12} color="#facc15" />
              <Text style={styles.trophyText}>1 246</Text>
            </View>
            <View style={styles.healthBarTrack}>
              <View style={[styles.healthBarFill, { backgroundColor: '#0ea5e9', width: '80%' }]} />
            </View>
          </View>
        </View>

        {/* Center Timer */}
        <View style={styles.timerWrapper}>
          <View style={styles.timerCircle}>
            <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
          </View>
        </View>

        {/* Opponent Side */}
        <View style={styles.vsSide}>
          <View style={styles.opponentInfo}>
            <View style={[styles.nameRow, { justifyContent: 'flex-end' }]}>
              <Text style={styles.playerName}>Raqib</Text>
              <Text style={styles.flag}>🇺🇿</Text>
            </View>
            <View style={[styles.healthBarTrack, { alignSelf: 'flex-end' }]}>
              <View style={[styles.healthBarFill, { backgroundColor: '#ef4444', width: '60%' }]} />
            </View>
          </View>
          <View style={[styles.avatarGlow, { borderColor: '#ef4444', shadowColor: '#ef4444' }]}>
            <Image source={require('../assets/opponent_1.png')} style={styles.avatarImage} />
          </View>
        </View>
      </View>

      {/* Main Game Area */}
      <View style={styles.gameAreaWrapper}>

        {phase === 'countdown' ? (
          <View style={styles.gameArea}>
            <Text style={{ fontSize: 120, color: '#f97316', fontFamily: 'Inter_800ExtraBold', textShadowColor: 'rgba(249, 115, 22, 0.5)', textShadowRadius: 20 }}>
              {startCountdown}
            </Text>
            <Text style={[styles.operator, { fontSize: 24, marginTop: 10, color: '#9ca3af' }]}>Tayyorlaning...</Text>
          </View>
        ) : phase === 'flashing' ? (
          <View style={styles.gameArea}>
            <Text style={styles.mainNumber}>{sequence[seqIndex]?.num || '?'}</Text>
            {sequence[seqIndex]?.op ? <Text style={styles.operator}>{sequence[seqIndex].op}</Text> : null}
          </View>
        ) : (
          <View style={styles.gameArea}>
            <Text style={styles.mainNumber}>{inputValue || '?'}</Text>
            <Text style={[styles.operator, { fontSize: 24, marginTop: 10, color: '#9ca3af' }]}>Javobni kiriting</Text>
          </View>
        )}
      </View>

      {phase === 'input' ? (
        <View style={styles.keypadWrapper}>
          {[
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['del', '0', 'enter']
          ].map((row, ri) => (
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
      ) : (
        <View style={styles.bottomPanel}>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.chatBtn}>
              <MaterialCommunityIcons name="chat-processing-outline" size={20} color="#d1d5db" />
              <Text style={styles.chatBtnText}>CHAT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.leaveBtn} onPress={() => setIsExitModalVisible(true)}>
              <MaterialCommunityIcons name="exit-to-app" size={20} color="#ef4444" />
              <Text style={styles.leaveBtnText}>TARK ETISH</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Exit Modal */}
      <Modal transparent visible={isExitModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons name="alert-circle-outline" size={32} color="#f97316" />
              <Text style={styles.modalTitle}>O'yinni tark etish</Text>
            </View>
            <Text style={styles.modalText}>Rostdan ham chiqmoqchimisiz?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalBtnNo} onPress={() => setIsExitModalVisible(false)}>
                <Text style={styles.modalBtnNoText}>Yo'q</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnYes} onPress={() => {
                setIsExitModalVisible(false);
                navigation.navigate('StudentDashboard', { initialTab: 'exercise', initialExerciseType: 'battle' });
              }}>
                <Text style={styles.modalBtnYesText}>Ha</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05050A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
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
    color: '#facc15',
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
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
  
  questionTracker: {
    alignItems: 'center',
    marginBottom: 20,
  },
  savolLabel: {
    color: '#6b7280',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  savolValue: {
    color: '#d1d5db',
    fontSize: 20,
    fontFamily: 'Inter_800ExtraBold',
    marginTop: 2,
  },
  
  vsBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    height: 70,
    marginBottom: 40,
  },
  vsSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0f1c',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: 8,
    height: '100%',
  },
  avatarGlow: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
    backgroundColor: '#000',
  },
  avatarImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  opponentInfo: {
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flag: { fontSize: 10 },
  playerName: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  trophyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  trophyText: {
    color: '#d1d5db',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
  healthBarTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginTop: 6,
    width: '100%',
  },
  healthBarFill: {
    height: '100%',
    borderRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  timerWrapper: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    marginHorizontal: -5,
  },
  timerCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#05050A',
    borderWidth: 2,
    borderColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  timerText: {
    color: '#f97316',
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
  },

  gameAreaWrapper: {
    marginHorizontal: 20,
    position: 'relative',
    paddingTop: 12,
    flex: 1,
    justifyContent: 'center',
  },
  tabBadge: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    backgroundColor: '#05050A',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f97316',
    zIndex: 2,
  },
  tabBadgeText: {
    color: '#facc15',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
  gameArea: {
    height: 350,
    backgroundColor: 'rgba(249, 115, 22, 0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f97316',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  mainNumber: {
    color: '#fff',
    fontSize: 72,
    fontFamily: 'Inter_800ExtraBold',
    textShadowColor: 'rgba(255,255,255,0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  operator: {
    color: '#f97316',
    fontSize: 48,
    fontFamily: 'Inter_800ExtraBold',
    marginTop: -10,
    textShadowColor: 'rgba(249, 115, 22, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  nextNumberText: {
    color: '#d1d5db',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    marginTop: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 15,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#374151',
  },
  dotActive: {
    backgroundColor: '#f97316',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    gap: 6,
    paddingHorizontal: 20,
  },
  instructionText: {
    color: '#9ca3af',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },

  bottomPanel: {
    padding: 20,
    backgroundColor: '#05050A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  chatBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  chatBtnText: {
    color: '#d1d5db',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  leaveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  leaveBtnText: {
    color: '#ef4444',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  exitOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  
  graphRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  graphCard: {
    flex: 1,
    backgroundColor: '#0a0f1c',
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
  },
  graphHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 8,
  },
  graphLabel: {
    color: '#9ca3af',
    fontSize: 7,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
  graphVal: {
    fontSize: 16,
    fontFamily: 'Inter_800ExtraBold',
    marginTop: 2,
  },
  mockGraph: {
    alignItems: 'center',
    opacity: 0.6,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0f1c',
    borderRadius: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: 6,
  },
  actionBtnText: {
    color: '#d1d5db',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 5, 10, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#0a0f1c',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.3)',
    width: '100%',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
    marginTop: 10,
  },
  modalText: {
    color: '#d1d5db',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtnNo: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  modalBtnNoText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  modalBtnYes: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    alignItems: 'center',
  },
  modalBtnYesText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  boosterBadge: {
    backgroundColor: '#eab308',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  boosterBadgeText: {
    color: '#000',
    fontSize: 10,
    fontFamily: 'Inter_800ExtraBold',
  },
  keypadWrapper: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    marginTop: 10,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  keypadBtn: {
    width: '31%',
    aspectRatio: 2.0,
    backgroundColor: '#0a0f1c',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keypadBtnEnter: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  keypadBtnDel: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  keypadBtnText: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
  }
});
