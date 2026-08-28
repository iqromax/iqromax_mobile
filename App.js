import './src/utils/safeWeakMap';
import { Asset } from 'expo-asset';
import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Image, ActivityIndicator, Modal, Text, TouchableOpacity, StyleSheet, Animated, DeviceEventEmitter, Linking } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { io } from 'socket.io-client';
import { SOCKET_URL, API_URL } from './src/config/api';
import StepOneScreen from './screens/StepOneScreen';
import StepTwoScreen from './screens/StepTwoScreen';
import AuthScreen from './screens/AuthScreen';
import OtpScreen from './screens/OtpScreen';
import StepThreeScreen from './screens/StepThreeScreen';
import StepFourScreen from './screens/StepFourScreen';
import StepFiveScreen from './screens/StepFiveScreen';
import StudentDashboardScreen from './screens/StudentDashboardScreen';
import EnergyCenterScreen from './screens/EnergyCenterScreen';
import ReferralScreen from './screens/ReferralScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import OddiyHisobGameScreen from './screens/OddiyHisobGameScreen';
import AbacusSimulatorScreen from './screens/AbacusSimulatorScreen';
import BattleSettingsScreen from './screens/BattleSettingsScreen';
import BattleMatchmakingScreen from './screens/BattleMatchmakingScreen';
import BattleGameScreen from './screens/BattleGameScreen';
import FriendInviteScreen from './screens/FriendInviteScreen';
import BattleResultScreen from './screens/BattleResultScreen';
import MysteryBoxScreen from './screens/MysteryBoxScreen';
import AdvancedSplashScreen from './components/AdvancedSplashScreen';


import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_900Black } from '@expo-google-fonts/inter';

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

import TeacherDashboardScreen from './screens/TeacherDashboardScreen';

