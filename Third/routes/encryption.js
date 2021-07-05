var Sequelize = require('sequelize');
var EncryptedField = require('sequelize-encrypted');

conn = new Sequelize.Sequelize('postgres', 'postgres', 'prabhanjan7241', {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 1000 //The maximum time, in milliseconds, that a connection can be idle before being released
    }
});

conn.authenticate().then(
    () =>{
        console.log("Database Connected");
    }
).catch(
    err =>{
        console.log("Unable To Connect To Databae",err.stack)
    }
)
// secret key should be 32 bytes hex encoded (64 characters)
var key = "2becfdd45188a7dccfb37e2a912d90e657bdcc87a7852bab7fbe89fb2655386b"

var enc_fields = EncryptedField(Sequelize, key);
console.log(enc_fields._algorithm)

var User = conn.define('user', {
    name: Sequelize.STRING,
    encrypted: enc_fields.vault('encrypted'),

    // encrypted virtual fields
    private_1: enc_fields.field('private_1'),

    // Optional second argument allows you
    // to pass in a validation configuration
    // as well as an optional return type
    private_2: enc_fields.field('private_2', {
      type: Sequelize.TEXT,
      validate: {
        isInt: true
      },
      defaultValue: null
    })
})
var user = User.sync({force : true}).then(
    function (){
        var data = User.create(
            {name : 'prabhanjan',encrypted : 'prabha'}
        ).then(function (data){
            console.log("User Created")
            console.log(data)
            data.password = 'hello';
        })
    }
)
//user.save();
//user.set('password','prabhanjan');
//console.log(user);
