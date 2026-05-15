const pool = require('../db/config');

const AUTHOR_COLUMNS = 'id, name, email, bio, created_at';

async function listAuthors() {
  const result = await pool.query(
    `SELECT ${AUTHOR_COLUMNS}
     FROM authors
     ORDER BY id`
  );

  return result.rows;
}

async function getAuthorById(id) {
  const result = await pool.query(
    `SELECT ${AUTHOR_COLUMNS}
     FROM authors
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

async function createAuthor(author) {
  const result = await pool.query(
    `INSERT INTO authors (name, email, bio)
     VALUES ($1, $2, $3)
     RETURNING ${AUTHOR_COLUMNS}`,
    [author.name, author.email, author.bio]
  );

  return result.rows[0];
}

async function updateAuthor(id, author) {
  const result = await pool.query(
    `UPDATE authors
     SET name = $1, email = $2, bio = $3
     WHERE id = $4
     RETURNING ${AUTHOR_COLUMNS}`,
    [author.name, author.email, author.bio, id]
  );

  return result.rows[0] || null;
}

async function deleteAuthor(id) {
  const result = await pool.query('DELETE FROM authors WHERE id = $1', [id]);
  return result.rowCount > 0;
}

module.exports = {
  listAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
};
