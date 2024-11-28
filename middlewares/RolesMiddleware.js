exports.isAdminAndNhanVienMiddleware = (req, res, next) => {
    let session = req.session.session;
    if (!session) {
        return res.redirect('/login');
    }
    else if (![0, 1].includes(session.LoaiUser)) {
        return res.redirect('/');
    }
    else {
        next();
    }
}

exports.isAdminMiddleware = (req, res, next) => {
    let session = req.session.session;
    if (!session) {
        return res.redirect('/login');
    }
    else if (session.LoaiUser === 1) {
        return res.redirect('/admin');
    }
    else if (session.LoaiUser === 0) {
        next();
    }
    else {
        return res.redirect('/');
    }
}

exports.isUserMiddleware = (req, res, next) => {
    let session = req.session.session;
    if (!session) {
        return res.redirect('/login');
    }
    else if (session.LoaiUser === 2) {
        next();
    }
    else if (![0, 1].includes(session.LoaiUser)) {
        return res.redirect('/admin');
    }
    else {
        return res.redirect('/');
    }
}

exports.isUnAuthenticateMiddleware = (req, res, next) => {
    let session = req.session.session;
    if (!session) {
        next();
    }
    else if (![0, 1].includes(session.LoaiUser)) {
        return res.redirect('/admin');
    }
    else {
        return res.redirect('/');
    }
}