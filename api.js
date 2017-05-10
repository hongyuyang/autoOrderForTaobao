
var http = require("http"); 
var URL = require('url');
var qs = require('querystring');
http.createServer(function(request, response) {
                  var path_name = URL.parse(request.url).pathname;
                  console.log(path_name);
                  if ("/orderlist" == path_name)
                  {
                        response.writeHead(200, {"Content-Type": "text/json; charset=utf-8"}); 
                        var orders = [
  {
    "bUrl": "https://item.taobao.com/item.htm?id=545043834112",
    "goodsCount": "1",
    "receiverInfo": "李先生,18908186392,,四川省 成都市 双流县 西航港街道黄河中路二段36号，圣菲TOWN城南一门,610200",
    "remark": "88888888888888",
    "skuInfo": [
      "1627207:1662122294",
      "122216343:917"
    ],
    "status": "卖家已发货,等待确认收货"
  },
  {
    "bUrl": "https://item.taobao.com/item.htm?id=545043834112",
    "goodsCount": "1",
    "receiverInfo": "李先生,18908186392,,四川省 成都市 双流县 西航港街道黄河中路二段36号，圣菲TOWN城南一门,610200",
    "remark": "",
    "skuInfo": [
      "1627207:1662122297",
      "122216343:3339140"
    ],
    "status": "等待买家付款"
  },
  {
    "bUrl": "https://item.taobao.com/item.htm?id=545043834112",
    "goodsCount": "2",
    "receiverInfo": "董超,13982291374,,四川省 成都市 锦江区 龙舟路街道摩码城小区,610011",
    "remark": "",
    "skuInfo": [
      "1627207:1662122299",
      "122216343:3339140"
    ],
    "status": "等待买家付款"
  },
  {
    "bUrl": "https://item.taobao.com/item.htm?id=545043834112",
    "goodsCount": "1",
    "receiverInfo": "陈生,18581852290,,四川省 成都市 双流县 西航港街道黄河中路二段38号-蓝光圣非城二期16栋,610200",
    "remark": "",
    "skuInfo": [
      "1627207:1662122297",
      "122216343:568"
    ],
    "status": "卖家已发货,等待确认收货"
  }
]
                        
                        response.write(JSON.stringify(orders));
                        response.end();
                  }
                  else if ("/" == path_name)
                  {
                        
                  
                  }
                  
                  else
                  {
                  response.writeHead(200, {"Content-Type": "text/html"});
                
                  response.end();
                 
                  
                  }
                  
                  
                  
}).listen(8888);
