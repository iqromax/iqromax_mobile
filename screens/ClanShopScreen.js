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
const ITEM_WIDTH = (width - 44) / 3;

// 6 SHOP ITEMS (matching mockup)
const SHOP_ITEMS = [
  {
    id: '1',
    name: 'Wolf Emblem',
    category: 'emblem',
    type: 'Emblem',
    price: 5000,
    desc: "Clan uchun afsonaviy oq bo'ri gerbi. Bazada va musobaqalarda clanni ifodalaydi.",
  },
  {
    id: '2',
    name: 'Royal Banner',
    category: 'banner',
    type: 'Banner',
    price: 4000,
    desc: "Qasr peshtoqiga ilinuvchi Qirollik bayrog'i. Liderlar uchun maxsus bezak.",
  },
  {
    id: '3',
    name: 'Golden Frame',
    category: 'ramka',
    type: 'Avatar ramka',
    price: 3500,
    desc: "A'zolar uchun oltin dafna chambarli profil ramkasi.",
  },
  {
    id: '4',
    name: 'Castle Decor',
    category: 'dekor',
    type: 'Baza dekori',
    price: 10000,
    desc: "Baza uchun maxsus binafsharang afsonaviy qasr bezagi va maydoncha.",
  },
  {
    id: '5',
    name: 'Season 5 Badge',
    category: 'emblem',
    type: 'Nishon',
    price: 8000,
    desc: "Mavsum 5 chempionlik nishoni va a'zolarga beriluvchi faxriy unvon.",
  },
  {
    id: '6',
    name: 'Glory Banner',
    category: 'banner',
    type: 'Banner',
    price: 6000,
    desc: "Jang maydonlaridagi Shon-sharaf jangovar bayrog'i.",
  },
];

