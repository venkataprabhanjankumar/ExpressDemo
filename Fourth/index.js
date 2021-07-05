var express = require('express');
var cookieParser = require('cookie-parser');
var path = require('path');
var session = require('express-session');
var route1 = require('./routes/demo');
var mongoroute = require('./routes/mongodemo');
var router2 = require('./routes/sessiondemo');
var genuuid = require('uuid')

var app = express();

app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));

app.set(express.static(path.join(__dirname,'public')));

app.use(express.static('public'));
//app.use('/static',express.static('public')) //(src='/static/images/image.jpg) this is virtual path prefix

app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(cookieParser());

app.set('trust proxy',1)
app.use(session(
    {secret: "secreat key",
        genid : function (request){
            console.log("UUID is Generated")
            return genuuid.v4()
        },
        rolling : true,
        resave : false,
        saveUninitialized : true,
        cookie:{_expires : 40000,httpOnly : true},//,maximumAge : 10000
        //if we set secure : true in cookie then sessions does not work globally
    })
);



app.use(function (request,response,next){
    console.log("New Request Is Arrived at ",Date.now());
    next();
});

app.use(function (err,request,response,next){
    if(err){
        console.error(err.stack);
        response.status(500).send("Error Occured");
    }
})

app.use('/routes1',route1);
app.use('/mongo',mongoroute);
app.use('/sess',router2);

var server = app.listen(8080,'localhost',function (){
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server Is Running At http://%s:%s",host,port)
});