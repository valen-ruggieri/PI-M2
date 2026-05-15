# MiniBlog API

API REST de MiniBlog para el PI M2. Gestiona `authors`, `posts` y el extra credit de `comments` con Node.js, Express, PostgreSQL, `pg`, validaciones, tests automatizados y documentacion OpenAPI.

## Requisitos

- Node.js 22 o superior
- npm
- PostgreSQL local o una base PostgreSQL en Railway
- `psql` disponible en la terminal para ejecutar scripts SQL manualmente si hace falta

## Instalacion local

1. Instalar dependencias:

```bash
npm install
```

2. Crear una base local, por ejemplo:

```bash
psql -U postgres -c "CREATE DATABASE miniblog;"
```

3. Crear `.env` a partir del ejemplo y ajustar credenciales:

```bash
copy .env.example .env
```

Variables principales:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=miniblog
DB_USER=postgres
DB_PASSWORD=postgres
DB_SSL=false
```

Tambien se puede usar `DATABASE_URL` en lugar de variables separadas.

4. Crear tablas y cargar seed:

```bash
npm run db:setup
```

5. Levantar el servidor:

```bash
npm run dev
```

La API queda disponible en `http://localhost:3000`.

## Endpoints principales

- `GET /authors`
- `GET /authors/:id`
- `POST /authors`
- `PUT /authors/:id`
- `DELETE /authors/:id`
- `GET /posts`
- `GET /posts/:id`
- `GET /posts/author/:authorId`
- `POST /posts`
- `PUT /posts/:id`
- `DELETE /posts/:id`
- `GET /api/comments`
- `GET /api/comments/post/:postId`
- `POST /api/comments`

Documentacion interactiva:

```text
http://localhost:3000/api-docs
```

El archivo OpenAPI versionado esta en `docs/openapi.yaml`.

## Tests

Los tests usan Vitest + Supertest contra endpoints reales de Express. Para evitar borrar datos de desarrollo por error, requieren `TEST_DATABASE_URL`.

1. Crear base de test:

```bash
psql -U postgres -c "CREATE DATABASE miniblog_test;"
```

2. Ejecutar tests en PowerShell:

```powershell
$env:TEST_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/miniblog_test"
npm test
```

Coverage:

```bash
npm run test:coverage
```

## Deployment en Railway

1. Subir el repositorio a GitHub.
2. Crear un proyecto en Railway.
3. Agregar un servicio PostgreSQL.
4. Ejecutar `src/db/setup.sql` contra la base de Railway usando la URL publica de PostgreSQL:

```bash
psql "DATABASE_PUBLIC_URL_DE_RAILWAY" -f src/db/setup.sql
```

5. Agregar el servicio de la aplicacion desde el repo de GitHub.
6. Configurar variables de entorno en Railway. Opcion recomendada:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
PORT=3000
DB_SSL=false
```

Si se usan variables separadas dentro de Railway, usar las variables internas del servicio PostgreSQL (`PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`) y no credenciales publicas.

Si el proveedor de PostgreSQL exige SSL, agregar `DB_SSL=true`.

7. Verificar el deploy:

```bash
curl https://TU-APP.railway.app/health
curl https://TU-APP.railway.app/authors
curl https://TU-APP.railway.app/posts
```

URL publica de la API: pendiente de completar despues del deploy real.

## Seguridad y buenas practicas

- `.env` no se sube al repositorio.
- `.env.example` documenta las variables necesarias.
- Las queries usan parametros (`$1`, `$2`, etc.) para evitar SQL injection.
- Los errores se responden con formato consistente: `{ "error": "mensaje", "status": 400 }`.
- Las credenciales de Railway deben configurarse en el panel de Variables, no en el codigo.

## Registro de uso de IA

Se uso Codex/ChatGPT como asistente para transformar la consigna, la rubrica y las lectures en una implementacion base: estructura del proyecto, rutas, SQL, tests, OpenAPI y README. Las decisiones tecnicas se revisaron contra los requisitos del PI: Express, PostgreSQL, `pg`, SQL parametrizado, validaciones, middleware de errores, Vitest/Supertest y documentacion reproducible. No se compartieron credenciales reales ni datos sensibles.
