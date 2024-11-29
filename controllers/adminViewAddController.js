const query = require('../query');

exports.addMonAn = async (req, res) => {
    let sqlLoai = "SELECT LoaiSP, TenLoai FROM loaisp";
    let resultLoai = await query.selectAll(sqlLoai);
    res.render('admin/add/monAn', {loaiSP: resultLoai});
}

exports.handleAddMonAn = async (req, res) => {
    let {maLoai, tenSP, giaBan, gioiThieuSP} = req.body;
    let anh = req.file.filename;
    let sql = "INSERT INTO danhmucsp(TenSP, GiaBan, GioiThieuSP, Anh, MaLoai) VALUES (?, ?, ?, ?, ?)";

    await query.queryWithParams(sql, [tenSP, giaBan, gioiThieuSP, anh, maLoai]);

    res.redirect('/admin/mon-an');
}

exports.addUser = async (req, res) => {
    res.render('admin/add/taiKhoan');
}

exports.handleAddUser = async (req, res) => {
    let {username, password, ho, ten, role, phone, diaChi, ngaySinh, email} = req.body;

    let required = false;

    let sqlCountUser = "SELECT COUNT(*) AS count FROM user WHERE username = ?";
    let dataCountUser = await query.selectAllWithParams(sqlCountUser, [username]);
    let countUser = dataCountUser[0].count;
    if (countUser === 0) {
        if (email === "") {
            required = true;
        }
        else {
            let sqlCount = "SELECT COUNT(*) AS count FROM user WHERE email = ?";
            let dataCount = await query.selectAllWithParams(sqlCount, [email, username]);

            let count = await dataCount[0].count;
            if (count === 0) {
                required = true;
            }
        }
    }

    if (required === true) {
        if (ngaySinh !== "") {
            let sql = "INSERT INTO user(UserName, PassWord, LoaiUser, Ho, Ten, DiaChi, SDT, NgaySinh, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

            await query.queryWithParams(sql, [username, password, role, ho, ten, diaChi, phone, ngaySinh, email]);
        }
        else {
            let sql = "INSERT INTO user(UserName, PassWord, LoaiUser, Ho, Ten, DiaChi, SDT, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            await query.queryWithParams(sql, [username, password, role, ho, ten, diaChi, phone, email]);
        }
    }

    res.redirect('/admin/tai-khoan');
}

exports.addNguyenLieu = async (req, res) => {
    res.render('admin/add/nguyenLieu');
}
exports.handleAddNguyenLieu = async (req, res) => {
    let {tenNL, donGiaNhap, soLuongCon } = req.body;
    let sql = "INSERT INTO nguyenlieu(TenNL, DonGiaNhap, SoLuongCon) VALUES (?, ?, ?)";
    await query.queryWithParams(sql, [tenNL, donGiaNhap, soLuongCon]);

    res.redirect('/admin/nguyen-lieu');
}

exports.addGiamGia = async (req, res) => {
    res.render('admin/add/giamGia');
}

exports.handleAddGiamGia = async (req, res) => {
    let {maGiamGia, giamGia} = req.body;

    let sqlCount = "SELECT COUNT(*) AS count FROM giamgia WHERE MaGiamGia = ?";
    let dataCount = await query.selectAllWithParams(sqlCount, [maGiamGia]);
    let count = dataCount[0].count;

    if (count === 0) {
        let sql = "INSERT INTO giamgia(MaGiamGia, GiamGia) VALUES (?, ?)";
        await query.queryWithParams(sql, [maGiamGia, giamGia]);
    }

    res.redirect('/admin/giam-gia');
}

exports.addLoaiSanPham = async (req, res) => {
    res.render('admin/add/loaiSanPham');
}

exports.handleAddLoaiSanPham = async (req, res) => {
    let {tenLoai} = req.body;
    let sql = "INSERT INTO loaisp(TenLoai) VALUES (?)";
    await query.queryWithParams(sql, [tenLoai]);
    res.redirect('/admin/loai-san-pham');
}

exports.addNhaCungCap = async (req, res) => {
    res.render('admin/add/nhaCungCap');
}

exports.handleAddNhaCungCap = async (req, res) => {
    let {ten, diaChi, ghiChu} = req.body;
    let sql = "INSERT INTO nhacungcap(TenNCC, DiaChi, GhiChu) VALUES (?, ?, ?)";
    await query.queryWithParams(sql, [ten, diaChi, ghiChu]);
    res.redirect('/admin/nha-cung-cap');
}