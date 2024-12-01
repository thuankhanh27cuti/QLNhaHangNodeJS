const query = require('../query');

exports.handleDeleteMonAn = async (req, res) => {
    let {id} = req.query;

    let sql = "DELETE FROM danhmucsp WHERE MaSP = ?";
    await query.queryWithParams(sql, [id]);

    res.redirect('/admin/mon-an');
};

exports.handleDeleteUser = async (req, res) => {
    let {id} = req.query;

    let sql = "DELETE FROM user WHERE userId = ?";
    await query.queryWithParams(sql, [id]);

    res.redirect('/admin/tai-khoan');
};

exports.handleDeleteNguyenLieu = async (req, res) => {
    let {id} = req.query;

    let sql = "DELETE FROM nguyenlieu WHERE MaNL = ?";
    await query.queryWithParams(sql, [id]);

    res.redirect('/admin/nguyen-lieu');
};

exports.handleDeleteGiamGia = async (req, res) => {
    let {id} = req.query;

    let sql = "DELETE FROM giamgia WHERE MaGiamGia = ?";
    await query.queryWithParams(sql, [id]);

    res.redirect('/admin/giam-gia');
};

exports.handleDeleteLoaiSanPham = async (req, res) => {
    let {id} = req.query;

    let sql = "DELETE FROM loaisp WHERE LoaiSP = ?";
    await query.queryWithParams(sql, [id]);

    res.redirect('/admin/loai-san-pham');
};

exports.handleDeleteNhaCungCap = async (req, res) => {
    let {id} = req.query;

    let sql = "DELETE FROM nhacungcap WHERE MaNCC = ?";
    await query.queryWithParams(sql, [id]);

    res.redirect('/admin/nha-cung-cap');
};

exports.handleDeleteDatBan = async (req, res) => {
    let {id} = req.query;

    let sql = "DELETE FROM datban WHERE id = ?";
    await query.queryWithParams(sql, [id]);

    res.redirect('/admin/dat-ban');
};

exports.handleDeleteBaiViet = async (req, res) => {
    let {id} = req.query;

    let sql = "DELETE FROM baiviet WHERE MaSP = ?";
    await query.queryWithParams(sql, [id]);

    res.redirect('/admin/bai-viet');
};

exports.handleDeletePhanHoiBinhLuan = async (req, res) => {
    let {id, userId} = req.query;

    let sql = "DELETE FROM traloibinhluan WHERE blog_id = ? AND user_id = ?";
    await query.queryWithParams(sql, [id, userId]);

    res.redirect(`/admin/binh-luan-bai-viet?id=${id}`);
};
