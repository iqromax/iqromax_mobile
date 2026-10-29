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
    trimmed.startsWith('file:/') ||
    trimmed.startsWith('ph://') ||
    trimmed.startsWith('content://') ||
    trimmed.startsWith('assets-library://')
  ) {
    return trimmed;
  }
  // Local filesystem path on device (e.g. /data/user/0/... or /storage/emulated/0/...)
  if (trimmed.startsWith('/data/') || trimmed.startsWith('/storage/') || trimmed.startsWith('/var/mobile/')) {
    return `file://${trimmed}`;
  }
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/') || trimmed.startsWith('/api/uploads/') || trimmed.startsWith('api/uploads/')) {
    let cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    if (cleanPath.startsWith('/uploads/')) {
      cleanPath = `/api${cleanPath}`;
    }
    return `${SERVER_BASE}${cleanPath}`;
  }
  if (trimmed.startsWith('/') && !trimmed.startsWith('/data/') && !trimmed.startsWith('/storage/')) {
    let cleanPath = trimmed;
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
  if (typeof name === 'number') return name;
  if (typeof name === 'object' && name.uri) return name;
  
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
 * Character avatar is ONLY shown if user has NOT uploaded an avatar from gallery.
 */
export const getUserAvatarSource = (user, selectedAvatarObj = null) => {
  // 1. Check user custom uploaded avatar from gallery
  const userAvatar = user?.avatar;
  if (userAvatar) {
    if (typeof userAvatar === 'number') return userAvatar;
    if (typeof userAvatar === 'object' && userAvatar.uri) return userAvatar;
    if (typeof userAvatar === 'string') {
      const resolved = resolveAvatarUrl(userAvatar);
      if (resolved) {
        return { uri: resolved };
      }
    }
  }

  // 1b. Backwards compatibility: check if character field holds an uploaded image URL
  if (user?.character && typeof user.character === 'string') {
    const resolvedChar = resolveAvatarUrl(user.character);
    if (resolvedChar) {
      return { uri: resolvedChar };
    }
  }

  // 2. Check selected 3D skin preview image
  if (selectedAvatarObj && selectedAvatarObj.imageUrl) {
    const resolvedSkin = resolveAvatarUrl(selectedAvatarObj.imageUrl);
    if (resolvedSkin) {
      return { uri: resolvedSkin };
    }
  }

  // 3. Fallback to character name (maks, alex, david, etc.) for users without gallery avatar
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
