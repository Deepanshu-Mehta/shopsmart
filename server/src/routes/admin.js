const express = require('express');
const multer = require('multer');
const { z } = require('zod');
const prisma = require('../prisma/client');
const cloudinary = require('../config/cloudinary');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const router = express.Router();

router.use(requireAuth, requireAdmin);

// Zod schema for product create/update validation
const productSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  category: z.string().min(1),
  categoryLabel: z.string().min(1),
  price: z.number().int().positive(),
  priceLabel: z.string().min(1),
  imgUrl: z.string().url().optional().nullable(),
  hoverImgUrl: z.string().url().optional().nullable(),
  imgClass: z.string().optional().default(''),
  hoverClass: z.string().optional().default(''),
  filter: z.string().min(1),
  isActive: z.boolean().optional().default(true),
  details: z.string().default(''),
  materials: z.string().default(''),
  shipping: z.string().default(''),
});

const productUpdateSchema = productSchema.partial();

// GET /api/admin/products — list all products (including inactive)
router.get('/products', async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { id: 'asc' } });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/products — create
router.post('/products', async (req, res, next) => {
  try {
    const parsed = productSchema.safeParse({
      ...req.body,
      price: req.body.price !== undefined ? Number(req.body.price) : undefined,
    });
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', issues: parsed.error.issues });
    }

    const product = await prisma.product.create({ data: parsed.data });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/products/:id — update
router.put('/products/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid product id' });

    const parsed = productUpdateSchema.safeParse({
      ...req.body,
      price: req.body.price !== undefined ? Number(req.body.price) : undefined,
    });
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', issues: parsed.error.issues });
    }

    const product = await prisma.product.update({ where: { id }, data: parsed.data });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/products/:id — soft delete (sets isActive: false)
router.delete('/products/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid product id' });

    await prisma.product.update({ where: { id }, data: { isActive: false } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/products/:id/image — upload product image to Cloudinary
router.post('/products/:id/image', upload.single('image'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid product id' });
    if (!req.file) return res.status(400).json({ error: 'No image file provided' });

    const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
    if (!ALLOWED_MIME.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Only JPEG, PNG, and WebP images are allowed' });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'vestir/products',
            public_id: `product_${id}`,
            overwrite: true,
            resource_type: 'image',
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    const product = await prisma.product.update({
      where: { id },
      data: { imgUrl: result.secure_url },
    });

    res.json({ imgUrl: product.imgUrl });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/newsletter — list subscribers
router.get('/newsletter', async (req, res, next) => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(subscribers);
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/users — list all users
router.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/users/:id/role — promote or demote user
router.patch('/users/:id/role', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be USER or ADMIN' });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, name: true, role: true },
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
