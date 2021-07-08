module.exports = (conn,type)=>{
    return conn.define('UserRoles',{
        roleId : {
            type : type.INTEGER,
            field : 'roleId',
            unique : true,
            primaryKey : true
        },
        roleName : {
            type : type.STRING,
            filed : 'roleName'
        }
    },{
        freezeTableName : true
    })
}
