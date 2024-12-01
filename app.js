const express = require('express');
const session = require('express-session');
const loginRoutes = require('./routes/LoginRoutes');
const monAnRoutes = require('./routes/MonAnRoutes');
const userViewRoutes = require('./routes/UserViewRoutes');
const adminViewRoutes = require('./routes/AdminViewRoutes');
const adminViewAddRoutes = require("./routes/AdminViewAddRoutes");
const adminViewUpdateRoutes = require("./routes/AdminViewUpdateRoutes");
const adminViewDeleteRoutes = require("./routes/AdminViewDeleteRoutes");
const chartApiRoutes = require("./routes/ChartApiRoutes");
const congThucMonRoutes = require("./routes/CongThucMonApiRoutes");
const nguyenLieuRoutes = require("./routes/NguyenLieuApiRoutes");
const giamGiaRoutes = require("./routes/GiamGiaApiRoutes");
const bodyParser = require('body-parser');
const {join} = require("node:path");
const app = express();
const PORT = 3000;

const passport = require('passport');

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: "session_secret"
}));

app.use(passport.initialize());

app.use(express.static(join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use((req, res, next) => {
    // if (!req.session.session) {
    //     req.session.session = {}; // Khởi tạo nếu chưa có
    // }
    if (req.session.session) {
        req.session.session.cart = req.session.session.cart || [];
    }
    // console.log(req.session);
    res.locals.session = req.session.session;
    next();
});

app.use(express.static('public'));
app.use('/', loginRoutes);
app.use('/', userViewRoutes);
app.use('/admin', adminViewRoutes);
app.use('/admin/add', adminViewAddRoutes);
app.use('/admin/update', adminViewUpdateRoutes);
app.use('/admin/delete', adminViewDeleteRoutes);

app.use('/api/v1/chart', chartApiRoutes);
app.use('/api/v1/mon-an', monAnRoutes);
app.use('/api/v1/cong-thuc-mon', congThucMonRoutes);
app.use('/api/v1/nguyen-lieu', nguyenLieuRoutes);
app.use('/api/v1/giam-gia', giamGiaRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});