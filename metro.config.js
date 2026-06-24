const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push(
  // Adds support for `.glb` files for 3D models
  'glb',
  'gltf',
  'mtl',
  'obj',
  'png',
  'jpg'
);

module.exports = config;
