const pool = require("./pool");

async function init() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(30),
        job_title VARCHAR(150),
        department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
        hire_date DATE,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
        avatar_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      INSERT INTO departments (name, description) VALUES
        ('Engineering', 'Software development and infrastructure'),
        ('Marketing', 'Brand, growth, and communications'),
        ('Human Resources', 'Recruitment, culture, and people ops'),
        ('Finance', 'Accounting, budgeting, and financial planning'),
        ('Operations', 'Logistics, facilities, and process management')
      ON CONFLICT (name) DO NOTHING;
    `);

  } finally {
    client.release();
    await pool.end();
  }
}

init().catch((e) => {
  process.exit(1);
});
