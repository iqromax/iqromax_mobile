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

const MODEL_ORIENTATIONS = [
  '0deg 0deg 0deg',     // 0: Alex
  '0deg 0deg 0deg',     // 1: Maks
  '0deg 0deg 0deg',     // 2: David
  '0deg 0deg 0deg',     // 3: Kevin
  '0deg 0deg 0deg',     // 4: Lily
  '0deg 0deg 0deg',     // 5: Maya
  '0deg 0deg -90deg',   // 6: Emma (beige_trench_coat_optimized)
  '0deg 0deg 0deg'      // 7: Sophia
];

const MODEL_ORBITS = [
  '90deg 75deg auto',  // 0: Alex
  '0deg 75deg auto',   // 1: Maks (adultmale3dmodel-v2)
  '90deg 75deg auto',  // 2: David
  '90deg 75deg auto',  // 3: Kevin
  '0deg 75deg auto',   // 4: Lily (fashion_model_optimized)
  '90deg 75deg auto',  // 5: Maya
  '90deg 75deg auto',  // 6: Emma
  '90deg 75deg auto'   // 7: Sophia
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
          const tempPath = FileSystem.cacheDirectory + `temp_headwear_${Date.now()}.glb`;
          const downloaded = await FileSystem.downloadAsync(uri, tempPath);
          downloadedUri = downloaded.uri;
        }
        
        const b64 = await FileSystem.readAsStringAsync(downloadedUri, { encoding: 'base64' });
        if (isMounted && b64) {
          setHeadwearBase64(b64);
        }
      } catch (err) {
        console.log('Error downloading headwear for WebView:', err);
      }
    }
    loadHeadwear();
    return () => { isMounted = false; };
  }, [headwearPath]);

  useEffect(() => {
    if (!webViewRef.current) return;
    if (headwearBase64) {
      const js = `
        if (window.updateHeadwear) {
          window.updateHeadwear("${headwearBase64}");
        }
        true;
      `;
      webViewRef.current.injectJavaScript(js);
    } else {
      const js = `
        if (window.removeHeadwear) {
          window.removeHeadwear();
        }
        true;
      `;
      webViewRef.current.injectJavaScript(js);
    }
  }, [headwearBase64]);

  const htmlContent = modelBase64 ? `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <script src="https://unpkg.com/meshoptimizer@0.19.0/meshopt_decoder.js"></script>
        <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"></script>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { width: 100%; height: 100%; overflow: hidden; background-color: transparent; }
          model-viewer {
            width: 100%;
            height: 100%;
            --poster-color: transparent;
            --progress-bar-color: transparent;
            --progress-bar-height: 0px;
          }
          model-viewer::part(default-progress-bar),
          model-viewer::part(progress-bar) {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0px !important;
          }
        </style>
      </head>
      <body>
        <model-viewer
          id="viewer"
          src="data:model/gltf-binary;base64,${modelBase64}"
          camera-controls
          disable-zoom
          shadow-intensity="1.2"
          shadow-softness="0.8"
          exposure="1.2"
          interaction-prompt="none"
          environment-image="neutral"
          bounds="tight"
          camera-orbit="${currentOrbit}"
          min-camera-orbit="-infinity 75deg auto"
          max-camera-orbit="infinity 75deg auto"
        >
        </model-viewer>
        <script>
          const viewer = document.getElementById('viewer');
          let currentHeadwearNode = null;

          window.removeHeadwear = function() {
            if (currentHeadwearNode && viewer && viewer.model && viewer.model.scene) {
              viewer.model.scene.remove(currentHeadwearNode);
              currentHeadwearNode = null;
            }
          };

          window.updateHeadwear = async function(headwearB64) {
            window.removeHeadwear();
            if (!viewer || !headwearB64) return;
            try {
              const res = await fetch("data:model/gltf-binary;base64," + headwearB64);
              const blob = await res.blob();
              const url = URL.createObjectURL(blob);
              
              let gltf = null;
              if (typeof viewer.loadGltf === 'function') {
                gltf = await viewer.loadGltf(url);
              } else if (viewer.model && typeof viewer.model.loadGltf === 'function') {
                gltf = await viewer.model.loadGltf(url);
              }

              if (gltf && gltf.scene && viewer.model && viewer.model.scene) {
                currentHeadwearNode = gltf.scene;
                const THREE = window.THREE || viewer.model.scene.constructor.THREE || (viewer.constructor && viewer.constructor.THREE);
                if (THREE && THREE.Box3 && THREE.Vector3) {
                  const charBox = new THREE.Box3().setFromObject(viewer.model.scene);
                  const charSize = charBox.getSize(new THREE.Vector3());
                  
                  const headBox = new THREE.Box3().setFromObject(gltf.scene);
                  const headSize = headBox.getSize(new THREE.Vector3());

                  const targetScale = (charSize.x * 0.45) / (headSize.x || 1);
                  if (targetScale > 0 && isFinite(targetScale)) {
                    gltf.scene.scale.set(targetScale, targetScale, targetScale);
                  }
                  
                  const updatedHeadBox = new THREE.Box3().setFromObject(gltf.scene);
                  const updatedHeadSize = updatedHeadBox.getSize(new THREE.Vector3());
                  const headCenter = updatedHeadBox.getCenter(new THREE.Vector3());

                  gltf.scene.position.x = -headCenter.x;
                  gltf.scene.position.z = -headCenter.z;
                  gltf.scene.position.y = charBox.max.y - updatedHeadBox.min.y - (updatedHeadSize.y * 0.35);
                } else {
                  gltf.scene.scale.set(1.5, 1.5, 1.5);
                  gltf.scene.position.set(0, 1.8, 0);
                }

                viewer.model.scene.add(gltf.scene);
              }
            } catch(e) {
              console.error('Error attaching 3D headwear:', e);
            }
          };

          if (viewer) {
            viewer.addEventListener('load', () => {
              ${headwearBase64 ? `window.updateHeadwear("${headwearBase64}");` : ''}
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
