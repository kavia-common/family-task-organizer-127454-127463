const { SuggestionModel } = require('../models/templates');

// PUBLIC_INTERFACE
exports.textSuggestions = async (req, res) => {
  /**
   * Returns a list of text suggestions based on a provided partial string.
   */
  const partial = req.query.q || '';
  const suggestions = await SuggestionModel.textSuggestions(partial);
  res.json(suggestions);
};
