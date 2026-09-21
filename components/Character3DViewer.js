import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system/legacy';
import { ModelPreloader } from '../src/utils/ModelPreloader';

export function Character3DViewer({ characterPath = null, accessoryPath = null, topsPath = null, headwearPath = null, pantsPath = null, shoesPath = null, backpackPath = null, isBackView = false, disableRotation = false, categoryName = null, style }) {
  const webViewRef = useRef(null);

  const [charFilename, setCharFilename] = useState(null);
  const [headwearFilename, setHeadwearFilename] = useState(null);
  const [accessoryFilename, setAccessoryFilename] = useState(null);
  const [topsFilename, setTopsFilename] = useState(null);
  const [pantsFilename, setPantsFilename] = useState(null);
  const [shoesFilename, setShoesFilename] = useState(null);
  const [backpackFilename, setBackpackFilename] = useState(null);

  const resolveModelUrl = async (path, setter) => {
    if (!path) return setter(null);
    try {
      const localUri = ModelPreloader.getLocalModelUri(path);
      const remoteUrl = ModelPreloader.getRemoteUrl(path);
      
      if (localUri) {
        const info = await FileSystem.getInfoAsync(localUri);
        if (info.exists) {
          if (Platform.OS === 'ios') {
            // iOS WKWebView blocks file:// fetches. Read as base64 instead.
            const b64 = await FileSystem.readAsStringAsync(localUri, { encoding: 'base64' });
            return setter('base64:' + b64);
          } else {
            // Android allows file:// fetches when configured properly.
            return setter(localUri.split('/').pop());
          }
        }
      }
      setter(remoteUrl);
    } catch (e) {
      console.warn('Error resolving model path', e);
      setter(ModelPreloader.getRemoteUrl(path));
    }
  };

  useEffect(() => { resolveModelUrl(characterPath, setCharFilename); }, [characterPath]);
  useEffect(() => { resolveModelUrl(headwearPath, setHeadwearFilename); }, [headwearPath]);
  useEffect(() => { resolveModelUrl(accessoryPath, setAccessoryFilename); }, [accessoryPath]);
  useEffect(() => { resolveModelUrl(topsPath, setTopsFilename); }, [topsPath]);
  useEffect(() => { resolveModelUrl(pantsPath, setPantsFilename); }, [pantsPath]);
  useEffect(() => { resolveModelUrl(shoesPath, setShoesFilename); }, [shoesPath]);
  useEffect(() => { resolveModelUrl(backpackPath, setBackpackFilename); }, [backpackPath]);

  // Dynamically update parts when their props change
  useEffect(() => {
    if (!webViewRef.current) return;
    if (charFilename) {
      webViewRef.current.injectJavaScript(`if (window.updateCharacter) { window.updateCharacter('${charFilename}'); } true;`);
    } else {
      webViewRef.current.injectJavaScript(`if (window.updateCharacter) { window.updateCharacter(null); } true;`);
    }
  }, [charFilename]);

  useEffect(() => {
    if (!webViewRef.current) return;
    if (headwearFilename) {
      webViewRef.current.injectJavaScript(`if (window.updateHeadwear) { window.updateHeadwear('${headwearFilename}'); } true;`);
    } else {
      webViewRef.current.injectJavaScript(`if (window.updateHeadwear) { window.updateHeadwear(null); } true;`);
    }
  }, [headwearFilename]);

  useEffect(() => {
    if (!webViewRef.current) return;
    if (accessoryFilename) {
      webViewRef.current.injectJavaScript(`if (window.updateAccessory) { window.updateAccessory('${accessoryFilename}'); } true;`);
    } else {
      webViewRef.current.injectJavaScript(`if (window.updateAccessory) { window.updateAccessory(null); } true;`);
    }
  }, [accessoryFilename]);

  useEffect(() => {
    if (!webViewRef.current) return;
    if (topsFilename) {
      webViewRef.current.injectJavaScript(`if (window.updateTops) { window.updateTops('${topsFilename}'); } true;`);
    } else {
      webViewRef.current.injectJavaScript(`if (window.updateTops) { window.updateTops(null); } true;`);
    }
  }, [topsFilename]);

  useEffect(() => {
    if (!webViewRef.current) return;
    if (pantsFilename) {
      webViewRef.current.injectJavaScript(`if (window.updatePants) { window.updatePants('${pantsFilename}'); } true;`);
    } else {
      webViewRef.current.injectJavaScript(`if (window.updatePants) { window.updatePants(null); } true;`);
    }
  }, [pantsFilename]);

  useEffect(() => {
    if (!webViewRef.current) return;
    if (shoesFilename) {
      webViewRef.current.injectJavaScript(`if (window.updateShoes) { window.updateShoes('${shoesFilename}'); } true;`);
    } else {
      webViewRef.current.injectJavaScript(`if (window.updateShoes) { window.updateShoes(null); } true;`);
    }
  }, [shoesFilename]);

  useEffect(() => {
    if (!webViewRef.current) return;
    if (backpackFilename) {
      webViewRef.current.injectJavaScript(`if (window.updateBackpack) { window.updateBackpack('${backpackFilename}'); } true;`);
    } else {
      webViewRef.current.injectJavaScript(`if (window.updateBackpack) { window.updateBackpack(null); } true;`);
    }
  }, [backpackFilename]);

  useEffect(() => {
    if (!webViewRef.current) return;
    webViewRef.current.injectJavaScript(`if (window.setBackView) { window.setBackView(${isBackView}); } true;`);
  }, [isBackView]);

  useEffect(() => {
    if (!webViewRef.current) return;
    webViewRef.current.injectJavaScript(`if (window.resetCamera) { window.resetCamera(); } true;`);
  }, [categoryName]);

  const handleWebViewLoadEnd = () => {
    if (webViewRef.current) {
      if (charFilename) webViewRef.current.injectJavaScript(`if (window.updateCharacter) { window.updateCharacter('${charFilename}'); } true;`);
      if (headwearFilename) webViewRef.current.injectJavaScript(`if (window.updateHeadwear) { window.updateHeadwear('${headwearFilename}'); } true;`);
      if (accessoryFilename) webViewRef.current.injectJavaScript(`if (window.updateAccessory) { window.updateAccessory('${accessoryFilename}'); } true;`);
      if (topsFilename) webViewRef.current.injectJavaScript(`if (window.updateTops) { window.updateTops('${topsFilename}'); } true;`);
      if (pantsFilename) webViewRef.current.injectJavaScript(`if (window.updatePants) { window.updatePants('${pantsFilename}'); } true;`);
      if (shoesFilename) webViewRef.current.injectJavaScript(`if (window.updateShoes) { window.updateShoes('${shoesFilename}'); } true;`);
      if (backpackFilename) webViewRef.current.injectJavaScript(`if (window.updateBackpack) { window.updateBackpack('${backpackFilename}'); } true;`);
      
      webViewRef.current.injectJavaScript(`if (window.setBackView) { window.setBackView(${isBackView}); } true;`);
    }
  };

  const htmlContent = `
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
          #webgl-container { width: 100%; height: 100%; position: relative; }
          #loading-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background-color: transparent; transition: opacity 0.3s; pointer-events: none; }
          .spinner { border: 4px solid rgba(255, 255, 255, 0.1); border-left-color: #A855F7; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div id="webgl-container"></div>
        <div id="loading-overlay" style="opacity: 0;"><div class="spinner"></div></div>

        <script>
          const container = document.getElementById('webgl-container');
          const loadingOverlay = document.getElementById('loading-overlay');

          let loadingCount = 0;
          function showLoading() {
            loadingCount++;
            loadingOverlay.style.opacity = '1';
          }
          function hideLoading() {
            loadingCount = Math.max(0, loadingCount - 1);
            if (loadingCount === 0) {
              loadingOverlay.style.opacity = '0';
            }
          }

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
          controls.minPolarAngle = Math.PI / 2;
          controls.maxPolarAngle = Math.PI / 2;
          controls.enableZoom = false;
          controls.enablePan = false;
          controls.enableRotate = !${disableRotation};

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

          window.characterModel = null;
          window.headwearModel = null;
          window.accessoryModel = null;
          window.topsModel = null;
          window.pantsModel = null;
          window.shoesModel = null;
          window.backpackModel = null;

          let targetRotationY = 0;
          let currentRotationY = 0;
          
          window.setBackView = function(isBack) {
            targetRotationY = isBack ? Math.PI : 0;
          };

          window.resetCamera = function() {
            if (controls && camera) {
              const distance = camera.position.distanceTo(controls.target);
              camera.position.set(0, controls.target.y, distance || 3.5);
              controls.update();
            }
          };

          function processMaterial(child) {
            if (child.isMesh) {
              if (child.material) child.material.side = THREE.DoubleSide;
              child.castShadow = true;
              child.receiveShadow = true;
              child.frustumCulled = false;
            }
          }

          function loadModelIntoScene(dataOrUrl, onSuccess) {
            showLoading();
            if (dataOrUrl.startsWith('base64:')) {
              try {
                const b64 = dataOrUrl.substring(7);
                const buffer = base64ToArrayBuffer(b64);
                gltfLoader.parse(buffer, '', function(gltf) {
                  onSuccess(gltf);
                  hideLoading();
                }, function(e) {
                  console.error('Base64 Parse Error:', e);
                  hideLoading();
                });
              } catch(e) {
                console.error('Base64 Buffer Error:', e);
                hideLoading();
              }
            } else {
              gltfLoader.load(dataOrUrl, function(gltf) {
                onSuccess(gltf);
                hideLoading();
              }, undefined, function(e) {
                console.error('URL Load Error:', e);
                hideLoading();
              });
            }
          }

          window.updateCharacter = function(filename) {
            if (!filename) {
              if (window.characterModel) {
                scene.remove(window.characterModel);
                window.characterModel = null;
              }
              if (window.headwearModel) window.headwearModel.visible = false;
              if (window.accessoryModel) window.accessoryModel.visible = false;
              if (window.topsModel) window.topsModel.visible = false;
              if (window.pantsModel) window.pantsModel.visible = false;
              if (window.shoesModel) window.shoesModel.visible = false;
              if (window.backpackModel) window.backpackModel.visible = false;
              return;
            }
            
            loadModelIntoScene(filename, function(gltf) {
              const newChar = gltf.scene;
              newChar.traverse(function(child) {
                processMaterial(child);
                if (child.isMesh && child.material) {
                  child.material.color.setHex(0x666666);
                }
              });

              const box = new THREE.Box3().setFromObject(newChar);
              const size = box.getSize(new THREE.Vector3());
              const center = box.getCenter(new THREE.Vector3());

              newChar.position.set(0, 0, 0);
              newChar.scale.set(1, 1, 1);
              newChar.rotation.y = currentRotationY;
              
              if (window.characterModel) {
                scene.remove(window.characterModel);
              }
              window.characterModel = newChar;
              scene.add(window.characterModel);
              
              if (window.headwearModel) {
                 window.headwearModel.visible = true;
                 window.headwearModel.rotation.y = window.characterModel.rotation.y;
              }
              if (window.accessoryModel) {
                 window.accessoryModel.visible = true;
                 window.accessoryModel.rotation.y = window.characterModel.rotation.y;
              }
              if (window.topsModel) {
                 window.topsModel.visible = true;
                 window.topsModel.rotation.y = window.characterModel.rotation.y;
              }
              if (window.pantsModel) {
                 window.pantsModel.visible = true;
                 window.pantsModel.rotation.y = window.characterModel.rotation.y;
              }
              if (window.shoesModel) {
                 window.shoesModel.visible = true;
                 window.shoesModel.rotation.y = window.characterModel.rotation.y;
              }
              if (window.backpackModel) {
                 window.backpackModel.visible = true;
                 window.backpackModel.rotation.y = window.characterModel.rotation.y;
              }
              
              controls.target.set(0, size.y * 0.52, 0);
              camera.position.set(0, size.y * 0.52, Math.max(size.x, size.y, size.z) * 1.55);
              controls.update();
            });
          };

          window.updateHeadwear = function(filename) {
            if (!filename) {
              if (window.headwearModel) {
                scene.remove(window.headwearModel);
                window.headwearModel = null;
              }
              return;
            }
            
            loadModelIntoScene(filename, function(gltf) {
              const newSkin = gltf.scene;
              newSkin.traverse(processMaterial);
              newSkin.position.set(0, 0, 0);
              newSkin.scale.set(1, 1, 1);
              
              if (window.headwearModel) scene.remove(window.headwearModel);
              window.headwearModel = newSkin;
              
              if (window.characterModel) {
                window.headwearModel.rotation.y = window.characterModel.rotation.y;
                window.headwearModel.visible = true;
              } else {
                window.headwearModel.visible = false;
              }
              scene.add(window.headwearModel);
            });
          };

          window.updateAccessory = function(filename) {
            if (!filename) {
              if (window.accessoryModel) {
                scene.remove(window.accessoryModel);
                window.accessoryModel = null;
              }
              return;
            }
            
            loadModelIntoScene(filename, function(gltf) {
              const newSkin = gltf.scene;
              newSkin.traverse(processMaterial);
              newSkin.position.set(0, 0, 0);
              newSkin.scale.set(1, 1, 1);
              
              if (window.accessoryModel) scene.remove(window.accessoryModel);
              window.accessoryModel = newSkin;
              
              if (window.characterModel) {
                window.accessoryModel.rotation.y = window.characterModel.rotation.y;
                window.accessoryModel.visible = true;
              } else {
                window.accessoryModel.visible = false;
              }
              scene.add(window.accessoryModel);
            });
          };

          window.updateTops = function(filename) {
            if (!filename) {
              if (window.topsModel) {
                scene.remove(window.topsModel);
                window.topsModel = null;
              }
              return;
            }
            
            loadModelIntoScene(filename, function(gltf) {
              const newSkin = gltf.scene;
              newSkin.traverse(processMaterial);
              newSkin.position.set(0, 0, 0);
              newSkin.scale.set(1, 1, 1);
              
              if (window.topsModel) scene.remove(window.topsModel);
              window.topsModel = newSkin;
              
              if (window.characterModel) {
                window.topsModel.rotation.y = window.characterModel.rotation.y;
                window.topsModel.visible = true;
              } else {
                window.topsModel.visible = false;
              }
              scene.add(window.topsModel);
            });
          };

          window.updatePants = function(filename) {
            if (!filename) {
              if (window.pantsModel) {
                scene.remove(window.pantsModel);
                window.pantsModel = null;
              }
              return;
            }
            
            loadModelIntoScene(filename, function(gltf) {
              const newSkin = gltf.scene;
              newSkin.traverse(processMaterial);
              newSkin.position.set(0, 0, 0);
              newSkin.scale.set(1, 1, 1);
              
              if (window.pantsModel) scene.remove(window.pantsModel);
              window.pantsModel = newSkin;
              
              if (window.characterModel) {
                window.pantsModel.rotation.y = window.characterModel.rotation.y;
                window.pantsModel.visible = true;
              } else {
                window.pantsModel.visible = false;
              }
              scene.add(window.pantsModel);
            });
          };

          window.updateShoes = function(filename) {
            if (!filename) {
              if (window.shoesModel) {
                scene.remove(window.shoesModel);
                window.shoesModel = null;
              }
              return;
            }
            
            loadModelIntoScene(filename, function(gltf) {
              const newSkin = gltf.scene;
              newSkin.traverse(processMaterial);
              newSkin.position.set(0, 0, 0);
              newSkin.scale.set(1, 1, 1);
              
              if (window.shoesModel) scene.remove(window.shoesModel);
              window.shoesModel = newSkin;
              
              if (window.characterModel) {
                window.shoesModel.rotation.y = window.characterModel.rotation.y;
                window.shoesModel.visible = true;
              } else {
                window.shoesModel.visible = false;
              }
              scene.add(window.shoesModel);
            });
          };

          window.updateBackpack = function(filename) {
            if (!filename) {
              if (window.backpackModel) {
                scene.remove(window.backpackModel);
                window.backpackModel = null;
              }
              return;
            }
            
            loadModelIntoScene(filename, function(gltf) {
              const newSkin = gltf.scene;
              newSkin.traverse(processMaterial);
              newSkin.position.set(0, 0, 0);
              newSkin.scale.set(1, 1, 1);
              
              if (window.backpackModel) scene.remove(window.backpackModel);
              window.backpackModel = newSkin;
              
              if (window.characterModel) {
                window.backpackModel.rotation.y = window.characterModel.rotation.y;
                window.backpackModel.visible = true;
              } else {
                window.backpackModel.visible = false;
              }
              scene.add(window.backpackModel);
            });
          };

          // Animation Loop
          function animate() {
            requestAnimationFrame(animate);
            controls.update();

            if (Math.abs(currentRotationY - targetRotationY) > 0.01) {
              currentRotationY += (targetRotationY - currentRotationY) * 0.1;
              if (window.characterModel) window.characterModel.rotation.y = currentRotationY;
              if (window.headwearModel) window.headwearModel.rotation.y = currentRotationY;
              if (window.accessoryModel) window.accessoryModel.rotation.y = currentRotationY;
              if (window.topsModel) window.topsModel.rotation.y = currentRotationY;
              if (window.pantsModel) window.pantsModel.rotation.y = currentRotationY;
              if (window.shoesModel) window.shoesModel.rotation.y = currentRotationY;
              if (window.backpackModel) window.backpackModel.rotation.y = currentRotationY;
            } else if (currentRotationY !== targetRotationY) {
              currentRotationY = targetRotationY;
              if (window.characterModel) window.characterModel.rotation.y = currentRotationY;
              if (window.headwearModel) window.headwearModel.rotation.y = currentRotationY;
              if (window.accessoryModel) window.accessoryModel.rotation.y = currentRotationY;
              if (window.topsModel) window.topsModel.rotation.y = currentRotationY;
              if (window.pantsModel) window.pantsModel.rotation.y = currentRotationY;
              if (window.shoesModel) window.shoesModel.rotation.y = currentRotationY;
              if (window.backpackModel) window.backpackModel.rotation.y = currentRotationY;
            }

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
  `;

  // Provide a base URL to FileSystem.cacheDirectory so ThreeJS can load the filenames directly
  // Note: On Android we must include a trailing slash, FileSystem.cacheDirectory already ends with one usually.
  const baseUrl = FileSystem.cacheDirectory;

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent, baseUrl: baseUrl }}
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
  }
});
