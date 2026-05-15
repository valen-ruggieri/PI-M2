const { badRequest } = require('./errors');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeRequiredString(value, fieldName, errors) {
  if (typeof value !== 'string') {
    errors.push(`${fieldName} es obligatorio`);
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    errors.push(`${fieldName} no puede estar vacio`);
    return null;
  }

  return trimmed;
}

function normalizeOptionalString(value) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed || null;
}

function parsePositiveInteger(value, fieldName, errors) {
  const numberValue = Number(value);

  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    errors.push(`${fieldName} debe ser un entero positivo`);
    return null;
  }

  return numberValue;
}

function parseBoolean(value, fieldName, errors, defaultValue = false) {
  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  errors.push(`${fieldName} debe ser boolean`);
  return defaultValue;
}

function validateIdParam(paramName) {
  return (req, res, next) => {
    const errors = [];
    const id = parsePositiveInteger(req.params[paramName], paramName, errors);

    if (errors.length > 0) {
      return next(badRequest(errors.join('; ')));
    }

    req.params[paramName] = id;
    return next();
  };
}

function validateAuthor(req, res, next) {
  const errors = [];
  const name = normalizeRequiredString(req.body.name, 'name', errors);
  const email = normalizeRequiredString(req.body.email, 'email', errors);
  const normalizedEmail = email ? email.toLowerCase() : null;

  if (normalizedEmail && !EMAIL_REGEX.test(normalizedEmail)) {
    errors.push('email debe tener un formato valido');
  }

  if (errors.length > 0) {
    return next(badRequest(errors.join('; ')));
  }

  req.body = {
    name,
    email: normalizedEmail,
    bio: normalizeOptionalString(req.body.bio)
  };

  return next();
}

function validatePost(req, res, next) {
  const errors = [];
  const title = normalizeRequiredString(req.body.title, 'title', errors);
  const content = normalizeRequiredString(req.body.content, 'content', errors);
  const authorId = parsePositiveInteger(req.body.author_id, 'author_id', errors);
  const published = parseBoolean(req.body.published, 'published', errors);

  if (errors.length > 0) {
    return next(badRequest(errors.join('; ')));
  }

  req.body = {
    title,
    content,
    author_id: authorId,
    published
  };

  return next();
}

function validateComment(req, res, next) {
  const errors = [];
  const content = normalizeRequiredString(req.body.content, 'content', errors);
  const postId = parsePositiveInteger(req.body.post_id, 'post_id', errors);
  const authorId = parsePositiveInteger(req.body.author_id, 'author_id', errors);

  if (errors.length > 0) {
    return next(badRequest(errors.join('; ')));
  }

  req.body = {
    content,
    post_id: postId,
    author_id: authorId
  };

  return next();
}

module.exports = {
  validateAuthor,
  validatePost,
  validateComment,
  validateIdParam
};
