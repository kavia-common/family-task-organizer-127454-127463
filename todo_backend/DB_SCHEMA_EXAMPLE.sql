-- USERS (parents and kids)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    role VARCHAR(16) NOT NULL CHECK(role IN ('parent', 'kid')),
    parent_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- TASKS
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    due_date DATE,
    parent_id INTEGER REFERENCES users(id) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'todo',
    template_id INTEGER REFERENCES templates(id)
);

-- TEMPLATES
CREATE TABLE IF NOT EXISTS templates (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(64)
);
