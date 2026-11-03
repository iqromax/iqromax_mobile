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
  TextInput,
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
  Rect,
} from 'react-native-svg';

const { width } = Dimensions.get('window');

// Default fallback member data (Ergashboy from mockup)
const DEFAULT_MEMBER = {
  id: '1',
  name: 'Ergashboy',
  role: 'Creator',
  level: 28,
  online: true,
  lastSeen: 'Hozir faol',
  xp: '56,400 XP',
  joinDate: '15 Sen, 2026',
  avatar: require('../assets/avatar_maks.png'),
  battleWins: 48,
  tasksCompleted: 36,
  clanStreak: '21 kun',
  activityRate: '92%',
};

export default function ClanMemberProfileScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const member = route?.params?.member || DEFAULT_MEMBER;

  // Modals state
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [achievementsModalVisible, setAchievementsModalVisible] = useState(false);
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);

  const triggerHaptic = (type = 'light') => {
    try {
      if (type === 'medium') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (e) {}
  };

  const handleShare = async () => {
    triggerHaptic();
    try {
      await Share.share({
        message: `${member.name} — IQROMAX Clan ${member.role} a'zosi. Clan XP: ${member.xp || member.clanXp || '56,400 XP'}, Lv.${member.level || 28}.`,
      });
    } catch (e) {}
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      Alert.alert('Xatolik', 'Iltimos, xabar matnini kiriting.');
      return;
    }
    triggerHaptic('medium');
    setChatModalVisible(false);
    setMessageText('');
    Alert.alert('Xabar yuborildi', `${member.name} ga xabaringiz muvaffaqiyatli yetkazildi!`);
  };

  // Laurel Wreath & Top Crown SVG around avatar
  const renderAvatarFrame = () => {
    return (
      <View style={styles.avatarFrameContainer}>
        {/* SVG Crown on top & Laurel Wreath on sides */}
        <Svg width={170} height={170} viewBox="0 0 170 170" style={styles.avatarSvgFrame}>
          <Defs>
            {/* Gold Gradient */}
            <SvgGradient id="laurelGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FDE047" />
              <Stop offset="50%" stopColor="#F59E0B" />
              <Stop offset="100%" stopColor="#D97706" />
            </SvgGradient>

            {/* Glowing Ring Gradient */}
            <SvgGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#C084FC" />
              <Stop offset="50%" stopColor="#7C3AED" />
              <Stop offset="100%" stopColor="#F59E0B" />
            </SvgGradient>
          </Defs>

          {/* Left Laurel Wreath */}
          <G fill="url(#laurelGold)">
            {/* Leaves ascending on left */}
            <Path d="M 24 105 C 18 100 18 90 28 92 C 30 98 28 103 24 105 Z" />
            <Path d="M 21 88 C 15 82 17 73 26 77 C 27 83 25 87 21 88 Z" />
            <Path d="M 22 71 C 18 64 22 55 30 60 C 30 66 27 70 22 71 Z" />
            <Path d="M 28 55 C 25 48 31 40 38 46 C 37 52 33 55 28 55 Z" />
            <Path d="M 38 42 C 37 35 44 28 51 35 C 49 40 44 43 38 42 Z" />
            {/* Branch Stem Left */}
            <Path
              d="M 24 112 Q 17 80 44 36"
              fill="none"
              stroke="url(#laurelGold)"
              strokeWidth="2"
            />
          </G>

          {/* Right Laurel Wreath */}
          <G fill="url(#laurelGold)">
            {/* Leaves ascending on right */}
            <Path d="M 146 105 C 152 100 152 90 142 92 C 140 98 142 103 146 105 Z" />
            <Path d="M 149 88 C 155 82 153 73 144 77 C 143 83 145 87 149 88 Z" />
            <Path d="M 148 71 C 152 64 148 55 140 60 C 140 66 143 70 148 71 Z" />
            <Path d="M 142 55 C 145 48 139 40 132 46 C 133 52 137 55 142 55 Z" />
            <Path d="M 132 42 C 133 35 126 28 119 35 C 121 40 126 43 132 42 Z" />
            {/* Branch Stem Right */}
            <Path
              d="M 146 112 Q 153 80 126 36"
              fill="none"
              stroke="url(#laurelGold)"
              strokeWidth="2"
            />
          </G>

          {/* Top 3-Star Crown */}
          <G transform="translate(61, 8)">
            {/* Crown Base and 3 Peaks */}
            <Path
              d="M 4 28 L 44 28 C 45 28 47 22 47 16 L 36 21 L 24 7 L 12 21 L 1 16 C 1 22 3 28 4 28 Z"
              fill="url(#laurelGold)"
            />
            {/* 3 Little Star gems on peaks */}
            <Circle cx="1" cy="15" r="2.2" fill="#FEF08A" />
            <Circle cx="24" cy="6" r="2.6" fill="#FEF08A" />
            <Circle cx="47" cy="15" r="2.2" fill="#FEF08A" />
          </G>
        </Svg>

        {/* Circular Avatar with Glowing Border */}
        <View style={styles.avatarCircleBorder}>
          <Image
            source={member.avatar || DEFAULT_MEMBER.avatar}
            style={styles.avatarImage}
            contentFit="cover"
          />
        </View>

        {/* Level Badge (Lv.28) Pill overlapping at bottom */}
        <View style={styles.levelBadgePill}>
          <Text style={styles.levelBadgeText}>Lv.{member.level || 28}</Text>
        </View>
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
            <Text style={styles.headerTitleText}>Member Profile</Text>
            <Text style={styles.headerSubtitleText}>A'zo haqida batafsil ma'lumot</Text>
          </View>

          <View style={styles.headerRightButtonsRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.headerIconButton}
              onPress={handleShare}
            >
              <Feather name="share-2" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.headerIconButton, { marginLeft: 8 }]}
              onPress={() => {
                triggerHaptic();
                setMoreMenuVisible(true);
              }}
            >
              <Feather name="more-vertical" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 20) + 75 },
          ]}
        >
          {/* 2. HERO SECTION */}
          <View style={styles.heroSection}>
            {/* Background Mountains Backdrop */}
            <View style={styles.heroMountainBackdrop}>
              <Svg width={width - 24} height={130} viewBox="0 0 350 130">
                <Defs>
                  <SvgGradient id="mountGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor="#6B21A8" stopOpacity={0.55} />
                    <Stop offset="100%" stopColor="#0B091A" stopOpacity={0.05} />
                  </SvgGradient>
                </Defs>
                <Path
                  d="M 0 95 L 45 45 L 90 85 L 145 35 L 205 75 L 260 40 L 315 85 L 350 55 L 350 130 L 0 130 Z"
                  fill="url(#mountGrad)"
                />
              </Svg>
            </View>

            {/* Avatar Frame with Laurel and Crown */}
            {renderAvatarFrame()}

            {/* Name & Online Status Row */}
            <View style={styles.nameStatusRow}>
              <Text style={styles.memberNameText}>{member.name}</Text>
              <View style={styles.onlineStatusPill}>
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color="#10B981"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.onlineStatusText}>
                  {member.online !== false ? 'Online' : 'Offline'}
                </Text>
              </View>
            </View>

            {/* Creator / Role Pill */}
            <View style={styles.rolePillWrap}>
              <FontAwesome5
                name="crown"
                size={12}
                color="#FBBF24"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.rolePillText}>{member.role || 'Creator'}</Text>
            </View>
          </View>

          {/* 3. THREE STATS CARDS */}
          <View style={styles.threeStatsCard}>
            {/* Col 1: Clan XP (jami) */}
            <View style={styles.statCol}>
              <View style={styles.statIconWrap}>
                <Svg width={20} height={20} viewBox="0 0 24 24">
                  <Path
                    d="M 12 2 L 4 6 V 12 C 4 17 8 21 12 22 C 16 21 20 17 20 12 V 6 L 12 2 Z"
                    fill="rgba(192, 132, 252, 0.25)"
                    stroke="#C084FC"
                    strokeWidth="1.5"
                  />
                  <Polygon points="12,7 13.5,10.5 17,10.5 14,12.5 15,16 12,14 9,16 10,12.5 7,10.5 10.5,10.5" fill="#E9D5FF" />
                </Svg>
              </View>
              <Text style={styles.statColLabel}>Clan XP (jami)</Text>
              <Text style={styles.statColValueGold}>
                {member.xp || member.clanXp || '56,400 XP'}
              </Text>
            </View>

            <View style={styles.statColDivider} />

            {/* Col 2: Clan'ga qo'shilgan */}
            <View style={styles.statCol}>
              <View style={styles.statIconWrap}>
                <Ionicons name="calendar-outline" size={20} color="#C084FC" />
              </View>
              <Text style={styles.statColLabel}>Clan'ga qo'shilgan</Text>
              <Text style={styles.statColValueWhite}>
                {member.joinDate || '15 Sen, 2026'}
              </Text>
            </View>

            <View style={styles.statColDivider} />

            {/* Col 3: Clan ichidagi rol */}
            <View style={styles.statCol}>
              <View style={styles.statIconWrap}>
                <FontAwesome5 name="crown" size={17} color="#FBBF24" />
              </View>
              <Text style={styles.statColLabel}>Clan ichidagi rol</Text>
              <Text style={styles.statColValueGold}>{member.role || 'Creator'}</Text>
            </View>
          </View>

          {/* 4. FAOLLIK STATISTIKASI (SEASON 5) */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleIconWrap}>
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={18}
                color="#C084FC"
              />
            </View>
            <Text style={styles.sectionTitleText}>
              Faollik statistikasi (Season 5)
            </Text>
          </View>

          <View style={styles.activityGrid}>
            {/* Card 1: Battle g'alaba */}
            <View style={styles.activityCard}>
              <View style={styles.activityIconWrap}>
                <MaterialCommunityIcons
                  name="sword-cross"
                  size={20}
                  color="#C084FC"
                />
              </View>
              <Text style={styles.activityCardValue}>
                {member.battleWins || 48}
              </Text>
              <Text style={styles.activityCardLabel}>Battle g'alaba</Text>
            </View>

            {/* Card 2: Bajarilgan vazifa */}
            <View style={styles.activityCard}>
              <View style={styles.activityIconWrap}>
                <MaterialCommunityIcons
                  name="bullseye-arrow"
                  size={20}
                  color="#C084FC"
                />
              </View>
              <Text style={styles.activityCardValue}>
                {member.tasksCompleted || member.tasksDone || 36}
              </Text>
              <Text style={styles.activityCardLabel}>Bajarilgan vazifa</Text>
            </View>

            {/* Card 3: Clan Streak */}
            <View style={styles.activityCard}>
              <View style={styles.activityIconWrap}>
                <Ionicons name="flash-sharp" size={19} color="#FBBF24" />
              </View>
              <Text style={styles.activityCardValue}>
                {member.clanStreak || '21 kun'}
              </Text>
              <Text style={styles.activityCardLabel}>Clan Streak</Text>
            </View>

            {/* Card 4: Faollik darajasi */}
            <View style={styles.activityCard}>
              <View style={styles.activityIconWrap}>
                <FontAwesome5 name="trophy" size={17} color="#FBBF24" />
              </View>
              <Text style={styles.activityCardValue}>
                {member.activityRate || '92%'}
              </Text>
              <Text style={styles.activityCardLabel}>Faollik darajasi</Text>
            </View>
          </View>

          {/* 5. YUTUQLAR VA NISHONLAR */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              triggerHaptic();
              setAchievementsModalVisible(true);
            }}
            style={styles.achievementsCard}
          >
            <View style={styles.achievementsHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome5
                  name="star"
                  size={14}
                  color="#FBBF24"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.achievementsTitle}>Yutuqlar va nishonlar</Text>
              </View>
              <Feather name="chevron-right" size={18} color="#94A3B8" />
            </View>

            {/* Badges Row */}
            <View style={styles.badgesDisplayRow}>
              {/* Badge 1: Golden Laurel Crown Shield */}
              <View style={styles.badgeWrapper}>
                <Svg width={72} height={56} viewBox="0 0 80 60">
                  <Defs>
                    <SvgGradient id="b1Gold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor="#FDE047" />
                      <Stop offset="50%" stopColor="#F59E0B" />
                      <Stop offset="100%" stopColor="#B45309" />
                    </SvgGradient>
                  </Defs>
                  {/* Laurels Left & Right */}
                  <Path
                    d="M 12 40 C 6 30 10 15 22 18 C 18 28 16 34 12 40 Z"
                    fill="url(#b1Gold)"
                  />
                  <Path
                    d="M 68 40 C 74 30 70 15 58 18 C 62 28 64 34 68 40 Z"
                    fill="url(#b1Gold)"
                  />
                  {/* Central Shield */}
                  <Path
                    d="M 40 10 L 56 18 C 56 38 40 50 40 50 C 40 50 24 38 24 18 Z"
                    fill="#78350F"
                    stroke="url(#b1Gold)"
                    strokeWidth="2.5"
                  />
                  {/* Crown inside */}
                  <Path
                    d="M 32 32 L 48 32 C 48 32 49 28 48 24 L 44 26 L 40 20 L 36 26 L 32 24 Z"
                    fill="#FEF08A"
                  />
                </Svg>
              </View>

              {/* Badge 2: Purple Winged Star Shield */}
              <View style={styles.badgeWrapper}>
                <Svg width={80} height={56} viewBox="0 0 90 60">
                  <Defs>
                    <SvgGradient id="b2Purp" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor="#E9D5FF" />
                      <Stop offset="50%" stopColor="#A855F7" />
                      <Stop offset="100%" stopColor="#6B21A8" />
                    </SvgGradient>
                  </Defs>
                  {/* Wings Left & Right */}
                  <Path
                    d="M 10 24 C 20 20 28 30 30 36 C 22 36 14 30 10 24 Z"
                    fill="url(#b2Purp)"
                  />
                  <Path
                    d="M 80 24 C 70 20 62 30 60 36 C 68 36 76 30 80 24 Z"
                    fill="url(#b2Purp)"
                  />
                  {/* Central Shield */}
                  <Path
                    d="M 45 10 L 60 18 C 60 38 45 50 45 50 C 45 50 30 38 30 18 Z"
                    fill="#3B0764"
                    stroke="url(#b2Purp)"
                    strokeWidth="2.5"
                  />
                  {/* Star inside */}
                  <Polygon
                    points="45,20 47,26 53,26 48,30 50,36 45,32 40,36 42,30 37,26 43,26"
                    fill="#E9D5FF"
                  />
                </Svg>
              </View>

              {/* Badge 3: S5 Laurel Wreath Badge */}
              <View style={styles.badgeWrapper}>
                <Svg width={72} height={56} viewBox="0 0 80 60">
                  <Defs>
                    <SvgGradient id="b3Gold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor="#FDE047" />
                      <Stop offset="50%" stopColor="#F59E0B" />
                      <Stop offset="100%" stopColor="#D97706" />
                    </SvgGradient>
                  </Defs>
                  {/* Laurel Wreath */}
                  <Path
                    d="M 14 38 C 8 28 12 16 22 18 C 18 28 17 34 14 38 Z"
                    fill="url(#b3Gold)"
                  />
                  <Path
                    d="M 66 38 C 72 28 68 16 58 18 C 62 28 63 34 66 38 Z"
                    fill="url(#b3Gold)"
                  />
                  {/* Hexagon/Shield S5 */}
                  <Polygon
                    points="40,12 55,20 55,38 40,48 25,38 25,20"
                    fill="#4C1D95"
                    stroke="url(#b3Gold)"
                    strokeWidth="2.2"
                  />
                </Svg>
                <View style={styles.s5TextOverlay}>
                  <Text style={styles.s5Text}>S5</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* 6. BOTTOM PINNED ACTION BUTTON: XABAR YUBORISH */}
        <View
          style={[
            styles.bottomStickyBar,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              triggerHaptic();
              setChatModalVisible(true);
            }}
            style={styles.messageButtonTouchable}
          >
            <LinearGradient
              colors={['#9333EA', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.messageButtonGradient}
            >
              <MaterialCommunityIcons
                name="chat-outline"
                size={20}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.messageButtonText}>Xabar yuborish</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* QUICK CHAT MODAL */}
      <Modal
        visible={chatModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setChatModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons
                  name="chat-processing-outline"
                  size={22}
                  color="#C084FC"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.modalTitle}>Xabar: {member.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setChatModalVisible(false)}>
                <Feather name="x" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.chatModalSub}>
              {member.name} ga shaxsiy xabar yuboring:
            </Text>

            <TextInput
              value={messageText}
              onChangeText={setMessageText}
              placeholder="Xabaringizni yozing..."
              placeholderTextColor="#64748B"
              multiline
              style={styles.chatTextInput}
            />

            <View style={styles.quickPhrasesRow}>
              <TouchableOpacity
                onPress={() => setMessageText("Salom! Clan jangiga tayyormisiz? ⚔️")}
                style={styles.quickPhraseChip}
              >
                <Text style={styles.quickPhraseText}>⚔️ Jang taklifi</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMessageText("Ajoyib natija! Tabriklayman! 🏆")}
                style={styles.quickPhraseChip}
              >
                <Text style={styles.quickPhraseText}>🏆 Tabrik</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.sendModalBtn}
              onPress={handleSendMessage}
            >
              <Feather name="send" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.sendModalBtnText}>Yuborish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ACHIEVEMENTS MODAL */}
      <Modal
        visible={achievementsModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAchievementsModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome5 name="medal" size={20} color="#FBBF24" style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>Yutuqlar va Nishonlar</Text>
              </View>
              <TouchableOpacity onPress={() => setAchievementsModalVisible(false)}>
                <Feather name="x" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 360 }}>
              {/* Badge 1 */}
              <View style={styles.achievementItem}>
                <View style={styles.achievementBadgeMini}>
                  <FontAwesome5 name="crown" size={16} color="#FBBF24" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.achievementItemTitle}>Clan Asoschisi</Text>
                  <Text style={styles.achievementItemDesc}>
                    IQROMAX Clanini yaratgan va Liderlik maqomiga ega bo'lgan a'zo.
                  </Text>
                </View>
              </View>

              {/* Badge 2 */}
              <View style={styles.achievementItem}>
                <View style={[styles.achievementBadgeMini, { backgroundColor: 'rgba(168, 85, 247, 0.2)' }]}>
                  <FontAwesome5 name="star" size={16} color="#C084FC" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.achievementItemTitle}>Battle Master</Text>
                  <Text style={styles.achievementItemDesc}>
                    Jamoaviy va yakkama-yakka janglarda 40+ g'alaba qozongan.
                  </Text>
                </View>
              </View>

              {/* Badge 3 */}
              <View style={styles.achievementItem}>
                <View style={[styles.achievementBadgeMini, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                  <MaterialCommunityIcons name="trophy-award" size={18} color="#60A5FA" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.achievementItemTitle}>Season 5 Chempioni</Text>
                  <Text style={styles.achievementItemDesc}>
                    Season 5 turnirlarida yuqori faollik va 50,000+ XP to'plagan.
                  </Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.sendModalBtn}
              onPress={() => setAchievementsModalVisible(false)}
            >
              <Text style={styles.sendModalBtnText}>Yopish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MORE OPTIONS MENU MODAL */}
      <Modal
        visible={moreMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMoreMenuVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Qo'shimcha amallar</Text>
              <TouchableOpacity onPress={() => setMoreMenuVisible(false)}>
                <Feather name="x" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.moreMenuItem}
              onPress={() => {
                setMoreMenuVisible(false);
                handleShare();
              }}
            >
              <Feather name="share-2" size={18} color="#FFFFFF" style={{ marginRight: 12 }} />
              <Text style={styles.moreMenuText}>Profilni ulashish</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.moreMenuItem}
              onPress={() => {
                setMoreMenuVisible(false);
                Alert.alert("Do'stlik", `${member.name} ga do'stlik so'rovi yuborildi!`);
              }}
            >
              <Feather name="user-plus" size={18} color="#34D399" style={{ marginRight: 12 }} />
              <Text style={styles.moreMenuText}>Do'stlar ro'yxatiga qo'shish</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.moreMenuItem}
              onPress={() => {
                setMoreMenuVisible(false);
                Alert.alert("Shikoyat", "Shikoyatingiz qabul qilindi va ko'rib chiqiladi.");
              }}
            >
              <Feather name="flag" size={18} color="#F87171" style={{ marginRight: 12 }} />
              <Text style={[styles.moreMenuText, { color: '#F87171' }]}>Shikoyat qilish</Text>
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
  headerRightButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // SCROLL CONTENT
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },

  // 2. HERO SECTION
  heroSection: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 14,
    marginBottom: 10,
  },
  heroMountainBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.6,
  },
  avatarFrameContainer: {
    position: 'relative',
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSvgFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  avatarCircleBorder: {
    width: 106,
    height: 106,
    borderRadius: 53,
    borderWidth: 3,
    borderColor: '#A855F7',
    overflow: 'hidden',
    backgroundColor: '#1E1B4B',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  levelBadgePill: {
    position: 'absolute',
    bottom: 12,
    zIndex: 3,
    backgroundColor: '#3B0764',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FEF08A',
    letterSpacing: 0.5,
  },
  nameStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  memberNameText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginRight: 8,
  },
  onlineStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  onlineStatusText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#34D399',
  },
  rolePillWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.45)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginTop: 8,
  },
  rolePillText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FBBF24',
  },

  // 3. THREE STATS CARDS
  threeStatsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 15, 42, 0.85)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.22)',
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconWrap: {
    marginBottom: 4,
  },
  statColLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 2,
  },
  statColValueGold: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#FBBF24',
    textAlign: 'center',
    marginTop: 3,
  },
  statColValueWhite: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 3,
  },
  statColDivider: {
    width: 1,
    height: 42,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },

  // 4. FAOLLIK STATISTIKASI (SEASON 5)
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitleIconWrap: {
    marginRight: 6,
  },
  sectionTitleText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  activityGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  activityCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(20, 15, 38, 0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.22)',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginHorizontal: 3,
  },
  activityIconWrap: {
    marginBottom: 6,
  },
  activityCardValue: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  activityCardLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },

  // 5. YUTUQLAR VA NISHONLAR
  achievementsCard: {
    backgroundColor: 'rgba(20, 15, 42, 0.85)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.22)',
    padding: 14,
    marginBottom: 12,
  },
  achievementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  achievementsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  badgesDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 4,
  },
  badgeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  s5TextOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  s5Text: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FEF08A',
  },

  // 6. BOTTOM PINNED BUTTON
  bottomStickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: '#070814',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  messageButtonTouchable: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  messageButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
  },
  messageButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
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
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  chatModalSub: {
    fontSize: 12.5,
    color: '#CBD5E1',
    marginBottom: 10,
  },
  chatTextInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 14,
    color: '#FFFFFF',
    padding: 12,
    fontSize: 13.5,
    height: 90,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  quickPhrasesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
  },
  quickPhraseChip: {
    backgroundColor: 'rgba(126, 34, 206, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 6,
  },
  quickPhraseText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#E9D5FF',
  },
  sendModalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    paddingVertical: 12,
  },
  sendModalBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Achievements Modal
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  achievementBadgeMini: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.5)',
  },
  achievementItemTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  achievementItemDesc: {
    fontSize: 11.5,
    color: '#94A3B8',
    lineHeight: 16,
    marginTop: 2,
  },

  // More Menu
  moreMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  moreMenuText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

