const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'screens/BattleMatchmakingScreen.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the Cancel / Battle Sozlamalari logic
const oldFooter = /{\/\* Footer Area \*\/}[\s\S]*?<\/SafeAreaView>/;
const newFooter = `        {/* Footer Area */}
        <SafeAreaView style={styles.footerSafeArea} edges={['bottom']}>
          {/* Tip Box */}
          <View style={styles.tipBox}>
            <View style={styles.tipIconBox}>
              <MaterialCommunityIcons name="lightbulb-on" size={24} color="#F59E0B" />
            </View>
            <View style={styles.tipTextContainer}>
              <Text style={styles.tipTitle}>{t.tipTitle}</Text>
              <Text style={styles.tipDesc}>{t.tipText}</Text>
            </View>
          </View>

          {opponent && isHost && !showLoading ? (
            <TouchableOpacity 
              style={[styles.cancelBtn, { backgroundColor: '#10B981' }]} 
              onPress={() => setShowSettingsModal(true)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="cog" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.cancelBtnText}>Battle sozlamalari</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.8}>
              <Feather name="x" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.cancelBtnText}>{t.cancel}</Text>
            </TouchableOpacity>
          )}
        </SafeAreaView>`;

content = content.replace(oldFooter, newFooter);

// We need to add state for the new dropdowns in the modal
// Actually we already have: localExamplesCount, localOperation, localSpeed, localDigits
// And we need isExamplesPickerOpen, isSpeedPickerOpen, isDigitsPickerOpen
const stateRegex = /const \[localDigits, setLocalDigits\] = useState\(digits\);/;
const stateAddition = `const [localDigits, setLocalDigits] = useState(digits);
  const [isExamplesPickerOpen, setIsExamplesPickerOpen] = useState(false);
  const [isSpeedPickerOpen, setIsSpeedPickerOpen] = useState(false);
  const [isDigitsPickerOpen, setIsDigitsPickerOpen] = useState(false);

  const exampleNumbers = Array.from({ length: 24 }, (_, i) => i + 2); // 2 to 25
  const speedOptions = [0.5, 0.7, 1.0, 1.5, 2.0];
  const digitsOptions = [1, 2, 3, 4];
  const formatSpeed = (val) => \`\${val} soniya\`;
`;
content = content.replace(stateRegex, stateAddition);


