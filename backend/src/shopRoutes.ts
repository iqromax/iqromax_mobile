import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
// @ts-ignore
const prisma = new PrismaClient();

// Configure Multer for shop item images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../public/uploads/shop');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `shop_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Admin: Get all shop items
router.get('/admin/shop-items', async (req, res) => {
  try {
    // @ts-ignore
    const items = await prisma.shopItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching shop items:', error);
    res.status(500).json({ error: 'Failed to fetch shop items' });
  }
});

// Admin: Create shop item (Supports file upload for image)
router.post('/admin/shop-items', upload.single('image'), async (req, res) => {
  try {
    const { category, subcategory, name, description, value, price } = req.body;
    let imageUrl = req.body.imageUrl || null;

    if (req.file) {
      imageUrl = `/uploads/shop/${req.file.filename}`;
    }

    if (!category || !name || price === undefined) {
      return res.status(400).json({ error: 'Category, name and price are required' });
    }

    // @ts-ignore
    const item = await prisma.shopItem.create({
      data: {
        category,
        subcategory: subcategory || null,
        name: name.trim(),
        description: description ? description.trim() : null,
        imageUrl,
        value: value ? parseInt(value, 10) : 1,
        price: parseInt(price, 10),
      },
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('shop_item_updated', item);
    }

    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating shop item:', error);
    res.status(500).json({ error: 'Failed to create shop item' });
  }
});

// Admin: Update shop item
router.put('/admin/shop-items/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { category, subcategory, name, description, value, price, isActive } = req.body;

    // @ts-ignore
    const existing = await prisma.shopItem.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Shop item not found' });

    let imageUrl = existing.imageUrl;
    if (req.file) {
      imageUrl = `/uploads/shop/${req.file.filename}`;
    } else if (req.body.imageUrl !== undefined) {
      imageUrl = req.body.imageUrl;
    }

    // @ts-ignore
    const updated = await prisma.shopItem.update({
      where: { id },
      data: {
        category: category || existing.category,
        subcategory: subcategory !== undefined ? subcategory : existing.subcategory,
        name: name ? name.trim() : existing.name,
        description: description !== undefined ? description.trim() : existing.description,
        imageUrl,
        value: value !== undefined ? parseInt(value, 10) : existing.value,
        price: price !== undefined ? parseInt(price, 10) : existing.price,
        isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : existing.isActive,
      },
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('shop_item_updated', updated);
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating shop item:', error);
    res.status(500).json({ error: 'Failed to update shop item' });
  }
});

// Admin: Delete shop item
router.delete('/admin/shop-items/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // @ts-ignore
    const item = await prisma.shopItem.findUnique({ where: { id } });
    if (item && item.imageUrl && item.imageUrl.startsWith('/uploads/shop/')) {
      const filePath = path.join(__dirname, '../../public', item.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // @ts-ignore
    await prisma.shopItem.delete({ where: { id } });

    const io = req.app.get('io');
    if (io) {
      io.emit('shop_item_deleted', id);
    }

    res.json({ message: 'Shop item deleted successfully' });
  } catch (error) {
    console.error('Error deleting shop item:', error);
    res.status(500).json({ error: 'Failed to delete shop item' });
  }
});

// App: Get all active shop items for mobile app
router.get('/shop-items', async (req, res) => {
  try {
    // @ts-ignore
    const items = await prisma.shopItem.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching mobile shop items:', error);
    res.status(500).json({ error: 'Failed to fetch shop items' });
  }
});

export default router;
