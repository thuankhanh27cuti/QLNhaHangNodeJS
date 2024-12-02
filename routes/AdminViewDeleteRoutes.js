const express = require('express');
const router = express.Router();
const adminViewDeleteController = require('../controllers/AdminViewDeleteController');
const rolesMiddleware = require('../middlewares/rolesMiddleware');

router.get('/mon-an',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewDeleteController.handleDeleteMonAn);

router.get('/user',
    [rolesMiddleware.isAdminMiddleware],
    adminViewDeleteController.handleDeleteUser);

router.get('/nguyen-lieu',
    [rolesMiddleware.isAdminMiddleware],
    adminViewDeleteController.handleDeleteNguyenLieu);

router.get('/giam-gia',
    [rolesMiddleware.isAdminMiddleware],
    adminViewDeleteController.handleDeleteGiamGia);

router.get('/loai-san-pham',
    [rolesMiddleware.isAdminMiddleware],
    adminViewDeleteController.handleDeleteLoaiSanPham);

router.get('/nha-cung-cap',
    [rolesMiddleware.isAdminMiddleware],
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