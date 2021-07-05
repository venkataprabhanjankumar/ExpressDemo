var express = require('express');
var cookieParser = require('cookie-parser');
var router = express.Router();


var username = 'prabhanjan'
var password = 'prabhanjan'

router.get('/login',(request,response)=>{
    console.log(request.session)
    if(request.session.username && request.session.password){
        response.render('dashboard',{username : request.session.username})
    }
    else{
        response.render('login')
    }
});
router.post('/login',(request,response)=>{
    if(username===request.body.username && password === request.body.password){
        request.session.username = request.body.username;
        request.session.password = request.body.password;
        request.session.save(function (err){
            if(err){
                throw err
            }
            console.log("Sessions Are Saved")
        })
        console.log(request.session)
        response.render('dashboard',{username : request.session.username})
    }
});

router.get('/logout',(request,response)=>{
    request.session.destroy(function (err){
        if(err){
            throw err
        }
        console.log("Sessions Are Destroyed")
        response.redirect('/sess/login')
    })
})

module.exports = router