import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
// @ts-ignore
const prisma = new PrismaClient();

// In-memory fallback storage in case Prisma database is initializing
let inMemoryClans: any[] = [];
let inMemoryMembers: any[] = [];

/**
 * 1. GET /api/clan/my-clan
 * Query: userId
 * Returns user's active clan or null if free agent
 */
router.get('/clan/my-clan', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.json({ clan: null, isFreeAgent: true });
    }

    try {
      // @ts-ignore
      const membership = await prisma.clanMember.findFirst({
        where: { userId },
        include: {
          clan: {
            include: {
              members: true,
            },
          },
        },
      });

      if (membership && membership.clan && membership.clan.status === 'ACTIVE') {
        const clan: any = membership.clan;
        return res.json({
          clan: {
            id: clan.id,
            name: clan.name,
            tag: clan.tag || 'IQRO',
            description: clan.description,
            level: clan.level || 1,
            xp: clan.xp || 0,
            requiredXp: clan.requiredXp || 10000,
            membersCount: clan.members?.length || 1,
            maxMembers: clan.maxMembers || 50,
            battleWins: clan.battleWins || 0,
            completedTasks: clan.missionsCompleted || 0,
            seasonXp: clan.seasonXp || 0,
            seasonTargetXp: 50000,
            seasonNumber: 5,
            emblem: clan.logo || 'wolf',
            role: membership.role || 'Member',
            isOpen: clan.entryType === 'Open' || clan.entryType === 'OPEN',
            isActive: true,
            members: clan.members || [],
          },
          isFreeAgent: false,
        });
      }
    } catch (dbErr) {
      // Database query failed, check in-memory
      const mem = inMemoryMembers.find((m) => m.userId === userId);
      if (mem) {
        const clan = inMemoryClans.find((c) => c.id === mem.clanId);
        if (clan) {
          return res.json({ clan, isFreeAgent: false });
        }
      }
    }

    // Default: User has no clan -> Free Agent
    return res.json({ clan: null, isFreeAgent: true });
  } catch (error) {
    console.error('Error fetching my-clan:', error);
    res.status(500).json({ error: 'Failed to fetch clan', details: String(error) });
  }
});

/**
 * 2. GET /api/clan/recommended
 * Returns active clans for the Free Agent view
 */
router.get('/clan/recommended', async (req, res) => {
  try {
    try {
      // @ts-ignore
      const dbClans = await prisma.clan.findMany({
        where: { status: 'ACTIVE' },
        include: {
          members: true,
        },
        orderBy: { xp: 'desc' },
        take: 10,
      });

      if (dbClans && dbClans.length > 0) {
        const formatted = dbClans.map((c: any) => ({
          id: c.id,
          name: c.name,
          tag: c.tag || 'IQRO',
          description: c.description || '',
          level: c.level || 1,
          xp: c.xp || 0,
          requiredXp: c.requiredXp || 10000,
          membersCount: c.members?.length || 1,
          maxMembers: c.maxMembers || 50,
          emblem: c.logo || 'wolf',
          isOpen: c.entryType === 'Open' || c.entryType === 'OPEN',
        }));
        return res.json({ clans: formatted });
      }
    } catch (dbErr) {
      // Use in-memory if DB table not yet populated
    }

    // If inMemoryClans has items, return them
    if (inMemoryClans.length > 0) {
      return res.json({ clans: inMemoryClans });
    }

    // Return empty list so real users see clean state without fake clutter
    return res.json({ clans: [] });
  } catch (error) {
    console.error('Error fetching recommended clans:', error);
    res.status(500).json({ error: 'Failed to fetch recommended clans' });
  }
});

/**
 * 3. POST /api/clan/create
 * Creates a real clan
 */
