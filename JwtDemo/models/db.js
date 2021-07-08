var Sequelize = require('sequelize')
var Users = require('./Users');
var UserRoles = require('./UserRoles');


var conn = new Sequelize.Sequelize('postgres','postgres','prabhanjan7241',{
    dialect : 'postgres',
    host : 'localhost',
    pool : {
        max : 5,
        min : 0,
        idle : 1000
    }
});

conn.authenticate().then(
    ()=>{
        console.log("Connected")
    }
).catch(
    err =>{
        console.log(err);
    }
);

const User = Users(conn,Sequelize);
const UserRole = UserRoles(conn,Sequelize);

function initial(){
    UserRole.create({
        roleId : 1,
        roleName : 'admin'
    });
    UserRole.create({
        roleId : 2,
        roleName : 'user'
    });
}

User.belongsToMany(UserRole,{
    through : 'User_Role',
    foreignKey : 'username',
    otherKey : 'roleId'
});

UserRole.belongsToMany(User,{
    through : 'User_Role',
    foreignKey : 'roleId'
})

conn.sync({force : true}).then(
    ()=>{
        console.log("Db Created")
        initial();
    }
);


module.exports = {
    User,
    UserRole,
}

