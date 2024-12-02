const query = require("../query");
const mysql = require('mysql2');

const perPages = 10;

// Tạo kết nối với cơ sở dữ liệu
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // Thay bằng user của bạn
  password: '',        // Thay bằng password của bạn
  database: 'qlnhahangv3' // Thay bằng tên cơ sở dữ liệu của bạn
});

exports.home = async (req, res) => {
  res.render("admin/index");
};

exports.allMonAn = async (req, res) => {
  let { page } = req.query;
  let currentPage = 1;

  let parsePage = parseInt(page);
  if (!isNaN(parsePage)) {
    currentPage = parseInt(page);
  }

  let start = (currentPage - 1) * perPages;

  let sql = "SELECT MaSP, TenSP, GiaBan, GioiThieuSP, TenLoai FROM danhmucsp LEFT JOIN loaisp l on l.LoaiSP = danhmucsp.MaLoai ORDER BY MaSP LIMIT ?, ?";

  let data = await query.selectAllWithParams(sql, [start, perPages]);

  let sqlCount = "SELECT COUNT(*) AS total FROM danhmucsp";
  let queryCount = await query.selectAll(sqlCount);
  let dataCount = queryCount[0].total;

  let pages = Math.ceil(dataCount / perPages);

  res.render("admin/all/monAn", { data: data, pages: pages });
};

exports.allBaiViet = async (req, res) => {
  let { page } = req.query;
  let currentPage = 1;

  let parsePage = parseInt(page);
  if (!isNaN(parsePage)) {
    currentPage = parseInt(page);
  }

  let start = (currentPage - 1) * perPages;

  let sql =
    "SELECT MaSP, blog_tieu_de, blog_tom_tat, blog_uploaded_at, UserName, SUM(IF((b2.blog_id IS NULL AND b.blog_id IS NULL) OR (b2.blog_id IS NOT NULL AND b.blog_id IS NOT NULL), 0, 1)) AS need_reply FROM baiviet LEFT JOIN user u on baiviet.blog_author_id = u.userId LEFT JOIN binhluanbaiviet b on baiviet.MaSP = b.blog_id LEFT JOIN traloibinhluan b2 on b.blog_id = b2.blog_id and b.user_id = b2.user_id GROUP BY MaSP, blog_uploaded_at ORDER BY blog_uploaded_at LIMIT ?, ?";

  let data = await query.selectAllWithParams(sql, [start, perPages]);

  let sqlCount = "SELECT COUNT(*) AS total FROM baiviet";
  let queryCount = await query.selectAll(sqlCount);
  let dataCount = queryCount[0].total;

  let pages = Math.ceil(dataCount / perPages);

  res.render("admin/all/baiViet", { data: data, pages: pages });
};

exports.allBinhLuanBaiViet = async (req, res) => {
  let { id, page } = req.query;
  let currentPage = 1;

  let parsePage = parseInt(page);
  if (!isNaN(parsePage)) {
    currentPage = parseInt(page);
  }

  let start = (currentPage - 1) * perPages;

  let sql = `SELECT b.blog_id, u.userId AS user_comment_id, u.UserName AS user_comment_username, comment_text, comment_time, u2.userId AS user_reply_id, u2.UserName AS user_reply_username, reply_text, reply_time FROM binhluanbaiviet b LEFT JOIN baiviet b2 on b2.MaSP = b.blog_id LEFT JOIN user u on u.userId = b.user_id LEFT JOIN traloibinhluan t on b.blog_id = t.blog_id and b.user_id = t.user_id LEFT JOIN user u2 on u2.userId = t.user_reply_id WHERE b.blog_id = ? LIMIT ?, ?`;

  let data = await query.selectAllWithParams(sql, [id, start, perPages]);

  console.log(data);

  let sqlCount = "SELECT COUNT(*) AS count FROM binhluanbaiviet WHERE blog_id = ?";
  let queryCount = await query.selectAllWithParams(sqlCount, [id]);
  let dataCount = queryCount[0].total;

  let pages = Math.ceil(dataCount / perPages);

  res.render("admin/all/binhLuanBaiViet", { data: data, pages: pages });
};

