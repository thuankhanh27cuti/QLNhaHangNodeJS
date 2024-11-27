const express = require('express');
const router = express.Router();
const adminViewController = require('../controllers/adminViewController');

// hosting.com/admin
router.get('/', adminViewController.home);
router.get('/mon-an', adminViewController.allMonAn);
// /admin/bai-viet
router.get('/bai-viet', adminViewController.allBaiViet);

router.get('/tai-khoan', adminViewController.allTaiKhoan);
router.get('/nguyen-lieu', adminViewController.allNguyenLieu);
router.get('/hoa-don-ban', adminViewController.allHoaDonBan);
router.get('/nhap-hang', adminViewController.allNhapHang);
router.get('/giam-gia', adminViewController.allGiamGia);
router.get('/loai-san-pham', adminViewController.allLoaiSanPham);
router.get('/nha-cung-cap', adminViewController.allNhaCungCap);
router.get('/dat-ban', adminViewController.allDatBan);
router.get('/don-hang', adminViewController.allDonHang);
router.get('/cong-thuc-mon', adminViewController.allCongThucMon);
router.get('/tru-nguyen-lieu', adminViewController.allTruNguyenLieu);

module.exports = router;