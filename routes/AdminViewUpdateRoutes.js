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

module.exports = router;