exports.allTaiKhoan = async (req, res) => {
  let { page } = req.query;
  let currentPage = 1;

  let parsePage = parseInt(page);
  if (!isNaN(parsePage)) {
    currentPage = parseInt(page);
  }

  let start = (currentPage - 1) * perPages;

  let sql = "SELECT * FROM user LIMIT ?, ?";

  let data = await query.selectAllWithParams(sql, [start, perPages]);

  let sqlCount = "SELECT COUNT(*) AS total FROM user";
  let queryCount = await query.selectAll(sqlCount);
  let dataCount = queryCount[0].total;

  let pages = Math.ceil(dataCount / perPages);

  res.render("admin/all/taiKhoan", { data: data, pages: pages });
};

exports.allNguyenLieu = async (req, res) => {
  let { page } = req.query;
  let currentPage = 1;

  let parsePage = parseInt(page);
  if (!isNaN(parsePage)) {
    currentPage = parseInt(page);
  }

  let start = (currentPage - 1) * perPages;

  let sql = "SELECT * FROM nguyenlieu ORDER BY MaNL LIMIT ?, ?";

  let data = await query.selectAllWithParams(sql, [start, perPages]);

  let sqlCount = "SELECT COUNT(*) AS total FROM nguyenlieu";
  let queryCount = await query.selectAll(sqlCount);
  let dataCount = queryCount[0].total;

  let pages = Math.ceil(dataCount / perPages);

  res.render("admin/all/nguyenLieu", { data: data, pages: pages });
};

exports.allHoaDonBan = async (req, res) => {
  res.render("admin/all/hoaDonBan");
};

exports.allNhapHang = async (req, res) => {
  let { tungay, denngay } = req.query;

  let data = [];

  let required = tungay !== undefined && denngay !== undefined && tungay !== "" && denngay !== "";

  let total = 0;

  if (required) {
    let sql = "SELECT MaHoaDonNhap, NgayNhapHang, Ho, Ten FROM baocaohoadonnhap WHERE DATE(NgayNhapHang) BETWEEN ? AND ?";
    data = await query.selectAllWithParams(sql, [tungay, denngay]);

    for (let i = 0; i < data.length; i++) {
      let maHoaDonNhap = data[i].MaHoaDonNhap;
      let sql =
        "SELECT SUM(TongTien) AS TongTien FROM hoadonnhap inner JOIN chitiethoadonnhap on chitiethoadonnhap.MaHoaDonNhap = hoadonnhap.MaHoaDonNhap WHERE hoadonnhap.MaHoaDonNhap = ?";
      let tongTien = await query.selectAllWithParams(sql, [maHoaDonNhap]);
      data[i].tongTien = tongTien[0].TongTien || 0;
      total = total + data[i].tongTien;
    }
  } else {
    tungay = "";
    denngay = "";
  }

  res.render("admin/all/nhapHang", { data: data, tungay: tungay, denngay: denngay, total: total });
};

exports.allGiamGia = async (req, res) => {
  let { page } = req.query;
  let currentPage = 1;

  let parsePage = parseInt(page);
  if (!isNaN(parsePage)) {
    currentPage = parseInt(page);
  }

  let start = (currentPage - 1) * perPages;

  let sql = "SELECT * FROM giamgia ORDER BY GiamGia LIMIT ?, ?";

  let data = await query.selectAllWithParams(sql, [start, perPages]);

  let sqlCount = "SELECT COUNT(*) AS total FROM giamgia";
  let queryCount = await query.selectAll(sqlCount);
  let dataCount = queryCount[0].total;

  let pages = Math.ceil(dataCount / perPages);
  res.render("admin/all/giamGia", { data: data, pages: pages });
};

