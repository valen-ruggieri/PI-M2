const pool = require('../db/config');

const POST_COLUMNS = 'id, author_id, title, content, published, created_at';

async function listPosts() {
  const result = await pool.query(
    `SELECT ${POST_COLUMNS}
     FROM posts
     ORDER BY id`
  );

  return result.rows;
}

async function getPostById(id) {
  const result = await pool.query(
    `SELECT ${POST_COLUMNS}
     FROM posts
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

async function listPostsByAuthor(authorId) {
  const result = await pool.query(
    `SELECT
       p.id,
       p.author_id,
       p.title,
       p.content,
       p.published,
       p.created_at,
       json_build_object(
         'id', a.id,
         'name', a.name,
         'email', a.email,
         'bio', a.bio,
         'created_at', a.created_at
       ) AS author
     FROM posts p
     JOIN authors a ON a.id = p.author_id
     WHERE p.author_id = $1
     ORDER BY p.id`,
    [authorId]
  );

  return result.rows;
}

async function createPost(post) {
  const result = await pool.query(
    `INSERT INTO posts (title, content, author_id, published)
     VALUES ($1, $2, $3, $4)
     RETURNING ${POST_COLUMNS}`,
    [post.title, post.content, post.author_id, post.published]
  );

  return result.rows[0];
}

async function updatePost(id, post) {
  const result = await pool.query(
    `UPDATE posts
     SET title = $1, content = $2, author_id = $3, published = $4
     WHERE id = $5
     RETURNING ${POST_COLUMNS}`,
    [post.title, post.content, post.author_id, post.published, id]
  );

  return result.rows[0] || null;
}

async function deletePost(id) {
  const result = await pool.query('DELETE FROM posts WHERE id = $1', [id]);
  return result.rowCount > 0;
}

module.exports = {
  listPosts,
  getPostById,
  listPostsByAuthor,
  createPost,
  updatePost,
  deletePost
};
