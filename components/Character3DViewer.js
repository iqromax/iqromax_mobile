import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

const CHARACTER_MODELS = {
  0: require('../assets/models/athletic_man_optimized.glb'),
  1: require('../assets/models/adult_male_optimized.glb'),
  2: require('../assets/models/mannequin_clothing_optimized.glb'),
  3: require('../assets/models/businessman_optimized.glb'),
  4: require('../assets/models/fashion_model_optimized.glb'),
  5: require('../assets/models/casual_outfit_optimized.glb'),
  6: require('../assets/models/beige_trench_coat_optimized.glb'),
  7: require('../assets/models/stylized_girl_optimized.glb')
};

export function Character3DViewer({ characterIndex = 0, yOffset = 0, style }) {
  const webViewRef = useRef(null);
  const [modelBase64, setModelBase64] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setModelBase64(null);
    setLoading(true);

    async function loadModel() {
      try {
        const modelReq = CHARACTER_MODELS[characterIndex] || CHARACTER_MODELS[0];
        const asset = Asset.fromModule(modelReq);
        if (!asset.localUri) {
          await asset.downloadAsync();
        }
        const uri = asset.localUri || asset.uri;
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: 'base64'
        });
        if (isMounted) {
          setModelBase64(base64);
        }
      } catch (err) {
        console.error('Error loading 3D character base64:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadModel();
    return () => {
      isMounted = false;
    };
  }, [characterIndex]);

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
          exposure="1.0"
          interaction-prompt="none"
          auto-rotate
          auto-rotate-delay="0"
          rotation-per-second="20deg"
          environment-image="neutral"
          bounds="tight"
          camera-orbit="0deg 75deg 105%"
        >
        </model-viewer>
        <script>
          const viewer = document.getElementById('viewer');
          if (viewer) {
            viewer.addEventListener('load', () => {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'LOADED' }));
              }
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
          androidLayerType="hardware"
          mixedContentMode="always"
          androidHardwareAccelerationDisabled={false}
          containerStyle={{ backgroundColor: 'transparent' }}
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
