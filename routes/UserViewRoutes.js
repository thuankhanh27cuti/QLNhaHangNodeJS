const express = require('express');
const router = express.Router();
const userViewController = require('../controllers/UserViewController');
const {isUserMiddleware, isUserOrUnauthenticatedMiddleware} = require("../middlewares/RolesMiddleware");

router.get("/", [isUserOrUnauthenticatedMiddleware], userViewController.index);
router.get("/thong-tin-nguoi-dung", [isUserMiddleware], userViewController.thongTinNguoiDung);
router.get("/cap-nhat-thong-tin", [isUserMiddleware], userViewController.capNhatThongTin);
router.post("/cap-nhat-thong-tin", [isUserMiddleware], userViewController.handleCapNhatThongTin);

router.get("/thong-tin-nguoi-dung/doi-mat-khau", [isUserMiddleware], userViewController.doiMatKhauDaDangNhap);
router.post("/thong-tin-nguoi-dung/doi-mat-khau", [isUserMiddleware], userViewController.xacNhanEmailDoiMatKhau);
router.get("/thong-tin-nguoi-dung/doi-mat-khau/xac-nhan-otp", [isUserMiddleware], userViewController.xacNhanOTPDoiMatKhau);
router.post("/thong-tin-nguoi-dung/doi-mat-khau/xac-nhan-otp", [isUserMiddleware], userViewController.kiemTraOTPDoiMatKhauDaDangNhap);
router.get("/thong-tin-nguoi-dung/doi-mat-khau-moi", [isUserMiddleware], userViewController.chuyenTrangDoiMatKhauKhiDaCheckOtp);
router.post("/thong-tin-nguoi-dung/doi-mat-khau-moi", [isUserMiddleware], userViewController.xacNhanDoiMatKhauKhiDaCheckOtp);

router.get("/danh-sach-mon-an", [isUserOrUnauthenticatedMiddleware], userViewController.danhSachMonAn);
router.get("/chi-tiet-mon-an", [isUserOrUnauthenticatedMiddleware], userViewController.chiTietMonAn);
router.post("/dat-ban", [isUserMiddleware], userViewController.handleDatBan);
router.post("/danh-gia-mon-an", [isUserMiddleware], userViewController.handleDanhGiaMonAn);
router.get("/xoa-danh-gia-mon-an", [isUserMiddleware], userViewController.handleXoaDanhGiaMonAn);
router.post("/add-to-cart", [isUserMiddleware], userViewController.handleAddToCart);
router.get("/cart", [isUserMiddleware], userViewController.cart);
router.post("/cart", [isUserMiddleware], userViewController.handleUpdateCart);
router.get("/thanh-toan", [isUserMiddleware], userViewController.thanhToan);
router.post("/thanh-toan", [isUserMiddleware], userViewController.handleUpdateCartAndThanhToan);
router.post("/vn-pay/create-payment", [isUserMiddleware], userViewController.handleCreateVNPayPayment);
router.get("/vn-pay/result-payment", [isUserMiddleware], userViewController.resultVNPayPayment);
router.get("/don-hang", [isUserMiddleware], userViewController.donHang);
router.get("/thong-tin-don-hang", [isUserMiddleware], userViewController.thongTinDonHang);
router.get("/huy-don-hang", [isUserMiddleware], userViewController.handleHuyDonHang);
router.get("/dat-ban", [isUserMiddleware], userViewController.datBan);
router.get("/blog", [isUserMiddleware], userViewController.blog);
router.get("/blog-info", [isUserMiddleware], userViewController.blogInfo);
router.post("/add/binh-luan-blog", [isUserMiddleware], userViewController.handleAddBinhLuanBlog);
router.get("/delete/binh-luan-blog", [isUserMiddleware], userViewController.handleDeleteBinhLuanBlog);

router.post("/chat/get_message", userViewController.get_message);
router.post("/chat/guest_has_seen_message", userViewController.guest_has_seen_message);

module.exports = router;