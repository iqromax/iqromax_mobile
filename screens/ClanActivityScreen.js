import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Platform,
  Animated,
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
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Circle,
} from 'react-native-svg';

const { width } = Dimensions.get('window');

// Filter Tabs definition
const FILTER_TABS = [
  { id: 'all', label: 'Barchasi', icon: 'format-list-bulleted' },
  { id: 'members', label: "A'zolar", icon: 'account-multiple-outline' },
  { id: 'missions', label: 'Missions', icon: 'target' },
  { id: 'season', label: 'Season', icon: 'trophy-outline' },
  { id: 'system', label: 'Tizim', icon: 'layers-outline' },
];

export default function ClanActivityScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('all');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.screenRoot}>
      <StatusBar barStyle="light-content" backgroundColor="#070814" />

      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerTitlesCol}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.backBreadcrumb}
              onPress={() => {
                navigation.navigate('ClanTransitionScreen', {
                  type: 'toIqromax',
                  target: 'StudentDashboard',
                });
              }}
            >
              <View style={styles.backArrowBadge}>
                <Feather name="chevron-left" size={16} color="#C084FC" />
              </View>
              <Text style={styles.headerSubtitleBadge}>IQROMAX Clan</Text>
            </TouchableOpacity>

            <Text style={styles.screenTitle}>Clan Activity</Text>
            <Text style={styles.screenSubtitle}>Claningizdagi so'nggi faoliyatlar</Text>
          </View>
        </View>

        {/* Scrollable Content */}
        <Animated.ScrollView
          style={[
            styles.scrollContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
          contentContainerStyle={[
            styles.scrollInner,
            { paddingBottom: insets.bottom + 40 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Clan Banner Card (Wolf Legends) */}
          <View style={styles.clanBannerCard}>
            <LinearGradient
              colors={['#1F1648', '#141235', '#0E0D24']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />

            {/* Wolf Artwork on Right with Fade Overlay */}
            <View style={styles.wolfArtContainer}>
              <Image
                source={require('../assets/clan_wolf_head.jpg')}
                style={styles.wolfArtImage}
                contentFit="cover"
              />
              <LinearGradient
                colors={['#141235', 'rgba(20, 18, 53, 0.75)', 'transparent']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 0.7, y: 0.5 }}
                style={StyleSheet.absoluteFillObject}
              />
              <LinearGradient
                colors={['transparent', 'rgba(14, 13, 36, 0.9)', '#0E0D24']}
                start={{ x: 0.5, y: 0.4 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />
            </View>

            {/* Left Info: Shield + Clan Name & Members */}
            <View style={styles.clanBannerLeft}>
              {/* Purple Shield Emblem with Golden Crown */}
              <View style={styles.shieldEmblemWrap}>
                <Svg width={46} height={46} viewBox="0 0 100 100">
                  <Defs>
                    <SvgGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0%" stopColor="#C084FC" />
                      <Stop offset="50%" stopColor="#8B5CF6" />
                      <Stop offset="100%" stopColor="#4C1D95" />
                    </SvgGradient>
                    <SvgGradient id="crownGrad" x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0%" stopColor="#FDE68A" />
                      <Stop offset="100%" stopColor="#F59E0B" />
                    </SvgGradient>
                  </Defs>
                  {/* Shield shape */}
                  <Path
                    d="M50 16L24 28v26c0 16 11 31 26 34 15-3 26-18 26-34V28L50 16z"
                    fill="url(#shieldGrad)"
                    stroke="#E9D5FF"
                    strokeWidth="2.5"
                  />
                  {/* Crown inside shield */}
                  <Path
                    d="M36 46l4 14h20l4-14-7 6-7-10-7 10-7-6z"
                    fill="url(#crownGrad)"
                  />
                  <Circle cx="50" cy="52" r="2.8" fill="#FFFFFF" />
                </Svg>
              </View>

              <View style={styles.clanBannerTextCol}>
                <Text style={styles.clanNameTitle}>Wolf Legends</Text>
                <Text style={styles.clanMetaText}>Lv. 12  ·  8/10 Members</Text>

                {/* Active Clan Pill Badge */}
                <View style={styles.activeClanPill}>
                  <View style={styles.activeGreenDot} />
                  <Text style={styles.activeClanText}>Active Clan</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Horizontal Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollTrack}
            style={styles.filterScrollView}
          >
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  activeOpacity={0.8}
                  onPress={() => setActiveFilter(tab.id)}
                  style={[
                    styles.filterChip,
                    isActive && styles.filterChipActive,
                  ]}
                >
                  {isActive ? (
                    <LinearGradient
                      colors={['#9333EA', '#7C3AED']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.filterChipActiveGrad}
                    >
                      <MaterialCommunityIcons
                        name={tab.icon}
                        size={16}
                        color="#FFFFFF"
                      />
                      <Text style={styles.filterChipActiveLabel}>
                        {tab.label}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.filterChipInactiveInner}>
                      <MaterialCommunityIcons
                        name={tab.icon}
                        size={16}
                        color="#94A3B8"
                      />
                      <Text style={styles.filterChipInactiveLabel}>
                        {tab.label}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* TIMELINE SECTION 1: Bugun */}
          <View style={styles.timelineSection}>
            <Text style={styles.sectionHeaderTitle}>Bugun</Text>

            {/* Timeline Stream */}
            <View style={styles.timelineStream}>
              {/* Left Continuous Track Line */}
              <View style={styles.timelineTrackLine} />

              {/* Event 1: Ali_Pro - Clan vazifasini bajardi */}
              <View style={styles.timelineRow}>
                {/* Node Icon on Left */}
                <View style={[styles.timelineNode, { borderColor: '#22C55E' }]}>
                  <LinearGradient
                    colors={['rgba(34, 197, 94, 0.3)', 'rgba(34, 197, 94, 0.1)']}
                    style={styles.timelineNodeBg}
                  >
                    <MaterialCommunityIcons name="target" size={17} color="#22C55E" />
                  </LinearGradient>
                </View>

                {/* Card on Right */}
                <View style={styles.timelineCard}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.cardUserLeft}>
                      <Image
                        source={require('../assets/avatar_alex.jpg')}
                        style={[styles.userAvatar, { borderColor: '#3B82F6' }]}
                      />
                      <View style={styles.userInfoTextCol}>
                        <Text style={styles.userNameText}>Ali_Pro</Text>
                        <Text style={styles.userActionText}>Clan vazifasini bajardi</Text>
                      </View>
                    </View>

                    {/* XP Badge Top Right */}
                    <View style={styles.xpBadgeGreen}>
                      <Text style={styles.xpBadgeGreenText}>+150 XP</Text>
                    </View>
                  </View>

                  {/* Task Tag & Timestamp */}
                  <View style={styles.cardFooterRow}>
                    <View style={styles.taskTagPill}>
                      <MaterialCommunityIcons name="target" size={12} color="#C084FC" />
                      <Text style={styles.taskTagText}>"10 ta savol yechish"</Text>
                    </View>
                    <Text style={styles.timestampText}>2 daqiqa oldin</Text>
                  </View>
                </View>
              </View>

              {/* Event 2: Sardor - Clanga yangi a'zo qo'shildi */}
              <View style={styles.timelineRow}>
                <View style={[styles.timelineNode, { borderColor: '#A855F7' }]}>
                  <LinearGradient
                    colors={['rgba(168, 85, 247, 0.35)', 'rgba(168, 85, 247, 0.1)']}
                    style={styles.timelineNodeBg}
                  >
                    <MaterialCommunityIcons name="account-plus" size={17} color="#C084FC" />
                  </LinearGradient>
                </View>

                <View style={styles.timelineCard}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.cardUserLeft}>
                      <Image
                        source={require('../assets/avatar_sophia.png')}
                        style={[styles.userAvatar, { borderColor: '#A855F7' }]}
                      />
                      <View style={styles.userInfoTextCol}>
                        <Text style={styles.userNameText}>Sardor</Text>
                        <Text style={styles.userActionText}>Clanga yangi a'zo qo'shildi</Text>
                      </View>
                    </View>
                    <Text style={styles.timestampText}>12 daqiqa oldin</Text>
                  </View>
                </View>
              </View>

              {/* Event 3: Clan XP oshirildi */}
              <View style={styles.timelineRow}>
                <View style={[styles.timelineNode, { borderColor: '#F59E0B' }]}>
                  <LinearGradient
                    colors={['rgba(245, 158, 11, 0.3)', 'rgba(245, 158, 11, 0.1)']}
                    style={styles.timelineNodeBg}
                  >
                    <MaterialCommunityIcons name="layers" size={17} color="#F59E0B" />
                  </LinearGradient>
                </View>

                <View style={styles.timelineCard}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.userInfoTextCol}>
                      <Text style={styles.userNameText}>Clan XP oshirildi</Text>
                      <Text style={styles.userActionText}>Jamoaviy faoliyat orqali</Text>
                    </View>

                    <View style={styles.xpBadgeGold}>
                      <Text style={styles.xpBadgeGoldText}>+250 XP</Text>
                    </View>
                  </View>

                  <View style={[styles.cardFooterRow, { justifyContent: 'flex-end', marginTop: 4 }]}>
                    <Text style={styles.timestampText}>27 daqiqa oldin</Text>
                  </View>
                </View>
              </View>

              {/* Event 4: Season progress yangilandi */}
              <View style={styles.timelineRow}>
                <View style={[styles.timelineNode, { borderColor: '#818CF8' }]}>
                  <LinearGradient
                    colors={['rgba(129, 140, 248, 0.3)', 'rgba(129, 140, 248, 0.1)']}
                    style={styles.timelineNodeBg}
                  >
                    <MaterialCommunityIcons name="trophy" size={16} color="#818CF8" />
                  </LinearGradient>
                </View>

                <View style={styles.timelineCard}>
                  <View style={styles.cardHeaderRow}>
                    <View style={[styles.userInfoTextCol, { flex: 1 }]}>
                      <Text style={styles.userNameText}>Season progress yangilandi</Text>
                      <Text style={styles.userActionText}>Clan 24,500 XP ga yetdi</Text>
                    </View>

                    {/* Progress Bar & Value on Right */}
                    <View style={styles.seasonProgressCol}>
                      <Text style={styles.seasonProgressValues}>
                        <Text style={{ color: '#FFFFFF' }}>24,500</Text>
                        <Text style={{ color: '#64748B' }}> / 50,000 XP</Text>
                      </Text>
                      <View style={styles.seasonProgressBarTrack}>
                        <LinearGradient
                          colors={['#C084FC', '#8B5CF6']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={[styles.seasonProgressBarFill, { width: '49%' }]}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={[styles.cardFooterRow, { justifyContent: 'flex-end', marginTop: 6 }]}>
                    <Text style={styles.timestampText}>1 soat oldin</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* TIMELINE SECTION 2: Kecha */}
          <View style={[styles.timelineSection, { marginTop: 16 }]}>
            <Text style={styles.sectionHeaderTitle}>Kecha</Text>

            <View style={styles.timelineStream}>
              <View style={styles.timelineTrackLine} />

              {/* Event 5: Bekzod - Clan vazifasini bajardi */}
              <View style={styles.timelineRow}>
                <View style={[styles.timelineNode, { borderColor: '#22C55E' }]}>
                  <LinearGradient
                    colors={['rgba(34, 197, 94, 0.3)', 'rgba(34, 197, 94, 0.1)']}
                    style={styles.timelineNodeBg}
                  >
                    <MaterialCommunityIcons name="target" size={17} color="#22C55E" />
                  </LinearGradient>
                </View>

                <View style={styles.timelineCard}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.cardUserLeft}>
                      <Image
                        source={require('../assets/avatar_david.jpg')}
                        style={[styles.userAvatar, { borderColor: '#A855F7' }]}
                      />
                      <View style={styles.userInfoTextCol}>
                        <Text style={styles.userNameText}>Bekzod</Text>
                        <Text style={styles.userActionText}>Clan vazifasini bajardi</Text>
                      </View>
                    </View>

                    <View style={styles.xpBadgeGreen}>
                      <Text style={styles.xpBadgeGreenText}>+300 XP</Text>
                    </View>
                  </View>

                  <View style={styles.cardFooterRow}>
                    <View style={styles.taskTagPill}>
                      <MaterialCommunityIcons name="target" size={12} color="#C084FC" />
                      <Text style={styles.taskTagText}>"5 kunlik streak" 🔥</Text>
                    </View>
                    <Text style={styles.timestampText}>Kecha, 22:14</Text>
                  </View>
                </View>
              </View>

              {/* Event 6: Clan reytingi yangilandi */}
              <View style={styles.timelineRow}>
                <View style={[styles.timelineNode, { borderColor: '#F59E0B' }]}>
                  <LinearGradient
                    colors={['rgba(245, 158, 11, 0.3)', 'rgba(245, 158, 11, 0.1)']}
                    style={styles.timelineNodeBg}
                  >
                    <MaterialCommunityIcons name="trophy" size={16} color="#F59E0B" />
                  </LinearGradient>
                </View>

                <View style={styles.timelineCard}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.userInfoTextCol}>
                      <Text style={styles.userNameText}>Clan reytingi yangilandi</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <Text style={styles.userActionText}>Global reytingda +3 pog'ona </Text>
                        <Feather name="trending-up" size={13} color="#22C55E" />
                      </View>
                    </View>

                    {/* Rank Badge #47 ↑ +3 */}
                    <View style={styles.rankBadgePill}>
                      <Text style={styles.rankBadgeNum}>#47</Text>
                      <View style={styles.rankBadgeGainRow}>
                        <Feather name="arrow-up" size={11} color="#22C55E" />
                        <Text style={styles.rankBadgeGainText}>+3</Text>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.cardFooterRow, { justifyContent: 'flex-end', marginTop: 4 }]}>
                    <Text style={styles.timestampText}>Kecha, 20:36</Text>
                  </View>
                </View>
              </View>

              {/* Event 7: Clan mukofoti ochildi */}
              <View style={styles.timelineRow}>
                <View style={[styles.timelineNode, { borderColor: '#C084FC' }]}>
                  <LinearGradient
                    colors={['rgba(192, 132, 252, 0.35)', 'rgba(192, 132, 252, 0.1)']}
                    style={styles.timelineNodeBg}
                  >
                    <MaterialCommunityIcons name="gift-outline" size={17} color="#C084FC" />
                  </LinearGradient>
                </View>

                <View style={styles.timelineCard}>
                  <View style={styles.cardHeaderRow}>
                    <View style={[styles.userInfoTextCol, { flex: 1, paddingRight: 8 }]}>
                      <Text style={styles.userNameText}>Clan mukofoti ochildi</Text>
                      <Text style={styles.userActionText}>Haftalik vazifalar to'liq bajarildi</Text>
                    </View>

                    {/* Chest Image Thumbnail */}
                    <View style={styles.chestThumbWrap}>
                      <Image
                        source={require('../assets/clan_chest_purple.jpg')}
                        style={styles.chestThumbImage}
                        contentFit="contain"
                      />
                    </View>
                  </View>

                  <View style={[styles.cardFooterRow, { justifyContent: 'flex-end', marginTop: 4 }]}>
                    <Text style={styles.timestampText}>Kecha, 18:09</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: '#090A15',
  },
  safeArea: {
    flex: 1,
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 12 : 4,
    paddingBottom: 10,
  },
  headerTitlesCol: {
    flex: 1,
  },
  backBreadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    marginLeft: -2,
  },
  backArrowBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(168, 85, 247, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  headerSubtitleBadge: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#A8AABD',
  },
  screenTitle: {
    fontSize: 22,
    fontFamily: 'Inter_900Black',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  screenSubtitle: {
    fontSize: 12.5,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginTop: 2,
  },

  /* Scroll Content */
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },

  /* Clan Banner Card */
  clanBannerCard: {
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    overflow: 'hidden',
    position: 'relative',
    padding: 16,
    minHeight: 110,
    justifyContent: 'center',
  },
  wolfArtContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '52%',
    overflow: 'hidden',
  },
  wolfArtImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  clanBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
    maxWidth: '65%',
  },
  shieldEmblemWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  clanBannerTextCol: {
    justifyContent: 'center',
  },
  clanNameTitle: {
    fontSize: 17,
    fontFamily: 'Inter_800ExtraBold',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  clanMetaText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginTop: 2,
  },
  activeClanPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  activeGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 5,
  },
  activeClanText: {
    fontSize: 10.5,
    fontFamily: 'Inter_700Bold',
    color: '#4ADE80',
    letterSpacing: 0.3,
  },

  /* Horizontal Filter Chips */
  filterScrollView: {
    marginTop: 14,
    marginBottom: 4,
  },
  filterScrollTrack: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  filterChip: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  filterChipActive: {
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  filterChipActiveGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 6,
  },
  filterChipActiveLabel: {
    fontSize: 12.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  filterChipInactiveInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 19, 38, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 6,
  },
  filterChipInactiveLabel: {
    fontSize: 12.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#94A3B8',
  },

  /* Timeline Sections */
  timelineSection: {
    marginTop: 14,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#94A3B8',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  timelineStream: {
    position: 'relative',
    paddingLeft: 4,
  },
  timelineTrackLine: {
    position: 'absolute',
    top: 18,
    bottom: 24,
    left: 17, // center of the 28px node (4 + 14 - 1)
    width: 2,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  timelineNode: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: '#090A15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 10,
    zIndex: 2,
    overflow: 'hidden',
  },
  timelineNodeBg: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Timeline Cards */
  timelineCard: {
    flex: 1,
    backgroundColor: '#0F1022',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 16,
    padding: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardUserLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    marginRight: 9,
  },
  userInfoTextCol: {
    justifyContent: 'center',
  },
  userNameText: {
    fontSize: 13.5,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  userActionText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginTop: 1.5,
  },

  /* XP Pill Badges */
  xpBadgeGreen: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.35)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  xpBadgeGreenText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#4ADE80',
  },
  xpBadgeGold: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  xpBadgeGoldText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#FBBF24',
  },

  /* Footer Row (Tags & Time) */
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  taskTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(168, 85, 247, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.25)',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    gap: 4,
  },
  taskTagText: {
    fontSize: 10.5,
    fontFamily: 'Inter_600SemiBold',
    color: '#E9D5FF',
  },
  timestampText: {
    fontSize: 10.5,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
  },

  /* Season Progress on Card */
  seasonProgressCol: {
    alignItems: 'flex-end',
  },
  seasonProgressValues: {
    fontSize: 10.5,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  seasonProgressBarTrack: {
    width: 90,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  seasonProgressBarFill: {
    height: '100%',
    borderRadius: 2.5,
  },

  /* Rank Badge #47 ↑ +3 */
  rankBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.35)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 6,
  },
  rankBadgeNum: {
    fontSize: 11,
    fontFamily: 'Inter_800ExtraBold',
    color: '#FFFFFF',
  },
  rankBadgeGainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  rankBadgeGainText: {
    fontSize: 10.5,
    fontFamily: 'Inter_800ExtraBold',
    color: '#22C55E',
  },

  /* Chest Thumbnail */
  chestThumbWrap: {
    width: 44,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  chestThumbImage: {
    width: 38,
    height: 34,
  },
});
