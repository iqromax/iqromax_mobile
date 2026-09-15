import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset, useAssets } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { API_URL } from '../src/config/api';

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
  const [headwearBase64, setHeadwearBase64] = useState(null);
  const [accessoryBase64, setAccessoryBase64] = useState(null);

  // Load Main Character Model Base64
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

  // Load Headwear Model Base64 dynamically
  useEffect(() => {
    let isMounted = true;
    if (!headwearPath) {
      setHeadwearBase64(null);
      return;
    }

    async function loadHeadwear() {
      try {
        let uri = typeof headwearPath === 'object' ? headwearPath.uri : headwearPath;
        if (typeof headwearPath === 'number') {
          const asset = Asset.fromModule(headwearPath);
          if (!asset.localUri) {
            await asset.downloadAsync();
          }
          uri = asset.localUri || asset.uri;
        } else if (typeof headwearPath === 'string') {
          if (!headwearPath.startsWith('http://') && !headwearPath.startsWith('https://')) {
            const cleanPath = headwearPath.startsWith('/') ? headwearPath : `/${headwearPath}`;
            const baseUrl = API_URL.replace(/\/api\/?$/, '');
            uri = `${baseUrl}${cleanPath}`;
          }
        }
        
        let downloadedUri = uri;
        if (typeof uri === 'string' && (uri.startsWith('http://') || uri.startsWith('https://'))) {
          const tempPath = FileSystem.cacheDirectory + `temp_hw_${Date.now()}.glb`;
          const downloaded = await FileSystem.downloadAsync(uri, tempPath);
          downloadedUri = downloaded.uri;
        }
        
        const b64 = await FileSystem.readAsStringAsync(downloadedUri, { encoding: 'base64' });
        if (isMounted && b64) {
          setHeadwearBase64(b64);
        }
      } catch (err) {
        console.warn('Error downloading headwear for WebView:', err);
        if (isMounted) setHeadwearBase64(null);
      }
    }
    loadHeadwear();
    return () => { isMounted = false; };
  }, [headwearPath]);

  // Load Accessory Model Base64 dynamically
  useEffect(() => {
    let isMounted = true;
    if (!accessoryPath) {
      setAccessoryBase64(null);
      return;
    }

    async function loadAccessory() {
      try {
        let uri = typeof accessoryPath === 'object' ? accessoryPath.uri : accessoryPath;
        if (typeof accessoryPath === 'number') {
          const asset = Asset.fromModule(accessoryPath);
          if (!asset.localUri) {
            await asset.downloadAsync();
          }
          uri = asset.localUri || asset.uri;
        } else if (typeof accessoryPath === 'string') {
          if (!accessoryPath.startsWith('http://') && !accessoryPath.startsWith('https://')) {
            const cleanPath = accessoryPath.startsWith('/') ? accessoryPath : `/${accessoryPath}`;
            const baseUrl = API_URL.replace(/\/api\/?$/, '');
            uri = `${baseUrl}${cleanPath}`;
          }
        }
        
        let downloadedUri = uri;
        if (typeof uri === 'string' && (uri.startsWith('http://') || uri.startsWith('https://'))) {
          const tempPath = FileSystem.cacheDirectory + `temp_acc_${Date.now()}.glb`;
          const downloaded = await FileSystem.downloadAsync(uri, tempPath);
          downloadedUri = downloaded.uri;
        }
        
        const b64 = await FileSystem.readAsStringAsync(downloadedUri, { encoding: 'base64' });
        if (isMounted && b64) {
          setAccessoryBase64(b64);
        }
      } catch (err) {
        console.warn('Error downloading accessory for WebView:', err);
        if (isMounted) setAccessoryBase64(null);
      }
    }
    loadAccessory();
    return () => { isMounted = false; };
  }, [accessoryPath]);

  // Dynamically update WebView without unmounting character
  useEffect(() => {
    if (!webViewRef.current) return;
    if (headwearBase64) {
      const js = `if (window.updateHeadwear) { window.updateHeadwear(${JSON.stringify(headwearBase64)}); } else { window.pendingHeadwearB64 = ${JSON.stringify(headwearBase64)}; } true;`;
      webViewRef.current.injectJavaScript(js);
    } else {
      const js = `if (window.updateHeadwear) { window.updateHeadwear(null); } window.pendingHeadwearB64 = null; true;`;
      webViewRef.current.injectJavaScript(js);
    }
  }, [headwearBase64]);

  useEffect(() => {
    if (!webViewRef.current) return;
    if (accessoryBase64) {
      const js = `if (window.updateAccessory) { window.updateAccessory(${JSON.stringify(accessoryBase64)}); } else { window.pendingAccessoryB64 = ${JSON.stringify(accessoryBase64)}; } true;`;
      webViewRef.current.injectJavaScript(js);
    } else {
      const js = `if (window.updateAccessory) { window.updateAccessory(null); } window.pendingAccessoryB64 = null; true;`;
      webViewRef.current.injectJavaScript(js);
    }
  }, [accessoryBase64]);

  const handleWebViewLoadEnd = () => {
    if (webViewRef.current) {
      if (headwearBase64) {
        webViewRef.current.injectJavaScript(`if (window.updateHeadwear) { window.updateHeadwear(${JSON.stringify(headwearBase64)}); } true;`);
      }
      if (accessoryBase64) {
        webViewRef.current.injectJavaScript(`if (window.updateAccessory) { window.updateAccessory(${JSON.stringify(accessoryBase64)}); } true;`);
      }
    }
  };

  const htmlContent = modelBase64 ? `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { width: 100%; height: 100%; overflow: hidden; background-color: transparent; }
          #webgl-container { width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <div id="webgl-container"></div>

        <script>
          const container = document.getElementById('webgl-container');

          // Scene, Camera, Renderer
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
          camera.position.set(0, 1.2, 3.5);

          const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          renderer.setSize(window.innerWidth, window.innerHeight);
          renderer.shadowMap.enabled = true;
          renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          container.appendChild(renderer.domElement);

          // Controls
          const controls = new THREE.OrbitControls(camera, renderer.domElement);
          controls.enableDamping = true;
          controls.dampingFactor = 0.05;
          controls.autoRotate = false;

          // Lock vertical rotation (only allow horizontal rotation around y-axis)
          controls.minPolarAngle = Math.PI / 2;
          controls.maxPolarAngle = Math.PI / 2;


          // Lights
          const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
          scene.add(ambientLight);

          const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
          dirLight.position.set(5, 10, 7);
          dirLight.castShadow = true;
          scene.add(dirLight);

          const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
          hemiLight.position.set(0, 20, 0);
          scene.add(hemiLight);

          // Base64 helper
          function base64ToArrayBuffer(base64) {
            const binaryString = window.atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
          }

          const gltfLoader = new THREE.GLTFLoader();
          const charB64Str = ${JSON.stringify(modelBase64 || '')};

          let characterModel = null;
          window.headwearModel = null;
          window.accessoryModel = null;

          window.pendingHeadwearB64 = ${JSON.stringify(headwearBase64 || null)};
          window.pendingAccessoryB64 = ${JSON.stringify(accessoryBase64 || null)};

          window.updateHeadwear = function(b64) {
            if (window.headwearModel) {
              scene.remove(window.headwearModel);
              window.headwearModel = null;
            }
            if (!b64 || !characterModel) return;
            try {
              const buffer = base64ToArrayBuffer(b64);
              gltfLoader.parse(buffer, '', function(gltf) {
                if (window.headwearModel) {
                  scene.remove(window.headwearModel);
                }
                window.headwearModel = gltf.scene;

                window.headwearModel.traverse(function(child) {
                  if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.frustumCulled = false;
                    if (child.material) {
                      child.material.side = THREE.DoubleSide;
                    }
                  }
                });

                const charBox = new THREE.Box3().setFromObject(characterModel);
                const charSize = charBox.getSize(new THREE.Vector3());

                const skinBox = new THREE.Box3().setFromObject(window.headwearModel);
                const skinSize = skinBox.getSize(new THREE.Vector3());

                // Target headwear width: ~68% of character shoulder width
                const targetHatWidth = charSize.x * 0.68;
                const maxSkinDim = Math.max(skinSize.x, skinSize.z, 0.0001);
                const hatScale = targetHatWidth / maxSkinDim;

                window.headwearModel.scale.set(hatScale, hatScale, hatScale);

                const scaledBox = new THREE.Box3().setFromObject(window.headwearModel);
                const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
                const scaledMinY = scaledBox.min.y;

                // Position headwear right on character head (~91% of height)
                const headY = charSize.y * 0.91;
                window.headwearModel.position.x = -scaledCenter.x;
                window.headwearModel.position.y = headY - scaledMinY;
                window.headwearModel.position.z = -scaledCenter.z;

                window.headwearModel.rotation.y = characterModel ? characterModel.rotation.y : 0;
                scene.add(window.headwearModel);

              });
            } catch(e) {
              console.error('Headwear parse error:', e);
            }
          };

          window.updateAccessory = function(b64) {
            if (window.accessoryModel) {
              scene.remove(window.accessoryModel);
              window.accessoryModel = null;
            }
            if (!b64 || !characterModel) return;
            try {
              const buffer = base64ToArrayBuffer(b64);
              gltfLoader.parse(buffer, '', function(gltf) {
                if (window.accessoryModel) {
                  scene.remove(window.accessoryModel);
                }
                window.accessoryModel = gltf.scene;

                window.accessoryModel.traverse(function(child) {
                  if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.frustumCulled = false;
                    if (child.material) {
                      child.material.side = THREE.DoubleSide;
                    }
                  }
                });

                const charBox = new THREE.Box3().setFromObject(characterModel);
                const charSize = charBox.getSize(new THREE.Vector3());

                const skinBox = new THREE.Box3().setFromObject(window.accessoryModel);
                const skinSize = skinBox.getSize(new THREE.Vector3());

                const targetWidth = charSize.x * 0.85;
                const maxSkinDim = Math.max(skinSize.x, skinSize.y, skinSize.z, 0.0001);
                const accScale = targetWidth / maxSkinDim;

                window.accessoryModel.scale.set(accScale, accScale, accScale);

                const scaledBox = new THREE.Box3().setFromObject(window.accessoryModel);
                const scaledCenter = scaledBox.getCenter(new THREE.Vector3());

                const chestY = charSize.y * 0.55;
                window.accessoryModel.position.x = -scaledCenter.x;
                window.accessoryModel.position.y = chestY - scaledCenter.y;
                window.accessoryModel.position.z = -scaledCenter.z;

                window.accessoryModel.rotation.y = characterModel ? characterModel.rotation.y : 0;
                scene.add(window.accessoryModel);

              });
            } catch(e) {
              console.error('Accessory parse error:', e);
            }
          };

          if (charB64Str.length > 0) {
            try {
              const charBuffer = base64ToArrayBuffer(charB64Str);
              gltfLoader.parse(charBuffer, '', function(gltf) {
                characterModel = gltf.scene;
                
                characterModel.traverse(function(child) {
                  if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.frustumCulled = false;
                  }
                });

                const box = new THREE.Box3().setFromObject(characterModel);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());

                characterModel.position.x -= center.x;
                characterModel.position.y -= box.min.y;
                characterModel.position.z -= center.z;

                scene.add(characterModel);

                // Set initial character rotation so all characters face straight forward towards the camera
                const modelRotationsY = [-Math.PI / 2, 0, -Math.PI / 2, -Math.PI / 2, 0, -Math.PI / 2, -Math.PI / 2, -Math.PI / 2];
                const charIdx = ${characterIndex};
                const targetRotY = modelRotationsY[charIdx] !== undefined ? modelRotationsY[charIdx] : -Math.PI / 2;
                characterModel.rotation.y = targetRotY;



                controls.target.set(0, size.y * 0.52, 0);
                camera.position.set(0, size.y * 0.52, Math.max(size.x, size.y, size.z) * 1.55);
                controls.update();



                // Apply initial skins if ready
                if (window.pendingHeadwearB64) {
                  window.updateHeadwear(window.pendingHeadwearB64);
                }
                if (window.pendingAccessoryB64) {
                  window.updateAccessory(window.pendingAccessoryB64);
                }
              });
            } catch(e) {
              console.error('Char Parse Error:', e);
            }
          }

          // Animation Loop
          function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
          }
          animate();

          // Resize
          window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
          });
        </script>
      </body>
    </html>
  ` : '';

  const renderKey = `char_${characterIndex}`;

  return (
    <View style={[styles.container, style]}>
      {modelBase64 ? (
        <WebView
          key={renderKey}
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
          onLoadEnd={handleWebViewLoadEnd}
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
