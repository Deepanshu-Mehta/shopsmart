const express = require('express');
const multer = require('multer');
const prisma = require('../prisma/client');
const cloudinary = require('../config/cloudinary');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const router = express.Router();

router.use(requireAuth, requireAdmin);

// POST /api/admin/products — create
router.post('/products', async (req, res, next) => {
  try {
    const {
      name, slug, category, categoryLabel, price, priceLabel,
      imgUrl, hoverImgUrl, imgClass, hoverClass, filter,
      isActive, details, materials, shipping,
    } = req.body;
    const product = await prisma.product.create({
      data: {
        name, slug, category, categoryLabel, price: parseInt(price, 10),
        priceLabel, imgUrl, hoverImgUrl, imgClass, hoverClass, filter,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        details, materials, shipping,
      },
    });
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

    const {
      name, slug, category, categoryLabel, price, priceLabel,
      imgUrl, hoverImgUrl, imgClass, hoverClass, filter,
      isActive, details, materials, shipping,
    } = req.body;

    const data = {};
    if (name !== undefined) data.name = name;
    if (slug !== undefined) data.slug = slug;
    if (category !== undefined) data.category = category;
    if (categoryLabel !== undefined) data.categoryLabel = categoryLabel;
    if (price !== undefined) data.price = parseInt(price, 10);
    if (priceLabel !== undefined) data.priceLabel = priceLabel;
    if (imgUrl !== undefined) data.imgUrl = imgUrl;
    if (hoverImgUrl !== undefined) data.hoverImgUrl = hoverImgUrl;
    if (imgClass !== undefined) data.imgClass = imgClass;
    if (hoverClass !== undefined) data.hoverClass = hoverClass;
    if (filter !== undefined) data.filter = filter;
    if (isActive !== undefined) data.isActive = Boolean(isActive);
    if (details !== undefined) data.details = details;
    if (materials !== undefined) data.materials = materials;
    if (shipping !== undefined) data.shipping = shipping;

    const product = await prisma.product.update({ where: { id }, data });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid product id' });

    await prisma.product.delete({ where: { id } });
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

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'vestir/products', public_id: `product_${id}`, overwrite: true, resource_type: 'image' },
        (err, result) => { if (err) reject(err); else resolve(result); }
      ).end(req.file.buffer);
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

module.exports = router;
