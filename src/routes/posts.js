const express = require('express');

const authorsService = require('../services/authorsService');
const postsService = require('../services/postsService');
const asyncHandler = require('../middlewares/asyncHandler');
const { notFound } = require('../middlewares/errors');
const { validatePost, validateIdParam } = require('../middlewares/validation');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const posts = await postsService.listPosts();
  res.json(posts);
}));

router.get('/author/:authorId', validateIdParam('authorId'), asyncHandler(async (req, res, next) => {
  const author = await authorsService.getAuthorById(req.params.authorId);

  if (!author) {
    return next(notFound('Autor no encontrado'));
  }

  const posts = await postsService.listPostsByAuthor(req.params.authorId);
  return res.json(posts);
}));

router.get('/:id', validateIdParam('id'), asyncHandler(async (req, res, next) => {
  const post = await postsService.getPostById(req.params.id);

  if (!post) {
    return next(notFound('Post no encontrado'));
  }

  return res.json(post);
}));

router.post('/', validatePost, asyncHandler(async (req, res) => {
  const post = await postsService.createPost(req.body);
  res.status(201).json(post);
}));

router.put('/:id', validateIdParam('id'), validatePost, asyncHandler(async (req, res, next) => {
  const post = await postsService.updatePost(req.params.id, req.body);

  if (!post) {
    return next(notFound('Post no encontrado'));
  }

  return res.json(post);
}));

router.delete('/:id', validateIdParam('id'), asyncHandler(async (req, res, next) => {
  const deleted = await postsService.deletePost(req.params.id);

  if (!deleted) {
    return next(notFound('Post no encontrado'));
  }

  return res.status(204).send();
}));

module.exports = router;
