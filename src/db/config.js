const fs = require('node:fs');
const { loadEnvFile } = require('node:process');
const { Pool } = require('pg');

if (fs.existsSync('.env')) {
  loadEnvFile('.env');
}

function shouldUseSsl() {
  return process.env.DB_SSL === 'true';
}

function createPoolConfig() {
  const testUrl = process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : null;
  const connectionString = testUrl || process.env.DATABASE_URL;

  if (connectionString) {
    return {
      connectionString,
      ssl: shouldUseSsl() ? { rejectUnauthorized: false } : false
    };
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'miniblog',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  };
}

const pool = new Pool(createPoolConfig());

module.exports = pool;
