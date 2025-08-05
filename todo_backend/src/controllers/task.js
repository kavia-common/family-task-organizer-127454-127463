const TaskModel = require('../models/task');

// PUBLIC_INTERFACE
exports.create = async (req, res) => {
  /**
   * Create a new task (parent use, optional template).
   */
  const { title, description, assignedTo, dueDate, templateId } = req.body;
  try {
    const task = await TaskModel.createTask({
      title, description, assignedTo, dueDate, parentId: req.user.id, templateId: templateId || null
    });
    res.status(201).json(task);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// PUBLIC_INTERFACE
exports.list = async (req, res) => {
  /**
   * List all tasks assigned to the user (or all family tasks if parent).
   */
  const tasks = await TaskModel.getTasksForUser(req.user.id, req.user.role, req.user.parentId);
  res.json(tasks);
};

// PUBLIC_INTERFACE
exports.update = async (req, res) => {
  /**
   * Update task (parent can update all; optionally allow kid update status).
   */
  try {
    const { taskId } = req.params;
    const updateFields = req.body;
    const updated = await TaskModel.updateTask(taskId, req.user.id, updateFields);
    if (!updated) return res.status(404).json({ message: 'Not found or no permitted fields' });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// PUBLIC_INTERFACE
exports.delete = async (req, res) => {
  /**
   * Delete a task (parent only).
   */
  try {
    const { taskId } = req.params;
    await TaskModel.deleteTask(taskId, req.user.id);
    res.json({ status: 'ok' });
  } catch(e) {
    res.status(400).json({ message: e.message });
  }
};

// PUBLIC_INTERFACE
exports.setStatus = async (req, res) => {
  /**
   * Update a task's status (done, in_progress, todo, etc.), allowed if parent or the assigned kid.
   */
  const { taskId } = req.params;
  const { status } = req.body;
  try {
    const t = await TaskModel.updateTaskStatus(taskId, req.user.id, req.user.role, status);
    if (!t) return res.status(404).json({ message: 'Not found or not permitted' });
    res.json(t);
  } catch(e) {
    res.status(400).json({ message: e.message });
  }
};
