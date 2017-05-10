console.log("background.js");
var configAutoOrder = {
	taobao:{
			buy:
				{
					fixed:"css",name:"J_LinkBuy",index:0
				},
			order:
				{
					fixed:"css",name:"go-btn",index:0
				}
		
			},
	tianmao:{
			buy:
				{
					fixed:"id",name:"J_LinkBuy"
				},
			order:
				{
					fixed:"css",name:"go-btn",index:0
				}
				
			},
	urlfeature:{
			buy:{
					taobao:"item.taobao.com/item.htm",tianmao:"detail.tmall.com/item.htm"
				},
			order:{
					taobao:"buy.taobao.com/auction",tianmao:"buy.taobao.com/auction"
				},
				orderlist:{
					url:"buyertrade.taobao.com/trade/itemlist/list_bought_items.htm"
				},
				wuliu:{
					url:"detail.i56.taobao.com",
					url2:"wuliu.taobao.com"
				},
				trade:{
					url:"trade.taobao.com/trade/detail/trade_order_detail.htm"
				}
			},
	receiverAddress:{
		url:"member1.taobao.com/member/fresh/deliver_address.htm"
	}

			
}
var myDB;
function initDB()
{
	htmlDB.openDB('db',6,function(db){
	myDB = db;
	q.d("初始化数据库",db);
	service();
	});
}
initDB();

localStorage.setItem("confAutoOrder",JSON.stringify(configAutoOrder));
function service()
{
	
}

chrome.extension.onRequest.addListener(
		
	function(request, sender, sendResponse) {
		if (request.type == "config")
		{
			var config = new Object();
			config.confEnableAutoOrder = JSON.parse(localStorage.getItem("confEnableAutoOrder"));
			config.confAutoOrder = JSON.parse(localStorage.getItem("confAutoOrder"));
			if (!config.confAutoOrder)
			{
				config.confAutoOrder = configAutoOrder;
			}
			sendResponse(config);
			return;
		}
		else if (request.type == "orderList")
		{
			
			htmlDB.fetchStoreByCursor(myDB,'order',function(orders)
			{
				sendResponse(orders);
			})
		}
		else if (request.type == "wuliu")
		{
			mOrder = request.order;
			// wuliuInfos = [];

			htmlDB.getDataByIndex(myDB,'order','SIdIndex',mOrder.SId,function(order){
				if (order && order.mailNo)
				{
					sendResponse(order);
					return;
				}
				else
				{
					chrome.tabs.create({url:mOrder.mailUrl,selected:false,pinned:false},function(tab){
						setTimeout(function(){
							chrome.tabs.remove(tab.id);
						},10000);
						sendResponse(null);
					});
				}
			});
		}
		else if (request.type == "writeStorage")
		{
			localStorage[request.key] = request.value;
		}
		else if (request.type == "readStorage")
		{
			if (!localStorage[request.key])
			{
				sendResponse(new Array());
			}
			else
			{
				sendResponse(JSON.parse(localStorage[request.key]));
			}
			
		}
		else if (request.type == "orderManager")
		{
			console.log("orderManager");
			var order = request.data;
			
			htmlDB.getDataByIndex(myDB,'order','SIdIndex',order.SId,function(result){
				console.log(result);
			});
		}
		else if (request.type == "wuliuSave")
		{
			var order = request.data;
			htmlDB.getDataByIndex(myDB,'order','SIdIndex',mOrder.SId,function(_order){
				if (_order)
				{
					htmlDB.updateDataByIndex(myDB,'order','SIdIndex',mOrder.SId,function(__order)
					{
						return order;
					});
					return;
				}
				else
				{
					htmlDB.addObj(myDB,'order',order);
				}
			});
		}
		else if (request.type == "saveToDB")
		{
			if (request.storeName)
			{
				htmlDB.clearObjectStore(myDB,request.storeName);
				for(i in request.data)
				{
					var order = request.data[i];
					htmlDB.addObj(myDB,request.storeName,order);
					
				}
			}
		}
		else if (request.type == "saveOrder")
		{
			var orderIds = request.data;
			if (isDetailOrderUpdating)
			{
				return;
			}
			isDetailOrderUpdating = true;
			orderInfos = [];
			orderTotal = orderIds.length;
			openTabs(orderIds,function(currentIndex,total){
				
			})
		}
		else if (request.type == "detailOrder")
		{
			if (isDetailOrderUpdating)
			{
				orderInfos.push(request.data);
			}
			if (orderTotal == orderInfos.length)
			{
				ordersTask(orderInfos);
			}
		}
		else if (request.type == "currentTask")
		{
			if(autoOrders[currentAutoOrderProgress])
			sendResponse(autoOrders[currentAutoOrderProgress]);
		}
    }
);
var orderTotal = -1;
var isDetailOrderUpdating = false;
var orderInfos = [];
function openTabs(orderIds,progress)
{
	
	for (var i = 0;i<orderIds.length;i++)
	{
		(function(idx)
			{
				setTimeout(function(){
				chrome.tabs.create({url:taobaoAPI.detailOrder.getUrlByOrderId(orderIds[idx]),selected:false,pinned:false},function(tab){
					setTimeout(function(){
						chrome.tabs.remove(tab.id);
					},10000);
					
				});
				
				progress(idx+1,orderIds.length);
			},1000*i);
		})(i);
		
		
	}
}
function ordersTask(orderInfos)
{
	$.ajax({
		type: 'POST',
		url: "http://127.0.0.1:8888/orderlist?r="+Date.parse(new Date()),
		data:{SOrderList:JSON.stringify(orderInfos),security:"我是小号1"},
		
		success:function(orders)
		{
			console.log(orders);
			// autoOrders = orders;
			// if (autoOrders && autoOrders.length>0)
			// autoOrder(0);
		},
		dataType:"json"
	})
}
var autoOrders = [];
var currentAutoOrderProgress = 0;
function autoOrder(index)
{
	currentAutoOrderProgress = index;
	chrome.tabs.create({url:autoOrders[index].bUrl,selected:false,pinned:false},function(tab){
		// setTimeout(function(){
			// chrome.tabs.remove(tab.id);
		// },30000);
		
	});
	
		
		
		
	
}

