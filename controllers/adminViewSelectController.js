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

    res.render('admin/all/monAn', {data: data, pages: pages});
}

exports.allBaiViet = async (req, res) => {
    let {page} = req.query;
    let currentPage = 1;

    let parsePage = parseInt(page);
    if (!isNaN(parsePage)) {
        currentPage = parseInt(page);
    }

    let start = (currentPage - 1) * perPages;

    let sql = "SELECT MaSP, blog_tieu_de, blog_tom_tat, blog_uploaded_at, UserName, SUM(IF((b2.blog_id IS NULL AND b.blog_id IS NULL) OR (b2.blog_id IS NOT NULL AND b.blog_id IS NOT NULL), 0, 1)) AS need_reply FROM baiviet LEFT JOIN user u on baiviet.blog_author_id = u.userId LEFT JOIN binhluanbaiviet b on baiviet.MaSP = b.blog_id LEFT JOIN traloibinhluan b2 on b.blog_id = b2.blog_id and b.user_id = b2.user_id GROUP BY MaSP, blog_uploaded_at ORDER BY blog_uploaded_at LIMIT ?, ?";

    let data = await query.selectAllWithParams(sql, [start, perPages]);

    let sqlCount = "SELECT COUNT(*) AS total FROM baiviet";
    let queryCount = await query.selectAll(sqlCount);
    let dataCount = queryCount[0].total;

    let pages = Math.ceil(dataCount / perPages);

    res.render('admin/all/baiViet', {data: data, pages: pages});
}

exports.allBinhLuanBaiViet = async (req, res) => {
    let {id, page} = req.query;
    let currentPage = 1;

    let parsePage = parseInt(page);
    if (!isNaN(parsePage)) {
        currentPage = parseInt(page);
    }

    let start = (currentPage - 1) * perPages;

    let sql = `SELECT u.userId, u.UserName, comment_text, comment_text, u2.userId, u2.UserName, reply_text, reply_time FROM binhluanbaiviet b LEFT JOIN baiviet b2 on b2.MaSP = b.blog_id LEFT JOIN user u on u.userId = b.user_id LEFT JOIN traloibinhluan t on b.blog_id = t.blog_id and b.user_id = t.user_id LEFT JOIN user u2 on u2.userId = t.user_reply_id WHERE b.blog_id = ? LIMIT ?, ?`;

    let data = await query.selectAllWithParams(sql, [id, start, perPages]);

    let sqlCount = "SELECT COUNT(*) AS count FROM binhluanbaiviet WHERE blog_id = ?";
    let queryCount = await query.selectAllWithParams(sqlCount, [id]);
    let dataCount = queryCount[0].total;

    let pages = Math.ceil(dataCount / perPages);

    res.render('admin/all/binhLuanBaiViet', {data: data, pages: pages});
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

    let data = await query.selectAllWithParams(sql, [start, perPages]);

    let sqlCount = "SELECT COUNT(*) AS total FROM user";
    let queryCount = await query.selectAll(sqlCount);
    let dataCount = queryCount[0].total;

    let pages = Math.ceil(dataCount / perPages);

    res.render('admin/all/taiKhoan', {data: data, pages: pages});
}

exports.allNguyenLieu = async (req, res) => {
    let {page} = req.query;
    let currentPage = 1;

    let parsePage = parseInt(page);
    if (!isNaN(parsePage)) {
        currentPage = parseInt(page);
    }

    let start = (currentPage - 1) * perPages;

    let sql = "SELECT * FROM nguyenlieu ORDER BY MaNL LIMIT ?, ?";

    let data = await query.selectAllWithParams(sql, [start, perPages]);

    let sqlCount = "SELECT COUNT(*) AS total FROM nguyenlieu";
    let queryCount = await query.selectAll(sqlCount);
    let dataCount = queryCount[0].total;

    let pages = Math.ceil(dataCount / perPages);

    res.render('admin/all/nguyenLieu', {data: data, pages: pages});
}

exports.allHoaDonBan = async (req, res) => {
    res.render('admin/all/hoaDonBan');
}

exports.allNhapHang = async (req, res) => {
    let {tungay, denngay} = req.query;

    let data = [];

    let required = tungay !== undefined && denngay !== undefined && tungay !== "" && denngay !== "";

    let total = 0;

    if (required) {
        let sql = "SELECT MaHoaDonNhap, NgayNhapHang, Ho, Ten FROM baocaohoadonnhap WHERE DATE(NgayNhapHang) BETWEEN ? AND ?";
        data = await query.selectAllWithParams(sql, [tungay, denngay]);

        for (let i = 0; i < data.length; i++) {
            let maHoaDonNhap = data[i].MaHoaDonNhap;
            let sql = "SELECT SUM(TongTien) AS TongTien FROM hoadonnhap inner JOIN chitiethoadonnhap on chitiethoadonnhap.MaHoaDonNhap = hoadonnhap.MaHoaDonNhap WHERE hoadonnhap.MaHoaDonNhap = ?";
            let tongTien = await query.selectAllWithParams(sql, [maHoaDonNhap]);
            data[i].tongTien = tongTien[0].TongTien || 0;
            total = total + data[i].tongTien;
        }
    }
    else {
        tungay = "";
        denngay = "";
    }

    res.render('admin/all/nhapHang', {data: data, tungay: tungay, denngay: denngay, total: total});
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

    let data = await query.selectAllWithParams(sql, [start, perPages]);

    let sqlCount = "SELECT COUNT(*) AS total FROM giamgia";
    let queryCount = await query.selectAll(sqlCount);
    let dataCount = queryCount[0].total;

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

    let data = await query.selectAllWithParams(sql, [start, perPages]);

    let sqlCount = "SELECT COUNT(*) AS total FROM loaisp";
    let queryCount = await query.selectAll(sqlCount);
    let dataCount = queryCount[0].total;

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

    let data = await query.selectAllWithParams(sql, [start, perPages]);

    let sqlCount = "SELECT COUNT(*) AS total FROM nhacungcap";
    let queryCount = await query.selectAll(sqlCount);
    let dataCount = queryCount[0].total;

    let pages = Math.ceil(dataCount / perPages);
    res.render('admin/all/nhaCungCap', {data: data, pages: pages});
}

