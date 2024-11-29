const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

router.get("/login", loginController.login);
router.post("/login", loginController.handleLogin);
router.get("/logout", loginController.handleLogout);
router.get('/sign-up', loginController.signup);
router.post('/sign-up', loginController.handleSignup);
router.get('/forgot-password', loginController.forgotPassword);
router.post('/forgot-password', loginController.handleForgotPassword);
router.get('/login-with-gmail', loginController.loginWithGmail);

module.exports = router;