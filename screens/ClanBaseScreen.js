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

// 4 BUILDINGS DATA (matching mockup)
const BUILDINGS_DATA = [
  {
    id: 'hq',
    name: 'Bosh qarorgoh',
    level: 5,
    subtitle: 'Clan imkoniyatlarini kengaytiradi',
    type: 'castle',
    currentPerk: "A'zolar sig'imi: 10 ta, barcha binolar uchun baza",
    nextPerk: "A'zolar sig'imi: 12 ta, yangi turnir rejimi ochiladi",
    upgradeCostXp: 15000,
    upgradeCostCoin: 25000,
  },
  {
    id: 'training',
    name: 'Trening markazi',
    level: 4,
    subtitle: "A'zolarning Battle kuchini oshiradi",
    type: 'training',
    currentPerk: "Battle g'alabalarida +10% qo'shimcha XP",
    nextPerk: "Battle g'alabalarida +15% qo'shimcha XP va +5% tanga",
    upgradeCostXp: 12000,
    upgradeCostCoin: 20000,
  },
  {
    id: 'lab',
    name: 'Tadqiqot laboratoriyasi',
    level: 3,
    subtitle: 'Maxsus bonuslar va rivojlanish',
    type: 'lab',
    currentPerk: 'Kundalik vazifalar uchun +1 qo\'shimcha energiya',
    nextPerk: 'Kundalik vazifalar uchun +2 energiya va tezkor tiklanish',
    upgradeCostXp: 10000,
    upgradeCostCoin: 18000,
  },
  {
    id: 'treasury',
    name: 'Xazina ombori',
    level: 4,
    subtitle: 'Clan mukofotlarini saqlaydi',
    type: 'treasury',
    currentPerk: 'Haftalik Clan sandig\'ida +20% ko\'proq oltin tangalar',
    nextPerk: 'Haftalik Clan sandig\'ida +35% oltin tangalar va sirli sovg\'alar',
    upgradeCostXp: 12000,
    upgradeCostCoin: 22000,
  },
];

