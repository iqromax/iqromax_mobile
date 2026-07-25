import { Asset } from 'expo-asset';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Image, ActivityIndicator, Modal, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { io } from 'socket.io-client';
import { SOCKET_URL } from './src/config/api';
import StepOneScreen from './screens/StepOneScreen';
import StepTwoScreen from './screens/StepTwoScreen';
import AuthScreen from './screens/AuthScreen';
import OtpScreen from './screens/OtpScreen';
import StepThreeScreen from './screens/StepThreeScreen';
import StepFourScreen from './screens/StepFourScreen';
import StepFiveScreen from './screens/StepFiveScreen';
import StudentDashboardScreen from './screens/StudentDashboardScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import OddiyHisobGameScreen from './screens/OddiyHisobGameScreen';
import AbacusSimulatorScreen from './screens/AbacusSimulatorScreen';
import BattleSettingsScreen from './screens/BattleSettingsScreen';
import BattleMatchmakingScreen from './screens/BattleMatchmakingScreen';
import BattleGameScreen from './screens/BattleGameScreen';
import FriendInviteScreen from './screens/FriendInviteScreen';
import BattleResultScreen from './screens/BattleResultScreen';


import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_900Black } from '@expo-google-fonts/inter';

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

export default function App() {
  
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [initialRoute, setInitialRoute] = useState('StepOne');
  const [initialParams, setInitialParams] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [deletedReason, setDeletedReason] = useState(null);

  useEffect(() => {
    // Persistent root-level socket listener for real-time account deletion/blocking across ALL screens
    const socket = io(SOCKET_URL, { 
      path: '/api/socket.io',
      transports: ['websocket', 'polling'] 
    });

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
          if (currentUser && (
            (data && data.id && currentUser.id && String(data.id).trim() === String(currentUser.id).trim()) || 
            (data && data.customId && currentUser.customId && String(data.customId).trim().toUpperCase() === String(currentUser.customId).trim().toUpperCase())
          )) {
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
          if (currentUser && (
            (data && data.id && currentUser.id && String(data.id).trim() === String(currentUser.id).trim()) || 
            (data && data.customId && currentUser.customId && String(data.customId).trim().toUpperCase() === String(currentUser.customId).trim().toUpperCase())
          )) {
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

    return () => {
      socket.disconnect();
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

          setInitialRoute('StudentDashboard');
          setInitialParams({
            user: userData,
            language: userData.language || 'uz',
            selectedChar: charIndex,
            gender: gender
          });
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

  if ((!fontsLoaded && !fontError) || !isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('./assets/icon.png')} style={{ width: 150, height: 150, marginBottom: 30 }} resizeMode="contain" />
        <ActivityIndicator size="large" color="#FFC107" />
      </View>
    );
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
          <Stack.Screen name="OddiyHisobGame" component={OddiyHisobGameScreen} />
          <Stack.Screen name="AbacusSimulator" component={AbacusSimulatorScreen} />
          <Stack.Screen name="BattleSettings" component={BattleSettingsScreen} />
                    <Stack.Screen name="FriendInvite" component={FriendInviteScreen} />
<Stack.Screen name="BattleMatchmaking" component={BattleMatchmakingScreen} />
          <Stack.Screen name="BattleGame" component={BattleGameScreen} />
          <Stack.Screen name="BattleResult" component={BattleResultScreen} />
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
});
