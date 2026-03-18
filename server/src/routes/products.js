const express = require('express');
const prisma = require('../prisma/client');

const router = express.Router();

// GET /api/products — list (optionally filter by category)
router.get('/', async (req, res, next) => {
  try {
    const where = { isActive: true };
    if (req.query.category) where.category = req.query.category;

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
      },
      orderBy: { id: 'asc' },
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
