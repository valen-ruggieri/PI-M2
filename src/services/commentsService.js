const pool = require('../db/config');

const COMMENT_COLUMNS = 'id, content, post_id, author_id, created_at';

async function listComments() {
  const result = await pool.query(
    `SELECT
       c.id,
       c.content,
       c.post_id,
       c.author_id,
       c.created_at,
       json_build_object('id', p.id, 'title', p.title) AS post,
       CASE
         WHEN a.id IS NULL THEN NULL
         ELSE json_build_object('id', a.id, 'name', a.name, 'email', a.email)
       END AS author
     FROM comments c
     JOIN posts p ON p.id = c.post_id
     LEFT JOIN authors a ON a.id = c.author_id
     ORDER BY c.id`
  );

  return result.rows;
}

async function listCommentsByPost(postId) {
  const result = await pool.query(
    `SELECT
       c.id,
       c.content,
       c.post_id,
       c.author_id,
       c.created_at,
       CASE
         WHEN a.id IS NULL THEN NULL
         ELSE json_build_object('id', a.id, 'name', a.name, 'email', a.email)
       END AS author
     FROM comments c
     LEFT JOIN authors a ON a.id = c.author_id
     WHERE c.post_id = $1
     ORDER BY c.id`,
    [postId]
  );

  return result.rows;
}

async function createComment(comment) {
  const result = await pool.query(
    `INSERT INTO comments (content, post_id, author_id)
     VALUES ($1, $2, $3)
     RETURNING ${COMMENT_COLUMNS}`,
    [comment.content, comment.post_id, comment.author_id]
  );

  return result.rows[0];
}

module.exports = {
  listComments,
  listCommentsByPost,
  createComment
};
