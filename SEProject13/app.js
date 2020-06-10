var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');
const cors = require('cors');


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


//'http://localhost:8000' 로 접속하면 예약현황화면('HTMLPage.html')을 보여준다.

app.get( '/', function(req, res, next){
   console.log('Server home call');
   fs.readFile('HTMLPage.html', function(error, data){
      res.send(data.toString());
   });
});



//'http://localhost:8000/seats' URL을 호출하면 그 순간의 좌석현황 정보를 전송한다.

app.get('/seats', function(req, res, next){
   console.log('Server Seats Call');
      res.send(seats);
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
      
      console.log('app data - date: ', seats_start_time[data.y][data.x].toLocaleString(), seats_end_time[data.y][data.x].toLocaleString());

      //모든 클라이언트의 'app' 이벤트를 호출하여 예약 완료된 좌석 정보를 전달한다.(= public 통신)
      io.sockets.emit('app', data); 
   });
});