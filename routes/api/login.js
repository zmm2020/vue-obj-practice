//引入模块
let express = require("express");
// 数据库模块,交给另一个模块去处理
let mongodb = require("../../utils/mongodb");
// 加密模块
let bcrypt = require("bcrypt");
// 创建路由
let router = express.Router();
// 进行响应操作,/代表/login
router.post("/",(req,res,next) => {
    // 响应home接口
    // 在登陆页面上,加密和解密
    // console.log("login");
    // 用非地址栏信息去传递用户名和密码，来使其更具有安全性
    // 将用户的密码加密保存在数据库内
    let {username,password} = req.body;
    // console.log(username,password);
    
    // 此时是用户名和密码都存在,在数据库中进行查找
    mongodb({
        // 查找的是user这个集合
        collectionName: 'users',
        // 成功时所执行的函数：同时需要传参
        success: ({ collection, client }) => {
            // 根据字段名来查，collection是链接的集合
          collection.find({
            username
          }, {
            //   如果查到就将这条信息转换为数组来进行操作
          }).toArray((err, result) => {
            // console.log(hresult)
            //  如果转换数组有误，进行下面的操作
            if (err) {
                // 数据库操作出错
              res.send({ err: 1, msg: 'users集合操作错误' });
            } else {
              // console.log(result);
                // 获取到这条信息
                //  如果存在长度，就证明找到了该用户名和密码(不一定完整)，为了防止获取到的数组为空数组
              if(result.length>0){
                //   给密码进行加密
                let bl = bcrypt.compareSync(password, result[0].password); // true|false
                if(bl){
                    // 密码存在...登录成功：不用传用户名和密码；而将其他的内容全传给用户
                //   删除获取到的数组中的用户名和密码
                  delete result[0].username
                  delete result[0].password
    
                  //种cookie,留session，将其他内容传给用户，找到了的话，只有一条数据
                  req.session['shop']=result[0]._id
    
                  res.send({ err: 0, msg: '登录成功', data: result[0]});
                }else{
                    // 密码不存在，防止用户猜对用户名
                  res.send({ err: 1, msg: '用户名不存在或者密码有误' });
                }
              }else{
                //   判断数组长度为0，里面没有东西，就证明不存在，就不能登录，返回信息给用户
                res.send({ err: 1, msg: '用户名不存在或者密码有误' });
              }
              
            }
            // 关闭数据库
            client.close();
          })
        }
      })

    // next();

});

// 暴露
module.exports = router;