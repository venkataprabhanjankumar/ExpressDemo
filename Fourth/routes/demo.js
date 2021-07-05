var express = require('express');
var csrf = require('csurf')
var multer = require('multer')
var sanitize = require('sanitize')();
var {check} = require('express-validator')

var app = express()

var route = express.Router();

var csrfProtected = csrf({cookie : true})

route.get('/demo',csrfProtected,(request,response)=>{
    response.render('display',{myname:'prabhanjan',url:"http://localhost:8080/demo",csrfToken : request.csrfToken()})
});

var validator= [
    check('email').isEmail().normalizeEmail(),
    check('username').isLength({min : 5})
]

var uploads = multer({dest:'media'})
app.use(uploads.array()) //optional for uploading multiple files
var uploadFile = uploads.fields([{name : 'upload',maxCount : 5}])
route.post('/demo',validator,uploadFile,csrfProtected,(request,response)=>{
    console.log(request.files);
    console.log(request.body);
    console.log(request.body.username)
    sanitize.value(request.body.email,'email')

})

route.get('/cookiedemo',(request,response)=>{
    response.cookie('name','prabhanjan',{expire: 360000 + Date.now()}).send('cookie set') //sets the cookie name=prabhanjan
    //This cookie also expires after 360000 ms from the time it is set.
    //res.cookie(name, 'value', {maxAge: 360000});
    console.log(request.cookies)
});

route.get('/clearcookie',(request,response)=>{
    response.clearCookie('name');
    console.log("Cookies Cleared");
})

module.exports = route