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