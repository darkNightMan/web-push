const { getList, saveSub, updatekeys, findOne} = require('../controller/saveSub')
const webpush = require('web-push');
const colors = require('colors')
module.exports = function (app) {
  //------------------------------------------接口--------------------------------------------------------
  // 查看订阅列表
  app.get('/api/getSubList', (req, res) => {
      getList().then(_data => {
          res.json({status: 1, message: '成功', data: _data})
      })
  })

  // 保存订阅信息
  app.post('/api/saveSubscription',  (req, res) => {
    console.log(req.body)
    saveSub(req.body).then(_data => {
      res.json({status: 1, message: '保存成功', data: _data})
    })
  })
  

  // 生成公钥秘钥
  app.get('/api/getKeys',  (req, res) => {
    const vapidKeys = webpush.generateVAPIDKeys();
    res.json({status: 1, message: '成功', data: {
      publicKey: vapidKeys.publicKey, // 公钥
      privateKey: vapidKeys.privateKey // 私钥
    }})
  })


  // 推送消息 
  app.post('/api/pubScription', (req, res) => {
    const id = '1' // 假定当前一个用户
    const pubMessage = req.body.pubMessage
    webpush.setGCMAPIKey('AIzaSyCn6g_qCScsTaQsjprgSQJUR5GBQ0QFCvU');
    findOne(id).then(_data => {
      console.log(colors.yellow(_data[0]))
      webpush.setVapidDetails(
        'mailto:395604192@qq.com',
        _data[0].publicKey,
        _data[0].privateKey
      );
      // 数据库读出 订阅信息
      let pushSubscription = JSON.parse(_data[0].subInfo)

      console.log(pushSubscription) // log
    
        webpush.sendNotification(pushSubscription, pubMessage).then(data => {
            console.log(colors.green('push的数据', data)) 
            return;           
        }).catch(err => {
           // 判断状态码，440和410表示失效
            console.log(colors.red('err', err))
            if (err.statusCode === 410 || err.statusCode === 404) {
              // res.json({status: 1, message: '失败', data: {
              //   err: err.statusCode
              // }})
            }
        })        
      res.end()
    })
  })

  // -------------------------------------页面--------------------------------------------------
  // 首页
  app.get('/', (req, res) => {
    const vapidKeys = webpush.generateVAPIDKeys();    
    const privateKey = vapidKeys.privateKey  // 秘钥
    const publicKey = vapidKeys.publicKey  // 公钥
    // 更新公钥和秘钥
    updatekeys(privateKey, publicKey).then(() => {
      res.render('index',{ publicKey: vapidKeys.publicKey});
    })
  })
  // 客户端生成公钥和私钥
   app.get('/getKey', (req, res) => {
    res.render('getKey');
  })
   // 订阅列表
   app.get('/listSub', (req, res) => {
    res.render('listsub');
  })
  // 发布消息
  app.get('/listPub', (req, res) => {
    res.render('listpub');
  })
}