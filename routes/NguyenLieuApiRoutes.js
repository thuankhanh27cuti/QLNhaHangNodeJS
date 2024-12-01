const express = require('express');
const nguyenLieuController = require("../controllers/NguyenLieuApiController");
const router = express.Router();

router.get('/', nguyenLieuController.findAll);

module.exports = router;