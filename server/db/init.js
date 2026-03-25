const fs = require('fs/promises');
const path = require('path');
const pool = require('./db');

async function initializeDatabase() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = await fs.readFile(schemaPath, 'utf8');

  await pool.query(schemaSql);

  await pool.query(`
    ALTER TABLE jobs
    ADD COLUMN IF NOT EXISTS salary_range VARCHAR(50);

    ALTER TABLE applications
    ADD COLUMN IF NOT EXISTS resume_url TEXT;
  `);
}

module.exports = { initializeDatabase };
