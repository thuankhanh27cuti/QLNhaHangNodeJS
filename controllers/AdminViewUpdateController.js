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

    if (user.NgaySinh) {
        let ngaySinh = new Date(user.NgaySinh);
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
    let { maGiamGia, giamGia} = req.body;

    let sql = "UPDATE giamgia SET GiamGia = ? WHERE MaGiamGia = ?";
    await query.queryWithParams(sql, [giamGia, maGiamGia]);

    res.redirect('/admin/giam-gia');
}

exports.updateLoaiSanPham = async (req, res) => {
    let {id} = req.query;

    let sql = "SELECT * FROM loaisp WHERE LoaiSP = ?";
    let select = await query.selectAllWithParams(sql, [id]);
    let data = select[0];

    res.render('admin/update/loaiSanPham', {data: data});
}

exports.handleUpdateLoaiSanPham = async (req, res) => {
    let {id, ten} = req.body;

    let sql = "UPDATE loaisp SET TenLoai = ? WHERE LoaiSP = ?";
    await query.queryWithParams(sql, [ten, id]);

    res.redirect('/admin/loai-san-pham');
}

exports.updateNhaCungCap = async (req, res) => {
    let {id} = req.query;

    let sql = "SELECT * FROM nhacungcap WHERE MaNCC = ?";
    let select = await query.selectAllWithParams(sql, [id]);
    let data = select[0];

    res.render('admin/update/nhaCungCap', {data: data});
}

exports.handleUpdateNhaCungCap = async (req, res) => {
    let {id, ten, diaChi, ghiChu} = req.body;

    let sql = "UPDATE nhacungcap SET TenNCC = ?, DiaChi = ?, GhiChu = ? WHERE MaNCC = ?";
    await query.queryWithParams(sql, [ten, diaChi, ghiChu, id]);

    res.redirect('/admin/nha-cung-cap');
}

exports.updateDatBan = async (req, res) => {
    let {id} = req.query;

    let sql = "SELECT d.id, d.ten, d.soDienThoai, d.soNguoi, d.yeuCau, d.thoiGian, d.trangThai, d.userId, u.UserName FROM datban d LEFT JOIN user u on u.userId = d.userId WHERE d.id = ?";
    let select = await query.selectAllWithParams(sql, [id]);
    let data = select[0];

    let thoiGian = data.thoiGian;

    data.thoiGian = `${thoiGian.getFullYear()}-${padStart(thoiGian.getMonth() + 1)}-${padStart(thoiGian.getDate())}T${padStart(thoiGian.getHours())}:${padStart(thoiGian.getMinutes())}`;

    res.render('admin/update/datBan', {data: data});
}

exports.handleUpdateDatBan = async (req, res) => {
    let {id, soNguoi, yeuCau, thoiGian, trangThai} = req.body;

    let sql = "UPDATE datban SET soNguoi = ?, yeuCau = ?, thoiGian = ?, trangThai = ? WHERE id = ?";
    await query.queryWithParams(sql, [soNguoi, yeuCau, thoiGian, trangThai, id]);

    res.redirect('/admin/dat-ban');
}

exports.updateDonHang = async (req, res) => {
    let {id} = req.query;

    let sql = "SELECT MaHoaDon, NgayLap, PhuongThucTT, h.GhiChu, trangthai, h.MaGiamGia, h.userId, UserName, GiamGia FROM hoadonban h LEFT JOIN user u on h.userId = u.userId LEFT JOIN giamgia g on h.MaGiamGia = g.MaGiamGia WHERE MaHoaDon = ?";

    let select = await query.selectAllWithParams(sql, [id]);
    let data = select[0];

    let thoiGian = data.NgayLap;
    data.NgayLap = `${thoiGian.getFullYear()}-${padStart(thoiGian.getMonth() + 1)}-${padStart(thoiGian.getDate())}T${padStart(thoiGian.getHours())}:${padStart(thoiGian.getMinutes())}`;

    res.render('admin/update/donHang', {data: data});
}

