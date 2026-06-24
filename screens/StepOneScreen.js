import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, Dimensions, StatusBar, Platform } from 'react-native';
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
            resizeMode="contain"
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
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => navigation.navigate('StepTwo')}>
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
    paddingBottom: 100, // leave space for absolute button
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  stepText: {
    color: '#FFFFFF',
    fontSize: 14,
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
    width: width * 0.95,
    height: width * 1.15,
    zIndex: 1,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0A0A16',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1A1A2E',
    marginBottom: 24,
  },
  featureBox: {
    flex: 1,
    alignItems: 'center',
  },
  featureBoxCenter: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#1A1A2E',
    paddingHorizontal: 10,
  },
  iconContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDesc: {
    color: '#888899',
    fontSize: 9,
    textAlign: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
