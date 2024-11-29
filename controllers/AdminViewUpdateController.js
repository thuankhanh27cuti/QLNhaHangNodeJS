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
