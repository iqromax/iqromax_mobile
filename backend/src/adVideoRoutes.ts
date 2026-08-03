import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const uploadDir = path.join(__dirname, '../../public/uploads');

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'ad_video' + ext);
  }
});
const upload = multer({ storage: storage });

// GET current ad video
router.get('/ad-video', (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir);
    const videoFile = files.find(f => f.startsWith('ad_video.'));
    
    if (videoFile) {
      res.json({ url: `/uploads/${videoFile}` });
    } else {
      res.json({ url: null });
    }
  } catch (error) {
    console.error('Error fetching ad video:', error);
    res.status(500).json({ error: 'Failed to fetch ad video' });
  }
});

// POST to upload new ad video
router.post('/admin/ad-video', upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }
    
    // Delete any OTHER ad_video files that aren't the newly uploaded one
    const files = fs.readdirSync(uploadDir);
    files.forEach(file => {
      if (file.startsWith('ad_video.') && file !== req.file!.filename) {
        fs.unlinkSync(path.join(uploadDir, file));
      }
    });

    res.json({ message: 'Video uploaded successfully', url: `/uploads/${req.file.filename}` });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

// DELETE current ad video
router.delete('/admin/ad-video', (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir);
    files.forEach(file => {
      if (file.startsWith('ad_video.')) {
        fs.unlinkSync(path.join(uploadDir, file));
      }
    });
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

export default router;
