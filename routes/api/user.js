//引入模块
let express = require("express");
// 创建路由
let router = express.Router();
// 引入MongoDB
let mongodb = require("../../utils/mongodb");
// 进行响应操作,/代表/user
router.get("/",(req,res,next) => {
    // 用户登录
    // 在用户页面上，如果能够获取到cookie，那么就让该用户跳转到登录页面；先要获取cookie
    // 判断是否取得到cookie,如果获取到cookie，那么就用_id来查
    // cookie就是用_id来赋值的
    if(req.session["shop"]){
        mongodb({
            // 查找的是user这个集合
            collectionName: 'users',
            // 成功时所执行的函数：同时需要传参
            success: ({ collection, client ,ObjectID}) => {
                // 根据用户名和密码，collection是链接的集合
              collection.find({
                //   在数据库中保存的_id是通过对象转换的
                _id:ObjectID(req.session["shop"])
              }, {
                //   如果查到就将这条信息转换为数组来进行操作
              }).toArray((err, result) => {
                //  如果转换数组有误，进行下面的操作
                if (err) {
                    // 数据库操作出错
                  res.send({ err: 1, msg: 'home集合操作错误' });
                } else {
                    // 获取到这条信息
                    //  如果存在长度，就证明找到了该用户名和密码(不一定完整)，为了防止获取到的数组为空数组
                  if(result.length>0){
                    //   删除获取到的数组中的用户名和密码
                      delete result[0].username;
                      delete result[0].password;
                    //   成功返回数据
                      res.send({ err: 0, msg: '登录成功', data: result[0]});
                  }else{
                    //   判断数组长度为0，里面没有东西，就证明不存在，就不能登录，返回信息给用户
                    res.send({ err: 1, msg: '用户名不存在或者密码有误' });
                  }
                  
                }
                // 关闭数据库
                client.close();
              });
            }
          });
    }else{
        res.send({err:1,data:"未登录过"});
    }
    // next();
});

// 暴露
module.exports = router;