var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser')
var route1 = require('./Routes/createusers')
var app = express()

app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended : true}))
app.use(express.json());
app.use(cookieParser());

app.use('/db',route1)

app.use(function (request,response,next){
    console.log("New Request Arrived At "+Date.now())
    next();
});


var server = app.listen(8080,'localhost',function (){
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server Is Running At http://%s:%s",host,port);
})