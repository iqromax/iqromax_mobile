export const getAdminAvatarUrl = (character?: string, avatar?: string): string => {
  const val = (avatar || character || '').trim();
  if (!val) return '/admin-logo.png';
  if (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('data:')) {
    return val;
  }
  if (val.startsWith('/uploads') || val.startsWith('uploads/')) {
    const clean = val.startsWith('/') ? val : `/${val}`;
    return `/api${clean}`;
  }
  if (val.startsWith('/') || val.includes('/')) {
    return val.startsWith('/') ? val : `/${val}`;
  }
  return `/avatars/${val.toLowerCase()}.png`;
};
