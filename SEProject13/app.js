var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');

const mysql      = require('mysql');
const dbconfig   = require('./config/database');
const connection = mysql.createConnection(dbconfig);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const serveStatic = require('serve-static');
const path = require('path');
const cors = require('cors');

const expressSession = require('express-session');
const fileStore = require('session-file-store')(expressSession);

//좌석정보 초기값(0 : 통로, 1 : 예약가능 좌석, 2 : 예약완료 좌석)
var seats = [
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
 [1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
 [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

//좌석정보 초기값(0 : 통로-없음, 시간) 
var seats_start_time = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
   ];
   var seats_end_time = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
   ];
   


//Express 웹서버 생성
var app = express();
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized:true,
    store: new fileStore()
}));
app.use((req,res,next)=>{
    // 해당미들웨어의 config가 위치한뒤 next()로 다음 미들웨어로 넘어가도록 처리한다.
    next()
})

app.get('/', (req, res) => {
   res.redirect('/login');
});

//'http://localhost:8000' 로 접속하면 예약현황화면('Page_Reservation.html')을 보여준다.
app.get( '/reservation', function(req, res, next){
   console.log('Server home call');
   // fs.readFile('Page_Reservation.html', function(error, data){
   //    res.send(data.toString());
   // });
    res.redirect('/Page_Reservation.html');
});

app.get('/login', function (req, res, next) {
    if(req.session.logined){
        res.redirect('/Page_Reservation.html');
    } else {
        console.log('Login page call');
        console.log(__dirname);
        res.redirect('/Page_Login.html');
    }
    // fs.readFile('Page_Login.html', function (error, data) {
    //     res.send(data.toString());
    // });
})

//'http://localhost:8000/seats' URL을 호출하면 그 순간의 좌석현황 정보를 전송한다.
app.get('/seats', function(req, res, next){
   console.log('Server Seats Call');
      res.send(seats);
});

app.post("/rsv", function(req, res){
    const start = req.body.startTime;
    const use = req.body.usingTime;
    console.log(start, use);
    res.json({ok:true});
});


//웹서버 실행
var server = http.createServer(app);
server.listen(8000, function(){
   console.log('Server Running at http://localhost:8000');
});

//소켓서버 실행
var io = socketio.listen(server);
io.sockets.on( 'connect', function(socket){

   //socket 서버에 'app' 이벤트 설정
   socket.on( 'app', function(data){
       console.log('app data', data)
      //클라이언트가 'app' 이벤트를 호출하면 함께 전송된 좌석좌표(x, y)값을 예약완료상태(1 ->2)로 변경한다.

      let start_date = new Date();
      let end_date = start_date;
      seats[data.y][data.x] = 2;
      seats_start_time[data.y][data.x] = start_date;
      end_date.setHours(end_date.getHours() + 3);
      seats_end_time[data.y][data.x] = end_date;

       // DB에 저장할 데이터들
       let startTime = data.startTime; // 시작 시간
       let usingTime = data.usingTime; // 사용 시간
       let seatNum = (data.y + data.x); // 좌석 번호 yx

       console.log(startTime, " ", usingTime, " ", seatNum);
      console.log('app data - date: ', seats_start_time[data.y][data.x].toLocaleString(), seats_end_time[data.y][data.x].toLocaleString());

      //모든 클라이언트의 'app' 이벤트를 호출하여 예약 완료된 좌석 정보를 전달한다.(= public 통신)
      io.sockets.emit('app', data);
   });
});

// login
// configuration =========================
app.post('/users', (req, res) => {
    const ID = req.body.inputID
    console.log("Requested ID = ", ID);
    connection.query("SELECT * from studentlist where ID =" + "'" + ID + "'", (error, rows) => {
        if (error) throw error;
        console.log(rows.length);
        if (rows.length == 0) {
            console.log("ID 불일치");
            res.redirect('/Page_Login.html')
        } else if(rows[0].ID == 'admin') {
            console.log("관리자 로그인");
            req.session.logined = true;
            req.session.user_id = rows[0].ID;
            res.redirect('/Page_Admin.html')
        } else if(rows[0].ID == ID) {
            console.log("ID 일치");
            console.log(rows[0].name);
            req.session.logined = true;
            req.session.user_id = rows[0].ID;
            res.redirect('/Page_Reservation.html')
        }
        // console.log('User info is: ', rows);
        // res.send(rows);
    });
});

// logout
app.post('/logout', (req, res) => {
    console.log("Logout requested");
    req.session.destroy(function (err) {
    });
    res.redirect('/Page_Login.html');
});

app.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'));
});

app.post('/register', (req, res) => {

    const name = req.body.inputUsername
    const ID = req.body.inputStudentID
    const dept = req.body.inputDeptName
    const reason = req.body.inputReason

    console.log("Registered ID = ", ID);
    console.log("Registered name = ", name);
    console.log("Registered dept = ", dept);
    console.log("Registered reason = ", reason);

    connection.query("insert into register values(" + "'" + ID + "','" + name + "','" + dept + "','" + reason + "')" , (error, rows) => {
        if (error) throw error;
        req.session.registered = true;
        res.redirect('/Page_Login.html')
    });
});

app.get('/registerList', (req, res, next) => {
    var sql = 'SELECT * FROM register'; // 클럽목록

    connection.query("SELECT * from register", (error, rows) => {
        if(error) {
            console.log("ERROR");
        } else {
            for(var i = 0; i < rows.length; i++) {
                console.log(rows[i]);
            }
            res.send(rows);
        }

    });
});
