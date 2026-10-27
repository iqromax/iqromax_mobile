import { API_URL } from '../config/api';

const SERVER_BASE = (API_URL || 'https://iqromax.net/api').replace(/\/api\/?$/, '');

/**
 * Resolves avatar string to full remote URL or null if it's a character name.
 */
export const resolveAvatarUrl = (avatar) => {
  if (!avatar || typeof avatar !== 'string') return null;
  const trimmed = avatar.trim();
  if (
    trimmed.startsWith('http://') || 
    trimmed.startsWith('https://') || 
    trimmed.startsWith('data:') ||
    trimmed.startsWith('file://') ||
    trimmed.startsWith('ph://') ||
    trimmed.startsWith('content://')
  ) {
    return trimmed;
  }
  if (trimmed.startsWith('/') || trimmed.includes('/')) {
    let cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    // Ensure all uploads paths go through /api/uploads because Nginx only proxies /api to Express
    if (cleanPath.startsWith('/uploads/')) {
      cleanPath = `/api${cleanPath}`;
    }
    return `${SERVER_BASE}${cleanPath}`;
  }
  return null;
};

/**
 * Gets an image source suitable for React Native <Image source={...} />
 * If name/avatar is a URL or /uploads/ path, returns { uri: ... }
 * If it's a known character name, returns local require() asset.
 */
export const getAvatarByName = (name) => {
  if (!name) return require('../../assets/avatar_maks.png');
  
  if (typeof name === 'string') {
    const resolved = resolveAvatarUrl(name);
    if (resolved) {
      return { uri: resolved };
    }
  }

  const lower = String(name).toLowerCase();
  if (lower.includes('alex')) return require('../../assets/avatar_alex.jpg');
  if (lower.includes('maks')) return require('../../assets/avatar_maks.png');
  if (lower.includes('david')) return require('../../assets/avatar_david.jpg');
  if (lower.includes('kevin')) return require('../../assets/avatar_kevin.png');
  if (lower.includes('lily')) return require('../../assets/avatar_lily.jpg');
  if (lower.includes('maya')) return require('../../assets/avatar_maya.jpg');
  if (lower.includes('sophia')) return require('../../assets/avatar_sophia.png');
  if (lower.includes('emma')) return require('../../assets/avatar_emma.jpg');
  return require('../../assets/avatar_maks.png');
};

/**
 * Gets user's active avatar source, prioritizing custom uploaded avatar,
 * then equipped 3D skin preview image, then fallback character.
 */
export const getUserAvatarSource = (user, selectedAvatarObj = null) => {
  // 1. Check user custom uploaded avatar or character URL
  const userAvatar = user?.avatar || user?.character;
  if (userAvatar && typeof userAvatar === 'string') {
    const resolved = resolveAvatarUrl(userAvatar);
    if (resolved) {
      return { uri: resolved };
    }
  }

  // 2. Check selected 3D skin preview image
  if (selectedAvatarObj && selectedAvatarObj.imageUrl) {
    const resolvedSkin = resolveAvatarUrl(selectedAvatarObj.imageUrl);
    if (resolvedSkin) {
      return { uri: resolvedSkin };
    }
  }

  // 3. Fallback to character name
  return getAvatarByName(user?.character || 'maks');
};

export const isSkinVisibleForGender = (itemTargetGender, userGender) => {
  const normTarget = (itemTargetGender || 'all').toLowerCase().trim();
  // 'all' / 'barchasi' is visible for both boys and girls
  if (normTarget === 'all' || normTarget === 'barchasi' || normTarget === '') {
    return true;
  }
  
  const isBoyTarget = normTarget === 'boys' || normTarget === 'boy' || normTarget === 'ogil' || normTarget === "o'g'il" || normTarget === 'male';
  const isGirlTarget = normTarget === 'girls' || normTarget === 'girl' || normTarget === 'qiz' || normTarget === 'female';

  const normUser = (userGender || 'boys').toLowerCase().trim();
  const isUserBoy = normUser === 'boys' || normUser === 'boy' || normUser === 'ogil' || normUser === "o'g'il" || normUser === 'male';
  const isUserGirl = normUser === 'girls' || normUser === 'girl' || normUser === 'qiz' || normUser === 'female';

  if (isUserBoy) {
    return isBoyTarget;
  }
  if (isUserGirl) {
    return isGirlTarget;
  }

  return true;
};
