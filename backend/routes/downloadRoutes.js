const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');

router.post('/', downloadController.downloadVideo);

// Experimental: Proxy video stream from external URL to client
router.get('/proxy', downloadController.proxyVideo);

module.exports = router;