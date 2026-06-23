import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, TextInput, ScrollView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000214" />
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
          {/* Hero Image */}
          <View style={styles.heroContainer}>
            <Image 
              source={require('../assets/forgot_password_hero.jpg')} 
              style={styles.heroImage} 
              resizeMode="contain" 
            />
          </View>

          {/* Titles removed as they are in the image */}

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Feather name="mail" size={18} color="#888899" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Your email"
              placeholderTextColor="#555566"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Spacer to push everything else up, leaving footer at the bottom if screen is tall */}
          <View style={styles.spacer} />

          {/* Main Button */}
          <TouchableOpacity 
            style={styles.sendButton} 
            activeOpacity={0.8}
            onPress={() => {
              // Add send code logic here
              navigation.goBack();
            }}
          >
            <Text style={styles.sendButtonText}>Send code</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#FFF" />
          </TouchableOpacity>

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
    backgroundColor: '#000214',
  },
  header: {
    paddingVertical: 10,
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
    marginTop: 0,
    marginBottom: 30,
  },
  heroImage: {
    width: '100%',
    height: 380,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  titleHighlight: {
    color: '#6D28D9', // Purple
  },
  subtitle: {
    color: '#888899',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 40,
    lineHeight: 22,
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
    marginBottom: 30,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },
  spacer: {
    flex: 1,
    minHeight: 20,
  },
  sendButton: {
    backgroundColor: '#6D28D9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 24,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  footerText: {
    color: '#555566',
    fontSize: 12,
    marginLeft: 6,
  },
});
