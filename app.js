const express = require('express');
const session = require('express-session');
const monAnRoutes = require('./routes/MonAnRoutes');
const userViewRoutes = require('./routes/UserViewRoutes');
const adminViewRoutes = require('./routes/AdminViewRoutes');
const bodyParser = require('body-parser');
const {join} = require("node:path");
const app = express();
const PORT = 3000;

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: "session_secret"
}));

app.use(express.static(join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.static('public'));
app.use('/', userViewRoutes);
app.use('/admin', adminViewRoutes);
app.use('/api/v1/mon-an', monAnRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});