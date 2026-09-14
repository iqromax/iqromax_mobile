import { NativeModules, Image } from 'react-native';
import { triggerSound } from './soundPlayer';

let ExpoAVAudio = null;
let ExpoAVVideo = null;
let isExponentAVAvailable = false;

try {
  if (NativeModules && (NativeModules.ExponentAV || NativeModules.ExponentAVModule)) {
    const expoAv = require('expo-av');
    if (expoAv && expoAv.Audio) {
      ExpoAVAudio = expoAv.Audio;
      ExpoAVVideo = expoAv.Video;
      isExponentAVAvailable = true;
    }
  }
} catch (e) {
  isExponentAVAvailable = false;
}

if (isExponentAVAvailable && ExpoAVAudio && typeof ExpoAVAudio.setAudioModeAsync === 'function') {
  try {
    ExpoAVAudio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});
  } catch (e) {}
}

class SafeSoundInstance {
  constructor(expoSound, soundKey) {
    this._expoSound = expoSound;
    this._soundKey = soundKey;
    this._rate = 1.0;
  }

  async playAsync() {
    if (this._expoSound) {
      try {
        return await this._expoSound.playAsync();
      } catch (e) {}
    }
    triggerSound(this._soundKey, { rate: this._rate });
  }

  async replayAsync() {
    if (this._expoSound) {
      try {
        return await this._expoSound.replayAsync();
      } catch (e) {
        try {
          await this._expoSound.setPositionAsync(0);
          return await this._expoSound.playAsync();
        } catch (err) {}
      }
    }
    triggerSound(this._soundKey, { rate: this._rate });
  }

  async setPositionAsync(millis) {
    if (this._expoSound) {
      try {
        return await this._expoSound.setPositionAsync(millis);
      } catch (e) {}
    }
  }

  async setRateAsync(rate) {
    this._rate = rate;
    if (this._expoSound) {
      try {
        return await this._expoSound.setRateAsync(rate, true);
      } catch (e) {}
    }
  }

  async stopAsync() {
    if (this._expoSound) {
      try {
        return await this._expoSound.stopAsync();
      } catch (e) {}
    }
  }

  async unloadAsync() {
    if (this._expoSound) {
      try {
        return await this._expoSound.unloadAsync();
      } catch (e) {}
    }
  }

  setOnPlaybackStatusUpdate(cb) {
    if (this._expoSound) {
      try {
        this._expoSound.setOnPlaybackStatusUpdate(cb);
      } catch (e) {}
    }
  }
}

const Audio = {
  setAudioModeAsync: async (mode) => {
    if (isExponentAVAvailable && ExpoAVAudio && typeof ExpoAVAudio.setAudioModeAsync === 'function') {
      try {
        return await ExpoAVAudio.setAudioModeAsync(mode);
      } catch (e) {}
    }
  },
  Sound: {
    createAsync: async (source, initialStatus = {}, onPlaybackStatusUpdate = null, downloadFirst = true) => {
      let soundKey = 'tick';
      try {
        if (typeof source === 'number') {
          const resolved = Image.resolveAssetSource(source);
          const uri = resolved?.uri || '';
          if (uri.includes('correct')) soundKey = 'correct';
          else if (uri.includes('wrong')) soundKey = 'wrong';
          else if (uri.includes('tick')) soundKey = 'tick';
        }
      } catch (e) {}

      if (isExponentAVAvailable && ExpoAVAudio && ExpoAVAudio.Sound) {
        try {
          const res = await ExpoAVAudio.Sound.createAsync(source, initialStatus, onPlaybackStatusUpdate, downloadFirst);
          return { sound: new SafeSoundInstance(res.sound, soundKey), status: res.status };
        } catch (e) {}
      }

      const safeInstance = new SafeSoundInstance(null, soundKey);
      if (initialStatus && initialStatus.shouldPlay) {
        safeInstance.playAsync();
      }
      return { sound: safeInstance, status: { isLoaded: true } };
    }
  }
};

const Video = ExpoAVVideo || function SafeVideoFallback() { return null; };

export { Audio, Video };
