
var configAutoOrder;
var pageInfo = new Object();
setTimeout(()=>{
	chrome.extension.sendRequest({type:"config"}, function(config){
	var enableList = config.confEnableAutoOrder;
	configAutoOrder = config.confAutoOrder;
	
	if (configAutoOrder)
	{
		q.d("成功加载配置")
	}
	if (isIgnoreCurrentPage())
	{
		q.d("忽略当前页面处理");
		return;
	}
	wuliu();
	trade();
	receiverAddress();
	if (enableList)
	{
		for (conf in enableList)
		{
			if ("isAutoParam" === enableList[conf].name)
			{
				if (enableList[conf].checked)
				{
					autoParam();
				}
			}
			else if ("isAutoBuy" === enableList[conf].name)
			{
				if (enableList[conf].checked)
				{
					autoBuy();
				}
			}
			else if ("isAutoOrder" === enableList[conf].name)
			{
				if (enableList[conf].checked)
				{
					autoOrder();
				}
			}
			else if("isScanOrder" == enableList[conf].name)
			{
				if (enableList[conf].checked)
				{
					autoScanOrder();
				}
			}
		}
	}
	


});
},5000);

function isIgnoreCurrentPage()
{
	pageInfo.url = window.location.href;
	pageInfo.feature = "ignore";
	if (pageInfo.url.indexOf(configAutoOrder.urlfeature.buy.taobao)>0)
	{
		pageInfo.feature = "taobao";
	}
	else if (pageInfo.url.indexOf(configAutoOrder.urlfeature.buy.tianmao)>0)
	{
		pageInfo.feature = "tianmao"
	}
	else if (pageInfo.url.indexOf(configAutoOrder.urlfeature.order.taobao)>0)
	{
 		pageInfo.feature = "taobaoorder"
	}
	else if (pageInfo.url.indexOf(configAutoOrder.urlfeature.order.tianmao)>0)
	{
		pageInfo.feature = "tianmaoorder"
	}
	else if (pageInfo.url.indexOf(configAutoOrder.urlfeature.orderlist.url)>0)
	{
		pageInfo.feature="orderlist";
	}
	else if (pageInfo.url.indexOf(configAutoOrder.urlfeature.wuliu.url)>0 || pageInfo.url.indexOf(configAutoOrder.urlfeature.wuliu.url2)>0)
	{
		
		pageInfo.feature="wuliu";
	}
	else if (pageInfo.url.indexOf(configAutoOrder.urlfeature.trade.url)>0)
	{
		pageInfo.feature = "taobaotrade";
	}
	else if (pageInfo.url.indexOf(configAutoOrder.receiverAddress.url) > 0)
	{
		pageInfo.feature = "receiverAddress";
	
		
	}
		q.d("页面特征状态："+pageInfo.feature);

	if (pageInfo.feature == "ignore")
		return true;
	return false;
}
function autoBuy()
{
	
	console.log("autoBuy");
	
}
function autoParam()
{
	setTimeout(()=>{
		chrome.extension.sendRequest({type:"currentTask"},function(order)
		{
			q.d(order);
			for(i in order.skuInfo)
			{
				extUtils.simulateClick.autoClickByDom(extUtils.simulateClick.getElementByAttrs('li','data-value',order.skuInfo[i],0));
			}
			setTimeout(()=>{
			console.log("自动购买");
			if (pageInfo.feature == "tianmao")
			{
				autoClick(configAutoOrder.tianmao.buy);
			}
			else if(pageInfo.feature == "taobao")
			{
				autoClick(configAutoOrder.taobao.buy);
			}
				
			},1000);
			
		});
	},5000);
	console.log("autoParam autoBuy");
}
function autoOrder()
{
	console.log("autoOrder");
	
	// setTimeout(()=>{
	// 	chrome.extension.sendRequest({type:"currentTask"},function(order)
	// 	{
			order={
				buyMessage:"第一次备注测试"
			}
			q.d(order);
			document.getElementsByClassName("text-area-input memo-input")[0].value = order.buyMessage;
			extUtils.simulateHtmlEvents.trigger("text-area-input memo-input","blur");
			setTimeout(()=>{
			console.log("自动下单");
			if (pageInfo.feature == "tianmaoorder")
			{
				autoClick(configAutoOrder.tianmao.order);
			}
			else if(pageInfo.feature == "taobaoorder")
			{
				autoClick(configAutoOrder.tianmao.order);
			}
				
			},1000);
			
		// });
	// },5000);
}
function autoClick(proxy)
{
			if (proxy.fixed == "css")
			{
				extUtils.simulateClick.autoClickByCss(proxy.name,proxy.index);
			}
			else
			{
				extUtils.simulateClick.autoClickById(proxy.name);
			}
}
function dataFinish()
{
	//获取小号的订单列表后通过后台获取小号的订单详情列表
	chrome.extension.sendRequest({type:"saveOrder",data:orderIds},function(){});
	dataStatus = 2;
}
var dataStatus = 2;
var orderIds = [];
function autoScanOrder()
{
	if (pageInfo.feature != "orderlist") return;
	dataStatus = 2;//两个ajax请求响应计数次数
	orderIds = [];
	$.ajax({
		  type: 'POST',
		  url: taobaoAPI.order.getUrlByPage(1),
		  data: taobaoAPI.order.getNotPaidData(),
		  success: function(list){
		  	q.d("扫描待付款订单列表",list);
		  	mainOrders = list.mainOrders;
		  	
		  	for(index in mainOrders)
		  	{
		  		orderIds.push(mainOrders[index].id);
		  	}
		  	dataStatus--;
		  	if (dataStatus == 0)
		  	{
		  		dataFinish();
		  	}
		  	
		  },
		  dataType: "json"
		});
	$.ajax({
		  type: 'POST',
		  url: taobaoAPI.order.getUrlByPage(1),
		  data: taobaoAPI.order.getSendData(),
		  success: function(list){
		  	q.d("扫描已发货订单列表",list);
		  	mainOrders = list.mainOrders;
		  	
		  	for(index in mainOrders)
		  	{
		  		orderIds.push(mainOrders[index].id);
		  	}
		  	dataStatus--;
		  	if (dataStatus == 0)
		  	{
		  		dataFinish();
		  	}
		  },
		  dataType: "json"
		});
	
}
function wuliu(){
	if(pageInfo.feature != "wuliu") return;
		order = {};
		order["SId"] = extUtils.http.getQueryString("tId");
		order["mailNo"] = extUtils.chrome.varBridge("mailNo");
		order["cpName"] = extUtils.chrome.varBridge("cpName");
		chrome.extension.sendRequest({type:"wuliuSave",data:order},function(){});
		q.d("保存物流信息",order);
		
	
}
function trade()
{
	if (pageInfo.feature != "taobaotrade") return ;
	var data = extUtils.chrome.varBridge("data");
	var orderInfo = {};
	orderInfo.SOrderId = data.mainOrder.id;
	orderInfo.orderStatus = data.orderBar.currentIndex;
	if (data.buyMessage)
	{
		 orderInfo.buyMessage = data.buyMessage;
		 if (orderInfo.orderStatus == 3)
		{
				orderInfo.logisticsName = data.deliveryInfo.logisticsName;
				orderInfo.logisticsNum = data.deliveryInfo.logisticsNum;
		}

	}
	
	chrome.extension.sendRequest({type:"detailOrder",data:orderInfo},function(){});

}

