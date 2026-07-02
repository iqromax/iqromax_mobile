import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, StatusBar, Platform } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function StepOneScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05050C" />
      
      {/* Main Background */}
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.stepText}>STEP 1</Text>
          <View style={styles.pagination}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Image 
            source={require('../assets/hero.png')} 
            style={styles.heroImage}
            contentFit="contain"
            transition={200}
          />
        </View>

        {/* Features Row */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureBox}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="brain" size={36} color="#c084fc" />
            </View>
            <Text style={styles.featureTitle}>MIND & LOGIC</Text>
            <Text style={styles.featureDesc}>Boosts logic</Text>
          </View>
          
          <View style={[styles.featureBox, styles.featureBoxCenter]}>
            <View style={styles.iconContainer}>
              <Ionicons name="flash" size={36} color="#3b82f6" />
            </View>
            <Text style={styles.featureTitle}>FAST THINKING</Text>
            <Text style={styles.featureDesc}>Develops speed</Text>
          </View>
          
          <View style={styles.featureBox}>
            <View style={styles.iconContainer}>
              <Ionicons name="stats-chart" size={36} color="#f59e0b" />
            </View>
            <Text style={styles.featureTitle}>RESULTS</Text>
            <Text style={styles.featureDesc}>Improves</Text>
          </View>
        </View>
      </View>

      {/* Next Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.8} 
          onPress={() => {
            requestAnimationFrame(() => {
              navigation.navigate('StepTwo');
            });
          }}
        >
          <Text style={styles.buttonText}>NEXT</Text>
          <MaterialCommunityIcons name="chevron-right" size={28} color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05050C',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 0 : 20,
  },
  header: {
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? -10 : 30,
    marginBottom: Platform.OS === 'android' ? 10 : 20,
    zIndex: 10,
  },
  stepText: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'android' ? 16 : 14,
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: 1,
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333344',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#A855F7', // Purple indicator
  },
  heroContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    zIndex: 1,
    transform: Platform.OS === 'android' ? [{ scale: 0.95 }, { translateY: -10 }] : [],
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0A0A16',
    borderRadius: 16,
    padding: Platform.OS === 'android' ? 10 : 16,
    borderWidth: 1,
    borderColor: '#1A1A2E',
    marginBottom: 24,
  },
  featureBox: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  featureBoxCenter: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#1A1A2E',
  },
  iconContainer: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureTitle: {
    color: '#FFFFFF',
    fontSize: Platform.OS === 'android' ? 9 : 10,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDesc: {
    color: '#888899',
    fontSize: Platform.OS === 'android' ? 8 : 9,
    textAlign: 'center',
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#05050C',
  },
  button: {
    backgroundColor: '#FACC15',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 4,
  },
});
