import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Feather,
  MaterialCommunityIcons,
  Ionicons,
} from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { getClanTranslations } from '../src/utils/clanTranslations';

const { width } = Dimensions.get('window');

// Notification items matching design 1:1
const INITIAL_NOTIFICATIONS = [
  // --- YANGI XABARLAR ---
  {
    id: 'notif_1',
    category: 'invites',
    section: 'yangi',
    title: "Clanga qo'shilish so'rovi",
    subtitle: "Jasur_uz clanga qo'shilishni so'radi.",
    time: "2 daqiqa oldin",
    isUnread: true,
    isJoinRequest: true,
    applicantName: "Jasur_uz",
    requestStatus: 'pending', // 'pending' | 'accepted' | 'rejected'
    avatarSource: require('../assets/clan_avatar_1.png'),
    iconType: 'user-plus',
    iconFamily: 'feather',
    iconBg: 'rgba(168, 85, 247, 0.18)',
    iconBorder: 'rgba(168, 85, 247, 0.4)',
    iconColor: '#C084FC',
  },
  {
    id: 'notif_2',
    category: 'missions',
    section: 'yangi',
    title: "Clan missiyasi yangilandi",
    subtitle: 'Yangi jamoaviy vazifa qo\'shildi: "100 ta masala yechish".',
    time: "12 daqiqa oldin",
    isUnread: true,
    isJoinRequest: false,
    iconType: 'target',
    iconFamily: 'materialCommunity',
    iconBg: 'rgba(16, 185, 129, 0.16)',
    iconBorder: 'rgba(16, 185, 129, 0.35)',
    iconColor: '#10B981',
  },
  {
    id: 'notif_3',
    category: 'season',
    section: 'yangi',
    title: "Season 5 boshlandi!",
    subtitle: "Yangi mavsum start oldi. Katta mukofotlar sizni kutmoqda.",
    time: "27 daqiqa oldin",
    isUnread: true,
    isJoinRequest: false,
    iconType: 'crown',
    iconFamily: 'materialCommunity',
    iconBg: 'rgba(245, 158, 11, 0.16)',
    iconBorder: 'rgba(245, 158, 11, 0.35)',
    iconColor: '#F59E0B',
  },

  // --- OLDINGI XABARLAR ---
  {
    id: 'notif_4',
    category: 'system',
    section: 'oldingi',
    title: "Clan mukofoti ochildi",
    subtitle: "Haftalik vazifalar to'liq bajarildi. Mukofotni olish mumkin!",
    time: "2 soat oldin",
    isUnread: false,
    isJoinRequest: false,
    iconType: 'gift',
    iconFamily: 'feather',
    iconBg: 'rgba(217, 70, 239, 0.16)',
    iconBorder: 'rgba(217, 70, 239, 0.35)',
    iconColor: '#D946EF',
  },
  {
    id: 'notif_5',
    category: 'system',
    section: 'oldingi',
    title: "Reytingda o'zgarish",
    subtitle: "Claningiz global reytingda +3 pog'onaga ko'tarildi.",
    time: "5 soat oldin",
    isUnread: false,
    isJoinRequest: false,
    iconType: 'trophy',
    iconFamily: 'ionicons',
    iconBg: 'rgba(245, 158, 11, 0.16)',
    iconBorder: 'rgba(245, 158, 11, 0.35)',
    iconColor: '#F59E0B',
  },
  {
    id: 'notif_6',
    category: 'system',
    section: 'oldingi',
    title: "Clan XP yangilandi",
    subtitle: "Claningiz +250 XP oldi. (Jami: 7,250 XP)",
    time: "7 soat oldin",
    isUnread: false,
    isJoinRequest: false,
    iconType: 'layers',
    iconFamily: 'ionicons',
    iconBg: 'rgba(56, 189, 248, 0.16)',
    iconBorder: 'rgba(56, 189, 248, 0.35)',
    iconColor: '#38BDF8',
  },
  {
    id: 'notif_7',
    category: 'invites',
    section: 'oldingi',
    title: "Yangi a'zo qo'shildi",
    subtitle: "Sardor clanga qo'shildi.",
    time: "10 soat oldin",
    isUnread: false,
    isJoinRequest: false,
    iconType: 'person-add',
    iconFamily: 'ionicons',
    iconBg: 'rgba(168, 85, 247, 0.16)',
    iconBorder: 'rgba(168, 85, 247, 0.35)',
    iconColor: '#C084FC',
  },
  {
    id: 'notif_8',
    category: 'system',
    section: 'oldingi',
    title: "Achievement",
    subtitle: 'Claningiz "Faol jamoa" yutug\'ini qo\'lga kiritdi!',
    time: "Kecha, 21:14",
    isUnread: false,
    isJoinRequest: false,
    iconType: 'star-outline',
    iconFamily: 'ionicons',
    iconBg: 'rgba(52, 211, 153, 0.16)',
    iconBorder: 'rgba(52, 211, 153, 0.35)',
    iconColor: '#34D399',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Barchasi', icon: 'bell', family: 'feather' },
  { id: 'invites', label: 'Takliflar', icon: 'users', family: 'feather' },
  { id: 'missions', label: 'Missions', icon: 'target', family: 'materialCommunity' },
  { id: 'season', label: 'Season', icon: 'trophy-outline', family: 'ionicons' },
  { id: 'system', label: 'Tizim', icon: 'layers', family: 'feather' },
];

export default function ClanNotificationsScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const language = route?.params?.language || 'uz';
  const t = getClanTranslations(language);
  const [activeCategory, setActiveCategory] = useState('all');
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  // Settings toggles
  const [settings, setSettings] = useState({
    invites: true,
    missions: true,
    seasons: true,
    achievements: true,
    sound: true,
  });

  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
  };

  // Mark all unread notifications as read
  const handleMarkAllAsRead = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {}
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, isUnread: false }))
    );
  };

  // Accept join request
  const handleAcceptRequest = (id, name) => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {}
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, requestStatus: 'accepted', isUnread: false } : item
      )
    );
    Alert.alert(
      "Qabul qilindi! 🎉",
      `${name} muvaffaqiyatli clanga qabul qilindi va jamoa a'zosiga aylandi!`
    );
  };

  // Reject join request
  const handleRejectRequest = (id, name) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {}
    Alert.alert(
      "So'rovni rad etish",
      `${name} ning clanga qo'shilish so'rovini rad etishni xohlaysizmi?`,
      [
        { text: "Bekor qilish", style: "cancel" },
        {
          text: "Rad etish",
          style: "destructive",
          onPress: () => {
            setNotifications((prev) =>
              prev.map((item) =>
                item.id === id ? { ...item, requestStatus: 'rejected', isUnread: false } : item
              )
            );
          },
        },
      ]
    );
  };

  // Handle notification card click
  const handleNotificationPress = (notif) => {
    triggerHaptic();
    if (notif.isUnread) {
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notif.id ? { ...item, isUnread: false } : item
        )
      );
    }

    if (notif.category === 'missions') {
      navigation.navigate('ClanMissionsScreen');
    } else if (notif.category === 'season') {
      navigation.navigate('ClanLeaderboardScreen');
    } else if (notif.category === 'system' && notif.title.includes('Reyting')) {
      navigation.navigate('ClanLeaderboardScreen');
    } else if (notif.category === 'system' && notif.title.includes('mukofot')) {
      navigation.navigate('ClanActivityScreen');
    } else {
      Alert.alert(notif.title, notif.subtitle);
    }
  };

  // Render Icon helper
  const renderCardIcon = (notif) => {
    const size = 20;
    if (notif.iconFamily === 'materialCommunity') {
      return <MaterialCommunityIcons name={notif.iconType} size={size} color={notif.iconColor} />;
    } else if (notif.iconFamily === 'ionicons') {
      return <Ionicons name={notif.iconType} size={size} color={notif.iconColor} />;
    }
    return <Feather name={notif.iconType} size={size} color={notif.iconColor} />;
  };

  // Filtered notifications
  const filteredList = notifications.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const yangiItems = filteredList.filter((item) => item.section === 'yangi');
  const oldingiItems = filteredList.filter((item) => item.section === 'oldingi');

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Ambient background glow */}
      <LinearGradient
        colors={['#170F38', '#0A081C', '#070814']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* TOP HEADER */}
        <View style={styles.headerRow}>
          {/* Back button */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.backCircleBtn}
            onPress={() => {
              triggerHaptic();
              navigation.goBack();
            }}
          >
            <Feather name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Title & Subtitle */}
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>{t.notifications || 'Xabarnomalar'}</Text>
            <Text style={styles.headerSubtitle}>Clan bilan bog'liq barcha xabarlar</Text>
          </View>

          {/* Header Action Buttons */}
          <View style={styles.headerRightActions}>
            {/* Mark all as read button */}
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.headerActionBtn}
              onPress={handleMarkAllAsRead}
            >
              <Feather name="check" size={19} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Notification settings button */}
            <TouchableOpacity
              activeOpacity={0.75}
              style={[styles.headerActionBtn, { marginLeft: 10 }]}
              onPress={() => {
                triggerHaptic();
                setSettingsModalVisible(true);
              }}
            >
              <Feather name="settings" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* CATEGORY FILTER TABS (Pills) */}
        <View style={styles.categoriesWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  activeOpacity={0.8}
                  style={styles.categoryPill}
                  onPress={() => {
                    triggerHaptic();
                    setActiveCategory(cat.id);
                  }}
                >
                  {isActive ? (
                    <LinearGradient
                      colors={['#8B5CF6', '#6D28D9']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.categoryActiveGradient}
                    >
                      {cat.family === 'materialCommunity' ? (
                        <MaterialCommunityIcons name={cat.icon} size={15} color="#FFFFFF" />
                      ) : cat.family === 'ionicons' ? (
                        <Ionicons name={cat.icon} size={15} color="#FFFFFF" />
                      ) : (
                        <Feather name={cat.icon} size={15} color="#FFFFFF" />
                      )}
                      <Text style={styles.categoryTextActive}>{cat.label}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.categoryInactiveBox}>
                      {cat.family === 'materialCommunity' ? (
                        <MaterialCommunityIcons name={cat.icon} size={15} color="#94A3B8" />
                      ) : cat.family === 'ionicons' ? (
                        <Ionicons name={cat.icon} size={15} color="#94A3B8" />
                      ) : (
                        <Feather name={cat.icon} size={15} color="#94A3B8" />
                      )}
                      <Text style={styles.categoryTextInactive}>{cat.label}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* NOTIFICATIONS LIST */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) + 16 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* SECTION 1: YANGI XABARLAR */}
          {yangiItems.length > 0 && (
            <View style={styles.sectionWrap}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Yangi xabarlar</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleMarkAllAsRead}
                  hitSlop={{ top: 8, bottom: 8, left: 10, right: 10 }}
                >
                  <Text style={styles.sectionReadAction}>Barchasini o'qish ›</Text>
                </TouchableOpacity>
              </View>

              {yangiItems.map((item) => {
                // SPECIAL CARD: JOIN REQUEST
                if (item.isJoinRequest) {
                  return (
                    <View key={item.id} style={styles.joinRequestCard}>
                      <View style={styles.joinCardTopRow}>
                        {/* Dual icon + avatar */}
                        <View style={styles.joinAvatarGroup}>
                          <View
                            style={[
                              styles.iconBoxCircle,
                              {
                                backgroundColor: item.iconBg,
                                borderColor: item.iconBorder,
                                marginRight: 8,
                              },
                            ]}
                          >
                            <Feather name="user-plus" size={17} color={item.iconColor} />
                          </View>
                          <Image
                            source={item.avatarSource}
                            style={styles.joinUserAvatar}
                            contentFit="cover"
                          />
                        </View>

                        {/* Title, time, and subtitle */}
                        <View style={styles.cardMainCol}>
                          <View style={styles.cardTopRow}>
                            <Text style={styles.cardTitle} numberOfLines={1}>
                              {item.title}
                            </Text>
                            <View style={styles.timeWithDotWrap}>
                              <Text style={styles.timeText}>{item.time}</Text>
                              {item.isUnread && <View style={styles.unreadDot} />}
                            </View>
                          </View>
                          <Text style={styles.cardSubtitle} numberOfLines={2}>
                            {item.subtitle}
                          </Text>
                        </View>
                      </View>

                      {/* Bottom Action Buttons or Status */}
                      {item.requestStatus === 'pending' ? (
                        <View style={styles.joinActionsRow}>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.acceptBtn}
                            onPress={() => handleAcceptRequest(item.id, item.applicantName)}
                          >
                            <LinearGradient
                              colors={['#8B5CF6', '#6D28D9']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={styles.acceptBtnGradient}
                            >
                              <Feather name="check" size={15} color="#FFFFFF" />
                              <Text style={styles.acceptBtnText}>Qabul qilish</Text>
                            </LinearGradient>
                          </TouchableOpacity>

                          <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.rejectBtn}
                            onPress={() => handleRejectRequest(item.id, item.applicantName)}
                          >
                            <Feather name="x" size={15} color="#E2E8F0" />
                            <Text style={styles.rejectBtnText}>Rad etish</Text>
                          </TouchableOpacity>
                        </View>
                      ) : item.requestStatus === 'accepted' ? (
                        <View style={styles.statusBadgeAccepted}>
                          <Feather name="check-circle" size={15} color="#34D399" />
                          <Text style={styles.statusAcceptedText}>Clanga qabul qilindi</Text>
                        </View>
                      ) : (
                        <View style={styles.statusBadgeRejected}>
                          <Feather name="x-circle" size={15} color="#F87171" />
                          <Text style={styles.statusRejectedText}>So'rov rad etildi</Text>
                        </View>
                      )}
                    </View>
                  );
                }

                // STANDARD CARD FOR YANGI
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.82}
                    style={styles.standardCard}
                    onPress={() => handleNotificationPress(item)}
                  >
                    <View
                      style={[
                        styles.iconBoxCircle,
                        { backgroundColor: item.iconBg, borderColor: item.iconBorder },
                      ]}
                    >
                      {renderCardIcon(item)}
                    </View>

                    <View style={styles.cardMainCol}>
                      {/* Top line: Title & Time */}
                      <View style={styles.cardTopRow}>
                        <Text style={styles.cardTitle} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <View style={styles.timeWithDotWrap}>
                          <Text style={styles.timeText}>{item.time}</Text>
                          {item.isUnread && <View style={styles.unreadDot} />}
                        </View>
                      </View>

                      {/* Bottom line: Subtitle & Chevron */}
                      <View style={styles.cardBottomRow}>
                        <Text style={styles.cardSubtitle} numberOfLines={2}>
                          {item.subtitle}
                        </Text>
                        <Feather name="chevron-right" size={17} color="#64748B" style={styles.chevron} />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* SECTION 2: OLDINGI XABARLAR */}
          {oldingiItems.length > 0 && (
            <View style={[styles.sectionWrap, yangiItems.length > 0 && { marginTop: 22 }]}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitleOld}>Oldingi xabarlar</Text>
              </View>

              {oldingiItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.82}
                  style={styles.standardCard}
                  onPress={() => handleNotificationPress(item)}
                >
                  <View
                    style={[
                      styles.iconBoxCircle,
                      { backgroundColor: item.iconBg, borderColor: item.iconBorder },
                    ]}
                  >
                    {renderCardIcon(item)}
                  </View>

                  <View style={styles.cardMainCol}>
                    {/* Top line: Title & Time */}
                    <View style={styles.cardTopRow}>
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.timeText}>{item.time}</Text>
                    </View>

                    {/* Bottom line: Subtitle & Chevron */}
                    <View style={styles.cardBottomRow}>
                      <Text style={styles.cardSubtitle} numberOfLines={2}>
                        {item.subtitle}
                      </Text>
                      <Feather name="chevron-right" size={17} color="#64748B" style={styles.chevron} />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* EMPTY STATE IF FILTER HAS NO ITEMS */}
          {filteredList.length === 0 && (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Feather name="bell-off" size={32} color="#64748B" />
              </View>
              <Text style={styles.emptyTitle}>Bildirishnomalar topilmadi</Text>
              <Text style={styles.emptySubtitle}>
                Ushbu bo'limda hozircha hech qanday bildirishnoma mavjud emas.
              </Text>
            </View>
          )}
        </ScrollView>

        {/* NOTIFICATION SETTINGS MODAL */}
        <Modal
          visible={settingsModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setSettingsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={StyleSheet.absoluteFillObject}
              activeOpacity={1}
              onPress={() => setSettingsModalVisible(false)}
            />
            <View style={styles.modalCard}>
              {/* Modal header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Bildirishnoma Sozlamalari</Text>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setSettingsModalVisible(false)}
                >
                  <Feather name="x" size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              {/* Toggles */}
              <View style={styles.modalRow}>
                <View style={styles.modalRowText}>
                  <Text style={styles.modalRowTitle}>Takliflar va so'rovlar</Text>
                  <Text style={styles.modalRowDesc}>Clanga qo'shilish va takliflar</Text>
                </View>
                <Switch
                  value={settings.invites}
                  onValueChange={(val) => setSettings((s) => ({ ...s, invites: val }))}
                  trackColor={{ false: '#262840', true: '#8B5CF6' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.modalRow}>
                <View style={styles.modalRowText}>
                  <Text style={styles.modalRowTitle}>Missiyalar va vazifalar</Text>
                  <Text style={styles.modalRowDesc}>Jamoaviy topshiriqlar yangilanganda</Text>
                </View>
                <Switch
                  value={settings.missions}
                  onValueChange={(val) => setSettings((s) => ({ ...s, missions: val }))}
                  trackColor={{ false: '#262840', true: '#8B5CF6' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.modalRow}>
                <View style={styles.modalRowText}>
                  <Text style={styles.modalRowTitle}>Mavsum va reytinglar</Text>
                  <Text style={styles.modalRowDesc}>Reyting o'zgarishi va yangi mavsumlar</Text>
                </View>
                <Switch
                  value={settings.seasons}
                  onValueChange={(val) => setSettings((s) => ({ ...s, seasons: val }))}
                  trackColor={{ false: '#262840', true: '#8B5CF6' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.modalRow}>
                <View style={styles.modalRowText}>
                  <Text style={styles.modalRowTitle}>Mukofotlar va yutuqlar</Text>
                  <Text style={styles.modalRowDesc}>Erishilgan achievement va sandiqlar</Text>
                </View>
                <Switch
                  value={settings.achievements}
                  onValueChange={(val) => setSettings((s) => ({ ...s, achievements: val }))}
                  trackColor={{ false: '#262840', true: '#8B5CF6' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={[styles.modalRow, { borderBottomWidth: 0 }]}>
                <View style={styles.modalRowText}>
                  <Text style={styles.modalRowTitle}>Ovozli bildirishnomalar</Text>
                  <Text style={styles.modalRowDesc}>Xabarlar kelganda signal chalish</Text>
                </View>
                <Switch
                  value={settings.sound}
                  onValueChange={(val) => setSettings((s) => ({ ...s, sound: val }))}
                  trackColor={{ false: '#262840', true: '#8B5CF6' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* Close Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.modalSaveBtn}
                onPress={() => {
                  triggerHaptic();
                  setSettingsModalVisible(false);
                }}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#6D28D9']}
                  style={styles.modalSaveGradient}
                >
                  <Text style={styles.modalSaveText}>Saqlash</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#070814',
  },
  safeArea: {
    flex: 1,
  },

  /* Top Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  backCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 21,
    fontFamily: 'Inter_900Black',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginTop: 2,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Category Filter Tabs (Pills) */
  categoriesWrap: {
    marginTop: 10,
    marginBottom: 12,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  categoryActiveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryInactiveBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#121028',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  categoryTextActive: {
    fontSize: 12.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  categoryTextInactive: {
    fontSize: 12.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#94A3B8',
    marginLeft: 6,
  },

  /* Notifications Scroll Area */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },

  /* Section Header */
  sectionWrap: {
    width: '100%',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  sectionTitleOld: {
    fontSize: 14.5,
    fontFamily: 'Inter_700Bold',
    color: '#CBD5E1',
    letterSpacing: 0.1,
  },
  sectionReadAction: {
    fontSize: 12.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#C084FC',
  },

  /* Standard Notification Card */
  standardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121028',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  iconBoxCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardMainCol: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    flex: 1,
    fontSize: 13.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    paddingRight: 6,
  },
  timeWithDotWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#C084FC',
    marginLeft: 6,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  cardSubtitle: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    lineHeight: 16,
    paddingRight: 8,
  },
  chevron: {
    marginLeft: 4,
  },

  /* Special Join Request Card */
  joinRequestCard: {
    backgroundColor: '#131030',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.22)',
    borderRadius: 16,
    padding: 13,
    marginBottom: 10,
  },
  joinCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinAvatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  joinUserAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#8B5CF6',
  },
  joinActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  acceptBtn: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  acceptBtnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  acceptBtnText: {
    fontSize: 12.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  rejectBtn: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#171433',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  rejectBtnText: {
    fontSize: 12.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#E2E8F0',
  },
  statusBadgeAccepted: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.25)',
    borderRadius: 12,
    paddingVertical: 7,
    marginTop: 10,
  },
  statusAcceptedText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#34D399',
  },
  statusBadgeRejected: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.25)',
    borderRadius: 12,
    paddingVertical: 7,
    marginTop: 10,
  },
  statusRejectedText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#F87171',
  },

  /* Empty State */
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#121028',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12.5,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#12102B',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  modalRowText: {
    flex: 1,
    paddingRight: 10,
  },
  modalRowTitle: {
    fontSize: 13.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
  },
  modalRowDesc: {
    fontSize: 11.5,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    marginTop: 2,
  },
  modalSaveBtn: {
    marginTop: 18,
    borderRadius: 14,
    overflow: 'hidden',
  },
  modalSaveGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
});
