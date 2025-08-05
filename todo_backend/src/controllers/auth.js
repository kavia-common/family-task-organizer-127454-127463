const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

// PUBLIC_INTERFACE
exports.register = async (req, res) => {
  /**
   * Registers a new user (parent, or kid under a parent).
   */
  try {
    const { name, email, password, role, parentId } = req.body;
    if (!['parent','kid'].includes(role)) {
      return res.status(400).json({ message: 'Role must be parent or kid' });
    }
    const existing = await UserModel.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const user = await UserModel.createUser({ name, email, password, role, parentId: parentId || null });
    res.status(201).json(user);
  } catch(e) {
    res.status(500).json({ message: e.message });
  }
};

// PUBLIC_INTERFACE
exports.login = async (req, res) => {
  /**
   * Log in a user, returning JWT token if credentials are valid.
   */
  try {
    const { email, password } = req.body;
    const user = await UserModel.getUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const pwOk = await UserModel.verifyPassword(user, password);
    if (!pwOk) return res.status(400).json({ message: 'Invalid credentials' });
    // Exclude password
    const payload = { id: user.id, name: user.name, role: user.role, parentId: user.parent_id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: payload });
  } catch(e) {
    res.status(500).json({ message: e.message });
  }
};
