const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

router.get("/login", loginController.login);
router.post("/login", loginController.handleLogin);
router.get("/logout", loginController.handleLogout);

module.exports = router;