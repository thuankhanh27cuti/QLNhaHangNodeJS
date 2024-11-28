const express = require('express');
const router = express.Router();
const adminViewController = require('../controllers/adminViewController');

let middleware = (req, res, next) => {
    let session = req.session.session;
    if (!session) {
        return res.redirect('/login');
    }
    else if (![0, 1].includes(session.LoaiUser)) {
        return res.redirect('/');
    }
    else {
        next();
    }
};

router.get('/', [middleware], adminViewController.home);
router.get('/mon-an', [middleware], adminViewController.allMonAn);
router.get('/bai-viet', [middleware], adminViewController.allBaiViet);
router.get('/tai-khoan', [middleware], adminViewController.allTaiKhoan);
router.get('/nguyen-lieu', [middleware], adminViewController.allNguyenLieu);
router.get('/hoa-don-ban', [middleware], adminViewController.allHoaDonBan);
router.get('/nhap-hang', [middleware], adminViewController.allNhapHang);
router.get('/giam-gia', [middleware], adminViewController.allGiamGia);
router.get('/loai-san-pham', [middleware], adminViewController.allLoaiSanPham);
router.get('/nha-cung-cap', [middleware], adminViewController.allNhaCungCap);
router.get('/dat-ban', [middleware], adminViewController.allDatBan);
router.get('/don-hang', [middleware], adminViewController.allDonHang);
router.get('/cong-thuc-mon', [middleware], adminViewController.allCongThucMon);
router.get('/tru-nguyen-lieu', [middleware], adminViewController.allTruNguyenLieu);

router.get('/chart/date', [middleware], adminViewController.chartDate);
router.get('/chart/month', [middleware], adminViewController.chartMonth);
router.get('/chart/year', [middleware], adminViewController.chartYear);

module.exports = router;