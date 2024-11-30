const query = require('../query');

exports.index = async (req, res) => {
    let sqlLoaiSanPham = "SELECT LoaiSP, TenLoai FROM loaisp";
    let loaiSpList = await query.selectAll(sqlLoaiSanPham);
    for (const element of loaiSpList) {
        let id = element.LoaiSP;
        let sql = "SELECT MaSP, TenSP, GiaBan, GioiThieuSP, Anh FROM danhmucsp WHERE MaLoai = ? LIMIT 5";
        element.monAnList = await query.selectAllWithParams(sql, [id]);
    }

    res.render('user/index', { loaiSpList: loaiSpList });
}

exports.danhSachMonAn = async (req, res) => {
    let {maLoai, sort, page} = req.query;

    let sqlLoaiSanPham = "SELECT LoaiSP, TenLoai FROM loaisp";
    let loaiSpList = await query.selectAll(sqlLoaiSanPham);

    let sql = "SELECT d.MaSP AS MaSP, TenSP, GiaBan, Anh, GioiThieuSP, COALESCE(SUM(SoLuong), 0) AS SoLuong FROM danhmucsp d LEFT JOIN chitiethoadon c ON d.MaSP = c.MaSP";

    let sqlPages = "SELECT COUNT(*) AS count FROM danhmucsp";

    if (maLoai) {
        sql += ` WHERE MaLoai = ${maLoai}`;
        sqlPages += ` WHERE MaLoai = ${maLoai}`;
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

    let monAnList = await query.selectAll(sql);

    let queryTotalPage = await query.selectAll(sqlPages);
    let totalPages = queryTotalPage[0].count;
    let pages = Math.ceil(totalPages / 8);

    res.render('user/allMonAn', { loaiSpList: loaiSpList, monAnList: monAnList, pages: pages});
}

exports.datBan = async (req, res) => {
    let {ten, phone, thoiGian, soNguoi, yeuCau} = req.body;
    let userId = req.session.session.userId;

    let required = ten !== "" && phone !== "" && thoiGian !== "" && soNguoi !== "";
    if (required) {
        let sql = "INSERT INTO datban SET ten = ?, soDienThoai = ?, soNguoi = ?, yeuCau = ?, thoiGian = ?, trangThai = ?, userId = ?";
        await query.queryWithParams(sql, [ten, phone, soNguoi, yeuCau, thoiGian, 0, userId]);
    }

    res.redirect("/");
}

exports.chiTietMonAn = async (req, res) => {
    let {id} = req.query;

    let sql = "SELECT * FROM danhmucsp d LEFT JOIN loaisp ON d.MaLoai = loaisp.LoaiSP WHERE MaSP = ?";
    let data = await query.selectAllWithParams(sql, [id]);
    let monAn = data[0];

    console.log(data);

    res.render('user/chiTietMonAn', {data: monAn});
}