export default function App() {
  
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [initialRoute, setInitialRoute] = useState('StepOne');
  const [initialParams, setInitialParams] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [splashFinished, setSplashFinished] = useState(false);
  const [deletedReason, setDeletedReason] = useState(null);
  const [battleInvite, setBattleInvite] = useState(null);
  const [inviteTimer, setInviteTimer] = useState(0);
  const [rejectionAlert, setRejectionAlert] = useState(null);
  const inviteSlideAnim = useRef(new Animated.Value(-300)).current;
  const rejectionSlideAnim = useRef(new Animated.Value(-200)).current;
  const socketRef = useRef(null);

  const handleRespondInvite = async (status) => {
    if (!battleInvite) return;
    Animated.timing(inviteSlideAnim, { toValue: -300, duration: 250, useNativeDriver: true }).start(() => {
      setBattleInvite(null);
    });
    try {
      const userDataStr = await AsyncStorage.getItem('user_data');
      const currentUser = userDataStr ? JSON.parse(userDataStr) : null;
      if (socketRef.current) {
        socketRef.current.emit('respond_battle_invite', {
          notifId: battleInvite.id,
          status,
          targetName: currentUser?.name || "Do'stingiz",
          targetAvatar: currentUser?.avatar || null
        });
      }
      if (status === 'ACCEPTED') {
        if (navigationRef.isReady()) {
          navigationRef.navigate('BattleMatchmaking', { mode: 'dost', inviteData: battleInvite });
        }
      }
      try {
        const stored = await AsyncStorage.getItem('user_notifications');
        if (stored) {
          const list = JSON.parse(stored);
          const filtered = list.filter(n => n.id !== battleInvite.id);
          await AsyncStorage.setItem('user_notifications', JSON.stringify(filtered));
        }
      } catch(e) {}
    } catch (e) {
      console.error('respond invite error:', e);
    }
  };

  useEffect(() => {
    let interval;
    if (battleInvite && inviteTimer > 0) {
      interval = setInterval(() => {
        setInviteTimer((prev) => prev - 1);
      }, 1000);
    } else if (inviteTimer === 0 && battleInvite) {
      Animated.timing(inviteSlideAnim, { toValue: -300, duration: 250, useNativeDriver: true }).start(async () => {
        const expiredInvite = { ...battleInvite };
        setBattleInvite(null);
        try {
          const stored = await AsyncStorage.getItem('user_notifications');
          const list = stored ? JSON.parse(stored) : [];
          if (!list.some(n => n.id === expiredInvite.id)) {
            const updatedList = [expiredInvite, ...list];
            await AsyncStorage.setItem('user_notifications', JSON.stringify(updatedList));
          }
        } catch(e) {}
      });
    }
    return () => clearInterval(interval);
  }, [battleInvite, inviteTimer]);

  useEffect(() => {
    // Persistent root-level socket listener for real-time account deletion/blocking across ALL screens
    const socket = io(SOCKET_URL, { 
      path: '/api/socket.io',
      transports: ['websocket'] 
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      AsyncStorage.getItem('user_data').then(str => {
        if (str) {
          try {
            const u = JSON.parse(str);
            if (u && u.customId) socket.emit('register', u.customId);
          } catch (e) {}
        }
      });
    });

    socket.on('user_deleted', async (data) => {
      try {
        const userDataStr = await AsyncStorage.getItem('user_data');
        if (userDataStr) {
          const currentUser = JSON.parse(userDataStr);
          const dataId = String(data?.id || '').trim();
          const currentId = String(currentUser?.id || '').trim();
          const dataCustom = String(data?.customId || '').replace(/^#+/, '').trim().toUpperCase();
          const currentCustom = String(currentUser?.customId || '').replace(/^#+/, '').trim().toUpperCase();

          if (currentUser && ((dataId && currentId && dataId === currentId) || (dataCustom && currentCustom && dataCustom === currentCustom))) {
            setDeletedReason("Hisobingiz admin tomonidan o'chirildi.");
          }
        }
      } catch (e) {
        console.error('user_deleted socket check error:', e);
      }
    });

    socket.on('user_updated', async (data) => {
      try {
        const userDataStr = await AsyncStorage.getItem('user_data');
        if (userDataStr) {
          const currentUser = JSON.parse(userDataStr);
          const dataId = String(data?.id || '').trim();
          const currentId = String(currentUser?.id || '').trim();
          const dataCustom = String(data?.customId || '').replace(/^#+/, '').trim().toUpperCase();
          const currentCustom = String(currentUser?.customId || '').replace(/^#+/, '').trim().toUpperCase();

          if (currentUser && ((dataId && currentId && dataId === currentId) || (dataCustom && currentCustom && dataCustom === currentCustom))) {
            await AsyncStorage.setItem('user_data', JSON.stringify({ ...currentUser, ...data }));
            if (data.status !== 'Faol') {
              setDeletedReason("Hisobingiz admin tomonidan bloklandi.");
            }
          }
        }
      } catch (e) {
        console.error('user_updated socket check error:', e);
      }
    });

    socket.on('receive_battle_invite', (data) => {
      setBattleInvite(data);
      setInviteTimer(30);
      Animated.spring(inviteSlideAnim, { toValue: 50, useNativeDriver: true, tension: 50, friction: 8 }).start();
    });

    socket.on('battle_invite_response', (data) => {
      if (data && data.status === 'REJECTED') {
        const name = data.targetName || "Do'stingiz";
        setRejectionAlert(`❌ ${name} battle taklifingizni rad etdi.`);
        Animated.spring(rejectionSlideAnim, { toValue: 50, useNativeDriver: true, tension: 50, friction: 8 }).start();
        setTimeout(() => {
          Animated.timing(rejectionSlideAnim, { toValue: -200, duration: 250, useNativeDriver: true }).start(() => setRejectionAlert(null));
        }, 3500);
      }
    });

    socket.on('new_ad_video_uploaded', (data) => {
      DeviceEventEmitter.emit('new_ad_video_uploaded', data);
    });

    socket.on('ad_video_deleted', (data) => {
      DeviceEventEmitter.emit('ad_video_deleted', data);
    });

    // Continuous Auth Verification Polling (every 3 seconds)
    // Guarantees immediate logout alert when account is deleted/blocked even if socket events were missed while offline or disconnected
    const verifyUserAuth = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem('user_data');
        if (userDataStr) {
          const currentUser = JSON.parse(userDataStr);
          // Skip check for temporary guest users who have not registered on the server yet
          if (currentUser && currentUser.isGuest === true) {
            return;
          }
          if (currentUser && currentUser.customId) {
            let cleanId = String(currentUser.customId).trim();
            if (!cleanId.startsWith('#')) cleanId = '#' + cleanId;
            const encodedId = encodeURIComponent(cleanId);
            const res = await fetch(`${API_URL}/users/search/${encodedId}`);
            if (res.status === 404) {
              setDeletedReason("Hisobingiz admin tomonidan o'chirildi.");
            } else if (res.ok) {
              const text = await res.text();
              if (text && text.trim().startsWith('{')) {
                const data = JSON.parse(text);
                if (data && data.status && data.status !== 'Faol') {
                  setDeletedReason("Hisobingiz admin tomonidan bloklandi.");
                }
              }
            }
          }
        }
      } catch (e) {}
    };

    verifyUserAuth();
    const authInterval = setInterval(verifyUserAuth, 3000);

    // Check for pending battle invites missed while offline
    const checkPendingInvites = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem('user_data');
        if (userDataStr) {
          const currentUser = JSON.parse(userDataStr);
          if (currentUser?.customId) {
            let cleanId = String(currentUser.customId).trim();
            if (!cleanId.startsWith('#')) cleanId = '#' + cleanId;
            const encodedId = encodeURIComponent(cleanId);
            const res = await fetch(`${API_URL}/notifications/${encodedId}`);
            if (res.ok) {
              const text = await res.text();
              if (text && text.trim().startsWith('[')) {
                const notifs = JSON.parse(text);
                if (notifs && notifs.length > 0) {
                  const stored = await AsyncStorage.getItem('user_notifications');
                  const localList = stored ? JSON.parse(stored) : [];
                  const freshNotifs = notifs.filter(n => !localList.some(ln => ln.id === n.id));
                  if (freshNotifs.length > 0 && !battleInvite) {
                    setBattleInvite(freshNotifs[0]);
                    setInviteTimer(30);
                  }
                }
              }
            }
          }
        }
      } catch (e) {}
    };
    
    // Check after a short delay to allow socket to connect and app to render
    setTimeout(checkPendingInvites, 2000);

    // Deep Linking: parse promo parameter from url and save to AsyncStorage
    const handleDeepLinkUrl = async (url) => {
      if (!url) return;
      try {
        let extractedPromo = null;
        if (url.includes('promo=')) {
          extractedPromo = url.split('promo=')[1]?.split('&')[0];
        } else if (url.includes('ref=')) {
          extractedPromo = url.split('ref=')[1]?.split('&')[0];
        } else if (url.includes('/invite/')) {
          extractedPromo = url.split('/invite/')[1]?.split('?')[0];
        }

        if (extractedPromo) {
          const cleanPromo = decodeURIComponent(extractedPromo).replace(/^#+/, '').trim().toUpperCase();
          const res = await fetch(`${API_URL}/promo/validate/${encodeURIComponent(cleanPromo)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.valid && data.promo) {
              await AsyncStorage.setItem('pending_referral_promo', data.promo);
            } else {
              await AsyncStorage.removeItem('pending_referral_promo');
            }
          }
        }
      } catch (e) {
        console.error('Deep link url parse error:', e);
      }
    };

    Linking.getInitialURL().then(handleDeepLinkUrl).catch(() => {});
    const urlSub = Linking.addEventListener('url', (event) => handleDeepLinkUrl(event.url));

    return () => {
      socket.disconnect();
      clearInterval(authInterval);
      urlSub.remove();
    };
  }, []);

  const handleReturnHome = async () => {
    try {
      await AsyncStorage.removeItem('user_data');
    } catch (e) {
      console.error(e);
    }
    setDeletedReason(null);
    if (navigationRef.isReady()) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: 'StepOne' }],
      });
    }
  };

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const userDataStr = await AsyncStorage.getItem('user_data');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          
          // Verify user still exists in database before allowing access (only for non-guest registered users)
          if (userData && userData.isGuest !== true && userData.customId) {
            try {
              let cleanId = String(userData.customId).trim();
              if (!cleanId.startsWith('#')) cleanId = '#' + cleanId;
              const encodedId = encodeURIComponent(cleanId);
              const res = await fetch(`${API_URL}/users/search/${encodedId}`);
              if (res.status === 404) {
                await AsyncStorage.removeItem('user_data');
                setInitialRoute('StepOne');
                return;
              } else if (res.ok) {
                const text = await res.text();
                if (text && text.trim().startsWith('{')) {
                  const data = JSON.parse(text);
                  if (data && data.status && data.status !== 'Faol') {
                    setDeletedReason("Hisobingiz admin tomonidan bloklandi.");
                  }
                }
              }
            } catch (e) {}
          }
          
          let charIndex = 0;
          let gender = 'boys';
          const boysChars = ["Max", "Sam", "Leo", "Ray"];
          const girlsChars = ["Mia", "Zoe", "Eva", "Lily"];
          
          if (userData && userData.character) {
             if (boysChars.includes(userData.character)) {
               charIndex = boysChars.indexOf(userData.character);
               gender = 'boys';
             } else if (girlsChars.includes(userData.character)) {
               charIndex = girlsChars.indexOf(userData.character);
               gender = 'girls';
             }
          }

          if (userData && (userData.role?.toLowerCase() === 'teacher' || userData.role === "O'qituvchi")) {
            setInitialRoute('TeacherDashboard');
            setInitialParams({
              user: userData,
              language: userData.language || 'uz'
            });
          } else {
            setInitialRoute('StudentDashboard');
            setInitialParams({
              user: userData,
              language: userData.language || 'uz',
              selectedChar: charIndex,
              gender: gender
            });
          }
        }
      } catch (error) {
        console.error('Failed to check auth status', error);
      } finally {
        setAssetsLoaded(true);
        setIsReady(true);
      }
    }
    
    checkAuthStatus();
  }, []);

  let [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  const appIsReady = (fontsLoaded || fontError) && isReady;

  if (!appIsReady || !splashFinished) {
    return <AdvancedSplashScreen isAppReady={appIsReady} onFinish={() => setSplashFinished(true)} />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="StepOne" component={StepOneScreen} />
          <Stack.Screen name="StepTwo" component={StepTwoScreen} />
          <Stack.Screen name="AuthScreen" component={AuthScreen} />
          <Stack.Screen name="OtpScreen" component={OtpScreen} />
          <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
          <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
          <Stack.Screen name="StepThree" component={StepThreeScreen} />
          <Stack.Screen name="StepFour" component={StepFourScreen} />
          <Stack.Screen name="StepFive" component={StepFiveScreen} />
          <Stack.Screen name="StudentDashboard" component={StudentDashboardScreen} initialParams={initialRoute === 'StudentDashboard' ? initialParams : undefined} />
          <Stack.Screen name="TeacherDashboard" component={TeacherDashboardScreen} initialParams={initialRoute === 'TeacherDashboard' ? initialParams : undefined} />
          <Stack.Screen name="EnergyCenter" component={EnergyCenterScreen} />
        <Stack.Screen name="ReferralScreen" component={ReferralScreen} />
          <Stack.Screen name="OddiyHisobGame" component={OddiyHisobGameScreen} />
          <Stack.Screen name="AbacusSimulator" component={AbacusSimulatorScreen} />
          <Stack.Screen name="BattleSettings" component={BattleSettingsScreen} />
                    <Stack.Screen name="FriendInvite" component={FriendInviteScreen} />
<Stack.Screen name="BattleMatchmaking" component={BattleMatchmakingScreen} />
          <Stack.Screen name="BattleGame" component={BattleGameScreen} />
          <Stack.Screen name="BattleResult" component={BattleResultScreen} />
          <Stack.Screen name="MysteryBox" component={MysteryBoxScreen} />
        </Stack.Navigator>

        {/* Global Admin Action (Delete/Block) Alert Modal */}
        <Modal visible={!!deletedReason} transparent animationType="fade" onRequestClose={() => {}}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalIconContainer}>
                <MaterialCommunityIcons name="alert-decagram" size={60} color="#EF4444" />
              </View>
              <Text style={styles.modalTitle}>Diqqat!</Text>
              <Text style={styles.modalMessage}>{deletedReason}</Text>
              <TouchableOpacity 
                style={styles.modalButton} 
                activeOpacity={0.8}
                onPress={handleReturnHome}
              >
                <Text style={styles.modalButtonText}>Bosh sahifaga qaytish</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* GLOBAL INCOMING BATTLE INVITE TOP BANNER */}
        {battleInvite && (
          <Animated.View style={[styles.topAlertCard, { transform: [{ translateY: inviteSlideAnim }] }]}>
            <View style={styles.topAlertHeader}>
              <View style={styles.topAlertIconBox}>
                <MaterialCommunityIcons name="lightning-bolt" size={20} color="#FBBF24" />
              </View>
              <Text style={styles.topAlertTitle}>⚔️ BATTLE TAKLIFI ⚔️</Text>
            </View>
            <View style={styles.topAlertBody}>
              <Image 
                source={battleInvite?.senderAvatar ? { uri: battleInvite.senderAvatar } : require('./assets/avatar_alex.jpg')} 
                style={styles.topAlertAvatar} 
              />
              <View style={styles.topAlertUserInfo}>
                <Text style={styles.topAlertUserName}>{battleInvite?.senderName || 'Foydalanuvchi'}</Text>
                <Text style={styles.topAlertUserStats}>Level {battleInvite?.level || 1} • Rating {battleInvite?.rating || 1000}</Text>
              </View>
            </View>
            <View style={styles.topAlertButtonsRow}>
              <TouchableOpacity style={styles.topAlertRejectBtn} onPress={() => handleRespondInvite('REJECTED')}>
                <MaterialCommunityIcons name="close" size={16} color="#FFF" style={{ marginRight: 4 }} />
                <Text style={styles.topAlertRejectText}>Yopish</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.topAlertAcceptBtn} onPress={() => handleRespondInvite('ACCEPTED')}>
                <MaterialCommunityIcons name="sword-cross" size={16} color="#FFF" style={{ marginRight: 4 }} />
                <Text style={styles.topAlertAcceptText}>Qabul qilish ({inviteTimer}s)</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* GLOBAL REJECTION ALERT TOP BANNER */}
        {rejectionAlert && (
          <Animated.View style={[styles.rejectionAlertCard, { transform: [{ translateY: rejectionSlideAnim }] }]}>
            <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#EF4444" style={{ marginRight: 10 }} />
            <Text style={styles.rejectionAlertText}>{rejectionAlert}</Text>
            <TouchableOpacity onPress={() => {
              Animated.timing(rejectionSlideAnim, { toValue: -200, duration: 250, useNativeDriver: true }).start(() => setRejectionAlert(null));
            }}>
              <MaterialCommunityIcons name="close" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 5, 12, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#12121D',
    borderRadius: 24,
    padding: 30,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  modalIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 26,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: '#EF4444',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topAlertCard: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: '#0F0F24',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#A855F7',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 25,
    zIndex: 99999,
  },
  topAlertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  topAlertIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  topAlertTitle: {
    color: '#FBBF24',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
  topAlertBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 10,
    borderRadius: 14,
  },
  topAlertAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#3B82F6',
    marginRight: 12,
  },
  topAlertUserInfo: {
    flex: 1,
  },
  topAlertUserName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  topAlertUserStats: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '500',
  },
  topAlertButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topAlertRejectBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  topAlertRejectText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700',
  },
  topAlertAcceptBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  topAlertAcceptText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  rejectionAlertCard: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: '#12121D',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 20,
    zIndex: 99999,
  },
  rejectionAlertText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
});
