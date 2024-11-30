const express = require('express');
const router = express.Router();
const userViewController = require('../controllers/userViewController');

let middleware = (req, res, next) => {
    let session = req.session.session;
    if (session) {
        if ([0, 1].includes(session.LoaiUser)) {
            res.redirect('/admin');
        }
        else {
            next();
        }
    }
    else {
        next();
    }
}

router.get("/", [middleware], userViewController.index);
router.get("/danh-sach-mon-an", [middleware], userViewController.danhSachMonAn);
router.get("/chi-tiet-mon-an", [middleware], userViewController.chiTietMonAn);
router.post("/dat-ban", [middleware], userViewController.datBan);

module.exports = router;