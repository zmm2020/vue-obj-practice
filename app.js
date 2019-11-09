// 引入所需模块
var createError = require('http-errors');
var express = require('express');
// 使用path模块进行路径拼接
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require("multer");
var cookieSession = require("cookie-session");

// 引入模块
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

//创建服务器，用于在www主接口下进行监听
var app = express();

// 中间件配置
// 配置ejs,自带的ejs模块
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// 配置multer
// 配置
// 		let multer  = require('multer');	引入
// 		let objMulter = multer({ dest: './upload' });	实例化  返回 multer对象
// 			dest: 指定 保存位置（存到服务器)
// 		app.use(objMulter.any());  	any 允许上传任何文件  text/image
// let multerObj = multer({dest:"/"})

// 这样配置,就会将所获得的图片全部保存在upload的根目录下,不好
// let objMulter = multer({dest:"./public/upload"});

// 将所获取到的图片信息以及其他的文件信息可以按照需求来保存在不同的文件夹下
var storage = multer.diskStorage({
  destination:function(req,file,cb){
    // 通过判断地址栏或非地址栏信息来分辨文件夹
    // 用户或者注册的
    if(req.url.indexOf('user')!==-1 || req.url.indexOf('reg') !== -1){
      // console.log(1);
      cb(null,path.join(__dirname,'public','upload','user'));
    }else if(req.url.indexOf('banner')!==-1){
      cb(null,path.join(__dirname,'public','upload','banner'));
    }else{
      cb(null,path.join(__dirname,'public','upload','product'));
    }
  }
});
let multerObj = multer({storage});


app.use(multerObj.any());

// 设置复杂的cookie
let arr = [];
for(let i = 0;i < 1000;i++){
  arr.push("shop_"+ Math.random()*20 +3);
}
// 配置cookie在服务端
app.use(cookieSession({
  name:"shop",
  // 必须的键keys:还得是一个数组
  keys:arr,
  // 最大的保存时间:15天
  maxAge:1000*60*60*24*15
}))


app.use(logger('dev'));
// 以下两行代码是安装body-parser的步骤，自带body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 静态资源托管的配置
// 设置两片天,一步一步去找;在第一片天中没有找到,就到第二片天去找
// 用于在css文件以及html文件中去找这两片天下的文件
// 设置静态目录,找public下的template下的静态文件,拼接路径
app.use(express.static(path.join(__dirname,"public","template")));
app.use('/admin',express.static(path.join(__dirname,"public","admin")));
// 静态目录,直接找public下的静态目录,不一定会找到,则还需要添加静态目录
app.use(express.static(path.join(__dirname, 'public')));

// 在响应两个相同名字的css样式的时候,此时就需要用到别名


// 接口响应
// 先引入
let mongodb = require("./utils/mongodb");

// 对一下每一个模块都进行一个总的操作,在进行分操作;用于操作页面,来响应第几页数据以及多少条数据等信息
app.all("/api/*",require("./routes/api/globalParams"));

// 引入路由,交给相应的路由进行操作
app.use("/api/home/",require("./routes/api/home"));
app.use("/api/login",require("./routes/api/login"));
app.use("/api/user",require("./routes/api/user"));
app.use("/api/column",require("./routes/api/column"));
app.use("/api/follow",require("./routes/api/follow"));
app.use("/api/logout",require("./routes/api/logout"));
app.use("/api/banner",require("./routes/api/banner"));
app.use("/api/reg",require("./routes/api/reg"));

app.use("/proxy/juhe",require("./routes/proxy/juhe"));


// 这里仅限于测试,不管是用户端还是管理端都是要交给路由的
// 用户端
// 进行测试:看能不能获取到用户的头像
// app.get('/api/user',(req,res,next) => {
//   // console.log(1)
//   // console.log('req.body',req.body);
//   // console.log("req.query",req.query);
//   // console.log("req.files",req.files);
//   // console.log("req.session",req.session);
//   // 响应用户端接口时,需要到数据库中查询所需字段
//   // 调用mongodb做连接操作
//    mgdb({
//      dbName:'user',
//     //  有默认的地址以及数据库
//     collectionName:"user",
//     //响应成功就调用success函数
//     success:({collection,client}) => {
//       // 如果成功,就进行一系列的操作:得到了数据
//       collection.find({name:'a'},{limit:2,skip:0,projection:{_id:0}}).toArray((err,arr) => {
//         // 将获取到的内容转换为数组,并且输出
//         console.log("arr",arr);
//       });
//       // 选择关闭数据库
//       client.close();
//     },

//     // 如果失败,那么就调用失败得函数
//     error:(err) => {
//       // 打印输出错误
//       console.log("err",err);
//     }

//    })
//   res.end();
// });


// 管理端
// 响应一个端口
// app.get('/admin/home',(req,res,next) => {
//   // express生成器 配有body-parser 和 ejs
//   // ejs使用 res.render(ejs文件,{数据}) ~~  ejs.renderFile(地址/ejs文件,{数据},(data) => {res.end(data)})
//   res.render('index',{title:'你汇总'});//大后端渲染
// });

app.use("/admin/banner",require("./routes/admin/banner"));

// 后端页面
app.use("/admin",(req,res,next) => {
  //后端 渲染页面(index页面)
  res.render('index',{title:'后端的管理页面'});
});



// 响应模块
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  // 需要进行判断:接口判断
  if(req.url.indexOf('/api') !== -1){
    // 如果出现api接口,那么就是用户端,否则就是服务端
    res.send({err:1,data:"错误的接口或请求方式"});
  }else{
    res.render('error');
  }
});
// 导出
module.exports = app;
