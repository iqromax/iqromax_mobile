import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset, useAssets } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { API_URL } from '../src/config/api';

export function Character3DViewer({ characterPath = null, accessoryPath = null, headwearPath = null, pantsPath = null, style }) {
  const webViewRef = useRef(null);
  const [modelBase64, setModelBase64] = useState(null);
  const [headwearBase64, setHeadwearBase64] = useState(null);
  const [accessoryBase64, setAccessoryBase64] = useState(null);
  const [pantsBase64, setPantsBase64] = useState(null);

  // Load Main Character Model Base64
  useEffect(() => {
    let isMounted = true;
    if (!characterPath) {
      setModelBase64(null);
      return;
    }

    async function loadModel() {
      try {
        let uri = typeof characterPath === 'object' ? characterPath.uri : characterPath;
        if (typeof characterPath === 'number') {
          const asset = Asset.fromModule(characterPath);
          if (!asset.localUri) {
            await asset.downloadAsync();
          }
          uri = asset.localUri || asset.uri;
        } else if (typeof characterPath === 'string') {
          if (!characterPath.startsWith('http://') && !characterPath.startsWith('https://')) {
            const cleanPath = characterPath.startsWith('/') ? characterPath : `/${characterPath}`;
            const baseUrl = API_URL.replace(/\/api\/?$/, '');
            uri = `${baseUrl}${cleanPath}`;
          }
        }
        
        let downloadedUri = uri;
        if (typeof uri === 'string' && (uri.startsWith('http://') || uri.startsWith('https://'))) {
          const tempPath = FileSystem.cacheDirectory + `temp_char_${Date.now()}.glb`;
          const downloaded = await FileSystem.downloadAsync(uri, tempPath);
          downloadedUri = downloaded.uri;
        }
        
        const b64 = await FileSystem.readAsStringAsync(downloadedUri, { encoding: 'base64' });
        if (isMounted && b64) {
          setModelBase64(b64);
        }
      } catch (err) {
        console.warn('Error downloading character for WebView:', err);
        if (isMounted) setModelBase64(null);
      }
    }

    loadModel();
    return () => {
      isMounted = false;
    };
  }, [characterPath]);

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

  // Load Pants Model Base64 dynamically
  useEffect(() => {
    let isMounted = true;
    if (!pantsPath) {
      setPantsBase64(null);
      return;
    }

    async function loadPants() {
      try {
        let uri = typeof pantsPath === 'object' ? pantsPath.uri : pantsPath;
        if (typeof pantsPath === 'number') {
          const asset = Asset.fromModule(pantsPath);
          if (!asset.localUri) {
            await asset.downloadAsync();
          }
          uri = asset.localUri || asset.uri;
        } else if (typeof pantsPath === 'string') {
          if (!pantsPath.startsWith('http://') && !pantsPath.startsWith('https://')) {
            const cleanPath = pantsPath.startsWith('/') ? pantsPath : `/${pantsPath}`;
            const baseUrl = API_URL.replace(/\/api\/?$/, '');
            uri = `${baseUrl}${cleanPath}`;
          }
        }
        
        let downloadedUri = uri;
        if (typeof uri === 'string' && (uri.startsWith('http://') || uri.startsWith('https://'))) {
          const tempPath = FileSystem.cacheDirectory + `temp_pants_${Date.now()}.glb`;
          const downloaded = await FileSystem.downloadAsync(uri, tempPath);
          downloadedUri = downloaded.uri;
        }
        
        const b64 = await FileSystem.readAsStringAsync(downloadedUri, { encoding: 'base64' });
        if (isMounted && b64) {
          setPantsBase64(b64);
        }
      } catch (err) {
        console.warn('Error downloading pants for WebView:', err);
        if (isMounted) setPantsBase64(null);
      }
    }
    loadPants();
    return () => { isMounted = false; };
  }, [pantsPath]);

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

  useEffect(() => {
    if (!webViewRef.current) return;
    if (pantsBase64) {
      const js = `if (window.updatePants) { window.updatePants(${JSON.stringify(pantsBase64)}); } else { window.pendingPantsB64 = ${JSON.stringify(pantsBase64)}; } true;`;
      webViewRef.current.injectJavaScript(js);
    } else {
      const js = `if (window.updatePants) { window.updatePants(null); } window.pendingPantsB64 = null; true;`;
      webViewRef.current.injectJavaScript(js);
    }
  }, [pantsBase64]);

  const handleWebViewLoadEnd = () => {
    if (webViewRef.current) {
      if (headwearBase64) {
        webViewRef.current.injectJavaScript(`if (window.updateHeadwear) { window.updateHeadwear(${JSON.stringify(headwearBase64)}); } true;`);
      }
      if (accessoryBase64) {
        webViewRef.current.injectJavaScript(`if (window.updateAccessory) { window.updateAccessory(${JSON.stringify(accessoryBase64)}); } true;`);
      }
      if (pantsBase64) {
        webViewRef.current.injectJavaScript(`if (window.updatePants) { window.updatePants(${JSON.stringify(pantsBase64)}); } true;`);
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
          renderer.outputEncoding = THREE.sRGBEncoding;
          renderer.toneMapping = THREE.ACESFilmicToneMapping;
          renderer.toneMappingExposure = 1.0;
          container.appendChild(renderer.domElement);

          // Controls
          const controls = new THREE.OrbitControls(camera, renderer.domElement);
          controls.enableDamping = true;
          controls.dampingFactor = 0.05;
          controls.autoRotate = false;

          // Lock vertical rotation (only allow horizontal rotation around y-axis)
          controls.minPolarAngle = Math.PI / 2;
          controls.maxPolarAngle = Math.PI / 2;
          
          // Disable zooming (pinch to zoom)
          controls.enableZoom = false;
          
          // Disable panning (moving off-center with two fingers)
          controls.enablePan = false;


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
          window.pantsModel = null;

          window.pendingHeadwearB64 = ${JSON.stringify(headwearBase64 || null)};
          window.pendingAccessoryB64 = ${JSON.stringify(accessoryBase64 || null)};
          window.pendingPantsB64 = ${JSON.stringify(pantsBase64 || null)};

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
                    if (child.material) {
                      child.material.side = THREE.DoubleSide;
                    }
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.frustumCulled = false;
                  }
                });

                window.headwearModel.position.set(0, 0, 0);
                window.headwearModel.scale.set(1, 1, 1);

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
                    if (child.material) {
                      child.material.side = THREE.DoubleSide;
                    }
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.frustumCulled = false;
                  }
                });

                window.accessoryModel.position.set(0, 0, 0);
                window.accessoryModel.scale.set(1, 1, 1);

                window.accessoryModel.rotation.y = characterModel ? characterModel.rotation.y : 0;
                scene.add(window.accessoryModel);

              });
            } catch(e) {
              console.error('Accessory parse error:', e);
            }
          };

          window.updatePants = function(b64) {
            if (window.pantsModel) {
              scene.remove(window.pantsModel);
              window.pantsModel = null;
            }
            if (!b64 || !characterModel) return;
            try {
              const buffer = base64ToArrayBuffer(b64);
              gltfLoader.parse(buffer, '', function(gltf) {
                if (window.pantsModel) {
                  scene.remove(window.pantsModel);
                }
                window.pantsModel = gltf.scene;

                window.pantsModel.traverse(function(child) {
                  if (child.isMesh) {
                    if (child.material) {
                      child.material.side = THREE.DoubleSide;
                    }
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.frustumCulled = false;
                  }
                });

                window.pantsModel.position.set(0, 0, 0);
                window.pantsModel.scale.set(1, 1, 1);
                window.pantsModel.rotation.y = characterModel ? characterModel.rotation.y : 0;
                scene.add(window.pantsModel);

              });
            } catch(e) {
              console.error('Pants parse error:', e);
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
                    if (child.material) {
                      child.material.color.setHex(0x666666); // Darken the character significantly
                    }
                  }
                });

                const box = new THREE.Box3().setFromObject(characterModel);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());

                characterModel.position.set(0, 0, 0);
                characterModel.scale.set(1, 1, 1);

                scene.add(characterModel);

                // Default rotation so characters face straight forward towards the camera
                characterModel.rotation.y = 0;



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
                if (window.pendingPantsB64) {
                  window.updatePants(window.pendingPantsB64);
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

  const renderKey = typeof characterPath === 'string' ? characterPath : 'char_fallback';

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
