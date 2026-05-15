const express = require('express');

const authorsService = require('../services/authorsService');
const asyncHandler = require('../middlewares/asyncHandler');
const { notFound } = require('../middlewares/errors');
const { validateAuthor, validateIdParam } = require('../middlewares/validation');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const authors = await authorsService.listAuthors();
  res.json(authors);
}));

router.get('/:id', validateIdParam('id'), asyncHandler(async (req, res, next) => {
  const author = await authorsService.getAuthorById(req.params.id);

  if (!author) {
    return next(notFound('Autor no encontrado'));
  }

  return res.json(author);
}));

router.post('/', validateAuthor, asyncHandler(async (req, res) => {
  const author = await authorsService.createAuthor(req.body);
  res.status(201).json(author);
}));

router.put('/:id', validateIdParam('id'), validateAuthor, asyncHandler(async (req, res, next) => {
  const author = await authorsService.updateAuthor(req.params.id, req.body);

  if (!author) {
    return next(notFound('Autor no encontrado'));
  }

  return res.json(author);
}));

router.delete('/:id', validateIdParam('id'), asyncHandler(async (req, res, next) => {
  const deleted = await authorsService.deleteAuthor(req.params.id);

  if (!deleted) {
    return next(notFound('Autor no encontrado'));
  }

  return res.status(204).send();
}));

module.exports = router;
