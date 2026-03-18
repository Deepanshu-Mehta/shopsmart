// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Prisma known errors
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Already exists', field: err.meta?.target });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Not found' });
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (process.env.NODE_ENV !== 'test') {
    console.error('[Error]', status, message, err.stack);
  }

  res.status(status).json({ error: message });
}

module.exports = errorHandler;
