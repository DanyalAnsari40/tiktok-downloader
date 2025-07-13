const express = require('express');
const router = express.Router();
const { downloadVideo, getDownloadHistory, getDownload } = require('../controllers/downloadController');

router.post('/', downloadVideo);
router.get('/history', getDownloadHistory);
router.get('/:id', getDownload);

module.exports = router;