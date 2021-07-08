var express = require('express');
var csrf = require('csurf');
var jwt = require('jsonwebtoken')
var {User,UserRole} = require('../models/db')
var csrfProtection = csrf({cookie : true, httpOnly : true})
route1 = express.Router();

var secreat_key = "sdsfhgfsdfgg"

route1.get('/createuser',csrfProtection,(request,response)=>{
    return response.render('register',{csrfToken : request.csrfToken()})
});

route1.post('/createuser',csrfProtection,(request,response)=>{
    console.log(request.body);
    UserRole.findOne({where : {roleName : request.body.usertype}}).then(
        (data)=>{
            User.create({
                username : request.body.username,
                password : request.body.password,
                email : request.body.email,
            }).then(function (userdata){
                console.log(data.roleId);
                console.log(userdata)
                console.log("+++++++++")
                console.dir(User.sequelize.models.User_Role);
                console.log("+++++++++")
                User.sequelize.models.User_Role.create({
                    username : userdata.username,
                    roleId : data.roleId
                }).then(
                    ()=>{
                        console.log("Role Created")
                        response.render('register',{sucess : true})
                    }
                )
            });
        }
    )
});

route1.get('/login',csrfProtection,(request,response)=>{
    response.render('login',{csrfToken : request.csrfToken()})
});

route1.post('/login',csrfProtection,(request,response)=>{
    console.log(request.body);
    User.findOne({where : {username : request.body.username}}).then(
        (data)=>{
            if(data.username==request.body.username && data.password==request.body.password){
                const usertype = request.body.usertype;
                UserRole.findOne({where : {roleName : usertype}}).then(
                    (role)=>{
                        User.sequelize.models.User_Role.findOne({where :
                                {username : request.body.username , roleId : role.roleId}
                        }).then(
                            (result)=>{
                                if(result){
                                    if(role.roleName == 'admin'){
                                        //expires in 24 hours
                                        const acess_token = jwt.sign({username : data.username, password : data.password,role : role.roleName},secreat_key,{expiresIn: 86400})
                                        console.log(acess_token)
                                        response.render('adminpannel',{username : request.body.username,acess_token : acess_token})
                                    }
                                    if(role.roleName == 'user'){
                                        const acess_token = jwt.sign({username : data.username, password : data.password,role : role.roleName},secreat_key,{expiresIn: 86400})
                                        console.log(acess_token)
                                        response.render('dashboard',{username : request.body.username,acess_token : acess_token})
                                    }
                                }
                                else {
                                    response.render('login',{err : 'Invalid User'})
                                }
                            }
                        )
                    }
                )
            }
            else {
                response.render('login',{err : "Invalid Username and Password"})
            }
        }
    )
});

route1.get('/verify',(request,response)=>{
    const authHeader = request.headers.authorization;
    if(authHeader){
        const token = authHeader.split(' ')[1];
        jwt.verify(token,secreat_key,(err,user)=>{
            if(err){
                throw err
            }
            console.log(user)
            response.end(JSON.stringify(user))
        })
    }
})

module.exports = route1