const { exec } = require ('../db/mysql.js')

// 获取订阅列表
const getList = (req, res) => {
  // sql
  let sql = `select * from pushList;`
  return exec(sql)
}

// 保存订阅信息
const saveSub = (PushSubscription) => {
  let sql = `update pushList set subInfo='${JSON.stringify(PushSubscription)}' where id = 1`
  console.log('sql', sql)
  return exec(sql)
}

// 更新秘钥
const updatekeys = (privateKey, publickey) =>{
  // let sql = `update pushList set privateKey='${privateKey}', publickey='${publickey}'  where id = 1`
  let sql = `update pushList set  publickey='${publickey}', privateKey='${privateKey}'  where id = 1`
  console.log('sql', sql)
  return exec(sql)
}

// 查询一条数据
const findOne = (id)=> {
  let sql = `select subInfo, privateKey, publicKey from pushList where id = ${id};`
  console.log(sql)
  return exec(sql)
}

module.exports = {
  getList,
  saveSub,
  updatekeys,
  findOne
}