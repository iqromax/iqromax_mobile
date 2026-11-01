import { Platform, Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Triggers exactly ONE single crisp, premium haptic vibration.
 * Works reliably on iOS (iPhone Taptic Engine) and Android (Vibrator).
 */
export const triggerSingleVibration = () => {
  let hapticsTriggered = false;

  // 1. Primary: Expo Haptics (Directly drives Apple Taptic Engine on iOS and Android HapticFeedback)
  try {
    if (Haptics && typeof Haptics.impactAsync === 'function') {
      const style = Haptics.ImpactFeedbackStyle?.Heavy ?? Haptics.ImpactFeedbackStyle?.Medium;
      Haptics.impactAsync(style).catch(() => {});
      hapticsTriggered = true;
    }
  } catch (e) {
    hapticsTriggered = false;
  }

  // 2. Fallback / Complement via React Native Vibration API
  try {
    if (Platform.OS === 'ios') {
      // On iOS, if Haptics didn't trigger, trigger system vibration
      if (!hapticsTriggered) {
        Vibration.vibrate();
      }
    } else {
      // On Android, trigger exactly ONE single short vibration pulse (100ms)
      Vibration.vibrate(100);
    }
  } catch (e) {}
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
