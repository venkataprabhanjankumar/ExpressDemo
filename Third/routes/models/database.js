var Sequelize = require('sequelize');
var Users = require('./users');
var Categories = require('./category');
var Tasks = require('./task');
var Tag = require('./tags')


//name,user,password
conn = new Sequelize.Sequelize('postgres', 'postgres', 'prabhanjan7241', {
    host: 'localhost',
    dialect: 'postgres',//postgres|mysql|marinadb
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

const User = Users(conn,Sequelize);
const Category = Categories(conn,Sequelize);
const Task = Tasks(conn,Sequelize);
const Tags = Tag(conn,Sequelize)

Category.belongsTo(User,{through : User});
Task.belongsTo(Category,{through : Category.categoryName});
Task.belongsTo(User,{through : User});
conn.sync({force : false}).then(
    ()=>{
        console.log("Tables Created")
    }
)

module.exports = {
    User,
    Category,
    Task,
    Tags
}


// Or you can simply use a connection uri
//var sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');


//Models are defined with sequelize.define('name', {attributes}, {options}).









