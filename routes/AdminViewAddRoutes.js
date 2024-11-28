const express = require('express');
const router = express.Router();
const adminViewAddController = require("../controllers/adminViewAddController");
const rolesMiddleware = require("../middlewares/RolesMiddleware");
const {upload} = require("../upload");

router.get('/mon-an',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewAddController.addMonAn);

router.post('/mon-an',
    [rolesMiddleware.isAdminAndNhanVienMiddleware, upload.single('file')],
    adminViewAddController.handleAddMonAn);

router.get('/user',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewAddController.addUser);

router.post('/user',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewAddController.handleAddUser);

router.get('/nguyen-lieu',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewAddController.addNguyenLieu);

router.post('/nguyen-lieu',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewAddController.handleAddNguyenLieu);

router.get('/giam-gia',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewAddController.addGiamGia);

router.post('/giam-gia',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewAddController.handleAddGiamGia);

router.get('/loai-san-pham',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewAddController.addLoaiSanPham);

router.post('/loai-san-pham',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewAddController.handleAddLoaiSanPham);

router.get('/nha-cung-cap',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewAddController.addNhaCungCap);

router.post('/nha-cung-cap',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewAddController.handleAddNhaCungCap);

module.exports = router;