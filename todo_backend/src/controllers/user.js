const UserModel = require('../models/user');

// PUBLIC_INTERFACE
exports.profile = async (req, res) => {
  /**
   * Get current user's profile.
   */
  const user = await UserModel.getUserById(req.user.id);
  res.json(user);
};

// PUBLIC_INTERFACE
exports.listChildren = async (req, res) => {
  /**
   * List all children of the authenticated parent.
   */
  const kids = await UserModel.listChildren(req.user.id);
  res.json(kids);
};
