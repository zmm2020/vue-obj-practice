//引入模块
let express = require("express");
// 创建路由
let router = express.Router();
let multer = require("multer");
let pathLib = require("path");
let fs = require("fs");
let mongodb = require("../../utils/mongodb");
let bcrypt = require("bcrypt");
// 进行响应操作,/代表/reg
router.post("/",(req,res,next) => {
    // 获取信息(注册需要获取全部的信息)
    let {username,password,nikename} = req.body;
    if(!username || !password){
        console.log({err:1,msg:"用户名和密码不能为空"});
        return;
    }

    let time = Date.now();
    // 万一用户没有传昵称，就需要默认的
    nikename = nikename || "nike_" + Math.random();
    let fans = 0;
    let follow = 0;
    let icon ="";

    // 密码不能明文保存，所以需要加密
    password = bcrypt.hashSync(password, 10); 

  //icon 借助multer  -》 icon 使用用户传递或者默认icon
  if (req.files && req.files.length > 0) {

    //改名 整合路径 存到 icon
    fs.renameSync(
      req.files[0].path,
      req.files[0].path + pathLib.parse(req.files[0].originalname).ext
    )
    icon = '/upload/user/' + req.files[0].filename + pathLib.parse(req.files[0].originalname).ext
  } else {
    icon = '/upload/noimage.png';
  }

  // console.log(username,password,icon);
  mongodb({
    collectionName: 'users',
    success:({collection,client})=>{
      collection.find({
        username
      },{
  
      }).toArray((err,result)=>{
        if(!err){
          // 没有错误并且有长度，就证明已经存在
          if(result.length>0){
            res.send({err:1,msg:'用户名已存在'});
            // fs.unlink('./public'+icon,(err)=>{})
            if(icon.indexOf('noimage') === -1){
                // 如果用户没有传递icon，那么默认的不能删除，注册没成功的删除头像
              fs.unlinkSync('./public'+icon);
            }
            
            client.close()
  
          }else{
            //通过   返回用户数据  插入库 返回插入后的数据
            collection.insertOne({
              username,password,nikename,follow,fans,time,icon
            },(err,result)=>{
              if(!err){
                // 告诉注册方注册成功
                // req.session[key]=result.insertedId
                delete result.ops[0].password;
                res.send({err:0,msg:'注册成功',data:result.ops[0]});
              }else{
                res.send({err:1,msg:'users集合操作失败'});
                client.close()
              }
            })
          }
        }else{
          res.send({err:1,msg:'users集合操作失败'});
          client.close()
        }
      })
    }
  })

});

// 暴露
module.exports = router;