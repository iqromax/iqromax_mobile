import * as FileSystem from 'expo-file-system/legacy';
import { API_URL } from '../config/api';

export const ModelPreloader = {
  async preloadAllModels() {
    try {
      console.log('[ModelPreloader] Fetching models list from server...');
      
      const baseUrl = API_URL.replace(/\/api\/?$/, '');
      
      // Fetch shop items
      const shopRes = await fetch(`${API_URL}/shop-items`);
      const shopItems = shopRes.ok ? await shopRes.json() : [];

      // Fetch inventory skins (often contains base characters)
      const invRes = await fetch(`${API_URL}/inventory-skins`);
      const invItems = invRes.ok ? await invRes.json() : [];

      // Extract all model URLs
      const modelUrls = new Set();
      
      [...(Array.isArray(shopItems) ? shopItems : []), ...(Array.isArray(invItems) ? invItems : [])].forEach(item => {
        const url = item.modelUrl || item.glbModel || item.model;
        if (url) {
          if (url.startsWith('http')) {
            modelUrls.add(url);
          } else {
            const cleanPath = url.startsWith('/') ? url : `/${url}`;
            modelUrls.add(`${baseUrl}${cleanPath}`);
          }
        }
      });

      console.log(`[ModelPreloader] Found ${modelUrls.size} models to preload.`);

      // Pre-download all models to local cache
      const downloadPromises = Array.from(modelUrls).map(async (url) => {
        try {
          const filename = url.split('/').pop() || 'temp_model.glb';
          const safeFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
          const cachePath = FileSystem.cacheDirectory + 'cache_' + safeFilename;
          
          const fileInfo = await FileSystem.getInfoAsync(cachePath);
          if (!fileInfo.exists) {
            console.log(`[ModelPreloader] Downloading: ${url}`);
            await FileSystem.downloadAsync(url, cachePath);
          }
        } catch (err) {
          console.warn(`[ModelPreloader] Error downloading ${url}:`, err);
        }
      });

      await Promise.all(downloadPromises);
      console.log('[ModelPreloader] All models preloaded successfully.');

    } catch (error) {
      console.error('[ModelPreloader] Error preloading models:', error);
    }
  },

  // Helper to get the absolute remote URL
  getRemoteUrl(url) {
    if (!url) return null;
    let remoteUrl = url;
    if (!remoteUrl.startsWith('http')) {
      const baseUrl = API_URL.replace(/\/api\/?$/, '');
      const cleanPath = remoteUrl.startsWith('/') ? remoteUrl : `/${remoteUrl}`;
      remoteUrl = `${baseUrl}${cleanPath}`;
    }
    return remoteUrl;
  },

  // Helper to get local path for a given remote URL
  getLocalModelUri(url) {
    if (!url) return null;
    const remoteUrl = this.getRemoteUrl(url);
    const filename = remoteUrl.split('/').pop() || 'temp_model.glb';
    const safeFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    return FileSystem.cacheDirectory + 'cache_' + safeFilename;
  }
};
