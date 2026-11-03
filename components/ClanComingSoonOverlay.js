import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import Svg, { Circle, Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { getClanTranslations } from '../src/utils/clanTranslations';

const { width } = Dimensions.get('window');

export default function ClanComingSoonOverlay({ activeTab = 'Home', language = 'uz' }) {
  const t = getClanTranslations(language);

  const getSectionTitle = () => {
    switch (activeTab) {
      case 'Missions':
        return t.sectionMissions || 'Klan Vazifalari';
      case 'Season':
        return t.sectionSeason || 'Mavsum Musobaqasi';
      case 'Clan':
        return t.sectionClan || 'Klan Profili va Baza';
      case 'Home':
      default:
        return t.sectionHome || 'Klan Asosiy Zali';
    }
  };

  const getSectionIcon = () => {
    switch (activeTab) {
      case 'Missions':
        return 'target';
      case 'Season':
        return 'trophy-award';
      case 'Clan':
        return 'shield-crown';
      case 'Home':
      default:
        return 'rocket-launch';
    }
  };

  return (
    <View style={styles.overlayRoot} pointerEvents="auto">
      {/* Translucent Dim Gradient Layer */}
      <LinearGradient
        colors={[
          'rgba(9, 7, 24, 0.74)',
          'rgba(7, 8, 20, 0.86)',
          'rgba(12, 9, 32, 0.92)',
        ]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Ambient Neon Backlights */}
      <View style={styles.ambientTopGlow} />
      <View style={styles.ambientBottomGlow} />

      {/* Central Glassmorphic Hologram Card */}
      <View style={styles.glassCard}>
        {/* Card Gradient Background */}
        <LinearGradient
          colors={['rgba(28, 22, 64, 0.88)', 'rgba(16, 12, 38, 0.94)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Ambient Card Rim Light */}
        <LinearGradient
          colors={['rgba(168, 85, 247, 0.25)', 'transparent']}
          style={styles.cardRimLight}
        />

        {/* Holographic Glowing Emblem */}
        <View style={styles.emblemContainer}>
          <Svg width={80} height={80} viewBox="0 0 80 80">
            <Defs>
              <SvgGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#C084FC" />
                <Stop offset="50%" stopColor="#A855F7" />
                <Stop offset="100%" stopColor="#6366F1" />
              </SvgGradient>
              <SvgGradient id="glowCore" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#F59E0B" />
                <Stop offset="100%" stopColor="#EF4444" />
              </SvgGradient>
            </Defs>
            {/* Outer dotted energy ring */}
            <Circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="#A855F7"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity={0.6}
            />
            {/* Inner solid border ring */}
            <Circle
              cx="40"
              cy="40"
              r="30"
              fill="rgba(147, 51, 234, 0.15)"
              stroke="url(#ringGrad)"
              strokeWidth="2"
            />
          </Svg>

          <View style={styles.emblemCenterIcon}>
            <MaterialCommunityIcons
              name={getSectionIcon()}
              size={34}
              color="#FBBF24"
            />
          </View>
        </View>

        {/* Status Badge */}
        <View style={styles.statusBadge}>
          <View style={styles.pulseDot} />
          <Text style={styles.statusBadgeText}>
            {t.comingSoonStatus || 'TEZ ORADA ISHGA TUSHADI'}
          </Text>
        </View>

        {/* Active Section Chip */}
        <View style={styles.sectionPill}>
          <Text style={styles.sectionPillText}>
            {getSectionTitle()}
          </Text>
        </View>

        {/* Main Title */}
        <Text style={styles.mainTitle}>
          {t.comingSoonTitle || 'Tez orada ishga tushadi!'}
        </Text>

        {/* Description */}
        <Text style={styles.description}>
          {t.comingSoonDesc ||
            "Ushbu bo'lim hozirda qizg'in tayyorlanmoqda va tez kunda to'liq foydalanishga topshiriladi. Klaningiz bilan yangi cho'qqilarni zabt etishga tayyor turing!"}
        </Text>

        {/* Feature Highlights Row */}
        <View style={styles.perksRow}>
          <View style={styles.perkChip}>
            <Text style={styles.perkEmoji}>🛡️</Text>
            <Text style={styles.perkText}>{t.perkTeams || 'Jamoalar'}</Text>
          </View>
          <View style={styles.perkChip}>
            <Text style={styles.perkEmoji}>⚔️</Text>
            <Text style={styles.perkText}>{t.perkBattles || 'Bahslar'}</Text>
          </View>
          <View style={styles.perkChip}>
            <Text style={styles.perkEmoji}>🎁</Text>
            <Text style={styles.perkText}>{t.perkRewards || 'Sovrinlar'}</Text>
          </View>
        </View>

        {/* Bottom Nav Hint */}
        <View style={styles.hintWrap}>
          <Feather name="navigation" size={12} color="#A855F7" style={{ marginRight: 6 }} />
          <Text style={styles.hintText}>
            {t.comingSoonHint || "Pastdagi menyu orqali boshqa bo'limlarni ko'rishingiz mumkin"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayRoot: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  ambientTopGlow: {
    position: 'absolute',
    top: '20%',
    left: '15%',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(168, 85, 247, 0.16)',
    filter: 'blur(50px)',
  },
  ambientBottomGlow: {
    position: 'absolute',
    bottom: '22%',
    right: '12%',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    filter: 'blur(50px)',
  },
  glassCard: {
    width: Math.min(width - 40, 360),
    borderRadius: 24,
    paddingVertical: 26,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(168, 85, 247, 0.38)',
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 22,
    elevation: 12,
  },
  cardRimLight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  emblemContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emblemCenterIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(168, 85, 247, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.32)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
    marginRight: 7,
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#E9D5FF',
    letterSpacing: 0.8,
  },
  sectionPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 10,
  },
  sectionPillText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#C084FC',
  },
  mainTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 12.5,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
    paddingHorizontal: 6,
  },
  perksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  perkChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  perkEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  perkText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#E2E8F0',
  },
  hintWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.15)',
  },
  hintText: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    textAlign: 'center',
  },
});
