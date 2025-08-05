const db = require('../db');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

class UserModel {
  // PUBLIC_INTERFACE
  static async createUser({ name, email, password, role, parentId }) {
    /**
     * Registers a new user (parent or kid); password is hashed.
     * Returns the created user (excluding password hash).
     */
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, role, parent_id) VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, parent_id`,
      [name, email, hashed, role, parentId || null]
    );
    return result.rows[0];
  }

  // PUBLIC_INTERFACE
  static async getUserByEmail(email) {
    const r = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return r.rows[0];
  }

  // PUBLIC_INTERFACE
  static async getUserById(id) {
    const r = await db.query(
      'SELECT id, name, email, role, parent_id FROM users WHERE id = $1',
      [id]
    );
    return r.rows[0];
  }

  // PUBLIC_INTERFACE
  static async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password_hash);
  }

  // PUBLIC_INTERFACE
  static async listChildren(parentId) {
    const r = await db.query(
      'SELECT id, name, email, role FROM users WHERE parent_id = $1 AND role = $2',
      [parentId, 'kid']
    );
    return r.rows;
  }
}

module.exports = UserModel;
