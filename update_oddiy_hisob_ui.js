const fs = require('fs');

let content = fs.readFileSync('screens/OddiyHisobGameScreen.js', 'utf8');

// 1. Add ImageBackground to imports if not present
if (!content.includes('ImageBackground')) {
  content = content.replace("import { View, Text, StyleSheet, TouchableOpacity", "import { View, Text, StyleSheet, TouchableOpacity, ImageBackground");
}

// 2. Wrap the return statement with ImageBackground
const returnRegex = /return \(\s*<SafeAreaView style=\{styles\.container\}>([\s\S]*?)<\/SafeAreaView>\s*\);/;
content = content.replace(returnRegex, (match, p1) => {
  return `return (
    <ImageBackground source={require('../assets/oddiy_hisob_bg.jpg')} style={styles.bgImage} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        ${p1}
      </SafeAreaView>
    </ImageBackground>
  );`;
});

// 3. Update top bar badges styles in StyleSheet
content = content.replace(
  /energyBadge:\s*\{[\s\S]*?\},/,
  `energyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 20, 40, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#FBBF24',
  },`
);

content = content.replace(
  /coinBadge:\s*\{[\s\S]*?\},/,
  `coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 20, 40, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FBBF24',
  },`
);

content = content.replace(
  /backBtn:\s*\{[\s\S]*?\},/,
  `backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(10, 20, 40, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },`
);

// 4. Add bgImage style
if (!content.includes('bgImage: {')) {
  content = content.replace(
    /container:\s*\{/,
    `bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {`
  );
}
// Remove background color from container so ImageBackground is visible
content = content.replace(/backgroundColor:\s*'#0B1120',/, "backgroundColor: 'transparent',");


// 5. Update renderFlashingArea
const renderFlashingAreaRegex = /const renderFlashingArea = \(\) => \{[\s\S]*?return \(\s*<View style=\{styles\.flashingContainer\}>([\s\S]*?)<\/View>\s*\);\s*\};/;
content = content.replace(renderFlashingAreaRegex, (match, p1) => {
  return `const renderFlashingArea = () => {
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
        <Text style={styles.flashingCardNumber}>{currentTerm.num}</Text>
        <View style={[styles.flashingCardOperator, !currentTerm.op && { opacity: 0 }, { backgroundColor: opColor, shadowColor: opColor }]}>
          <Text style={styles.flashingCardOperatorText}>{currentTerm.op || '+'}</Text>
        </View>
        <Text style={styles.flashingCardText}>{t.rememberNumber}</Text>
        <View style={styles.flashingCardDots}>
          {renderDots()}
        </View>
      </View>
    );
  };`;
});

// Update renderDots margin
content = content.replace(
  /const renderDots = \(\) => \{[\s\S]*?<View style=\{\[styles\.dotsContainer, \{ marginTop: 30 \}\]\}>/,
  `const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>`
);

// Add flashingCard styles
if (!content.includes('flashingCard: {')) {
  content = content.replace(
    /flashingContainer:\s*\{[\s\S]*?\},/,
    `flashingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashingCard: {
    width: '85%',
    aspectRatio: 0.9,
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
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    shadowOpacity: 0.8,
  },
  flashingCardOperatorText: {
    color: '#FFF',
    fontSize: 36,
    fontFamily: 'Inter_700Bold',
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
  },`
  );
}

// 6. Update renderFlashingBottom
const renderFlashingBottomRegex = /const renderFlashingBottom = \(\) => \([\s\S]*?<\/View>\s*\);/;
content = content.replace(renderFlashingBottomRegex, () => {
  return `const renderFlashingBottom = () => {
    if (phase === 'countdown' || phase === 'flashing') {
      return (
        <View style={styles.floatingTimerContainer}>
          <MaterialCommunityIcons name="hourglass" size={20} color="#3B82F6" />
          <Text style={styles.floatingTimerText}>{speed}s</Text>
        </View>
      );
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
  };`;
});

// Add floatingTimer styles
if (!content.includes('floatingTimerContainer: {')) {
  content = content.replace(
    /flashingBottomWrapper:\s*\{/,
    `floatingTimerContainer: {
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
  flashingBottomWrapper: {`
  );
}


fs.writeFileSync('screens/OddiyHisobGameScreen.js', content);
