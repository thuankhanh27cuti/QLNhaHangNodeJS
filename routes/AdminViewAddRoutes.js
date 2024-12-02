const express = require('express');
const router = express.Router();
const adminViewAddController = require("../controllers/AdminViewAddController");
const rolesMiddleware = require("../middlewares/RolesMiddleware");
const {upload} = require("../upload");

router.get('/mon-an',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewAddController.addMonAn);

router.post('/mon-an',
    [rolesMiddleware.isAdminAndNhanVienMiddleware, upload.single('file')],
    adminViewAddController.handleAddMonAn);

router.get('/user',
    [rolesMiddleware.isAdminMiddleware],
    adminViewAddController.addUser);

router.post('/user',
    [rolesMiddleware.isAdminMiddleware],
    adminViewAddController.handleAddUser);

router.get('/nguyen-lieu',
    [rolesMiddleware.isAdminMiddleware],
    adminViewAddController.addNguyenLieu);

router.post('/nguyen-lieu',
    [rolesMiddleware.isAdminMiddleware],
    adminViewAddController.handleAddNguyenLieu);

router.get('/giam-gia',
    [rolesMiddleware.isAdminMiddleware],
    adminViewAddController.addGiamGia);

router.post('/giam-gia',
    [rolesMiddleware.isAdminMiddleware],
    adminViewAddController.handleAddGiamGia);

router.get('/loai-san-pham',
    [rolesMiddleware.isAdminMiddleware],
    adminViewAddController.addLoaiSanPham);

router.post('/loai-san-pham',
    [rolesMiddleware.isAdminMiddleware],
    adminViewAddController.handleAddLoaiSanPham);

router.get('/nha-cung-cap',
    [rolesMiddleware.isAdminMiddleware],
    adminViewAddController.addNhaCungCap);

router.post('/nha-cung-cap',
    [rolesMiddleware.isAdminMiddleware],
    adminViewAddController.handleAddNhaCungCap);

router.get('/phan-hoi-binh-luan',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewAddController.addPhanHoiBinhLuan);

router.post('/phan-hoi-binh-luan',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewAddController.handleAddPhanHoiBinhLuan);

module.exports = router;