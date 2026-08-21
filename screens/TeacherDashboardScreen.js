import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Modal } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import { API_URL } from '../src/config/api';

const SOCKET_SERVER_URL = API_URL.replace(/\/api\/?$/, '');

export default function TeacherDashboardScreen({ navigation, route }) {
  const { user, language = 'uz' } = route.params || {};
  const [isDeletedModalVisible, setIsDeletedModalVisible] = useState(false);

  useEffect(() => {
    if (!user || !user.id) return;

    // Connect socket for real-time account deletion event
    const socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      forceNew: true
    });

    socket.on('connect', () => {
      console.log('Teacher Dashboard Socket Connected:', socket.id);
    });

    socket.on('user_deleted', (deletedData) => {
      if (
        deletedData.id === user.id ||
        (deletedData.customId && user.customId && deletedData.customId.toUpperCase() === user.customId.toUpperCase())
      ) {
        setIsDeletedModalVisible(true);
      }
    });

    // Fallback periodic check every 3 seconds
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/user/status/${user.id}`);
        if (res.status === 444 || (res.ok && (await res.json()).exists === false)) {
          setIsDeletedModalVisible(true);
        }
      } catch (e) {}
    }, 3000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, [user]);

  const handleReturnToHome = async () => {
    try {
      await AsyncStorage.removeItem('user_data');
    } catch (e) {}
    navigation.reset({
      index: 0,
      routes: [{ name: 'StepTwo', params: { language } }]
    });
  };

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
          onPress={handleReturnToHome}
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

      {/* REAL-TIME ACCOUNT DELETED ALERT MODAL */}
      <Modal visible={isDeletedModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconBox}>
              <MaterialCommunityIcons name="account-remove-outline" size={40} color="#EF4444" />
            </View>

            <Text style={styles.modalTitleText}>
              Hisobingiz O'chirildi
            </Text>

            <Text style={styles.modalDescText}>
              Sizning hisobingiz admin tomonidan o'chirildi. Qo'shimcha ma'lumot uchun admin bilan bog'laning.
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modalCloseBtn}
              onPress={handleReturnToHome}
            >
              <MaterialCommunityIcons name="home-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.modalCloseBtnText}>Bosh sahifaga qaytish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 5, 12, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#0D0D1A',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 16,
  },
  modalIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#EF4444',
  },
  modalTitleText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalDescText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  modalCloseBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  modalCloseBtnText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
});
