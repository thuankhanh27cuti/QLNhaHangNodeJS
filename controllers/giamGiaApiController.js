const query = require('../query');

exports.findById = async (req, res) => {
    const { id } = req.params;

    let sql = "SELECT MaGiamGia, GiamGia FROM giamgia WHERE MaGiamGia = ?";
    let dataGiamGia = await query.selectAllWithParams(sql, [id]);
    let data = dataGiamGia[0];

    return res.status(200).json(data);
}