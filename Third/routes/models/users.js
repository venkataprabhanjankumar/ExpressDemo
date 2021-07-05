var EncryptedField = require('sequelize-encrypted')
var Sequelize = require('sequelize')
var key = "2becfdd45188a7dccfb37e2a912d90e657bdcc87a7852bab7fbe89fb2655386b"
var enc_field = EncryptedField(Sequelize,key)
console.log(enc_field._algorithm)
//The safe returns a sequelize BLOB field configured with getters/setters for decrypting and encrypting data.
// Encrypted JSON encodes the value you set and then encrypts this value before storing in the database.
//
// Additionally, there are .field methods which return sequelize VIRTUAL fields that provide access to specific fields in the encrypted vault.
// It is recommended that these are used to get/set values versus using the encrypted field directly.
//
// When calling .vault or .field you must specify the field name. This cannot be auto-detected by the module.


module.exports = (conn,type)=>{
    return conn.define('UserList',{
        id : {
            type : type.INTEGER,
            autoIncrement : true,
            unique : true
        },
        firstName : {
            type : type.STRING,
            field : 'firstName'
        },
        lastName : {
            type : type.STRING,
            filed : 'lastName',
        },
        fullName : {
          type : type.STRING,
          get(){
              return `${this.firstName} ${this.lastName}`;
          },
         set(value){
             const name = value.split(' ')
             console.log(name)
             this.setDataValue('firstName',name[0])
             this.setDataValue('lastName',name[1])
             this.setDataValue('fullName',value)
          }
        },
        username : {
            type : type.STRING,
            filed : 'username',
            unique : true,
            allowNull : false,
            primaryKey : true
        },
        email : {
            type : type.STRING,
            field : 'email',
            allowNull: false,
            unique : true
        },
        password: enc_field.vault('password'),
        private_1 : enc_field.field('private_1'),
        private_2 : enc_field.field('private_2',{
            type : type.TEXT,
            validate: {
            isInt: true
          },
          defaultValue: null
        }),
        gender : {
            type : type.CHAR,
            field : 'gender',
            isIn : ['M','F']
        },
        hobbies : {
            type : type.ARRAY(type.STRING),
            field : 'hobbies'
        },
        intrests : {
            type : type.JSON,
            field : 'intrests'
        },
        dob : {
            type : type.DATE,
            field : 'dob',
            defaultValue: Sequelize.NOW
        }
    },{
        freezeTableName : true, //Model tableName will be the same as the model name
        //creating index on email and username
        indexes : [
            {
                unique : true,
                fields : ['email','username']
            }
        ]
    })
}
