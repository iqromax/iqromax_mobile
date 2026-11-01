import { Platform, Vibration } from 'react-native';

let Haptics = null;
try {
  Haptics = require('expo-haptics');
} catch (e) {
  Haptics = null;
}

/**
 * Multi-stage tactile vibration for entering Clan portal.
 * Works seamlessly across Android (Vibrator & HapticEngine) and iOS (Taptic Engine).
 */
export const triggerPortalWarpHaptics = () => {
  // 1. Expo Haptics (Taptic Engine / Native Haptic Generator)
  try {
    if (Haptics) {
      if (Haptics.impactAsync && Haptics.ImpactFeedbackStyle) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
      }
      setTimeout(() => {
        if (Haptics && Haptics.impactAsync && Haptics.ImpactFeedbackStyle) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
        }
      }, 220);
      setTimeout(() => {
        if (Haptics && Haptics.notificationAsync && Haptics.NotificationFeedbackType) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        } else if (Haptics && Haptics.impactAsync && Haptics.ImpactFeedbackStyle) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
        }
      }, 530);
    }
  } catch (e) {}

  // 2. React Native Native Vibration Engine
  try {
    if (Platform.OS === 'ios') {
      // iOS Vibration requires no arguments to vibrate for default 400ms
      Vibration.vibrate();
      setTimeout(() => {
        try {
          Vibration.vibrate();
        } catch (e) {}
      }, 530);
    } else {
      // Android: Strong multi-burst pattern (non-zero start to prevent driver drop)
      Vibration.vibrate([0, 180, 90, 220, 70, 320]);
      setTimeout(() => {
        try {
          Vibration.vibrate(280);
        } catch (e) {}
      }, 530);
    }
  } catch (e) {}
};

/**
 * Multi-stage tactile vibration for returning to IQROMAX main system.
 */
export const triggerReturnPortalHaptics = () => {
  // 1. Expo Haptics
  try {
    if (Haptics) {
      if (Haptics.impactAsync && Haptics.ImpactFeedbackStyle) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
      }
      setTimeout(() => {
        if (Haptics && Haptics.impactAsync && Haptics.ImpactFeedbackStyle) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        }
      }, 200);
      setTimeout(() => {
        if (Haptics && Haptics.notificationAsync && Haptics.NotificationFeedbackType) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        }
      }, 510);
    }
  } catch (e) {}

  // 2. React Native Vibration
  try {
    if (Platform.OS === 'ios') {
      Vibration.vibrate();
      setTimeout(() => {
        try {
          Vibration.vibrate();
        } catch (e) {}
      }, 510);
    } else {
      Vibration.vibrate([0, 160, 80, 200, 60, 280]);
      setTimeout(() => {
        try {
          Vibration.vibrate(260);
        } catch (e) {}
      }, 510);
    }
  } catch (e) {}
};
