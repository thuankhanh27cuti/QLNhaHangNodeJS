const express = require('express');
const router = express.Router();
const adminViewDeleteController = require('../controllers/AdminViewDeleteController');
const rolesMiddleware = require('../middlewares/rolesMiddleware');

router.get('/mon-an',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewDeleteController.handleDeleteMonAn);

router.get('/user',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewDeleteController.handleDeleteUser);

router.get('/nguyen-lieu',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewDeleteController.handleDeleteNguyenLieu);

router.get('/giam-gia',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewDeleteController.handleDeleteGiamGia);

router.get('/loai-san-pham',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewDeleteController.handleDeleteLoaiSanPham);

router.get('/nha-cung-cap',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewDeleteController.handleDeleteNhaCungCap)

router.get('/dat-ban',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewDeleteController.handleDeleteDatBan);

router.get('/bai-viet',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewDeleteController.handleDeleteBaiViet);

router.get('/phan-hoi-binh-luan',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewDeleteController.handleDeletePhanHoiBinhLuan);

module.exports = router;