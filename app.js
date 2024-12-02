const express = require("express");
const session = require("express-session");
const loginRoutes = require("./routes/loginRoutes");
const monAnRoutes = require("./routes/MonAnRoutes");
const userViewRoutes = require("./routes/UserViewRoutes");
const adminViewRoutes = require("./routes/AdminViewRoutes");
const adminViewAddRoutes = require("./routes/AdminViewAddRoutes");
const adminViewUpdateRoutes = require("./routes/AdminViewUpdateRoutes");
const chartApiRoutes = require("./routes/chartApiRoutes");
const congThucMonRoutes = require("./routes/congThucMonApiRoutes");
const nguyenLieuRoutes = require("./routes/nguyenLieuApiRoutes");
const giamGiaRoutes = require("./routes/giamGiaApiRoutes");
const bodyParser = require("body-parser");
const { join } = require("node:path");
const app = express();
const PORT = 3000;
const socketIo = require("socket.io");
const query = require("./query");

const http = require("http");
const server = http.createServer(app);
const io = socketIo(server);

const passport = require("passport");
const mysql = require('mysql');


app.use(
    session({
        resave: false,
        saveUninitialized: true,
        secret: "session_secret",
    })
);


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'qlnhahangv3'
});


app.use(passport.initialize());

app.use(express.static(join(__dirname, "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use((req, res, next) => {
    if (req.session.session) {
        req.session.session.cart = req.session.session.cart || [];
    }
    res.locals.session = req.session.session;
    //console.log('session'+ JSON.stringify(res.locals.session));
    next();
});

app.use(express.static("public"));
app.use("/", loginRoutes);
app.use("/", userViewRoutes);
app.use("/admin", adminViewRoutes);
app.use("/admin/add", adminViewAddRoutes);
app.use("/admin/update", adminViewUpdateRoutes);

app.use("/api/v1/chart", chartApiRoutes);
app.use("/api/v1/mon-an", monAnRoutes);
app.use("/api/v1/cong-thuc-mon", congThucMonRoutes);
app.use("/api/v1/nguyen-lieu", nguyenLieuRoutes);
app.use("/api/v1/giam-gia", giamGiaRoutes);

let userSockets = [];

io.on("connection", (socket) => {
    console.log("Client connected", userSockets);

    //Remove socket on disconnect
    socket.on("disconnect", () => {
        for (let i = 0; i < userSockets.length; i++) {
            if (userSockets[i].socketId === socket.id) {
                console.log("User disconnected:", userSockets[i].idUser);
                userSockets.splice(i, 1); // Xóa phần tử khỏi danh sách
                break; // Dừng vòng lặp sau khi đã tìm và xóa phần tử
            }
        }
        console.log("Client disconnected", userSockets);
    });

    //user send message
    socket.on("send_msg", async (data) => {
        const userId = data.idUser; //idSend
        const idReceive = data.idReceiveClick; //idReceive
        const message = data.msg; //message

        try {
            const sql = "INSERT INTO chat_realtime (idSend, idReceive, message, state, date_chat) VALUES (?, ?, ?, ?, NOW())";
            await query.queryWithParams(sql, [userId, idReceive, message, 0]);
            console.log("Thêm tin nhắn vào database thành công!");
            console.log(userSockets);
            const userSocket = userSockets.find((userSocket) => userSocket.idUser == idReceive);
            if (userSocket) {
                io.to(userSocket.socketId).emit("receive_msg", { message: message, idSend: userId, id_Receive: idReceive });
                get_numble_message(userSocket.idUser);
                console.log('Đã gửi tin nhắn tới', idReceive);
            } else {
                console.log("User", idReceive, "is not connected");
            }
        } catch (e) {
            console.error("Error inserting data into users table: " + e);
        }
    });

    //Server get number message in client not see
    socket.on('getNumbleMessage', data => {
        const userId = data.idUser;   
        get_numble_message(userId);
    })

    function get_numble_message(id_User){
        const sql = 'SELECT * FROM chat_realtime WHERE idReceive = ? AND state = ?';
        const values = [id_User, 0];
        connection.query(sql, values, (error, results, fields) => {
            if (error) {
                console.error('Error inserting data into users table: ' + error.stack);
                return;
            }
            const numMessages = results.length;
            const userSocket = userSockets.find(userSocket => userSocket.idUser == id_User);
            if (userSocket) {
                io.to(userSocket.socketId).emit(
                    'receive_number_msg', {numMessages}
                );
                console.log(id_User, ' đang get number') 
            }else{
                console.log('User', id_User, 'is not connected');
            }
        });
    }

    //Server get idUser
    socket.on("sendIdUser", (data) => {
        const userId = data.idUser;
        let socketExists = false;

        //Kiểm tra xem id đã tồn tại chưa
        for (const userSocket of userSockets) {
            if (userSocket.idUser === userId) {
                socketExists = true;
                console.log("User đã connect rồi");
                break;
            }
        }
        // If not exist, add
        if (!socketExists) {
            userSockets.push({ idUser: userId, socketId: socket.id });
        }
        console.log("Danh sách client", userSockets);
    });

    //Server get number message in client not see
    socket.on("adminGetNumbleMessage", (data) => {
        const userId = data.idUser;
        get_numble_message_admin(userId);
    });

    async function get_numble_message_admin(id_User) {
        const sql = `SELECT *
                    FROM chat_realtime
                    WHERE state = 0 AND idSend <> 1
                    AND id IN (
                        SELECT MAX(id)
                        FROM (
                            SELECT id, idSend, idReceive
                            FROM chat_realtime
                            WHERE state = 0 AND idSend <> 1
                            ORDER BY id DESC
                        ) AS t
                        GROUP BY idSend, idReceive
                    );`;
        const values = [];
        try {
            const data = await query.selectAll(sql, [1]);
            const numMessages = data.length;
            const userSocket = userSockets.find((userSocket) => userSocket.idUser == 1);
            if (userSocket) {
                console.log('da send numbẻ ' + numMessages + 'tới' + userSocket.socketId);
                io.to(userSocket.socketId).emit("admin_receive_number_msg", { numMessages });
            } else {
                console.log("User", id_User, "is not connected");
            }
        } catch (e) {
            console.log('error' + e);
        }
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