export default function ClanBaseScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('binolar'); // 'binolar' | 'upgrade' | 'bonuslar'
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [buildings, setBuildings] = useState(BUILDINGS_DATA);

  const triggerHaptic = (type = 'light') => {
    try {
      if (type === 'medium') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (e) {}
  };

  const handleUpgradeBuilding = (bld) => {
    triggerHaptic('medium');
    setBuildings((prev) =>
      prev.map((b) => (b.id === bld.id ? { ...b, level: b.level + 1 } : b))
    );
    setSelectedBuilding((prev) =>
      prev ? { ...prev, level: prev.level + 1 } : null
    );
    Alert.alert(
      'Muvaffaqiyatli!',
      `${bld.name} muvaffaqiyatli Lv.${bld.level + 1} ga takomillashtirildi! 🎉`
    );
  };

  // 1. ISOMETRIC FLOATING CASTLE ISLAND HERO GRAPHIC
  const renderFloatingCastleHero = () => {
    return (
      <View style={styles.floatingHeroWrapper}>
        <Svg width={width * 0.58} height={175} viewBox="0 0 240 180">
          <Defs>
            {/* Castle Purple Gradient */}
            <SvgGradient id="cGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#8B5CF6" />
              <Stop offset="50%" stopColor="#6D28D9" />
              <Stop offset="100%" stopColor="#4C1D95" />
            </SvgGradient>

            {/* Castle Wall Shadow */}
            <SvgGradient id="cShadow" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#4C1D95" />
              <Stop offset="100%" stopColor="#2E1065" />
            </SvgGradient>

            {/* Rock Floating Island Gradient */}
            <SvgGradient id="rockGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#475569" />
              <Stop offset="40%" stopColor="#334155" />
              <Stop offset="80%" stopColor="#1E293B" />
              <Stop offset="100%" stopColor="#0F172A" />
            </SvgGradient>

            {/* Grass Courtyard Gradient */}
            <SvgGradient id="grassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#15803D" />
              <Stop offset="50%" stopColor="#166534" />
              <Stop offset="100%" stopColor="#14532D" />
            </SvgGradient>

            {/* Warm Golden Windows */}
            <SvgGradient id="warmLight" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FEF08A" />
              <Stop offset="100%" stopColor="#F59E0B" />
            </SvgGradient>

            {/* Banner Gold */}
            <SvgGradient id="bGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FDE047" />
              <Stop offset="100%" stopColor="#D97706" />
            </SvgGradient>
          </Defs>

          {/* Floating Rocky Island Base */}
          <Path
            d="M 10 135 L 70 168 L 120 178 L 180 166 L 230 132 L 205 116 L 120 102 L 35 116 Z"
            fill="url(#rockGrad)"
          />
          {/* Island Chiseled Rock details */}
          <Polygon points="70,168 120,178 120,135 70,126" fill="#1E293B" opacity={0.6} />
          <Polygon points="120,178 180,166 170,128 120,135" fill="#0F172A" opacity={0.8} />
          <Polygon points="10,135 70,168 70,126 25,120" fill="#334155" opacity={0.7} />

          {/* Grass Courtyard Top */}
          <Polygon points="25,120 120,95 215,120 120,140" fill="url(#grassGrad)" stroke="#166534" strokeWidth="1" />

          {/* Courtyard Stone Path */}
          <Polygon points="108,138 120,118 132,138" fill="#94A3B8" opacity={0.7} />

          {/* Left Waving Clan Banner */}
          <G transform="translate(14, 46)">
            {/* Golden Pole */}
            <Rect x="16" y="0" width="3" height="75" fill="url(#bGold)" />
            <Circle cx="17.5" cy="0" r="3.5" fill="#FEF08A" />
            {/* Crossbar */}
            <Rect x="4" y="6" width="27" height="3" fill="url(#bGold)" />
            {/* Banner Fabric */}
            <Path
              d="M 6 9 L 29 9 L 29 48 L 17.5 56 L 6 48 Z"
              fill="#7E22CE"
              stroke="url(#bGold)"
              strokeWidth="1.2"
            />
            {/* Crown on Left Banner */}
            <Path
              d="M 12 28 L 23 28 C 23 28 24 24 23 21 L 20 23 L 17.5 18 L 15 23 L 12 21 Z"
              fill="#FEF08A"
            />
          </G>

          {/* Right Waving Clan Banner */}
          <G transform="translate(195, 52) scale(0.9)">
            <Rect x="16" y="0" width="3" height="70" fill="url(#bGold)" />
            <Circle cx="17.5" cy="0" r="3" fill="#FEF08A" />
            <Rect x="4" y="6" width="27" height="3" fill="url(#bGold)" />
            <Path
              d="M 6 9 L 29 9 L 29 45 L 17.5 52 L 6 45 Z"
              fill="#7E22CE"
              stroke="url(#bGold)"
              strokeWidth="1.2"
            />
            <Path
              d="M 12 26 L 23 26 C 23 26 24 22 23 19 L 20 21 L 17.5 16 L 15 21 L 12 19 Z"
              fill="#FEF08A"
            />
          </G>

          {/* Castle Central Keep Base Walls */}
          <Polygon points="65,115 120,132 175,115 175,70 120,86 65,70" fill="url(#cGrad)" />
          {/* Shaded right face */}
          <Polygon points="120,132 175,115 175,70 120,86" fill="url(#cShadow)" opacity={0.65} />

          {/* Left Tower */}
          <Polygon points="55,108 78,116 78,60 55,54" fill="url(#cGrad)" />
          <Polygon points="78,116 88,112 88,56 78,60" fill="url(#cShadow)" />
          <Polygon points="52,54 78,40 88,42 78,60" fill="#6B21A8" stroke="#A855F7" strokeWidth="0.8" />
          <Rect x="64" y="75" width="4" height="7" rx="2" fill="url(#warmLight)" />

          {/* Right Tower */}
          <Polygon points="152,112 165,116 165,60 152,56" fill="url(#cGrad)" />
          <Polygon points="165,116 185,108 185,54 165,60" fill="url(#cShadow)" />
          <Polygon points="152,56 165,40 188,54 165,60" fill="#6B21A8" stroke="#A855F7" strokeWidth="0.8" />
          <Rect x="168" y="75" width="4" height="7" rx="2" fill="url(#warmLight)" />

          {/* Center Main High Tower */}
          <Polygon points="95,80 120,90 145,80 145,36 120,44 95,36" fill="url(#cGrad)" />
          <Polygon points="120,90 145,80 145,36 120,44" fill="url(#cShadow)" opacity={0.6} />

          {/* Center High Spire & Flag */}
          <Polygon points="90,36 120,10 150,36 120,44" fill="#581C87" stroke="#C084FC" strokeWidth="1" />
          <Rect x="119" y="0" width="2" height="12" fill="#FEF08A" />
          <Polygon points="121,1 138,5 121,9" fill="#E879F9" />

          {/* Center High Window */}
          <Rect x="115" y="55" width="10" height="14" rx="5" fill="url(#warmLight)" />

          {/* Glowing Castle Arch Gate */}
          <Path
            d="M 110 128 L 110 110 Q 120 102 130 110 L 130 128 Z"
            fill="url(#warmLight)"
            stroke="#D97706"
            strokeWidth="1.5"
          />
          {/* Gate Grill */}
          <Path d="M 115 107 L 115 128 M 120 105 L 120 128 M 125 107 L 125 128" stroke="#78350F" strokeWidth="0.8" />

          {/* Small Castle Windows */}
          <Rect x="85" y="85" width="6" height="9" rx="3" fill="url(#warmLight)" />
          <Rect x="148" y="85" width="6" height="9" rx="3" fill="url(#warmLight)" />
        </Svg>
      </View>
    );
  };

  // 2. ISOMETRIC MINI BUILDING ICONS FOR LIST ITEMS
  const renderBuildingIcon = (type) => {
    if (type === 'castle') {
      return (
        <Svg width={54} height={54} viewBox="0 0 60 60">
          <Defs>
            <SvgGradient id="bHqG" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#A855F7" />
              <Stop offset="100%" stopColor="#581C87" />
            </SvgGradient>
          </Defs>
          {/* Base */}
          <Polygon points="8,44 30,53 52,44 30,35" fill="#15803D" />
          {/* Walls */}
          <Polygon points="14,42 30,48 46,42 46,26 30,31 14,26" fill="url(#bHqG)" />
          {/* Right Shadow */}
          <Polygon points="30,48 46,42 46,26 30,31" fill="#3B0764" opacity={0.6} />
          {/* Central Tower */}
          <Polygon points="23,28 30,31 37,28 37,16 30,19 23,16" fill="#7E22CE" />
          <Polygon points="20,16 30,6 40,16 30,19" fill="#9333EA" stroke="#FDE047" strokeWidth="0.8" />
          {/* Gate */}
          <Rect x="27" y="39" width="6" height="8" rx="3" fill="#FBBF24" />
        </Svg>
      );
    }
    if (type === 'training') {
      return (
        <Svg width={54} height={54} viewBox="0 0 60 60">
          <Defs>
            <SvgGradient id="bTrnG" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#7E22CE" />
              <Stop offset="100%" stopColor="#3B0764" />
            </SvgGradient>
          </Defs>
          <Polygon points="8,44 30,53 52,44 30,35" fill="#15803D" />
          {/* Training Hall Walls */}
          <Polygon points="15,40 30,47 45,40 45,26 30,32 15,26" fill="url(#bTrnG)" />
          <Polygon points="30,47 45,40 45,26 30,32" fill="#2E1065" opacity={0.7} />
          {/* Pagoda Roof */}
          <Polygon points="10,26 30,12 50,26 30,32" fill="#D97706" stroke="#FEF08A" strokeWidth="1" />
          <Rect x="29" y="6" width="2" height="8" fill="#FEF08A" />
          <Polygon points="31,7 39,9 31,12" fill="#F87171" />
          {/* Bright Doorway */}
          <Rect x="26" y="36" width="8" height="10" rx="3" fill="#FDE047" />
        </Svg>
      );
    }
    if (type === 'lab') {
      return (
        <Svg width={54} height={54} viewBox="0 0 60 60">
          <Defs>
            <SvgGradient id="bLabG" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#818CF8" />
              <Stop offset="100%" stopColor="#3730A3" />
            </SvgGradient>
          </Defs>
          <Polygon points="8,44 30,53 52,44 30,35" fill="#15803D" />
          {/* Hexagonal Base */}
          <Polygon points="16,40 30,47 44,40 44,28 30,34 16,28" fill="#4338CA" />
          <Polygon points="30,47 44,40 44,28 30,34" fill="#312E81" opacity={0.7} />
          {/* Glass Crystal Observatory Dome */}
          <Path
            d="M 18 28 C 18 12 42 12 42 28 Z"
            fill="url(#bLabG)"
            stroke="#A78BFA"
            strokeWidth="1.2"
          />
          {/* Arcane Crystal Spire */}
          <Polygon points="30,5 34,14 30,18 26,14" fill="#38BDF8" stroke="#E0E7FF" strokeWidth="0.8" />
          <Rect x="27" y="36" width="6" height="9" rx="2" fill="#FDE047" />
        </Svg>
      );
    }
    // Treasury
    return (
      <Svg width={54} height={54} viewBox="0 0 60 60">
        <Defs>
          <SvgGradient id="bVaultG" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#F59E0B" />
            <Stop offset="100%" stopColor="#78350F" />
          </SvgGradient>
        </Defs>
        <Polygon points="8,44 30,53 52,44 30,35" fill="#15803D" />
        {/* Vault Chamber */}
        <Polygon points="14,41 30,48 46,41 46,26 30,32 14,26" fill="url(#bVaultG)" />
        <Polygon points="30,48 46,41 46,26 30,32" fill="#451A03" opacity={0.7} />
        {/* Gold Roof */}
        <Polygon points="10,26 30,14 50,26 30,33" fill="#FBBF24" stroke="#FEF08A" strokeWidth="1.2" />
        {/* Heavy Vault Gate */}
        <Path d="M 26 47 L 26 36 Q 30 32 34 36 L 34 47 Z" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />
      </Svg>
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
            <Text style={styles.headerTitleText}>Clan Base</Text>
            <Text style={styles.headerSubtitleText}>Clan bazasi va rivojlanish</Text>
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
            { paddingBottom: Math.max(insets.bottom, 20) + 20 },
          ]}
        >
          {/* 2. TOP HERO SECTION (Island Castle on Left, Base Level Card on Right) */}
          <View style={styles.heroRow}>
            {/* Left 3D Island Castle */}
            {renderFloatingCastleHero()}

            {/* Right Clan Base Level Card */}
            <View style={styles.baseLevelCard}>
              {/* Golden Shield with Lv.5 inside */}
              <View style={styles.shieldLvWrap}>
                <Svg width={64} height={64} viewBox="0 0 64 64">
                  <Defs>
                    <SvgGradient id="sGoldG" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor="#FDE047" />
                      <Stop offset="50%" stopColor="#F59E0B" />
                      <Stop offset="100%" stopColor="#B45309" />
                    </SvgGradient>
                    <SvgGradient id="sDarkG" x1="0%" y1="0%" x2="0%" y2="100%">
                      <Stop offset="0%" stopColor="#451A03" />
                      <Stop offset="100%" stopColor="#1E1035" />
                    </SvgGradient>
                  </Defs>
                  {/* Outer Shield */}
                  <Path
                    d="M 32 6 L 54 16 C 54 42 32 58 32 58 C 32 58 10 42 10 16 Z"
                    fill="url(#sDarkG)"
                    stroke="url(#sGoldG)"
                    strokeWidth="3"
                  />
                  {/* Inner Gold Thin Rim */}
                  <Path
                    d="M 32 11 L 49 19 C 49 39 32 52 32 52 C 32 52 15 39 15 19 Z"
                    fill="none"
                    stroke="rgba(253, 224, 71, 0.4)"
                    strokeWidth="1"
                  />
                </Svg>
                <View style={styles.shieldLvTextOverlay}>
                  <Text style={styles.shieldLvText}>Lv.5</Text>
                </View>
              </View>

              <Text style={styles.baseCardTitle}>Clan Base</Text>
              <Text style={styles.baseCardSub}>Level 5</Text>
            </View>
          </View>

          {/* 3. RIVOJLANISH PROGRESSI CARD */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeaderRow}>
              <Text style={styles.progressTitle}>Rivojlanish progressi</Text>
              <Text style={styles.progressRatio}>
                <Text style={styles.progressRatioGold}>24,500</Text>
                <Text style={styles.progressRatioMuted}> / 50,000 XP</Text>
              </Text>
            </View>

            {/* Glowing Purple Progress Bar */}
            <View style={styles.progressBarTrack}>
              <LinearGradient
                colors={['#C084FC', '#A855F7', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: '49%' }]}
              />
            </View>

            {/* Percentage Text on Right */}
            <View style={styles.progressPercentRow}>
              <Text style={styles.progressPercentText}>49%</Text>
            </View>
          </View>

          {/* 4. THREE SECTION TABS (Binolar | Upgrade | Bonuslar) */}
          <View style={styles.sectionTabsRow}>
            {/* Tab 1: Binolar */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                triggerHaptic();
                setActiveTab('binolar');
              }}
              style={styles.tabTouchable}
            >
              {activeTab === 'binolar' ? (
                <LinearGradient
                  colors={['#9333EA', '#7E22CE']}
                  style={styles.tabActivePill}
                >
                  <MaterialCommunityIcons
                    name="castle"
                    size={17}
                    color="#FFFFFF"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.tabActiveText}>Binolar</Text>
                </LinearGradient>
              ) : (
                <View style={styles.tabInactivePill}>
                  <MaterialCommunityIcons
                    name="castle"
                    size={17}
                    color="#94A3B8"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.tabInactiveText}>Binolar</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Tab 2: Upgrade */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                triggerHaptic();
                setActiveTab('upgrade');
              }}
              style={styles.tabTouchable}
            >
              {activeTab === 'upgrade' ? (
                <LinearGradient
                  colors={['#9333EA', '#7E22CE']}
                  style={styles.tabActivePill}
                >
                  <MaterialCommunityIcons
                    name="anvil"
                    size={16}
                    color="#FFFFFF"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.tabActiveText}>Upgrade</Text>
                </LinearGradient>
              ) : (
                <View style={styles.tabInactivePill}>
                  <MaterialCommunityIcons
                    name="anvil"
                    size={16}
                    color="#94A3B8"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.tabInactiveText}>Upgrade</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Tab 3: Bonuslar */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                triggerHaptic();
                setActiveTab('bonuslar');
              }}
              style={styles.tabTouchable}
            >
              {activeTab === 'bonuslar' ? (
                <LinearGradient
                  colors={['#9333EA', '#7E22CE']}
                  style={styles.tabActivePill}
                >
                  <MaterialCommunityIcons
                    name="view-grid-plus"
                    size={16}
                    color="#FFFFFF"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.tabActiveText}>Bonuslar</Text>
                </LinearGradient>
              ) : (
                <View style={styles.tabInactivePill}>
                  <MaterialCommunityIcons
                    name="view-grid-plus"
                    size={16}
                    color="#94A3B8"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.tabInactiveText}>Bonuslar</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* 5. TAB CONTENT */}
          {activeTab === 'binolar' && (
            <View style={styles.buildingsListCard}>
              {buildings.map((item, index) => {
                const isLast = index === buildings.length - 1;
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.7}
                    onPress={() => {
                      triggerHaptic();
                      setSelectedBuilding(item);
                    }}
                    style={[
                      styles.buildingItemRow,
                      !isLast && styles.buildingItemBorder,
                    ]}
                  >
                    {/* Building Isometric Icon */}
                    <View style={styles.buildingIconWrap}>
                      {renderBuildingIcon(item.type)}
                    </View>

                    {/* Building Meta */}
                    <View style={styles.buildingMetaCol}>
                      <View style={styles.buildingTitleRow}>
                        <Text style={styles.buildingTitleText}>
                          {item.name}
                        </Text>
                        <View style={styles.buildingLevelBadge}>
                          <Text style={styles.buildingLevelText}>
                            Lv.{item.level}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.buildingSubtitleText}>
                        {item.subtitle}
                      </Text>
                    </View>

                    {/* Right Chevron */}
                    <Feather name="chevron-right" size={18} color="#94A3B8" />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {activeTab === 'upgrade' && (
            <View style={styles.upgradeTabCard}>
              <View style={styles.upgradeHeroHeader}>
                <FontAwesome5 name="arrow-circle-up" size={24} color="#FBBF24" />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.upgradeHeroTitle}>
                    Clan Base Level 6 ga o'tish
                  </Text>
                  <Text style={styles.upgradeHeroSub}>
                    Barcha a'zolarga +15% Clan XP va yangi Clan Shop buyumlari
                  </Text>
                </View>
              </View>

              <View style={styles.upgradeReqBox}>
                <Text style={styles.upgradeReqHead}>Talablar:</Text>
                <View style={styles.upgradeReqItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.upgradeReqText}>
                    Clan XP: 24,500 / 50,000 (49%)
                  </Text>
                </View>
                <View style={styles.upgradeReqItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.upgradeReqText}>
                    Barcha binolar Lv.3+ (Bajarildi)
                  </Text>
                </View>
                <View style={styles.upgradeReqItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.upgradeReqText}>
                    Clan a'zolari: 10 / 10 ta
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.upgradeActionBtn}
                onPress={() => {
                  triggerHaptic('medium');
                  Alert.alert(
                    'Upgrade',
                    "Hozirda 24,500 / 50,000 XP to'plangan. Yana 25,500 XP yig'ilgach baza avtomatik ravishda Level 6 ga ko'tariladi!"
                  );
                }}
              >
                <LinearGradient
                  colors={['#9333EA', '#7C3AED']}
                  style={styles.upgradeActionGradient}
                >
                  <FontAwesome5
                    name="hammer"
                    size={16}
                    color="#FFFFFF"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.upgradeActionText}>
                    Baza darajasini oshirish
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'bonuslar' && (
            <View style={styles.bonusTabContainer}>
              <View style={styles.bonusCardItem}>
                <View style={styles.bonusIconBadge}>
                  <MaterialCommunityIcons name="star-shooting" size={20} color="#FBBF24" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.bonusItemTitle}>+15% Clan XP Boost</Text>
                  <Text style={styles.bonusItemSub}>
                    Bosh qarorgoh (Lv.5) orqali barcha faol a'zolar uchun
                  </Text>
                </View>
              </View>

              <View style={styles.bonusCardItem}>
                <View style={[styles.bonusIconBadge, { backgroundColor: 'rgba(168, 85, 247, 0.2)' }]}>
                  <MaterialCommunityIcons name="sword-cross" size={20} color="#C084FC" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.bonusItemTitle}>+10% Battle Coin</Text>
                  <Text style={styles.bonusItemSub}>
                    Trening markazi (Lv.4) orqali jang g'alabalarida
                  </Text>
                </View>
              </View>

              <View style={styles.bonusCardItem}>
                <View style={[styles.bonusIconBadge, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                  <Ionicons name="flash-sharp" size={20} color="#34D399" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.bonusItemTitle}>+1 Kunlik Energiya</Text>
                  <Text style={styles.bonusItemSub}>
                    Tadqiqot laboratoriyasi (Lv.3) orqali
                  </Text>
                </View>
              </View>

              <View style={styles.bonusCardItem}>
                <View style={[styles.bonusIconBadge, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                  <MaterialCommunityIcons name="treasure-chest" size={20} color="#FBBF24" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.bonusItemTitle}>+20% Sandiq tangalari</Text>
                  <Text style={styles.bonusItemSub}>
                    Xazina ombori (Lv.4) orqali haftalik ochilishda
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* BUILDING UPGRADE MODAL */}
      <Modal
        visible={!!selectedBuilding}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedBuilding(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {selectedBuilding && (
              <>
                <View style={styles.modalHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.modalTitle}>{selectedBuilding.name}</Text>
                    <View style={[styles.buildingLevelBadge, { marginLeft: 8 }]}>
                      <Text style={styles.buildingLevelText}>
                        Lv.{selectedBuilding.level}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedBuilding(null)}>
                    <Feather name="x" size={20} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                {/* Building Visual */}
                <View style={styles.modalBuildingIconCenter}>
                  {renderBuildingIcon(selectedBuilding.type)}
                </View>

                {/* Current & Next Perks */}
                <View style={styles.modalPerksBox}>
                  <Text style={styles.modalPerkLabel}>Hozirgi bonus:</Text>
                  <Text style={styles.modalPerkVal}>
                    {selectedBuilding.currentPerk}
                  </Text>

                  <View style={styles.modalPerkDivider} />

                  <Text style={[styles.modalPerkLabel, { color: '#FBBF24' }]}>
                    Keyingi daraja (Lv.{selectedBuilding.level + 1}):
                  </Text>
                  <Text style={[styles.modalPerkVal, { color: '#FEF08A' }]}>
                    {selectedBuilding.nextPerk}
                  </Text>
                </View>

                {/* Cost Row */}
                <View style={styles.modalCostRow}>
                  <View style={styles.modalCostItem}>
                    <Text style={styles.modalCostLabel}>Kerakli Clan XP:</Text>
                    <Text style={styles.modalCostValueGold}>
                      {selectedBuilding.upgradeCostXp.toLocaleString()} XP
                    </Text>
                  </View>
                  <View style={styles.modalCostItem}>
                    <Text style={styles.modalCostLabel}>Kerakli Tangalar:</Text>
                    <Text style={styles.modalCostValueYellow}>
                      {selectedBuilding.upgradeCostCoin.toLocaleString()} Coin
                    </Text>
                  </View>
                </View>

                {/* Upgrade Button */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.modalUpgradeBtn}
                  onPress={() => handleUpgradeBuilding(selectedBuilding)}
                >
                  <LinearGradient
                    colors={['#9333EA', '#7C3AED']}
                    style={styles.modalUpgradeGradient}
                  >
                    <FontAwesome5
                      name="arrow-up"
                      size={14}
                      color="#FFFFFF"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.modalUpgradeBtnText}>
                      Lv.{selectedBuilding.level + 1} ga oshirish
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* INFO MODAL: CLAN BASE HAQIDA */}
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
                  name="castle"
                  size={22}
                  color="#C084FC"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.modalTitle}>Clan Base Qoidalari</Text>
              </View>
              <TouchableOpacity onPress={() => setInfoModalVisible(false)}>
                <Feather name="x" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 340 }}>
              <View style={styles.infoRuleItem}>
                <Text style={styles.infoRuleHead}>1. Baza qanday rivojlanadi?</Text>
                <Text style={styles.infoRuleBody}>
                  Clan a'zolari bajargan missiyalar, yutilgan janglar va turnirlardan olingan Clan XP bazani yangilashga yo'naltiriladi.
                </Text>
              </View>

              <View style={styles.infoRuleItem}>
                <Text style={styles.infoRuleHead}>2. Binolar va ularning ta'siri</Text>
                <Text style={styles.infoRuleBody}>
                  Har bir bino jamoaga doimiy passiv bonuslar beradi (ko'proq XP, tangalar, energiya va a'zo sig'imi).
                </Text>
              </View>

              <View style={styles.infoRuleItem}>
                <Text style={styles.infoRuleHead}>3. Jamoaviy rivojlanish</Text>
                <Text style={styles.infoRuleBody}>
                  Binolar darajasini oshirish barcha a'zolar uchun birdek amal qiladi va ligalarda clanni ustunlikka olib chiqadi.
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modalCloseBtn}
              onPress={() => setInfoModalVisible(false)}
            >
              <Text style={styles.modalCloseBtnText}>Tushunarli</Text>
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
    paddingTop: 6,
  },

  // 2. HERO ROW (Island on Left, Card on Right)
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  floatingHeroWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseLevelCard: {
    width: width * 0.32,
    backgroundColor: 'rgba(20, 15, 42, 0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  shieldLvWrap: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  shieldLvTextOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldLvText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FDE047',
    letterSpacing: 0.5,
  },
  baseCardTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  baseCardSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C084FC',
    marginTop: 2,
    textAlign: 'center',
  },

  // 3. PROGRESS CARD
  progressCard: {
    backgroundColor: 'rgba(20, 15, 38, 0.85)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.22)',
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressRatio: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  progressRatioGold: {
    color: '#FBBF24',
    fontWeight: '900',
  },
  progressRatioMuted: {
    color: '#94A3B8',
    fontWeight: '600',
  },
  progressBarTrack: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressPercentRow: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  progressPercentText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#C084FC',
  },

  // 4. SECTION TABS
  sectionTabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
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
    fontSize: 12.5,
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
    fontSize: 12.5,
    fontWeight: '700',
    color: '#94A3B8',
  },

  // 5. BUILDINGS LIST
  buildingsListCard: {
    backgroundColor: 'rgba(18, 14, 38, 0.8)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    overflow: 'hidden',
  },
  buildingItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  buildingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  buildingIconWrap: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  buildingMetaCol: {
    flex: 1,
    justifyContent: 'center',
  },
  buildingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buildingTitleText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  buildingLevelBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.5)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  buildingLevelText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C084FC',
  },
  buildingSubtitleText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 3,
  },

  // UPGRADE TAB
  upgradeTabCard: {
    backgroundColor: 'rgba(20, 15, 42, 0.85)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    padding: 16,
  },
  upgradeHeroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 14,
  },
  upgradeHeroTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  upgradeHeroSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 16,
  },
  upgradeReqBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  upgradeReqHead: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C084FC',
    marginBottom: 8,
  },
  upgradeReqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  upgradeReqText: {
    fontSize: 12.5,
    color: '#CBD5E1',
    marginLeft: 8,
  },
  upgradeActionBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  upgradeActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
  },
  upgradeActionText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // BONUS TAB
  bonusTabContainer: {
    gap: 10,
  },
  bonusCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 15, 38, 0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    padding: 14,
  },
  bonusIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  bonusItemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bonusItemSub: {
    fontSize: 11.5,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 16,
  },

  // MODALS COMMON
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
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalBuildingIconCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  modalPerksBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  modalPerkLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 3,
  },
  modalPerkVal: {
    fontSize: 12.5,
    color: '#CBD5E1',
    lineHeight: 17,
  },
  modalPerkDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 8,
  },
  modalCostRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalCostItem: {
    flex: 1,
    alignItems: 'center',
  },
  modalCostLabel: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
  modalCostValueGold: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#C084FC',
    marginTop: 2,
  },
  modalCostValueYellow: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FBBF24',
    marginTop: 2,
  },
  modalUpgradeBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  modalUpgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  modalUpgradeBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalCloseBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  modalCloseBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  infoRuleItem: {
    marginBottom: 12,
  },
  infoRuleHead: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FBBF24',
    marginBottom: 4,
  },
  infoRuleBody: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 17,
  },
});

