const query = require("../query");
const { sendEmail } = require("../sendEmail");
const crypto = require("crypto");
const configVnPay = require("../config/vnpay-setup");
const dayjs = require("dayjs");
const querystring = require("qs");
const moment = require("moment-timezone");
const mysql = require("mysql2");

// Tạo kết nối với cơ sở dữ liệu
const connection = mysql.createConnection({
    host: "localhost",
    user: "root", // Thay bằng user của bạn
    password: "", // Thay bằng password của bạn
    database: "qlnhahangv3", // Thay bằng tên cơ sở dữ liệu của bạn
});

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.index = async (req, res) => {
    let sqlLoaiSanPham = "SELECT LoaiSP, TenLoai FROM loaisp";
    let loaiSpList = await query.selectAll(sqlLoaiSanPham);
    for (const element of loaiSpList) {
        let id = element.LoaiSP;
        let sql = "SELECT MaSP, TenSP, GiaBan, GioiThieuSP, Anh FROM danhmucsp WHERE MaLoai = ? LIMIT 5";
        element.monAnList = await query.selectAllWithParams(sql, [id]);
    }
    // console.log(loaiSpList);

    res.render("user/index", { loaiSpList: loaiSpList });
};

exports.danhSachMonAn = async (req, res) => {
    let { maLoai, sort, page } = req.query;

    let sqlLoaiSanPham = "SELECT LoaiSP, TenLoai FROM loaisp";
    let loaiSpList = await query.selectAll(sqlLoaiSanPham);

    let sql =
        "SELECT d.MaSP AS MaSP, TenSP, GiaBan, Anh, GioiThieuSP, COALESCE(SUM(SoLuong), 0) AS SoLuong FROM danhmucsp d LEFT JOIN chitiethoadon c ON d.MaSP = c.MaSP";

    let sqlPages = "SELECT COUNT(*) AS count FROM danhmucsp";

    if (maLoai) {
        sql += ` WHERE MaLoai = ${maLoai}`;
        sqlPages += ` WHERE MaLoai = ${maLoai}`;
    }
    sql += " GROUP BY MaSP, TenSP, GiaBan";
    if (sort) {
        let array = sort.split(",");
        let criteria = array[0];
        if (array.length === 2) {
            let direction = array[1];
            sql += ` ORDER BY ${criteria} ${direction}`;
        } else {
            sql += ` ORDER BY ${criteria}`;
        }
    }
    if (page) {
        let currentPage = parseInt(page);
        let start = (currentPage - 1) * 8;
        sql += ` LIMIT ${start}, 8`;
    } else {
        sql += ` LIMIT 8`;
    }

    let monAnList = await query.selectAll(sql);

    let queryTotalPage = await query.selectAll(sqlPages);
    let totalPages = queryTotalPage[0].count;
    let pages = Math.ceil(totalPages / 8);

    res.render("user/allMonAn", { loaiSpList: loaiSpList, monAnList: monAnList, pages: pages });
};

exports.datBan = async (req, res) => {
    let { ten, phone, thoiGian, soNguoi, yeuCau } = req.body;
    let userId = req.session.session.userId;

    let required = ten !== "" && phone !== "" && thoiGian !== "" && soNguoi !== "";
    if (required) {
        let sql = "INSERT INTO datban SET ten = ?, soDienThoai = ?, soNguoi = ?, yeuCau = ?, thoiGian = ?, trangThai = ?, userId = ?";
        await query.queryWithParams(sql, [ten, phone, soNguoi, yeuCau, thoiGian, 0, userId]);
    }

    res.redirect("/");
};

