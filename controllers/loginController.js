const query = require("../query");
const { sendEmail } = require('../sendEmail');

exports.login = async (req, res) => {
    
    res.render("user/login");
};

exports.handleLogin = async (req, res) => {
    let { username, password } = req.body;
    let sql = "SELECT * FROM user WHERE username = ? AND password = ?";
    let data = await query.selectAllWithParams(sql, [username, password]);
    if (data.length === 1) {
        let user = data[0];
        req.session.session = {};
        req.session.session.userId = user.userId;
        req.session.session.username = user.UserName;
        req.session.session.LoaiUser = user.LoaiUser;
        req.session.session.email = user.email;
        res.redirect("/");
    } else {
        res.redirect("/login");
    }
};

exports.handleLogout = async (req, res) => {
    req.session.session = {};
    res.redirect("/login");
};

exports.signup = async (req, res) => {
    let { error } = req.query;
    let notification = "";
    switch (error) {
        case "email":
            notification = "Email này đã được sử dụng, vui lòng sử dụng email khác.";
            break;
        case "username":
            notification = "Đã có tài khoản sử dụng username này, vui lòng chọn username khác.";
            break;
        case "password":
            notification = "Vui lòng nhập lại mật khẩu chính xác.";
            break;
        case "fields":
            notification = "Vui lòng điền đầy đủ thông tin.";
            break;
        default:
            break;
    }
    res.render("user/signUp", { notification: notification });
};

exports.handleSignup = async (req, res) => {
    
    let { ten, username, phone, email, password, retypepassword } = req.body;

    let required = ten !== "" && username !== "" && phone !== "" && email !== "" && password !== "" && retypepassword !== "";

    if (required === true) {
        if (password === retypepassword) {
            let sqlCountUser = "SELECT COUNT(*) AS count FROM user WHERE username = ?";
            let dataCountUser = await query.selectAllWithParams(sqlCountUser, [username]);
            let countUser = dataCountUser[0].count;

            if (countUser === 0) {
                let sqlCount = "SELECT COUNT(*) AS count FROM user WHERE email = ?";
                let dataCount = await query.selectAllWithParams(sqlCount, [email]);

                let count = await dataCount[0].count;
                if (count === 0) {
                    let sql = "INSERT INTO user(UserName, PassWord, LoaiUser, Ten, SDT, email) VALUES (?, ?, ?, ?, ?, ?)";
                    await query.queryWithParams(sql, [username, password, 2, ten, phone, email]);

                    res.redirect("/login");
                } else {
                    res.redirect("/sign-up?error=email");
                }
            } else {
                res.redirect("/sign-up?error=username");
            }
        } else {
            res.redirect("/sign-up?error=password");
        }
    } else {
        res.redirect("/sign-up?error=fields");
    }
};

exports.forgotPassword = async (req, res) => {
    res.render("user/forgotPassword");
};

exports.handleForgotPassword = async (req, res) => {
    let { email } = req.body;
    if (email === "") {

    } else {
        let sqlGetUser = "SELECT * FROM user WHERE email = ?";
        let userData = await query.selectAllWithParams(sqlGetUser, [email]);

        // Kiểm tra nếu có dữ liệu người dùng
        if (userData.length > 0) {
            let user = userData[0];
            let otp = Math.floor(100000 + Math.random() * 900000); // Tạo mã OTP ngẫu nhiên
            // Lưu email và OTP vào session
            req.session.session.otp = otp; // Lưu mã OTP
            req.session.session.email = user.email; // Lưu email
            // Gửi email
            sendEmail(
                user.email,
                'Yêu cầu cung cấp mật khẩu mới', // Tiêu đề email
                `Xin chào ${user.UserName},\n\nMã OTP của bạn là: ${otp}`
            );
            req.session.session.notification =  'Đã gửi OTP tới email, vui lòng kiểm tra!'
            // Chuyển hướng tới trang xác nhận OTP
            res.redirect("/confirm-otp");
        } else {
            req.session.session.error =  'Email không tồn tại trong hệ thống!'
            res.render("user/forgotPassword", { session: req.session.session});
        }
    }
};

exports.loginWithGmail = async (req, res) => {
    res.redirect("/auth/google");
};

exports.confirmOTPForgetPassword = async (req, res) => {
    if(req.session.session.otp){
        res.render("user/otpConfirm");
    }else{
        res.redirect("/");
    }
};

//check otp + email forget password
exports.handleConfirmOTPForgetPassword = async (req, res) => {
    let { otp } = req.body;
    if (otp === "") {
        req.session.session.error = "Mã OTP không được để trống.";
        res.render("user/otpConfirm", { session: req.session.session});
    } else { 
        // Kiểm tra mã OTP
        if (otp == req.session.session.otp) {
            req.session.session.otp_verified = true; 
            res.redirect("/change-password");
        } else {
            req.session.session.error = "Mã OTP không hợp lệ. Vui lòng thử lại.";
            res.render("user/otpConfirm", { session: req.session.session});
        }
    }
};

//change password
exports.changePasswordWithForgetPassword = async (req, res) => {
    if(req.session.session.otp_verified = true){
        res.render("user/changePassword");
    }else{
        res.redirect("/");
    }
};

exports.handleChangePasswordWithForgotPassword = async (req, res) => {
    let { password } = req.body;
    if (password === "") {
        return res.redirect("/login"); 
    } else {
        const email = req.session.session.email;
        let sqlGetUser = "SELECT * FROM user WHERE email = ?";
        let userData = await query.selectAllWithParams(sqlGetUser, [email]);
        // Kiểm tra nếu có dữ liệu người dùng
        if (userData.length > 0) {
            let sqlUpdatePassword = "UPDATE user SET password = ? WHERE email = ?";
            await  query.update(sqlUpdatePassword, [password, email]);
            req.session.session.notification = "Mật khẩu đã được cập nhật thành công!";
            // Xóa thông tin trong session 
            req.session.session.email = null; 
            req.session.session.otp = null; 
            req.session.session.otp_verified = null; 
            
            return res.redirect("/login"); 
        } else {
            req.session.session.error =  `Email ${email} không tồn tại trong hệ thống!`
            res.render("user/forgotPassword", { session: req.session.session});
        }
    }
};