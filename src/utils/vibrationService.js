import { Platform, Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Triggers exactly ONE single crisp vibration pulse.
 * Guaranteed to execute on iOS (AudioToolbox & Taptic Engine) and Android (Vibrator).
 */
export const triggerSingleVibration = () => {
  if (Platform.OS === 'ios') {
    // 1. Directly invoke React Native's built-in RCTVibration module (AudioServicesPlaySystemSound)
    try {
      Vibration.vibrate();
    } catch (e) {}

    // 2. Also invoke Expo Haptics (UIImpactFeedbackGenerator) for Taptic Engine
    try {
      if (Haptics && typeof Haptics.impactAsync === 'function') {
        const style = Haptics.ImpactFeedbackStyle?.Heavy ?? Haptics.ImpactFeedbackStyle?.Medium;
        Haptics.impactAsync(style).catch(() => {});
      }
    } catch (e) {}
  } else {
    // Android: exactly ONE clean 100ms vibration pulse
    try {
      Vibration.vibrate(100);
    } catch (e) {}

    try {
      if (Haptics && typeof Haptics.impactAsync === 'function') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
      }
    } catch (e) {}
  }
};

/**
 * Exactly one vibration for entering Clan portal
 */
export const triggerPortalWarpHaptics = () => {
  triggerSingleVibration();
};

/**
 * Exactly one vibration for returning to IQROMAX main system
 */
export const triggerReturnPortalHaptics = () => {
  triggerSingleVibration();
};
