const express = require('express');
const router = express.Router();
const adminViewUpdateController = require("../controllers/adminViewUpdateController");
const rolesMiddleware = require("../middlewares/RolesMiddleware");
const {upload} = require("../upload");

router.get('/mon-an',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewUpdateController.updateMonAn);

router.post('/mon-an',
    [rolesMiddleware.isAdminAndNhanVienMiddleware, upload.single('file')],
    adminViewUpdateController.handleUpdateMonAn);

router.get('/user',
    [rolesMiddleware.isAdminMiddleware],
    adminViewUpdateController.updateUser);

router.post('/user',
    [rolesMiddleware.isAdminMiddleware],
    adminViewUpdateController.handleUpdateUser);

router.get('/nguyen-lieu',
    [rolesMiddleware.isAdminMiddleware],
    adminViewUpdateController.updateNguyenLieu);

router.post('/nguyen-lieu',
    [rolesMiddleware.isAdminMiddleware],
    adminViewUpdateController.handleUpdateNguyenLieu);

router.get('/so-luong-nguyen-lieu',
    [rolesMiddleware.isAdminMiddleware],
    adminViewUpdateController.updateSoLuongNguyenLieu);

router.post('/so-luong-nguyen-lieu',
    [rolesMiddleware.isAdminMiddleware],
    adminViewUpdateController.handleUpdateSoLuongNguyenLieu);

router.get('/giam-gia',
    [rolesMiddleware.isAdminMiddleware],
    adminViewUpdateController.updateGiamGia);

router.post('/giam-gia',
    [rolesMiddleware.isAdminMiddleware],
    adminViewUpdateController.handleUpdateGiamGia);

router.get('/loai-san-pham',
    [rolesMiddleware.isAdminMiddleware],
    adminViewUpdateController.updateLoaiSanPham);

router.post('/loai-san-pham',
    [rolesMiddleware.isAdminMiddleware],
    adminViewUpdateController.handleUpdateLoaiSanPham);

router.get('/nha-cung-cap',
    [rolesMiddleware.isAdminMiddleware],
    adminViewUpdateController.updateNhaCungCap);

router.post('/nha-cung-cap',
    [rolesMiddleware.isAdminMiddleware],
    adminViewUpdateController.handleUpdateNhaCungCap);

router.get('/dat-ban',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewUpdateController.updateDatBan);

router.post('/dat-ban',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewUpdateController.handleUpdateDatBan);

router.get('/don-hang',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewUpdateController.updateDonHang);

router.post('/don-hang',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewUpdateController.handleUpdateDonHang);

router.get('/cong-thuc-mon',
    [rolesMiddleware.isAdminMiddleware],
    adminViewUpdateController.updateCongThucMon);

router.post('/cong-thuc-mon',
    [rolesMiddleware.isAdminMiddleware],
    adminViewUpdateController.handleUpdateCongThucMon);

router.get('/bai-viet',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewUpdateController.updateBaiViet);

router.post('/bai-viet',
    [rolesMiddleware.isAdminAndNhanVienMiddleware, upload.single('hinhAnh')],
    adminViewUpdateController.handleUpdateBaiViet);

router.get('/phan-hoi-binh-luan',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewUpdateController.updatePhanHoiBinhLuan);

router.post('/phan-hoi-binh-luan',
    [rolesMiddleware.isAdminAndNhanVienMiddleware, upload.single('hinhAnh')],
    adminViewUpdateController.handleUpdatePhanHoiBinhLuan);

module.exports = router;