exports.allLoaiSanPham = async (req, res) => {
  let { page } = req.query;
  let currentPage = 1;

  let parsePage = parseInt(page);
  if (!isNaN(parsePage)) {
    currentPage = parseInt(page);
  }

  let start = (currentPage - 1) * perPages;

  let sql = "SELECT * FROM loaisp LIMIT ?, ?";

  let data = await query.selectAllWithParams(sql, [start, perPages]);

  let sqlCount = "SELECT COUNT(*) AS total FROM loaisp";
  let queryCount = await query.selectAll(sqlCount);
  let dataCount = queryCount[0].total;

  let pages = Math.ceil(dataCount / perPages);
  res.render("admin/all/loaiSanPham", { data: data, pages: pages });
};

exports.allNhaCungCap = async (req, res) => {
  let { page } = req.query;
  let currentPage = 1;

  let parsePage = parseInt(page);
  if (!isNaN(parsePage)) {
    currentPage = parseInt(page);
  }

  let start = (currentPage - 1) * perPages;

  let sql = "SELECT * FROM nhacungcap LIMIT ?, ?";

  let data = await query.selectAllWithParams(sql, [start, perPages]);

  let sqlCount = "SELECT COUNT(*) AS total FROM nhacungcap";
  let queryCount = await query.selectAll(sqlCount);
  let dataCount = queryCount[0].total;

  let pages = Math.ceil(dataCount / perPages);
  res.render("admin/all/nhaCungCap", { data: data, pages: pages });
};

exports.allDatBan = async (req, res) => {
  let { page } = req.query;
  let currentPage = 1;

  let parsePage = parseInt(page);
  if (!isNaN(parsePage)) {
    currentPage = parseInt(page);
  }

  let start = (currentPage - 1) * perPages;

  let sql = "SELECT * FROM datban ORDER BY thoiGian DESC LIMIT ?, ?";

  let data = await query.selectAllWithParams(sql, [start, perPages]);

  let sqlCount = "SELECT COUNT(*) AS total FROM datban";
  let queryCount = await query.selectAll(sqlCount);
  let dataCount = queryCount[0].total;

  let pages = Math.ceil(dataCount / perPages);
  res.render("admin/all/datBan", { data: data, pages: pages });
};

exports.allDonHang = async (req, res) => {
  let { page } = req.query;
  let currentPage = 1;

  let parsePage = parseInt(page);
  if (!isNaN(parsePage)) {
    currentPage = parseInt(page);
  }

  let start = (currentPage - 1) * perPages;

  let sql =
    "SELECT MaHoaDon, NgayLap, UserName, MaBan, MaGiamGia, PhuongThucTT, hoadonban.GhiChu, trangthai FROM hoadonban LEFT JOIN user u on hoadonban.userId = u.userId ORDER BY NgayLap DESC LIMIT ?, ?";

  // Todo: Sửa phương thức thanh toán trong cơ sở dữ liệu gốc

  let data = await query.selectAllWithParams(sql, [start, perPages]);

  let sqlCount = "SELECT COUNT(*) AS total FROM hoadonban";
  let queryCount = await query.selectAll(sqlCount);
  let dataCount = queryCount[0].total;

  let pages = Math.ceil(dataCount / perPages);

  res.render("admin/all/donHang", { data: data, pages: pages });
};

