let express = require('express')
let router = express.Router()
let http = require('http');

router.get('/', (req, res, next) => {
  
  /* let {start,count} = req.query;
  start = start || 1;
  count = count || 5; */
  
  //http://v.juhe.cn/toutiao/index?type=&key=55f8053eba54dab5a301a00f45523164
  
//   后端的接口去响应拿去目标后端的数据
  let options={
    hostname:'v.juhe.cn',
    port:80,
    path:`/toutiao/index?type=&key=55f8053eba54dab5a301a00f45523164`,
    method:'GET'
  };

//   去目标接口获取数据
  // let reqHttp = https.request({配置},(resHttp)=>{
  let reqHttp = http.request(options, (resHttp) => {
    let str = '';
    resHttp.on('data', (chunk) => { str += chunk })
    resHttp.on('end', () => {
      // console.log(JSON.parse(str))
      res.send(JSON.parse(str))
    })

  })


  //reqHttp 请求对象
  reqHttp.on('error', (err) => { console.log(err) });	//监听请求失败信息
  reqHttp.end();//一定 主动请求结束


})

module.exports = router;