exports.allDatBan = async (req, res) => {
    let {page} = req.query;
    let currentPage = 1;

    let parsePage = parseInt(page);
    if (!isNaN(parsePage)) {
        currentPage = parseInt(page);
    }

    let start = (currentPage - 1) * perPages;

    let sql = "SELECT * FROM datban ORDER BY thoiGian DESC LIMIT ?, ?";

    let data = await query.selectAllWithParams(sql, [start, perPages]);

    let sqlCount = "SELECT COUNT(*) AS total FROM datban";
    let queryCount = await query.selectAll(sqlCount);
    let dataCount = queryCount[0].total;

    let pages = Math.ceil(dataCount / perPages);
    res.render('admin/all/datBan', {data: data, pages: pages});
}

exports.allDonHang = async (req, res) => {
    let {page} = req.query;
    let currentPage = 1;

    let parsePage = parseInt(page);
    if (!isNaN(parsePage)) {
        currentPage = parseInt(page);
    }

    let start = (currentPage - 1) * perPages;

    let sql = "SELECT MaHoaDon, NgayLap, UserName, MaBan, MaGiamGia, PhuongThucTT, hoadonban.GhiChu, trangthai FROM hoadonban LEFT JOIN user u on hoadonban.userId = u.userId ORDER BY NgayLap DESC LIMIT ?, ?";

    // Todo: Sửa phương thức thanh toán trong cơ sở dữ liệu gốc

    let data = await query.selectAllWithParams(sql, [start, perPages]);

    let sqlCount = "SELECT COUNT(*) AS total FROM hoadonban";
    let queryCount = await query.selectAll(sqlCount);
    let dataCount = queryCount[0].total;

    let pages = Math.ceil(dataCount / perPages);

    res.render('admin/all/donHang', {data: data, pages: pages});
}

exports.allCongThucMon = async (req, res) => {
    let {page} = req.query;
    let currentPage = 1;

    let parsePage = parseInt(page);
    if (!isNaN(parsePage)) {
        currentPage = parseInt(page);
    }

    let start = (currentPage - 1) * perPages;

    let sql = "SELECT MaSP, TenSP FROM danhmucsp LIMIT ?, ?";

    let data = await query.selectAllWithParams(sql, [start, perPages]);

    for (let i = 0; i < data.length; i++) {
        let maSp = data[i].MaSP;
        let sql = "SELECT TenNL, SoLuongCanDung FROM congthucmon c RIGHT JOIN danhmucsp d on c.MaSP = d.MaSP RIGHT JOIN nguyenlieu n on n.MaNL = c.MaNL WHERE d.MaSP = ?";
        data[i].congThuc = await query.selectAllWithParams(sql, [maSp]);
    }

    let sqlCount = "SELECT COUNT(*) AS total FROM danhmucsp";
    let queryCount = await query.selectAll(sqlCount);
    let dataCount = queryCount[0].total;

    let pages = Math.ceil(dataCount / perPages);

    res.render('admin/all/congThucMon', {data: data, pages: pages});
}

exports.allTruNguyenLieu = async (req, res) => {
    let {page} = req.query;
    let currentPage = 1;

    let parsePage = parseInt(page);
    if (!isNaN(parsePage)) {
        currentPage = parseInt(page);
    }

    let start = (currentPage - 1) * perPages;

    let sql = "SELECT id, time, quantity, l.MaNL, TenNL, DonGiaNhap FROM lichsunguyenlieu l LEFT JOIN nguyenlieu n on n.MaNL = l.MaNL LIMIT ?, ?";

    let data = await query.selectAllWithParams(sql, [start, perPages]);

    let sqlCount = "SELECT COUNT(*) AS total FROM lichsunguyenlieu";
    let queryCount = await query.selectAll(sqlCount);
    let dataCount = queryCount[0].total;

    let pages = Math.ceil(dataCount / perPages);

    res.render('admin/all/truNguyenLieu', {data: data, pages: pages});
}

exports.chartDate = async (req, res) => {
    res.render('admin/chart/date');
}

exports.chartMonth = async (req, res) => {
    res.render('admin/chart/month');
}

exports.chartYear = async (req, res) => {
    let {year} = req.query;
    let yearParams = 0;

    let parseYear = parseInt(year);
    if (!isNaN(parseYear)) {
        yearParams = parseInt(year);
    }
    else {
        yearParams = new Date().getFullYear();
    }

    res.render('admin/chart/year', {yearParams: yearParams});
}