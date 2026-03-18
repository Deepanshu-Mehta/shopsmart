const express = require('express');
const prisma = require('../prisma/client');

const router = express.Router();

// POST /api/newsletter
router.post('/', async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: 'Email is required' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email format' });

    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email: email.toLowerCase().trim() },
    });

    res.status(201).json({ message: 'Subscribed successfully', id: subscriber.id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