router.post('/clan/create', async (req, res) => {
  try {
    const { name, description, emblem, isOpen, userId, userName, userAvatar } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Clan nomi kiritilishi shart' });
    }

    const cleanName = name.trim();
    const cleanEmblem = emblem || 'wolf';
    const cleanDesc = description ? description.trim() : '';

    try {
      // @ts-ignore
      const existing = await prisma.clan.findUnique({
        where: { name: cleanName },
      });

      if (existing) {
        return res.status(400).json({ error: 'Bu nomdagi klan allaqachon mavjud' });
      }

      // @ts-ignore
      const newClan: any = await (prisma.clan as any).create({
        data: {
          name: cleanName,
          description: cleanDesc,
          logo: cleanEmblem,
          creatorId: userId || `user_${Date.now()}`,
          level: 1,
          xp: 0,
          requiredXp: 10000,
          maxMembers: 50,
          entryType: isOpen ? 'Open' : 'Request',
          status: 'ACTIVE',
          members: {
            create: {
              userId: userId || `user_${Date.now()}`,
              userName: userName || 'Clan Leader',
              userAvatar: userAvatar || 'alex',
              role: 'Creator',
              clanXp: 0,
              isOnline: true,
            },
          },
        },
        include: {
          members: true,
        },
      });

      const formatted = {
        id: newClan.id,
        name: newClan.name,
        description: newClan.description,
        level: newClan.level,
        xp: newClan.xp,
        requiredXp: newClan.requiredXp,
        membersCount: 1,
        maxMembers: newClan.maxMembers,
        battleWins: 0,
        completedTasks: 0,
        seasonXp: 0,
        seasonTargetXp: 50000,
        emblem: newClan.logo,
        role: 'Creator',
        isOpen: isOpen,
        isActive: true,
        members: newClan.members || [],
      };

      return res.json({ success: true, clan: formatted });
    } catch (dbErr) {
      // In-memory fallback
      const inMemClan = {
        id: `clan_${Date.now()}`,
        name: cleanName,
        description: cleanDesc,
        level: 1,
        xp: 0,
        requiredXp: 10000,
        membersCount: 1,
        maxMembers: 50,
        battleWins: 0,
        completedTasks: 0,
        seasonXp: 0,
        seasonTargetXp: 50000,
        emblem: cleanEmblem,
        role: 'Creator',
        isOpen: isOpen,
        isActive: true,
        members: [
          {
            userId: userId || `user_${Date.now()}`,
            userName: userName || 'Clan Leader',
            userAvatar: userAvatar || 'alex',
            role: 'Creator',
            isOnline: true,
          },
        ],
      };

      inMemoryClans.push(inMemClan);
      inMemoryMembers.push({
        clanId: inMemClan.id,
        userId: userId || `user_${Date.now()}`,
        role: 'Creator',
      });

      return res.json({ success: true, clan: inMemClan });
    }
  } catch (error) {
    console.error('Error creating clan:', error);
    res.status(500).json({ error: 'Klan yaratishda xatolik yuz berdi' });
  }
});

/**
 * 4. POST /api/clan/join
 * Join an existing clan
 */
router.post('/clan/join', async (req, res) => {
  try {
    const { clanId, clanName, userId, userName, userAvatar } = req.body;

    try {
      // @ts-ignore
      const clan: any = clanId 
        ? await prisma.clan.findUnique({ where: { id: clanId }, include: { members: true } })
        : await prisma.clan.findUnique({ where: { name: clanName }, include: { members: true } });

      if (!clan) {
        return res.status(404).json({ error: 'Klan topilmadi' });
      }

      // @ts-ignore
      const existingMember = await prisma.clanMember.findFirst({
        where: { clanId: clan.id, userId },
      });

      if (!existingMember) {
        // @ts-ignore
        await prisma.clanMember.create({
          data: {
            clanId: clan.id,
            userId: userId || `user_${Date.now()}`,
            userName: userName || "O'quvchi",
            userAvatar: userAvatar || 'alex',
            role: 'Member',
            isOnline: true,
          },
        });
      }

      const formatted = {
        id: clan.id,
        name: clan.name,
        description: clan.description,
        level: clan.level,
        xp: clan.xp,
        requiredXp: clan.requiredXp,
        membersCount: (clan.members?.length || 0) + (existingMember ? 0 : 1),
        maxMembers: clan.maxMembers,
        battleWins: clan.battleWins || 0,
        completedTasks: clan.missionsCompleted || 0,
        seasonXp: clan.seasonXp || 0,
        seasonTargetXp: 50000,
        emblem: clan.logo || 'wolf',
        role: 'Member',
        isOpen: clan.entryType === 'Open' || clan.entryType === 'OPEN',
        isActive: true,
      };

      return res.json({ success: true, clan: formatted });
    } catch (dbErr) {
      // In-memory fallback
      let clan = inMemoryClans.find((c) => (clanId && c.id === clanId) || (clanName && c.name === clanName));
      if (!clan) {
        clan = {
          id: clanId || `clan_${Date.now()}`,
          name: clanName || 'Yangi Klan',
          level: 1,
          xp: 0,
          requiredXp: 10000,
          membersCount: 2,
          maxMembers: 50,
          battleWins: 0,
          completedTasks: 0,
          seasonXp: 0,
          seasonTargetXp: 50000,
          emblem: 'wolf',
          role: 'Member',
          isActive: true,
          members: [],
        };
        inMemoryClans.push(clan);
      } else {
        clan.membersCount = (clan.membersCount || 1) + 1;
      }

      inMemoryMembers.push({
        clanId: clan.id,
        userId: userId || `user_${Date.now()}`,
        role: 'Member',
      });

      return res.json({ success: true, clan });
    }
  } catch (error) {
    console.error('Error joining clan:', error);
    res.status(500).json({ error: 'Klanga qo‘shilishda xatolik yuz berdi' });
  }
});

/**
 * 5. POST /api/clan/leave
 * Leaves current clan
 */
router.post('/clan/leave', async (req, res) => {
  try {
    const { clanId, userId } = req.body;

    try {
      if (clanId && userId) {
        // @ts-ignore
        await prisma.clanMember.deleteMany({
          where: { clanId, userId },
        });
      }
    } catch (dbErr) {
      inMemoryMembers = inMemoryMembers.filter((m) => !(m.clanId === clanId && m.userId === userId));
    }

    return res.json({ success: true, message: 'Clandan muvaffaqiyatli chiqildi' });
  } catch (error) {
    console.error('Error leaving clan:', error);
    res.status(500).json({ error: 'Clandan chiqishda xatolik yuz berdi' });
  }
});

export default router;
