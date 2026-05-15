function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function badRequest(message) {
  return createError(message, 400);
}

function notFound(message) {
  return createError(message, 404);
}

module.exports = {
  createError,
  badRequest,
  notFound
};
