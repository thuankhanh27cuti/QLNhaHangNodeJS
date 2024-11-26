const express = require('express');
const router = express.Router();
const adminViewController = require('../controllers/adminViewController');

// hosting.com/admin
router.get('/', adminViewController.home);
router.get('/mon-an', adminViewController.allMonAn);

module.exports = router;