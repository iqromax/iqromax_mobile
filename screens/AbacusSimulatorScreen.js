import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, PanResponder, Platform, StatusBar, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';

const TRANSLATIONS = {
  en: { title: "ABACUS SIMULATOR", subtitle: "TEACHING MODE", reset: "RESET" },
  ru: { title: "СИМУЛЯТОР АБАКУСА", subtitle: "РЕЖИМ ОБУЧЕНИЯ", reset: "СБРОС" },
  uz: { title: "ABAKUS SIMULYATORI", subtitle: "O'RGANISH REJIMI", reset: "QAYTA O'RNATISH" },
  ar: { title: "محاكي المعداد", subtitle: "وضع التعليم", reset: "إعادة ضبط" },
  tr: { title: "ABAKÜS SİMÜLATÖRÜ", subtitle: "ÖĞRETİM MODU", reset: "SIFIRLA" },
  zh: { title: "算盘模拟器", subtitle: "教学模式", reset: "重置" },
  ky: { title: "АБАКУС СИМУЛЯТОРУ", subtitle: "ОКУТУУ РЕЖИМИ", reset: "КАЙРА КОЮУ" },
  kk: { title: "АБАКУС СИМУЛЯТОРЫ", subtitle: "ОҚЫТУ РЕЖИМІ", reset: "ҚАЛПЫНА КЕЛТІРУ" },
  tg: { title: "СИМУЛЯТОРИ АБАКУС", subtitle: "РЕҶАИ ОМӮЗИШ", reset: "БОЗНАШОНДАН" },
  ja: { title: "そろばんシミュレーター", subtitle: "ティーチングモード", reset: "リセット" },
  ko: { title: "주판 시뮬레이터", subtitle: "교육 모드", reset: "초기화" },
};

const BEAD_WIDTH = 56;
const BEAD_HEIGHT = 24;
const ROD_WIDTH = 8;
const TOP_SLIDE_DISTANCE = 30;
const BOTTOM_SLIDE_DISTANCE = 40;

const TopBead = ({ onValueChange, resetFlag }) => {
  const panY = useRef(new Animated.Value(0)).current; // 0 = UP (rest), TOP_SLIDE_DISTANCE = DOWN (active)
  const isDown = useRef(false);

  useEffect(() => {
    Animated.spring(panY, { toValue: 0, useNativeDriver: true }).start();
    isDown.current = false;
    onValueChange(0);
  }, [resetFlag]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gesture) => {
        const swipedDown = gesture.dy > 10;
        const swipedUp = gesture.dy < -10;
        const tapped = Math.abs(gesture.dy) <= 10;

        if (swipedDown || (tapped && !isDown.current)) {
          isDown.current = true;
          Animated.spring(panY, { toValue: TOP_SLIDE_DISTANCE, useNativeDriver: true }).start();
          onValueChange(5);
        } else if (swipedUp || (tapped && isDown.current)) {
          isDown.current = false;
          Animated.spring(panY, { toValue: 0, useNativeDriver: true }).start();
          onValueChange(0);
        }
      }
    })
  ).current;

  return (
    <Animated.View style={[styles.beadWrapper, { transform: [{ translateY: panY }] }]} {...panResponder.panHandlers}>
      <LinearGradient colors={['#D97706', '#FDE047', '#D97706']} locations={[0, 0.4, 1]} style={styles.bead} />
    </Animated.View>
  );
};

