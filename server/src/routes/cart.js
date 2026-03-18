const express = require('express');
const prisma = require('../prisma/client');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// All cart routes require auth
router.use(requireAuth);

// Helper: get or create cart for user
async function getOrCreateCart(userId) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, price: true, priceLabel: true, imgClass: true },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, price: true, priceLabel: true, imgClass: true },
            },
          },
        },
      },
    });
  }

  return cart;
}

// GET /api/cart
router.get('/', async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

// POST /api/cart/items — add item
router.post('/items', async (req, res, next) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;

    if (!productId || !size || !color) {
      return res.status(400).json({ error: 'productId, size, and color are required' });
    }

    const pid = parseInt(productId, 10);
    const qty = parseInt(quantity, 10);

    // Ensure product exists
    const product = await prisma.product.findUnique({ where: { id: pid } });
    if (!product || !product.isActive) return res.status(404).json({ error: 'Product not found' });
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ error: 'quantity must be a positive integer' });
    }

    const cart = await getOrCreateCart(req.user.id);

    const productSelect = {
      select: { id: true, name: true, price: true, priceLabel: true, imgClass: true },
    };

    const [item, isNew] = await prisma.$transaction(async (tx) => {
      const existing = await tx.cartItem.findFirst({
        where: { cartId: cart.id, productId: pid, size, color },
      });
      if (existing) {
        const updated = await tx.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + qty },
          include: { product: productSelect },
        });
        return [updated, false];
      }
      const created = await tx.cartItem.create({
        data: { cartId: cart.id, productId: pid, quantity: qty, size, color },
        include: { product: productSelect },
      });
      return [created, true];
    });

    return isNew ? res.status(201).json(item) : res.json(item);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/cart/items/:itemId — update quantity
router.patch('/items/:itemId', async (req, res, next) => {
  try {
    const qty = parseInt(req.body.quantity, 10);
    if (isNaN(qty) || qty < 1) return res.status(400).json({ error: 'quantity must be >= 1' });

    const existing = await prisma.cartItem.findUnique({
      where: { id: req.params.itemId },
      include: { cart: true },
    });

    if (!existing) return res.status(404).json({ error: 'Cart item not found' });
    if (existing.cart.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const updated = await prisma.cartItem.update({
      where: { id: req.params.itemId },
      data: { quantity: qty },
      include: {
        product: {
          select: { id: true, name: true, price: true, priceLabel: true, imgClass: true },
        },
      },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/cart/items/:itemId — remove item
router.delete('/items/:itemId', async (req, res, next) => {
  try {
    const existing = await prisma.cartItem.findUnique({
      where: { id: req.params.itemId },
      include: { cart: true },
    });

    if (!existing) return res.status(404).json({ error: 'Cart item not found' });
    if (existing.cart.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    await prisma.cartItem.delete({ where: { id: req.params.itemId } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
