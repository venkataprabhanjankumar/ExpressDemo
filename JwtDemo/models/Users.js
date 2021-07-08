var crypto = require('crypto');
var algorithm = 'aes-256-cbc';

//In cryptography, an initialization vector (IV) or starting variable is an input to a cryptographic primitive being used to provide the initial state.
// The IV is typically required to be random or pseudorandom, but sometimes an IV only needs to be unpredictable or unique

//The use of an IV(initial vector) prevents repetition in data encryption, making it more difficult for a hacker using a dictionary attack to find patterns and break a cipher.
// For example, a sequence might appear twice or more within the body of a message.
var secret_key = crypto.randomBytes(32);
var initial_vector = crypto.randomBytes(16);

module.exports = (conn,type)=>{
    return conn.define('UsersTable',{
        userId : {
            type : type.INTEGER,
            autoIncrement : true,
            unique : true,
            field : 'userId',
        },
        username : {
            type : type.STRING,
            unique : true,
            field: 'username',
            allowNull : false,
            primaryKey : true
        },
        password : {
            type : type.STRING,
            field : 'password',
            set(value){
                let cipher = crypto.createCipheriv(algorithm,Buffer.from(secret_key),initial_vector)
                let encrypted = cipher.update(value)
                encrypted = Buffer.concat([encrypted,cipher.final()])
                this.setDataValue('password',encrypted.toString('hex'))
            },
            get(){
                let value = this.getDataValue('password');
                let encrypted_text = Buffer.from(value,'hex');
                let decipher = crypto.createDecipheriv(algorithm,Buffer.from(secret_key),initial_vector)
                let decrypted = decipher.update(encrypted_text)
                decrypted = Buffer.concat([decrypted,decipher.final()])
                return decrypted.toString();
            }
        },
        email : {
            type : type.STRING,
            unique : true,
            field : 'email'
        }
    },{
        freezeTableName : true,
        indexes : [
            {
                unique : true,
                fields : ['username','email']
            }
        ],
        timestamp : false
    })
}