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
    [rolesMiddleware.isAdminAndNhanVienMiddleware, upload.single('file')],
    adminViewUpdateController.handleUpdateUser);

router.get('/nguyen-lieu',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewUpdateController.updateNguyenLieu);

router.post('/nguyen-lieu',
    [rolesMiddleware.isAdminAndNhanVienMiddleware, upload.single('file')],
    adminViewUpdateController.handleUpdateNguyenLieu);

router.get('/so-luong-nguyen-lieu',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewUpdateController.updateSoLuongNguyenLieu);

router.post('/so-luong-nguyen-lieu',
    [rolesMiddleware.isAdminAndNhanVienMiddleware, upload.single('file')],
    adminViewUpdateController.handleUpdateSoLuongNguyenLieu);

router.get('/giam-gia',
    [rolesMiddleware.isAdminAndNhanVienMiddleware],
    adminViewUpdateController.updateGiamGia);

router.post('/giam-gia',
    [rolesMiddleware.isAdminAndNhanVienMiddleware, upload.single('file')],
    adminViewUpdateController.handleUpdateGiamGia);

module.exports = router;