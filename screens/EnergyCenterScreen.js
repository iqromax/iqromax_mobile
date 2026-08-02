import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, StatusBar, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function EnergyCenterScreen({ navigation }) {
  // In a real app, these values would come from a context or Redux store
  const currentEnergy = 2;
  const maxEnergy = 10;
  const coins = 12450;
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05050C" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="lightning-bolt" size={20} color="#FBBF24" />
              <Text style={styles.headerTitle}>ENERGIYA MARKAZI</Text>
            </View>
            <Text style={styles.headerSubtitle}>Mashqlarni boshlash uchun energiya kerak bo'ladi.</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerStatBadge}>
            <MaterialCommunityIcons name="lightning-bolt" size={16} color="#FBBF24" />
            <Text style={styles.headerStatText}>{currentEnergy} / {maxEnergy}</Text>
            <Ionicons name="add" size={14} color="#FFF" />
          </TouchableOpacity>

        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* TOP INFO ROW (Lightning + Energy Costs) */}
        <View style={styles.topInfoRow}>
          {/* MAIN ENERGY CARD */}
          <View style={styles.mainEnergyCard}>
            <View style={styles.mainEnergyTopRow}>
              <View style={styles.mainEnergyLeft}>
                <Image source={require('../assets/ec_lightning.png')} style={styles.mainLightningIcon} contentFit="contain" />
              </View>
              <View style={styles.mainEnergyRight}>
                <Text style={styles.energyBigText}>
                  <Text style={styles.energyBigValue}>{currentEnergy}</Text>
                  <Text style={styles.energyBigDivider}> / {maxEnergy}</Text>
                </Text>
                <Text style={styles.nextEnergyLabel}>Keyingi energiya:</Text>
                <View style={styles.timerRow}>
                  <MaterialCommunityIcons name="timer-outline" size={16} color="#FBBF24" />
                  <Text style={styles.timerText}>25:34</Text>
                </View>
                <Text style={styles.energyRecoveryInfo}>1 ta energiya tiklanish vaqti: 30 minut</Text>
              </View>
            </View>

            <View style={styles.energyDotsContainer}>
              {Array.from({ length: 10 }).map((_, i) => (
                <MaterialCommunityIcons 
                  key={i} 
                  name="lightning-bolt" 
                  size={20} 
                  color={i < currentEnergy ? "#FBBF24" : "#1E293B"} 
                />
              ))}
            </View>
            <Text style={styles.maxEnergyText}>Maksimum energiya: 10</Text>
          </View>

          {/* ENERGY COSTS PANEL */}
          <View style={styles.costsPanel}>
            <Text style={styles.costsTitle}>ENERGIYA NIMA BERADI?</Text>
            <View style={styles.costItemRow}>
              <View style={styles.costItemLeft}>
                <MaterialCommunityIcons name="calculator" size={16} color="#3B82F6" />
                <Text style={styles.costItemText}>Oddiy hisob</Text>
              </View>
              <View style={styles.costItemRight}>
                <MaterialCommunityIcons name="lightning-bolt" size={14} color="#FBBF24" />
                <Text style={styles.costItemValue}>1</Text>
              </View>
            </View>
            <View style={styles.costItemRow}>
              <View style={styles.costItemLeft}>
                <MaterialCommunityIcons name="abacus" size={16} color="#F59E0B" />
                <Text style={styles.costItemText}>Abakus</Text>
              </View>
              <View style={styles.costItemRight}>
                <MaterialCommunityIcons name="lightning-bolt" size={14} color="#FBBF24" />
                <Text style={styles.costItemValue}>1</Text>
              </View>
            </View>
            <View style={styles.costItemRow}>
              <View style={styles.costItemLeft}>
                <MaterialCommunityIcons name="timer-outline" size={16} color="#10B981" />
                <Text style={styles.costItemText}>Tezkor hisob</Text>
              </View>
              <View style={styles.costItemRight}>
                <MaterialCommunityIcons name="lightning-bolt" size={14} color="#FBBF24" />
                <Text style={styles.costItemValue}>2</Text>
              </View>
            </View>
            <View style={styles.costItemRow}>
              <View style={styles.costItemLeft}>
                <MaterialCommunityIcons name="target" size={16} color="#EF4444" />
                <Text style={styles.costItemText}>Battle</Text>
              </View>
              <View style={styles.costItemRight}>
                <MaterialCommunityIcons name="lightning-bolt" size={14} color="#FBBF24" />
                <Text style={styles.costItemValue}>2</Text>
              </View>
            </View>
          </View>
        </View>

        {/* WAYS TO GET ENERGY SECTION */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLine} />
          <Text style={styles.sectionTitle}>ENERGIYA OLISH USULLARI</Text>
          <View style={styles.sectionHeaderLine} />
        </View>

        {/* Gift Box */}
        <View style={styles.taskCard}>
          <View style={styles.taskIconContainer}>
            <Image source={require('../assets/ec_gift.png')} style={styles.taskIcon} contentFit="contain" />
          </View>
          <View style={styles.taskContent}>
            <Text style={[styles.taskTitle, { color: '#C084FC' }]}>BUGUNGI SOVG'A</Text>
            <Text style={styles.taskDesc}>Har kuni kirib energiya oling!</Text>
            <Text style={styles.taskReward}>Mukofot: <MaterialCommunityIcons name="lightning-bolt" size={12} color="#FBBF24" /> +2</Text>
          </View>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>OLISH</Text>
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Missions */}
        <View style={styles.taskCard}>
          <View style={styles.taskIconContainer}>
            <Image source={require('../assets/ec_trophy.png')} style={styles.taskIcon} contentFit="contain" />
          </View>
          <View style={[styles.taskContent, { flex: 1 }]}>
            <Text style={[styles.taskTitle, { color: '#38BDF8' }]}>MISSIYALAR</Text>
            <Text style={styles.taskDesc}>Missiyalarni bajaring va energiya oling!</Text>
            <Text style={[styles.taskProgressText, { marginTop: 6, marginBottom: 4 }]}>5 ta mashq bajaring</Text>
            <View style={styles.taskProgressBarContainer}>
              <View style={styles.taskProgressBarBg}>
                <View style={[styles.taskProgressBarFill, { width: '60%' }]} />
              </View>
              <Text style={styles.taskProgressCount}>3 / 5</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.secondaryBadge, { marginLeft: 10 }]}>
            <MaterialCommunityIcons name="lightning-bolt" size={14} color="#FBBF24" />
            <Text style={styles.secondaryBadgeText}>+1</Text>
          </TouchableOpacity>
        </View>

        {/* Streak Bonus */}
        <View style={styles.taskCard}>
          <View style={styles.taskIconContainer}>
            <Image source={require('../assets/best_streak.png')} style={styles.taskIcon} contentFit="contain" />
          </View>
          <View style={[styles.taskContent, { flex: 1 }]}>
            <Text style={[styles.taskTitle, { color: '#FB923C' }]}>KUNLIK BONUS</Text>
            <Text style={styles.taskDesc}>Ketma-ket kirish orqali ko'proq energiya oling!</Text>
            <Text style={[styles.taskProgressText, { marginTop: 6, marginBottom: 4 }]}>7 kunlik kirish</Text>
            <View style={{ flexDirection: 'row' }}>
              {[1, 2, 3, 4].map(i => <Ionicons key={i} name="checkmark-circle" size={16} color="#FBBF24" style={{ marginRight: 2 }} />)}
              {[5, 6, 7].map(i => <Ionicons key={i} name="ellipse-outline" size={16} color="#334155" style={{ marginRight: 2 }} />)}
            </View>
          </View>
          <TouchableOpacity style={[styles.secondaryBadge, { marginLeft: 10 }]}>
            <MaterialCommunityIcons name="lightning-bolt" size={14} color="#FBBF24" />
            <Text style={styles.secondaryBadgeText}>+3</Text>
          </TouchableOpacity>
        </View>

        {/* Watch Video */}
        <View style={styles.taskCard}>
          <View style={styles.taskIconContainer}>
            <Image source={require('../assets/ec_video.png')} style={styles.taskIcon} contentFit="contain" />
          </View>
          <View style={styles.taskContent}>
            <Text style={[styles.taskTitle, { color: '#60A5FA' }]}>VIDEO KO'RISH</Text>
            <Text style={styles.taskDesc}>30 soniyalik video ko'rib energiya oling!</Text>
          </View>
          <View style={styles.taskProgressArea}>
             <Text style={styles.taskProgressText}>Video ko'rish orqali mukofot oling</Text>
             <TouchableOpacity style={styles.videoButton}>
               <Ionicons name="play" size={12} color="#FFF" />
               <Text style={styles.videoButtonText}>KO'RISH</Text>
               <MaterialCommunityIcons name="lightning-bolt" size={12} color="#FBBF24" />
               <Text style={styles.videoButtonText}>+1</Text>
             </TouchableOpacity>
          </View>
        </View>

        {/* FOOTER CALL TO ACTIONS */}

        <View style={[styles.footerCard, { borderColor: 'rgba(168, 85, 247, 0.3)' }]}>
          <LinearGradient colors={['rgba(168, 85, 247, 0.1)', 'transparent']} style={StyleSheet.absoluteFill} />
          <Ionicons name="people" size={40} color="#C084FC" style={{ marginRight: 16 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.footerTitle, { color: '#C084FC' }]}>DO'STLARNI TAKLIF QILING</Text>
            <Text style={styles.footerDesc}>Do'stlaringizni taklif qiling va energiya oling! Har bir do'st uchun <MaterialCommunityIcons name="lightning-bolt" size={12} color="#FBBF24" />+1</Text>
          </View>
          <TouchableOpacity style={styles.premiumButton}>
            <Ionicons name="share-social" size={14} color="#FFF" />
            <Text style={styles.premiumButtonText}>TAKLIF QILISH</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 20,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_800ExtraBold',
    marginLeft: 4,
  },
  headerSubtitle: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerStatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  headerStatText: {
    color: '#FFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    marginHorizontal: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  topInfoRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  mainEnergyCard: {
    flex: 1.5,
    backgroundColor: '#0F1320',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.2)',
    marginRight: 12,
  },
  mainEnergyTopRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  mainEnergyLeft: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mainLightningIcon: {
    width: 70,
    height: 70,
  },
  mainEnergyRight: {
    flex: 1,
    justifyContent: 'center',
  },
  energyBigText: {
    marginBottom: 4,
  },
  energyBigValue: {
    color: '#FBBF24',
    fontSize: 32,
    fontFamily: 'Inter_800ExtraBold',
  },
  energyBigDivider: {
    color: '#9CA3AF',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  nextEnergyLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 4,
  },
  timerText: {
    color: '#FBBF24',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    marginLeft: 4,
  },
  energyRecoveryInfo: {
    color: '#64748B',
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  },
  energyDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
  },
  maxEnergyText: {
    color: '#64748B',
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
  costsPanel: {
    flex: 1,
    backgroundColor: '#0F1320',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  costsTitle: {
    color: '#FBBF24',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  costItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  costItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  costItemText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 6,
  },
  costItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  costItemValue: {
    color: '#FBBF24',
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    marginLeft: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    marginHorizontal: 16,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0E17',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  taskIconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  taskIcon: {
    width: '100%',
    height: '100%',
  },
  taskContent: {
    flex: 1.2,
  },
  taskTitle: {
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  taskDesc: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    lineHeight: 14,
  },
  taskReward: {
    color: '#E2E8F0',
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 4,
  },
  taskProgressArea: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  taskProgressText: {
    color: '#9CA3AF',
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    marginBottom: 4,
  },
  taskProgressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  taskProgressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    marginRight: 8,
  },
  taskProgressBarFill: {
    height: '100%',
    backgroundColor: '#FBBF24',
    borderRadius: 3,
  },
  taskProgressCount: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
  primaryButton: {
    backgroundColor: '#FBBF24',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
  },
  notificationDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#0A0E17',
  },
  secondaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  secondaryBadgeText: {
    color: '#FBBF24',
    fontSize: 14,
    fontFamily: 'Inter_800ExtraBold',
    marginLeft: 2,
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
  },
  videoButtonText: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    marginHorizontal: 4,
  },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 4,
  },
  premiumButtonText: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Inter_800ExtraBold',
    marginLeft: 6,
  },
  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1320',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  footerTitle: {
    fontSize: 12,
    fontFamily: 'Inter_800ExtraBold',
    marginBottom: 2,
  },
  footerDesc: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    lineHeight: 14,
  }
});
