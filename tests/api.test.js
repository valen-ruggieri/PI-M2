const fs = require('node:fs');
const path = require('node:path');
const request = require('supertest');

const app = require('../src/app');
const pool = require('../src/db/config');

const setupSql = fs.readFileSync(path.join(__dirname, '..', 'src', 'db', 'setup.sql'), 'utf8');

beforeAll(() => {
  if (!process.env.TEST_DATABASE_URL) {
    throw new Error('Para correr tests define TEST_DATABASE_URL apuntando a una base de datos de prueba.');
  }
});

beforeEach(async () => {
  await pool.query(setupSql);
});

afterAll(async () => {
  await pool.end();
});

describe('authors endpoints', () => {
  test('GET /authors lista autores del seed', async () => {
    const response = await request(app).get('/authors');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(3);
    expect(response.body[0]).toHaveProperty('email', 'ana@example.com');
  });

  test('POST /authors crea un autor valido', async () => {
    const response = await request(app)
      .post('/authors')
      .send({
        name: 'Laura Perez',
        email: 'LAURA@example.com',
        bio: 'Editora tecnica'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('laura@example.com');
  });

  test('POST /authors rechaza campos obligatorios faltantes', async () => {
    const response = await request(app)
      .post('/authors')
      .send({ email: 'sin-nombre@example.com' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toContain('name');
  });

  test('POST /authors rechaza email duplicado', async () => {
    const response = await request(app)
      .post('/authors')
      .send({
        name: 'Ana Duplicada',
        email: 'ana@example.com'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toContain('email');
  });

  test('PUT /authors/:id actualiza un autor existente', async () => {
    const response = await request(app)
      .put('/authors/1')
      .send({
        name: 'Ana Actualizada',
        email: 'ana.actualizada@example.com',
        bio: 'Bio actualizada'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('Ana Actualizada');
    expect(response.body.email).toBe('ana.actualizada@example.com');
  });

  test('DELETE /authors/:id elimina un autor y responde 204', async () => {
    const deleteResponse = await request(app).delete('/authors/1');
    const getResponse = await request(app).get('/authors/1');

    expect(deleteResponse.statusCode).toBe(204);
    expect(getResponse.statusCode).toBe(404);
  });
});

describe('posts endpoints', () => {
  test('GET /posts lista posts del seed', async () => {
    const response = await request(app).get('/posts');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(5);
    expect(response.body[0]).toHaveProperty('author_id', 1);
  });

  test('GET /posts/author/:authorId devuelve posts con detalle de author', async () => {
    const response = await request(app).get('/posts/author/1');

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('author');
    expect(response.body[0].author).toHaveProperty('email', 'ana@example.com');
  });

  test('POST /posts crea un post valido', async () => {
    const response = await request(app)
      .post('/posts')
      .send({
        title: 'Testing con Vitest',
        content: 'Contenido del post',
        author_id: 1,
        published: true
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe('Testing con Vitest');
    expect(response.body.published).toBe(true);
  });

  test('POST /posts rechaza author_id inexistente', async () => {
    const response = await request(app)
      .post('/posts')
      .send({
        title: 'Post invalido',
        content: 'No debe guardarse',
        author_id: 999
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toContain('referencia');
  });

  test('PUT /posts/:id actualiza un post existente', async () => {
    const response = await request(app)
      .put('/posts/1')
      .send({
        title: 'Node.js actualizado',
        content: 'Contenido actualizado',
        author_id: 2,
        published: false
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe('Node.js actualizado');
    expect(response.body.author_id).toBe(2);
    expect(response.body.published).toBe(false);
  });

  test('DELETE /posts/:id elimina un post y responde 204', async () => {
    const deleteResponse = await request(app).delete('/posts/1');
    const getResponse = await request(app).get('/posts/1');

    expect(deleteResponse.statusCode).toBe(204);
    expect(getResponse.statusCode).toBe(404);
  });
});

describe('comments extra credit endpoints', () => {
  test('GET /api/comments lista comentarios con post y author', async () => {
    const response = await request(app).get('/api/comments');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(3);
    expect(response.body[0]).toHaveProperty('post');
    expect(response.body[0]).toHaveProperty('author');
  });

  test('GET /api/comments/post/:postId lista comentarios de un post', async () => {
    const response = await request(app).get('/api/comments/post/1');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].post_id).toBe(1);
  });

  test('POST /api/comments crea un comentario valido', async () => {
    const response = await request(app)
      .post('/api/comments')
      .send({
        content: 'Nuevo comentario',
        post_id: 1,
        author_id: 2
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.content).toBe('Nuevo comentario');
    expect(response.body.post_id).toBe(1);
  });
});

describe('errores generales', () => {
  test('responde 404 para rutas inexistentes', async () => {
    const response = await request(app).get('/ruta-inexistente');

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      error: 'No se encontro la ruta /ruta-inexistente',
      status: 404
    });
  });
});
