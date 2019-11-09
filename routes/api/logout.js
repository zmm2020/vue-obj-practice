//引入模块
let express = require("express");
// 创建路由
let router = express.Router();
// 进行响应操作,/代表/logout
router.delete("/",(req,res,next) => {
    // 响应home接口
    // console.log("logout");

    // 注销账号其实就是在注销cookie
    req.session["shop"] = undefined;
    // 返回一条信息
    res.send({err:0,msg:"注销成功！！"});
    // next();
});

// 暴露
module.exports = router;