exports.chiTietMonAn = async (req, res) => {
    let { id, commentPage } = req.query;

    let sql = "SELECT MaSP, TenSP, GiaBan, GioiThieuSP, Anh, LoaiSP, TenLoai FROM danhmucsp d LEFT JOIN loaisp ON d.MaLoai = loaisp.LoaiSP WHERE MaSP = ?";
    let data = await query.selectAllWithParams(sql, [id]);
    let monAn = data[0];

    let idLoaiSanPham = monAn.LoaiSP;
    let sqlLienQuan = "SELECT MaSP, TenSP, GiaBan, Anh FROM danhmucsp WHERE MaLoai = ? LIMIT 5";
    let dataLienQuan = await query.selectAllWithParams(sqlLienQuan, [idLoaiSanPham]);

    let sqlAverage = "SELECT COALESCE(AVG(star), 0) AS star FROM danhgiasp WHERE MaSP = ?";
    let dataAverage = await query.selectAllWithParams(sqlAverage, [id]);
    let star = dataAverage[0].star;

    let currentPage = 1;

    let parsePage = parseInt(commentPage);
    if (!isNaN(parsePage)) {
        currentPage = parsePage;
    }

    let start = (currentPage - 1) * 3;

    let sqlDanhGia =
        "SELECT MaSP, time, noidung, star, UserName, u.userId FROM danhgiasp LEFT JOIN user u on u.userId = danhgiasp.userId WHERE MaSP = ? LIMIT ?, 3";
    let dataDanhGia = await query.selectAllWithParams(sqlDanhGia, [id, start]);

    let sqlCountDanhGia = "SELECT COUNT(*) AS count FROM danhgiasp WHERE MaSP = ?";
    let dataCountDanhGia = await query.selectAllWithParams(sqlCountDanhGia, [id]);

    let count = dataCountDanhGia[0].count;
    let pages = Math.ceil(count / 3);

    res.render("user/chiTietMonAn", { data: monAn, dataLienQuan: dataLienQuan, star: star, dataDanhGia: dataDanhGia, pages: pages });
};

exports.handleDanhGiaMonAn = async (req, res) => {
    let id = parseInt(req.query.id);
    let { rating } = req.body;
    let object = JSON.parse(rating);

    let noiDung = object.noidung;
    let star = object.star;

    let userId = req.session.session.userId;

    let sqlCount = "SELECT COUNT(*) AS count FROM danhgiasp WHERE MaSP = ? AND userId = ?";
    let dataCount = await query.selectAllWithParams(sqlCount, [id, userId]);
    let count = dataCount[0].count;

    if (count === 0) {
        let sql = "INSERT INTO danhgiasp(MaSP, userId, time, noidung, star) VALUES (?, ?, NOW(), ?, ?)";
        await query.queryWithParams(sql, [id, userId, noiDung, star]);
    }

    res.redirect(`/chi-tiet-mon-an?id=${id}`);
};

exports.handleXoaDanhGiaMonAn = async (req, res) => {
    let id = parseInt(req.query.id);
    let userId = req.session.session.userId;

    let sql = "DELETE FROM danhgiasp WHERE MaSP = ? AND userId = ?";
    await query.queryWithParams(sql, [id, userId]);

    res.redirect(`/chi-tiet-mon-an?id=${id}`);
};

exports.handleAddToCart = async (req, res) => {
    let id = parseInt(req.body.id);
    let cart = req.session.session.cart || [];

    let needAdd = true;

    for (let i = 0; i < cart.length; i++) {
        let current = cart[i];
        if (current.id === id) {
            needAdd = false;
            current.quantity = current.quantity + 1;
            break;
        }
    }

    if (needAdd) {
        cart.push({
            id: id,
            quantity: 1,
        });
    }

    // console.log(cart);

    req.session.session.cart = cart;
    res.redirect(`/chi-tiet-mon-an?id=${id}`);
};

exports.cart = async (req, res) => {
    let cartSession = req.session.session.cart || [];
    let cartData = await getCartData(cartSession);
    let cart = cartData.cartData;
    let totalPrice = cartData.totalPrice;
    res.render("user/cart", { cart: cart, totalPrice: totalPrice });
};

exports.handleUpdateCart = async (req, res) => {
    let { cart } = req.body;
    req.session.session.cart = JSON.parse(cart);
    res.redirect("/cart");
};

exports.thanhToan = async (req, res) => {
    let cartSession = req.session.session.cart || [];
    let cartData = await getCartData(cartSession);
    let cart = cartData.cartData;
    let totalPrice = cartData.totalPrice;
    res.render("user/thanhToan", { cart: cart, totalPrice: totalPrice });
};

