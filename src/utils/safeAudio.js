import { Image } from 'react-native';
import { triggerSound } from './soundPlayer';

class SafeSoundInstance {
  constructor(soundKey) {
    this._soundKey = soundKey;
    this._rate = 1.0;
  }

  async playAsync() {
    triggerSound(this._soundKey, { rate: this._rate });
  }

  async replayAsync() {
    triggerSound(this._soundKey, { rate: this._rate });
  }

  async setPositionAsync(millis) {
  }

  async setRateAsync(rate) {
    this._rate = rate;
  }

  async stopAsync() {
  }

  async unloadAsync() {
  }

  setOnPlaybackStatusUpdate(cb) {
  }
}

const Audio = {
  setAudioModeAsync: async (mode) => {
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

      const safeInstance = new SafeSoundInstance(soundKey);
      if (initialStatus && initialStatus.shouldPlay) {
        safeInstance.playAsync();
      }
      return { sound: safeInstance, status: { isLoaded: true } };
    }
  }
};

const Video = function SafeVideoFallback() { return null; };

export { Audio, Video };
