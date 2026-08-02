export const RANKS = [
  { name: 'BRONZE III', xp: 0, color: '#10B981', emoji: '🟢' },
  { name: 'BRONZE II', xp: 500, color: '#10B981', emoji: '🟢' },
  { name: 'BRONZE I', xp: 1000, color: '#10B981', emoji: '🟢' },
  { name: 'SILVER III', xp: 2000, color: '#3B82F6', emoji: '🔵' },
  { name: 'SILVER II', xp: 3500, color: '#3B82F6', emoji: '🔵' },
  { name: 'SILVER I', xp: 5000, color: '#3B82F6', emoji: '🔵' },
  { name: 'GOLD III', xp: 7000, color: '#A855F7', emoji: '🟣' },
  { name: 'GOLD II', xp: 9500, color: '#A855F7', emoji: '🟣' },
  { name: 'GOLD I', xp: 12000, color: '#A855F7', emoji: '🟣' },
  { name: 'PLATINUM III', xp: 15000, color: '#EF4444', emoji: '🔴' },
  { name: 'PLATINUM II', xp: 19000, color: '#EF4444', emoji: '🔴' },
  { name: 'PLATINUM I', xp: 23000, color: '#EF4444', emoji: '🔴' },
  { name: 'DIAMOND III', xp: 28000, color: '#F59E0B', emoji: '🟡' },
  { name: 'DIAMOND II', xp: 34000, color: '#F59E0B', emoji: '🟡' },
  { name: 'DIAMOND I', xp: 40000, color: '#F59E0B', emoji: '🟡' }
];

export const calculateUserRank = (xp = 0) => {
  let currentRank = RANKS[0];
  let nextRank = RANKS[1];
  let rankIndex = 0;

  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].xp) {
      currentRank = RANKS[i];
      rankIndex = i;
      nextRank = i + 1 < RANKS.length ? RANKS[i + 1] : RANKS[i];
    } else {
      break;
    }
  }

  const isMax = rankIndex === RANKS.length - 1;
  const xpNeededForNext = isMax ? 0 : nextRank.xp - currentRank.xp;
  const xpProgressInCurrent = isMax ? 0 : xp - currentRank.xp;
  const progressPercent = isMax ? 100 : Math.min(100, Math.max(0, (xpProgressInCurrent / xpNeededForNext) * 100));

  // Determine number of stars based on division.
  // Assuming name format is "RANK DIVISION" (e.g., "GOLD III")
  let stars = 1; // Default
  if (currentRank.name.endsWith(' III')) stars = 1;
  else if (currentRank.name.endsWith(' II')) stars = 2;
  else if (currentRank.name.endsWith(' I')) stars = 3;

  return {
    ...currentRank,
    isMax,
    nextRankName: nextRank.name,
    nextRankXP: nextRank.xp,
    xpProgressInCurrent,
    xpNeededForNext,
    progressPercent,
    xpRemaining: isMax ? 0 : nextRank.xp - xp,
    stars
  };
};
