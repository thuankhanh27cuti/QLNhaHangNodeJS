const express = require('express');
const router = express.Router();
const chartApiController = require('../controllers/ChartApiController');

router.get('/date', chartApiController.date);
router.get('/month', chartApiController.month);
router.get('/year', chartApiController.year);

module.exports = router;