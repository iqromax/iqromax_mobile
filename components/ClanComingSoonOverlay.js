import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { getClanTranslations } from '../src/utils/clanTranslations';

const { width } = Dimensions.get('window');

export default function ClanComingSoonOverlay({
  activeTab = 'Home',
  language = 'uz',
  onBack,
}) {
  const t = getClanTranslations(language);

  const getSectionTitle = () => {
    switch (activeTab) {
      case 'Missions':
        return t.tabMissions || 'Vazifalar';
      case 'Season':
        return t.tabSeason || 'Mavsum';
      case 'Clan':
        return t.tabClan || 'Klan';
      case 'Home':
      default:
        return t.tabHome || 'Asosiy';
    }
  };

  const getSectionIcon = () => {
    switch (activeTab) {
      case 'Missions':
        return 'target';
      case 'Season':
        return 'trophy-outline';
      case 'Clan':
        return 'shield-crown-outline';
      case 'Home':
      default:
        return 'rocket-launch-outline';
    }
  };

  return (
    <View style={styles.overlayRoot} pointerEvents="auto">
      {/* 1. Translucent Frosted Glass Dark Backdrop */}
      <View style={styles.frostedBackdrop} />

      {/* 2. Glossy Diagonal Light Sheen */}
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.09)',
          'rgba(168, 85, 247, 0.05)',
          'transparent',
          'rgba(56, 189, 248, 0.06)',
          'rgba(255, 255, 255, 0.03)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* 3. Ambient Diffused Neon Glow Orbs */}
      <View style={styles.ambientTopGlow} />
      <View style={styles.ambientBottomGlow} />

      {/* 4. Top Back Navigation Button (Allows user to return to IQROMAX cleanly) */}
      {onBack && (
        <View style={styles.topNavRow}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onBack}
            style={styles.topBackBtn}
          >
            <View style={styles.topBackArrow}>
              <Feather name="chevron-left" size={16} color="#C084FC" />
            </View>
            <Text style={styles.topBackText}>{t.returnToIqromax || "IQROMAX ga qaytish"}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 5. Center Glossy Glassmorphic Card */}
      <View style={styles.glassCardWrap}>
        <View style={styles.glassCard}>
          {/* Frosted Liquid Glass Multi-stop Background */}
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.12)',
              'rgba(30, 22, 68, 0.78)',
              'rgba(12, 10, 32, 0.92)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Top Specular Edge Highlight (Polished Glass Rim Light) */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.55)', 'rgba(192, 132, 252, 0.3)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.glassTopRimHighlight}
          />

          {/* Holographic Glowing Glass Orb */}
          <View style={styles.emblemContainer}>
            <Svg width={76} height={76} viewBox="0 0 76 76">
              <Defs>
                <SvgGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0%" stopColor="#C084FC" />
                  <Stop offset="50%" stopColor="#A855F7" />
                  <Stop offset="100%" stopColor="#38BDF8" />
                </SvgGradient>
              </Defs>
              <Circle
                cx="38"
                cy="38"
                r="34"
                fill="none"
                stroke="#A855F7"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                opacity={0.5}
              />
              <Circle
                cx="38"
                cy="38"
                r="28"
                fill="rgba(147, 51, 234, 0.18)"
                stroke="url(#ringGrad)"
                strokeWidth="1.8"
              />
            </Svg>

            <View style={styles.emblemCenterIcon}>
              <MaterialCommunityIcons
                name={getSectionIcon()}
                size={30}
                color="#FBBF24"
              />
            </View>
          </View>

          {/* Status Badge Pill */}
          <View style={styles.statusBadge}>
            <View style={styles.livePulseDot} />
            <Text style={styles.statusBadgeText}>
              {t.comingSoonStatus || 'TEZ ORADA ISHGA TUSHADI'}
            </Text>
          </View>

          {/* Active Tab Indicator Chip */}
          <View style={styles.tabIndicatorChip}>
            <Text style={styles.tabIndicatorText}>
              {getSectionTitle()}
            </Text>
          </View>

          {/* Card Title */}
          <Text style={styles.mainTitle}>
            {t.comingSoonTitle || 'Tez orada ishga tushadi!'}
          </Text>

          {/* Card Description */}
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
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayRoot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frostedBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 8, 22, 0.84)',
  },
  ambientTopGlow: {
    position: 'absolute',
    top: '15%',
    left: '10%',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(168, 85, 247, 0.18)',
  },
  ambientBottomGlow: {
    position: 'absolute',
    bottom: '15%',
    right: '10%',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(56, 189, 248, 0.14)',
  },
  topNavRow: {
    position: 'absolute',
    top: 12,
    left: 16,
    zIndex: 1000,
  },
  topBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(25, 18, 54, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.35)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  topBackArrow: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(168, 85, 247, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  topBackText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#E9D5FF',
  },
  glassCardWrap: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  glassCard: {
    width: Math.min(width - 40, 350),
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.38,
    shadowRadius: 24,
    elevation: 14,
  },
  glassTopRimHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  emblemContainer: {
    width: 76,
    height: 76,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emblemCenterIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(168, 85, 247, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.38)',
    paddingHorizontal: 12,
    paddingVertical: 4.5,
    borderRadius: 20,
    marginBottom: 10,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
    marginRight: 7,
  },
  statusBadgeText: {
    fontSize: 10.5,
    fontFamily: 'Inter_700Bold',
    color: '#E9D5FF',
    letterSpacing: 0.8,
  },
  tabIndicatorChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabIndicatorText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#C084FC',
  },
  mainTitle: {
    fontSize: 19,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 6,
  },
  perksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginHorizontal: 3.5,
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
});
