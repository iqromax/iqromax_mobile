import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar, Share } from 'react-native';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Clipboard from 'expo-clipboard';

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

  // Rewards List State
  const [rewardsList, setRewardsList] = useState([
    { id: 1, title: '3 kunlik Premium', date: 'Yakunlanish: 15.06.2026', status: 'Faol', type: 'premium', icon: 'crown-outline', color: '#F59E0B' },
    { id: 2, title: '500 Coin', date: 'Yakunlanish: -', status: 'Tarix', type: 'coin', icon: 'amber', color: '#EAB308' },
    { id: 3, title: '20% Chegirma kuponi', date: 'Yakunlanish: 30.06.2026', status: 'Faol', type: 'discount', icon: 'ticket-percent-outline', color: '#EF4444' },
    { id: 4, title: 'Eksklyuziv Skin', date: 'Yakunlanish: -', status: 'Tarix', type: 'skin', icon: 'emoticon-cool-outline', color: '#A855F7' }
  ]);

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

  const openBoxHandler = () => {
    if (keysCount <= 0) return;
    setActiveScreen('opening');
    setTimeout(() => {
      const rewardOptions = [
        { title: '3 KUNLIK BEPUL PREMIUM', sub: 'Ajoyib! Siz 3 kunlik Premium status yutdingiz!', badge: '⚡ 3 kun', type: 'premium' },
        { title: '500 OLTIN COINLAR', sub: 'Ajoyib! Siz 500 Coin yutdingiz!', badge: '🪙 +500 Coin', type: 'coin' },
        { title: '20% CHEGIRMA KUPONI', sub: 'Ajoyib! Siz 20% Chegirma kuponini yutdingiz!', badge: '🏷️ 20% Off', type: 'discount' },
      ];
      const selected = rewardOptions[Math.floor(Math.random() * rewardOptions.length)];
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
            
            {/* Item 1 */}
            <View style={styles.howItemCard}>
              <View style={[styles.howIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                <MaterialCommunityIcons name="account-outline" size={24} color="#3B82F6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.howItemTitle}>Yangi foydalanuvchi bonusi</Text>
                <Text style={styles.howItemSub}>Ro'yxatdan o'tganingiz uchun 1 ta bepul kalit berildi.</Text>
              </View>
              <View style={styles.howCheckBtn}>
                <MaterialCommunityIcons name="check" size={18} color="#10B981" />
              </View>
            </View>

            {/* Item 2 */}
            <View style={styles.howItemCard}>
              <View style={[styles.howIconBox, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                <MaterialCommunityIcons name="account-group-outline" size={24} color="#22C55E" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.howItemTitle}>Do'stlarni taklif eting</Text>
                <Text style={styles.howItemSub}>Har bir yangi do'st uchun +1 ta kalit oling.</Text>
              </View>
              <TouchableOpacity style={styles.howInviteBtn} onPress={() => setActiveScreen('invite')}>
                <Text style={styles.howInviteBtnText}>Taklif etish</Text>
              </TouchableOpacity>
            </View>

            {/* Item 3 */}
            <View style={styles.howItemCard}>
              <View style={[styles.howIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                <MaterialCommunityIcons name="calendar-month-outline" size={24} color="#EF4444" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.howItemTitle}>Kunlik faollik</Text>
                <Text style={styles.howItemSub}>7 kun ketma-ket o'ynang va bonus kalit oling.</Text>
              </View>
              <View style={styles.howProgressChip}>
                <Text style={styles.howProgressChipText}>✓ 5/7</Text>
              </View>
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

          <View style={{ paddingHorizontal: 20 }}>
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
            <ScrollView contentContainerStyle={{ gap: 12, paddingTop: 10 }} showsVerticalScrollIndicator={false}>
              {rewardsList
                .filter(item => rewardsTab === 'Barchasi' || item.status === rewardsTab)
                .map((item) => (
                  <View key={item.id} style={styles.rewardListItem}>
                    <View style={[styles.rewardListIconBox, { backgroundColor: `${item.color}20` }]}>
                      <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
                    </View>
                    <View style={{ flex: 1, paddingLeft: 12 }}>
                      <Text style={styles.rewardListTitle}>{item.title}</Text>
                      <Text style={styles.rewardListDate}>{item.date}</Text>
                    </View>
                    {item.status === 'Faol' ? (
                      <View style={styles.activeTagBadge}>
                        <Text style={styles.activeTagBadgeText}>Faol</Text>
                      </View>
                    ) : (
                      <MaterialCommunityIcons name="chevron-right" size={20} color="#64748B" />
                    )}
                  </View>
                ))}
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
  howInviteBtn: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  howInviteBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  howProgressChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  howProgressChipText: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
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
