const db = require('../config/db');

exports.home = async (req, res) => {
    res.render('admin/index');
};

exports.allMonAn = async (req, res) => {
    res.render('admin/all/monAn');
}
