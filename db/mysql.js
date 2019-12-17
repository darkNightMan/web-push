
const mysql = require('mysql')
const mysqlConf = require('../conf/db')

// 创建连接对象
const con = mysql.createConnection(mysqlConf)

// 开始连接
con.connect()

// 统一执行sql 函授
function exec (sql) {
  const promise = new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        reject(err)
        return
      }    
      resolve(result)
    })  
  })
  return promise
}

module.exports = {
  exec
}
