const fs = require('fs');

let content = fs.readFileSync('screens/OddiyHisobGameScreen.js', 'utf8');

// Fix renderFlashingBottom
content = content.replace(
  /\);\s*<View style=\{styles\.maslahatContainer\}>/,
  `);

  const renderFlashingBottom = () => {
    if (phase === 'countdown' || phase === 'flashing') {
      return null;
    }
    
    return (
      <View style={styles.flashingBottomWrapper}>
        <View style={styles.maslahatContainer}>`
);

// Fix the main return statement to conditionally render ImageBackground
const returnRegex = /return \(\s*<View style=\{\{ flex: 1, backgroundColor: '#050510' \}\}>\s*<ImageBackground source=\{require\('\.\.\/assets\/oddiy_hisob_bg_new\.png'\)\} style=\{styles\.bgImage\} resizeMode="contain">\s*<SafeAreaView style=\{styles\.container\}>([\s\S]*?)<\/SafeAreaView>\s*<\/ImageBackground>\s*<\/View>\s*\);/;

content = content.replace(returnRegex, (match, p1) => {
  return `const ScreenContent = (
    <SafeAreaView style={styles.container}>
      ${p1}
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
  );`;
});

fs.writeFileSync('screens/OddiyHisobGameScreen.js', content);
