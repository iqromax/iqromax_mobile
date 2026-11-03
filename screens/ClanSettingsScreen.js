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
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Feather,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function ClanSettingsScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // Settings State
  const [clanName, setClanName] = useState('IQROMAX Clan');
  const [clanDesc, setClanDesc] = useState(
    "IQROMAX — bilim, raqobat va rivojlanish uchun birlashgan jamoa. Maqsadimiz — Season'da Top 10 ga kirish! 🚀"
  );
  const [entryType, setEntryType] = useState('Ochiq'); // 'Ochiq' | "So'rov bilan" | 'Yopiq'
  const [region, setRegion] = useState("O'zbekiston");
  const [minLevel, setMinLevel] = useState(10);

  // Modals state
  const [editInfoModal, setEditInfoModal] = useState(false);
  const [entryModal, setEntryModal] = useState(false);
  const [regionModal, setRegionModal] = useState(false);
  const [requestsModal, setRequestsModal] = useState(false);
  const [rolesModal, setRolesModal] = useState(false);

  // Mock Join Requests
  const [joinRequests, setJoinRequests] = useState([
    { id: '1', name: 'Temur_bek', level: 18, date: '1 soat oldin' },
    { id: '2', name: 'Shaxzod_99', level: 15, date: '3 soat oldin' },
  ]);

  const triggerHaptic = (type = 'light') => {
    try {
      if (type === 'medium') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (e) {}
  };

  const handleLeaveClan = () => {
    triggerHaptic('medium');
    Alert.alert(
      "Clan'dan chiqish",
      "Haqiqatan ham clanni tark etmoqchimisiz? Barcha to'plangan Clan XP va mavsumiy mukofotlar yo'qotilishi mumkin.",
      [
        { text: 'Bekor qilish', style: 'cancel' },
        {
          text: 'Chiqish',
          style: 'destructive',
          onPress: () => {
            triggerHaptic('medium');
            Alert.alert("Clan tark etildi", "Siz clanni tark etdingiz.");
            navigation.navigate('ClanHomeScreen', { initialTab: 'Home' });
          },
        },
      ]
    );
  };

  const handleDisbandClan = () => {
    triggerHaptic('medium');
    Alert.alert(
      "Clan'ni tarqatib yuborish",
      "DIQQAT! Clanni tarqatib yuborish barcha bazani, binolarni, to'plangan XP va a'zolar ro'yxatini butunlay o'chirib tashlaydi. Ushbu amalni qaytarib bo'lmaydi!",
      [
        { text: 'Bekor qilish', style: 'cancel' },
        {
          text: 'Tarqatib yuborish',
          style: 'destructive',
          onPress: () => {
            triggerHaptic('medium');
            Alert.alert("Clan o'chirildi", "Clan muvaffaqiyatli tarqatildi.");
            navigation.navigate('ClanHomeScreen', { initialTab: 'Home' });
          },
        },
      ]
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
            <Text style={styles.headerTitleText}>Clan Settings</Text>
            <Text style={styles.headerSubtitleText}>Clan sozlamalari va boshqaruv</Text>
          </View>

          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 20) + 16 },
          ]}
        >
          {/* 1. CLAN MA'LUMOTLARI */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              triggerHaptic();
              setEditInfoModal(true);
            }}
            style={styles.settingCard}
          >
            <View style={styles.settingIconWrap}>
              <MaterialCommunityIcons
                name="card-account-details-outline"
                size={22}
                color="#C084FC"
              />
            </View>
            <View style={styles.settingMetaCol}>
              <Text style={styles.settingTitle}>Clan ma'lumotlari</Text>
              <Text style={styles.settingSubtitle}>Nomi, tavsif, logo va banner</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* 2. KIRISH SOZLAMALARI */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              triggerHaptic();
              setEntryModal(true);
            }}
            style={styles.settingCard}
          >
            <View style={styles.settingIconWrap}>
              <Feather name="lock" size={20} color="#C084FC" />
            </View>
            <View style={styles.settingMetaCol}>
              <Text style={styles.settingTitle}>Kirish sozlamalari</Text>
              <Text style={styles.settingSubtitle}>Clan'ga qo'shilish turi va ruxsatlar</Text>
            </View>
            <Text style={styles.statusGreenText}>{entryType}</Text>
            <Feather name="chevron-right" size={18} color="#94A3B8" style={{ marginLeft: 6 }} />
          </TouchableOpacity>

          {/* 3. REGION VA TIL */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              triggerHaptic();
              setRegionModal(true);
            }}
            style={styles.settingCard}
          >
            <View style={styles.settingIconWrap}>
              <Ionicons name="location-outline" size={22} color="#C084FC" />
            </View>
            <View style={styles.settingMetaCol}>
              <Text style={styles.settingTitle}>Region va til</Text>
              <Text style={styles.settingSubtitle}>Mamlakat va mintaqa</Text>
            </View>
            <Text style={styles.statusGreenText}>{region}</Text>
            <Feather name="chevron-right" size={18} color="#94A3B8" style={{ marginLeft: 6 }} />
          </TouchableOpacity>

          {/* 4. ARIZALAR VA TAKLIFLAR */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              triggerHaptic();
              navigation.navigate('ClanManagementScreen');
            }}
            style={styles.settingCard}
          >
            <View style={styles.settingIconWrap}>
              <Ionicons name="people-outline" size={22} color="#C084FC" />
            </View>
            <View style={styles.settingMetaCol}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.settingTitle}>Arizalar va takliflar</Text>
                {joinRequests.length > 0 && (
                  <View style={styles.requestCountBadge}>
                    <Text style={styles.requestCountText}>{joinRequests.length}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.settingSubtitle}>A'zolik arizalari va takliflar</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* 5. ROL VA RUXSATLAR */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              triggerHaptic();
              setRolesModal(true);
            }}
            style={styles.settingCard}
          >
            <View style={styles.settingIconWrap}>
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={22}
                color="#C084FC"
              />
            </View>
            <View style={styles.settingMetaCol}>
              <Text style={styles.settingTitle}>Rol va ruxsatlar</Text>
              <Text style={styles.settingSubtitle}>A'zolar rollari va imkoniyatlari</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* 6. CLAN'DAN CHIQISH (Danger) */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLeaveClan}
            style={styles.dangerCard}
          >
            <View style={styles.dangerIconWrap}>
              <Feather name="log-out" size={20} color="#F87171" />
            </View>
            <View style={styles.settingMetaCol}>
              <Text style={styles.dangerTitle}>Clan'dan chiqish</Text>
              <Text style={styles.dangerSubtitle}>Clan a'zoligini tark etish</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* 7. CLAN'NI TARQATIB YUBORISH (Critical Danger) */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleDisbandClan}
            style={styles.criticalCard}
          >
            <View style={styles.criticalIconWrap}>
              <Feather name="trash-2" size={20} color="#EF4444" />
            </View>
            <View style={styles.settingMetaCol}>
              <Text style={styles.criticalTitle}>Clan'ni tarqatib yuborish</Text>
              <Text style={styles.criticalSubtitle}>Barcha ma'lumotlar o'chiriladi</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      {/* 1. EDIT CLAN INFO MODAL */}
      <Modal
        visible={editInfoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEditInfoModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Clan ma'lumotlari</Text>
              <TouchableOpacity onPress={() => setEditInfoModal(false)}>
                <Feather name="x" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Clan nomi:</Text>
            <TextInput
              value={clanName}
              onChangeText={setClanName}
              style={styles.modalInput}
              placeholderTextColor="#64748B"
            />

            <Text style={styles.inputLabel}>Clan tavsifi:</Text>
            <TextInput
              value={clanDesc}
              onChangeText={setClanDesc}
              multiline
              style={[styles.modalInput, { height: 75, textAlignVertical: 'top' }]}
              placeholderTextColor="#64748B"
            />

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modalPrimaryBtn}
              onPress={() => {
                triggerHaptic();
                setEditInfoModal(false);
                Alert.alert("Saqlandi", "Clan ma'lumotlari yangilandi!");
              }}
            >
              <Text style={styles.modalPrimaryBtnText}>Saqlash</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 2. ENTRY SETTINGS MODAL */}
      <Modal
        visible={entryModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEntryModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kirish sozlamalari</Text>
              <TouchableOpacity onPress={() => setEntryModal(false)}>
                <Feather name="x" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubHead}>Qo'shilish turi:</Text>
            {['Ochiq', "So'rov bilan", 'Yopiq'].map((type) => (
              <TouchableOpacity
                key={type}
                activeOpacity={0.7}
                onPress={() => {
                  triggerHaptic();
                  setEntryType(type);
                }}
                style={[
                  styles.optionSelectRow,
                  entryType === type && styles.optionSelectRowActive,
                ]}
              >
                <Text style={styles.optionSelectText}>{type}</Text>
                {entryType === type && (
                  <Ionicons name="checkmark-circle" size={18} color="#C084FC" />
                )}
              </TouchableOpacity>
            ))}

            <Text style={[styles.modalSubHead, { marginTop: 14 }]}>
              Minimal daraja talabi: (Lv.{minLevel})
            </Text>
            <View style={styles.levelButtonsRow}>
              {[5, 10, 15, 20].map((lvl) => (
                <TouchableOpacity
                  key={lvl}
                  onPress={() => {
                    triggerHaptic();
                    setMinLevel(lvl);
                  }}
                  style={[
                    styles.levelPillBtn,
                    minLevel === lvl && styles.levelPillBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.levelPillText,
                      minLevel === lvl && styles.levelPillTextActive,
                    ]}
                  >
                    Lv.{lvl}+
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modalPrimaryBtn}
              onPress={() => {
                triggerHaptic();
                setEntryModal(false);
              }}
            >
              <Text style={styles.modalPrimaryBtnText}>Tasdiqlash</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 3. REGION MODAL */}
      <Modal
        visible={regionModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setRegionModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Region va hudud</Text>
              <TouchableOpacity onPress={() => setRegionModal(false)}>
                <Feather name="x" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {["O'zbekiston", "Qozog'iston", "Qirg'iziston", "Global"].map((item) => (
              <TouchableOpacity
                key={item}
                activeOpacity={0.7}
                onPress={() => {
                  triggerHaptic();
                  setRegion(item);
                  setRegionModal(false);
                }}
                style={[
                  styles.optionSelectRow,
                  region === item && styles.optionSelectRowActive,
                ]}
              >
                <Text style={styles.optionSelectText}>{item}</Text>
                {region === item && (
                  <Ionicons name="checkmark-circle" size={18} color="#C084FC" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* 4. ARIZALAR MODAL */}
      <Modal
        visible={requestsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setRequestsModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Clan Arizalari ({joinRequests.length})</Text>
              <TouchableOpacity onPress={() => setRequestsModal(false)}>
                <Feather name="x" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {joinRequests.length === 0 ? (
              <Text style={styles.emptyRequestsText}>Yangi arizalar mavjud emas.</Text>
            ) : (
              joinRequests.map((req) => (
                <View key={req.id} style={styles.requestItemRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.requestItemName}>{req.name}</Text>
                    <Text style={styles.requestItemMeta}>
                      Lv.{req.level} • {req.date}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                      onPress={() => {
                        triggerHaptic();
                        setJoinRequests((prev) => prev.filter((r) => r.id !== req.id));
                        Alert.alert("Rad etildi", `${req.name} arizasi rad etildi.`);
                      }}
                      style={styles.requestRejectBtn}
                    >
                      <Feather name="x" size={16} color="#EF4444" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        triggerHaptic('medium');
                        setJoinRequests((prev) => prev.filter((r) => r.id !== req.id));
                        Alert.alert("Qabul qilindi", `${req.name} clanga qabul qilindi! 🎉`);
                      }}
                      style={styles.requestAcceptBtn}
                    >
                      <Feather name="check" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modalPrimaryBtn}
              onPress={() => setRequestsModal(false)}
            >
              <Text style={styles.modalPrimaryBtnText}>Yopish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 5. ROLES MODAL */}
      <Modal
        visible={rolesModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setRolesModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rol va ruxsatlar</Text>
              <TouchableOpacity onPress={() => setRolesModal(false)}>
                <Feather name="x" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.roleItemBox}>
              <Text style={styles.roleTitleCreator}>👑 Creator (Lider)</Text>
              <Text style={styles.roleDesc}>
                Barcha boshqaruv: nom, tavsif, a'zolarni qabul qilish va chiqarish, binolarni yangilash, clanni tarqatish.
              </Text>
            </View>

            <View style={styles.roleItemBox}>
              <Text style={styles.roleTitleCoLeader}>🛡️ Co-Leader (Ham-lider)</Text>
              <Text style={styles.roleDesc}>
                Arizalarni qabul qilish, missiyalarni faollashtirish va a'zolarni tartibga chaqirish.
              </Text>
            </View>

            <View style={styles.roleItemBox}>
              <Text style={styles.roleTitleMember}>⚔️ Member (A'zo)</Text>
              <Text style={styles.roleDesc}>
                Clan musobaqalarida qatnashish, Clan XP to'plash va bazadan passiv bonuslar olish.
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modalPrimaryBtn}
              onPress={() => setRolesModal(false)}
            >
              <Text style={styles.modalPrimaryBtnText}>Tushunarli</Text>
            </TouchableOpacity>
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

  // SCROLL CONTENT
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  // SETTINGS CARDS
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 15, 42, 0.85)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.22)',
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  settingIconWrap: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingMetaCol: {
    flex: 1,
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  statusGreenText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#34D399',
    marginRight: 2,
  },
  requestCountBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
  },
  requestCountText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // DANGER CARD
  dangerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.08)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    marginTop: 4,
  },
  dangerIconWrap: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dangerTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#F87171',
  },
  dangerSubtitle: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 2,
  },

  // CRITICAL CARD
  criticalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  criticalIconWrap: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  criticalTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#EF4444',
  },
  criticalSubtitle: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 2,
  },

  // MODALS
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
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CBD5E1',
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    borderRadius: 12,
    color: '#FFFFFF',
    padding: 12,
    fontSize: 13.5,
    marginBottom: 12,
  },
  modalPrimaryBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  modalPrimaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalSubHead: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#CBD5E1',
    marginBottom: 8,
  },
  optionSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  optionSelectRowActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 1,
    borderColor: '#A855F7',
  },
  optionSelectText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  levelButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  levelPillBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  levelPillBtnActive: {
    backgroundColor: '#7C3AED',
  },
  levelPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  levelPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  emptyRequestsText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    paddingVertical: 20,
  },
  requestItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  requestItemName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  requestItemMeta: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  requestRejectBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  requestAcceptBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleItemBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  roleTitleCreator: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FBBF24',
    marginBottom: 3,
  },
  roleTitleCoLeader: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#C084FC',
    marginBottom: 3,
  },
  roleTitleMember: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#CBD5E1',
    marginBottom: 3,
  },
  roleDesc: {
    fontSize: 11.5,
    color: '#94A3B8',
    lineHeight: 16,
  },
});

