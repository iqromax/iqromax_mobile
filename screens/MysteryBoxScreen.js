import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar, Share, Alert } from 'react-native';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../src/config/api';

export default function MysteryBoxScreen({ navigation, route }) {
  const { user, initialTab = 'main' } = route.params || {};

  // Active Tab: 'main' (Sirli Sandiq) | 'opening' | 'reward' | 'how_to_get' | 'invite' | 'key_claimed' | 'my_rewards'
  const [activeScreen, setActiveScreen] = useState(initialTab);
  const [keysCount, setKeysCount] = useState(3);
  const [claimedReward, setClaimedReward] = useState(null);
  const [rewardsTab, setRewardsTab] = useState('Barchasi'); // 'Barchasi' | 'Faol' | 'Tarix'

  // Invitation & Referral state
  const rawPromo = user?.customId ? user.customId.replace(/^#+/, '') : 'MICHAEL';
  const referralLink = `https://iqromax.uz/invite/${rawPromo}`;
  const shareMessage = `IQROMAX ilovasida ro'yxatdan o'ting va 3 kunlik BEPUL Premium hamda Sirli Sandiq sovg'asini oling!\n\nMening promokodim: ${rawPromo}\n\nIlovani yuklab olish uchun havola:\n${referralLink}`;
  const [isCopied, setIsCopied] = useState(false);

  // Real dynamic states for bonus keys & streak
  const [welcomeBonusClaimed, setWelcomeBonusClaimed] = useState(true); // User received 1 bonus key on registration
  const [streakDays, setStreakDays] = useState(0);
  const [streakClaimed, setStreakClaimed] = useState(false);

  React.useEffect(() => {
    // Load daily streak activity from AsyncStorage
    async function loadStreakActivity() {
      try {
        const storedStreak = await AsyncStorage.getItem('user_daily_streak_days');
        const lastExerciseDate = await AsyncStorage.getItem('user_last_exercise_date');
        const todayStr = new Date().toISOString().slice(0, 10);
        
        let daysCount = storedStreak ? parseInt(storedStreak, 10) : 0;
        
        // If user solved exercise today or recently, ensure streak is active
        if (lastExerciseDate === todayStr && daysCount === 0) {
          daysCount = 1;
        }

        setStreakDays(Math.min(7, Math.max(0, daysCount)));
        if (daysCount >= 7) {
          const claimed = await AsyncStorage.getItem('streak_7_key_claimed');
          setStreakClaimed(claimed === 'true');
        }
      } catch (e) {}
    }
    loadStreakActivity();
  }, []);

  const handleClaimStreakBonus = async () => {
    if (streakDays >= 7 && !streakClaimed) {
      setKeysCount(prev => prev + 1);
      setStreakClaimed(true);
      try {
        await AsyncStorage.setItem('streak_7_key_claimed', 'true');
      } catch(e) {}
      Alert.alert("Tabriklaymiz! 🎉", "7 kunlik faollik uchun +1 ta oltin kalit berildi!");
    }
  };

  // Rewards List State with real storage
  const [rewardsList, setRewardsList] = useState([]);

  const loadSavedRewards = async () => {
    try {
      const storedRewards = await AsyncStorage.getItem('user_won_rewards_history');
      if (storedRewards) {
        const parsed = JSON.parse(storedRewards);
        // Recalculate 'Faol' status for premium items based on current time
        const now = Date.now();
        const updated = parsed.map(item => {
          if (item.type === 'premium' && item.expiresAt) {
            const isStillActive = now < item.expiresAt;
            const expDateObj = new Date(item.expiresAt);
            const dateStr = expDateObj.toLocaleDateString();
            const timeStr = expDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return {
              ...item,
              date: isStillActive ? `Tugash muddati: ${dateStr} ${timeStr}` : `Tugagan sana: ${dateStr} ${timeStr}`,
              status: isStillActive ? 'Faol' : 'Tarix'
            };
          }
          return item;
        });
        setRewardsList(updated);
      } else {
        // Initial default rewards if empty
        const initialRewards = [
          { id: '1', title: 'Yangi Foydalanuvchi Bonusi', date: 'Berilgan sana: Bugun', status: 'Faol', type: 'premium', icon: 'crown', color: '#F59E0B', badge: '1 ta Kalit' }
        ];
        setRewardsList(initialRewards);
        await AsyncStorage.setItem('user_won_rewards_history', JSON.stringify(initialRewards));
      }
    } catch (e) {}
  };

  const copyLink = async () => {
    await Clipboard.setStringAsync(referralLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shareReferral = async () => {
    try {
      await Share.share({ message: shareMessage });
    } catch (e) {}
  };

  // Fetch Admin Created Mystery Box Items
  const [adminBoxItems, setAdminBoxItems] = useState([]);

  React.useEffect(() => {
    loadSavedRewards();

    async function fetchAdminItems() {
      try {
        const res = await fetch(`${API_URL}/mystery-box`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setAdminBoxItems(data);
          }
        }
      } catch (e) {}
    }
    fetchAdminItems();
  }, []);

  const openBoxHandler = () => {
    if (keysCount <= 0) return;
    setActiveScreen('opening');
    setTimeout(async () => {
      let selected = null;
      if (adminBoxItems.length > 0) {
        const randomItem = adminBoxItems[Math.floor(Math.random() * adminBoxItems.length)];
        selected = {
          title: randomItem.name,
          sub: randomItem.description,
          badge: randomItem.badge || (randomItem.type === 'energy' ? `⚡ ${randomItem.value || 1} Energiya` : `👑 ${randomItem.value || 1} kun Premium`),
          type: randomItem.type || 'premium',
          value: randomItem.value || 1
        };
      } else {
        const rewardOptions = [
          { title: '1 KUNLIK BEPUL PREMIUM', sub: 'Ajoyib! Siz 1 kunlik (24 soat) Premium status yutdingiz! Chaqmoqlaringiz cheksiz bo\'ldi!', badge: '👑 1 kun Premium', type: 'premium', value: 1 },
          { title: '3 KUNLIK BEPUL PREMIUM', sub: 'Ajoyib! Siz 3 kunlik Premium status yutdingiz! Chaqmoqlaringiz cheksiz bo\'ldi!', badge: '👑 3 kun Premium', type: 'premium', value: 3 },
          { title: '5 TA ENERGIYA CHAQMOQLAR', sub: 'Ajoyib! Siz +5 ta energiya chaqmoq yutdingiz!', badge: '⚡ +5 Energiya', type: 'energy', value: 5 },
        ];
        selected = rewardOptions[Math.floor(Math.random() * rewardOptions.length)];
      }

      // Activate Premium logic or Energy logic & save to history
      try {
        let expTime = null;
        if (selected.type === 'premium') {
          const days = selected.value || 1;
          const currentExp = await AsyncStorage.getItem('user_premium_expires_at');
          const baseTime = (currentExp && parseInt(currentExp, 10) > Date.now()) ? parseInt(currentExp, 10) : Date.now();
          expTime = baseTime + (days * 24 * 60 * 60 * 1000); // Add days * 24 Hours
          await AsyncStorage.setItem('user_premium_expires_at', expTime.toString());
        } else if (selected.type === 'energy') {
          const addVal = selected.value || 1;
          const storedData = await AsyncStorage.getItem('user_energy_data');
          let curEnergy = 2;
          let lastUpdated = Date.now();
          if (storedData) {
            const parsed = JSON.parse(storedData);
            curEnergy = parsed.energy || 2;
            lastUpdated = parsed.lastUpdated || Date.now();
          }
          const newEnergy = Math.min(10, curEnergy + addVal);
          await AsyncStorage.setItem('user_energy_data', JSON.stringify({ energy: newEnergy, lastUpdated }));
        }

        let dateLabel = `Yutib olindi: ${new Date().toLocaleDateString()}`;
        if (selected.type === 'premium' && expTime) {
          const expDateObj = new Date(expTime);
          const dateStr = expDateObj.toLocaleDateString();
          const timeStr = expDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          dateLabel = `Tugash muddati: ${dateStr} ${timeStr}`;
        }

        // Save new reward to user's real rewards history array
        const newHistoryItem = {
          id: Date.now().toString(),
          title: selected.title,
          sub: selected.sub,
          date: dateLabel,
          status: 'Faol',
          expiresAt: expTime,
          type: selected.type,
          icon: selected.type === 'energy' ? 'lightning-bolt' : 'crown',
          color: selected.type === 'energy' ? '#F59E0B' : '#A855F7',
          badge: selected.badge
        };

        const updatedHistory = [newHistoryItem, ...rewardsList];
        setRewardsList(updatedHistory);
        await AsyncStorage.setItem('user_won_rewards_history', JSON.stringify(updatedHistory));

      } catch (e) {
        console.error('Save reward error:', e);
      }

      setClaimedReward(selected);
      setKeysCount(prev => Math.max(0, prev - 1));
      setActiveScreen('reward');
    }, 1500);
  };

  // Render header with Back button & info button
  const renderHeader = (title, onInfoPress) => (
    <View style={styles.headerRow}>
      <TouchableOpacity style={styles.backCircleBtn} onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="chevron-left" size={28} color="#FFF" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      {onInfoPress ? (
        <TouchableOpacity style={styles.infoCircleBtn} onPress={onInfoPress}>
          <MaterialCommunityIcons name="information-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 40 }} />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070714" />

      {/* SCREEN 1: MAIN SIRLI SANDIQ */}
      {activeScreen === 'main' && (
        <View style={{ flex: 1 }}>
          {renderHeader("SIRLI SANDIQ", () => setActiveScreen('how_to_get'))}

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Keys Count Pill */}
            <View style={styles.keysPillCard}>
              <Image source={require('../assets/gold_star.png')} style={styles.keyIconImg} contentFit="contain" />
              <View>
                <Text style={styles.keysLabel}>Sizda mavjud kalitlar</Text>
                <Text style={styles.keysValue}>{keysCount} ta</Text>
              </View>
            </View>

            {/* Glowing Chest */}
            <View style={styles.chestGlowContainer}>
              <View style={styles.chestGlowCircle} />
              <Image source={require('../assets/sirli_sandiq_high_quality_nurli.gif')} style={styles.chestImg} contentFit="contain" />
            </View>

            <Text style={styles.mainDescText}>
              Kalitlar bilan sandiqni oching va qimmatbaho sovg'alarni qo'lga kiring!
            </Text>

            {/* Action Button */}
            <TouchableOpacity 
              style={[styles.mainGradientBtn, keysCount <= 0 && { opacity: 0.6 }]} 
              activeOpacity={0.8}
              disabled={keysCount <= 0}
              onPress={openBoxHandler}
            >
              <Text style={styles.mainGradientBtnText}>SANDIQNI OCHISH ✨</Text>
            </TouchableOpacity>

            {/* Link: How to get keys */}
            <TouchableOpacity style={styles.howToLinkBtn} onPress={() => setActiveScreen('how_to_get')}>
              <Text style={styles.howToLinkText}>Kalitlar qanday olinadi? ➔</Text>
            </TouchableOpacity>

            {/* Link: My rewards */}
            <TouchableOpacity style={[styles.howToLinkBtn, { marginTop: 10 }]} onPress={() => setActiveScreen('my_rewards')}>
              <Text style={[styles.howToLinkText, { color: '#A855F7' }]}>Mening sovg'alarim 🎁 ➔</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* SCREEN 2: OPENING ANIMATION */}
      {activeScreen === 'opening' && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#070714' }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: -40 }}>
            <View style={[styles.chestGlowContainer, { width: 420, height: 420, marginVertical: 0 }]}>
              <Image source={require('../assets/sirli_sandiq_juda_tez_high_speed.gif')} style={{ width: 400, height: 400 }} contentFit="contain" />
            </View>

            {/* Premium Animated Glowing Status Badge */}
            <View style={styles.openingStatusBadge}>
              <MaterialCommunityIcons name="sparkles" size={20} color="#F59E0B" style={{ marginRight: 8 }} />
              <Text style={styles.openingStatusText}>
                SANDIQ OCHILMOQDA... ✨
              </Text>
            </View>

            <Text style={{ color: '#9CA3AF', fontSize: 13, fontFamily: 'Inter_500Medium', marginTop: 10 }}>
              Omadingiz sinalmoqda, kuting! 🎁
            </Text>
          </View>
        </View>
      )}

      {/* SCREEN 3: SIZNING SOVG'ANGIZ (REWARD) */}
      {activeScreen === 'reward' && (
        <View style={{ flex: 1 }}>
          {renderHeader("SIZNING SOVG'ANGIZ!")}

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
            {/* Reward Card */}
            <View style={styles.rewardCardContainer}>
              <View style={styles.rewardIconGlowCircle}>
                <MaterialCommunityIcons name="crown" size={64} color="#FBBF24" />
              </View>

              <Text style={styles.rewardCardSubTitle}>{claimedReward?.badge || '3 KUNLIK'}</Text>
              <Text style={styles.rewardCardTitle}>{claimedReward?.title || 'BEPUL PREMIUM'}</Text>
              <Text style={styles.rewardCardDesc}>{claimedReward?.sub || 'Ajoyib! Siz 3 kunlik Premium status yutdingiz!'}</Text>

              <View style={styles.rewardBadgeChip}>
                <Text style={styles.rewardBadgeChipText}>⚡ {claimedReward?.badge || '3 kun'}</Text>
              </View>
            </View>

            {/* AJOYIB BUTTON */}
            <TouchableOpacity 
              style={styles.mainGradientBtn} 
              activeOpacity={0.8}
              onPress={() => setActiveScreen('main')}
            >
              <Text style={styles.mainGradientBtnText}>AJOYIB! 🎉</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* SCREEN 4: KALITLAR QANDAY OLINADI? */}
      {activeScreen === 'how_to_get' && (
        <View style={{ flex: 1 }}>
          {renderHeader("KALITLAR QANDAY OLINADI?")}

          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, gap: 14 }} showsVerticalScrollIndicator={false}>
            
            {/* Item 1: Yangi foydalanuvchi bonusi */}
            <View style={styles.howItemCard}>
              <View style={[styles.howIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderColor: '#3B82F6', borderWidth: 1 }]}>
                <MaterialCommunityIcons name="account-star-outline" size={24} color="#3B82F6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.howItemTitle}>Yangi foydalanuvchi bonusi</Text>
                <Text style={styles.howItemSub}>Ro'yxatdan o'tganingiz uchun +1 ta oltin kalit berildi.</Text>
              </View>
              <View style={styles.howCheckBtn}>
                <MaterialCommunityIcons name="check-bold" size={16} color="#10B981" />
              </View>
            </View>

            {/* Item 2: Do'stlarni taklif eting (Ideal Plus Button) */}
            <View style={styles.howItemCard}>
              <View style={[styles.howIconBox, { backgroundColor: 'rgba(34, 197, 94, 0.15)', borderColor: '#22C55E', borderWidth: 1 }]}>
                <MaterialCommunityIcons name="account-multiple-plus-outline" size={24} color="#22C55E" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.howItemTitle}>Do'stlarni taklif eting</Text>
                <Text style={styles.howItemSub}>Har bir yangi do'st uchun +1 ta kalit oling.</Text>
              </View>
              <TouchableOpacity 
                style={styles.howInvitePlusCircleBtn} 
                activeOpacity={0.8}
                onPress={() => setActiveScreen('invite')}
              >
                <MaterialCommunityIcons name="plus" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Item 3: Kunlik faollik (Real Streak calculation) */}
            <View style={styles.howItemCard}>
              <View style={[styles.howIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: '#F59E0B', borderWidth: 1 }]}>
                <MaterialCommunityIcons name="calendar-fire" size={24} color="#F59E0B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.howItemTitle}>Kunlik faollik</Text>
                <Text style={styles.howItemSub}>Har kuni kamida 1 ta mashq ishlang va 7 kunda kalit oling.</Text>
              </View>
              {streakDays >= 7 ? (
                streakClaimed ? (
                  <View style={styles.howCheckBtn}>
                    <MaterialCommunityIcons name="check-bold" size={16} color="#10B981" />
                  </View>
                ) : (
                  <TouchableOpacity style={styles.howClaimBtn} onPress={handleClaimStreakBonus}>
                    <Text style={styles.howClaimBtnText}>Olish 🔑</Text>
                  </TouchableOpacity>
                )
              ) : (
                <View style={styles.howProgressChip}>
                  <Text style={styles.howProgressChipText}>🔥 {streakDays}/7 kun</Text>
                </View>
              )}
            </View>

            {/* Bottom Banner */}
            <View style={styles.howBottomBanner}>
              <MaterialCommunityIcons name="gift-outline" size={32} color="#F59E0B" style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#F59E0B', fontFamily: 'Inter_700Bold', fontSize: 12 }}>Ko'proq kalitlar - ko'proq imkoniyatlar!</Text>
                <Text style={{ color: '#9CA3AF', fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 2 }}>Faol bo'ling va sovg'alarni qo'lga kiriting!</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      )}

      {/* SCREEN 5: DO'STLARNI TAKLIF ETISH */}
      {activeScreen === 'invite' && (
        <View style={{ flex: 1 }}>
          {renderHeader("DO'STLARNI TAKLIF ETISH")}

          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, alignItems: 'center', paddingTop: 10 }} showsVerticalScrollIndicator={false}>
            {/* Gift Icon */}
            <View style={styles.giftIconContainer}>
              <MaterialCommunityIcons name="gift" size={56} color="#F59E0B" />
            </View>

            <Text style={{ color: '#FFF', fontSize: 18, fontFamily: 'Inter_700Bold', textAlign: 'center', marginTop: 16 }}>
              Do'stlaringizni taklif eting va kalitlarga ega bo'ling!
            </Text>

            {/* Referral Link Box */}
            <View style={styles.inviteLinkCard}>
              <Text style={{ color: '#64748B', fontSize: 11, textAlign: 'center', fontFamily: 'Inter_500Medium', marginBottom: 6 }}>Sizning taklif havolangiz</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <Text style={{ color: '#A855F7', fontSize: 14, fontFamily: 'Inter_700Bold' }}>{referralLink}</Text>
                <TouchableOpacity onPress={copyLink}>
                  <MaterialCommunityIcons name={isCopied ? "check" : "content-copy"} size={18} color="#A855F7" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Social Share Grid */}
            <View style={styles.shareGridRow}>
              <TouchableOpacity style={styles.shareGridItem} onPress={shareReferral}>
                <View style={[styles.shareIconCircle, { backgroundColor: '#229ED9' }]}>
                  <MaterialCommunityIcons name="send" size={20} color="#FFF" />
                </View>
                <Text style={styles.shareGridLabel}>Telegram</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareGridItem} onPress={shareReferral}>
                <View style={[styles.shareIconCircle, { backgroundColor: '#25D366' }]}>
                  <MaterialCommunityIcons name="whatsapp" size={20} color="#FFF" />
                </View>
                <Text style={styles.shareGridLabel}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareGridItem} onPress={copyLink}>
                <View style={[styles.shareIconCircle, { backgroundColor: '#334155' }]}>
                  <MaterialCommunityIcons name="content-copy" size={20} color="#FFF" />
                </View>
                <Text style={styles.shareGridLabel}>Kopiyalash</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareGridItem} onPress={shareReferral}>
                <View style={[styles.shareIconCircle, { backgroundColor: '#475569' }]}>
                  <MaterialCommunityIcons name="dots-horizontal" size={20} color="#FFF" />
                </View>
                <Text style={styles.shareGridLabel}>Yana</Text>
              </TouchableOpacity>
            </View>

            {/* Stats Card */}
            <View style={styles.inviteStatsContainer}>
              <Text style={{ color: '#94A3B8', fontSize: 12, fontFamily: 'Inter_600SemiBold', marginBottom: 12 }}>Takliflaringiz statistikasi</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.inviteStatNum}>10</Text>
                  <Text style={styles.inviteStatLabel}>Taklif qilindi</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.inviteStatNum}>7</Text>
                  <Text style={styles.inviteStatLabel}>Ro'yxatdan o'tdi</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={[styles.inviteStatNum, { color: '#F59E0B' }]}>🔑 7</Text>
                  <Text style={styles.inviteStatLabel}>Kalit olingan</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      )}

      {/* SCREEN 6: YANGI KALIT OLINDINGIZ */}
      {activeScreen === 'key_claimed' && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <View style={styles.chestGlowContainer}>
            <View style={[styles.chestGlowCircle, { backgroundColor: 'rgba(251, 191, 36, 0.25)', width: 240, height: 240 }]} />
            <MaterialCommunityIcons name="key-radiance" size={100} color="#FBBF24" />
          </View>

          <Text style={{ color: '#FFF', fontSize: 22, fontFamily: 'Inter_800ExtraBold', textAlign: 'center', marginTop: 20 }}>
            Yangi kalit olindingiz! 🔑
          </Text>
          <Text style={{ color: '#9CA3AF', fontSize: 14, fontFamily: 'Inter_500Medium', textAlign: 'center', marginTop: 8 }}>
            Endi sizda jami <Text style={{ color: '#F59E0B', fontFamily: 'Inter_700Bold' }}>{keysCount}</Text> ta kalit bor.
          </Text>

          <TouchableOpacity 
            style={[styles.mainGradientBtn, { marginTop: 40 }]} 
            activeOpacity={0.8}
            onPress={() => setActiveScreen('main')}
          >
            <Text style={styles.mainGradientBtnText}>Davom etish</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* SCREEN 7: SOVG'ALARIM */}
      {activeScreen === 'my_rewards' && (
        <View style={{ flex: 1 }}>
          {renderHeader("SOVG'ALARIM")}

          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            {/* Tabs Row */}
            <View style={styles.rewardsTabRow}>
              {['Barchasi', 'Faol', 'Tarix'].map((tab) => (
                <TouchableOpacity 
                  key={tab} 
                  style={[styles.rewardsTabItem, rewardsTab === tab && styles.rewardsTabItemActive]}
                  onPress={() => setRewardsTab(tab)}
                >
                  <Text style={[styles.rewardsTabText, rewardsTab === tab && styles.rewardsTabTextActive]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* List */}
            <ScrollView contentContainerStyle={{ gap: 12, paddingTop: 10, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
              {rewardsList.filter(item => rewardsTab === 'Barchasi' || item.status === rewardsTab).length > 0 ? (
                rewardsList
                  .filter(item => rewardsTab === 'Barchasi' || item.status === rewardsTab)
                  .map((item) => (
                    <View key={item.id} style={styles.rewardListItem}>
                      <View style={[styles.rewardListIconBox, { backgroundColor: `${item.color || '#F59E0B'}20` }]}>
                        <MaterialCommunityIcons name={item.icon || 'gift-outline'} size={24} color={item.color || '#F59E0B'} />
                      </View>
                      <View style={{ flex: 1, paddingLeft: 12 }}>
                        <Text style={styles.rewardListTitle}>{item.title}</Text>
                        <Text style={styles.rewardListDate}>{item.date}</Text>
                      </View>
                      {item.badge ? (
                        <View style={[styles.activeTagBadge, { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: '#F59E0B', borderWidth: 1 }]}>
                          <Text style={[styles.activeTagBadgeText, { color: '#F59E0B' }]}>{item.badge}</Text>
                        </View>
                      ) : item.status === 'Faol' ? (
                        <View style={styles.activeTagBadge}>
                          <Text style={styles.activeTagBadgeText}>Faol</Text>
                        </View>
                      ) : (
                        <View style={[styles.activeTagBadge, { backgroundColor: 'rgba(100, 116, 139, 0.15)' }]}>
                          <Text style={[styles.activeTagBadgeText, { color: '#94A3B8' }]}>Tarix</Text>
                        </View>
                      )}
                    </View>
                  ))
              ) : (
                <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
                  <MaterialCommunityIcons name="gift-off-outline" size={54} color="#475569" />
                  <Text style={{ color: '#94A3B8', fontSize: 14, fontFamily: 'Inter_600SemiBold', marginTop: 12 }}>
                    Hozircha sovg'alar mavjud emas
                  </Text>
                  <Text style={{ color: '#64748B', fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 4 }}>
                    Sandiqni oching va birinchi sovg'angizni yutib oling!
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070714',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 50,
    paddingTop: 10,
  },
  keysPillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#13112A',
    borderWidth: 1.5,
    borderColor: '#382A5F',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 14,
    marginTop: 6,
  },
  keyIconImg: {
    width: 32,
    height: 32,
  },
  keysLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  keysValue: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
  },
  chestGlowContainer: {
    width: 320,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
    alignSelf: 'center',
  },
  chestGlowCircle: {
    display: 'none',
  },
  chestImg: {
    width: 310,
    height: 310,
  },
  mainDescText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  mainGradientBtn: {
    width: '100%',
    backgroundColor: '#F59E0B',
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  mainGradientBtnText: {
    color: '#070714',
    fontSize: 16,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 0.5,
  },
  howToLinkBtn: {
    marginTop: 16,
  },
  howToLinkText: {
    color: '#38BDF8',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },

  openingStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#13112A',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 12,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
    marginTop: 10,
  },
  openingStatusText: {
    color: '#F59E0B',
    fontSize: 15,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1.5,
  },

  // REWARD CARD
  rewardCardContainer: {
    width: '100%',
    backgroundColor: '#13112A',
    borderWidth: 1.5,
    borderColor: '#A855F7',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#A855F7',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  rewardIconGlowCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  rewardCardSubTitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  rewardCardTitle: {
    color: '#F59E0B',
    fontSize: 22,
    fontFamily: 'Inter_900Black',
    marginTop: 4,
    textAlign: 'center',
  },
  rewardCardDesc: {
    color: '#D1D5DB',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 18,
  },
  rewardBadgeChip: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  rewardBadgeChipText: {
    color: '#F59E0B',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },

  // HOW TO GET
  howItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1225',
    borderWidth: 1,
    borderColor: '#1E2342',
    borderRadius: 18,
    padding: 16,
  },
  howIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  howItemTitle: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  howItemSub: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
    lineHeight: 15,
  },
  howCheckBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  howInvitePlusCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  howClaimBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  howClaimBtnText: {
    color: '#070714',
    fontSize: 11,
    fontFamily: 'Inter_800ExtraBold',
  },
  howProgressChip: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  howProgressChipText: {
    color: '#F59E0B',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  howBottomBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 18,
    padding: 16,
    marginTop: 10,
  },

  // INVITE SCREEN
  giftIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  inviteLinkCard: {
    width: '100%',
    backgroundColor: '#0F1225',
    borderWidth: 1,
    borderColor: '#1E2342',
    borderRadius: 18,
    padding: 16,
    marginVertical: 20,
  },
  shareGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  shareGridItem: {
    alignItems: 'center',
    gap: 6,
  },
  shareIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareGridLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  inviteStatsContainer: {
    width: '100%',
    backgroundColor: '#0F1225',
    borderWidth: 1,
    borderColor: '#1E2342',
    borderRadius: 18,
    padding: 18,
  },
  inviteStatNum: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
  },
  inviteStatLabel: {
    color: '#64748B',
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
  },

  // REWARDS LIST
  rewardsTabRow: {
    flexDirection: 'row',
    backgroundColor: '#0F1225',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  rewardsTabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  rewardsTabItemActive: {
    backgroundColor: '#1E2342',
  },
  rewardsTabText: {
    color: '#64748B',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  rewardsTabTextActive: {
    color: '#FFF',
    fontFamily: 'Inter_700Bold',
  },
  rewardListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1225',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E2342',
  },
  rewardListIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardListTitle: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  rewardListDate: {
    color: '#64748B',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  activeTagBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeTagBadgeText: {
    color: '#10B981',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
});
