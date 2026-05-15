const path = require('node:path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const authorsRouter = require('./routes/authors');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();
const openApiPath = path.join(__dirname, '..', 'docs', 'openapi.yaml');
const openApiDocument = YAML.load(openApiPath);

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use('/authors', authorsRouter);
app.use('/posts', postsRouter);
app.use('/api/comments', commentsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
