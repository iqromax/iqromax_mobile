const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'screens/BattleMatchmakingScreen.js');
let content = fs.readFileSync(filePath, 'utf8');

// Add imports
content = content.replace(
  "import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, ImageBackground, ActivityIndicator, Platform } from 'react-native';",
  "import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, ImageBackground, ActivityIndicator, Platform, Modal, ScrollView } from 'react-native';"
);

// Add refs and states
const stateReplacement = `
  const [userData, setUserData] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const [localExamplesCount, setLocalExamplesCount] = useState(examplesCount);
  const [localOperation, setLocalOperation] = useState(operation);
  const [localSpeed, setLocalSpeed] = useState(speed);
  const [localDigits, setLocalDigits] = useState(digits);
  
  const socketRef = useRef(null);
  const timeoutRef = useRef(null);
  const opponentRef = useRef(null);
  const isHostRef = useRef(false);
`;
content = content.replace(
  /const \[userData, setUserData\] = useState\(null\);\s+const \[opponent, setOpponent\] = useState\(null\);\s+const socketRef = useRef\(null\);\s+const timeoutRef = useRef\(null\);/,
  stateReplacement
);

// Update random_match_found listener
const matchFoundReplacement = `
    socketRef.current.on('random_match_found', (data) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setOpponent(data.opponent);
      setIsHost(data.isHost);
      opponentRef.current = data.opponent;
      isHostRef.current = data.isHost;
    });

    socketRef.current.on('start_battle_countdown', (settings) => {
      setShowSettingsModal(false);
      setShowLoading(true);
      setTimeout(() => {
        if (socketRef.current) socketRef.current.disconnect();
        navigation.replace('BattleGame', {
          mode: 'battle',
          isHost: isHostRef.current,
          targetId: opponentRef.current?.customId,
          examplesCount: settings.examplesCount,
          operation: settings.operation,
          speed: settings.speed,
          digits: settings.digits,
          language,
          opponentData: opponentRef.current
        });
      }, 3000);
    });
`;
content = content.replace(
  /socketRef\.current\.on\('random_match_found', \(data\) => {[\s\S]*?\/\/ Auto-navigation disabled for now as requested by user\n    }\);/,
  matchFoundReplacement
);

// Update Footer Area UI
const footerReplacement = `
        {/* Footer Area */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          {opponent && isHost && !showLoading && (
            <TouchableOpacity 
              style={[styles.cancelBtn, { backgroundColor: '#10B981', marginBottom: 15 }]} 
              onPress={() => setShowSettingsModal(true)}
            >
              <Text style={styles.cancelBtnText}>Battle sozlamalari</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <MaterialCommunityIcons name="close" size={20} color="#fff" />
            <Text style={styles.cancelBtnText}>{t.cancel}</Text>
          </TouchableOpacity>
        </View>
`;
content = content.replace(
  /{\/\* Footer Area \*\/}[\s\S]*?<\/TouchableOpacity>\n        <\/View>/,
  footerReplacement
);

// Add Modal and Loading Overlay
const modalContent = `
      {showLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>O'yin boshlanmoqda...</Text>
        </View>
      )}

      <Modal visible={showSettingsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Battle Sozlamalari</Text>

            <Text style={styles.modalLabel}>Misollar soni: {localExamplesCount}</Text>
            <View style={styles.modalRow}>
              {[5, 10, 15, 20].map(val => (
                <TouchableOpacity key={val} style={[styles.modalBtn, localExamplesCount === val && styles.modalBtnActive]} onPress={() => setLocalExamplesCount(val)}>
                  <Text style={[styles.modalBtnText, localExamplesCount === val && styles.modalBtnTextActive]}>{val}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>Tezlik (soniya): {localSpeed}</Text>
            <View style={styles.modalRow}>
              {[0.5, 1, 1.5, 2].map(val => (
                <TouchableOpacity key={val} style={[styles.modalBtn, localSpeed === val && styles.modalBtnActive]} onPress={() => setLocalSpeed(val)}>
                  <Text style={[styles.modalBtnText, localSpeed === val && styles.modalBtnTextActive]}>{val}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>Xonalar soni: {localDigits}</Text>
            <View style={styles.modalRow}>
              {[1, 2, 3].map(val => (
                <TouchableOpacity key={val} style={[styles.modalBtn, localDigits === val && styles.modalBtnActive]} onPress={() => setLocalDigits(val)}>
                  <Text style={[styles.modalBtnText, localDigits === val && styles.modalBtnTextActive]}>{val}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.startBtn}
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
            >
              <Text style={styles.startBtnText}>Battle Boshlash</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.startBtn, { backgroundColor: '#EF4444', marginTop: 10 }]} onPress={() => setShowSettingsModal(false)}>
              <Text style={styles.startBtnText}>{t.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ImageBackground>
`;
content = content.replace(
  /<\/ImageBackground>/,
  modalContent
);

// Add styles
const newStyles = `
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#1F2937', borderRadius: 15, padding: 20 },
  modalTitle: { color: '#fff', fontSize: 20, fontFamily: 'Inter_700Bold', marginBottom: 20, textAlign: 'center' },
  modalLabel: { color: '#9CA3AF', fontSize: 14, fontFamily: 'Inter_500Medium', marginBottom: 10, marginTop: 10 },
  modalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  modalBtn: { flex: 1, backgroundColor: '#374151', paddingVertical: 10, marginHorizontal: 4, borderRadius: 8, alignItems: 'center' },
  modalBtnActive: { backgroundColor: '#3B82F6' },
  modalBtnText: { color: '#D1D5DB', fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  modalBtnTextActive: { color: '#fff' },
  startBtn: { backgroundColor: '#10B981', paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  startBtnText: { color: '#fff', fontSize: 16, fontFamily: 'Inter_700Bold' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
  loadingText: { color: '#fff', fontSize: 18, fontFamily: 'Inter_600SemiBold', marginTop: 20 },
});
`;
content = content.replace(
  /}\);$/,
  newStyles
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Matchmaking UI updated successfully!');