const getCartData = async (cart) => {
    let cartData = [];
    let totalPrice = 0;
    for (let i = 0; i < cart.length; i++) {
        let element = cart[i];
        let id = element.id;
        let quantity = element.quantity;
        let sql = "SELECT TenSP, GiaBan, Anh FROM danhmucsp WHERE MaSP = ?";
        let dataSelect = await query.selectAllWithParams(sql, [id]);
        let data = dataSelect[0];
        cartData.push({
            id: id,
            name: data.TenSP,
            price: data.GiaBan,
            image: data.Anh,
            quantity: quantity,
        });
        totalPrice = totalPrice + data.GiaBan * quantity;
    }
    // console.log(cartData);
    return { cartData: cartData, totalPrice: totalPrice };
};

exports.handleUpdateCartAndThanhToan = async (req, res) => {
    let { cart } = req.body;
    req.session.session.cart = JSON.parse(cart);
    res.redirect("/thanh-toan");
};

exports.handleCreateVNPayPayment = async (req, res) => {
    let orderInfo = JSON.parse(req.body.orderInfo);
    // console.log(orderInfo);
    /*
          {
              products: [ { id: 3, quantity: 2 }, { id: 4, quantity: 3 } ],
              discount: 111,
              note: '123'
          }
           */

    let products = orderInfo.products;
    let discount = orderInfo.discount;
    let note = orderInfo.note;

    let sql = "SELECT * FROM danhmucsp WHERE MaSP = ?";
    try {
        let promises = products.map((product) => {
            let id = product.id;
            let quantity = product.quantity;
            return query
                .selectAllWithParams(sql, [id])
                .then((data) => data[0])
                .then((data) => {
                    return {
                        product: data,
                        quantity: quantity,
                    };
                });
        });
        let productDetails = await Promise.all(promises);
        // Tính tổng số tiền chưa giảm giá
        let totalPrice = productDetails.reduce((previousValue, currentValue) => {
            let price = currentValue.product.GiaBan * currentValue.quantity;
            return previousValue + price;
        }, 0);
        console.log(totalPrice);

        // Lấy thông tin giảm giá
        let sqlGiamGia = "SELECT * FROM giamgia WHERE MaGiamGia = ?";
        let dataGiamGia = await query.selectAllWithParams(sqlGiamGia, [discount]);
        if (dataGiamGia.length === 1) {
            let giamGia = dataGiamGia[0];
            let soLuongGiam = giamGia.GiamGia;

            // Tính tổng số tiền đã giảm giá
            totalPrice = (totalPrice / 100) * (100 - soLuongGiam);
        }

        console.log(totalPrice);

        // Chuẩn bị gửi đi
        const ipAddr =
            req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress || "127.0.0.1";

        // Lấy các thông số cấu hình
        const tmnCode = configVnPay.vnp_TmnCode;
        const secretKey = configVnPay.vnp_HashSecret;
        const vnpUrl = configVnPay.vnp_Url;
        const returnUrl = configVnPay.vnp_ReturnUrl;

        // Lấy thời gian hiện tại
        const createDate = moment().tz("Asia/Ho_Chi_Minh").format("YYYYMMDDHHmmss"); // Thời gian tạo đơn hàng (yyyy phải là YYYY)
        //const orderId = moment().tz('Asia/Ho_Chi_Minh').format("HHmmss"); // Mã đơn hàng tham chiếu (sử dụng giờ, phút, giây)

        const amount = totalPrice; // Số tiền thanh toán
        const bankCode = "NCB"; // Mã ngân hàng (nếu có)
        const orderInfo = JSON.stringify({ discount: discount, note: note }); // Mô tả đơn hàng
        const orderType = "other"; // Loại đơn hàng
        let locale = "vn"; // Ngôn ngữ (mặc định là 'vn')
        const currCode = "VND"; // Mã tiền tệ (VND)
        const idR = rand(1, 10000);
        // Tạo các tham số yêu cầu gửi lên VNPAY
        let vnp_Params = {
            vnp_Version: "2.1.0", // Phiên bản của API VNPAY
            vnp_Command: "pay", // Lệnh thanh toán
            vnp_TmnCode: tmnCode, // Mã merchant
            vnp_Locale: locale, // Ngôn ngữ
            vnp_CurrCode: currCode, // Mã tiền tệ
            vnp_TxnRef: idR, // Mã giao dịch tham chiếu
            vnp_OrderInfo: orderInfo, // Mô tả đơn hàng
            vnp_OrderType: orderType, // Loại đơn hàng
            vnp_Amount: amount * 100, // Số tiền (VNPAY yêu cầu đơn vị là đồng, không phải nghìn đồng)
            vnp_ReturnUrl: returnUrl, // URL trả về sau khi thanh toán
            vnp_IpAddr: ipAddr, // Địa chỉ IP của người dùng
            vnp_CreateDate: createDate, // Thời gian tạo đơn hàng
        };

        // Nếu có mã ngân hàng, thêm vào tham số
        if (bankCode) {
            vnp_Params["vnp_BankCode"] = bankCode;
        }

        // Sắp xếp các tham số theo thứ tự từ A đến Z
        vnp_Params = sortObject(vnp_Params);

        // Chuyển đổi các tham số thành chuỗi querystring
        const signData = querystring.stringify(vnp_Params, { encode: false });

        // Tính toán mã băm SHA-512 với secret key
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

        // Thêm mã băm vào tham số
        vnp_Params["vnp_SecureHash"] = signed;

        // Tạo URL hoàn chỉnh để chuyển hướng đến VNPAY
        const fullUrl = vnpUrl + "?" + querystring.stringify(vnp_Params, { encode: false });

        req.session.session.vnpay_TxnRef = idR;
        // Chuyển hướng người dùng đến URL VNPAY
        res.redirect(fullUrl);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Có lỗi xảy ra.");
    }

    //res.redirect("/thanh-toan");
};

