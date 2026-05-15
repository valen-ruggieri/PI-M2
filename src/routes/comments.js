const express = require('express');

const commentsService = require('../services/commentsService');
const postsService = require('../services/postsService');
const asyncHandler = require('../middlewares/asyncHandler');
const { notFound } = require('../middlewares/errors');
const { validateComment, validateIdParam } = require('../middlewares/validation');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const comments = await commentsService.listComments();
  res.json(comments);
}));

router.get('/post/:postId', validateIdParam('postId'), asyncHandler(async (req, res, next) => {
  const post = await postsService.getPostById(req.params.postId);

  if (!post) {
    return next(notFound('Post no encontrado'));
  }

  const comments = await commentsService.listCommentsByPost(req.params.postId);
  return res.json(comments);
}));

router.post('/', validateComment, asyncHandler(async (req, res) => {
  const comment = await commentsService.createComment(req.body);
  res.status(201).json(comment);
}));

module.exports = router;
