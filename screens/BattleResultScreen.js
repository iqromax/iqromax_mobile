import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, Platform, ScrollView, Animated } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function BattleResultScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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
  }, []);
  
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
    oppMaxCombo = 0
  } = route.params || {};

  const isWin = correct >= oppCorrect; // Simple logic: whoever has more correct answers wins

  const winnerPhrases = ["A'lo!", "Qoyil!", "Zo'r!", "Yaxshi!"];
  const loserPhrases = ["Afsus", "Taslim bo'lmang!", "Keyingi safar"];
  const winPhrase = useRef(winnerPhrases[Math.floor(Math.random() * winnerPhrases.length)]).current;
  const losePhrase = useRef(loserPhrases[Math.floor(Math.random() * loserPhrases.length)]).current;

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
  const mainTitle = isWin ? "G'ALABA!" : "MAG'LUBIYAT";
  const subTitle = isWin ? "Siz g'alaba qozondingiz!" : "Raqibingiz g'alaba qozondi";

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
          <Text style={styles.answerText}>To'g'ri javob: <Text style={styles.correctAnswerVal}>{route.params?.actualAnswer}</Text></Text>
          <Text style={styles.answerText}>Sizning javobingiz: <Text style={[styles.userAnswerVal, { color: isWin ? '#22c55e' : '#ef4444' }]}>{route.params?.userAnswer}</Text></Text>
        </View>

        {/* Player Card */}
        <Animated.View style={[styles.playerCard, { borderColor: playerBorder, shadowColor: playerColor }, { transform: [{ scale: pulseAnim }], shadowOpacity: 0.8, shadowRadius: 20 }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardInfo}>
              <View style={[styles.avatarGlow, { borderColor: playerColor }]}>
                <Image source={require('../assets/avatar_maks.png')} style={styles.avatarImage} />
              </View>
              <View style={styles.cardDetails}>
                <View style={styles.nameRow}>
                  <Text style={styles.flag}>🇺🇿</Text>
                  <Text style={styles.playerName}>IQROMAX</Text>
                </View>
                <View style={styles.trophyRow}>
                  <MaterialCommunityIcons name="trophy" size={12} color="#facc15" />
                  <Text style={styles.trophyText}>1 248 <Text style={{ color: isWin ? '#22c55e' : '#ef4444' }}>{isWin ? '+18' : '-18'}</Text></Text>
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
              <Text style={styles.statBoxLabel}>To'g'ri javoblar</Text>
              <Text style={styles.statBoxValue}>{correct}</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="close-circle-outline" size={20} color="#ef4444" />
              <Text style={styles.statBoxLabel}>Xato javoblar</Text>
              <Text style={styles.statBoxValue}>{incorrect}</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="timer-outline" size={20} color="#9ca3af" />
              <Text style={styles.statBoxLabel}>O'rtacha vaqt</Text>
              <Text style={styles.statBoxValue}>{avgTime}s</Text>
            </View>
            <View style={styles.statBox}>
              <View style={styles.xpIconBadge}>
                <Text style={styles.xpIconText}>XP</Text>
              </View>
              <Text style={styles.statBoxLabel}>Olingan XP</Text>
              <Text style={styles.statBoxValue}>{isWin ? `+${xp}` : '-'}</Text>
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
                <Image source={require('../assets/opponent_1.png')} style={styles.avatarImage} />
              </View>
              <View style={styles.cardDetails}>
                <View style={styles.nameRow}>
                  <Text style={styles.flag}>🇺🇿</Text>
                  <Text style={styles.playerName}>Raqib</Text>
                </View>
                <View style={styles.trophyRow}>
                  <MaterialCommunityIcons name="trophy" size={12} color="#facc15" />
                  <Text style={styles.trophyText}>1 312 <Text style={{ color: !isWin ? '#22c55e' : '#ef4444' }}>{!isWin ? '+18' : '-18'}</Text></Text>
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
              <Text style={styles.statBoxLabel}>To'g'ri javoblar</Text>
              <Text style={styles.statBoxValue}>{oppCorrect}</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="close-circle-outline" size={20} color="#ef4444" />
              <Text style={styles.statBoxLabel}>Xato javoblar</Text>
              <Text style={styles.statBoxValue}>{oppIncorrect}</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="timer-outline" size={20} color="#9ca3af" />
              <Text style={styles.statBoxLabel}>O'rtacha vaqt</Text>
              <Text style={styles.statBoxValue}>{oppAvgTime}s</Text>
            </View>
            <View style={styles.statBox}>
              <View style={styles.xpIconBadge}>
                <Text style={styles.xpIconText}>XP</Text>
              </View>
              <Text style={styles.statBoxLabel}>Olingan XP</Text>
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
            <Text style={styles.chatBtnText}>CHAT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.playAgainBtn} onPress={() => navigation.navigate('BattleSettings')}>
            <Text style={styles.playAgainBtnText}>YANA BIR O'YIN</Text>
            <MaterialCommunityIcons name="refresh" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

          <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('StudentDashboard', { initialTab: 'exercise', initialExerciseType: 'battle' })}>
            <MaterialCommunityIcons name="home" size={20} color="#fff" />
            <Text style={styles.homeBtnText}>BOSH SAHIFAGA QAYTISH</Text>
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
