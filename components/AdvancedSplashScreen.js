import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';

const { height } = Dimensions.get('window');

export default function AdvancedSplashScreen({ isAppReady, onFinish }) {
  // Minimal kutish vaqti: Ilova juda tez yuklanib qolsa ham, 
  // zagruzka ekrani kamida 1.5 soniya ko'rinib turishi uchun
  const [minTimePassed, setMinTimePassed] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 300); // Fast 300ms minimal delay
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAppReady && minTimePassed) {
      if (onFinish) onFinish();
    }
  }, [isAppReady, minTimePassed, onFinish]);

  return (
    <View style={styles.container}>
      {/* 
        DIQQAT: Siz yuborgan ikkinchi rasmni 'assets' papkasiga 
        'splash_new.png' degan nom bilan saqlashingiz kerak!
      */}
      <Image 
        source={require('../assets/splash_new.jpg')} 
        style={styles.image} 
        resizeMode="contain" 
      />
      
      <View style={styles.loaderContainer}>
        {/* Dumaloq aylanuvchi zagruzka (spinner) */}
        <ActivityIndicator size="large" color="#FF9900" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050414', // Rasmdagi to'q ko'k/qora fon
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '85%',
    height: '85%',
    position: 'absolute',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: height * 0.15, // Pastki qismdan 15% tepada (birinchi rasmdagidek)
    alignItems: 'center',
    justifyContent: 'center',
  }
});
