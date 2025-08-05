const express = require('express');
const healthController = require('../controllers/health');

const router = express.Router();
const apiRoutes = require('./api');

// Health endpoint as root
router.get('/', healthController.check.bind(healthController));

// API routes for app JSON endpoints
router.use('/api', apiRoutes);

module.exports = router;
