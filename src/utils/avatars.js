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
