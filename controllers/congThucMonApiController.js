const query = require('../query');

exports.findById = async (req, res) => {
    const { id } = req.params;

    let sql = "SELECT c.MaNL, TenNL, SoLuongCon, SoLuongCanDung FROM nguyenlieu n LEFT JOIN congthucmon c on n.MaNL = c.MaNL LEFT JOIN danhmucsp d on d.MaSP = c.MaSP WHERE d.MaSP = ?";
    let data = await query.selectAllWithParams(sql, [id]);

    return res.status(200).json(data);
}