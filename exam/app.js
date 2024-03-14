var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');
var server = http.createServer(app);
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');



//좌석정보 초기값(0 : 통로, 1 : 예약가능 좌석, 2 : 예약완료 좌석)

var seats = [
 [1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1],
 [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
 [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
 [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
 [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
 [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
 [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
 [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
 [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
 [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
 [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
 [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1]
];

//'http://localhost:8000' 로 접속하면 예약현황화면('HTMLPage.html')을 보여준다.

app.get('/', function(req, res) {
  res.render('login2',{
    title: 'login page',
  });
})
app.post('/',function(req,res){

  var login = req.body.name;
  var password =req.body.password;

  if (login =='gusals'&& password =='8161'){
    res.cookie('auth',true);
    res.redirect('/index')
  }else {
    res.redirect('/');
  }
})
app.get('/index',function(req,res,next){
  if(req.cookies.auth){
    res.render('index',function(error,data){
      res.send(data.toString());
      console.log(data.toString())
    });
  }else{
    res.redirect('/')
  }
})

//'http://localhost:8000/seats' URL을 호출하면 그 순간의 좌석현황 정보를 전송한다.
app.get('/seats', function(req, res, next){
   console.log('Server Seats Call!');
      res.send(seats);
});

//웹서버 실행
var server = http.createServer(app);
server.listen(80, function(){
   console.log('Server Running at http://localhost:80');
});

//소켓서버 실행

var io = socketio.listen(server);
io.sockets.on('connection', function(socket){
   //socket 서버에 'reserve' 이벤트 설정
   socket.on('reserve', function(data){
      //클라이언트가 'reserve' 이벤트를 호출하면 함께 전송된 좌석좌표(x, y)값을 예약완료상태(1 ->2)로 변경한다.
      seats[data.y][data.x] = 2;
      //모든 클라이언트의 'reserver' 이벤트를 호출하여 예약 완료된 좌석 정보를 전달한다.(= public 통신)
      io.sockets.emit('reserve', data);
   });
 });
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
