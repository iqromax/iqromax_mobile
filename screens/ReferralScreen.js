import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Share,
  Linking,
  Dimensions,
  Animated,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { API_URL } from '../src/config/api';

const { width } = Dimensions.get('window');

export default function ReferralScreen({ navigation }) {
  const [referralId, setReferralId] = useState('IQX000000');
  const [referralLink, setReferralLink] = useState('https://iqromax.app/r/IQX000000');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    loadData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadData = async () => {
    try {
      const dataStr = await AsyncStorage.getItem('user_data');
      if (dataStr) {
        const data = JSON.parse(dataStr);
        // Using real customId (e.g. #576347) but formatting for Link (IQX576347)
        const idNumber = String(data.customId || data.id || '000000').replace(/[^0-9]/g, '');
        const refId = `IQX${idNumber}`;
        setReferralId(refId);
        setReferralLink(`https://iqromax.app/r/${refId}`);
        
        // Fetch real history
        fetchHistory(data.customId);
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const fetchHistory = async (customId) => {
    try {
      const res = await fetch(`${API_URL}/referrals/${encodeURIComponent(customId)}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (error) {
      console.log('Failed to fetch referrals', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(referralId); // Users might just want to copy the code: IQX576347
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = async () => {
    try {
      await Share.share({
        message: `Ergashboy sizni IQROMAX ga taklif qildi!\n\n🎁 Bonus: 2 Energy\n\nTaklif kodi: ${referralId}\nKiring: ${referralLink}`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const openApp = (appUrl, fallbackUrl) => {
    Linking.canOpenURL(appUrl).then((supported) => {
      if (supported) {
        Linking.openURL(appUrl);
      } else {
        Linking.openURL(fallbackUrl);
      }
    });
  };

  const shareTelegram = () => {
    const text = `Men sizni IQROMAX ga taklif qilaman! Ro'yxatdan o'tishda Taklif kodi sifatida ${referralId} ni kiriting va Bonus oling!\nKiring: ${referralLink}`;
    openApp(`tg://msg?text=${encodeURIComponent(text)}`, `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`);
  };

  const shareWhatsApp = () => {
    const text = `Men sizni IQROMAX ga taklif qilaman! Ro'yxatdan o'tishda Taklif kodi sifatida ${referralId} ni kiriting va Bonus oling!\nKiring: ${referralLink}`;
    openApp(`whatsapp://send?text=${encodeURIComponent(text)}`, `https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  const renderHistoryItem = (item) => {
    const isActive = item.status === 'ACTIVE';
    return (
      <View key={item.id} style={styles.historyCard}>
        <LinearGradient
          colors={isActive ? ['rgba(16, 185, 129, 0.1)', 'transparent'] : ['rgba(255, 255, 255, 0.02)', 'transparent']}
          style={StyleSheet.absoluteFill}
          borderRadius={16}
        />
        <View style={styles.historyLeft}>
          <View style={[styles.historyAvatar, { backgroundColor: isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)' }]}>
            <Ionicons name="person" size={20} color={isActive ? "#10B981" : "#F59E0B"} />
          </View>
          <View>
            <Text style={styles.historyName}>{item.name}</Text>
            <Text style={styles.historyStatusText}>
              {isActive ? "✅ Faol (Tasdiqlangan)" : "⏳ Kutilmoqda (Shart bajarilmagan)"}
            </Text>
          </View>
        </View>
        <Text style={[styles.historyReward, { color: isActive ? '#FBBF24' : '#6B7280' }]}>
          {item.reward}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#05050C" />
      
      {/* Background Ambient Glow */}
      <View style={styles.ambientGlowTop} />
      <View style={styles.ambientGlowBottom} />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Do'stlarni taklif qiling</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }}>
          
          {/* Main Info Card */}
          <LinearGradient
            colors={['#1F103A', '#0D061F']}
            style={styles.infoBox}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.sparkleIcon}>
              <MaterialCommunityIcons name="star-four-points" size={20} color="#FBBF24" />
            </View>
            <Text style={styles.infoTitle}>Har bir faol do'st uchun</Text>
            <View style={styles.rewardBadge}>
              <MaterialCommunityIcons name="lightning-bolt" size={32} color="#FBBF24" />
              <Text style={styles.rewardText}>+1 Energy</Text>
            </View>
            <Text style={styles.infoSubtext}>
              Do'stingiz ilovadan ro'yxatdan o'tayotganda sizning Taklif kodingizni kiritishi kerak.
            </Text>
          </LinearGradient>

          {/* Referral Code & Copy */}
          <View style={styles.linkContainer}>
            <Text style={styles.sectionLabel}>Sizning Taklif Kodingiz (Referral Code)</Text>
            <View style={styles.linkRow}>
              <View style={styles.linkField}>
                <Text style={styles.linkText} numberOfLines={1}>{referralId}</Text>
              </View>
              <TouchableOpacity style={styles.copyBtn} onPress={copyToClipboard} activeOpacity={0.7}>
                {copied ? (
                  <Ionicons name="checkmark-done" size={24} color="#10B981" />
                ) : (
                  <Ionicons name="copy-outline" size={24} color="#C084FC" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* QR Code */}
          <View style={styles.qrContainer}>
            <View style={styles.qrWrapper}>
              <LinearGradient
                colors={['#A855F7', '#6366F1']}
                style={styles.qrGradientBorder}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.qrBg}>
                  <QRCode
                    value={referralLink}
                    size={150}
                    color="#000000"
                    backgroundColor="#FFFFFF"
                  />
                </View>
              </LinearGradient>
            </View>
            <Text style={styles.qrSubtext}>Kamerani yo'naltiring (Scan)</Text>
          </View>

          {/* Share Buttons */}
          <Text style={[styles.sectionLabel, { textAlign: 'center', marginTop: 10 }]}>Tezkor ulashish</Text>
          <View style={styles.shareRow}>
            <TouchableOpacity style={[styles.shareBtn, { backgroundColor: '#2CA5E0' }]} onPress={shareTelegram} activeOpacity={0.8}>
              <FontAwesome5 name="telegram-plane" size={26} color="#FFF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.shareBtn, { backgroundColor: '#25D366' }]} onPress={shareWhatsApp} activeOpacity={0.8}>
              <FontAwesome5 name="whatsapp" size={28} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.shareBtn, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]} onPress={shareLink} activeOpacity={0.8}>
              <Ionicons name="share-social" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Referral History */}
          <View style={styles.historyHeaderRow}>
            <Text style={styles.sectionTitle}>Taklif qilganlar</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{history.length}</Text>
            </View>
          </View>

          <View style={styles.historyContainer}>
            {isLoading ? (
              <ActivityIndicator color="#A855F7" style={{ marginVertical: 30 }} />
            ) : history.length > 0 ? (
              history.map(renderHistoryItem)
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={48} color="rgba(255,255,255,0.2)" />
                <Text style={styles.emptyText}>Hali hech kimni taklif qilmadingiz</Text>
                <Text style={styles.emptySubtext}>Kodingizni ulashing va mukofot oling!</Text>
              </View>
            )}
          </View>

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#05050C',
  },
  ambientGlowTop: {
    position: 'absolute',
    top: -100,
    left: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    filter: 'blur(80px)',
  },
  ambientGlowBottom: {
    position: 'absolute',
    bottom: -150,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    filter: 'blur(100px)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  infoBox: {
    alignItems: 'center',
    borderRadius: 24,
    padding: 30,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.4)',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  sparkleIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    opacity: 0.6,
  },
  infoTitle: {
    color: '#D8B4FE',
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  rewardText: {
    color: '#FBBF24',
    fontSize: 26,
    fontFamily: 'Inter_800ExtraBold',
    fontWeight: '900',
    marginLeft: 10,
  },
  infoSubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionLabel: {
    color: '#E5E7EB',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  linkContainer: {
    marginBottom: 30,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    paddingRight: 6,
  },
  linkField: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  linkText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
  },
  copyBtn: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  qrWrapper: {
    marginBottom: 16,
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 15,
  },
  qrGradientBorder: {
    padding: 3,
    borderRadius: 28,
  },
  qrBg: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 25,
  },
  qrSubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  shareRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 35,
  },
  shareBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 30,
  },
  historyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    fontWeight: 'bold',
  },
  countBadge: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.5)',
  },
  countText: {
    color: '#D8B4FE',
    fontWeight: 'bold',
    fontSize: 14,
  },
  historyContainer: {
    gap: 12,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  historyName: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
    marginBottom: 4,
  },
  historyStatusText: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  historyReward: {
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
    fontWeight: '800',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  emptyText: {
    color: '#E5E7EB',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});
