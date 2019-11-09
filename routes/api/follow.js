//引入模块
let express = require("express");
// 创建路由
let router = express.Router();
// 引入MongoDB进行查询
let mongodb = require("../../utils/mongodb");
// 进行响应操作,/代表/home
router.get("/",(req,res,next) => {
    // 响应home接口
    // console.log("home",req.query._sort,req.query.q,req.query._limit,req.query._page);
    // next();
    
    // 可能在这里也能访问到详情，需要判断
    // 先要获取地址栏里的id
    let _id = req.query._id;
    if(_id){
        // 调用函数，进行传参
        getDetail(req,res,next,_id);
    }else{
        // 获取信息
        let {_page,_limit,q,_sort} = req.query;
        // 有可能会根据q来查询des的内容
        q = q ? {des:eval("/" + q + "/")} : {}
        

        // 使用mongodb进行查询操作
        mongodb({
            collectionName:"follow",
            success:({collection,client}) => {
                // console.log("cnsnd");
                // 集合查询
                collection.find(q
                    // 查询条件：无
                ,{
                    // 配置条件
                    limit:_limit,
                    skip:_page * _limit,
                    sort:{[_sort]:-1}
                }).toArray((err,result) => {
                    // 测试
                    // console.log("err",err);
                    // console.log("result",result);
                    // client.close();
                    if(err){
                        res.send("集合follow出现错误");
                    }else{
                        res.send({err:0,data:result});
                    }
                });
                client.close();
            }
        });

    }
    // 拿到携带的参数：不一定(可能是端口，也可能是动态接口，更有可能是携带信息在地址栏中)
    // 兜库
    // 返回值   浏览器
});

// 动态接口
router.get("/:id",(req,res,next) => {
    // 响应home接口
    // console.log("home",req.query._sort,req.query.q,req.query._limit,req.query._page);
    // next();
    console.log("详情");
    // 调用函数，进行传参
    getDetail(req,res,next,req.params.id);
    // 拿到携带的参数：不一定(可能是端口，也可能是动态接口，更有可能是携带信息在地址栏中)
    // 兜库
    // 返回值   浏览器
});

// 给详情定义一个函数，用于上面调用使用
let getDetail = (req,res,next,_id) => {
    mongodb({
        collectionName:"follow",
        success:({collection,client,ObjectID}) => {
            // console.log("cnsnd");
            // 集合查询
            collection.find({
               _id :ObjectID(_id)
            }
            ,{
            }).toArray((err,result) => {
                // 测试
                // console.log("err",err);
                // console.log("result",result);
                // client.close();
                if(err){
                    res.send("集合follow出现错误");
                }else{
                    if(result.length > 0){
                        res.send({err:0,data:result});
                    }else{
                        res.send("错误的id或者不存在");
                    }
                    
                }
            });
        }
    });
}

// 暴露
module.exports = router;