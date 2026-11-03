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
  Share,
  Alert,
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
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Polygon,
  Circle,
  G,
} from 'react-native-svg';

const { width } = Dimensions.get('window');

// 10 MEMBERS MOCK DATA (6 Online, 4 Offline)
const MEMBERS_DATA = [
  {
    id: '1',
    rank: 1,
    name: 'Ergashboy',
    role: 'Creator',
    xp: '56,400 XP',
    online: true,
    lastSeen: 'Hozir faol',
    avatar: require('../assets/avatar_maks.png'),
    level: 28,
    battleWins: 48,
    tasksCompleted: 36,
    tasksDone: 36,
    wins: 48,
    clanStreak: '21 kun',
    activityRate: '92%',
    joinDate: '15 Sen, 2026',
  },
  {
    id: '2',
    rank: 2,
    name: 'Sardor_uz',
    role: 'Co-Leader',
    xp: '48,200 XP',
    online: true,
    lastSeen: 'Hozir faol',
    avatar: require('../assets/avatar_alex.jpg'),
    level: 25,
    battleWins: 38,
    tasksCompleted: 31,
    tasksDone: 31,
    wins: 38,
    clanStreak: '18 kun',
    activityRate: '88%',
    joinDate: '18 Sen, 2026',
  },
  {
    id: '3',
    rank: 3,
    name: 'Nilufar',
    role: 'Member',
    xp: '32,800 XP',
    online: true,
    lastSeen: 'Hozir faol',
    avatar: require('../assets/avatar_lily.jpg'),
    level: 22,
    battleWins: 24,
    tasksCompleted: 26,
    tasksDone: 26,
    wins: 24,
    clanStreak: '15 kun',
    activityRate: '82%',
    joinDate: '20 Sen, 2026',
  },
  {
    id: '4',
    rank: 4,
    name: 'Azizbek',
    role: 'Member',
    xp: '28,600 XP',
    online: true,
    lastSeen: 'Hozir faol',
    avatar: require('../assets/avatar_david.jpg'),
    level: 20,
    tasksDone: 24,
    wins: 12,
  },
  {
    id: '5',
    rank: 5,
    name: 'Diyorbek',
    role: 'Member',
    xp: '24,900 XP',
    online: true,
    lastSeen: 'Hozir faol',
    avatar: require('../assets/avatar_kevin.png'),
    level: 19,
    tasksDone: 22,
    wins: 10,
  },
  {
    id: '6',
    rank: 6,
    name: 'Madina',
    role: 'Member',
    xp: '21,400 XP',
    online: true,
    lastSeen: 'Hozir faol',
    avatar: require('../assets/avatar_sophia.png'),
    level: 18,
    tasksDone: 19,
    wins: 8,
  },
  {
    id: '7',
    rank: 7,
    name: 'Jasur',
    role: 'Member',
    xp: '18,200 XP',
    online: false,
    lastSeen: '2 soat oldin',
    avatar: require('../assets/avatar_alex.jpg'),
    level: 17,
    tasksDone: 16,
    wins: 7,
  },
  {
    id: '8',
    rank: 8,
    name: 'Zilola',
    role: 'Member',
    xp: '15,700 XP',
    online: false,
    lastSeen: '5 soat oldin',
    avatar: require('../assets/avatar_maya.jpg'),
    level: 15,
    tasksDone: 14,
    wins: 5,
  },
  {
    id: '9',
    rank: 9,
    name: 'Bekzod_bek',
    role: 'Member',
    xp: '12,400 XP',
    online: false,
    lastSeen: 'Kecha',
    avatar: require('../assets/avatar_david.jpg'),
    level: 14,
    tasksDone: 11,
    wins: 4,
  },
  {
    id: '10',
    rank: 10,
    name: 'Umidjon',
    role: 'Member',
    xp: '9,800 XP',
    online: false,
    lastSeen: '2 kun oldin',
    avatar: require('../assets/avatar_emma.jpg'),
    level: 12,
    tasksDone: 8,
    wins: 2,
  },
];

