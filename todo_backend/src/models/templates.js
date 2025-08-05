const db = require('../db');

class TemplateModel {
  // PUBLIC_INTERFACE
  static async listTemplates() {
    const res = await db.query(
      'SELECT id, title, description, icon FROM templates ORDER BY id'
    );
    return res.rows;
  }
  // PUBLIC_INTERFACE
  static async createTemplate({ title, description, icon }) {
    const r = await db.query(
      'INSERT INTO templates (title, description, icon) VALUES ($1,$2,$3) RETURNING *',
      [title, description, icon]
    );
    return r.rows[0];
  }
}

class SuggestionModel {
  // PUBLIC_INTERFACE
  static async textSuggestions(partial) {
    // For demo: sample static suggestions, or store/retrieve from DB if available
    const items = ['Clean your room', 'Finish your homework', 'Set the table', 'Feed the pet', 'Brush your teeth'];
    if (!partial) return items;
    return items.filter(val => val.toLowerCase().startsWith(partial.toLowerCase()));
  }
}

class MotivationModel {
  // PUBLIC_INTERFACE
  static async randomMotivation() {
    // Static content for MVP, can be made dynamic later
    return {
      message: 'Great job! Keep up the hard work!',
      image: '/motivation/smiley_star.png'
    };
  }

  // PUBLIC_INTERFACE
  static async guidancePointers(taskTitle) {
    // A demo implementation (statics)
    if (taskTitle.toLowerCase().includes('room')) {
      return ['Pick up toys', 'Make your bed', 'Sweep the floor'];
    }
    if (taskTitle.toLowerCase().includes('homework')) {
      return ['Review your notes', 'Start with easiest subject', 'Take short breaks'];
    }
    return ['Break task into small steps', 'Ask for help if stuck', 'Take your time'];
  }
}

module.exports = { TemplateModel, SuggestionModel, MotivationModel };
