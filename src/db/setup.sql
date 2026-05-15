DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS authors;

CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id INTEGER REFERENCES authors(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO authors (name, email, bio) VALUES
  ('Ana Garcia', 'ana@example.com', 'Desarrolladora full-stack apasionada por Node.js'),
  ('Carlos Ruiz', 'carlos@example.com', 'Escritor tecnico especializado en bases de datos'),
  ('Maria Lopez', 'maria@example.com', 'Ingeniera de software con foco en APIs REST');

INSERT INTO posts (title, content, author_id, published) VALUES
  ('Introduccion a Node.js', 'Node.js es un runtime de JavaScript...', 1, true),
  ('PostgreSQL vs MySQL', 'Ambas bases de datos tienen ventajas...', 2, true),
  ('APIs RESTful', 'REST es un estilo arquitectonico...', 1, true),
  ('Manejo de errores en Express', 'El manejo apropiado de errores...', 3, false),
  ('Async/Await explicado', 'Las promesas simplifican el codigo asincronico...', 1, false);

INSERT INTO comments (content, post_id, author_id) VALUES
  ('Excelente articulo, muy informativo', 1, 2),
  ('Me ayudo mucho a entender el tema', 1, 3),
  ('Podrias profundizar mas en este punto?', 2, 1);
