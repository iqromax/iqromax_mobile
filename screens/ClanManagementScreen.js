import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Modal,
  Alert,
  TextInput,
  Switch,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Feather,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { getClanTranslations } from '../src/utils/clanTranslations';

const { width } = Dimensions.get('window');

// 3 APPLICANTS DATA (matching mockup)
const INITIAL_APPLICANTS = [
  {
    id: '1',
    name: 'Bekzod_17',
    level: 24,
    xp: '12,400 XP',
    avatar: require('../assets/avatar_maks.png'),
    winRate: '78%',
    totalWins: 34,
  },
  {
    id: '2',
    name: 'Malika_uz',
    level: 22,
    xp: '10,800 XP',
    avatar: require('../assets/avatar_lily.jpg'),
    winRate: '72%',
    totalWins: 29,
  },
  {
    id: '3',
    name: 'Javohir',
    level: 26,
    xp: '15,200 XP',
    avatar: require('../assets/avatar_kevin.png'),
    winRate: '81%',
    totalWins: 42,
  },
];

// 2 SENT INVITES DATA (matching mockup)
const INITIAL_INVITES = [
  {
    id: '1',
    name: 'Adham_01',
    time: '2 soat oldin',
    avatar: require('../assets/avatar_maya.jpg'),
  },
  {
    id: '2',
    name: 'Sevara',
    time: '5 soat oldin',
    avatar: require('../assets/avatar_sophia.png'),
  },
];

