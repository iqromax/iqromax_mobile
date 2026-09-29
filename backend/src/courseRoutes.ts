import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const router = express.Router();

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../public/uploads/courses');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB limit
});

// =======================
// READ-ONLY ROUTES (User Frontend)
// =======================

// Get all modules with their videos and tests
router.get('/courses/modules', async (req, res) => {
  try {
    const modules = await prisma.courseModule.findMany({
      orderBy: { order: 'asc' },
      include: {
        videos: {
          orderBy: { order: 'asc' }
        },
        tests: {
          orderBy: { order: 'asc' }
        }
      }
    });
    res.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a specific test with questions and options
router.get('/courses/tests/:testId', async (req, res) => {
  try {
    const test = await prisma.courseTest.findUnique({
      where: { id: req.params.testId },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    });
    if (!test) return res.status(404).json({ error: 'Test topilmadi' });
    res.json(test);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all exams
router.get('/courses/exams', async (req, res) => {
  try {
    const exams = await prisma.courseExam.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get graduates
router.get('/courses/graduates', async (req, res) => {
  try {
    const grads = await prisma.courseGraduate.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(grads);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// =======================
// ADMIN CRUD ROUTES
// =======================

// Add a Module
router.post('/admin/courses/modules', async (req, res) => {
  try {
    const { name, order } = req.body;
    if (!name) return res.status(400).json({ error: 'Nomi kiritilishi shart' });
    
    const newModule = await prisma.courseModule.create({
      data: { name, order: parseInt(order) || 0 }
    });
    res.status(201).json(newModule);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a Module
router.delete('/admin/courses/modules/:id', async (req, res) => {
  try {
    await prisma.courseModule.delete({ where: { id: req.params.id } });
    res.json({ message: 'Modul o\'chirildi' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a Video (Multipart: fields + files)
router.post(
  '/admin/courses/videos', 
  upload.fields([{ name: 'videoFile', maxCount: 1 }, { name: 'pdfFile', maxCount: 1 }]), 
  async (req, res) => {
  try {
    const { moduleId, name, description, duration, order } = req.body;
    if (!moduleId || !name) return res.status(400).json({ error: 'Modul va nom kiritilishi shart' });

    // Extract paths if files exist
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    let videoUrl = null;
    if (files && files['videoFile'] && files['videoFile'].length > 0) {
      videoUrl = `/uploads/courses/${files['videoFile'][0].filename}`;
    }

    let pdfUrl = null;
    if (files && files['pdfFile'] && files['pdfFile'].length > 0) {
      pdfUrl = `/uploads/courses/${files['pdfFile'][0].filename}`;
    }

    const newVideo = await prisma.courseVideo.create({
      data: {
        moduleId,
        name,
        description,
        duration,
        order: parseInt(order) || 0,
        videoUrl,
        pdfUrl
      }
    });

    res.status(201).json(newVideo);
  } catch (error) {
    console.error('Error adding video:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a Video
router.delete('/admin/courses/videos/:id', async (req, res) => {
  try {
    await prisma.courseVideo.delete({ where: { id: req.params.id } });
    res.json({ message: 'Video o\'chirildi' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a Test with Questions and Options
router.post('/admin/courses/tests', async (req, res) => {
  try {
    const { moduleId, title, duration, order, questions } = req.body;
    
    if (!moduleId || !title || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Noto\'g\'ri ma\'lumot' });
    }

    // Create the test, its questions, and their options in a single nested write
    const newTest = await prisma.courseTest.create({
      data: {
        moduleId,
        title,
        duration,
        order: parseInt(order) || 0,
        questions: {
          create: questions.map((q: any) => ({
            text: q.text,
            options: {
              create: q.options.map((opt: any) => ({
                text: opt.text,
                isCorrect: Boolean(opt.isCorrect)
              }))
            }
          }))
        }
      },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    });

    res.status(201).json(newTest);
  } catch (error) {
    console.error('Error adding test:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a Test
router.delete('/admin/courses/tests/:id', async (req, res) => {
  try {
    await prisma.courseTest.delete({ where: { id: req.params.id } });
    res.json({ message: 'Test o\'chirildi' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
