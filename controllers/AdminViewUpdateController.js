const query = require('../query');

exports.updateMonAn = async (req, res) => {
    let {id} = req.query;

    let sql = "SELECT * FROM danhmucsp WHERE MaSP = ?";
    let data = await query.selectAllWithParams(sql, [id]);
    let monAn = data[0];

    let sqlLoai = "SELECT LoaiSP, TenLoai FROM loaisp";
    let resultLoai = await query.selectAll(sqlLoai);

    res.render('admin/update/monAn', {monAn: monAn, loaiSP: resultLoai});
}

exports.handleUpdateMonAn = async (req, res) => {
    let {maSP, maLoai, tenSP, giaBan, gioiThieuSP} = req.body;
    let fileName;
    let isUploaded = false;

    if (req.file) {
        isUploaded = true;
        fileName = req.file.filename;
    }
    if (isUploaded) {
        let sql = "UPDATE danhmucsp SET MaLoai = ?, TenSP = ?, GiaBan = ?, GioiThieuSP = ?, Anh = ? WHERE MaSP = ?";
        await query.queryWithParams(sql, [maLoai, tenSP, giaBan, gioiThieuSP, fileName, maSP]);
    }
    else {
        let sql = "UPDATE danhmucsp SET MaLoai = ?, TenSP = ?, GiaBan = ?, GioiThieuSP = ? WHERE MaSP = ?";
        await query.queryWithParams(sql, [maLoai, tenSP, giaBan, gioiThieuSP, maSP]);
    }
    res.redirect('/admin/mon-an');
}

exports.updateUser = async (req, res) => {
    let {id} = req.query;
    let sql = "SELECT * FROM user WHERE userId = ?";
    let data = await query.selectAllWithParams(sql, [id]);
    let user = data[0];
    let ngaySinh = new Date(user.NgaySinh);
    if (ngaySinh) {
        user.NgaySinh = `${ngaySinh.getFullYear()}-${padStart(ngaySinh.getMonth() + 1)}-${padStart(ngaySinh.getDate())}`;
    }
    res.render('admin/update/user', {data: user});
}

exports.handleUpdateUser = async (req, res) => {
    let {username, password, ho, ten, email, loaiUser, phone, address, ngaySinh} = req.body;

    let isUpdate = true;

    if (email !== "") {
        let sqlCount = "SELECT COUNT(*) AS count FROM user WHERE email = ? AND UserName != ?";
        let dataCount = await query.selectAllWithParams(sqlCount, [email, username]);
        let count = dataCount[0].count;

        isUpdate = count === 0;
    }

    if (isUpdate) {
        if (ngaySinh !== "") {
            let sqlUpdate = "UPDATE user SET PassWord = ?, email = ?, Ho = ?, Ten = ?, DiaChi = ?, SDT = ?, NgaySinh = ?, LoaiUser = ? WHERE UserName = ?";
            await query.queryWithParams(sqlUpdate, [password, email, ho, ten, address, phone, ngaySinh, loaiUser, username]);
        }
        else {
            let sqlUpdate = "UPDATE user SET PassWord = ?, email = ?, Ho = ?, Ten = ?, DiaChi = ?, SDT = ?, NgaySinh = NULL, LoaiUser = ? WHERE UserName = ?";
            await query.queryWithParams(sqlUpdate, [password, email, ho, ten, address, phone, loaiUser, username]);
        }
    }

    res.redirect('/admin/tai-khoan');
}

exports.updateNguyenLieu = async (req, res) => {
    let {id} = req.query;

    let sql = "SELECT * FROM nguyenlieu WHERE MaNL = ?";
    let select = await query.selectAllWithParams(sql, [id]);
    let data = select[0];

    res.render('admin/update/nguyenLieu', {data: data});
}

exports.handleUpdateNguyenLieu = async (req, res) => {
    let {maNL, tenNL, donGiaNhap, soLuongCon} = req.body;

    let sql = "UPDATE nguyenlieu SET TenNL = ?, DonGiaNhap = ?, soLuongCon = ? WHERE MaNL = ?";
    await query.queryWithParams(sql, [tenNL, donGiaNhap, soLuongCon, maNL]);

    res.redirect('/admin/nguyen-lieu');
}
exports.updateSoLuongNguyenLieu = async (req, res) => {
    let {id} = req.query;

    let sql = "SELECT * FROM nguyenlieu WHERE MaNL = ?";
    let select = await query.selectAllWithParams(sql, [id]);
    let data = select[0];

    let sqlNhaCungCap = "SELECT MaNCC, TenNCC FROM nhacungcap";
    let dataNhaCungCap = await query.selectAll(sqlNhaCungCap);

    res.render('admin/update/soLuongNguyenLieu', {data: data, nhaCungCap: dataNhaCungCap});
}

exports.handleUpdateSoLuongNguyenLieu = async (req, res) => {
    let { maNL, NCC, nhapThem } = req.body;

    let userId = req.session.session.userId;
    let date = new Date();

    let sqlInsertHoaDon = "INSERT INTO hoadonnhap(MaNCC, userId, NgayNhapHang) VALUES (?, ?, ?)";
    let maHoaDonNhap = await query.insertAndGetId(sqlInsertHoaDon, [NCC, userId, date]);

    let sql = "SELECT TenNL, DonGiaNhap, SoLuongCon FROM nguyenlieu WHERE MaNL = ?";
    let select = await query.selectAllWithParams(sql, [maNL]);
    let data = select[0];

    let donGiaNhap = data.DonGiaNhap;
    let soLuongCon = data.SoLuongCon;

    let total = parseInt(nhapThem) * donGiaNhap;

    let sqlInsertChiTietHoaDonNhap = "INSERT INTO chitiethoadonnhap(MaHoaDonNhap, MaNL, SoLuongNhap, TongTien) VALUES (?, ?, ?, ?)";
    await query.queryWithParams(sqlInsertChiTietHoaDonNhap, [maHoaDonNhap, maNL, nhapThem, total]);

    let sqlUpdateSoLuong = "UPDATE nguyenlieu SET SoLuongCon = ? WHERE MaNL = ?";
    let newSoLuongCon = soLuongCon + parseInt(nhapThem);

    await query.queryWithParams(sqlUpdateSoLuong, [newSoLuongCon, maNL]);

    res.redirect('/admin/nguyen-lieu');
}

exports.updateGiamGia = async (req, res) => {
    let {id} = req.query;

    let sql = "SELECT * FROM giamgia WHERE MaGiamGia = ?";
    let select = await query.selectAllWithParams(sql, [id]);
    let data = select[0];

    res.render('admin/update/giamGia', {data: data});
}

exports.handleUpdateGiamGia = async (req, res) => {
    console.log(req.body);
    let { maGiamGia, giamGia} = req.body;

    res.redirect('/admin/giam-gia');
}

const padStart = (number) => {
    return number.toString().padStart(2, "0");
};