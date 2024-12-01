const express = require('express');
const giamGiaController = require('../controllers/GiamGiaApiController');
const router = express.Router();

router.get('/:id', giamGiaController.findById);

module.exports = router;