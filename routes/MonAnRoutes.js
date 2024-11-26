const express = require('express');
const router = express.Router();
const monAnController = require('../controllers/MonAnController');

router.get('/', monAnController.findAll);
router.get('/:id', monAnController.findById);

module.exports = router;