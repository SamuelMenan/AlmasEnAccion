CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(30),
  address VARCHAR(255),
  skills VARCHAR(500),
  role VARCHAR(20) NOT NULL,
  enabled BOOLEAN NOT NULL,
  failed_login_attempts INT NOT NULL,
  account_locked_until TIMESTAMP,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS verification_tokens (
  id UUID PRIMARY KEY,
  token VARCHAR(255) NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description VARCHAR(1000),
  scheduled_at TIMESTAMP NOT NULL,
  location VARCHAR(255),
  capacity INT NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL,
  CONSTRAINT uk_enrollment_user_activity UNIQUE(user_id, activity_id)
);
