 console.log("popup.js");
 angular.module('ionicApp', ['ionic'])         
        .controller('MainCtrl', function($scope,$http) {
                    
                    $scope.settingsList = [
                                           { id:"1",name:"isAutoParam",text: "自动填入商品属性", checked: false },
                                           { id:"2",name:"isAutoBuy",text: "自动立即购买", checked: false },
                                           { id:"3",name:"isAutoOrder",text: "自动下单", checked: false },
                                           {id:"4",name:"isScanOrder",text:"自动获取订单信息",checked:false}
                                           ];
                    $scope.OrderList=[];
                    function initOrderList()
                    {
                    	
                    	chrome.extension.sendRequest({type:"orderList"},function(_orders)
                    	{
                    		 $scope.OrderList = _orders;
                    		 $scope.$digest();
                    	});
                    }
                   initOrderList();
                    var localconf = localStorage.getItem("confEnableAutoOrder");
                    if (localconf)
                    $scope.settingsList = JSON.parse(localconf);
                    
                    $scope.pushNotificationChange = function() {
                    console.log('Push Notification Change', $scope.pushNotification.checked);
                    };
                    $scope.settingChange = function(item)
                    {
                    	 
                    	localStorage.setItem("confEnableAutoOrder",JSON.stringify($scope.settingsList));
                    }
                   
                    
                    });