// Replace the old simple modal with the full styled modal
const oldModal = /<Modal visible={showSettingsModal}[\s\S]*?<\/Modal>/;
const newModal = `<Modal visible={showSettingsModal} transparent animationType="slide">
        <View style={styles.fullModalOverlay}>
          <SafeAreaView style={styles.fullModalContainer}>
            <View style={styles.fullModalHeader}>
              <TouchableOpacity style={styles.fullModalBackButton} onPress={() => setShowSettingsModal(false)}>
                <MaterialCommunityIcons name="arrow-left" size={20} color="#D1D5DB" />
              </TouchableOpacity>
              <Text style={styles.fullModalHeaderTitle}>BATTLE SOZLAMALARI</Text>
              <View style={{ width: 40 }} />
            </View>

            <ScrollView nestedScrollEnabled={true} style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.fullModalScrollContent}>
              
              {/* NUMBER OF EXAMPLES */}
              <View style={styles.settingsGroupContainer}>
                <View style={styles.settingsGroupHeader}>
                  <View style={styles.settingsIconBox}>
                    <MaterialCommunityIcons name="format-list-bulleted" size={24} color="#A855F7" />
                  </View>
                  <View style={styles.settingsHeaderTextContainer}>
                    <Text style={styles.settingsTitle}>MISOLLAR SONI</Text>
                    <Text style={styles.settingsSubtitle}>Nechta misol yechishni xohlaysiz?</Text>
                  </View>
                </View>

                {!isExamplesPickerOpen ? (
                  <TouchableOpacity style={styles.settingsSelectorClosed} activeOpacity={0.8} onPress={() => setIsExamplesPickerOpen(true)}>
                    <Text style={styles.settingsSelectorValueText}>{localExamplesCount} <Text style={styles.settingsSelectorLabelText}>ta misol</Text></Text>
                    <MaterialCommunityIcons name="chevron-down" size={24} color="#A855F7" />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.settingsPickerExpanded}>
                    <ScrollView nestedScrollEnabled={true} style={styles.settingsPickerScroll} showsVerticalScrollIndicator={false} snapToInterval={40} decelerationRate="fast" onMomentumScrollEnd={(e) => {
                      const offsetY = e.nativeEvent.contentOffset.y;
                      const index = Math.round(offsetY / 40);
                      if (exampleNumbers[index]) setLocalExamplesCount(exampleNumbers[index]);
                    }}>
                      <View style={{ height: 40 }} />
                      {exampleNumbers.map((num) => {
                        const isSelected = localExamplesCount === num;
                        return (
                          <TouchableOpacity key={num} style={[styles.settingsPickerItem, isSelected && styles.settingsPickerItemSelected]} onPress={() => { setLocalExamplesCount(num); setIsExamplesPickerOpen(false); }}>
                            <Text style={[styles.settingsPickerItemText, isSelected && styles.settingsPickerItemTextSelected]}>
                              {num} {isSelected && <Text style={styles.settingsPickerItemLabel}>ta misol</Text>}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                      <View style={{ height: 40 }} />
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* OPERATIONS */}
              <View style={styles.settingsGroupContainer}>
                <View style={styles.settingsGroupHeader}>
                  <View style={styles.settingsIconBox}>
                    <MaterialCommunityIcons name="calculator-variant" size={24} color="#A855F7" />
                  </View>
                  <View style={styles.settingsHeaderTextContainer}>
                    <Text style={styles.settingsTitle}>OPERATSIYALAR</Text>
                    <Text style={styles.settingsSubtitle}>Qanday misollar tushishini tanlang</Text>
                  </View>
                </View>

                <View style={styles.opsRow}>
                  <TouchableOpacity style={[styles.opsCard, localOperation === 'oddiy' && styles.opsCardSelected]} onPress={() => setLocalOperation('oddiy')} activeOpacity={0.8}>
                    {localOperation === 'oddiy' && <View style={styles.opsCheckmarkBadge}><MaterialCommunityIcons name="check-bold" size={12} color="#fff" /></View>}
                    <View style={styles.opsCardIconWrapper}><MaterialCommunityIcons name="plus" size={32} color={localOperation === 'oddiy' ? '#A855F7' : '#9CA3AF'} /></View>
                    <Text style={[styles.opsCardTitle, localOperation === 'oddiy' && styles.opsCardTitleSelected]}>Oddiy</Text>
                    <Text style={styles.opsCardDesc} numberOfLines={2}>Faqat oddiy qo'shish va ayirish</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.opsCard, localOperation === 'f5' && styles.opsCardSelected]} onPress={() => setLocalOperation('f5')} activeOpacity={0.8}>
                    {localOperation === 'f5' && <View style={styles.opsCheckmarkBadge}><MaterialCommunityIcons name="check-bold" size={12} color="#fff" /></View>}
                    <View style={styles.opsCardIconWrapper}><Text style={[styles.opsFormulaIcon, localOperation === 'f5' && styles.opsFormulaIconSelected]}>f(x)</Text></View>
                    <Text style={[styles.opsCardTitle, localOperation === 'f5' && styles.opsCardTitleSelected]}>Formula 5</Text>
                    <Text style={styles.opsCardDesc} numberOfLines={2}>5 lik formula qo'shish, ayirish</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.opsCard, localOperation === 'f10' && styles.opsCardSelected]} onPress={() => setLocalOperation('f10')} activeOpacity={0.8}>
                    {localOperation === 'f10' && <View style={styles.opsCheckmarkBadge}><MaterialCommunityIcons name="check-bold" size={12} color="#fff" /></View>}
                    <View style={styles.opsCardIconWrapper}><Text style={[styles.opsFormulaIcon, localOperation === 'f10' && styles.opsFormulaIconSelected]}>f(x)</Text></View>
                    <Text style={[styles.opsCardTitle, localOperation === 'f10' && styles.opsCardTitleSelected]}>Formula 10</Text>
                    <Text style={styles.opsCardDesc} numberOfLines={2}>10 lik formula qo'shish, ayirish</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.opsCard, localOperation === 'aralash' && styles.opsCardSelected]} onPress={() => setLocalOperation('aralash')} activeOpacity={0.8}>
                    {localOperation === 'aralash' && <View style={styles.opsCheckmarkBadge}><MaterialCommunityIcons name="check-bold" size={12} color="#fff" /></View>}
                    <View style={styles.opsCardIconWrapper}><MaterialCommunityIcons name="shuffle-variant" size={28} color={localOperation === 'aralash' ? '#A855F7' : '#9CA3AF'} /></View>
                    <Text style={[styles.opsCardTitle, localOperation === 'aralash' && styles.opsCardTitleSelected]}>Aralash</Text>
                    <Text style={styles.opsCardDesc} numberOfLines={2}>Barcha formulalar qatnashadi</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* SPEED */}
              <View style={styles.settingsGroupContainer}>
                <View style={styles.settingsGroupHeader}>
                  <View style={styles.settingsIconBox}>
                    <MaterialCommunityIcons name="lightning-bolt" size={24} color="#A855F7" />
                  </View>
                  <View style={styles.settingsHeaderTextContainer}>
                    <Text style={styles.settingsTitle}>TEZLIK</Text>
                    <Text style={styles.settingsSubtitle}>Mashq bajarish tezligini tanlang</Text>
                  </View>
                </View>

                {!isSpeedPickerOpen ? (
                  <TouchableOpacity style={styles.settingsSelectorClosed} activeOpacity={0.8} onPress={() => setIsSpeedPickerOpen(true)}>
                    <Text style={styles.settingsSelectorValueText}>{formatSpeed(localSpeed)}</Text>
                    <MaterialCommunityIcons name="chevron-down" size={24} color="#A855F7" />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.settingsPickerExpanded}>
                    <ScrollView nestedScrollEnabled={true} style={styles.settingsPickerScroll} showsVerticalScrollIndicator={false} snapToInterval={40} decelerationRate="fast" onMomentumScrollEnd={(e) => {
                      const offsetY = e.nativeEvent.contentOffset.y;
                      const index = Math.round(offsetY / 40);
                      if (speedOptions[index]) setLocalSpeed(speedOptions[index]);
                    }}>
                      <View style={{ height: 40 }} />
                      {speedOptions.map((s) => {
                        const isSelected = localSpeed === s;
                        return (
                          <TouchableOpacity key={s.toString()} style={[styles.settingsPickerItem, isSelected && styles.settingsPickerItemSelected]} onPress={() => { setLocalSpeed(s); setIsSpeedPickerOpen(false); }}>
                            <Text style={[styles.settingsPickerItemText, isSelected && styles.settingsPickerItemTextSelected]}>{formatSpeed(s)}</Text>
                          </TouchableOpacity>
                        );
                      })}
                      <View style={{ height: 40 }} />
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* DIGITS */}
              <View style={styles.settingsGroupContainer}>
                <View style={styles.settingsGroupHeader}>
                  <View style={styles.settingsIconBox}>
                    <MaterialCommunityIcons name="numeric" size={24} color="#A855F7" />
                  </View>
                  <View style={styles.settingsHeaderTextContainer}>
                    <Text style={styles.settingsTitle}>SON XONASI</Text>
                    <Text style={styles.settingsSubtitle}>Qatnashadigan sonlar xonasini tanlang</Text>
                  </View>
                </View>

                {!isDigitsPickerOpen ? (
                  <TouchableOpacity style={styles.settingsSelectorClosed} activeOpacity={0.8} onPress={() => setIsDigitsPickerOpen(true)}>
                    <Text style={styles.settingsSelectorValueText}>{localDigits} <Text style={styles.settingsSelectorLabelText}>xonali</Text></Text>
                    <MaterialCommunityIcons name="chevron-down" size={24} color="#A855F7" />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.settingsPickerExpanded}>
                    <ScrollView nestedScrollEnabled={true} style={styles.settingsPickerScroll} showsVerticalScrollIndicator={false} snapToInterval={40} decelerationRate="fast" onMomentumScrollEnd={(e) => {
                      const offsetY = e.nativeEvent.contentOffset.y;
                      const index = Math.round(offsetY / 40);
                      if (digitsOptions[index]) setLocalDigits(digitsOptions[index]);
                    }}>
                      <View style={{ height: 40 }} />
                      {digitsOptions.map((d) => {
                        const isSelected = localDigits === d;
                        return (
                          <TouchableOpacity key={d.toString()} style={[styles.settingsPickerItem, isSelected && styles.settingsPickerItemSelected]} onPress={() => { setLocalDigits(d); setIsDigitsPickerOpen(false); }}>
                            <Text style={[styles.settingsPickerItemText, isSelected && styles.settingsPickerItemTextSelected]}>
                              {d} {isSelected && <Text style={styles.settingsPickerItemLabel}>xonali</Text>}
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

            <View style={styles.fullModalFooter}>
              <TouchableOpacity 
                style={styles.startBtnFull}
                onPress={() => {
                  socketRef.current?.emit('start_host_battle', {
                    opponentSocketId: opponentRef.current?.socketId,
                    settings: {
                      examplesCount: localExamplesCount,
                      operation: localOperation,
                      speed: localSpeed,
                      digits: localDigits
                    }
                  });
                }}
                activeOpacity={0.8}
              >
                <View style={styles.startBtnIconContainerFull}>
                  <MaterialCommunityIcons name="sword-cross" size={24} color="#fff" />
                </View>
                <View style={styles.startBtnTextContainerFull}>
                  <Text style={styles.startBtnTextFull}>BATTLE BOSHLASH</Text>
                </View>
                <View style={{ width: 24 }} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>`;

