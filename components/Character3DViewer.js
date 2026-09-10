import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset, useAssets } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

const CHARACTER_MODELS = [
  require('../assets/models/athletic_man_optimized.glb'),
  require('../assets/models/adultmale3dmodel-v2.glb'),
  require('../assets/models/mannequin_clothing_optimized.glb'),
  require('../assets/models/businessman_optimized.glb'),
  require('../assets/models/fashion_model_optimized.glb'),
  require('../assets/models/casual_outfit_optimized.glb'),
  require('../assets/models/beige_trench_coat_optimized.glb'),
  require('../assets/models/stylized_girl_optimized.glb')
];

export function Character3DViewer({ characterIndex = 0, accessoryPath = null, headwearPath = null, style }) {
  const webViewRef = useRef(null);
  const [assets] = useAssets(CHARACTER_MODELS);
  const [modelBase64, setModelBase64] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setModelBase64(null);

    async function loadModel() {
      const idx = typeof characterIndex === 'number' && characterIndex >= 0 && characterIndex < CHARACTER_MODELS.length ? characterIndex : 0;
      try {
        const mod = CHARACTER_MODELS[idx];
        const asset = Asset.fromModule(mod);
        if (!asset.localUri) {
          await asset.downloadAsync();
        }
        const uri = asset.localUri || asset.uri;

        if (uri) {
          const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: 'base64'
          });
          if (isMounted && base64) {
            setModelBase64(base64);
          }
        }
      } catch (err) {
        console.warn('Silent fallback for 3D model:', err);
      }
    }

    loadModel();
    return () => {
      isMounted = false;
    };
  }, [assets, characterIndex]);

  const [headwearBase64, setHeadwearBase64] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setHeadwearBase64(null);

    async function loadHeadwear() {
      if (!headwearPath) return;
      try {
        let uri = headwearPath;
        if (typeof headwearPath === 'number') {
          const asset = Asset.fromModule(headwearPath);
          await asset.downloadAsync();
          uri = asset.localUri || asset.uri;
        } else if (typeof headwearPath === 'string') {
          if (!headwearPath.startsWith('http://') && !headwearPath.startsWith('https://')) {
            const cleanPath = headwearPath.startsWith('/') ? headwearPath : `/${headwearPath}`;
            uri = `https://iqromax.net${cleanPath}`;
          }
        }
        
        let downloadedUri = uri;
        if (typeof uri === 'string' && (uri.startsWith('http://') || uri.startsWith('https://'))) {
          const downloaded = await FileSystem.downloadAsync(uri, FileSystem.cacheDirectory + 'temp_headwear.glb');
          downloadedUri = downloaded.uri;
        }
        
        const b64 = await FileSystem.readAsStringAsync(downloadedUri, { encoding: 'base64' });
        if (isMounted) setHeadwearBase64(b64);
      } catch (err) {
        console.log('Error downloading headwear for WebView:', err);
      }
    }
    loadHeadwear();
    return () => { isMounted = false; };
  }, [headwearPath]);

  const htmlContent = modelBase64 ? `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"></script>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { width: 100%; height: 100%; overflow: hidden; background-color: transparent; }
          model-viewer {
            width: 100%;
            height: 100%;
            --poster-color: transparent;
            --progress-bar-color: #6366f1;
            --progress-bar-height: 4px;
          }
        </style>
      </head>
      <body>
        <model-viewer
          id="viewer"
          src="data:model/gltf-binary;base64,${modelBase64}"
          camera-controls
          shadow-intensity="1.2"
          shadow-softness="0.8"
          exposure="1.2"
          interaction-prompt="none"
          auto-rotate
          auto-rotate-delay="0"
          rotation-per-second="20deg"
          environment-image="neutral"
          bounds="tight"
          camera-orbit="0deg 75deg auto"
          min-camera-orbit="auto auto auto"
          max-camera-orbit="auto auto auto"
        >
        </model-viewer>
        <script>
          const viewer = document.getElementById('viewer');
          if (viewer) {
            viewer.addEventListener('load', async () => {
              ${headwearBase64 ? `
                try {
                  const headwearB64 = "${headwearBase64}";
                  const res = await fetch("data:model/gltf-binary;base64," + headwearB64);
                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const gltf = await viewer.loadGltf(url);
                  if (gltf && gltf.scene) {
                    gltf.scene.scale.set(25.0, 25.0, 25.0);
                    gltf.scene.position.set(0, 0.5, 0);
                    viewer.model.scene.add(gltf.scene);
                  }
                } catch(e) {}
              ` : ''}
            });
          }
        </script>
      </body>
    </html>
  ` : '';

  return (
    <View style={[styles.container, style]}>
      {modelBase64 ? (
        <WebView
          key={`char_${characterIndex}`}
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          bounces={false}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#A855F7" size="large" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  }
});
