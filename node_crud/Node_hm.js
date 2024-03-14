var fs = require('fs')
var express = require('express')
var bodyParser = require('body-parser')
var ejs = require('ejs')

var key
var DummyDB = (function () {
    var DummyDB = {}
    var storage = []
    var count = 1 // 더미 데이터베이스 구현.

    DummyDB.get = function (id) {
        //get방식일때 들어오는곳.
        // console.log(storage)
        if (id) {
            //변수 가공
            id = typeof id == 'string' ? Number(id) : id // (조건) ? A : B ==> 조건이 참이면 A 거짓이면 B 반환
            //데이터 선택
            for (var i in storage)
                if (storage[i].id == id) {
                    return storage[i]
                }
            return ''
        } 
        else {
            return storage
        }
    }
    DummyDB.edit = function (num, newName, newRegion) {
        if (num) {
            for (var i in storage)
                if (storage[i].id == num) {
                    storage[i].name = newName
                    storage[i].region = newRegion
                    return storage[i]
                }
            return ''
        } else {
            return storage
        }
    }

    DummyDB.insert = function (data) {
        //insert로 들어오는곳.
        data.id = count++ //1
        storage.push(data)

        return data
    }
    DummyDB.remove = function (id) {
        // remove할때 들어오는곳
        id = typeof id == 'string' ? Number(id) : id
        for (var i in storage)
            if (storage[i].id == id) {
                storage.splice(i, 1)

                return true //조건이 맞으면 true로 삭제 아니면 false로 삭제X 그리고 DummyDB를 반환함.
            }
        return false
    }
    return DummyDB
})()

var app = express()

app.use(bodyParser.urlencoded({ extended: false }))

function showAll(response, htmlFile) {
    fs.readFile(htmlFile, 'utf8', function (ejserror, ejsdata) {
        response.writeHead(200, { 'Content-Type': 'text/html' })
        response.end(
            ejs.render(ejsdata, {
                data: DummyDB.get(),
            })
        )
    })
}
//홈 화면 출력 ( 해도되고 안해도 된다.)
app.get('/home', function (req, res) {
    fs.readFile('Node-2B201868012HOME.ejs', 'utf8', function (error, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(ejs.render(data))
    })
})
//조회하는코드
app.get('/list', function (req, res) {
    showAll(res, 'Node-2B201868012LIST.ejs')
    // fs.readFile('list.ejs', 'utf8', function (error, data) {
    //     res.writeHead(200, { 'Content-Type': 'text/html' })
    //     res.end(ejs.render(data))
    // })
})
app.get('/', function (req, res) {
    fs.readFile('Node-2B201868012HOME.ejs', 'utf8', function (error, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(ejs.render(data))
    })
})
//추가하는코드
app.get('/insert', function (req, res) {
    showAll(res, 'Node-2B201868012INSERT.ejs')
    // fs.readFile('insert.ejs', 'utf8', function (error, data) {
    //     res.writeHead(200, { 'Content-Type': 'text/html' })
    //     res.end(ejs.render(data))
    // })
})
app.post('/insert', function (req, res) {
    let value = {
        id: 0,
        name: req.body.name,
        region: req.body.region,
    }

    DummyDB.insert(value)
    res.writeHead(302, {
        Location: '/insert',
    })
    res.end()
})
//삭제코드
app.get('/del', function (req, res) {
    showAll(res, 'Node-2B201868012DELETE.ejs')
    // fs.readFile('del.ejs', 'utf8', function (error, data) {
    //     res.writeHead(200, { 'Content-Type': 'text/html' })
    //     res.end(ejs.render(data))
    // })
})
app.post('/del', function (req, res) {
    var num = req.body.num

    DummyDB.remove(num)
    res.writeHead(302, {
        Location: '/del',
    })
    res.end()
})
//수정코드
app.get('/edit', function (req, res) {
    showAll(res, 'Node-2B201868012EDIT.ejs')
    // fs.readFile('edit.ejs', 'utf8', function (error, data) {
    //     res.writeHead(200, { 'Content-Type': 'text/html' })
    //     res.end(ejs.render(data))
    // })
})
app.post('/edit', function (req, res) {
    var id = req.body.num
    var newName = req.body.name
    var newRegion = req.body.region

    console.log(newName,id,newRegion)
    DummyDB.edit(id, newName, newRegion)
    res.redirect('/edit')

    // let value2 ={
    //   id: req.body.num,
    //   name : req.body.name,
    //   region : req.body.region
    // }
    // DummyDB.edit(value2)
    // res.writeHead(302,{
    //   Location:'/edit'
    // })
    // res.end()
})

app.listen(80, function () {
    console.log('server running(80port)')
})
