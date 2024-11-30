const query = require('../query');

exports.findAll = async (req, res) => {

    let sql = "SELECT * FROM nguyenlieu";
    let data = await query.selectAll(sql);

    return res.status(200).json(data);
}