exports.allCongThucMon = async (req, res) => {
  let { page } = req.query;
  let currentPage = 1;

  let parsePage = parseInt(page);
  if (!isNaN(parsePage)) {
    currentPage = parseInt(page);
  }

  let start = (currentPage - 1) * perPages;

  let sql = "SELECT MaSP, TenSP FROM danhmucsp LIMIT ?, ?";

  let data = await query.selectAllWithParams(sql, [start, perPages]);

  for (let i = 0; i < data.length; i++) {
    let maSp = data[i].MaSP;
    let sql =
      "SELECT TenNL, SoLuongCanDung FROM congthucmon c RIGHT JOIN danhmucsp d on c.MaSP = d.MaSP RIGHT JOIN nguyenlieu n on n.MaNL = c.MaNL WHERE d.MaSP = ?";
    data[i].congThuc = await query.selectAllWithParams(sql, [maSp]);
  }

  let sqlCount = "SELECT COUNT(*) AS total FROM danhmucsp";
  let queryCount = await query.selectAll(sqlCount);
  let dataCount = queryCount[0].total;

  let pages = Math.ceil(dataCount / perPages);

  res.render("admin/all/congThucMon", { data: data, pages: pages });
};

exports.allTruNguyenLieu = async (req, res) => {
  let { page } = req.query;
  let currentPage = 1;

  let parsePage = parseInt(page);
  if (!isNaN(parsePage)) {
    currentPage = parseInt(page);
  }

  let start = (currentPage - 1) * perPages;

  let sql = "SELECT id, time, quantity, l.MaNL, TenNL, DonGiaNhap FROM lichsunguyenlieu l LEFT JOIN nguyenlieu n on n.MaNL = l.MaNL LIMIT ?, ?";

  let data = await query.selectAllWithParams(sql, [start, perPages]);

  let sqlCount = "SELECT COUNT(*) AS total FROM lichsunguyenlieu";
  let queryCount = await query.selectAll(sqlCount);
  let dataCount = queryCount[0].total;

  let pages = Math.ceil(dataCount / perPages);

  res.render("admin/all/truNguyenLieu", { data: data, pages: pages });
};

exports.chartDate = async (req, res) => {
  res.render("admin/chart/date");
};

exports.chartMonth = async (req, res) => {
  res.render("admin/chart/month");
};

exports.chartYear = async (req, res) => {
  let { year } = req.query;
  let yearParams = 0;

  let parseYear = parseInt(year);
  if (!isNaN(parseYear)) {
    yearParams = parseInt(year);
  } else {
    yearParams = new Date().getFullYear();
  }

  res.render("admin/chart/year", { yearParams: yearParams });
};

exports.admin_get_has_seen_message = async (req, res) => {
  try {
    // Tạo kết nối với cơ sở dữ liệu
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',        // Thay bằng user của bạn
      password: '',        // Thay bằng password của bạn
      database: 'qlnhahangv3' // Thay bằng tên cơ sở dữ liệu của bạn
    });

    // Truy vấn SQL tương tự đoạn mã trong PHP
    const sql = `
          SELECT * FROM chat_realtime
          WHERE state = 0
            AND idReceive = 1
            AND id IN (
              SELECT MAX(id)
              FROM chat_realtime
              WHERE state = 0
                AND idReceive = 1
              GROUP BY idSend, idReceive
            );
        `;

    // Thực thi truy vấn
    connection.query(sql, (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Server error");
        return;
      }

      // Trả về kết quả
      res.json(results);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server error");
  }
};

