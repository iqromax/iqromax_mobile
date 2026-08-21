import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function TeacherDashboardScreen({ navigation, route }) {
  const { user, language = 'uz' } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05050C" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={styles.avatarBox}>
            <Feather name="user-check" size={24} color="#A855F7" />
          </View>
          <View>
            <Text style={styles.welcomeText}>Xush kelibsiz,</Text>
            <Text style={styles.userName}>{user?.name || "O'qituvchi"}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'StepTwo', params: { language } }] })}
        >
          <Feather name="log-out" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Main Empty Content Placeholder */}
      <View style={styles.content}>
        <View style={styles.emptyCard}>
          <Feather name="layout" size={48} color="#A855F7" style={{ marginBottom: 16 }} />
          <Text style={styles.emptyTitle}>O'qituvchi Bosh Sahifasi</Text>
          <Text style={styles.emptySubtitle}>Ushbu bo'lim tez orada yangi funksiyalar bilan to'ldiriladi.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05050C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A2E',
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A855F7',
  },
  welcomeText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  logoutBtn: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyCard: {
    width: '100%',
    backgroundColor: '#0D0D1A',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A40',
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
