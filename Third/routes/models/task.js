module.exports = (conn,type)=>{
    return conn.define('Tasks',{
        taskId : {
            type : type.INTEGER,
            autoIncrement : true,
            unique : true,
            primaryKey : true
        },
        taskName : {
            type : type.STRING
        }
    },{
        freezeTableName : true
    })
}