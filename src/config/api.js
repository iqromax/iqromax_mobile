import { Platform } from 'react-native';

// Server manzili (HTTPS orqali ulangan)
export const API_URL = 'https://iqromax.net/api';
export const SOCKET_URL = 'https://iqromax.net';

export const getShopImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  // Local backend test va Production backend domeni
  const base = SOCKET_URL.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
};