content = content.replace(oldModal, newModal);

const additionalStyles = `
  fullModalOverlay: { flex: 1, backgroundColor: '#05050A' },
  fullModalContainer: { flex: 1 },
  fullModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#05050A' },
  fullModalBackButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1E1045', alignItems: 'center', justifyContent: 'center' },
  fullModalHeaderTitle: { color: '#FFF', fontSize: 16, fontFamily: 'Inter_700Bold' },
  fullModalScrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 120 },
  settingsGroupContainer: { marginTop: 8, backgroundColor: '#070710', borderRadius: 16, padding: 16, width: '100%', borderWidth: 1, borderColor: '#1A103C', marginBottom: 15 },
  settingsGroupHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  settingsIconBox: { width: 44, height: 44, backgroundColor: '#150A2E', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  settingsHeaderTextContainer: { flex: 1 },
  settingsTitle: { color: '#FFF', fontSize: 14, fontFamily: 'Inter_700Bold', marginBottom: 4, textTransform: 'uppercase' },
  settingsSubtitle: { color: '#9CA3AF', fontSize: 12, fontFamily: 'Inter_500Medium' },
  settingsSelectorClosed: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0D0820', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 14, borderWidth: 1, borderColor: '#3B1877' },
  settingsSelectorValueText: { color: '#FFF', fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  settingsSelectorLabelText: { color: '#D8B4FE', fontSize: 14, fontFamily: 'Inter_400Regular' },
  settingsPickerExpanded: { backgroundColor: '#070710', borderRadius: 12, borderWidth: 1, borderColor: '#1A103C', height: 120, overflow: 'hidden' },
  settingsPickerScroll: { width: '100%' },
  settingsPickerItem: { height: 40, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  settingsPickerItemSelected: { backgroundColor: '#1E1045', borderRadius: 12, marginHorizontal: 10 },
  settingsPickerItemText: { color: '#6B7280', fontSize: 14, fontFamily: 'Inter_500Medium' },
  settingsPickerItemTextSelected: { color: '#fff', fontWeight: 'bold' },
  settingsPickerItemLabel: { fontSize: 14, color: '#D1D5DB', fontWeight: 'normal' },
  opsRow: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', width: '100%' },
  opsCard: { width: '48%', height: 110, backgroundColor: '#0f1020', borderRadius: 12, padding: 6, marginHorizontal: 3, marginBottom: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'transparent' },
  opsCardSelected: { backgroundColor: '#160a2b', borderColor: '#A855F7', shadowColor: '#A855F7', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  opsCheckmarkBadge: { position: 'absolute', top: 4, right: 4, width: 16, height: 16, borderRadius: 8, backgroundColor: '#A855F7', justifyContent: 'center', alignItems: 'center' },
  opsCardIconWrapper: { height: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  opsFormulaIcon: { fontSize: 18, color: '#9CA3AF', fontStyle: 'italic', fontFamily: 'serif' },
  opsFormulaIconSelected: { color: '#fff' },
  opsCardTitle: { color: '#fff', fontSize: 11, fontWeight: 'bold', marginBottom: 2, textAlign: 'center' },
  opsCardTitleSelected: { color: '#fff' },
  opsCardDesc: { color: '#9CA3AF', fontSize: 9, textAlign: 'center', lineHeight: 11 },
  fullModalFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: Platform.OS === 'ios' ? 30 : 20, backgroundColor: 'rgba(5, 5, 10, 0.95)', borderTopWidth: 1, borderTopColor: '#1E1045' },
  startBtnFull: { backgroundColor: '#A855F7', borderRadius: 16, paddingVertical: 18, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  startBtnIconContainerFull: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  startBtnTextContainerFull: { flex: 1, alignItems: 'center' },
  startBtnTextFull: { color: '#fff', fontSize: 16, fontFamily: 'Inter_700Bold', textTransform: 'uppercase' },
});`;

content = content.replace(/}\);$/, additionalStyles);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Matchmaking UI updated with Friend Settings UI successfully!');
