import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, TextInput, ScrollView, StatusBar, KeyboardAvoidingView, Platform, Animated, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../src/config/api';

const CustomAnimatedInput = ({ icon, rightIcon, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#1A1A2E', '#A855F7'] // From dark to purple
  });
  
  const borderWidth = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5] // Subtle thickness increase
  });

  return (
    <Animated.View style={[styles.inputContainer, { borderColor, borderWidth }]}>
      {icon}
      <TextInput
        style={styles.input}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {rightIcon}
    </Animated.View>
  );
};

export default function AuthScreen({ navigation, route }) {
  const { role = 'student' } = route.params || {};
  const [activeTab, setActiveTab] = useState('login'); // 'register' or 'login'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthAction = async () => {
    if (activeTab === 'register') {
      if (!name.trim() || !phone.trim() || !email.trim() || !password || !confirmPassword) {
        Alert.alert('Xatolik', 'Iltimos, barcha maydonlarni to\'ldiring!');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Xatolik', 'Parollar mos kelmadi!');
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/auth/send-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.trim(), name: name.trim() }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Move to OTP screen
          navigation.navigate('OtpScreen', {
            role,
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            password: password,
          });
        } else {
          Alert.alert('Xatolik', data.error || 'Server xatosi yuz berdi');
        }
      } catch (error) {
        Alert.alert('Xatolik', 'Tarmoqqa ulanib bo\'lmadi. Internetni tekshiring.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }

    } else {
      // Login logic
      if (!phone.trim() || !password) {
        Alert.alert('Xatolik', 'Iltimos, telefon raqami va parolni kiriting!');
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: phone.trim(), password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Detect character index if possible
          let charIndex = 0;
          let gender = 'boys';
          const boysChars = ["Max", "Sam", "Leo", "Ray"];
          const girlsChars = ["Mia", "Zoe", "Eva", "Lily"];
          
          if (data.user && data.user.character) {
             if (boysChars.includes(data.user.character)) {
               charIndex = boysChars.indexOf(data.user.character);
               gender = 'boys';
             } else if (girlsChars.includes(data.user.character)) {
               charIndex = girlsChars.indexOf(data.user.character);
               gender = 'girls';
             }
          }

          // Save session
          try {
            await AsyncStorage.setItem('user_data', JSON.stringify(data.user));
          } catch (e) {
            console.error('AsyncStorage error', e);
          }

          // Reset navigation and go to StudentDashboard with full user data
          navigation.reset({
            index: 0,
            routes: [{ 
              name: 'StudentDashboard', 
              params: { 
                user: data.user,
                language: data.user.language || 'uz',
                selectedChar: charIndex,
                gender: gender
              } 
            }]
          });
        } else {
          Alert.alert('Xatolik', data.error || 'Tizimga kirishda xatolik yuz berdi');
        }
      } catch (error) {
        Alert.alert('Xatolik', "Tarmoqqa ulanib bo'lmadi. Internetni tekshiring.");
        console.error('Login error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05050C" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero Image with Text */}
          <View style={styles.heroContainer}>
            <Image 
              source={
                activeTab === 'login' 
                  ? require('../assets/auth_hero_with_text.jpg') 
                  : (role === 'parent' ? require('../assets/auth_hero_parent.jpg') : (role === 'teacher' ? require('../assets/auth_hero_teacher.jpg') : require('../assets/register_hero_with_text.jpg')))
              } 
              style={styles.heroImage} 
              resizeMode="contain" 
            />
          </View>

          {/* Custom Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'register' && styles.tabActive]}
              onPress={() => setActiveTab('register')}
              activeOpacity={0.8}
            >
              <Feather name="user-plus" size={16} color={activeTab === 'register' ? '#FFF' : '#888899'} style={styles.tabIcon} />
              <Text style={[styles.tabText, activeTab === 'register' && styles.tabTextActive]}>
                Create account
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'login' && styles.tabActive]}
              onPress={() => setActiveTab('login')}
              activeOpacity={0.8}
            >
              <Feather name="log-in" size={16} color={activeTab === 'login' ? '#FFF' : '#888899'} style={styles.tabIcon} />
              <Text style={[styles.tabText, activeTab === 'login' && styles.tabTextActive]}>
                Login
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          {activeTab === 'register' && (
            <CustomAnimatedInput
              icon={<Feather name="user" size={18} color="#888899" style={styles.inputIcon} />}
              placeholder="Your name"
              placeholderTextColor="#555566"
              value={name}
              onChangeText={setName}
            />
          )}

          <CustomAnimatedInput
            icon={<Feather name="phone" size={18} color="#888899" style={styles.inputIcon} />}
            placeholder="Your phone number"
            placeholderTextColor="#555566"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          {activeTab === 'register' && (
            <CustomAnimatedInput
              icon={<Feather name="mail" size={18} color="#888899" style={styles.inputIcon} />}
              placeholder="Your email"
              placeholderTextColor="#555566"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          )}

          <CustomAnimatedInput
            icon={<Feather name="lock" size={18} color="#888899" style={styles.inputIcon} />}
            placeholder="Your password"
            placeholderTextColor="#555566"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Feather name={showPassword ? "eye" : "eye-off"} size={18} color="#888899" />
              </TouchableOpacity>
            }
          />

          {activeTab === 'register' && (
            <CustomAnimatedInput
              icon={<Feather name="lock" size={18} color="#888899" style={styles.inputIcon} />}
              placeholder="Confirm password"
              placeholderTextColor="#555566"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              rightIcon={
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                  <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={18} color="#888899" />
                </TouchableOpacity>
              }
            />
          )}

          {activeTab === 'login' && (
            <TouchableOpacity 
              style={styles.forgotPasswordContainer} 
              activeOpacity={0.7}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          {/* Main Button */}
          <TouchableOpacity 
            style={[
              styles.loginButton, 
              activeTab === 'register' && { marginTop: 8 },
              ((activeTab === 'register' ? (!name || !phone || !email || !password || !confirmPassword) : (!phone || !password)) || isLoading) && { opacity: 0.5 }
            ]} 
            activeOpacity={0.8}
            onPress={handleAuthAction}
            disabled={activeTab === 'register' ? (!name || !phone || !email || !password || !confirmPassword) : (!phone || !password) || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.loginButtonText}>{activeTab === 'login' ? 'Login' : 'Create Account'}</Text>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#FFF" />
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <MaterialCommunityIcons name="shield-check-outline" size={16} color="#22C55E" />
            <Text style={styles.footerText}>Your data is reliably protected</Text>
          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05050C',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingVertical: Platform.OS === 'android' ? 0 : 10,
    paddingHorizontal: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0A0A16',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroContainer: {
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? -30 : -10,
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: 320,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#0A0A16',
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#3B0764',
  },
  tabIcon: {
    marginRight: 8,
  },
  tabText: {
    color: '#888899',
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A16',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1A1A2E',
    height: 56,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#A855F7',
    fontSize: 13,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#6D28D9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 24,
    marginTop: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1A1A2E',
  },
  dividerText: {
    color: '#555566',
    paddingHorizontal: 12,
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  footerText: {
    color: '#555566',
    fontSize: 12,
    marginLeft: 6,
  },
});
