// Safe wrapper for expo-av to prevent crash in Expo Go SDK 57+ when ExponentAV native module is missing
import { NativeModules } from 'react-native';

let Audio = {
  Sound: {
    createAsync: async () => ({
      sound: {
        playAsync: async () => {},
        unloadAsync: async () => {},
        setPositionAsync: async () => {}
      }
    })
  },
  setAudioModeAsync: async () => {}
};

let Video = null;

// Check if ExponentAV native module exists before requiring 'expo-av'
// In Expo Go SDK 57+, ExponentAV native module was removed, so requiring 'expo-av' throws immediately
try {
  const hasExponentAV = 
    (NativeModules && NativeModules.ExponentAV) ||
    (global.ExpoModules && global.ExpoModules.ExponentAV) ||
    (global.expo && global.expo.modules && global.expo.modules.ExponentAV);

  if (hasExponentAV) {
    const expoAv = require('expo-av');
    if (expoAv && expoAv.Audio) Audio = expoAv.Audio;
    if (expoAv && expoAv.Video) Video = expoAv.Video;
  }
} catch (e) {
  console.warn('expo-av native module ExponentAV is not available in this environment');
}

export { Audio, Video };
