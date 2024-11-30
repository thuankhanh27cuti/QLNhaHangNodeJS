const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const passport = require('passport');
require('../config/passport-setup.js'); //cấu hình Passport

router.get("/login", loginController.login);
router.post("/login", loginController.handleLogin);

router.get("/logout", loginController.handleLogout);

router.get('/sign-up', loginController.signup);
router.post('/sign-up', loginController.handleSignup);

router.get('/forgot-password', loginController.forgotPassword);
router.post('/forgot-password', loginController.handleForgotPassword);

router.get('/confirm-otp', loginController.confirmOTPForgetPassword);
router.post('/confirm-otp', loginController.handleConfirmOTPForgetPassword);

router.get('/change-password', loginController.changePasswordWithForgetPassword);
router.post('/change-password', loginController.handleChangePasswordWithForgotPassword);

//User click button login with gmail
router.get('/login-with-gmail', loginController.loginWithGmail);

// Route để bắt đầu quá trình đăng nhập
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Route callback từ Google
router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/'
}), (req, res) => {
    req.session.session = {};
    req.session.session.userId = req.user.userId; 
    req.session.session.username = req.user.UserName;
    req.session.session.LoaiUser = req.user.LoaiUser;
    req.session.session.email = user.email;
    res.redirect('/');
});


module.exports = router;