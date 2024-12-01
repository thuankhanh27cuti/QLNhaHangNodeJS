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

exports.addPhanHoiBinhLuan = async (req, res) => {
    let id = parseInt(req.query.id);
    let userId = parseInt(req.query.userId);

    let sqlCount = "SELECT COUNT(*) AS count FROM traloibinhluan WHERE user_id = ? AND blog_id = ?";
    let dataCount = await query.selectAllWithParams(sqlCount, [userId, id]);
    let count = dataCount[0].count;

    if (count === 0) {
        let sql = "SELECT blog_id, user_id, comment_text, blog_tieu_de, UserName FROM binhluanbaiviet b LEFT JOIN baiviet b2 on b2.MaSP = b.blog_id LEFT JOIN user u on u.userId = b.user_id WHERE blog_id = ? AND user_id = ?";
        let dataBinhLuan = await query.selectAllWithParams(sql, [id, userId]);
        let data = dataBinhLuan[0];

        res.render('admin/add/phanHoiBinhLuan', {data: data});
    }
    else {
        return res.redirect(`/admin/binh-luan-bai-viet?id=${id}`);
    }
}

exports.handleAddPhanHoiBinhLuan = async (req, res) => {
    let id = parseInt(req.query.id);
    let userId = parseInt(req.query.userId);
    let userReplyId = req.session.session.userId;
    let reply = req.body.reply;

    let sqlCount = "SELECT COUNT(*) AS count FROM traloibinhluan WHERE user_id = ? AND blog_id = ?";
    let dataCount = await query.selectAllWithParams(sqlCount, [userId, id]);
    let count = dataCount[0].count;

    if (count === 0) {
        let sql = "INSERT INTO traloibinhluan(blog_id, user_id, user_reply_id, reply_text, reply_time) VALUES (?, ?, ?, ?, NOW())";
        await query.queryWithParams(sql, [id, userId, userReplyId, reply]);
        res.redirect(`/admin/binh-luan-bai-viet?id=${id}`);
    }
    else {
        return res.redirect(`/admin/binh-luan-bai-viet?id=${id}`);
    }
}