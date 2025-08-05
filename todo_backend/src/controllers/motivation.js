const { MotivationModel } = require('../models/templates');

// PUBLIC_INTERFACE
exports.randomMotivation = async (req, res) => {
  /**
   * Returns a randomly selected motivational message and image.
   */
  const m = await MotivationModel.randomMotivation();
  res.json(m);
};

// PUBLIC_INTERFACE
exports.guidance = async (req, res) => {
  /**
   * Get step-by-step guide for a specific task title.
   */
  const { title } = req.body;
  const pointers = await MotivationModel.guidancePointers(title);
  res.json({ pointers });
};