exports.handleUpdateDonHang = async (req, res) => {
    let {id, trangThai} = req.body;

    let sqlSelect = "SELECT trangthai FROM hoadonban WHERE MaHoaDon = ?";
    let dataSelect = await query.selectAllWithParams(sqlSelect, [id]);
    if (dataSelect[0].trangthai === 0) {
        let sqlUpdate = "UPDATE hoadonban SET trangthai = ? WHERE MaHoaDon = ?";

        await query.queryWithParams(sqlUpdate, [trangThai, id]);

        if (parseInt(trangThai) === 1) {
            let sqlNguyenLieu = `SELECT n.MaNL, SUM(SoLuongCanDung) AS SoLuongCanDung, SoLuongCon FROM hoadonban LEFT JOIN chitiethoadon c on hoadonban.MaHoaDon = c.MaHoaDon LEFT JOIN danhmucsp d on d.MaSP = c.MaSP LEFT JOIN congthucmon c2 on d.MaSP = c2.MaSP LEFT JOIN nguyenlieu n on n.MaNL = c2.MaNL WHERE c.MaHoaDon = ? AND c2.MaSP IS NOT NULL GROUP BY n.MaNL;`;
            let dataNguyenLieu = await query.selectAllWithParams(sqlNguyenLieu, [id]);

            let sqlLichSuNguyenLieu = "INSERT INTO lichsunguyenlieu(time, quantity, maNL) VALUES (NOW(), ?, ?);";
            let sqlUpdateNguyenLieu = "UPDATE nguyenlieu SET SoLuongCon = ? WHERE MaNL = ?;";

            let promises = [];

            for (let i = 0; i < dataNguyenLieu.length; i++) {
                let maNl = dataNguyenLieu[i].MaNL;
                let soLuongCon = dataNguyenLieu[i].SoLuongCon;
                let soLuongCanDung = dataNguyenLieu[i].SoLuongCanDung;
                let newSoLuongCon = soLuongCon - soLuongCanDung;

                promises.push(query.queryWithParams(sqlLichSuNguyenLieu, [soLuongCanDung, maNl]));
                promises.push(query.queryWithParams(sqlUpdateNguyenLieu, [newSoLuongCon, maNl]));
            }

            await Promise.all(promises);
        }

        res.redirect('/admin/don-hang');
    }
    else {
        res.redirect('/admin/don-hang');
    }
}

exports.updateCongThucMon = async (req, res) => {
    let {id} = req.query;

    let sqlSelectCongThucMon = "SELECT * FROM nguyenlieu n LEFT JOIN congthucmon c on n.MaNL = c.MaNL LEFT JOIN danhmucsp d on d.MaSP = c.MaSP WHERE d.MaSP = ?";

    let data = await query.selectAllWithParams(sqlSelectCongThucMon, [id]);

    let sqlNguyenLieu = "SELECT MaNL, TenNL, SoLuongCon FROM nguyenlieu";
    let dataNguyenLieu = await query.selectAll(sqlNguyenLieu);

    res.render('admin/update/congThucMon', {data: data, dataNguyenLieu: dataNguyenLieu});
}

exports.handleUpdateCongThucMon = async (req, res) => {
    let id = parseInt(req.query.id);
    let data = JSON.parse(req.body.update);

    let sqlDelete = "DELETE FROM congthucmon WHERE MaSP = ?";
    await query.queryWithParams(sqlDelete, [id]);

    let sqlInsert = "INSERT INTO congthucmon(SoLuongCanDung, MaSP, MaNL) VALUES (?, ?, ?)";

    for (let i = 0; i < data.length; i++) {
        let el = data[i];
        let params = [el.quantity, id, el.id]
        await query.queryWithParams(sqlInsert, params);
    }

    res.redirect('/admin/cong-thuc-mon');
}

