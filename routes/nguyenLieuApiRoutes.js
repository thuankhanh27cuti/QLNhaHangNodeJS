const express = require('express');
const nguyenLieuController = require("../controllers/nguyenLieuApiController");
const router = express.Router();

router.get('/', nguyenLieuController.findAll);

module.exports = router;