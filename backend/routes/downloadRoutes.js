const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');

router.post('/', downloadController.downloadVideo);

// Experimental: Proxy video stream from external URL to client
router.get('/proxy', downloadController.proxyVideo);

// Get available APIs for a platform
router.get('/apis/:platform', downloadController.getAvailableAPIs);

// Test API connectivity
router.get('/test-api/:apiName', downloadController.testAPI);

module.exports = router;