const BottomBeads = ({ onValueChange, resetFlag }) => {
  // Array of 4 animated values for the 4 bottom beads.
  // 0 = DOWN (rest), -BOTTOM_SLIDE_DISTANCE = UP (active)
  const beadAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;
  
  const beadStates = useRef([false, false, false, false]); // true = UP, false = DOWN

  const updateBeads = (newStates) => {
    beadStates.current = newStates;
    const val = newStates.filter(s => s).length;
    onValueChange(val);
    newStates.forEach((state, i) => {
      Animated.spring(beadAnims[i], { toValue: state ? -BOTTOM_SLIDE_DISTANCE : 0, useNativeDriver: true }).start();
    });
  };

  useEffect(() => {
    updateBeads([false, false, false, false]);
  }, [resetFlag]);

  const responders = useRef([0, 1, 2, 3].map(index => 
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gesture) => {
        const swipedUp = gesture.dy < -10;
        const swipedDown = gesture.dy > 10;
        const tapped = Math.abs(gesture.dy) <= 10;

        let newStates = [...beadStates.current];

        if (swipedUp || (tapped && !newStates[index])) {
          // Move this bead and all above it UP
          for (let i = 0; i <= index; i++) newStates[i] = true;
        } else if (swipedDown || (tapped && newStates[index])) {
          // Move this bead and all below it DOWN
          for (let i = index; i < 4; i++) newStates[i] = false;
        }
        updateBeads(newStates);
      }
    })
  )).current;

  return (
    <View style={styles.bottomBeadsContainer}>
      {[0, 1, 2, 3].map((i) => (
        <Animated.View 
          key={i} 
          style={[styles.beadWrapper, { transform: [{ translateY: beadAnims[i] }] }]} 
          {...responders[i].panHandlers}
        >
          <LinearGradient colors={['#D97706', '#FDE047', '#D97706']} locations={[0, 0.4, 1]} style={styles.bead} />
        </Animated.View>
      ))}
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
      {/* Label Box */}
      <View style={styles.labelBox}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
      
      {/* Top Section */}
      <View style={styles.topSection}>
        <LinearGradient colors={['#3E2723', '#5D4037', '#3E2723']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.rod} />
        <View style={styles.topBeadArea}>
          <TopBead onValueChange={setTopVal} resetFlag={resetFlag} />
        </View>
      </View>

      {/* Middle Bar Piece (visual only, actual bar is behind or over) */}
      <View style={styles.middleBarPiece} />

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <LinearGradient colors={['#3E2723', '#5D4037', '#3E2723']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.rod} />
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
  const t = TRANSLATIONS[language] || TRANSLATIONS['uz'];

  const [resetFlag, setResetFlag] = useState(0);
  const [values, setValues] = useState({ 1000: 0, 100: 0, 10: 0, 1: 0 });

  const totalValue = values[1000] * 1000 + values[100] * 100 + values[10] * 10 + values[1];

  const handleReset = () => {
    setResetFlag(prev => prev + 1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>{t.title}</Text>
            <View style={styles.subtitleContainer}>
              <LinearGradient colors={['transparent', 'rgba(168, 85, 247, 0.5)', 'transparent']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.subtitleLine} />
              <Text style={styles.headerSubtitle}>{t.subtitle}</Text>
              <LinearGradient colors={['transparent', 'rgba(168, 85, 247, 0.5)', 'transparent']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.subtitleLine} />
            </View>
          </View>
        </View>

        {/* Main Content Area */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', paddingBottom: 40 }}>
          {/* Value Display (Optional, useful for teaching mode) */}
          <View style={styles.valueDisplayContainer}>
           <Text style={styles.valueText}>{totalValue}</Text>
        </View>

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
                
                {/* Horizontal Bar (Behind beads) */}
                <LinearGradient colors={['#3E2723', '#5D4037', '#3E2723']} style={styles.horizontalBar} />

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
    marginTop: 20,
    marginBottom: 20,
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
    marginRight: 40, // offset back button
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
  valueDisplayContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  valueText: {
    color: '#FFF',
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
  },
  abacusContainer: {
    width: 350,
    height: 380,
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
    backgroundColor: '#000', // very dark inside
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
    top: 90, // position between top and bottom beads
    left: 0,
    right: 0,
    height: 16,
    zIndex: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#2D1B15',
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
  labelBox: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333',
    zIndex: 3,
  },
  labelText: {
    color: '#FDE047',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  topSection: {
    height: 60,
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
    zIndex: 3,
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
    bottom: 10, // padding from bottom of frame
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-end', // bottom beads rest at bottom
    zIndex: 3,
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
    borderRadius: 12,
    // Add a slight shadow to make it pop
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
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

});
