module.exports = (conn,type)=>{
    return conn.define('Category',{
        categoryId : {
            type : type.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        categoryName : {
            type : type.STRING,
        }
    },{
        freezeTableName : true
    })
}