import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
  Vibration,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export const ClanAnimatedButton = ({ onPress, style }) => {
  // 1. Continuous breathing pulse animation
  const pulseAnim = useRef(new Animated.Value(0)).current;
  // 2. Periodic gleaming light sweep (shimmer)
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  // 3. Gentle icon wobble / tilt animation
  const iconWobbleAnim = useRef(new Animated.Value(0)).current;
  // 4. Sparkle scale / pulse
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  // 5. Interactive touch feedback spring scale
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation: breathing scale and glow
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Shimmer sweep: glossy light beam sweeps every 2.8 seconds
    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 850,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.delay(1900),
      ])
    );

    // Icon subtle tilt/wobble: playful nod every 3.2 seconds
    const wobbleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(iconWobbleAnim, {
          toValue: 1,
          duration: 650,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(2600),
      ])
    );

    // Sparkle star pulse
    const sparkleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();
    shimmerLoop.start();
    wobbleLoop.start();
    sparkleLoop.start();

    return () => {
      pulseLoop.stop();
      shimmerLoop.stop();
      wobbleLoop.stop();
      sparkleLoop.stop();
    };
  }, [pulseAnim, shimmerAnim, iconWobbleAnim, sparkleAnim]);

  const handlePressIn = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      if (Platform.OS !== 'web') Vibration.vibrate(10);
    }
    Animated.spring(pressScale, {
      toValue: 0.92,
      useNativeDriver: true,
      friction: 5,
      tension: 100,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 60,
    }).start();
  };

  // Interpolated animation values
  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });

  const combinedScale = Animated.multiply(pressScale, pulseScale);

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-60, 140],
  });

  const iconRotate = iconWobbleAnim.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: ['0deg', '-10deg', '8deg', '-5deg', '3deg', '0deg'],
  });

  const sparkleScale = sparkleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.75, 1.25],
  });

  const sparkleOpacity = sparkleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.55, 1],
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          transform: [{ scale: combinedScale }],
        },
        style,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.touchable}
      >
        {/* Glowing Background Gradient */}
        <LinearGradient
          colors={['#4C1D95', '#2E0854', '#581C87', '#3B0764']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBg}
        >
          {/* Inner ambient glow layer */}
          <LinearGradient
            colors={['rgba(216, 180, 254, 0.22)', 'rgba(147, 51, 234, 0.05)', 'rgba(76, 29, 149, 0.3)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Shimmer light sweep beam */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.shimmerBeam,
              {
                transform: [
                  { translateX: shimmerTranslateX },
                  { rotate: '25deg' },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={[
                'transparent',
                'rgba(255, 255, 255, 0.15)',
                'rgba(255, 255, 255, 0.75)',
                'rgba(216, 180, 254, 0.6)',
                'transparent',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>

          {/* Animated Shield-Crown Icon Container */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ rotate: iconRotate }],
              },
            ]}
          >
            <MaterialCommunityIcons name="shield-crown" size={21} color="#F5D061" />
          </Animated.View>

          {/* Centered Single "CLAN" Label */}
          <View style={styles.textContainer}>
            <Text style={styles.clanText} numberOfLines={1}>
              CLAN
            </Text>
          </View>

          {/* Top-Right Sparkle Star */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.sparkleBadge,
              {
                transform: [{ scale: sparkleScale }],
                opacity: sparkleOpacity,
              },
            ]}
          >
            <Ionicons name="sparkles" size={10} color="#FACC15" />
          </Animated.View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 13,
    shadowColor: '#C084FC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.85,
    shadowRadius: 7,
    elevation: 8,
  },
  touchable: {
    borderRadius: 13,
    overflow: 'hidden',
  },
  gradientBg: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#C084FC',
    position: 'relative',
    overflow: 'hidden',
  },
  shimmerBeam: {
    position: 'absolute',
    top: -20,
    bottom: -20,
    width: 32,
    zIndex: 5,
  },
  iconContainer: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: 'rgba(245, 208, 97, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(245, 208, 97, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clanText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '900',
    fontFamily: 'Inter_900Black',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(192, 132, 252, 0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  sparkleBadge: {
    position: 'absolute',
    top: 2,
    right: 4,
    zIndex: 10,
  },
});