exports.get_all_user_message = async (req, res) => {
  const sql = `
    SELECT cr1.* 
    FROM chat_realtime AS cr1
    WHERE cr1.id = (
      SELECT MAX(id) 
      FROM chat_realtime AS cr2
      WHERE (cr1.idSend = cr2.idSend AND cr1.idReceive = cr2.idReceive)
      OR (cr1.idSend = cr2.idReceive AND cr1.idReceive = cr2.idSend)
    );
  `;

  connection.query(sql, (error, userMessages) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Server error" });
    }

    // Lấy thêm thông tin người dùng từ bảng tbl_customer
    const updatedMessages = userMessages.map(message => {
      let userId = message.idSend !== 1 ? message.idSend : message.idReceive;
      const userQuery = `
        SELECT userId AS customer_user, Ten as customer_name
        FROM user
        WHERE userId = ?
      `;

      return new Promise((resolve, reject) => {
        connection.query(userQuery, [userId], (err, users) => {
          if (err) return reject(err);

          if (users.length > 0) {
            const user = users[0];
            message.customer_user = user.customer_user ?? '';
            message.customer_name = user.customer_name ?? '';
            message.customer_avatar = user.customer_avatar ?? '';
          }

          resolve(message);
        });
      });
    });

    // Chờ tất cả các Promise (lấy thông tin người dùng)
    Promise.all(updatedMessages)
      .then((finalMessages) => {
        // Lấy các user chưa có trong tin nhắn
        const userMessIds = finalMessages.map(msg => msg.customer_user);
        if (userMessIds.length > 0) {
          userQuery = `
            SELECT userId AS customer_user, Ten AS customer_name
            FROM user
            WHERE userId NOT IN (?)
          `;
        } else {
          userQuery = `
            SELECT userId AS customer_user, Ten AS customer_name
            FROM user
          `;
        }

        connection.query(userQuery, [userMessIds], (err, allUsers) => {
          if (err) {
            console.error("Error fetching all users:", err);
            return res.status(500).json({ error: "Server error" });
          }

          // Ghép dữ liệu người dùng và tin nhắn
          const allData = [...allUsers, ...finalMessages];
          return res.json(allData);
        });
      })
      .catch(err => {
        console.error("Error processing messages:", err);
        return res.status(500).json({ error: "Server error" });
      });
  });



};

exports.get_details_message = async (req, res) => {
  const idUser = req.body.idUser;
  console.log('idUser' + idUser);
  try {
    // Lấy tin nhắn từ bảng chat_realtime
    const sqlMessages = `
      SELECT * FROM chat_realtime
      WHERE (idSend = ? AND idReceive = 1)
         OR (idSend = 1 AND idReceive = ?)
      LIMIT 20
    `;
    const [dataMessages] = await connection.promise().query(sqlMessages, [idUser, idUser]);
    //console.log(dataMessages);
    if (dataMessages.length > 0) {
      // Cập nhật trạng thái `state = 1` cho các tin nhắn đã gửi tới idReceive = 1
      const messageIds = dataMessages.map(msg => msg.id);

      const sqlUpdate = `
        UPDATE chat_realtime
        SET state = 1
        WHERE idReceive = 1
        AND id IN (?)
      `;
      await connection.promise().query(sqlUpdate, [messageIds]);

      // Lấy lại dữ liệu đã cập nhật
      const sqlUpdated = `
        SELECT * FROM chat_realtime
        WHERE id IN (?)
      `;
      const [dataUpdated] = await connection.promise().query(sqlUpdated, [messageIds]);

      // Trả về dữ liệu đã cập nhật
      res.json(dataUpdated);
    } else {
      res.json([]); // Không có tin nhắn để cập nhật
    }
  } catch (error) {
    console.error("Error fetching or updating messages:", error);
    res.status(500).send("Server error");
  }
};

exports.has_seen_message = async (req, res) => {
  const idSee = req.body.idSee;

  try {
    // Truy vấn lấy tin nhắn
    const sqlSelect = `
    SELECT * FROM chat_realtime 
    WHERE idSend = ? AND idReceive = 1
    LIMIT 20
  `;

    connection.query(sqlSelect, [idSee], (err, dataMessages) => {
      if (err) {
        console.error('Error fetching messages:', err);
        return res.status(500).send('Server error');
      }

      if (dataMessages.length > 0) {
        // Cập nhật trạng thái `state = 1`
        const messageIds = dataMessages.map(msg => msg.id);

        const sqlUpdate = `
        UPDATE chat_realtime 
        SET state = 1 
        WHERE id IN (?)
      `;

        connection.query(sqlUpdate, [messageIds], (err) => {
          if (err) {
            console.error('Error updating messages:', err);
            return res.status(500).send('Update error');
          }

          // Trả về kết quả thành công
          res.send({message: 'success'});
        });
      } else {
        res.send('No messages found');
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).send('Server error');
  }
};