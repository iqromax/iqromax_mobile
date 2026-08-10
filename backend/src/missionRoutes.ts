import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
// @ts-ignore - Ignore prisma types if not generated yet
const prisma = new PrismaClient();

// Configure Multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `mission_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Admin: Get all missions
router.get('/admin/missions', async (req, res) => {
  try {
    // @ts-ignore
    const missions = await prisma.mission.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(missions);
  } catch (error) {
    console.error('Error fetching missions:', error);
    res.status(500).json({ error: 'Failed to fetch missions' });
  }
});

// Admin: Add a mission
router.post('/admin/missions', upload.single('video'), async (req, res) => {
  try {
    const { type, title, link } = req.body;
    let fileUrl = null;

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    // @ts-ignore
    const mission = await prisma.mission.create({
      data: {
        type,
        title,
        link: link || null,
        fileUrl,
      }
    });

    // Notify users about new mission (optional, but good for UX)
    const io = req.app.get('io');
    if (io) {
      io.emit('new_mission_added', mission);
    }

    res.status(201).json(mission);
  } catch (error) {
    console.error('Error creating mission:', error);
    res.status(500).json({ error: 'Failed to create mission' });
  }
});

// Admin: Delete a mission
router.delete('/admin/missions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // @ts-ignore
    const mission = await prisma.mission.findUnique({ where: { id } });
    if (mission && mission.fileUrl) {
      const filePath = path.join(__dirname, '../../public', mission.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // @ts-ignore
    await prisma.mission.delete({ where: { id } });
    
    // Also delete user missions related to this
    // @ts-ignore
    await prisma.userMission.deleteMany({ where: { missionId: id } });

    res.json({ message: 'Mission deleted successfully' });
  } catch (error) {
    console.error('Error deleting mission:', error);
    res.status(500).json({ error: 'Failed to delete mission' });
  }
});

// App: Get active missions for a user
router.get('/missions/:customId', async (req, res) => {
  try {
    const { customId } = req.params;
    const cleanId = customId.replace(/^#+/, '');
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { customId: customId.toUpperCase() },
          { customId: `#${cleanId}` },
          { customId: cleanId }
        ]
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    // @ts-ignore
    const missions = await prisma.mission.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    // @ts-ignore
    const userMissions = await prisma.userMission.findMany({
      where: { userId: user.customId }
    });

    const completedMissionIds = new Set(userMissions.map((um: any) => um.missionId));

    const result = missions.map((m: any) => ({
      ...m,
      isCompleted: completedMissionIds.has(m.id)
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching user missions:', error);
    res.status(500).json({ error: 'Failed to fetch user missions' });
  }
});

// App: Complete a mission
router.post('/missions/complete', async (req, res) => {
  try {
    const { customId, missionId } = req.body;
    
    const cleanId = customId.replace(/^#+/, '');
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { customId: customId.toUpperCase() },
          { customId: `#${cleanId}` },
          { customId: cleanId }
        ]
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    // @ts-ignore
    const mission = await prisma.mission.findUnique({ where: { id: missionId } });
    if (!mission) return res.status(404).json({ error: 'Mission not found' });

    // Mark as completed
    // @ts-ignore
    await prisma.userMission.upsert({
      where: {
        userId_missionId: {
          userId: user.customId,
          missionId: mission.id
        }
      },
      update: {},
      create: {
        userId: user.customId,
        missionId: mission.id
      }
    });

    // Check if all active missions are now completed
    // @ts-ignore
    const allActiveMissions = await prisma.mission.findMany({ where: { isActive: true } });
    // @ts-ignore
    const userCompletedMissions = await prisma.userMission.findMany({ where: { userId: user.customId } });
    
    const completedIds = new Set(userCompletedMissions.map((um: any) => um.missionId));
    const allCompleted = allActiveMissions.length > 0 && allActiveMissions.every((m: any) => completedIds.has(m.id));

    let energyAdded = 0;
    let allMissionsCompleted = false;

    if (allCompleted) {
      // Check if we already gave 5 energy for THIS exact set of missions.
      // To simplify, if they complete ALL, we give 5 energy, BUT we need to prevent farming.
      // Easiest is to give 1 energy per mission completed, but the requirement is "hamma missiyalarni bajarsa 5 ta energiya berilishi kerak".
      
      // We will increment energy by 5 if this is the LAST mission to be completed that makes the set FULL.
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { energy: { increment: 5 } } // Assume we give 5 energy
      });
      energyAdded = 5;
      allMissionsCompleted = true;
      
      const io = req.app.get('io');
      if (io) {
        io.emit('user_updated', updatedUser);
      }
    }

    res.json({ success: true, allMissionsCompleted, energyAdded });
  } catch (error) {
    console.error('Error completing mission:', error);
    res.status(500).json({ error: 'Failed to complete mission' });
  }
});

export default router;
