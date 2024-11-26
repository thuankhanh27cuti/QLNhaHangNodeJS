const db = require('../config/db');

exports.index = async (req, res) => {
    let data = await db.query("SELECT LoaiSP, TenLoai FROM loaisp");
    let loaiSpList = data[0];
    for (const element of loaiSpList) {
        let id = element.LoaiSP;
        let data = await db.query("SELECT MaSP, TenSP, GiaBan, GioiThieuSP, Anh FROM danhmucsp WHERE MaLoai = ? LIMIT 5", [id]);
        element.monAnList = data[0];
    }
    // res.json(loaiSpList);
    res.render('user/index', { loaiSpList: loaiSpList });
}

exports.danhSachMonAn = async (req, res) => {
    let {maLoai, sort, page} = req.query;

    let loaiSp = await db.query("SELECT LoaiSP, TenLoai FROM loaisp");
    let loaiSpList = loaiSp[0];

    let sql = "SELECT d.MaSP AS MaSP, TenSP, GiaBan, Anh, GioiThieuSP, COALESCE(SUM(SoLuong), 0) AS SoLuong FROM danhmucsp d LEFT JOIN chitiethoadon c ON d.MaSP = c.MaSP";

    if (maLoai) {
        sql += ` WHERE MaLoai = ${maLoai}`;
    }
    sql += " GROUP BY MaSP, TenSP, GiaBan";
    if (sort) {
        let array = sort.split(',');
        let criteria = array[0];
        if (array.length === 2) {
            let direction = array[1];
            sql += ` ORDER BY ${criteria} ${direction}`;
        }
        else {
            sql += ` ORDER BY ${criteria}`;
        }
    }
    if (page) {
        let currentPage = parseInt(page);
        let start = (currentPage - 1) * 8;
        sql += ` LIMIT ${start}, 8`;
    }
    else {
        sql += ` LIMIT 8`;
    }

    let monAn = await db.query(sql);
    let monAnList = monAn[0];

    res.render('user/allMonAn', { loaiSpList: loaiSpList, monAnList: monAnList});
}

exports.datBan = async (req, res) => {
    let {ten, email, thoiGian, soNguoi, yeuCau} = req.body;
    let required = ten !== "" && email !== "" && thoiGian !== "" && soNguoi !== "";
    if (required) {
        await db.query("INSERT INTO datban SET ten = ?, email = ?, soNguoi = ?, yeuCau = ?, thoiGian = ?, trangThai = ?, userId = ?", [ten, email, soNguoi, yeuCau, thoiGian, 0, 6]);
    }
    // Todo: Need session id
    res.redirect("/");
}