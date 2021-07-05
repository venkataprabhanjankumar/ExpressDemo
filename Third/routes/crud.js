var express = require('express')
var {User,Category,Task,Tags} = require('./models/database')
route1 = express.Router();

var csrf = require('csurf')

var csrfProtection = csrf({ cookie: true });

route1.get('/senddbdata',csrfProtection,function (request,response){
    response.render('display',{csrfToken : request.csrfToken()})
});

route1.post('/senddbdata',csrfProtection,function (request,response){
    console.log(request.body)
    if(request.body.firstName && request.body.lastName){
        console.log("Hello");
        const firstName = request.body.firstName;
        const lastName = request.body.lastName;
        const username = request.body.username;
        const password = request.body.password;
        const email = request.body.email;
        const gender = request.body.gender;
        const hobbies = request.body.hobbies;
        const intrests1 = request.body.intrest1;
        const intrests2 = request.body.intrest2;
        const intrests = {intrests1 : intrests2}
        const dob = request.body.dob;
        User.create({
        firstName : firstName,
        lastName : lastName,
        username : username,
        email : email,
        password : password,
        gender : gender,
        hobbies : hobbies,
        intrests : intrests,
        dob : dob
        }).then(function (){
            console.log("Inserted")
        })
    }
    else{
        const fullName = request.body.fullName;
        const username = request.body.username;
        const password = request.body.password;
        const email = request.body.email;
        const gender = request.body.gender;
        const hobbies = request.body.hobbies;
        const intrests1 = request.body.intrest1;
        const intrests2 = request.body.intrest2;
        const intrests = {intrests1 : intrests2}
        const dob = request.body.dob;
        User.create({
        fullName : fullName,
        username : username,
        email : email,
        password : password,
        gender : gender,
        hobbies : hobbies,
        intrests : intrests,
        dob : dob
        }).then(function (){
            console.log("Inserted")
        })
    }
});

route1.get('/getuserdetails',(request,response)=>{
    User.findAll().then(
        users =>{
            users.map(
                user =>{
                    console.log(user.firstName);
                    console.log(user.lastName);
                    console.log(user.username);
                    console.log(user.email);
                    console.log("+++++++++++++++")
                }
            )
        }
    )
});

route1.put('/updateusersdetail/:user',(request,response)=> {
    username = request.params.user
    console.log(username)
    console.log(request.body)
    User.findOne({where: {username: username}}).then(function (user){
        user.update(request.body).then((function(){
            console.log("Updated");
            response.end("Updated");
        }))
    })
});

route1.delete('/deleteusersdetail/:user',(request,response)=> {
    username = request.params.user
    console.log(username)
    console.log(request.body)
    User.findOne({where: {username: username}}).then(function (user){
        user.destroy().then(
            function (){
                console.log("Deleted")
                response.end("Deleted")
            }
        )
    })
});

route1.get('/getusersdetailname/:user',(request,response)=> {
    username = request.params.user
    console.log(username)
    console.log(request.body)
    // gets only username,email,dob with order by hobbies
    User.findOne({where: {username: username},attributes : ['username','email','dob','hobbies'],order :['hobbies']}).then(function (user){
        console.log(user)
        response.end(user.username)
    })
});

route1.post('/findorcreate',(request,response)=>{
    console.log(request.body)
    console.log(request.body.username)
    var tagNames = []
    Object.keys(request.body).forEach(function (key){
        var value = request.body[key]
        value.map(
            sampletag =>{
                tagNames.push(sampletag)
            }
        )
    });
    console.log(tagNames)
    const tags = tagNames.map(
        tag =>{
            //if tag found it will get if not found it will create
            Tags.findOrCreate({where : {tagName : tag } }).then(
                function (tagdata){
                    console.log("Find Or Create");
                }
            )
        }
    )
})

route1.post('/sendcategory',(request,response)=>{
    console.log(request.body);
    const username = request.body.username;
    const category = request.body.category;
    console.log(username);
    Category.create({
        categoryName : category,
        UserListUsername : username
    }).then(function (){
        console.log("Category Created");
    })
});

route1.post('/sendtasks',(request,response)=>{
    console.log(request.body);
    const username = request.body.username;
    const category = request.body.category;
    const task = request.body.task;
    // it will display the users along with category by using include
    const categorydata = Category.findOne({where:{categoryName : category,UserListUsername : username},include : [{model : User}]}).then(
        function (data){
            console.log(data)
            console.log(data.categoryId);
            console.log(data.categoryName);
            Task.create({
                taskName : task,
                CategoryCategoryId : data.categoryId,
                UserListUsername: username
            }).then(
                function (){
                    console.log("Task Created");
                }
            )
        }
    )
    console.log(categorydata);
    console.log(username);
    console.log(category);
    console.log(task);

})

module.exports = route1;