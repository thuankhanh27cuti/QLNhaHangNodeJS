const db = require('../config/db');

exports.findAll = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM loaisp');
        res.json(rows);
    } catch (err) {
        res.status(500).send({ error: 'Database query failed' });
    }
}

exports.findById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM loaisp WHERE LoaiSP = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
}