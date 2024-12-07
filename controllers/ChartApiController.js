const query = require('../query');

exports.date = async (req, res) => {
    let sql = "SELECT HOUR(NgayLap) AS hour, SUM(TongTienHD) AS revenue FROM hoadonban LEFT JOIN chitiethoadon c on hoadonban.MaHoaDon = c.MaHoaDon WHERE CAST(NgayLap AS DATE) = CURDATE() AND trangthai = 1 GROUP BY hour";
    let data = await query.selectAll(sql);
    return res.status(200).json(data);
}

exports.month = async (req, res) => {
    let sql = "SELECT CAST(NgayLap AS DATE) AS date, COALESCE(SUM(TongTienHD), 0) as revenue FROM hoadonban LEFT JOIN chitiethoadon c on hoadonban.MaHoaDon = c.MaHoaDon WHERE MONTH(NgayLap) = MONTH(CURDATE()) AND YEAR(NgayLap) = YEAR(CURDATE()) AND trangthai = 1 GROUP BY date";
    let data = await query.selectAll(sql);
    data = data.map((element) => {
        let date = new Date(element.date);
        element.date = `${date.getFullYear()}-${padStart((date.getMonth() + 1))}-${padStart(date.getDate())}`;
        return element;
    });
    return res.status(200).json(data);
}

exports.year = async (req, res) => {
    let {year} = req.query;
    let yearParams = 0;

    let parseYear = parseInt(year);
    if (!isNaN(parseYear)) {
        yearParams = parseInt(year);
    }
    else {
        yearParams = new Date().getFullYear();
    }

    let sql = "SELECT MONTH(NgayLap) AS date , SUM(TongTienHD) AS revenue FROM hoadonban LEFT JOIN chitiethoadon c on hoadonban.MaHoaDon = c.MaHoaDon WHERE YEAR(NgayLap) = ? AND trangthai = 1 GROUP BY date"
    let data = await query.selectAllWithParams(sql, [yearParams]);
    return res.status(200).json(data);
}

const padStart = (number) => {
    return number.toString().padStart(2, "0");
};