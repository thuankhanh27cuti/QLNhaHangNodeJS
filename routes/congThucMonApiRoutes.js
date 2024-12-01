const express = require('express');
const congThucMonController = require("../controllers/congThucMonApiController");
const router = express.Router();

router.get('/:id', congThucMonController.findById);

module.exports = router;