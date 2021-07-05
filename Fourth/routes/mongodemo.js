var mongoose = require('mongoose')
var express = require('express')
var {UsersDb,CategoriesDb} = require('./UserSchema')
var mongoroute = express.Router();

mongoose.connect("mongodb+srv://prabhanjan_kumar:prabhanjan7241@mycluster1.lhqpv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {useNewUrlParser : true,useUnifiedTopology : true,useCreateIndex : true},function (err){
    if(err){
        throw err
    }
    console.log("Connected");
});

mongoroute.post("/postdata",(request,response)=>{
    console.log(request.body)
    var details = new UsersDb({
        username : request.body.username,
        hobbies : request.body.hobbies,
        email : request.body.email,
    });
    details.save(function (err,result){
        if(err){
            throw err
        }
        console.log(result)
        response.end("Inserted")
    })
});

mongoroute.post('/sendcategory',(request,response)=>{
    console.log(request.body)
    var username = request.body.username
    var user = UsersDb.findOne({username : username}, (err,result)=>{
        if(err){
            throw err
        }
        console.log(result);
        console.log(result._id)
    });
    var category = CategoriesDb({
        categoryName : request.body.categoryName,
        categoryDetails : request._id
    });
    category.save(function (err,cresult){
        if(err){
            throw err
        }
        console.log(cresult);
    })
});

mongoroute.get('/userdetails',(request,response)=>{
    var userdetails = UsersDb.find(function (err,result){
        console.log(result)
        result.map(
            user => {
                console.log(user)
            }
        )
    });
});

mongoroute.get('/user/:username',(resuest,response)=>{
    var username = resuest.params.username
    console.log(username)
    var user = UsersDb.findOne({username : username},(err,result)=>{
        if(err){
            throw err
        }
        console.log(result)
        response.json(result)
    });
})

mongoroute.delete('/deleteuser/:username',(request,response)=>{
    var username = request.body.username
    //Creates a findOneAndDelete query: atomically finds the given document, deletes it, and returns the document as it was before deletion
    var user = UsersDb.findOneAndDelete({username : username},null,(err,result)=>{
        if(err){
            throw err
        }
        console.log("Deleted")
        response.end("User deleted");
    })
});

mongoroute.put('/updateuser/:username',(request,response)=>{
    var username = request.body.username;
    UsersDb.findOneAndUpdate({username:username},request.body,null,(err,result)=>{
        if(err){
            throw err
        }
        console.log("Updated");
        console.log(result)
        response.end("Updated");
    })
});

module.exports = mongoroute