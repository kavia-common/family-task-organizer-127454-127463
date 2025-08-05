const db = require('../db');

class TaskModel {
  // PUBLIC_INTERFACE
  static async createTask({ title, description, assignedTo, dueDate, parentId, templateId }) {
    const result = await db.query(
      `INSERT INTO tasks (title, description, assigned_to, due_date, parent_id, template_id, status) 
       VALUES ($1,$2,$3,$4,$5,$6,'todo')
       RETURNING id, title, description, assigned_to, due_date, parent_id, status, template_id`,
      [title, description, assignedTo, dueDate, parentId, templateId || null]
    );
    return result.rows[0];
  }

  // PUBLIC_INTERFACE
  static async getTasksForUser(userId, role, parentId) {
    if (role === 'parent') {
      // Parent: return all own and kids' tasks
      const result = await db.query(
        'SELECT * FROM tasks WHERE parent_id = $1 ORDER BY due_date ASC', [userId]
      );
      return result.rows;
    }
    // Kid: return assigned tasks
    const result = await db.query(
      'SELECT * FROM tasks WHERE assigned_to = $1 ORDER BY due_date ASC', [userId]
    );
    return result.rows;
  }

  // PUBLIC_INTERFACE
  static async updateTaskStatus(taskId, userId, role, newStatus) {
    // Only assignee or parent can update status
    const result = await db.query(
      `UPDATE tasks SET status = $1 WHERE id = $2 AND (assigned_to = $3 OR parent_id = $4)
       RETURNING *`,
      [newStatus, taskId, userId, userId]
    );
    return result.rows[0];
  }

  // PUBLIC_INTERFACE
  static async deleteTask(taskId, parentId) {
    await db.query(
      'DELETE FROM tasks WHERE id = $1 AND parent_id = $2',
      [taskId, parentId]
    );
    return true;
  }

  // PUBLIC_INTERFACE
  static async updateTask(taskId, parentId, updateFields) {
    // Allow parent only
    const allowed = ['title', 'description', 'assigned_to', 'due_date', 'status'];
    const keys = Object.keys(updateFields).filter(k => allowed.includes(k));
    if (keys.length === 0) return null;
    const sets = keys.map((k, idx) => `${k} = $${idx+3}`);
    const values = [taskId, parentId, ...keys.map(k => updateFields[k])];
    const query = `UPDATE tasks SET ${sets.join(', ')} WHERE id = $1 AND parent_id = $2 RETURNING *`;
    const r = await db.query(query, values);
    return r.rows[0];
  }
}

module.exports = TaskModel;
