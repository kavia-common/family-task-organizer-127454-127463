const { TemplateModel } = require('../models/templates');

// PUBLIC_INTERFACE
exports.list = async (req, res) => {
  /**
   * List all available parent-created task templates.
   */
  const templates = await TemplateModel.listTemplates();
  res.json(templates);
};

// PUBLIC_INTERFACE
exports.create = async (req, res) => {
  /**
   * Create a new task template (parent only).
   */
  const { title, description, icon } = req.body;
  try {
    const t = await TemplateModel.createTemplate({ title, description, icon });
    res.status(201).json(t);
  } catch(e) {
    res.status(400).json({ message: e.message });
  }
};
