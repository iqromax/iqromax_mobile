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
        },
        guides: {
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
      orderBy: { createdAt: 'asc' },
      include: {
        questions: true
      }
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
// ENROLLMENT & PROGRESS ROUTES
// =======================

// Enroll a user in the teacher course
router.post('/courses/enroll', async (req, res) => {
  try {
    const { userId, name } = req.body;
    if (!userId || !name) return res.status(400).json({ error: 'userId and name required' });

    const enrollment = await prisma.courseEnrollment.upsert({
      where: { userId },
      update: { name }, // update name just in case
      create: { userId, name, progress: 0 }
    });

    const io = req.app.get('io');
    if (io) io.emit('enrollments-updated');

    res.json(enrollment);
  } catch (error) {
    console.error('Error enrolling user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update progress for a user
router.post('/courses/progress', async (req, res) => {
  try {
    const { userId, progress } = req.body;
    if (!userId || progress === undefined) return res.status(400).json({ error: 'userId and progress required' });

    const enrollment = await prisma.courseEnrollment.upsert({
      where: { userId },
      update: { progress: parseInt(progress) },
      create: { userId, name: "Unknown", progress: parseInt(progress) }
    });

    const io = req.app.get('io');
    if (io) io.emit('enrollments-updated');

    res.json(enrollment);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// =======================
// ADMIN CRUD ROUTES
// =======================

// Get enrollments (for admin panel)
router.get('/admin/courses/enrollments', async (req, res) => {
  try {
    const enrollments = await prisma.courseEnrollment.findMany();
    const graduates = await prisma.courseGraduate.findMany();

    const result: any[] = [];

    for (const enr of enrollments) {
      result.push({
        id: enr.id,
        userId: enr.userId,
        name: enr.name,
        progress: enr.progress,
        createdAt: enr.createdAt
      });
    }

    for (const grad of graduates) {
      const exists = result.find(r => r.name === grad.name);
      if (!exists) {
        result.push({
          id: grad.id,
          userId: 'N/A',
          name: grad.name,
          progress: 100,
          createdAt: grad.createdAt
        });
      } else {
        exists.progress = 100;
      }
    }

    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json(result);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a Module
router.post('/admin/courses/modules', async (req, res) => {
  try {
    const { name, order } = req.body;
    if (!name) return res.status(400).json({ error: 'Nomi kiritilishi shart' });
    
    const newModule = await prisma.courseModule.create({
      data: { name, order: parseInt(order) || 0 }
    });

    const io = req.app.get('io');
    if (io) io.emit('courses-updated');

    res.status(201).json(newModule);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a Module
router.delete('/admin/courses/modules/:id', async (req, res) => {
  try {
    await prisma.courseModule.delete({ where: { id: req.params.id } });
    
    const io = req.app.get('io');
    if (io) io.emit('courses-updated');

    res.json({ message: 'Modul o\'chirildi' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a Module
router.put('/admin/courses/modules/:id', async (req, res) => {
  try {
    const { name, order } = req.body;
    if (!name) return res.status(400).json({ error: 'Nomi kiritilishi shart' });
    
    const updatedModule = await prisma.courseModule.update({
      where: { id: req.params.id },
      data: { name, order: parseInt(order) || 0 }
    });

    const io = req.app.get('io');
    if (io) io.emit('courses-updated');

    res.json(updatedModule);
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
    const { moduleId, name, description, duration, order, videoUrl } = req.body;
    if (!moduleId || !name) return res.status(400).json({ error: 'Modul va nom kiritilishi shart' });

    // Extract paths if files exist
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
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

    const io = req.app.get('io');
    if (io) io.emit('courses-updated');

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

    const io = req.app.get('io');
    if (io) io.emit('courses-updated');

    res.json({ message: 'Video o\'chirildi' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a Video
router.put(
  '/admin/courses/videos/:id', 
  upload.fields([{ name: 'videoFile', maxCount: 1 }, { name: 'pdfFile', maxCount: 1 }]), 
  async (req, res) => {
  try {
    const { moduleId, name, description, duration, order, videoUrl } = req.body;
    if (!moduleId || !name) return res.status(400).json({ error: 'Modul va nom kiritilishi shart' });

    // Extract paths if files exist
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    let pdfUrl = undefined;
    if (files && files['pdfFile'] && files['pdfFile'].length > 0) {
      pdfUrl = `/uploads/courses/${files['pdfFile'][0].filename}`;
    }

    const updatedVideo = await prisma.courseVideo.update({
      where: { id: req.params.id },
      data: {
        moduleId,
        name,
        description,
        duration,
        order: parseInt(order) || 0,
        videoUrl,
        ...(pdfUrl !== undefined && { pdfUrl })
      }
    });

    const io = req.app.get('io');
    if (io) io.emit('courses-updated');

    res.json(updatedVideo);
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a Test with Questions and Options
router.post('/admin/courses/tests', async (req, res) => {
  try {
    const { moduleId, title, duration, order, questions, testType, practicalOp, practicalDigits, practicalCount } = req.body;
    
    if (!moduleId || !title) {
      return res.status(400).json({ error: 'Noto\'g\'ri ma\'lumot' });
    }

    const qArray = Array.isArray(questions) ? questions : [];

    // Create the test, its questions, and their options in a single nested write
    const newTest = await prisma.courseTest.create({
      data: {
        moduleId,
        title,
        duration,
        order: parseInt(order) || 0,
        testType: testType || 'theory',
        practicalOp,
        practicalDigits,
        practicalCount: practicalCount ? parseInt(practicalCount) : null,
        questions: testType === 'practical' ? undefined : {
          create: qArray.map((q: any) => ({
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

    const io = req.app.get('io');
    if (io) io.emit('courses-updated');

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
    
    const io = req.app.get('io');
    if (io) io.emit('courses-updated');

    res.json({ message: 'Test o\'chirildi' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a Test with Questions and Options
router.put('/admin/courses/tests/:id', async (req, res) => {
  try {
    const { moduleId, title, duration, order, questions, testType, practicalOp, practicalDigits, practicalCount } = req.body;
    
    if (!moduleId || !title) {
      return res.status(400).json({ error: 'Noto\'g\'ri ma\'lumot' });
    }

    const qArray = Array.isArray(questions) ? questions : [];

    // First delete all existing questions to recreate them cleanly
    await prisma.courseTestQuestion.deleteMany({
      where: { testId: req.params.id }
    });

    const updatedTest = await prisma.courseTest.update({
      where: { id: req.params.id },
      data: {
        moduleId,
        title,
        duration,
        order: parseInt(order) || 0,
        testType: testType || 'theory',
        practicalOp,
        practicalDigits,
        practicalCount: practicalCount ? parseInt(practicalCount) : null,
        questions: testType === 'practical' ? undefined : {
          create: qArray.map((q: any) => ({
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

    const io = req.app.get('io');
    if (io) io.emit('courses-updated');

    res.json(updatedTest);
  } catch (error) {
    console.error('Error updating test:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// =======================
// GUIDES
// =======================

router.post('/admin/courses/guides', async (req, res) => {
  try {
    const { moduleId, title, content, order } = req.body;
    const newGuide = await prisma.courseGuide.create({
      data: {
        moduleId,
        title,
        content,
        order: parseInt(order) || 0
      }
    });
    
    const io = req.app.get('io');
    if (io) io.emit('courses-updated');

    res.json(newGuide);
  } catch (error) {
    console.error('Error creating guide:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/admin/courses/guides/:id', async (req, res) => {
  try {
    const { moduleId, title, content, order } = req.body;
    const updatedGuide = await prisma.courseGuide.update({
      where: { id: req.params.id },
      data: {
        moduleId,
        title,
        content,
        order: parseInt(order) || 0
      }
    });

    const io = req.app.get('io');
    if (io) io.emit('courses-updated');

    res.json(updatedGuide);
  } catch (error) {
    console.error('Error updating guide:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/admin/courses/guides/:id', async (req, res) => {
  try {
    await prisma.courseGuide.delete({
      where: { id: req.params.id }
    });

    const io = req.app.get('io');
    if (io) io.emit('courses-updated');

    res.json({ message: 'Guide deleted' });
  } catch (error) {
    console.error('Error deleting guide:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// =======================
// EXAM ROUTES
// =======================

router.post('/admin/courses/exams', async (req, res) => {
  try {
    const { title, duration, practicalOp, practicalDigits, practicalCount, questions } = req.body;
    
    // Create the exam
    const newExam = await prisma.courseExam.create({
      data: {
        title,
        duration,
        practicalOp,
        practicalDigits,
        practicalCount: parseInt(practicalCount) || 7,
        questions: {
          create: questions?.map((q: any) => ({
            question: q.question,
            options: q.options,
            answer: q.answer
          })) || []
        }
      },
      include: {
        questions: true
      }
    });

    const io = req.app.get('io');
    if (io) io.emit('courses-updated');

    res.json(newExam);
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/admin/courses/exams/:id', async (req, res) => {
  try {
    const { title, duration, practicalOp, practicalDigits, practicalCount, questions } = req.body;
    
    // Update the exam basic fields
    await prisma.courseExam.update({
      where: { id: req.params.id },
      data: {
        title,
        duration,
        practicalOp,
        practicalDigits,
        practicalCount: parseInt(practicalCount) || 7
      }
    });

    // Handle questions update: delete old ones and create new ones (simplest approach for nested array)
    if (questions) {
      await prisma.courseExamQuestion.deleteMany({
        where: { examId: req.params.id }
      });
      if (questions.length > 0) {
        await prisma.courseExamQuestion.createMany({
          data: questions.map((q: any) => ({
            examId: req.params.id,
            question: q.question,
            options: q.options,
            answer: q.answer
          }))
        });
      }
    }

    const updatedExam = await prisma.courseExam.findUnique({
      where: { id: req.params.id },
      include: { questions: true }
    });

    const io = req.app.get('io');
    if (io) io.emit('courses-updated');

    res.json(updatedExam);
  } catch (error) {
    console.error('Error updating exam:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/admin/courses/exams/:id', async (req, res) => {
  try {
    await prisma.courseExam.delete({
      where: { id: req.params.id }
    });

    const io = req.app.get('io');
    if (io) io.emit('courses-updated');

    res.json({ message: 'Exam deleted' });
  } catch (error) {
    console.error('Error deleting exam:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
