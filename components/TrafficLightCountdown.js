import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function TrafficLightCountdown({ lightState = 0, style }) {
  // Scale animations for each bulb on activation
  const redScale = useRef(new Animated.Value(1)).current;
  const yellowScale = useRef(new Animated.Value(1)).current;
  const greenScale = useRef(new Animated.Value(1)).current;

  // Shockwave pulse animations for each bulb
  const redPulseScale = useRef(new Animated.Value(1)).current;
  const redPulseOpacity = useRef(new Animated.Value(0)).current;

  const yellowPulseScale = useRef(new Animated.Value(1)).current;
  const yellowPulseOpacity = useRef(new Animated.Value(0)).current;

  const greenPulseScale = useRef(new Animated.Value(1)).current;
  const greenPulseOpacity = useRef(new Animated.Value(0)).current;

  // Ambient breathing loop animation for active bulb
  const breatheAnim = useRef(new Animated.Value(1)).current;

  // Continuous subtle breathing loop
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.05,
          duration: 450,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 0.98,
          duration: 450,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [breatheAnim]);

  // Trigger pop & shockwave on light changes
  useEffect(() => {
    if (lightState === 1) {
      // Red pop
      redScale.setValue(0.75);
      Animated.spring(redScale, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }).start();

      // Red shockwave
      redPulseScale.setValue(1);
      redPulseOpacity.setValue(0.9);
      Animated.parallel([
        Animated.timing(redPulseScale, {
          toValue: 1.55,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(redPulseOpacity, {
          toValue: 0,
          duration: 650,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else if (lightState === 2) {
      // Yellow pop
      yellowScale.setValue(0.75);
      Animated.spring(yellowScale, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }).start();

      // Yellow shockwave
      yellowPulseScale.setValue(1);
      yellowPulseOpacity.setValue(0.9);
      Animated.parallel([
        Animated.timing(yellowPulseScale, {
          toValue: 1.55,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(yellowPulseOpacity, {
          toValue: 0,
          duration: 650,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else if (lightState === 3) {
      // Green pop
      greenScale.setValue(0.75);
      Animated.spring(greenScale, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }).start();

      // Green shockwave
      greenPulseScale.setValue(1);
      greenPulseOpacity.setValue(0.95);
      Animated.parallel([
        Animated.timing(greenPulseScale, {
          toValue: 1.6,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(greenPulseOpacity, {
          toValue: 0,
          duration: 650,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [lightState]);

  const isRedActive = lightState >= 1;
  const isYellowActive = lightState >= 2;
  const isGreenActive = lightState >= 3;

  // Determine dynamic housing aura color
  const chassisShadowColor = isGreenActive
    ? '#10B981'
    : isYellowActive
    ? '#F59E0B'
    : isRedActive
    ? '#EF4444'
    : '#000000';

  const statusText =
    lightState === 1
      ? 'DIQQAT!'
      : lightState === 2
      ? 'TAYYORLANING!'
      : lightState === 3
      ? 'BOSHLADIK!'
      : '...';

  const statusColor =
    lightState === 1
      ? '#EF4444'
      : lightState === 2
      ? '#F59E0B'
      : lightState === 3
      ? '#10B981'
      : '#6B7280';

  return (
    <View style={[styles.wrapper, style]}>
      {/* Outer Halo / Glow Backdrop */}
      <View
        style={[
          styles.glowBackdrop,
          {
            backgroundColor: chassisShadowColor,
            opacity: lightState > 0 ? 0.18 : 0,
          },
        ]}
      />

      {/* Main Traffic Light Chassis */}
      <View
        style={[
          styles.chassis,
          {
            shadowColor: chassisShadowColor,
            shadowOpacity: lightState > 0 ? 0.75 : 0.25,
            borderColor: lightState > 0 ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)',
          },
        ]}
      >
        {/* Corner Rivets */}
        <View style={[styles.rivet, { top: 10, left: 10 }]} />
        <View style={[styles.rivet, { top: 10, right: 10 }]} />
        <View style={[styles.rivet, { bottom: 10, left: 10 }]} />
        <View style={[styles.rivet, { bottom: 10, right: 10 }]} />

        {/* 1. RED LIGHT (Qizil) */}
        <View style={styles.socketContainer}>
          {/* Expanding Shockwave Ring */}
          <Animated.View
            style={[
              styles.shockwaveRing,
              {
                borderColor: '#FF3B3B',
                transform: [{ scale: redPulseScale }],
                opacity: redPulseOpacity,
              },
            ]}
          />
          {/* Socket Bevel */}
          <View style={styles.socketBevel}>
            <Animated.View
              style={[
                styles.bulbWrapper,
                isRedActive && {
                  shadowColor: '#FF2222',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.95,
                  shadowRadius: 26,
                  elevation: 14,
                },
                {
                  transform: [
                    { scale: isRedActive && lightState === 1 ? Animated.multiply(redScale, breatheAnim) : redScale },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={
                  isRedActive
                    ? ['#FF4D4D', '#E11D48', '#881337']
                    : ['#2E0C0C', '#170505']
                }
                start={{ x: 0.2, y: 0.1 }}
                end={{ x: 0.8, y: 0.9 }}
                style={styles.bulbGradient}
              >
                {/* Glowing Core */}
                {isRedActive && <View style={[styles.bulbCore, { backgroundColor: '#FFA3A3' }]} />}
                {/* 3D Glass Dome Glare */}
                <View style={styles.glassGlareTop} />
                <View style={styles.glassGlareBottom} />
              </LinearGradient>
            </Animated.View>
          </View>
        </View>

        {/* 2. YELLOW LIGHT (Sariq) */}
        <View style={styles.socketContainer}>
          {/* Expanding Shockwave Ring */}
          <Animated.View
            style={[
              styles.shockwaveRing,
              {
                borderColor: '#FFD700',
                transform: [{ scale: yellowPulseScale }],
                opacity: yellowPulseOpacity,
              },
            ]}
          />
          {/* Socket Bevel */}
          <View style={styles.socketBevel}>
            <Animated.View
              style={[
                styles.bulbWrapper,
                isYellowActive && {
                  shadowColor: '#FFD000',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.95,
                  shadowRadius: 26,
                  elevation: 14,
                },
                {
                  transform: [
                    { scale: isYellowActive && lightState === 2 ? Animated.multiply(yellowScale, breatheAnim) : yellowScale },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={
                  isYellowActive
                    ? ['#FFF14D', '#F59E0B', '#92400E']
                    : ['#2A1D04', '#140D01']
                }
                start={{ x: 0.2, y: 0.1 }}
                end={{ x: 0.8, y: 0.9 }}
                style={styles.bulbGradient}
              >
                {/* Glowing Core */}
                {isYellowActive && <View style={[styles.bulbCore, { backgroundColor: '#FFF7B8' }]} />}
                {/* 3D Glass Dome Glare */}
                <View style={styles.glassGlareTop} />
                <View style={styles.glassGlareBottom} />
              </LinearGradient>
            </Animated.View>
          </View>
        </View>

        {/* 3. GREEN LIGHT (Yashil) */}
        <View style={styles.socketContainer}>
          {/* Expanding Shockwave Ring */}
          <Animated.View
            style={[
              styles.shockwaveRing,
              {
                borderColor: '#10B981',
                transform: [{ scale: greenPulseScale }],
                opacity: greenPulseOpacity,
              },
            ]}
          />
          {/* Socket Bevel */}
          <View style={styles.socketBevel}>
            <Animated.View
              style={[
                styles.bulbWrapper,
                isGreenActive && {
                  shadowColor: '#10B981',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 1.0,
                  shadowRadius: 30,
                  elevation: 16,
                },
                {
                  transform: [
                    { scale: isGreenActive && lightState === 3 ? Animated.multiply(greenScale, breatheAnim) : greenScale },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={
                  isGreenActive
                    ? ['#4ADE80', '#059669', '#064E3B']
                    : ['#052514', '#021209']
                }
                start={{ x: 0.2, y: 0.1 }}
                end={{ x: 0.8, y: 0.9 }}
                style={styles.bulbGradient}
              >
                {/* Glowing Core */}
                {isGreenActive && <View style={[styles.bulbCore, { backgroundColor: '#B9F6CA' }]} />}
                {/* 3D Glass Dome Glare */}
                <View style={styles.glassGlareTop} />
                <View style={styles.glassGlareBottom} />
              </LinearGradient>
            </Animated.View>
          </View>
        </View>
      </View>

      {/* Futuristic Status Pill */}
      {lightState > 0 && (
        <View
          style={[
            styles.statusPill,
            {
              borderColor: statusColor,
              shadowColor: statusColor,
            },
          ]}
        >
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusText}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowBackdrop: {
    position: 'absolute',
    width: 220,
    height: 380,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 36,
    shadowOpacity: 0.8,
    elevation: 8,
  },
  chassis: {
    width: 128,
    height: 326,
    backgroundColor: '#0C0E17',
    borderRadius: 28,
    borderWidth: 2.5,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 24,
    elevation: 10,
  },
  rivet: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2A3042',
    borderWidth: 1,
    borderColor: '#171B26',
  },
  socketContainer: {
    width: 86,
    height: 86,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shockwaveRing: {
    position: 'absolute',
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 2.5,
  },
  socketBevel: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#06070D',
    borderWidth: 2,
    borderColor: '#1A1F2E',
    borderTopColor: '#283147',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bulbWrapper: {
    width: 74,
    height: 74,
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bulbGradient: {
    width: 74,
    height: 74,
    borderRadius: 37,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  bulbCore: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    opacity: 0.65,
  },
  glassGlareTop: {
    position: 'absolute',
    top: 5,
    left: 14,
    width: 32,
    height: 15,
    borderRadius: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    transform: [{ rotate: '-28deg' }],
  },
  glassGlareBottom: {
    position: 'absolute',
    bottom: 6,
    right: 14,
    width: 20,
    height: 7,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  statusPill: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(10, 12, 22, 0.85)',
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 6,
  },
  statusText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    letterSpacing: 1.5,
  },
  fullscreenOverlayRoot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenCenterGlow: {
    position: 'absolute',
    width: '85%',
    height: '50%',
    borderRadius: 200,
    opacity: 0.8,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 60,
    shadowOpacity: 0.9,
  },
  fullscreenEdgeBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    opacity: 0.7,
  },
});

export function TrafficLightFullscreenOverlay({ lightState = 0 }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (lightState > 0) {
      fadeAnim.setValue(0.2);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();

      pulseAnim.setValue(0.97);
      Animated.spring(pulseAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    }
  }, [lightState]);

  if (!lightState || lightState <= 0) return null;

  // 1: Red, 2: Yellow, 3: Green
  let gradientColors = [
    'rgba(239, 68, 68, 0.32)',
    'rgba(239, 68, 68, 0.12)',
    'rgba(239, 68, 68, 0.28)',
  ];
  let glowColor = 'rgba(239, 68, 68, 0.22)';
  let borderColor = 'rgba(239, 68, 68, 0.45)';

  if (lightState === 2) {
    gradientColors = [
      'rgba(245, 158, 11, 0.32)',
      'rgba(245, 158, 11, 0.12)',
      'rgba(245, 158, 11, 0.28)',
    ];
    glowColor = 'rgba(245, 158, 11, 0.22)';
    borderColor = 'rgba(245, 158, 11, 0.45)';
  } else if (lightState === 3) {
    gradientColors = [
      'rgba(16, 185, 129, 0.35)',
      'rgba(16, 185, 129, 0.14)',
      'rgba(16, 185, 129, 0.32)',
    ];
    glowColor = 'rgba(16, 185, 129, 0.25)';
    borderColor = 'rgba(16, 185, 129, 0.50)';
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.fullscreenOverlayRoot,
        {
          opacity: fadeAnim,
          transform: [{ scale: pulseAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      {/* Central soft ambient glow */}
      <View
        style={[
          styles.fullscreenCenterGlow,
          {
            backgroundColor: glowColor,
          },
        ]}
      />
      {/* Subtle edge neon border rim */}
      <View
        style={[
          styles.fullscreenEdgeBorder,
          {
            borderColor: borderColor,
          },
        ]}
      />
    </Animated.View>
  );
}
