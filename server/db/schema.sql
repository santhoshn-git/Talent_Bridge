-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('Full Time', 'Part Time')),
  location VARCHAR(100) NOT NULL,
  description TEXT,
  salary_range VARCHAR(50),
  admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  resume_url TEXT,
  applied_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);
