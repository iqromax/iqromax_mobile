const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'screens/BattleMatchmakingScreen.js');
let content = fs.readFileSync(filePath, 'utf8');

// Ensure DeviceEventEmitter is imported
if (!content.includes('DeviceEventEmitter')) {
  content = content.replace(
    "import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, ImageBackground, ActivityIndicator, Platform, Modal, ScrollView } from 'react-native';",
    "import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, ImageBackground, ActivityIndicator, Platform, Modal, ScrollView, DeviceEventEmitter } from 'react-native';"
  );
}

// Add the DeviceEventEmitter listener inside the main useEffect (or just a new useEffect)
const newEffect = `
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('trigger_start_host_battle', (settings) => {
      if (socketRef.current) {
        socketRef.current.emit('start_host_battle', {
          opponentSocketId: opponentRef.current?.socketId,
          settings
        });
      }
    });
    return () => sub.remove();
  }, []);
`;
content = content.replace(
  /const socketRef = useRef\(null\);/,
  newEffect + "\n  const socketRef = useRef(null);"
);

// Update the "Battle sozlamalari" button to navigate instead of showing modal
const oldBtn = /<TouchableOpacity[\s\S]*?onPress={\(\) => setShowSettingsModal\(true\)}[\s\S]*?<\/TouchableOpacity>/;
const newBtn = `<TouchableOpacity 
              style={[styles.cancelBtn, { backgroundColor: '#10B981', marginBottom: 15 }]} 
              onPress={() => {
                navigation.navigate('BattleSettings', { 
                  language,
                  battleMode,
                  isFromMatchmaking: true
                });
              }}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="cog" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.cancelBtnText}>Battle sozlamalari</Text>
            </TouchableOpacity>`;
content = content.replace(oldBtn, newBtn);

// Remove the basic Modal from the render entirely
content = content.replace(/<Modal visible={showSettingsModal}[\s\S]*?<\/Modal>/, "");

// We can remove showSettingsModal from state too
content = content.replace(/const \[showSettingsModal, setShowSettingsModal\] = useState\(false\);\n/, "");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Matchmaking UI updated to use navigation successfully!');