exports.updateBaiViet = async (req, res) => {
    let id = parseInt(req.query.id);
    let error = req.query.error;
    let notification = "";
    let requireImage = true;
    if (error === "email") {
        notification = "Bạn cần tải lên ảnh bìa của blog.";
    }

    let sqlSelectSanPham = "SELECT MaSP, TenSP FROM danhmucsp WHERE MaSP = ?";
    let dataSanPham = await query.selectAllWithParams(sqlSelectSanPham, [id]);
    let data = dataSanPham[0];

    let sqlCountBlogById = "SELECT COUNT(*) AS count FROM baiviet WHERE MaSP = ?";
    let dataCountBlogById = await query.selectAllWithParams(sqlCountBlogById, [id]);
    let countBlogById = dataCountBlogById[0].count;

    let inputTieuDe = "";
    let inputTomTat = "";
    let inputNoiDung = "";
    let inputAnh = "";

    if (countBlogById === 1) {
        let sqlSelectBlogById = "SELECT MaSP, blog_tieu_de, blog_tom_tat, blog_image_url, blog_noi_dung, blog_uploaded_at, blog_author_id FROM baiviet WHERE MaSP = ?";
        let dataSelectBlogById = await query.selectAllWithParams(sqlSelectBlogById, [id]);

        let selectBlogById = dataSelectBlogById[0];

        inputTieuDe = selectBlogById.blog_tieu_de;
        inputTomTat = selectBlogById.blog_tom_tat;
        inputNoiDung = selectBlogById.blog_noi_dung;
        inputAnh = selectBlogById.blog_image_url;

        requireImage = false;
    }

    res.render('admin/update/baiViet', {
        data: data,
        inputTieuDe: inputTieuDe,
        inputTomTat: inputTomTat,
        inputNoiDung: inputNoiDung,
        inputAnh: inputAnh,
        notification: notification,
        requireImage: requireImage
    });
}

exports.handleUpdateBaiViet = async (req, res) => {
    let id = parseInt(req.query.id);
    let {tieuDe, tomTat, noiDung} = req.body;

    let fileName;
    let isUploaded = false;

    if (req.file) {
        isUploaded = true;
        fileName = req.file.filename;
    }

    if (isUploaded) {
        console.log(fileName);
    }

    let sqlCountBlogById = "SELECT COUNT(*) AS count FROM baiviet WHERE MaSP = ?";
    let dataCountBlogById = await query.selectAllWithParams(sqlCountBlogById, [id]);
    let countBlogById = dataCountBlogById[0].count;

    if (countBlogById === 1) {
        if (isUploaded) {
            let sql = "UPDATE baiviet SET blog_image_url = ?, blog_tom_tat = ?, blog_noi_dung = ?, blog_tieu_de = ? WHERE MaSP = ?";
            await query.queryWithParams(sql, [fileName, tomTat, noiDung, tieuDe, id]);
        }
        else {
            let sql = "UPDATE baiviet SET blog_tom_tat = ?, blog_noi_dung = ?, blog_tieu_de = ? WHERE MaSP = ?";
            await query.queryWithParams(sql, [tomTat, noiDung, tieuDe, id]);
        }
        return res.redirect("/admin/bai-viet");
    }
    else {
        let userId = req.session.session.userId;

        if (isUploaded) {
            let sql = "INSERT INTO baiviet(MaSP, blog_image_url, blog_tom_tat, blog_noi_dung, blog_uploaded_at, blog_author_id, blog_tieu_de) VALUES (?, ?, ?, ?, NOW(), ?, ?)";
            await query.queryWithParams(sql, [id, fileName, tomTat, noiDung, userId, tieuDe]);
            return res.redirect("/admin/bai-viet");
        }
        else {
            return res.redirect(`/admin/update/bai-viet?id=${id}&error=image`);
        }
    }
}

exports.updatePhanHoiBinhLuan = async (req, res) => {
    let id = parseInt(req.query.id);
    let userId = parseInt(req.query.userId);

    let sql = "SELECT b.blog_id, b.user_id, comment_text, blog_tieu_de, UserName, reply_text FROM binhluanbaiviet b LEFT JOIN baiviet b2 on b2.MaSP = b.blog_id LEFT JOIN user u on u.userId = b.user_id LEFT JOIN traloibinhluan t on b.blog_id = t.blog_id and b.user_id = t.user_id WHERE b.blog_id = ? AND b.user_id = ?";
    let dataBinhLuan = await query.selectAllWithParams(sql, [id, userId]);
    let data = dataBinhLuan[0];

    res.render('admin/update/phanHoiBinhLuan', {data: data});
}

exports.handleUpdatePhanHoiBinhLuan = async (req, res) => {
    let id = parseInt(req.query.id);
    let userId = parseInt(req.query.userId);
    let reply = req.body.reply;

    let sql = "UPDATE traloibinhluan SET reply_text = ? WHERE user_id = ? AND blog_id = ?";
    await query.queryWithParams(sql, [reply, userId, id]);

    res.redirect(`/admin/binh-luan-bai-viet?id=${id}`);
}

const padStart = (number) => {
    return number.toString().padStart(2, "0");
};