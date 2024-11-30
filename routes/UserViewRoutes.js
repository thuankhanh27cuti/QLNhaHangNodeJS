const express = require('express');
const router = express.Router();
const userViewController = require('../controllers/userViewController');
const {isUserMiddleware} = require("../middlewares/RolesMiddleware");

let middleware = (req, res, next) => {
    let session = req.session.session;
    if (session) {
        if ([0, 1].includes(session.LoaiUser)) {
            res.redirect('/admin');
        }
        else {
            next();
        }
    }
    else {
        next();
    }
}

router.get("/", [middleware], userViewController.index);
router.get("/thong-tin-nguoi-dung", [middleware], userViewController.thongTinNguoiDung);

router.get("/thong-tin-nguoi-dung/doi-mat-khau", [middleware], userViewController.doiMatKhauDaDangNhap);
router.post("/thong-tin-nguoi-dung/doi-mat-khau", [middleware], userViewController.xacNhanEmailDoiMatKhau);
router.get("/thong-tin-nguoi-dung/doi-mat-khau/xac-nhan-otp", [middleware], userViewController.xacNhanOTPDoiMatKhau);
router.post("/thong-tin-nguoi-dung/doi-mat-khau/xac-nhan-otp", [middleware], userViewController.kiemTraOTPDoiMatKhauDaDangNhap);
router.get("/thong-tin-nguoi-dung/doi-mat-khau-moi", [middleware], userViewController.chuyenTrangDoiMatKhauKhiDaCheckOtp);
router.post("/thong-tin-nguoi-dung/doi-mat-khau-moi", [middleware], userViewController.xacNhanDoiMatKhauKhiDaCheckOtp);

router.get("/danh-sach-mon-an", [middleware], userViewController.danhSachMonAn);
router.get("/chi-tiet-mon-an", [middleware], userViewController.chiTietMonAn);
router.post("/dat-ban", [middleware], userViewController.datBan);
router.post("/danh-gia-mon-an", [isUserMiddleware], userViewController.handleDanhGiaMonAn);
router.get("/xoa-danh-gia-mon-an", [isUserMiddleware], userViewController.handleXoaDanhGiaMonAn);

module.exports = router;