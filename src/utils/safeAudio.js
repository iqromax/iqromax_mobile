// Safe mock for audio/video to prevent C++ JSI UnsatisfiedLinkError crashes in standalone APKs
let Audio = {
  Sound: {
    createAsync: async () => ({
      sound: {
        playAsync: async () => {},
        unloadAsync: async () => {},
        setPositionAsync: async () => {},
        setStatusAsync: async () => {},
        stopAsync: async () => {}
      }
    })
  },
  setAudioModeAsync: async () => {}
};

let Video = null;

export { Audio, Video };
