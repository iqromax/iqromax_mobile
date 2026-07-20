import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { DASHBOARD_TRANSLATIONS } from './StudentDashboardScreen';

const { width } = Dimensions.get('window');

export default function BattleSettingsScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { language = 'uz', battleMode = 'oddiy' } = route.params || {};
  const t = DASHBOARD_TRANSLATIONS[language] || DASHBOARD_TRANSLATIONS['uz'];

  // State for settings
  const [selectedExamples, setSelectedExamples] = useState(10);
  const [selectedOperation, setSelectedOperation] = useState('oddiy'); // oddiy, f5, f10, aralash
  const [selectedSpeed, setSelectedSpeed] = useState(1);
  const [selectedDigits, setSelectedDigits] = useState(1);
  
  const [isExamplesPickerOpen, setIsExamplesPickerOpen] = useState(false);
  const [isSpeedPickerOpen, setIsSpeedPickerOpen] = useState(false);
  const [isDigitsPickerOpen, setIsDigitsPickerOpen] = useState(false);

  // Arrays
  const exampleNumbers = Array.from({ length: 24 }, (_, i) => i + 2); // 2 to 25
  const speedOptions = [0.5, 0.7, 1.0, 1.5, 2.0];
  const digitsOptions = [1, 2, 3, 4];

  const formatSpeed = (val) => {
    return `${val} ${t.secondWord || 'soniya'}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#D1D5DB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.battleTabTitle ? `${t.battleTabTitle} SOZLAMALARI` : "BATTLE SOZLAMALARI"}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* NUMBER OF EXAMPLES SECTION */}
        <View style={styles.examplesContainer}>
          <View style={styles.examplesHeader}>
            <View style={styles.examplesIconBox}>
              <MaterialCommunityIcons name="format-list-bulleted" size={24} color="#A855F7" />
            </View>
            <View style={styles.examplesHeaderTextContainer}>
              <Text style={styles.examplesTitle}>{t.examplesCountTitle}</Text>
              <Text style={styles.examplesSubtitle}>{t.examplesCountSubtitle}</Text>
            </View>
          </View>

          {!isExamplesPickerOpen ? (
            <TouchableOpacity 
              style={styles.examplesSelectorClosed} 
              activeOpacity={0.8}
              onPress={() => setIsExamplesPickerOpen(true)}
            >
              <Text style={styles.examplesSelectorValueText}>{selectedExamples} <Text style={styles.examplesSelectorLabelText}>{t.exampleWord}</Text></Text>
              <MaterialCommunityIcons name="chevron-down" size={24} color="#A855F7" />
            </TouchableOpacity>
          ) : (
            <View style={styles.examplesPickerExpanded}>
              <ScrollView 
                style={styles.examplesPickerScroll} 
                showsVerticalScrollIndicator={false}
                snapToInterval={40}
                decelerationRate="fast"
                onMomentumScrollEnd={(e) => {
                  const offsetY = e.nativeEvent.contentOffset.y;
                  const index = Math.round(offsetY / 40);
                  if (exampleNumbers[index]) {
                    setSelectedExamples(exampleNumbers[index]);
                  }
                }}
              >
                <View style={{ height: 40 }} />
                {exampleNumbers.map((num) => {
                  const isSelected = selectedExamples === num;
                  return (
                    <TouchableOpacity 
                      key={num} 
                      style={[styles.examplesPickerItem, isSelected && styles.examplesPickerItemSelected]}
                      onPress={() => {
                        setSelectedExamples(num);
                        setIsExamplesPickerOpen(false);
                      }}
                    >
                      <Text style={[styles.examplesPickerItemText, isSelected && styles.examplesPickerItemTextSelected]}>
                        {num} {isSelected && <Text style={styles.examplesPickerItemLabel}>{t.exampleWord}</Text>}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                <View style={{ height: 40 }} />
              </ScrollView>
            </View>
          )}
        </View>

        {/* OPERATIONS SECTION */}
        <View style={styles.opsContainer}>
          <View style={styles.opsHeader}>
            <View style={styles.opsIconBox}>
              <MaterialCommunityIcons name="calculator-variant" size={24} color="#A855F7" />
            </View>
            <View style={styles.opsHeaderTextContainer}>
              <Text style={styles.opsTitle}>{t.opsTitle}</Text>
              <Text style={styles.opsSubtitle}>{t.opsSubtitle}</Text>
            </View>
          </View>

          <View style={styles.opsRow}>
            {/* Oddiy */}
            <TouchableOpacity 
              style={[styles.opsCard, selectedOperation === 'oddiy' && styles.opsCardSelected]}
              onPress={() => setSelectedOperation('oddiy')}
              activeOpacity={0.8}
            >
              {selectedOperation === 'oddiy' && (
                <View style={styles.opsCheckmarkBadge}>
                  <MaterialCommunityIcons name="check-bold" size={12} color="#fff" />
                </View>
              )}
              <View style={styles.opsCardIconWrapper}>
                <MaterialCommunityIcons name="plus" size={32} color={selectedOperation === 'oddiy' ? '#A855F7' : '#9CA3AF'} />
              </View>
              <Text style={[styles.opsCardTitle, selectedOperation === 'oddiy' && styles.opsCardTitleSelected]}>{t.opsOddiy}</Text>
              <Text style={styles.opsCardDesc} numberOfLines={2}>{t.opsOddiyDesc}</Text>
            </TouchableOpacity>

            {/* Formula 5 */}
            <TouchableOpacity 
              style={[styles.opsCard, selectedOperation === 'f5' && styles.opsCardSelected]}
              onPress={() => setSelectedOperation('f5')}
              activeOpacity={0.8}
            >
              {selectedOperation === 'f5' && (
                <View style={styles.opsCheckmarkBadge}>
                  <MaterialCommunityIcons name="check-bold" size={12} color="#fff" />
                </View>
              )}
              <View style={styles.opsCardIconWrapper}>
                <Text style={[styles.opsFormulaIcon, selectedOperation === 'f5' && styles.opsFormulaIconSelected]}>f(x)</Text>
              </View>
              <Text style={[styles.opsCardTitle, selectedOperation === 'f5' && styles.opsCardTitleSelected]}>{t.opsF5}</Text>
              <Text style={styles.opsCardDesc} numberOfLines={2}>{t.opsF5Desc}</Text>
            </TouchableOpacity>

            {/* Formula 10 */}
            <TouchableOpacity 
              style={[styles.opsCard, selectedOperation === 'f10' && styles.opsCardSelected]}
              onPress={() => setSelectedOperation('f10')}
              activeOpacity={0.8}
            >
              {selectedOperation === 'f10' && (
                <View style={styles.opsCheckmarkBadge}>
                  <MaterialCommunityIcons name="check-bold" size={12} color="#fff" />
                </View>
              )}
              <View style={styles.opsCardIconWrapper}>
                <Text style={[styles.opsFormulaIcon, selectedOperation === 'f10' && styles.opsFormulaIconSelected]}>f(x)</Text>
              </View>
              <Text style={[styles.opsCardTitle, selectedOperation === 'f10' && styles.opsCardTitleSelected]}>{t.opsF10}</Text>
              <Text style={styles.opsCardDesc} numberOfLines={2}>{t.opsF10Desc}</Text>
            </TouchableOpacity>

            {/* Aralash */}
            <TouchableOpacity 
              style={[styles.opsCard, selectedOperation === 'aralash' && styles.opsCardSelected]}
              onPress={() => setSelectedOperation('aralash')}
              activeOpacity={0.8}
            >
              {selectedOperation === 'aralash' && (
                <View style={styles.opsCheckmarkBadge}>
                  <MaterialCommunityIcons name="check-bold" size={12} color="#fff" />
                </View>
              )}
              <View style={styles.opsCardIconWrapper}>
                <MaterialCommunityIcons name="shuffle-variant" size={28} color={selectedOperation === 'aralash' ? '#A855F7' : '#9CA3AF'} />
              </View>
              <Text style={[styles.opsCardTitle, selectedOperation === 'aralash' && styles.opsCardTitleSelected]}>{t.opsAralash}</Text>
              <Text style={styles.opsCardDesc} numberOfLines={2}>{t.opsAralashDesc}</Text>
            </TouchableOpacity>

            {/* Kopaytirish */}
            <TouchableOpacity 
              style={[styles.opsCard, selectedOperation === 'kopaytirish' && styles.opsCardSelected]}
              onPress={() => setSelectedOperation('kopaytirish')}
              activeOpacity={0.8}
            >
              {selectedOperation === 'kopaytirish' && (
                <View style={styles.opsCheckmarkBadge}>
                  <MaterialCommunityIcons name="check-bold" size={12} color="#fff" />
                </View>
              )}
              <View style={styles.opsCardIconWrapper}>
                <MaterialCommunityIcons name="close" size={28} color={selectedOperation === 'kopaytirish' ? '#A855F7' : '#9CA3AF'} />
              </View>
              <Text style={[styles.opsCardTitle, selectedOperation === 'kopaytirish' && styles.opsCardTitleSelected]}>{t.speedKopaytirish || "Ko'paytirish"}</Text>
              <Text style={styles.opsCardDesc} numberOfLines={2}>{""}</Text>
            </TouchableOpacity>

            {/* Bolish */}
            <TouchableOpacity 
              style={[styles.opsCard, selectedOperation === 'bolish' && styles.opsCardSelected]}
              onPress={() => setSelectedOperation('bolish')}
              activeOpacity={0.8}
            >
              {selectedOperation === 'bolish' && (
                <View style={styles.opsCheckmarkBadge}>
                  <MaterialCommunityIcons name="check-bold" size={12} color="#fff" />
                </View>
              )}
              <View style={styles.opsCardIconWrapper}>
                <MaterialCommunityIcons name="division" size={28} color={selectedOperation === 'bolish' ? '#A855F7' : '#9CA3AF'} />
              </View>
              <Text style={[styles.opsCardTitle, selectedOperation === 'bolish' && styles.opsCardTitleSelected]}>{t.speedBolish || "Bo'lish"}</Text>
              <Text style={styles.opsCardDesc} numberOfLines={2}>{""}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SPEED SECTION */}
        <View style={styles.examplesContainer}>
          <View style={styles.examplesHeader}>
            <View style={styles.examplesIconBox}>
              <MaterialCommunityIcons name="lightning-bolt" size={24} color="#A855F7" />
            </View>
            <View style={styles.examplesHeaderTextContainer}>
              <Text style={styles.examplesTitle}>{t.speedSelectTitle || 'TEZLIK'}</Text>
              <Text style={styles.examplesSubtitle}>{t.speedSelectSubtitle || 'Mashq bajarish tezligini tanlang'}</Text>
            </View>
          </View>

          {!isSpeedPickerOpen ? (
            <TouchableOpacity 
              style={styles.examplesSelectorClosed} 
              activeOpacity={0.8}
              onPress={() => setIsSpeedPickerOpen(true)}
            >
              <Text style={styles.examplesSelectorValueText}>
                {formatSpeed(selectedSpeed)}
              </Text>
              <MaterialCommunityIcons name="chevron-down" size={24} color="#A855F7" />
            </TouchableOpacity>
          ) : (
            <View style={styles.examplesPickerExpanded}>
              <ScrollView 
                style={styles.examplesPickerScroll} 
                showsVerticalScrollIndicator={false}
                snapToInterval={40}
                decelerationRate="fast"
                onMomentumScrollEnd={(e) => {
                  const offsetY = e.nativeEvent.contentOffset.y;
                  const index = Math.round(offsetY / 40);
                  if (speedOptions[index]) {
                    setSelectedSpeed(speedOptions[index]);
                  }
                }}
              >
                <View style={{ height: 40 }} />
                {speedOptions.map((s) => {
                  const isSelected = selectedSpeed === s;
                  return (
                    <TouchableOpacity 
                      key={s.toString()} 
                      style={[styles.examplesPickerItem, isSelected && styles.examplesPickerItemSelected]}
                      onPress={() => {
                        setSelectedSpeed(s);
                        setIsSpeedPickerOpen(false);
                      }}
                    >
                      <Text style={[styles.examplesPickerItemText, isSelected && styles.examplesPickerItemTextSelected]}>
                        {formatSpeed(s)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                <View style={{ height: 40 }} />
              </ScrollView>
            </View>
          )}
        </View>

        {/* DIGITS SECTION */}
        <View style={styles.examplesContainer}>
          <View style={styles.examplesHeader}>
            <View style={styles.examplesIconBox}>
              <MaterialCommunityIcons name="numeric" size={24} color="#A855F7" />
            </View>
            <View style={styles.examplesHeaderTextContainer}>
              <Text style={styles.examplesTitle}>{t.digitsTitle || "SON XONASI"}</Text>
              <Text style={styles.examplesSubtitle}>{t.digitsSubtitle || "Qatnashadigan sonlar xonasini tanlang"}</Text>
            </View>
          </View>

          {!isDigitsPickerOpen ? (
            <TouchableOpacity 
              style={styles.examplesSelectorClosed} 
              activeOpacity={0.8}
              onPress={() => setIsDigitsPickerOpen(true)}
            >
              <Text style={styles.examplesSelectorValueText}>{selectedDigits} <Text style={styles.examplesSelectorLabelText}>{t.digitsLabel || "xonali"}</Text></Text>
              <MaterialCommunityIcons name="chevron-down" size={24} color="#A855F7" />
            </TouchableOpacity>
          ) : (
            <View style={styles.examplesPickerExpanded}>
              <ScrollView 
                style={styles.examplesPickerScroll} 
                showsVerticalScrollIndicator={false}
                snapToInterval={40}
                decelerationRate="fast"
                onMomentumScrollEnd={(e) => {
                  const offsetY = e.nativeEvent.contentOffset.y;
                  const index = Math.round(offsetY / 40);
                  if (digitsOptions[index]) {
                    setSelectedDigits(digitsOptions[index]);
                  }
                }}
              >
                <View style={{ height: 40 }} />
                {digitsOptions.map((d) => {
                  const isSelected = selectedDigits === d;
                  return (
                    <TouchableOpacity 
                      key={d.toString()} 
                      style={[styles.examplesPickerItem, isSelected && styles.examplesPickerItemSelected]}
                      onPress={() => {
                        setSelectedDigits(d);
                        setIsDigitsPickerOpen(false);
                      }}
                    >
                      <Text style={[styles.examplesPickerItemText, isSelected && styles.examplesPickerItemTextSelected]}>
                        {d} {isSelected && <Text style={styles.examplesPickerItemLabel}>{t.digitsLabel || "xonali"}</Text>}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                <View style={{ height: 40 }} />
              </ScrollView>
            </View>
          )}
        </View>

      </ScrollView>

      {/* START BATTLE BUTTON */}
      <View style={styles.startSection}>
        <TouchableOpacity 
          style={styles.startBtn}
          onPress={() => {
            navigation.navigate('BattleMatchmaking', {
              battleMode,
              language,
              examplesCount: selectedExamples,
              operation: selectedOperation,
              speed: selectedSpeed,
              digits: selectedDigits
            });
          }}
          activeOpacity={0.8}
        >
          <View style={styles.startBtnIconContainer}>
            <MaterialCommunityIcons name="sword-cross" size={24} color="#fff" />
          </View>
          <View style={styles.startBtnTextContainer}>
            <Text style={styles.startBtnText}>{t.startBattle || "BATTLE BOSHLASH"}</Text>
          </View>
          <View style={{ width: 24 }} />
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    marginBottom: 10 
  },
  backButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#1E1045', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  headerTitle: { 
    color: '#FFF', 
    fontSize: 18, 
    fontFamily: 'Inter_700Bold' 
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 120,
  },
  examplesContainer: {
    marginTop: 15,
    backgroundColor: '#070710',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#1A103C',
  },
  examplesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  examplesIconBox: {
    width: 44,
    height: 44,
    backgroundColor: '#150A2E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  examplesHeaderTextContainer: {
    flex: 1,
  },
  examplesTitle: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  examplesSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  examplesSelectorClosed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0D0820', 
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#3B1877',
  },
  examplesSelectorValueText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  examplesSelectorLabelText: {
    color: '#D8B4FE',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  examplesPickerExpanded: {
    backgroundColor: '#070710',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1A103C',
    height: 120,
    overflow: 'hidden',
  },
  examplesPickerScroll: {
    width: '100%',
  },
  examplesPickerItem: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  examplesPickerItemSelected: {
    backgroundColor: '#1E1045',
    borderRadius: 12,
    marginHorizontal: 10,
  },
  examplesPickerItemText: {
    color: '#6B7280',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  examplesPickerItemTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  examplesPickerItemLabel: {
    fontSize: 14,
    color: '#D1D5DB',
    fontWeight: 'normal',
  },
  opsContainer: {
    marginTop: 15,
    backgroundColor: '#070710',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#1A103C',
  },
  opsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  opsIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  opsHeaderTextContainer: {
    flex: 1,
  },
  opsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  opsSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 2,
  },
  opsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '100%',
  },
  opsCard: {
    width: '48%',
    height: 110,
    backgroundColor: '#0f1020',
    borderRadius: 12,
    padding: 6,
    marginHorizontal: 3,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  opsCardSelected: {
    backgroundColor: '#160a2b',
    borderColor: '#A855F7',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  opsCheckmarkBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#A855F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  opsCardIconWrapper: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  opsFormulaIcon: {
    fontSize: 18,
    color: '#9CA3AF',
    fontStyle: 'italic',
    fontFamily: 'serif',
  },
  opsFormulaIconSelected: {
    color: '#fff',
  },
  opsCardTitle: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  opsCardTitleSelected: {
    color: '#fff',
  },
  opsCardDesc: {
    color: '#9CA3AF',
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 11,
  },
  startSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    backgroundColor: 'rgba(5, 5, 10, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#1E1045',
  },
  startBtn: {
    backgroundColor: '#A855F7',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },
  startBtnIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startBtnTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  startBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
  },
});