exports.resultVNPayPayment = async (req, res) => {
    if (!req.session.session || req.session.session.vnpay_TxnRef === undefined) {
        return res.redirect("/");
    }

    if (req.session.session.cart.length > 0) {
        //console.log(req.session.session.cart);

        // Lấy danh sách ID sản phẩm từ giỏ hàng
        const arrID = req.session.session.cart.map((item) => item.id);
        const orderInfo = JSON.parse(req.query.vnp_OrderInfo); // Mã hóa thông tin đơn hàng
        console.log(orderInfo);
        const userId = req.session.session.userId; // ID người dùng
        const discountCode = orderInfo.discount || ""; // Mã giảm giá (nếu có)
        const paymentMethod = 1; // Phương thức thanh toán (mặc định 1)
        const note = orderInfo.note || ""; // Ghi chú
        const orderStatus = 0; // Trạng thái đơn hàng (chờ xử lý)

        //console.log('arrayId: ' + arrID);

        const arrayId = arrID.join(","); // Danh sách sản phẩm tham gia thanh toán
        //console.log('arrayId sau khi join: ' + arrayId);

        // Xây dựng câu truy vấn SQL để thêm hóa đơn
        let sqlInsertInvoice = "";
        if (!discountCode) {
            sqlInsertInvoice = `INSERT INTO hoadonban (NgayLap, userId, PhuongThucTT, GhiChu, trangthai) 
                                 VALUES (NOW(), ?, ?, ?, ?)`;
        } else {
            sqlInsertInvoice = `INSERT INTO hoadonban (NgayLap, userId, PhuongThucTT, MaGiamGia, GhiChu, trangthai) 
                                 VALUES (NOW(), ?, ?, ?, ?, ?)`;
        }

        // Thực hiện truy vấn chèn hóa đơn vào bảng hoadonban
        const result = await query.insertAndGetId(sqlInsertInvoice, [userId, paymentMethod, discountCode || null, note, orderStatus]);

        const invoiceId = result; // Mã hóa đơn vừa được thêm

        // Truy vấn các sản phẩm trong giỏ hàng từ cơ sở dữ liệu
        const sqlSelectProducts = `SELECT MaSP, GiaBan FROM danhmucsp WHERE MaSP IN(${arrayId}) ORDER BY MaSP DESC`;
        const products = await query.selectAll(sqlSelectProducts);

        let totalAmount = 0;

        // Lặp qua các sản phẩm và tính tổng số tiền
        for (const product of products) {
            const productId = product.MaSP;
            const productPrice = product.GiaBan;
            const quantity = req.session.session.cart.find((item) => item.id === productId)?.quantity || 0;

            let totalPrice = 0;
            //console.log(`SoLuong: ${quantity}, MaSP: ${productId}`);

            if (discountCode) {
                // Áp dụng giảm giá nếu có
                const sqlDiscount = `SELECT GiamGia FROM giamgia WHERE MaGiamGia = ?`;
                const discount = await query.selectAllWithParams(sqlDiscount, [discountCode]);
                const discountValue = discount[0]?.GiamGia || 0;
                totalPrice = (productPrice * quantity * (100 - discountValue)) / 100;
                totalAmount += totalPrice;

                // Chèn chi tiết hóa đơn vào bảng chitiethoadon
                const sqlInsertInvoiceDetail = `INSERT INTO chitiethoadon (MaHoaDon, MaSP, SoLuong, TongTienHD) 
                                                VALUES (?, ?, ?, ?)`;
                await query.queryWithParams(sqlInsertInvoiceDetail, [invoiceId, productId, quantity, totalPrice]);
            } else {
                // Tính toán giá trị nếu không có giảm giá
                totalPrice = productPrice * quantity;
                totalAmount += totalPrice;

                // Chèn chi tiết hóa đơn vào bảng chitiethoadon
                const sqlInsertInvoiceDetail = `INSERT INTO chitiethoadon (MaHoaDon, MaSP, SoLuong, TongTienHD) 
                                                VALUES (?, ?, ?, ?)`;
                await query.queryWithParams(sqlInsertInvoiceDetail, [invoiceId, productId, quantity, totalPrice]);
            }
        }

        // Chèn thông tin thanh toán vào bảng bills
        const txnRef = req.query.vnp_TxnRef;
        const payDate = req.query.vnp_PayDate;
        const sqlInsertBill = `INSERT INTO bills (MaHoaDon, SoTien, TxnRef, TransactionDate) 
                               VALUES (?, ?, ?, ?)`;
        await query.queryWithParams(sqlInsertBill, [invoiceId, totalAmount, txnRef, payDate]);

        //reset
        req.session.session.cart = [];

        return res.redirect("/");
    } else {
        return res.redirect("/");
    }
};

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
            res.render("user/infoUser", { user: data[0] });
        } else {
            // Nếu không tìm thấy người dùng, có thể hiển thị thông báo
            req.session.session.error = "Không tìm thấy thông tin người dùng.";
            res.redirect("/some-error-page"); // Redirect đến trang lỗi hoặc trang khác
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        req.session.session.error = "Đã xảy ra lỗi trong quá trình truy vấn dữ liệu.";
        res.redirect("/some-error-page"); // Redirect đến trang lỗi
    }
};

