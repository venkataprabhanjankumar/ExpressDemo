module.exports = (conn,type)=>{
    return conn.define('tags',{
        tagName : {
            type : type.STRING
        }
    })
}