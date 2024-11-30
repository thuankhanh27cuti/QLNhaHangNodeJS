const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const query = require("../query");
require('dotenv').config(); // Tải biến môi trường
// Cấu hình Passport với Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let sqlCountUser = "SELECT COUNT(*) AS count FROM user WHERE email = ?";
      let dataCountUser = await query.selectAllWithParams(sqlCountUser, [profile.emails[0].value]);
      let countUser = dataCountUser[0].count;
      //chưa có
      if (countUser === 0) {
        let sql = "INSERT INTO user (UserName, PassWord, LoaiUser, Ten, email, oauth_provider, oauth_uid) VALUES (?, ?, ?, ?, ?, ?, ?)";
        await query.queryWithParams(sql, [
            profile.name.familyName, // Họ
            "defaultpassword", // Mật khẩu
            2, // Loại người dùng
            profile.displayName, // Tên hiển thị
            profile.emails[0].value, // Email
            "google", // Nhà cung cấp OAuth
            profile.id, // ID từ Google
            ]);
        }
        // Lấy thông tin người dùng vừa tạo
        let sqlGetUser = "SELECT * FROM user WHERE email = ?";
        let userData = await query.selectAllWithParams(sqlGetUser, [profile.emails[0].value]);
        let user = userData[0];

        // Trả về thông tin người dùng
        done(null, user); // Trả về user để lưu vào req.user
    }
  )
);

// Lưu thông tin người dùng vào session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Lấy thông tin người dùng từ session
passport.deserializeUser((user, done) => {
  done(null, user);
});
