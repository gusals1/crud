var fs = require('fs')
var express = require('express')
var bodyParser = require('body-parser')
var ejs = require('ejs')
var mysql = require('mysql');
var cookieParser = require('cookie-parser');

var client = mysql.createConnection({
  user:'root',
  password:'8161',
  database:'crud'

});

var app = express()

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))


//홈 화면 출력 ( 해도되고 안해도 된다.)
app.get('/home', function(req, res) {
        fs.readFile('HOME.ejs', 'utf8', function(error, data) {
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(ejs.render(data,{
            }));
        });
    });

app.get('/', function(req, res) {
      fs.readFile('HOME.ejs', 'utf8', function(error, data) {
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.end(ejs.render(data,{
        }));
      });
    });

// app.get('/', function(req, res) {
//         fs.readFile('loginpage.html', 'utf8', function(error, data) {
//             res.writeHead(200, { 'Content-Type': 'text/html' })
//             res.end(ejs.render(data, { // 나중에 로그인 파일 넣을수도.
//             }));
//           })
//         if(req.cookies.auth){
//           console.log('login success');
//           fs.readFile('home2.ejs', 'utf8', function(error, data) {
//               res.writeHead(200, { 'Content-Type': 'text/html' })
//               res.end(ejs.render(data,{
//               }));
//         })
//     }
//         else{
//           fs.readFile('loginpage.html', 'utf8', function(error, data) {
//               res.writeHead(200, { 'Content-Type': 'text/html' })
//               res.end(ejs.render(data, { // 나중에 로그인 파일 넣을수도.
//               }));
//             })
//         }
//
// })
// app.post('/',function(req,res){
//   var login = req.body.login;
//   var password =req.body.password;
//
//   console.log(login,password);
//   console.log(req.body);
//
//
//
//   if(login == 'root' && password =='8161'){
//     res.cookie('auth',true);
//     res.redirect('/home');
//   }
//   else  {
//     res.redirect('/');
//   }
// });

//조회하는코드
app.get('/list', function(req, res) {
    fs.readFile('LIST.ejs', 'utf8', function (err, data) {
     client.query('SELECT * FROM members', function (err, results) {
       if (err) {
         console.log(err)
       } else {
         res.send(ejs.render(data, {
           data: results
         }))
       }
     })
   })
 })

app.get('/find', function(req, res) {
  fs.readFile('FIND.ejs', 'utf8', function (err, data) {
// console.log(req);
     client.query('select * from members', function (err, results) {
     if (err) {
       res.send(err)
     } else {
       res.send(ejs.render(data, {
         data: results
       }))
     }
   })
 })
})
//찾기
app.post('/find', function(req, res) {
  var body = req.body;
  fs.readFile('FIND.ejs', 'utf8', function (err, data) {
// console.log(req);
     client.query('select * from members where id=?;',[body.id], function (err, results) {
     if (err) {
       res.send(err)
     } else {
       res.send(ejs.render(data, {
         data: results // 여기서 data : results 에는 내가 찾은 번호의 정보만 들어있음
         //그래서 전달된 데이터를 모두 다 띄워도 한줄만 뜨게됨.
       }))
     }
   })
 })
  // client.query('select * from members where id=?;',[body.id],function(){
  //   res.redirect('/find')
  // })

});


//추가
app.get('/insert', function(req, res) {
  fs.readFile('INSERT.ejs', 'utf8', function (err,data) {
   client.query('SELECT * FROM members', function (err, results) {
     if(err){
       console.log(error);
     }else{
       res.end(ejs.render(data, {
            data: results
      }))
    }
  })
 })
})
app.post('/insert', function(req, res) {
  var body = req.body;
  client.query('insert into members(id , name , region) values(?,?,?);',[
      body.id,
      body.name,
      body.region
],function(){
  res.redirect('/insert')
})
})
//삭제
app.get('/del', function(req, res) {
  fs.readFile('DELETE.ejs', 'utf8', function (err, data) {
   client.query('select * from members', function (err, results) {
     if (err) {
       res.send(err)
     } else {
       res.send(ejs.render(data, {
         data: results
       }))
     }
   })
 })
})
app.post('/del', function(req, res) {
  var body = req.body;
  client.query('delete from members where id= ?; ', [body.id
  ],function(){
    console.log(body.id)
    console.log(client.query);
    res.redirect('/del')
  })
    })
    //수정코드
app.get('/edit', function(req, res) {
    // showAll(res, 'edit.ejs')
     fs.readFile('EDIT.ejs', 'utf8', function (err, data) {
     client.query('select * from members', function (err, results) {
       if (err) {
         res.send(err)
       } else {
         res.send(ejs.render(data, {data: results }))
       }
     })
   })
  })
app.post('/edit', function(req, res) {
  var body = req.body;
  client.query('update members set name=?,region=? where id=?;',[
    body.name,
    body.region,
    body.id
  ],function(){
    res.redirect('/edit')
  })

})

app.listen(80, function() {
    console.log('server running(80port)')
})
