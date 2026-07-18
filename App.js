import { Asset } from 'expo-asset';
import React, { useState, useEffect } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StepOneScreen from './screens/StepOneScreen';
import StepTwoScreen from './screens/StepTwoScreen';
import AuthScreen from './screens/AuthScreen';
import StepThreeScreen from './screens/StepThreeScreen';
import StepFourScreen from './screens/StepFourScreen';
import StepFiveScreen from './screens/StepFiveScreen';
import StudentDashboardScreen from './screens/StudentDashboardScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import OddiyHisobGameScreen from './screens/OddiyHisobGameScreen';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_900Black } from '@expo-google-fonts/inter';

const Stack = createNativeStackNavigator();

export default function App() {
  
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    // Assets are now lazily loaded when components render to speed up startup time
    setAssetsLoaded(true);
  }, []);

  let [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  if (!fontsLoaded && !fontError) {
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
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="StepOne" component={StepOneScreen} />
          <Stack.Screen name="StepTwo" component={StepTwoScreen} />
          <Stack.Screen name="AuthScreen" component={AuthScreen} />
          <Stack.Screen name="StepThree" component={StepThreeScreen} />
          <Stack.Screen name="StepFour" component={StepFourScreen} />
          <Stack.Screen name="StepFive" component={StepFiveScreen} />
          <Stack.Screen name="StudentDashboard" component={StudentDashboardScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="OddiyHisobGame" component={OddiyHisobGameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
