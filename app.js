const express = require('express');
const session = require('express-session');
const loginRoutes = require('./routes/loginRoutes');
const monAnRoutes = require('./routes/MonAnRoutes');
const userViewRoutes = require('./routes/UserViewRoutes');
const adminViewRoutes = require('./routes/AdminViewRoutes');
const adminViewAddRoutes = require("./routes/AdminViewAddRoutes");
const adminViewUpdateRoutes = require("./routes/AdminViewUpdateRoutes");
const chartApiRoutes = require("./routes/chartApiRoutes");
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
    res.locals.session = req.session.session;
    //console.log('session'+ JSON.stringify(res.locals.session));
    next();
});

app.use(express.static('public'));
app.use('/', loginRoutes);
app.use('/', userViewRoutes);
app.use('/admin', adminViewRoutes);
app.use('/admin/add', adminViewAddRoutes);
app.use('/admin/update', adminViewUpdateRoutes);

app.use('/api/v1/chart', chartApiRoutes);
app.use('/api/v1/mon-an', monAnRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});