const query = require('../query');

exports.login = async (req, res) => {
    res.render('user/login');
}

exports.handleLogin = async (req, res) => {
    let {username, password} = req.body;
    let sql = "SELECT * FROM user WHERE username = ? AND password = ?";
    let data = await query.selectAllWithParams(sql, [username, password]);
    if (data.length === 1) {
        let user = data[0];
        req.session.session = {};
        req.session.session.userId = user.userId;
        req.session.session.username = user.UserName;
        req.session.session.LoaiUser = user.LoaiUser;

        res.redirect('/');
    }
    else {
        res.redirect('/login');
    }
}

exports.handleLogout = async (req, res) => {
    req.session.session = {};
    res.redirect('/login');
}

exports.signup = async (req, res) => {
    let {error} = req.query;
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
    res.render('user/signUp', {notification: notification});
}

exports.handleSignup = async (req, res) => {
    console.log(req.body);
    let {ten, username, phone, email, password, retypepassword} = req.body;

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

                    res.redirect('/login');
                }
                else {
                    res.redirect('/sign-up?error=email');
                }
            }
            else {
                res.redirect('/sign-up?error=username');
            }
        }
        else {
            res.redirect('/sign-up?error=password');
        }
    }
    else {
        res.redirect('/sign-up?error=fields');
    }
}

exports.forgotPassword = async (req, res) => {
    res.render('user/forgotPassword');
}

exports.handleForgotPassword = async (req, res) => {
    let {email} = req.body;
    res.redirect('/forgot-password');
}

exports.loginWithGmail = async (req, res) => {
    res.redirect("/");
}