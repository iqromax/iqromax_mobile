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

// Storage setup for skin preview image and .glb 3D model
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../public/uploads/skins');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const prefix = file.fieldname === 'glbModel' ? 'model' : 'img';
    const ext = path.extname(file.originalname) || (file.fieldname === 'glbModel' ? '.glb' : '.png');
    cb(null, `skin_${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`);
  },
});

const upload = multer({ storage });

const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'glbModel', maxCount: 1 }
]);

// Admin: Get all inventory skins
router.get('/admin/inventory-skins', async (req, res) => {
  try {
    // @ts-ignore
    if (prisma.inventorySkin) {
      // @ts-ignore
      const skins = await prisma.inventorySkin.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.json(skins);
    }
    return res.json([]);
  } catch (error) {
    console.error('Error fetching inventory skins:', error);
    res.status(500).json({ error: 'Failed to fetch inventory skins' });
  }
});

// Admin: Create inventory skin
router.post('/admin/inventory-skins', uploadFields, async (req, res) => {
  try {
    const { category, name, rarity, price, isLocked } = req.body;

    if (!category || !name) {
      return res.status(400).json({ error: 'Category and name are required' });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    let imageUrl = null;
    let modelUrl = null;

    if (files?.image && files.image.length > 0) {
      imageUrl = `/api/uploads/skins/${files.image[0].filename}`;
    }
    if (files?.glbModel && files.glbModel.length > 0) {
      modelUrl = `/api/uploads/skins/${files.glbModel[0].filename}`;
    }

    const parsedPrice = price ? parseInt(price, 10) : 0;
    const shouldBeLocked = parsedPrice > 0;

    let skin;
    // @ts-ignore
    if (prisma.inventorySkin) {
      // @ts-ignore
      skin = await prisma.inventorySkin.create({
        data: {
          category: category.trim(),
          name: name.trim(),
          rarity: rarity ? rarity.trim() : 'ODDIY',
          imageUrl,
          modelUrl,
          price: parsedPrice,
          isLocked: shouldBeLocked,
          isActive: true
        }
      });

      // If price > 0, also automatically add this item to IQROSHOP
      if (parsedPrice > 0) {
        try {
          const categorySubmap: Record<string, string> = {
            'ustki_kiyim': 'top',
            'bosh_kiyim': 'top',
            'shim': 'pants',
            'oyoq_kiyim': 'shoes',
            'aksessuar': 'accessories',
            'ryukzak': 'backpacks'
          };
          // @ts-ignore
          const shopItem = await prisma.shopItem.create({
            data: {
              category: 'inventory',
              subcategory: categorySubmap[category.trim()] || 'top',
              name: name.trim(),
              description: `Skin (${rarity || 'ODDIY'})`,
              imageUrl: imageUrl,
              value: 1,
              price: parsedPrice,
              isActive: true
            }
          });
          const io = req.app.get('io');
          if (io) {
            io.emit('shop_item_updated', shopItem);
          }
        } catch (shopErr) {
          console.error('Auto shop item creation error:', shopErr);
        }
      }
    } else {
      skin = {
        id: `skin_${Date.now()}`,
        category,
        name,
        rarity: rarity || 'ODDIY',
        imageUrl,
        modelUrl,
        price: parsedPrice,
        isLocked: shouldBeLocked,
        isActive: true,
        createdAt: new Date()
      };
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('inventory_skin_created', skin);
      io.emit('inventory_skins_updated', skin);
    }

    res.status(201).json(skin);
  } catch (error) {
    console.error('Error creating inventory skin:', error);
    res.status(500).json({ error: 'Failed to create inventory skin' });
  }
});

// Admin: Delete inventory skin
router.delete('/admin/inventory-skins/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // @ts-ignore
    if (prisma.inventorySkin) {
      // @ts-ignore
      const item = await prisma.inventorySkin.findUnique({ where: { id } });
      if (item) {
        if (item.imageUrl && item.imageUrl.startsWith('/api/uploads/skins/')) {
          const imgPath = path.join(__dirname, '../../public/uploads/skins', path.basename(item.imageUrl));
          if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }
        if (item.modelUrl && item.modelUrl.startsWith('/api/uploads/skins/')) {
          const modelPath = path.join(__dirname, '../../public/uploads/skins', path.basename(item.modelUrl));
          if (fs.existsSync(modelPath)) fs.unlinkSync(modelPath);
        }
        // @ts-ignore
        await prisma.inventorySkin.delete({ where: { id } });
      }
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('inventory_skin_deleted', id);
    }

    res.json({ message: 'Skin deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory skin:', error);
    res.status(500).json({ error: 'Failed to delete inventory skin' });
  }
});

// Mobile App API: Get active inventory skins
router.get('/inventory-skins', async (req, res) => {
  try {
    // @ts-ignore
    if (prisma.inventorySkin) {
      // @ts-ignore
      const skins = await prisma.inventorySkin.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });
      return res.json(skins);
    }
    return res.json([]);
  } catch (error) {
    console.error('Error fetching inventory skins for app:', error);
    res.status(500).json({ error: 'Failed to fetch inventory skins' });
  }
});

export default router;
