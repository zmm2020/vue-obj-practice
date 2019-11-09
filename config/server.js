// 模块导出，导出一个对象：用于以后在网上开启服务
// 因为端口不一致：不一定访问的就是3000这个端口，所以需要未雨绸缪
module.exports = {
    // 这是我们创建的端口：3000，本地端口
    local:{
        // true代表这个端口开启，false则不开
        open:false,
        port:3000
    },
    http:{
        open:false,
        port:3001
    },
    // 网上有HTTP协议以及https协议
    http:{
        open:true,
        port:80
    },
    https:{
        open:false,
        port:443
    }
}