const db = require('../config/db');
const query = require("../query");
const { sendEmail } = require('../sendEmail');

exports.index = async (req, res) => {
    let sqlLoaiSanPham = "SELECT LoaiSP, TenLoai FROM loaisp";
    let loaiSpList = await query.selectAll(sqlLoaiSanPham);
    for (const element of loaiSpList) {
        let id = element.LoaiSP;
        let sql = "SELECT MaSP, TenSP, GiaBan, GioiThieuSP, Anh FROM danhmucsp WHERE MaLoai = ? LIMIT 5";
        element.monAnList = await query.selectAllWithParams(sql, [id]);
    }

    res.render('user/index', { loaiSpList: loaiSpList });
}

exports.danhSachMonAn = async (req, res) => {
    let { maLoai, sort, page } = req.query;

    let sqlLoaiSanPham = "SELECT LoaiSP, TenLoai FROM loaisp";
    let loaiSpList = await query.selectAll(sqlLoaiSanPham);

    let sql = "SELECT d.MaSP AS MaSP, TenSP, GiaBan, Anh, GioiThieuSP, COALESCE(SUM(SoLuong), 0) AS SoLuong FROM danhmucsp d LEFT JOIN chitiethoadon c ON d.MaSP = c.MaSP";

    let sqlPages = "SELECT COUNT(*) AS count FROM danhmucsp";

    if (maLoai) {
        sql += ` WHERE MaLoai = ${maLoai}`;
        sqlPages += ` WHERE MaLoai = ${maLoai}`;
    }
    sql += " GROUP BY MaSP, TenSP, GiaBan";
    if (sort) {
        let array = sort.split(',');
        let criteria = array[0];
        if (array.length === 2) {
            let direction = array[1];
            sql += ` ORDER BY ${criteria} ${direction}`;
        }
        else {
            sql += ` ORDER BY ${criteria}`;
        }
    }
    if (page) {
        let currentPage = parseInt(page);
        let start = (currentPage - 1) * 8;
        sql += ` LIMIT ${start}, 8`;
    }
    else {
        sql += ` LIMIT 8`;
    }

    let monAnList = await query.selectAll(sql);

    let queryTotalPage = await query.selectAll(sqlPages);
    let totalPages = queryTotalPage[0].count;
    let pages = Math.ceil(totalPages / 8);

    res.render('user/allMonAn', { loaiSpList: loaiSpList, monAnList: monAnList, pages: pages });
}

exports.datBan = async (req, res) => {
    let {ten, phone, thoiGian, soNguoi, yeuCau} = req.body;
    let userId = req.session.session.userId;

    let required = ten !== "" && phone !== "" && thoiGian !== "" && soNguoi !== "";
    if (required) {
        let sql = "INSERT INTO datban SET ten = ?, soDienThoai = ?, soNguoi = ?, yeuCau = ?, thoiGian = ?, trangThai = ?, userId = ?";
        await query.queryWithParams(sql, [ten, phone, soNguoi, yeuCau, thoiGian, 0, userId]);
    }

    res.redirect("/");
}

exports.chiTietMonAn = async (req, res) => {
    let {id} = req.query;

    let sql = "SELECT * FROM danhmucsp d LEFT JOIN loaisp ON d.MaLoai = loaisp.LoaiSP WHERE MaSP = ?";
    let data = await query.selectAllWithParams(sql, [id]);
    let monAn = data[0];

    console.log(data);

    res.render('user/chiTietMonAn', {data: monAn});
}

