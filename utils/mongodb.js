// 引入模块
let mongodb = require('mongodb');
// 创建客户端
let mongoCt = mongodb.MongoClient;
// 导入mongodb中的ObjectID方法
let ObjectID = mongodb.ObjectID;

// 暴露一个函数,可以修改连接的地址以及库名和集合等
// 用于不管是谁调用该函数,都可以传入一个配置 
module.exports = ({ url, dbName, collectionName, success, error }) => {
    // 传了参数就用那个,否则就用默认值(写活)
    url = url || 'mongodb://127.0.0.1:27017';
    dbName = dbName || 'shop'; 
    // 创建连接
    mongoCt.connect(url,{useUnifiedTopology:true}, (err, client) => {
        if (err) {
            // 还有一种情况:就是不传error和success得函数,就不能调用该方法
            error && error('库链接错误');
        } else {
            // console.log('err',client);//client==创建好的链接名
            let db = client.db(dbName);//链库
            let collection = db.collection(collectionName);//链接集合

            // 由于数据库虽然创建链接成功了,但是得交给调用方,看是否关闭数据库
            // 将ObjectID传过去，防止后面要对_id进行转换
            success && success({collection,client,ObjectID});


        }
    });
}


