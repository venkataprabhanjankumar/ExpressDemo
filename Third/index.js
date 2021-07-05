var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var csrf = require('csurf')
app = express();


//importing serializer router from routes/serializationdemo.js

var serilizeRoute = require('./routes/serializationdemo');
var sampleroute = require('./routes/crud')

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//for static files
app.set(express.static(path.join(__dirname, 'public')));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var csrfProtection = csrf({ cookie: true });
app.use(cookieParser());

//First middleware before response is sent
app.use(function (request, response, next){
    console.log("New Request Arrived at ",Date.now());
    next()
});


app.use('/', serilizeRoute);
app.use('/db',sampleroute);

/*app.get('/senddbdata',csrfProtection,function (request,response){
    response.render('display',{csrfToken : request.csrfToken()})
});

app.post('/senddbdata',csrfProtection,function (request,response){
    console.log(request.body)
    console.log("Hello")
})*/

var server = app.listen(8000, 'localhost', function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server Is Running at %s:%s", host, port);
});