exports.doiMatKhauDaDangNhap = async (req, res) => {
    res.render("user/changePassword/changePasswordWithLogin");
};

exports.xacNhanEmailDoiMatKhau = async (req, res) => {
    let { email } = req.body;
    if (email === "") {
    } else {
        //trùng email đang đăng nhập
        if (email === req.session.session.email) {
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
                await sendEmail(
                    user.email,
                    "Yêu cầu đổi mật khẩu mới", // Tiêu đề email
                    `Xin chào ${user.UserName},\n\nMã OTP của bạn là: ${otp}`
                );
                req.session.session.notification = "Đã gửi OTP tới email, vui lòng kiểm tra!";
                // Chuyển hướng tới trang xác nhận OTP
                res.redirect("/thong-tin-nguoi-dung/doi-mat-khau/xac-nhan-otp");
            } else {
                req.session.session.error = "Email không tồn tại trong hệ thống!";
                res.render("user/changePassword/changePasswordWithLogin", { session: req.session.session });
            }
        } else {
            req.session.session.error = "Email không trùng với đang đăng nhập, vui lòng thử lại!";
            res.render("user/changePassword/changePasswordWithLogin", { session: req.session.session });
        }
    }
};

exports.xacNhanOTPDoiMatKhau = async (req, res) => {
    if (req.session.session.otpConfirmChangePassword !== undefined) {
        res.render("user/changePassword/otpConfirmWithLogin");
    } else {
        res.redirect("/");
    }
};

