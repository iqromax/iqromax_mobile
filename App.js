import { Asset } from 'expo-asset';
import React, { useState, useEffect } from 'react';
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

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_900Black } from '@expo-google-fonts/inter';

const Stack = createNativeStackNavigator();

export default function App() {
  
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    async function loadAssets() {
      try {
        await Asset.loadAsync([
          require('./assets/avatar_alex.jpg'),
          require('./assets/avatar_david.jpg'),
          require('./assets/avatar_emma.jpg'),
          require('./assets/avatar_kevin.png'),
          require('./assets/avatar_lily.jpg'),
          require('./assets/avatar_maks.png'),
          require('./assets/avatar_maya.jpg'),
          require('./assets/avatar_sophia.png'),
          require('./assets/character_bg.png'),
          require('./assets/info_card_bg.png'),
          require('./assets/space_bg.jpg'),
          require('./assets/yangi_1.png'),
          require('./assets/yangi_2.png'),
          require('./assets/yangi_3.png'),
          require('./assets/yangi_4.png'),
          require('./assets/yangi_5.png'),
          require('./assets/yangi_6.png'),
          require('./assets/yangi_7.png'),
          require('./assets/yangi_8.png'),
          require('./assets/yangi_9.png'),
          require('./assets/yangi_10.png'),
          require('./assets/yutuq_1.png'),
          require('./assets/yutuq_2.png'),
          require('./assets/yutuq_3.png'),
          require('./assets/yutuq_4.png'),
          require('./assets/yutuq_5.png'),
          require('./assets/yutuq_6.png'),
          require('./assets/yutuq_7.png'),
          require('./assets/yutuq_8.png'),
          require('./assets/yutuq_9.png'),
          require('./assets/yutuq_10.png'),
          require('./assets/yutuq_11.png'),
          require('./assets/yutuq_12.png'),
          require('./assets/lightning_energy.png'),
          require('./assets/s_coin.png'),
          require('./assets/gold_frame.png'),
          require('./assets/gold_star.png'),
          require('./assets/stat_icon_1.png'),
          require('./assets/stat_icon_2.png'),
          require('./assets/stat_icon_3.png'),
          require('./assets/stat_icon_4.png')
        ]);
      } catch (e) {
        console.warn(e);
      } finally {
        setAssetsLoaded(true);
      }
    }
    loadAssets();
  }, []);

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  if (!fontsLoaded || !assetsLoaded) {
    return null;
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
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
