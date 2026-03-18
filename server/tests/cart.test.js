jest.mock('../src/prisma/client', () => {
  const mock = {
    user: { findUnique: jest.fn() },
    product: { findUnique: jest.fn() },
    cart: { findUnique: jest.fn(), create: jest.fn() },
    cartItem: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    revokedToken: { findUnique: jest.fn() },
  };
  mock.$transaction = jest.fn((callback) => callback(mock));
  return mock;
});

const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/prisma/client');
const { makeAuthCookie } = require('./helpers');

const testUser = { id: 'user-cuid-1', email: 'test@vestir.com', name: 'Test User', role: 'USER' };

const mockProduct = {
  id: 1,
  name: 'Linen Drape Top',
  price: 4200,
  priceLabel: '₹4,200',
  imgClass: 'img-top',
  isActive: true,
};

const emptyCart = { id: 'cart-1', userId: 'user-cuid-1', items: [] };

const cartWithItem = {
  id: 'cart-1',
  userId: 'user-cuid-1',
  items: [
    {
      id: 'item-1',
      cartId: 'cart-1',
      productId: 1,
      quantity: 2,
      size: 'M',
      color: 'Sand',
      product: mockProduct,
    },
  ],
};

describe('Cart routes', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('unauthenticated requests', () => {
    it('GET /api/cart → 401 without cookie', async () => {
      const res = await request(app).get('/api/cart');
      expect(res.statusCode).toBe(401);
    });

    it('POST /api/cart/items → 401 without cookie', async () => {
      const res = await request(app).post('/api/cart/items').send({});
      expect(res.statusCode).toBe(401);
    });

    it('PATCH /api/cart/items/:id → 401 without cookie', async () => {
      const res = await request(app).patch('/api/cart/items/item-1').send({ quantity: 2 });
      expect(res.statusCode).toBe(401);
    });

    it('DELETE /api/cart/items/:id → 401 without cookie', async () => {
      const res = await request(app).delete('/api/cart/items/item-1');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/cart', () => {
    it('returns 200 with existing cart and items', async () => {
      prisma.user.findUnique.mockResolvedValue(testUser);
      prisma.cart.findUnique.mockResolvedValue(cartWithItem);

      const res = await request(app).get('/api/cart').set('Cookie', makeAuthCookie());
      expect(res.statusCode).toBe(200);
      expect(res.body.items).toHaveLength(1);
    });

    it('auto-creates and returns empty cart when none exists', async () => {
      prisma.user.findUnique.mockResolvedValue(testUser);
      prisma.cart.findUnique.mockResolvedValue(null);
      prisma.cart.create.mockResolvedValue(emptyCart);

      const res = await request(app).get('/api/cart').set('Cookie', makeAuthCookie());
      expect(res.statusCode).toBe(200);
      expect(prisma.cart.create).toHaveBeenCalled();
      expect(res.body.items).toEqual([]);
    });
  });

  describe('POST /api/cart/items', () => {
    it('returns 201 with created cart item', async () => {
      prisma.user.findUnique.mockResolvedValue(testUser);
      prisma.product.findUnique.mockResolvedValue(mockProduct);
      prisma.cart.findUnique.mockResolvedValue(emptyCart);
      prisma.cartItem.findFirst.mockResolvedValue(null);
      prisma.cartItem.create.mockResolvedValue({
        id: 'item-1',
        cartId: 'cart-1',
        productId: 1,
        quantity: 1,
        size: 'M',
        color: 'Sand',
        product: mockProduct,
      });

      const res = await request(app)
        .post('/api/cart/items')
        .set('Cookie', makeAuthCookie())
        .send({ productId: 1, size: 'M', color: 'Sand' });

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({ size: 'M', color: 'Sand' });
    });

    it('returns 200 and increments quantity when same product+size+color already in cart', async () => {
      const existingItem = {
        id: 'item-1',
        cartId: 'cart-1',
        productId: 1,
        quantity: 1,
        size: 'M',
        color: 'Sand',
      };
      prisma.user.findUnique.mockResolvedValue(testUser);
      prisma.product.findUnique.mockResolvedValue(mockProduct);
      prisma.cart.findUnique.mockResolvedValue(emptyCart);
      prisma.cartItem.findFirst.mockResolvedValue(existingItem);
      prisma.cartItem.update.mockResolvedValue({
        ...existingItem,
        quantity: 2,
        product: mockProduct,
      });

      const res = await request(app)
        .post('/api/cart/items')
        .set('Cookie', makeAuthCookie())
        .send({ productId: 1, size: 'M', color: 'Sand' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({ quantity: 2 });
      expect(prisma.cartItem.create).not.toHaveBeenCalled();
    });

    it('returns 400 when productId, size, or color missing', async () => {
      prisma.user.findUnique.mockResolvedValue(testUser);

      const res = await request(app)
        .post('/api/cart/items')
        .set('Cookie', makeAuthCookie())
        .send({ productId: 1 });

      expect(res.statusCode).toBe(400);
      expect(res.body).toMatchObject({ error: expect.stringContaining('required') });
    });

    it('returns 400 when quantity is 0', async () => {
      prisma.user.findUnique.mockResolvedValue(testUser);

      const res = await request(app)
        .post('/api/cart/items')
        .set('Cookie', makeAuthCookie())
        .send({ productId: 1, size: 'M', color: 'Sand', quantity: 0 });

      expect(res.statusCode).toBe(400);
    });

    it('returns 404 when product does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(testUser);
      prisma.product.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/cart/items')
        .set('Cookie', makeAuthCookie())
        .send({ productId: 99, size: 'M', color: 'Sand' });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PATCH /api/cart/items/:itemId', () => {
    const mockCartItem = {
      id: 'item-1',
      cartId: 'cart-1',
      quantity: 2,
      size: 'M',
      color: 'Sand',
      cart: { id: 'cart-1', userId: 'user-cuid-1' },
    };

    it('returns 200 with updated item when quantity >= 1', async () => {
      prisma.user.findUnique.mockResolvedValue(testUser);
      prisma.cartItem.findUnique.mockResolvedValue(mockCartItem);
      prisma.cartItem.update.mockResolvedValue({
        ...mockCartItem,
        quantity: 3,
        product: mockProduct,
      });

      const res = await request(app)
        .patch('/api/cart/items/item-1')
        .set('Cookie', makeAuthCookie())
        .send({ quantity: 3 });

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({ quantity: 3 });
    });

    it('returns 400 when quantity is 0', async () => {
      prisma.user.findUnique.mockResolvedValue(testUser);

      const res = await request(app)
        .patch('/api/cart/items/item-1')
        .set('Cookie', makeAuthCookie())
        .send({ quantity: 0 });

      expect(res.statusCode).toBe(400);
    });

    it('returns 404 when cart item does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(testUser);
      prisma.cartItem.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .patch('/api/cart/items/nonexistent')
        .set('Cookie', makeAuthCookie())
        .send({ quantity: 2 });

      expect(res.statusCode).toBe(404);
    });

    it('returns 403 when item belongs to different user', async () => {
      prisma.user.findUnique.mockResolvedValue(testUser);
      prisma.cartItem.findUnique.mockResolvedValue({
        ...mockCartItem,
        cart: { id: 'cart-2', userId: 'different-user-id' },
      });

      const res = await request(app)
        .patch('/api/cart/items/item-1')
        .set('Cookie', makeAuthCookie())
        .send({ quantity: 2 });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('DELETE /api/cart/items/:itemId', () => {
    const mockCartItem = {
      id: 'item-1',
      cartId: 'cart-1',
      cart: { id: 'cart-1', userId: 'user-cuid-1' },
    };

    it('returns 204 when item is deleted', async () => {
      prisma.user.findUnique.mockResolvedValue(testUser);
      prisma.cartItem.findUnique.mockResolvedValue(mockCartItem);
      prisma.cartItem.delete.mockResolvedValue({});

      const res = await request(app)
        .delete('/api/cart/items/item-1')
        .set('Cookie', makeAuthCookie());

      expect(res.statusCode).toBe(204);
    });

    it('returns 404 when item does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(testUser);
      prisma.cartItem.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .delete('/api/cart/items/nonexistent')
        .set('Cookie', makeAuthCookie());

      expect(res.statusCode).toBe(404);
    });

    it('returns 403 when item belongs to different user', async () => {
      prisma.user.findUnique.mockResolvedValue(testUser);
      prisma.cartItem.findUnique.mockResolvedValue({
        ...mockCartItem,
        cart: { id: 'cart-2', userId: 'different-user-id' },
      });

      const res = await request(app)
        .delete('/api/cart/items/item-1')
        .set('Cookie', makeAuthCookie());

      expect(res.statusCode).toBe(403);
    });
  });
});
