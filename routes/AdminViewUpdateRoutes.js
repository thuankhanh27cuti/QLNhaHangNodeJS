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
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewUpdateController.updateUser);

router.post('/user',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewUpdateController.handleUpdateUser);

router.get('/nguyen-lieu',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewUpdateController.updateNguyenLieu);

router.post('/nguyen-lieu',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewUpdateController.handleUpdateNguyenLieu);

router.get('/so-luong-nguyen-lieu',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewUpdateController.updateSoLuongNguyenLieu);

router.post('/so-luong-nguyen-lieu',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewUpdateController.handleUpdateSoLuongNguyenLieu);

router.get('/giam-gia',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewUpdateController.updateGiamGia);

router.post('/giam-gia',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewUpdateController.handleUpdateGiamGia);

router.get('/loai-san-pham',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewUpdateController.updateLoaiSanPham);

router.post('/loai-san-pham',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewUpdateController.handleUpdateLoaiSanPham);

router.get('/nha-cung-cap',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewUpdateController.updateNhaCungCap);

router.post('/nha-cung-cap',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
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
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewUpdateController.updateCongThucMon);

router.post('/cong-thuc-mon',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewUpdateController.handleUpdateCongThucMon);

module.exports = router;