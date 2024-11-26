const express = require('express');
const router = express.Router();
const userViewController = require('../controllers/userViewController');

router.get("/", userViewController.index);
router.get("/danh-sach-mon-an", userViewController.danhSachMonAn);
router.post("/dat-ban", userViewController.datBan);

module.exports = router;