export default function ClanMembersScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'online' | 'offline'
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const triggerHaptic = (type = 'light') => {
    try {
      if (type === 'medium') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (e) {}
  };

  const handleShareInvite = async () => {
    triggerHaptic();
    try {
      await Share.share({
        message: "IQROMAX Clan ga taklif qilinasiz! Biz Season 5 Gold Leaguedamiz. Clan kodi: #IQROMAX_777",
      });
    } catch (e) {}
  };

  // Filtered members list
  const filteredMembers = MEMBERS_DATA.filter((m) => {
    if (filterTab === 'online') return m.online;
    if (filterTab === 'offline') return !m.online;
    return true;
  });

  const onlineCount = MEMBERS_DATA.filter((m) => m.online).length;
  const offlineCount = MEMBERS_DATA.filter((m) => !m.online).length;

  // Render Crown Silhouette Rank Badge for #1, #2, #3 and circle badge for others
  const renderRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <View style={styles.rankCrownContainer}>
          <Svg width={28} height={28} viewBox="0 0 28 28">
            <Defs>
              <SvgGradient id="goldCrownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FDE047" />
                <Stop offset="50%" stopColor="#EAB308" />
                <Stop offset="100%" stopColor="#CA8A04" />
              </SvgGradient>
            </Defs>
            {/* Crown Silhouette with 3 peaks */}
            <Path
              d="M 4 23 L 24 23 C 24 23 25.5 15 25 10 L 19 14.5 L 14 5 L 9 14.5 L 3 10 C 2.5 15 4 23 4 23 Z"
              fill="url(#goldCrownGrad)"
            />
          </Svg>
          <Text style={[styles.rankCrownText, { color: '#713F12' }]}>1</Text>
        </View>
      );
    }
    if (rank === 2) {
      return (
        <View style={styles.rankCrownContainer}>
          <Svg width={28} height={28} viewBox="0 0 28 28">
            <Defs>
              <SvgGradient id="silverCrownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FFFFFF" />
                <Stop offset="50%" stopColor="#CBD5E1" />
                <Stop offset="100%" stopColor="#94A3B8" />
              </SvgGradient>
            </Defs>
            <Path
              d="M 4 23 L 24 23 C 24 23 25.5 15 25 10 L 19 14.5 L 14 5 L 9 14.5 L 3 10 C 2.5 15 4 23 4 23 Z"
              fill="url(#silverCrownGrad)"
            />
          </Svg>
          <Text style={[styles.rankCrownText, { color: '#0F172A' }]}>2</Text>
        </View>
      );
    }
    if (rank === 3) {
      return (
        <View style={styles.rankCrownContainer}>
          <Svg width={28} height={28} viewBox="0 0 28 28">
            <Defs>
              <SvgGradient id="bronzeCrownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FDBA74" />
                <Stop offset="50%" stopColor="#EA580C" />
                <Stop offset="100%" stopColor="#9A3412" />
              </SvgGradient>
            </Defs>
            <Path
              d="M 4 23 L 24 23 C 24 23 25.5 15 25 10 L 19 14.5 L 14 5 L 9 14.5 L 3 10 C 2.5 15 4 23 4 23 Z"
              fill="url(#bronzeCrownGrad)"
            />
          </Svg>
          <Text style={[styles.rankCrownText, { color: '#431407' }]}>3</Text>
        </View>
      );
    }
    return (
      <View style={styles.normalRankBadge}>
        <Text style={styles.normalRankText}>{rank}</Text>
      </View>
    );
  };

  // Render Wolf Shield Emblem in Banner
  const renderWolfShield = () => {
    return (
      <View style={styles.shieldEmblemContainer}>
        <Svg width={54} height={54} viewBox="0 0 60 60">
          <Defs>
            <SvgGradient id="shieldGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FDE047" />
              <Stop offset="50%" stopColor="#F59E0B" />
              <Stop offset="100%" stopColor="#B45309" />
            </SvgGradient>
            <SvgGradient id="shieldBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#4C1D95" />
              <Stop offset="60%" stopColor="#2E1065" />
              <Stop offset="100%" stopColor="#1E1B4B" />
            </SvgGradient>
          </Defs>
          {/* Outer Shield with Gold Border */}
          <Path
            d="M 30 4 L 52 14 C 52 38 30 54 30 54 C 30 54 8 38 8 14 Z"
            fill="url(#shieldBgGrad)"
            stroke="url(#shieldGoldGrad)"
            strokeWidth="3.2"
          />
          {/* Inner Golden Rim Line */}
          <Path
            d="M 30 9 L 47 18 C 47 36 30 49 30 49 C 30 49 13 36 13 18 Z"
            fill="none"
            stroke="rgba(253, 224, 71, 0.4)"
            strokeWidth="1.2"
          />
          {/* White/Purple Wolf Head Profile */}
          <G transform="translate(19, 14) scale(0.65)">
            <Path
              d="M 18 10 L 14 18 L 8 22 L 2 24 L 6 28 L 12 28 L 16 34 L 20 40 L 26 44 L 28 36 L 34 32 L 32 24 L 28 18 L 26 10 Z"
              fill="#FFFFFF"
            />
            <Path d="M 20 20 L 24 24 L 20 28 L 26 30 L 22 36 L 28 34" stroke="#CBD5E1" strokeWidth="1.5" fill="none" />
            <Polygon points="22,6 26,14 18,12" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
            <Polygon points="21,8 24,13 19,12" fill="#C084FC" opacity={0.6} />
            <Polygon points="14,20 18,22 14,23" fill="#6B21A8" />
            <Polygon points="2,24 5,23 4,26" fill="#1E1B4B" />
          </G>
        </Svg>
      </View>
    );
  };

  // Render Role Pill Badge (Creator, Co-Leader, Member)
  const renderRoleBadge = (role) => {
    if (role === 'Creator') {
      return (
        <View style={styles.roleBadgeCreator}>
          <Text style={styles.roleTextCreator}>Creator</Text>
        </View>
      );
    }
    if (role === 'Co-Leader') {
      return (
        <View style={styles.roleBadgeCoLeader}>
          <Text style={styles.roleTextCoLeader}>Co-Leader</Text>
        </View>
      );
    }
    return (
      <View style={styles.roleBadgeMember}>
        <Text style={styles.roleTextMember}>Member</Text>
      </View>
    );
  };

  return (
    <View style={styles.screenRoot}>
      <StatusBar barStyle="light-content" backgroundColor="#070814" />

      {/* Screen Background Gradient */}
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
            <Text style={styles.headerTitleText}>Members</Text>
            <Text style={styles.headerSubtitleText}>Clan a'zolari ro'yxati</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.headerIconButton}
            onPress={() => {
              triggerHaptic();
              setInfoModalVisible(true);
            }}
          >
            <Feather name="info" size={19} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 20) + 16 },
          ]}
        >
          {/* 2. CLAN SUMMARY BANNER CARD */}
          <View style={styles.clanBannerCard}>
            <LinearGradient
              colors={['#25164B', '#160E33', '#110A26']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.clanBannerGradient}
            >
              {/* Left Wolf Shield */}
              {renderWolfShield()}

              {/* Clan Info */}
              <View style={styles.clanBannerMeta}>
                <Text style={styles.clanBannerTitle}>IQROMAX Clan</Text>
                <Text style={styles.clanBannerSub}>10 / 10 a'zo</Text>
              </View>

              {/* Taklif qilish Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.inviteButtonWrap}
                onPress={() => {
                  triggerHaptic();
                  setInviteModalVisible(true);
                }}
              >
                <LinearGradient
                  colors={['#9333EA', '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.inviteButton}
                >
                  <MaterialCommunityIcons
                    name="account-plus-outline"
                    size={17}
                    color="#FFFFFF"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.inviteButtonText}>Taklif qilish</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* 3. FILTER TABS (Barcha 10 | Online 6 | Offline 4) */}
          <View style={styles.filterTabsRow}>
            {/* Tab 1: Barcha */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                triggerHaptic();
                setFilterTab('all');
              }}
              style={styles.filterTabTouchable}
            >
              {filterTab === 'all' ? (
                <LinearGradient
                  colors={['#9333EA', '#7E22CE']}
                  style={styles.filterTabActivePill}
                >
                  <MaterialCommunityIcons
                    name="tent"
                    size={15}
                    color="#FFFFFF"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.filterTabActiveText}>Barcha (10)</Text>
                </LinearGradient>
              ) : (
                <View style={styles.filterTabInactivePill}>
                  <MaterialCommunityIcons
                    name="tent"
                    size={15}
                    color="#94A3B8"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.filterTabInactiveText}>Barcha (10)</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Tab 2: Online */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                triggerHaptic();
                setFilterTab('online');
              }}
              style={styles.filterTabTouchable}
            >
              {filterTab === 'online' ? (
                <LinearGradient
                  colors={['#9333EA', '#7E22CE']}
                  style={styles.filterTabActivePill}
                >
                  <Ionicons
                    name="radio-button-on"
                    size={14}
                    color="#10B981"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.filterTabActiveText}>Online ({onlineCount})</Text>
                </LinearGradient>
              ) : (
                <View style={styles.filterTabInactivePill}>
                  <Ionicons
                    name="radio-button-on"
                    size={14}
                    color="#10B981"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.filterTabInactiveText}>Online ({onlineCount})</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Tab 3: Offline */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                triggerHaptic();
                setFilterTab('offline');
              }}
              style={styles.filterTabTouchable}
            >
              {filterTab === 'offline' ? (
                <LinearGradient
                  colors={['#9333EA', '#7E22CE']}
                  style={styles.filterTabActivePill}
                >
                  <Feather
                    name="clock"
                    size={13}
                    color="#FFFFFF"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.filterTabActiveText}>Offline ({offlineCount})</Text>
                </LinearGradient>
              ) : (
                <View style={styles.filterTabInactivePill}>
                  <Feather
                    name="clock"
                    size={13}
                    color="#94A3B8"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.filterTabInactiveText}>Offline ({offlineCount})</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* 4. TABLE COLUMN HEADERS */}
          <View style={styles.tableHeaderRow}>
            <Text style={styles.colHeaderRank}>#</Text>
            <Text style={styles.colHeaderMember}>A'zo</Text>
            <Text style={styles.colHeaderRole}>Rol</Text>
            <Text style={styles.colHeaderXp}>Clan XP</Text>
          </View>

          {/* 5. MEMBERS LIST */}
          <View style={styles.membersListCard}>
            {filteredMembers.map((item, index) => {
              const isLast = index === filteredMembers.length - 1;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  onPress={() => {
                    triggerHaptic();
                    navigation.navigate('ClanMemberProfileScreen', { member: item });
                  }}
                  style={[
                    styles.memberRow,
                    !isLast && styles.memberRowBorder,
                  ]}
                >
                  {/* Rank Column */}
                  <View style={styles.memberRankCol}>
                    {renderRankBadge(item.rank)}
                  </View>

                  {/* Avatar Column */}
                  <View style={styles.memberAvatarContainer}>
                    <Image
                      source={item.avatar}
                      style={styles.memberAvatarImage}
                      contentFit="cover"
                    />
                    {/* Tiny Status indicator on avatar corner */}
                    <View
                      style={[
                        styles.avatarStatusBadge,
                        { backgroundColor: item.online ? '#10B981' : '#64748B' },
                      ]}
                    />
                  </View>

                  {/* Name and Status Column */}
                  <View style={styles.memberNameCol}>
                    <Text style={styles.memberNameText} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View style={styles.statusIndicatorRow}>
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: item.online ? '#10B981' : '#64748B' },
                        ]}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          { color: item.online ? '#34D399' : '#94A3B8' },
                        ]}
                      >
                        {item.online ? 'Online' : item.lastSeen}
                      </Text>
                    </View>
                  </View>

                  {/* Role Column */}
                  <View style={styles.memberRoleCol}>
                    {renderRoleBadge(item.role)}
                  </View>

                  {/* Clan XP Column */}
                  <View style={styles.memberXpCol}>
                    <Text style={styles.memberXpText}>{item.xp}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* INFO MODAL: CLAN ROLLARI VA HUQUQLARI */}
      <Modal
        visible={infoModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons
                  name="shield-account"
                  size={22}
                  color="#FBBF24"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.modalTitle}>Clan Rollari va Qoidalari</Text>
              </View>
              <TouchableOpacity onPress={() => setInfoModalVisible(false)}>
                <Feather name="x" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 360 }}>
              <View style={styles.roleExplainerBox}>
                <View style={styles.roleBadgeCreator}>
                  <Text style={styles.roleTextCreator}>Creator</Text>
                </View>
                <Text style={styles.roleDescText}>
                  Clan asoschisi va boshlig'i. Barcha sozlamalarni o'zgartirish, a'zolarni chiqarish yoki tayinlash huquqiga ega.
                </Text>
              </View>

              <View style={styles.roleExplainerBox}>
                <View style={styles.roleBadgeCoLeader}>
                  <Text style={styles.roleTextCoLeader}>Co-Leader</Text>
                </View>
                <Text style={styles.roleDescText}>
                  Ham-lider. Yangi talabgorlarni qabul qilish, missiyalarni boshlash va clanni faollashtirish huquqiga ega.
                </Text>
              </View>

              <View style={styles.roleExplainerBox}>
                <View style={styles.roleBadgeMember}>
                  <Text style={styles.roleTextMember}>Member</Text>
                </View>
                <Text style={styles.roleDescText}>
                  Clan a'zosi. Kundalik vazifalar, Clan janglari va turnirlarda qatnashib jamoaga XP to'playdi.
                </Text>
              </View>

              <View style={styles.infoNoteBox}>
                <Feather name="info" size={14} color="#C084FC" style={{ marginRight: 8, marginTop: 2 }} />
                <Text style={styles.infoNoteText}>
                  Reyting a'zolarning joriy mavsumdagi Clan XP hissasi bo'yicha saralanadi.
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modalPrimaryBtn}
              onPress={() => setInfoModalVisible(false)}
            >
              <Text style={styles.modalPrimaryBtnText}>Tushunarli</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* INVITE MODAL: TAKLIF QILISH */}
      <Modal
        visible={inviteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setInviteModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons
                  name="account-plus"
                  size={22}
                  color="#C084FC"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.modalTitle}>Do'stlarni taklif qilish</Text>
              </View>
              <TouchableOpacity onPress={() => setInviteModalVisible(false)}>
                <Feather name="x" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inviteInfoText}>
              Do'stlaringizni IQROMAX Clan ga taklif qiling va har bir taklif qilingan faol a'zo uchun +500 XP mukofot oling!
            </Text>

            <View style={styles.codeShareBox}>
              <View>
                <Text style={styles.codeShareLabel}>Clan ID kodi:</Text>
                <Text style={styles.codeShareValue}>#IQROMAX_777</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.copyCodeButton}
                onPress={() => {
                  triggerHaptic();
                  Alert.alert("Nusxalandi", "Clan ID nusxalandi!");
                }}
              >
                <Feather name="copy" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modalPrimaryBtn}
              onPress={() => {
                setInviteModalVisible(false);
                handleShareInvite();
              }}
            >
              <Feather name="share-2" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.modalPrimaryBtnText}>Havolani ulashish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MEMBER DETAIL MODAL */}
      <Modal
        visible={!!selectedMember}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedMember(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {selectedMember && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>A'zo Profili</Text>
                  <TouchableOpacity onPress={() => setSelectedMember(null)}>
                    <Feather name="x" size={20} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                <View style={styles.memberDetailTop}>
                  <Image source={selectedMember.avatar} style={styles.memberDetailAvatar} />
                  <View style={{ marginLeft: 14, flex: 1 }}>
                    <Text style={styles.memberDetailName}>{selectedMember.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      {renderRoleBadge(selectedMember.role)}
                      <View
                        style={[
                          styles.statusDot,
                          {
                            marginLeft: 10,
                            backgroundColor: selectedMember.online ? '#10B981' : '#64748B',
                          },
                        ]}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          {
                            marginLeft: 4,
                            color: selectedMember.online ? '#34D399' : '#94A3B8',
                          },
                        ]}
                      >
                        {selectedMember.online ? 'Online' : selectedMember.lastSeen}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Member Stats Grid */}
                <View style={styles.memberStatsGrid}>
                  <View style={styles.memberStatItem}>
                    <Text style={styles.memberStatVal}>{selectedMember.xp}</Text>
                    <Text style={styles.memberStatLbl}>Clan XP hissasi</Text>
                  </View>
                  <View style={styles.memberStatItem}>
                    <Text style={styles.memberStatVal}>{selectedMember.tasksDone}</Text>
                    <Text style={styles.memberStatLbl}>Bajarilgan vazifalar</Text>
                  </View>
                  <View style={styles.memberStatItem}>
                    <Text style={styles.memberStatVal}>{selectedMember.wins}</Text>
                    <Text style={styles.memberStatLbl}>Battle g'alabalari</Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.memberActionsRow}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.memberBattleBtn}
                    onPress={() => {
                      triggerHaptic();
                      setSelectedMember(null);
                      Alert.alert(
                        "Jang Taklifi",
                        `${selectedMember.name} ga 1v1 Battle taklifi yuborildi!`
                      );
                    }}
                  >
                    <MaterialCommunityIcons
                      name="sword-cross"
                      size={18}
                      color="#FFFFFF"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.memberActionBtnText}>Jangga chorlash</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.memberSecondaryBtn}
                    onPress={() => {
                      triggerHaptic();
                      setSelectedMember(null);
                      Alert.alert("Do'stlik", `${selectedMember.name} ga so'rov yuborildi!`);
                    }}
                  >
                    <Feather name="user-plus" size={16} color="#CBD5E1" />
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

  // SCROLL CONTENT
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  // 2. CLAN SUMMARY BANNER CARD
  clanBannerCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.35)',
    marginBottom: 14,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  clanBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  shieldEmblemContainer: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  clanBannerMeta: {
    flex: 1,
  },
  clanBannerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  clanBannerSub: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C084FC',
    marginTop: 3,
  },
  inviteButtonWrap: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 18,
  },
  inviteButtonText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // 3. FILTER TABS
  filterTabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  filterTabTouchable: {
    flex: 1,
    marginHorizontal: 3,
  },
  filterTabActivePill: {
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
  filterTabActiveText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  filterTabInactivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterTabInactiveText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#94A3B8',
  },

  // 4. TABLE COLUMN HEADERS
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  colHeaderRank: {
    width: 34,
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textAlign: 'center',
  },
  colHeaderMember: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    paddingLeft: 12,
  },
  colHeaderRole: {
    width: 82,
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textAlign: 'center',
  },
  colHeaderXp: {
    width: 90,
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textAlign: 'right',
  },

  // 5. MEMBERS LIST
  membersListCard: {
    backgroundColor: 'rgba(18, 14, 38, 0.75)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.18)',
    overflow: 'hidden',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  memberRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },

  // Rank Col
  memberRankCol: {
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankCrownContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  rankCrownText: {
    position: 'absolute',
    top: 9,
    fontSize: 11,
    fontWeight: '900',
  },
  normalRankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  normalRankText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#CBD5E1',
  },

  // Avatar Col
  memberAvatarContainer: {
    position: 'relative',
    marginLeft: 4,
    marginRight: 10,
  },
  memberAvatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(168, 85, 247, 0.4)',
  },
  avatarStatusBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#0F0C22',
  },

  // Name & Status Col
  memberNameCol: {
    flex: 1,
    justifyContent: 'center',
  },
  memberNameText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Role Col
  memberRoleCol: {
    width: 82,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleBadgeCreator: {
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.55)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  roleTextCreator: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FBBF24',
  },
  roleBadgeCoLeader: {
    backgroundColor: 'rgba(139, 92, 246, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.5)',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  roleTextCoLeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C084FC',
  },
  roleBadgeMember: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  roleTextMember: {
    fontSize: 11,
    fontWeight: '700',
    color: '#CBD5E1',
  },

  // Clan XP Col
  memberXpCol: {
    width: 90,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  memberXpText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  // MODAL COMMON
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
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
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    paddingVertical: 12,
    marginTop: 16,
  },
  modalPrimaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Role Explainer Box
  roleExplainerBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  roleDescText: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
    marginTop: 6,
  },
  infoNoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(126, 34, 206, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    borderRadius: 12,
    padding: 10,
    marginTop: 4,
  },
  infoNoteText: {
    flex: 1,
    fontSize: 11.5,
    color: '#E9D5FF',
    lineHeight: 16,
  },

  // Invite Modal
  inviteInfoText: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 19,
    marginBottom: 14,
  },
  codeShareBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  codeShareLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  codeShareValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FBBF24',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  copyCodeButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 10,
    padding: 8,
  },

  // Member Detail Modal
  memberDetailTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  memberDetailAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#A855F7',
  },
  memberDetailName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  memberStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  memberStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  memberStatVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FBBF24',
  },
  memberStatLbl: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 3,
    textAlign: 'center',
  },
  memberActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberBattleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    paddingVertical: 12,
    marginRight: 8,
  },
  memberActionBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  memberSecondaryBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

