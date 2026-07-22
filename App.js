import { Asset } from 'expo-asset';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Image, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
import BattleResultScreen from './screens/BattleResultScreen';


import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_900Black } from '@expo-google-fonts/inter';

const Stack = createNativeStackNavigator();

export default function App() {
  
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [initialRoute, setInitialRoute] = useState('StepOne');
  const [initialParams, setInitialParams] = useState({});
  const [isReady, setIsReady] = useState(false);

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
      <NavigationContainer>
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
          <Stack.Screen name="BattleMatchmaking" component={BattleMatchmakingScreen} />
          <Stack.Screen name="BattleGame" component={BattleGameScreen} />
          <Stack.Screen name="BattleResult" component={BattleResultScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