export default function ClanShopScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('all'); // all | emblem | banner | dekor | ramka
  const [clanCoins, setClanCoins] = useState(12450);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const triggerHaptic = (type = 'light') => {
    try {
      if (type === 'medium') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (e) {}
  };

  const handleBuyItem = (item) => {
    if (purchasedItems.includes(item.id)) {
      Alert.alert("Sotib olingan", "Ushbu buyum allaqachon sotib olingan va sizning inventaringizda!");
      return;
    }
    if (clanCoins < item.price) {
      Alert.alert(
        "Mablag' yetarli emas",
        `Ushbu buyumni sotib olish uchun sizga yana ${(item.price - clanCoins).toLocaleString()} Clan Coin kerak.`
      );
      return;
    }

    triggerHaptic('medium');
    setClanCoins((prev) => prev - item.price);
    setPurchasedItems((prev) => [...prev, item.id]);
    setSelectedItem(null);

    Alert.alert(
      "Muvaffaqiyatli xarid!",
      `${item.name} muvaffaqiyatli sotib olindi va Clan kolleksiyasiga qo'shildi! 🎉`
    );
  };

  // Filter items by active category
  const filteredItems = SHOP_ITEMS.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  // 1. HERO STOREFRONT SVG GRAPHIC
  const renderStorefrontHero = () => {
    return (
      <View style={styles.storefrontGraphicWrap}>
        <Svg width={140} height={95} viewBox="0 0 150 100">
          <Defs>
            <SvgGradient id="awningPurp" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#9333EA" />
              <Stop offset="100%" stopColor="#581C87" />
            </SvgGradient>
            <SvgGradient id="awningLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#E9D5FF" />
              <Stop offset="100%" stopColor="#C084FC" />
            </SvgGradient>
            <SvgGradient id="chestGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FDE047" />
              <Stop offset="50%" stopColor="#F59E0B" />
              <Stop offset="100%" stopColor="#B45309" />
            </SvgGradient>
          </Defs>

          {/* Shop Booth Interior Wall */}
          <Rect x="25" y="32" width="100" height="48" fill="#2E1065" rx="4" />

          {/* Glowing Open Chest with Gold Inside */}
          <G transform="translate(52, 40)">
            <Rect x="6" y="16" width="34" height="20" rx="3" fill="#4C1D95" stroke="url(#chestGold)" strokeWidth="1.5" />
            {/* Chest Lid open */}
            <Path d="M 4 16 Q 23 2 42 16" fill="#7E22CE" stroke="url(#chestGold)" strokeWidth="1.5" />
            {/* Glowing gold coins inside */}
            <Circle cx="18" cy="15" r="4.5" fill="#FDE047" />
            <Circle cx="24" cy="12" r="5" fill="#FEF08A" />
            <Circle cx="29" cy="15" r="4.5" fill="#FDE047" />
          </G>

          {/* Gold Coin Stacks in front of shop */}
          <G transform="translate(14, 52)">
            <Circle cx="10" cy="18" r="6" fill="url(#chestGold)" />
            <Circle cx="18" cy="20" r="7" fill="url(#chestGold)" />
            <Circle cx="26" cy="22" r="6" fill="url(#chestGold)" />
            <Circle cx="14" cy="12" r="5.5" fill="#FEF08A" />
            <Circle cx="22" cy="14" r="5" fill="#FEF08A" />
          </G>

          {/* Gold Coin Stacks on Right */}
          <G transform="translate(100, 52)">
            <Circle cx="10" cy="22" r="6.5" fill="url(#chestGold)" />
            <Circle cx="19" cy="20" r="7" fill="url(#chestGold)" />
            <Circle cx="28" cy="18" r="6" fill="url(#chestGold)" />
            <Circle cx="15" cy="14" r="5.5" fill="#FEF08A" />
            <Circle cx="23" cy="12" r="5" fill="#FEF08A" />
          </G>

          {/* Purple Gem on Right */}
          <Polygon points="126,38 132,44 126,52 120,44" fill="#C084FC" stroke="#E9D5FF" strokeWidth="0.8" />

          {/* Yellow Gem on Left */}
          <Polygon points="18,36 24,42 18,50 12,42" fill="#FDE047" stroke="#FEF08A" strokeWidth="0.8" />

          {/* Striped Canopy Roof (Purple & White Stripes) */}
          <Path
            d="M 12 18 L 138 18 L 132 36 L 18 36 Z"
            fill="url(#awningPurp)"
          />
          {/* Stripes */}
          <Polygon points="26,18 40,18 36,36 24,36" fill="url(#awningLight)" />
          <Polygon points="54,18 68,18 64,36 52,36" fill="url(#awningLight)" />
          <Polygon points="82,18 96,18 92,36 80,36" fill="url(#awningLight)" />
          <Polygon points="110,18 124,18 120,36 108,36" fill="url(#awningLight)" />

          {/* Scalloped Awning Edge */}
          <Path
            d="M 18 36 Q 24 41 30 36 Q 36 41 42 36 Q 48 41 54 36 Q 60 41 66 36 Q 72 41 78 36 Q 84 41 90 36 Q 96 41 102 36 Q 108 41 114 36 Q 120 41 126 36 Q 132 41 138 36"
            fill="none"
            stroke="#FEF08A"
            strokeWidth="1.5"
          />
        </Svg>
      </View>
    );
  };

  // 2. ITEM ICONS FOR 6 PRODUCTS
  const renderProductGraphic = (itemId) => {
    // 1. Wolf Emblem
    if (itemId === '1') {
      return (
        <Svg width={64} height={64} viewBox="0 0 60 60">
          <Defs>
            <SvgGradient id="wGoldG" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FDE047" />
              <Stop offset="50%" stopColor="#F59E0B" />
              <Stop offset="100%" stopColor="#B45309" />
            </SvgGradient>
          </Defs>
          <Path
            d="M 30 5 L 50 14 C 50 36 30 51 30 51 C 30 51 10 36 10 14 Z"
            fill="#3B0764"
            stroke="url(#wGoldG)"
            strokeWidth="2.5"
          />
          {/* White Wolf Profile */}
          <G transform="translate(19, 14) scale(0.65)">
            <Path
              d="M 18 10 L 14 18 L 8 22 L 2 24 L 6 28 L 12 28 L 16 34 L 20 40 L 26 44 L 28 36 L 34 32 L 32 24 L 28 18 L 26 10 Z"
              fill="#FFFFFF"
            />
            <Path d="M 20 20 L 24 24 L 20 28 L 26 30 L 22 36 L 28 34" stroke="#CBD5E1" strokeWidth="1.5" fill="none" />
            <Polygon points="22,6 26,14 18,12" fill="#E2E8F0" />
            <Polygon points="21,8 24,13 19,12" fill="#C084FC" opacity={0.6} />
            <Polygon points="14,20 18,22 14,23" fill="#6B21A8" />
          </G>
        </Svg>
      );
    }

    // 2. Royal Banner
    if (itemId === '2') {
      return (
        <Svg width={64} height={64} viewBox="0 0 60 60">
          <Defs>
            <SvgGradient id="rbGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FDE047" />
              <Stop offset="100%" stopColor="#D97706" />
            </SvgGradient>
          </Defs>
          {/* Hanging Pole */}
          <Rect x="8" y="10" width="44" height="3" rx="1.5" fill="url(#rbGold)" />
          <Circle cx="8" cy="11.5" r="2.5" fill="#FEF08A" />
          <Circle cx="52" cy="11.5" r="2.5" fill="#FEF08A" />
          {/* Hanging Strings */}
          <Path d="M 16 10 L 30 3 L 44 10" stroke="url(#rbGold)" strokeWidth="1.2" fill="none" />
          {/* Banner Fabric */}
          <Path
            d="M 12 13 L 48 13 L 48 44 L 30 54 L 12 44 Z"
            fill="#581C87"
            stroke="url(#rbGold)"
            strokeWidth="1.8"
          />
          {/* Golden Crown on Banner */}
          <Path
            d="M 21 34 L 39 34 C 39 34 40 28 39 23 L 34 26 L 30 19 L 26 26 L 21 23 Z"
            fill="#FBBF24"
          />
        </Svg>
      );
    }

    // 3. Golden Frame
    if (itemId === '3') {
      return (
        <Svg width={64} height={64} viewBox="0 0 60 60">
          <Defs>
            <SvgGradient id="gfGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FDE047" />
              <Stop offset="50%" stopColor="#F59E0B" />
              <Stop offset="100%" stopColor="#B45309" />
            </SvgGradient>
          </Defs>
          {/* Laurel Wreath at bottom */}
          <G fill="url(#gfGold)">
            <Path d="M 12 40 C 6 32 10 20 20 22 C 16 30 15 35 12 40 Z" />
            <Path d="M 48 40 C 54 32 50 20 40 22 C 44 30 45 35 48 40 Z" />
            <Path d="M 16 46 Q 30 56 44 46" stroke="url(#gfGold)" strokeWidth="2" fill="none" />
          </G>
          {/* Hexagonal Frame */}
          <Polygon
            points="30,8 48,18 48,38 30,48 12,38 12,18"
            fill="none"
            stroke="url(#gfGold)"
            strokeWidth="2.8"
          />
          <Polygon
            points="30,12 44,20 44,36 30,44 16,36 16,20"
            fill="none"
            stroke="rgba(253, 224, 71, 0.4)"
            strokeWidth="1"
          />
        </Svg>
      );
    }

    // 4. Castle Decor
    if (itemId === '4') {
      return (
        <Svg width={64} height={64} viewBox="0 0 60 60">
          <Defs>
            <SvgGradient id="cdPurp" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#9333EA" />
              <Stop offset="100%" stopColor="#4C1D95" />
            </SvgGradient>
          </Defs>
          {/* Base */}
          <Polygon points="8,44 30,53 52,44 30,35" fill="#15803D" />
          {/* Castle Keep */}
          <Polygon points="14,41 30,48 46,41 46,26 30,31 14,26" fill="url(#cdPurp)" />
          {/* Central Spire */}
          <Polygon points="23,28 30,31 37,28 37,16 30,19 23,16" fill="#7E22CE" />
          <Polygon points="20,16 30,6 40,16 30,19" fill="#9333EA" stroke="#FEF08A" strokeWidth="0.8" />
          {/* Flag */}
          <Rect x="29" y="1" width="2" height="6" fill="#FEF08A" />
          <Polygon points="31,2 38,4 31,6" fill="#F43F5E" />
          {/* Glowing Windows */}
          <Rect x="27" y="38" width="6" height="8" rx="2" fill="#FDE047" />
        </Svg>
      );
    }

    // 5. Season 5 Badge
    if (itemId === '5') {
      return (
        <Svg width={64} height={64} viewBox="0 0 60 60">
          <Defs>
            <SvgGradient id="s5Gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FDE047" />
              <Stop offset="50%" stopColor="#F59E0B" />
              <Stop offset="100%" stopColor="#B45309" />
            </SvgGradient>
          </Defs>
          {/* Laurel Wreath */}
          <Path d="M 12 38 C 6 28 10 16 20 18 C 16 26 15 32 12 38 Z" fill="url(#s5Gold)" />
          <Path d="M 48 38 C 54 28 50 16 40 18 C 44 26 45 32 48 38 Z" fill="url(#s5Gold)" />
          {/* Hexagon Shield */}
          <Polygon
            points="30,10 44,18 44,34 30,44 16,34 16,18"
            fill="#4C1D95"
            stroke="url(#s5Gold)"
            strokeWidth="2.2"
          />
          {/* S5 Text */}
          <G transform="translate(18, 18)">
            <Text style={{ fontSize: 13, fontWeight: '900', color: '#FEF08A', textAlign: 'center' }}>
              S5
            </Text>
          </G>
        </Svg>
      );
    }

    // 6. Glory Banner
    return (
      <Svg width={64} height={64} viewBox="0 0 60 60">
        <Defs>
          <SvgGradient id="gbGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FDE047" />
            <Stop offset="100%" stopColor="#B45309" />
          </SvgGradient>
        </Defs>
        {/* Horizontal Banner Staff */}
        <Rect x="4" y="10" width="52" height="4" rx="2" fill="url(#gbGold)" />
        <Circle cx="6" cy="12" r="3" fill="#FEF08A" />
        <Circle cx="54" cy="12" r="3" fill="#FEF08A" />
        {/* Hanging Pole on sides */}
        <Rect x="10" y="12" width="2" height="38" fill="url(#gbGold)" />
        <Rect x="48" y="12" width="2" height="38" fill="url(#gbGold)" />
        {/* Waving War Banner Fabric */}
        <Path
          d="M 11 14 Q 30 20 49 14 L 49 44 Q 30 50 11 44 Z"
          fill="#6B21A8"
          stroke="url(#gbGold)"
          strokeWidth="1.5"
        />
        {/* Star emblem inside */}
        <Polygon
          points="30,22 32,27 37,27 33,30 35,35 30,32 25,35 27,30 23,27 28,27"
          fill="#FEF08A"
        />
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
            <Text style={styles.headerTitleText}>Clan Shop</Text>
            <Text style={styles.headerSubtitleText}>Clan do'koni — maxsus buyumlar</Text>
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
          {/* 2. TOP HERO CARD (Shopfront Graphic + Clan Coins Balance) */}
          <View style={styles.heroCard}>
            <LinearGradient
              colors={['#25164B', '#160E33', '#110A26']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              {/* Left Shopfront 3D Graphic */}
              {renderStorefrontHero()}

              {/* Right User Coin Balance */}
              <View style={styles.coinsBalanceCol}>
                <Text style={styles.coinsLabelText}>Sizning</Text>
                <Text style={styles.coinsLabelSub}>Clan Coin'ngiz</Text>

                <View style={styles.coinsRow}>
                  {/* Clan Coin Graphic */}
                  <View style={styles.coinBadgeMini}>
                    <FontAwesome5 name="coins" size={13} color="#713F12" />
                  </View>
                  <Text style={styles.coinsAmountText}>
                    {clanCoins.toLocaleString()}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* 3. CATEGORY TABS (Barchasi | Emblem | Banner | Dekor | Ramka) */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScrollRow}
          >
            {/* Tab: Barchasi */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                triggerHaptic();
                setActiveCategory('all');
              }}
              style={styles.categoryTouchable}
            >
              {activeCategory === 'all' ? (
                <LinearGradient
                  colors={['#9333EA', '#7E22CE']}
                  style={styles.catActivePill}
                >
                  <FontAwesome5 name="star" size={12} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.catActiveText}>Barchasi</Text>
                </LinearGradient>
              ) : (
                <View style={styles.catInactivePill}>
                  <FontAwesome5 name="star" size={12} color="#94A3B8" style={{ marginRight: 6 }} />
                  <Text style={styles.catInactiveText}>Barchasi</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Tab: Emblem */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                triggerHaptic();
                setActiveCategory('emblem');
              }}
              style={styles.categoryTouchable}
            >
              {activeCategory === 'emblem' ? (
                <LinearGradient
                  colors={['#9333EA', '#7E22CE']}
                  style={styles.catActivePill}
                >
                  <MaterialCommunityIcons name="shield-outline" size={14} color="#FFFFFF" style={{ marginRight: 5 }} />
                  <Text style={styles.catActiveText}>Emblem</Text>
                </LinearGradient>
              ) : (
                <View style={styles.catInactivePill}>
                  <MaterialCommunityIcons name="shield-outline" size={14} color="#94A3B8" style={{ marginRight: 5 }} />
                  <Text style={styles.catInactiveText}>Emblem</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Tab: Banner */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                triggerHaptic();
                setActiveCategory('banner');
              }}
              style={styles.categoryTouchable}
            >
              {activeCategory === 'banner' ? (
                <LinearGradient
                  colors={['#9333EA', '#7E22CE']}
                  style={styles.catActivePill}
                >
                  <MaterialCommunityIcons name="flag-variant-outline" size={14} color="#FFFFFF" style={{ marginRight: 5 }} />
                  <Text style={styles.catActiveText}>Banner</Text>
                </LinearGradient>
              ) : (
                <View style={styles.catInactivePill}>
                  <MaterialCommunityIcons name="flag-variant-outline" size={14} color="#94A3B8" style={{ marginRight: 5 }} />
                  <Text style={styles.catInactiveText}>Banner</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Tab: Dekor */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                triggerHaptic();
                setActiveCategory('dekor');
              }}
              style={styles.categoryTouchable}
            >
              {activeCategory === 'dekor' ? (
                <LinearGradient
                  colors={['#9333EA', '#7E22CE']}
                  style={styles.catActivePill}
                >
                  <MaterialCommunityIcons name="castle" size={14} color="#FFFFFF" style={{ marginRight: 5 }} />
                  <Text style={styles.catActiveText}>Dekor</Text>
                </LinearGradient>
              ) : (
                <View style={styles.catInactivePill}>
                  <MaterialCommunityIcons name="castle" size={14} color="#94A3B8" style={{ marginRight: 5 }} />
                  <Text style={styles.catInactiveText}>Dekor</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Tab: Ramka */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                triggerHaptic();
                setActiveCategory('ramka');
              }}
              style={styles.categoryTouchable}
            >
              {activeCategory === 'ramka' ? (
                <LinearGradient
                  colors={['#9333EA', '#7E22CE']}
                  style={styles.catActivePill}
                >
                  <MaterialCommunityIcons name="hexagon-slice-6" size={14} color="#FFFFFF" style={{ marginRight: 5 }} />
                  <Text style={styles.catActiveText}>Ramka</Text>
                </LinearGradient>
              ) : (
                <View style={styles.catInactivePill}>
                  <MaterialCommunityIcons name="hexagon-slice-6" size={14} color="#94A3B8" style={{ marginRight: 5 }} />
                  <Text style={styles.catInactiveText}>Ramka</Text>
                </View>
              )}
            </TouchableOpacity>
          </ScrollView>

          {/* 4. PRODUCTS 3-COLUMN GRID */}
          <View style={styles.productsGrid}>
            {filteredItems.map((item) => {
              const isPurchased = purchasedItems.includes(item.id);

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  onPress={() => {
                    triggerHaptic();
                    setSelectedItem(item);
                  }}
                  style={styles.productCard}
                >
                  {/* Product Graphic */}
                  <View style={styles.productGraphicWrap}>
                    {renderProductGraphic(item.id)}
                  </View>

                  {/* Product Title & Subtitle */}
                  <Text style={styles.productTitle} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.productCategory} numberOfLines={1}>
                    {item.type}
                  </Text>

                  {/* Price Button */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      triggerHaptic();
                      setSelectedItem(item);
                    }}
                    style={[
                      styles.priceButtonPill,
                      isPurchased && styles.priceButtonPurchased,
                    ]}
                  >
                    {!isPurchased && (
                      <View style={styles.coinDotMini}>
                        <FontAwesome5 name="coins" size={8} color="#713F12" />
                      </View>
                    )}
                    <Text
                      style={[
                        styles.priceText,
                        isPurchased && styles.priceTextPurchased,
                      ]}
                    >
                      {isPurchased ? 'Olingan' : item.price.toLocaleString()}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* PRODUCT DETAIL & BUY MODAL */}
      <Modal
        visible={!!selectedItem}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {selectedItem && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                  <TouchableOpacity onPress={() => setSelectedItem(null)}>
                    <Feather name="x" size={20} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                {/* Big Visual Center */}
                <View style={styles.modalVisualWrap}>
                  {renderProductGraphic(selectedItem.id)}
                </View>

                <View style={styles.modalMetaBox}>
                  <Text style={styles.modalTypeBadge}>{selectedItem.type}</Text>
                  <Text style={styles.modalDescText}>{selectedItem.desc}</Text>
                </View>

                {/* Price and Balance Check */}
                <View style={styles.modalPriceRow}>
                  <View>
                    <Text style={styles.modalPriceLabel}>Narxi:</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                      <FontAwesome5 name="coins" size={14} color="#FBBF24" style={{ marginRight: 6 }} />
                      <Text style={styles.modalPriceAmount}>
                        {selectedItem.price.toLocaleString()} Coin
                      </Text>
                    </View>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.modalPriceLabel}>Hisobingizda:</Text>
                    <Text
                      style={[
                        styles.modalBalanceAmount,
                        {
                          color:
                            clanCoins >= selectedItem.price
                              ? '#34D399'
                              : '#F87171',
                        },
                      ]}
                    >
                      {clanCoins.toLocaleString()} Coin
                    </Text>
                  </View>
                </View>

                {/* Action Button */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.modalBuyBtn,
                    purchasedItems.includes(selectedItem.id) && {
                      backgroundColor: 'rgba(52, 211, 153, 0.25)',
                    },
                  ]}
                  onPress={() => handleBuyItem(selectedItem)}
                >
                  <LinearGradient
                    colors={
                      purchasedItems.includes(selectedItem.id)
                        ? ['#10B981', '#059669']
                        : ['#9333EA', '#7C3AED']
                    }
                    style={styles.modalBuyGradient}
                  >
                    <Text style={styles.modalBuyBtnText}>
                      {purchasedItems.includes(selectedItem.id)
                        ? 'Sotib olingan (Faol)'
                        : 'Sotib olish'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
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
    paddingHorizontal: 14,
    paddingTop: 4,
  },

  // 2. HERO CARD
  heroCard: {
    borderRadius: 22,
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
  heroGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  storefrontGraphicWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinsBalanceCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 6,
  },
  coinsLabelText: {
    fontSize: 11.5,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  coinsLabelSub: {
    fontSize: 11.5,
    color: '#CBD5E1',
    fontWeight: '600',
    marginBottom: 6,
  },
  coinsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  coinBadgeMini: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FBBF24',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  coinsAmountText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  // 3. CATEGORIES ROW
  categoriesScrollRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 12,
  },
  categoryTouchable: {
    marginRight: 8,
  },
  catActivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  catActiveText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  catInactivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  catInactiveText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#94A3B8',
  },

  // 4. PRODUCTS 3-COL GRID
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: ITEM_WIDTH,
    backgroundColor: 'rgba(20, 15, 42, 0.85)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.22)',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  productGraphicWrap: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  productTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 2,
  },
  productCategory: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 8,
  },
  priceButtonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(126, 34, 206, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.4)',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: '92%',
  },
  priceButtonPurchased: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10B981',
  },
  coinDotMini: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FBBF24',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  priceText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  priceTextPurchased: {
    color: '#34D399',
    fontSize: 11,
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
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalVisualWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  modalMetaBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  modalTypeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(168, 85, 247, 0.25)',
    borderWidth: 1,
    borderColor: '#C084FC',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 10.5,
    fontWeight: '700',
    color: '#E9D5FF',
    marginBottom: 6,
  },
  modalDescText: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 17,
  },
  modalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  modalPriceLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  modalPriceAmount: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FBBF24',
  },
  modalBalanceAmount: {
    fontSize: 15,
    fontWeight: '900',
    marginTop: 2,
  },
  modalBuyBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  modalBuyGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
  },
  modalBuyBtnText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

