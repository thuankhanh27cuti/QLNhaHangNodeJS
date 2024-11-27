const db = require('../config/db');
const query = require('../query');

const perPages = 10;

exports.home = async (req, res) => {
    res.render('admin/index');
};

exports.allMonAn = async (req, res) => {
    let {page} = req.query;
    let currentPage = 1;

    let parsePage = parseInt(page);
    if (!isNaN(parsePage)) {
        currentPage = parseInt(page);
    }

    let start = (currentPage - 1) * perPages;

    let sql = "SELECT MaSP, TenSP, GiaBan, GioiThieuSP, TenLoai FROM danhmucsp LEFT JOIN loaisp l on l.LoaiSP = danhmucsp.MaLoai ORDER BY MaSP LIMIT ?, ?";

    let data = await query.selectAllWithParams(sql, [start, perPages]);

    let sqlCount = "SELECT COUNT(*) AS total FROM danhmucsp";
    let queryCount = await query.selectAll(sqlCount);
    let dataCount = queryCount[0].total;

    let pages = Math.ceil(dataCount / perPages);

    res.render('admin/all/monAn', {allMonAn: data, count: pages});
}

exports.allBaiViet = async (req, res) => {
    res.render('admin/all/baiViet');
}

exports.allTaiKhoan = async (req, res) => {
    let {page} = req.query;
    let currentPage = 1;

    let parsePage = parseInt(page);
    if (!isNaN(parsePage)) {
        currentPage = parseInt(page);
    }

    let start = (currentPage - 1) * perPages;

    let sql = "SELECT * FROM user LIMIT ?, ?";

    let data = [];

    try {
        let query = await db.query(sql, [start, perPages]);
        data = query[0];
    }
    catch (err) {
        console.log(err);
    }

    let sqlCount = "SELECT COUNT(*) AS total FROM user";
    let dataCount = 0;

    try {
        let query = await db.query(sqlCount);
        dataCount = query[0][0].total;
    }
    catch (err) {
        console.log(err);
    }

    let pages = Math.ceil(dataCount / perPages);

    res.render('admin/all/taiKhoan', {data: data, pages: pages});
}

exports.allNguyenLieu = async (req, res) => {
    res.render('admin/all/nguyenLieu');
}

exports.allHoaDonBan = async (req, res) => {
    res.render('admin/all/hoaDonBan');
}

exports.allNhapHang = async (req, res) => {
    res.render('admin/all/nhapHang');
}

exports.allGiamGia = async (req, res) => {
    let {page} = req.query;
    let currentPage = 1;

    let parsePage = parseInt(page);
    if (!isNaN(parsePage)) {
        currentPage = parseInt(page);
    }

    let start = (currentPage - 1) * perPages;

    let sql = "SELECT * FROM giamgia ORDER BY GiamGia LIMIT ?, ?";

    let data = [];

    try {
        let query = await db.query(sql, [start, perPages]);
        data = query[0];
    }
    catch (err) {
        console.log(err);
    }

    let sqlCount = "SELECT COUNT(*) AS total FROM giamgia";
    let dataCount = 0;

    try {
        let query = await db.query(sqlCount);
        dataCount = query[0][0].total;
    }
    catch (err) {
        console.log(err);
    }

    let pages = Math.ceil(dataCount / perPages);
    res.render('admin/all/giamGia', {data: data, pages: pages});
}

exports.allLoaiSanPham = async (req, res) => {
    let {page} = req.query;
    let currentPage = 1;

    let parsePage = parseInt(page);
    if (!isNaN(parsePage)) {
        currentPage = parseInt(page);
    }

    let start = (currentPage - 1) * perPages;

    let sql = "SELECT * FROM loaisp LIMIT ?, ?";

    let data = [];

    try {
        let query = await db.query(sql, [start, perPages]);
        data = query[0];
    }
    catch (err) {
        console.log(err);
    }

    let sqlCount = "SELECT COUNT(*) AS total FROM loaisp";
    let dataCount = 0;

    try {
        let query = await db.query(sqlCount);
        dataCount = query[0][0].total;
    }
    catch (err) {
        console.log(err);
    }

    let pages = Math.ceil(dataCount / perPages);
    res.render('admin/all/loaiSanPham', {data: data, pages: pages});
}

exports.allNhaCungCap = async (req, res) => {
    let {page} = req.query;
    let currentPage = 1;

    let parsePage = parseInt(page);
    if (!isNaN(parsePage)) {
        currentPage = parseInt(page);
    }

    let start = (currentPage - 1) * perPages;

    let sql = "SELECT * FROM nhacungcap LIMIT ?, ?";

    let data = [];

    try {
        let query = await db.query(sql, [start, perPages]);
        data = query[0];
    }
    catch (err) {
        console.log(err);
    }

    let sqlCount = "SELECT COUNT(*) AS total FROM nhacungcap";
    let dataCount = 0;

    try {
        let query = await db.query(sqlCount);
        dataCount = query[0][0].total;
    }
    catch (err) {
        console.log(err);
    }

    let pages = Math.ceil(dataCount / perPages);
    console.log(data);
    console.log(pages);
    res.render('admin/all/nhaCungCap', {data: data, pages: pages});
}

exports.allDatBan = async (req, res) => {
    res.render('admin/all/datBan');
}

exports.allDonHang = async (req, res) => {
    res.render('admin/all/donHang');
}

exports.allCongThucMon = async (req, res) => {
    res.render('admin/all/congThucMon');
}

exports.allTruNguyenLieu = async (req, res) => {
    res.render('admin/all/truNguyenLieu');
}