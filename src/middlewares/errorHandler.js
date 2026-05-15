const { notFound } = require('./errors');

function mapDatabaseError(err) {
  if (err.code === '23505') {
    return { statusCode: 400, message: 'El email ya esta registrado' };
  }

  if (err.code === '23503') {
    return { statusCode: 400, message: 'La referencia indicada no existe' };
  }

  if (err.code === '22P02') {
    return { statusCode: 400, message: 'El formato de los datos enviados es invalido' };
  }

  return null;
}

function notFoundHandler(req, res, next) {
  next(notFound(`No se encontro la ruta ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const dbError = mapDatabaseError(err);
  const statusCode = dbError?.statusCode || err.statusCode || err.status || 500;
  const message = dbError?.message || err.message || 'Error interno del servidor';

  if (statusCode >= 500) {
    console.error(err);
  }

  return res.status(statusCode).json({
    error: statusCode >= 500 ? 'Error interno del servidor' : message,
    status: statusCode
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};
