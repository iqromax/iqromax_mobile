// Safe wrapper for expo-av to prevent crash in Expo Go SDK 57+ when ExponentAV native module is missing

let Audio = {
  Sound: {
    createAsync: async () => ({ sound: { playAsync: async () => {}, unloadAsync: async () => {} } })
  },
  setAudioModeAsync: async () => {}
};

let Video = null;

try {
  const expoAv = require('expo-av');
  if (expoAv && expoAv.Audio) {
    Audio = expoAv.Audio;
  }
  if (expoAv && expoAv.Video) {
    Video = expoAv.Video;
  }
} catch (e) {
  console.warn('expo-av native module not available, using safe fallback');
}

export { Audio, Video };