exports.kiemTraOTPDoiMatKhauDaDangNhap = async (req, res) => {
    let { otp } = req.body;
    if (otp === "") {
        req.session.session.error = "Mã OTP không được để trống.";
        res.render("user/changePassword/otpConfirmWithLogin", { session: req.session.session });
    } else {
        // Kiểm tra mã OTP
        if (otp === req.session.session.otpConfirmChangePassword) {
            req.session.session.otp_verified_changePassword = true;
            res.redirect("/thong-tin-nguoi-dung/doi-mat-khau-moi");
        } else {
            req.session.session.error = "Mã OTP không hợp lệ. Vui lòng thử lại.";
            res.render("user/changePassword/otpConfirmWithLogin", { session: req.session.session });
        }
    }
};

//chuyển trang đổi mật khẩu mới sau khi đã xác nhận otp
exports.chuyenTrangDoiMatKhauKhiDaCheckOtp = async (req, res) => {
    if (req.session.session.otp_verified_changePassword === true) {
        res.render("user/changePassword/changePasswordHavedCheckOtp");
    } else {
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
            if (userData[0].PassWord === password) {
                let sqlUpdatePassword = "UPDATE user SET password = ? WHERE email = ?";
                await query.queryWithParams(sqlUpdatePassword, [newPassword, email]); // Cập nhật mật khẩu mới
                req.session.session.notification = "Mật khẩu đã được cập nhật thành công!";
                // Xóa thông tin trong session
                req.session.session.otp_verified_changePassword = null;
                req.session.session.otpConfirmChangePassword = null;
                sendEmail(
                    email,
                    "Thông báo đổi mật khẩu mới", // Tiêu đề email
                    `Xin chào ${userName},\n\nBạn đã đổi mật khẩu mới thành công!`
                );
                res.render("user/changePassword/changePasswordHavedCheckOtp", { session: req.session.session });
            } else {
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

//user get message
exports.get_message = async (req, res) => {
    const userId = req.body.userId;
    console.log("userId: " + userId);

    try {
        // Lấy tin nhắn từ bảng chat_realtime
        const sqlMessages = `
      SELECT * FROM chat_realtime
      WHERE (idSend = ? AND idReceive = 1)
         OR (idSend = 1 AND idReceive = ?)
      ORDER BY id DESC
      LIMIT 10
    `;

        connection.execute(sqlMessages, [userId, userId], (err, dataMessages) => {
            if (err) {
                console.error("Error fetching messages:", err);
                return res.status(500).send("Error fetching messages");
            }

            console.log(dataMessages);

            // Trả về dữ liệu tin nhắn
            res.json(dataMessages);
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).send("Server error");
    }
};

exports.guest_has_seen_message = async (req, res) => {
    const idSee = req.body.userId;

    // Lấy tin nhắn
    const sqlSelect = `SELECT * FROM chat_realtime WHERE idSend = 1 AND idReceive = ? LIMIT 20`;
    connection.query(sqlSelect, [idSee], (err, dataMessages) => {
        if (err) {
            console.error('Error fetching messages:', err);
            return res.status(500).send('Server error');
        }

        if (dataMessages.length > 0) {
            // Cập nhật trạng thái state = 1
            const messageIds = dataMessages.map(message => message.id);
            const sqlUpdate = `UPDATE chat_realtime SET state = 1 WHERE id IN (?)`;
            console.log(messageIds);
            connection.query(sqlUpdate, [messageIds], (err) => {
                if (err) {
                    console.error('Error updating messages:', err);
                    return res.status(500).send('Server error');
                }

                // Lấy lại dữ liệu đã cập nhật
                const sqlUpdated = `SELECT * FROM chat_realtime WHERE id IN (?)`;
                connection.query(sqlUpdated, [messageIds], (err, dataUpdated) => {
                    if (err) {
                        console.error('Error fetching updated messages:', err);
                        return res.status(500).send('Server error');
                    }
                    
                    res.json(dataUpdated);
                });
            });
        } else {
            res.json([]); // Không có tin nhắn
        }
    });
};