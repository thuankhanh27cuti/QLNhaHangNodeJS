const express = require('express');
const router = express.Router();
const adminViewSelectController = require('../controllers/adminViewSelectController');
const rolesMiddleware = require('../middlewares/rolesMiddleware');

router.get('/',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewSelectController.home);

router.get('/mon-an',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewSelectController.allMonAn);

router.get('/bai-viet',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewSelectController.allBaiViet);

router.get('/binh-luan-bai-viet',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewSelectController.allBinhLuanBaiViet);

router.get('/tai-khoan',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewSelectController.allTaiKhoan);

router.get('/nguyen-lieu',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewSelectController.allNguyenLieu);

router.get('/hoa-don-ban',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewSelectController.allHoaDonBan);

router.get('/nhap-hang',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewSelectController.allNhapHang);

router.get('/giam-gia',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewSelectController.allGiamGia);

router.get('/loai-san-pham',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewSelectController.allLoaiSanPham);

router.get('/nha-cung-cap',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewSelectController.allNhaCungCap);

router.get('/dat-ban',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewSelectController.allDatBan);

router.get('/don-hang',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewSelectController.allDonHang);

router.get('/cong-thuc-mon',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewSelectController.allCongThucMon);

router.get('/tru-nguyen-lieu',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewSelectController.allTruNguyenLieu);

router.get('/chart/date',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewSelectController.chartDate);

router.get('/chart/month',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewSelectController.chartMonth);

router.get('/chart/year',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewSelectController.chartYear);

router.post('/chat/admin_get_has_seen_message', adminViewSelectController.admin_get_has_seen_message);
router.post('/chat/get_all_user_message', adminViewSelectController.get_all_user_message);
router.post('/chat/get_details_message', adminViewSelectController.get_details_message);
router.post('/chat/has_seen_message', adminViewSelectController.has_seen_message);
module.exports = router;