export default function ClanManagementScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const user = route?.params?.user;
  const language = route?.params?.language || user?.language || 'uz';
  const t = getClanTranslations(language);

  const [activeTab, setActiveTab] = useState('arizalar'); // 'arizalar' | 'takliflar' | 'boshqaruv'
  const [applicants, setApplicants] = useState(INITIAL_APPLICANTS);
  const [invites, setInvites] = useState(INITIAL_INVITES);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // Management controls state
  const [entryType, setEntryType] = useState('So\'rov bilan'); // 'Ochiq' | "So'rov bilan" | 'Yopiq'
  const [autoAccept, setAutoAccept] = useState(false);
  const [minLevel, setMinLevel] = useState(15);
  const [searchQuery, setSearchQuery] = useState('');

  const triggerHaptic = (type = 'light') => {
    try {
      if (type === 'medium') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (e) {}
  };

  const handleAcceptApplicant = (item) => {
    triggerHaptic('medium');
    setApplicants((prev) => prev.filter((a) => a.id !== item.id));
    Alert.alert(
      "A'zo qabul qilindi!",
      `${item.name} clanga muvaffaqiyatli qabul qilindi! 🎉`
    );
  };

  const handleRejectApplicant = (item) => {
    triggerHaptic('light');
    setApplicants((prev) => prev.filter((a) => a.id !== item.id));
    Alert.alert(
      "Ariza rad etildi",
      `${item.name} ning arizasi rad etildi.`
    );
  };

  const handleCancelInvite = (item) => {
    triggerHaptic('light');
    setInvites((prev) => prev.filter((inv) => inv.id !== item.id));
    Alert.alert(
      "Taklif bekor qilindi",
      `${item.name} ga yuborilgan taklif bekor qilindi.`
    );
  };

  const handleSendNewInvite = () => {
    if (!searchQuery.trim()) {
      Alert.alert('Xatolik', 'Iltimos, o\'yinchi ID yoki ismini kiriting.');
      return;
    }
    triggerHaptic('medium');
    const newInv = {
      id: Date.now().toString(),
      name: searchQuery.trim(),
      time: 'Hozirgina',
      avatar: require('../assets/avatar_alex.jpg'),
    };
    setInvites((prev) => [newInv, ...prev]);
    setSearchQuery('');
    Alert.alert(
      "Taklif yuborildi!",
      `${newInv.name} ga taklif muvaffaqiyatli yuborildi!`
    );
  };

  return (
    <View style={styles.screenRoot}>
      <StatusBar barStyle="light-content" backgroundColor="#070814" />

      {/* Atmospheric Background */}
      <LinearGradient
        colors={['#0F0C22', '#070814', '#06050C']}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* 1. TOP HEADER */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.headerIconButton}
            onPress={() => {
              triggerHaptic();
              navigation.goBack();
            }}
          >
            <Feather name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitleText}>{t.clanManagementTitle}</Text>
            <Text style={styles.headerSubtitleText}>
              {t.clanManagementSubtitle}
            </Text>
          </View>

          <View style={{ width: 40 }} />
        </View>

        {/* 2. SECTION TABS ROW (Arizalar | Takliflar | Boshqaruv) */}
        <View style={styles.tabsContainer}>
          {/* Tab 1: Arizalar */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              triggerHaptic();
              setActiveTab('arizalar');
            }}
            style={styles.tabTouchable}
          >
            {activeTab === 'arizalar' ? (
              <LinearGradient
                colors={['#9333EA', '#7E22CE']}
                style={styles.tabActivePill}
              >
                <Ionicons
                  name="people-outline"
                  size={16}
                  color="#FFFFFF"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.tabActiveText}>
                  {t.tabApplications} ({applicants.length})
                </Text>
              </LinearGradient>
            ) : (
              <View style={styles.tabInactivePill}>
                <Ionicons
                  name="people-outline"
                  size={16}
                  color="#94A3B8"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.tabInactiveText}>
                  {t.tabApplications} ({applicants.length})
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Tab 2: Takliflar */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              triggerHaptic();
              setActiveTab('takliflar');
            }}
            style={styles.tabTouchable}
          >
            {activeTab === 'takliflar' ? (
              <LinearGradient
                colors={['#9333EA', '#7E22CE']}
                style={styles.tabActivePill}
              >
                <Feather
                  name="send"
                  size={14}
                  color="#FFFFFF"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.tabActiveText}>
                  {t.tabSentInvites} ({invites.length})
                </Text>
              </LinearGradient>
            ) : (
              <View style={styles.tabInactivePill}>
                <Feather
                  name="send"
                  size={14}
                  color="#94A3B8"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.tabInactiveText}>
                  {t.tabSentInvites} ({invites.length})
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Tab 3: Boshqaruv */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              triggerHaptic();
              setActiveTab('boshqaruv');
            }}
            style={styles.tabTouchable}
          >
            {activeTab === 'boshqaruv' ? (
              <LinearGradient
                colors={['#9333EA', '#7E22CE']}
                style={styles.tabActivePill}
              >
                <Feather
                  name="sliders"
                  size={14}
                  color="#FFFFFF"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.tabActiveText}>{t.tabSettingsManage}</Text>
              </LinearGradient>
            ) : (
              <View style={styles.tabInactivePill}>
                <Feather
                  name="sliders"
                  size={14}
                  color="#94A3B8"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.tabInactiveText}>{t.tabSettingsManage}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 20) + 16 },
          ]}
        >
          {/* TAB 1: ARIZALAR VIEW (shows both Join Requests card & Sent Invites card as in mockup) */}
          {activeTab === 'arizalar' && (
            <>
              {/* SECTION 1: CLAN'GA QO'SHILISH ARIZALARI */}
              <View style={styles.sectionCard}>
                {/* Section Header */}
                <View style={styles.sectionHeaderRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FontAwesome5
                      name="crown"
                      size={15}
                      color="#C084FC"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.sectionTitleText}>
                      {t.incomingRequests}
                    </Text>
                  </View>
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{applicants.length}</Text>
                  </View>
                </View>

                {/* Applicants List */}
                {applicants.length === 0 ? (
                  <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>Yangi arizalar mavjud emas</Text>
                  </View>
                ) : (
                  applicants.map((item, index) => {
                    const isLast = index === applicants.length - 1;
                    return (
                      <View
                        key={item.id}
                        style={[
                          styles.applicantRow,
                          !isLast && styles.rowBorderBottom,
                        ]}
                      >
                        {/* Avatar */}
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => setSelectedApplicant(item)}
                        >
                          <Image
                            source={item.avatar}
                            style={styles.avatarImage}
                            contentFit="cover"
                          />
                        </TouchableOpacity>

                        {/* Name and Meta */}
                        <View style={styles.applicantMetaCol}>
                          <Text style={styles.applicantNameText}>
                            {item.name}
                          </Text>
                          <View style={styles.applicantStatsRow}>
                            <View style={styles.levelBadgePill}>
                              <Text style={styles.levelBadgeText}>
                                Lv.{item.level}
                              </Text>
                            </View>
                            <View style={styles.xpRow}>
                              <MaterialCommunityIcons
                                name="chart-bar"
                                size={14}
                                color="#C084FC"
                                style={{ marginRight: 4 }}
                              />
                              <Text style={styles.xpText}>{item.xp}</Text>
                            </View>
                          </View>
                        </View>

                        {/* Action Buttons: Reject & Accept */}
                        <View style={styles.actionButtonsRow}>
                          {/* Reject X Button */}
                          <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.rejectCircleBtn}
                            onPress={() => handleRejectApplicant(item)}
                          >
                            <Feather name="x" size={17} color="#FFFFFF" />
                          </TouchableOpacity>

                          {/* Accept Checkmark Button */}
                          <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.acceptCircleBtn}
                            onPress={() => handleAcceptApplicant(item)}
                          >
                            <Feather name="check" size={17} color="#FFFFFF" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>

              {/* SECTION 2: YUBORILGAN TAKLIFLAR */}
              <View style={[styles.sectionCard, { marginTop: 14 }]}>
                {/* Section Header */}
                <View style={styles.sectionHeaderRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FontAwesome5
                      name="crown"
                      size={15}
                      color="#C084FC"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.sectionTitleText}>
                      {t.sentInvites}
                    </Text>
                  </View>
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{invites.length}</Text>
                  </View>
                </View>

                {/* Invites List */}
                {invites.length === 0 ? (
                  <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>Yuborilgan takliflar yo'q</Text>
                  </View>
                ) : (
                  invites.map((item, index) => {
                    const isLast = index === invites.length - 1;
                    return (
                      <View
                        key={item.id}
                        style={[
                          styles.applicantRow,
                          !isLast && styles.rowBorderBottom,
                        ]}
                      >
                        {/* Avatar */}
                        <Image
                          source={item.avatar}
                          style={styles.avatarImage}
                          contentFit="cover"
                        />

                        {/* Name and Invite Time */}
                        <View style={styles.applicantMetaCol}>
                          <Text style={styles.applicantNameText}>
                            {item.name}
                          </Text>
                          <Text style={styles.inviteTimeSub}>
                            Taklif yuborilgan • {item.time}
                          </Text>
                        </View>

                        {/* Cancel Button */}
                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={styles.cancelInviteBtn}
                          onPress={() => handleCancelInvite(item)}
                        >
                          <Text style={styles.cancelInviteText}>
                            {t.cancel}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })
                )}
              </View>
            </>
          )}

          {/* TAB 2: TAKLIFLAR VIEW */}
          {activeTab === 'takliflar' && (
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitleText}>Yangi a'zo taklif qilish</Text>
              </View>

              {/* Search Bar */}
              <View style={styles.searchRow}>
                <Feather name="search" size={17} color="#94A3B8" style={{ marginRight: 8 }} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Foydalanuvchi nomi yoki ID..."
                  placeholderTextColor="#64748B"
                  style={styles.searchInput}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.sendInviteActionBtn}
                  onPress={handleSendNewInvite}
                >
                  <Text style={styles.sendInviteActionText}>Yuborish</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.sectionTitleText, { fontSize: 13, marginTop: 14, marginBottom: 8 }]}>
                Faol takliflar ({invites.length}):
              </Text>

              {invites.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.applicantRow,
                    index !== invites.length - 1 && styles.rowBorderBottom,
                  ]}
                >
                  <Image source={item.avatar} style={styles.avatarImage} />
                  <View style={styles.applicantMetaCol}>
                    <Text style={styles.applicantNameText}>{item.name}</Text>
                    <Text style={styles.inviteTimeSub}>Taklif yuborilgan • {item.time}</Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.cancelInviteBtn}
                    onPress={() => handleCancelInvite(item)}
                  >
                    <Text style={styles.cancelInviteText}>Bekor qilish</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* TAB 3: BOSHQARUV VIEW */}
          {activeTab === 'boshqaruv' && (
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitleText}>Tezkor qabul qilish sozlamalari</Text>
              </View>

              {/* Entry type select */}
              <Text style={styles.controlLabel}>Kirish turi:</Text>
              <View style={styles.controlPillsRow}>
                {['Ochiq', "So'rov bilan", 'Yopiq'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => {
                      triggerHaptic();
                      setEntryType(type);
                    }}
                    style={[
                      styles.controlOptionPill,
                      entryType === type && styles.controlOptionPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.controlOptionText,
                        entryType === type && styles.controlOptionTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Auto accept toggle */}
              <View style={styles.toggleRow}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.toggleTitle}>Avtomatik qabul qilish</Text>
                  <Text style={styles.toggleSub}>
                    Minimal daraja talabiga javob beruvchi o'yinchilar to'g'ridan-to'g'ri qabul qilinadi
                  </Text>
                </View>
                <Switch
                  value={autoAccept}
                  onValueChange={(val) => {
                    triggerHaptic();
                    setAutoAccept(val);
                  }}
                  trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#A855F7' }}
                  thumbColor={autoAccept ? '#FFFFFF' : '#94A3B8'}
                />
              </View>

              {/* Min level requirement */}
              <Text style={[styles.controlLabel, { marginTop: 14 }]}>
                Minimal daraja talabi: Lv.{minLevel}
              </Text>
              <View style={styles.controlPillsRow}>
                {[10, 15, 20, 25].map((lvl) => (
                  <TouchableOpacity
                    key={lvl}
                    onPress={() => {
                      triggerHaptic();
                      setMinLevel(lvl);
                    }}
                    style={[
                      styles.controlOptionPill,
                      minLevel === lvl && styles.controlOptionPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.controlOptionText,
                        minLevel === lvl && styles.controlOptionTextActive,
                      ]}
                    >
                      Lv.{lvl}+
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* APPLICANT DETAIL PREVIEW MODAL */}
      <Modal
        visible={!!selectedApplicant}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedApplicant(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {selectedApplicant && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Ariza beruvchi</Text>
                  <TouchableOpacity onPress={() => setSelectedApplicant(null)}>
                    <Feather name="x" size={20} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalApplicantTop}>
                  <Image source={selectedApplicant.avatar} style={styles.modalAvatar} />
                  <View style={{ marginLeft: 14, flex: 1 }}>
                    <Text style={styles.modalApplicantName}>{selectedApplicant.name}</Text>
                    <Text style={styles.modalApplicantSub}>Daraja: Lv.{selectedApplicant.level}</Text>
                  </View>
                </View>

                <View style={styles.applicantStatsGrid}>
                  <View style={styles.statBox}>
                    <Text style={styles.statBoxVal}>{selectedApplicant.xp}</Text>
                    <Text style={styles.statBoxLbl}>Clan XP hissasi</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statBoxVal}>{selectedApplicant.winRate}</Text>
                    <Text style={styles.statBoxLbl}>G'alaba ko'rsatkichi</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statBoxVal}>{selectedApplicant.totalWins}</Text>
                    <Text style={styles.statBoxLbl}>Jami g'alabalar</Text>
                  </View>
                </View>

                {/* Accept / Reject in Modal */}
                <View style={styles.modalActionsRow}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.modalRejectBtn}
                    onPress={() => {
                      const app = selectedApplicant;
                      setSelectedApplicant(null);
                      handleRejectApplicant(app);
                    }}
                  >
                    <Feather name="x" size={16} color="#EF4444" style={{ marginRight: 6 }} />
                    <Text style={styles.modalRejectText}>Rad etish</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.modalAcceptBtn}
                    onPress={() => {
                      const app = selectedApplicant;
                      setSelectedApplicant(null);
                      handleAcceptApplicant(app);
                    }}
                  >
                    <Feather name="check" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.modalAcceptText}>Qabul qilish</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: '#070814',
  },
  safeArea: {
    flex: 1,
  },

  // 1. HEADER
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCol: {
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  headerSubtitleText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },

  // 2. TABS CONTAINER
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 6,
  },
  tabTouchable: {
    flex: 1,
    marginHorizontal: 3,
  },
  tabActivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 18,
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  tabActiveText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  tabInactivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  tabInactiveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },

  // SCROLL CONTENT
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  // SECTION CARD
  sectionCard: {
    backgroundColor: 'rgba(20, 15, 42, 0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  countBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#7E22CE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  // APPLICANT ROW
  applicantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  avatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: 'rgba(168, 85, 247, 0.5)',
  },
  applicantMetaCol: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  applicantNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  applicantStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  levelBadgePill: {
    backgroundColor: 'rgba(126, 34, 206, 0.35)',
    borderWidth: 1,
    borderColor: '#A855F7',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginRight: 8,
  },
  levelBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#E9D5FF',
  },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  xpText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#CBD5E1',
  },

  // Action Buttons
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rejectCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  acceptCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 3,
  },

  // Yuborilgan takliflar sub & button
  inviteTimeSub: {
    fontSize: 11.5,
    color: '#94A3B8',
    marginTop: 3,
  },
  cancelInviteBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  cancelInviteText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CBD5E1',
  },

  // Empty Box
  emptyBox: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
  },

  // Search & Invite Tab
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13.5,
    paddingVertical: 8,
  },
  sendInviteActionBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  sendInviteActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Management Tab Controls
  controlLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CBD5E1',
    marginBottom: 8,
  },
  controlPillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  controlOptionPill: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  controlOptionPillActive: {
    backgroundColor: '#7C3AED',
  },
  controlOptionText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#94A3B8',
  },
  controlOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    padding: 12,
    marginTop: 4,
  },
  toggleTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  toggleSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 15,
  },

  // MODAL
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#16112C',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.35)',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalApplicantTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#A855F7',
  },
  modalApplicantName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  modalApplicantSub: {
    fontSize: 12,
    color: '#C084FC',
    marginTop: 2,
  },
  applicantStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statBoxVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FBBF24',
  },
  statBoxLbl: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    textAlign: 'center',
  },
  modalActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalRejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 14,
    paddingVertical: 12,
    marginRight: 8,
  },
  modalRejectText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#EF4444',
  },
  modalAcceptBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 14,
    paddingVertical: 12,
  },
  modalAcceptText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

