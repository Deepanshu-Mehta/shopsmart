const express = require('express');
const prisma = require('../prisma/client');

const router = express.Router();

// GET /api/products — list with optional category filter and pagination
router.get('/', async (req, res, next) => {
  try {
    const where = { isActive: true };
    if (req.query.category) where.category = req.query.category;

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));

    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        categoryLabel: true,
        price: true,
        priceLabel: true,
        imgUrl: true,
        hoverImgUrl: true,
        imgClass: true,
        hoverClass: true,
        filter: true,
        details: true,
        materials: true,
        shipping: true,
      },
      orderBy: { id: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    res.json(products);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id — single product with details
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid product id' });

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product || !product.isActive) return res.status(404).json({ error: 'Product not found' });

    res.json(product);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
