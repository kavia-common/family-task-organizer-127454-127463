const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const authCtrl = require('../controllers/auth');
const userCtrl = require('../controllers/user');
const taskCtrl = require('../controllers/task');
const templateCtrl = require('../controllers/template');
const suggestionsCtrl = require('../controllers/suggestions');
const motivationCtrl = require('../controllers/motivation');

const router = express.Router();

// AUTH
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);

// USER
router.get('/users/me', authenticateToken, userCtrl.profile);
router.get('/users/children', authenticateToken, requireRole('parent'), userCtrl.listChildren);

// TASKS
router.post('/tasks', authenticateToken, requireRole('parent'), taskCtrl.create);
router.get('/tasks', authenticateToken, taskCtrl.list);
router.patch('/tasks/:taskId', authenticateToken, taskCtrl.update);
router.delete('/tasks/:taskId', authenticateToken, requireRole('parent'), taskCtrl.delete);
router.patch('/tasks/:taskId/status', authenticateToken, taskCtrl.setStatus);

// TEMPLATES
router.get('/templates', authenticateToken, templateCtrl.list);
router.post('/templates', authenticateToken, requireRole('parent'), templateCtrl.create);

// SUGGESTIONS
router.get('/suggestions', authenticateToken, suggestionsCtrl.textSuggestions);

// MOTIVATION & GUIDANCE
router.get('/motivation', authenticateToken, motivationCtrl.randomMotivation);
router.post('/guidance', authenticateToken, motivationCtrl.guidance);

module.exports = router;
