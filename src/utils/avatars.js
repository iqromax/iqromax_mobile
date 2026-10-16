export const getAvatarByName = (name) => {
  if (!name) return require('../../assets/avatar_maks.png');
  const lower = name.toLowerCase();
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