exports.thongTinNguoiDung = async (req, res) => {
    const userId = req.session.session.userId; // Lấy userId từ session
    console.log(userId); // Kiểm tra userId

    try {
        // Chỉ lấy các trường cần thiết từ cơ sở dữ liệu
        let sql = "SELECT userId, email, SDT, Ho, Ten, UserName FROM user WHERE userId = ?";
        let data = await query.selectAllWithParams(sql, [userId]);

        // Kiểm tra xem có dữ liệu người dùng không
        if (data.length > 0) {
            // Render view và truyền dữ liệu người dùng vào
            res.render('user/infoUser', { user: data[0] });
        } else {
            // Nếu không tìm thấy người dùng, có thể hiển thị thông báo
            req.session.session.error = "Không tìm thấy thông tin người dùng.";
            res.redirect('/some-error-page'); // Redirect đến trang lỗi hoặc trang khác
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        req.session.session.error = "Đã xảy ra lỗi trong quá trình truy vấn dữ liệu.";
        res.redirect('/some-error-page'); // Redirect đến trang lỗi
    }
}

exports.doiMatKhauDaDangNhap = async (req, res) => {
    res.render("user/changePassword/changePasswordWithLogin");
};

exports.xacNhanEmailDoiMatKhau = async (req, res) => {
    let { email } = req.body;
    if (email === "") {

    } else {
        //trùng email đang đăng nhập
        if (email == req.session.session.email) {
            let sqlGetUser = "SELECT * FROM user WHERE email = ?";
            let userData = await query.selectAllWithParams(sqlGetUser, [email]);

            // Kiểm tra nếu có dữ liệu người dùng
            if (userData.length > 0) {
                let user = userData[0];
                let otp = Math.floor(100000 + Math.random() * 900000); // Tạo mã OTP ngẫu nhiên
                // Lưu email và OTP vào session
                req.session.session.otpConfirmChangePassword = otp; // Lưu mã OTP
                req.session.session.email = user.email; // Lưu email
                // Gửi email
                sendEmail(
                    user.email,
                    'Yêu cầu đổi mật khẩu mới', // Tiêu đề email
                    `Xin chào ${user.UserName},\n\nMã OTP của bạn là: ${otp}`
                );
                req.session.session.notification = 'Đã gửi OTP tới email, vui lòng kiểm tra!'
                // Chuyển hướng tới trang xác nhận OTP
                res.redirect("/thong-tin-nguoi-dung/doi-mat-khau/xac-nhan-otp");
            } else {
                req.session.session.error = 'Email không tồn tại trong hệ thống!'
                res.render("user/changePassword/changePasswordWithLogin", { session: req.session.session });
            }
        }else{
            req.session.session.error = 'Email không trùng với đang đăng nhập, vui lòng thử lại!'
            res.render("user/changePassword/changePasswordWithLogin", { session: req.session.session });
        }
    }
};

exports.xacNhanOTPDoiMatKhau = async (req, res) => {
    if(req.session.session.otpConfirmChangePassword != undefined){
        res.render("user/changePassword/otpConfirmWithLogin");
    }else{
        res.redirect("/");
    }
};

exports.kiemTraOTPDoiMatKhauDaDangNhap = async (req, res) => {
    let { otp } = req.body;
    if (otp === "") {
        req.session.session.error = "Mã OTP không được để trống.";
        res.render("user/changePassword/otpConfirmWithLogin", { session: req.session.session});
    } else { 
        // Kiểm tra mã OTP
        if (otp == req.session.session.otpConfirmChangePassword) {
            req.session.session.otp_verified_changePassword = true; 
            res.redirect("/thong-tin-nguoi-dung/doi-mat-khau-moi");
        } else {
            req.session.session.error = "Mã OTP không hợp lệ. Vui lòng thử lại.";
            res.render("user/changePassword/otpConfirmWithLogin", { session: req.session.session});
        }
    }
};

//chuyển trang đổi mật khẩu mới sau khi đã xác nhận otp
exports.chuyenTrangDoiMatKhauKhiDaCheckOtp = async (req, res) => {
    if(req.session.session.otp_verified_changePassword = true){
        res.render("user/changePassword/changePasswordHavedCheckOtp");
    }else{
        res.redirect("/");
    }
};

//xác nhận đổi mật khẩu mới
exports.xacNhanDoiMatKhauKhiDaCheckOtp = async (req, res) => {
    if (req.session.session.otp_verified_changePassword === true) {
        let { password, newPassword } = req.body; 
        const email = req.session.session.email;
        const userName = req.session.session.username;

        // Kiểm tra mật khẩu mới
        if (!newPassword) {
            req.session.session.error = "Mật khẩu mới không được để trống!";
            return res.render("user/changePassword/changePasswordHavedCheckOtp", { session: req.session.session });
        }

        let sqlGetUser = "SELECT * FROM user WHERE email = ?";
        let userData = await query.selectAllWithParams(sqlGetUser, [email]);

        // Kiểm tra nếu có dữ liệu người dùng
        if (userData.length > 0) {
            if(userData[0].PassWord === password){
                let sqlUpdatePassword = "UPDATE user SET password = ? WHERE email = ?";
                await query.update(sqlUpdatePassword, [newPassword, email]); // Cập nhật mật khẩu mới
                req.session.session.notification = "Mật khẩu đã được cập nhật thành công!";
                // Xóa thông tin trong session 
                req.session.session.otp_verified_changePassword = null;
                req.session.session.otpConfirmChangePassword = null;
                sendEmail(
                    email,
                    'Thông báo đổi mật khẩu mới', // Tiêu đề email
                    `Xin chào ${userName},\n\nBạn đã đổi mật khẩu mới thành công!`
                );
                res.render("user/changePassword/changePasswordHavedCheckOtp", { session: req.session.session });
            }else{
                req.session.session.error = `Mật khẩu hiện tại không đúng, vui lòng thử lại`;
                res.render("user/changePassword/changePasswordHavedCheckOtp", { session: req.session.session });
            }         
        } else {
            req.session.session.error = `Email ${email} không tồn tại trong hệ thống!`;
            res.render("user/changePassword/changePasswordHavedCheckOtp", { session: req.session.session });
        }
    } else {
        res.redirect("/");
    }
};
