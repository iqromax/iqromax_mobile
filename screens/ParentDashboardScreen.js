import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function ParentDashboardScreen({ navigation, route }) {
  const { user, language = 'uz' } = route.params || {};

  const handleReturnToHome = async () => {
    try {
      await AsyncStorage.removeItem('user_data');
    } catch (e) {}
    navigation.reset({
      index: 0,
      routes: [{ name: 'StepOne', params: { language } }]
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05050C" />

      {/* TOP HEADER */}
      <LinearGradient colors={['#1F1035', '#090914']} style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarBox}>
            <LinearGradient colors={['#A855F7', '#7C3AED']} style={styles.avatarGradient}>
              <MaterialCommunityIcons name="account-child-circle" size={26} color="#FFFFFF" />
            </LinearGradient>
          </View>
          <View>
            <Text style={styles.roleBadgeText}>OTA-ONA PORTALI</Text>
            <Text style={styles.userName}>{user?.name || "Ota-ona"}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8} onPress={handleReturnToHome}>
          <Feather name="log-out" size={18} color="#F87171" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* SUCCESS WELCOME CARD */}
        <View style={styles.heroCard}>
          <LinearGradient colors={['rgba(168, 85, 247, 0.2)', 'rgba(168, 85, 247, 0.05)']} style={styles.heroGradient}>
            <MaterialCommunityIcons name="check-decagram" size={48} color="#10B981" style={{ marginBottom: 10 }} />
            <Text style={styles.heroTitle}>Tizimga kirdingiz! 🎉</Text>
            <Text style={styles.heroSub}>
              Xush kelibsiz, {user?.name || "Ota-ona"}! Farzandingizning o'qish jarayoni, bajargan mashqlari va erishgan natijalarini bu yerda kuzatib borishingiz mumkin.
            </Text>
          </LinearGradient>
        </View>

        {/* QUICK STATS CARDS */}
        <Text style={styles.sectionTitle}>Farzand Rivojlanishi</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="brain" size={28} color="#A855F7" />
            <Text style={styles.statNum}>0</Text>
            <Text style={styles.statLabel}>Bajarilgan mashqlar</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialCommunityIcons name="target" size={28} color="#10B981" />
            <Text style={styles.statNum}>100%</Text>
            <Text style={styles.statLabel}>O'rtacha aniqlik</Text>
          </View>
        </View>

        {/* INFO NOTICE */}
        <View style={styles.noticeCard}>
          <Ionicons name="information-circle-outline" size={24} color="#3B82F6" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.noticeTitle}>Farzandni biriktirish</Text>
            <Text style={styles.noticeDesc}>
              Tez orada farzandingizning IQROMAX ID raqami orqali uning hisobini bu yerga ulashingiz va kunlik reytingini kuzatishingiz mumkin bo'ladi.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#05050C' },
  topHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(168, 85, 247, 0.2)'
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarBox: {
    width: 44, height: 44, borderRadius: 22, overflow: 'hidden',
    borderWidth: 1.5, borderColor: '#A855F7'
  },
  avatarGradient: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  roleBadgeText: { color: '#A855F7', fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 0.8 },
  userName: { color: '#FFFFFF', fontSize: 17, fontFamily: 'Inter_700Bold', marginTop: 2 },
  logoutBtn: { padding: 9, borderRadius: 12, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
  scrollContent: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  heroCard: { borderRadius: 24, overflow: 'hidden', marginBottom: 20, borderWidth: 1.5, borderColor: '#A855F7' },
  heroGradient: { padding: 24, alignItems: 'center', textAlign: 'center' },
  heroTitle: { color: '#FFFFFF', fontSize: 22, fontFamily: 'Inter_700Bold', marginBottom: 8, textAlign: 'center' },
  heroSub: { color: '#D1D5DB', fontSize: 14, lineHeight: 20, textAlign: 'center' },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontFamily: 'Inter_700Bold', marginBottom: 12 },
  statsGrid: { flexDirection: 'row', gap: 14, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: '#0D0D1F', borderRadius: 18, padding: 18,
    alignItems: 'center', borderWidth: 1, borderColor: '#1A1A35'
  },
  statNum: { color: '#FFFFFF', fontSize: 22, fontFamily: 'Inter_700Bold', marginTop: 8 },
  statLabel: { color: '#9CA3AF', fontSize: 11, textAlign: 'center', marginTop: 4, fontFamily: 'Inter_500Medium' },
  noticeCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#0D0D1F',
    padding: 16, borderRadius: 18, borderWidth: 1, borderColor: '#1A1A35', marginBottom: 30
  },
  noticeTitle: { color: '#FFFFFF', fontSize: 14, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  noticeDesc: { color: '#9CA3AF', fontSize: 12, lineHeight: 17 }
});
