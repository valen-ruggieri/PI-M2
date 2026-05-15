const fs = require('node:fs');
const path = require('node:path');
const pool = require('../src/db/config');

async function main() {
  const sqlFile = process.argv[2];

  if (!sqlFile) {
    throw new Error('Debes indicar el archivo SQL. Ejemplo: npm run db:setup');
  }

  const absolutePath = path.resolve(sqlFile);
  const sql = fs.readFileSync(absolutePath, 'utf8');

  await pool.query(sql);
  await pool.end();
  console.log(`SQL ejecutado correctamente: ${absolutePath}`);
}

main().catch(async (error) => {
  console.error(error.message);
  await pool.end();
  process.exit(1);
});