function receiverAddress()
{
	if (pageInfo.feature != "receiverAddress") return;
	receiver = {
		address:{
			province:"安徽",
			city:"合肥",
			district:"蜀山",
			street:"",
			streetDetail:"南七街道合作化南路7号 ABB(中国)有限公司合肥分公司"
		},
		postcode:"000000",
		fullName:"李生",
		mobile:"18908186392"
	}
	//填充收货人地址
	q.clickDom(extUtils.simulateClick.getElementByAttrs('a','title',receiver.address.province,0));
	q.clickDom(extUtils.simulateClick.getElementByAttrs('a','title',receiver.address.city,0));
	q.clickDom(extUtils.simulateClick.getElementByAttrs('a','title',receiver.address.district,0));
	document.getElementById("J_Street").value = receiver.address.streetDetail;
	document.getElementById("J_PostCode").value = receiver.postcode;
	document.getElementById("J_Name").value = receiver.fullName;
	document.getElementById("J_Mobile").value = receiver.mobile;
	q.clickDom(document.getElementById("J_SetDefault"));
	
	l1 = document.getElementsByName("prov")[0].value;
	l2 = document.getElementsByName("city")[0].value;
	l3 = document.getElementsByName("area")[0].value;

	$.ajax({
	  type: 'GET',
	  url: taobaoAPI.address.outputAddressTownArray,
	  data: {
	  	"l1":l1,"l2":l2,"l3":l3,"lang":"zh-S","callback":"town_address_callback"
	  },
	 success: function(result){
	  	 eval(result);
	  },
	  dataType: "text"
	});

}

function town_address_callback(result)
{
	if(result.success)
	{
		 towns = result.result;
		 var street = "";
		 var streetDetail = receiver.address.streetDetail;
		 for (i in towns)
		 {
		 	if(streetDetail.indexOf(towns[i][1])==0)
		 	{
		 		 street+= towns[i][1];
		 		 
		 	}
		 }
		 var dom = extUtils.simulateClick.getElementByAttrs('a','title',street,0);
		 if(dom)
		 {
		 	q.clickDom(dom);
		 	streetDetail = streetDetail.substring(street.length,streetDetail.length);
		 	document.getElementById("J_Street").value = streetDetail;
		 }
		 
		
		
	}
}














