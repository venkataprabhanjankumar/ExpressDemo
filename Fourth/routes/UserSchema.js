var mongoose = require('mongoose')

var UserSchema = mongoose.Schema({
    username : {
        type : String,
        unique : true,
        required : true,
        maxLength : 50,
        allowNull : false,
        index : true
    },
    hobbies : {
        type : [String]
    },
    email :{
        type : String,
        unique: true,
        required: true,
        index : true,
    },
    dob : {
        type : Date,
        default : Date.now()
    }

});

var categorySchema = mongoose.Schema({
    categoryName : {
        type : String
    },
    categoryDetails : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users"
    }
})

/*var modelSchema = mongoose.Schema({
    name : String,
    email : String,
    age : Number
});*/

var UsersDb = mongoose.model("Users",UserSchema);
var CategoriesDb = mongoose.model("Categories",categorySchema);

module.exports = {
    UsersDb,
    CategoriesDb
}

