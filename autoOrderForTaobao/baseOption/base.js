var URL;
var config;

function getConfigOnService(configBack){
	chrome.extension.sendRequest({type:"getBackgroundValue",key:"URL"}, function(response) {
		URL=response;
		chrome.extension.sendRequest({type:"getConfig"}, function(response) {
			if(response.error == "error"){
				setTimeout("getConfigOnService",500);
			}else{
				config=response;
				if(configBack!=null){
					configBack();
				}
				
			}
		});
	});
}

function judgeVersion(){
	var newVer = config.newVersion;
	if(newVer == null){
		console.log("没有读到版本号");
	}
	chrome.extension.sendRequest({type:"getBackgroundValue",key:"version"}, function(response){
		var rVer = response;
		if(newVer!=null && newVer.indexOf(".")>0 && rVer!=null && rVer.indexOf(".")>0 && newVer>rVer){
			var r=confirm("请下载插件最新版本!");
			if (r==true){
				
				var url = "http://www.1tsoft.com/SmartServiceHelper/download/AutoPurchase-Service.crx";
				if(userConfig!=null && userConfig.copyUrl!=null){
					url = userConfig.copyUrl;
					url = url.replace("TradeService/","SmartServiceHelper/download/AutoPurchase-Service.crx");
				}
			    window.open(url);
			}
		}	
	});
}

function insertElement(tagName,parentNode,className,id){
	var retElement = document.createElement(tagName);
	retElement.className=className;
	retElement.id=id;
	parentNode.appendChild(retElement);
	return retElement;
}

function insertBr(p){
	var b=document.createElement("br");
	p.appendChild(b);
}
function getItemIdFromAliurl(aliUrl){
	if(aliUrl==null || aliUrl.length==0){
		return "";
	}
	
	var aliUrlHead = "http://detail.1688.com/offer/";
	var pos = aliUrl.indexOf(aliUrlHead);
	if(pos ==-1){
		aliUrlHead = "https://detail.1688.com/offer/";
		var pos = aliUrl.indexOf(aliUrlHead);
	}
	
	if(pos !=-1){
		aliUrl = aliUrl.replace(aliUrlHead,"");
	}else{
		return "";
	}
	pos = aliUrl.indexOf(".htm");
	if(pos!=-1){
		aliUrl = aliUrl.substring(0,pos);
		return aliUrl;
	}else{
		return "";
	}
}

function getItemIdFromTaobaourl(taobUrl){
	if(taobUrl==null || taobUrl.length==0){
		return "";
	}
	var para = taobUrl.substring(taobUrl.indexOf("?")+1);
	if(para.indexOf("#")!=-1){
		para = taobUrl.substring(0,taobUrl.indexOf("#"));
	}
	
	
	var paras = para.split("&");
	for(var i=0;i<paras.length;i++){
		if(paras[i].indexOf("id=")==0){
			var v = paras[i].split("=")[1];
			return v;
		}
	}
	return "";
}

var lockObject = {
	array:{},
	get:function(s){
		var t=this.array[s];
		if(t==null){
			this.array[s]={current:0,hold:0};
			t=0;
		}else{
			t=++this.array[s].current;
		}
		return t;
	},
	check: function(t,s){
		
		var h=this.array[s].hold;
		if(h!=null && t==h){
			return true;
		}else{
			return false;
		}
	},
	release: function (t,s){
		var h=this.array[s].hold;
		if(h!=null && t== h){
			this.array[s].hold++;
			return true;
		}else{
			return false;
		}
	}
};

function getUrlPara(url){
	if(url==null || url.length==0){
		return {};
	}
	var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");  
	var paraObj = {};
	for (var i=0;i<paraString.length; i++){  
		var j=paraString[i];
		paraObj[j.substring(0,j.indexOf("="))] = j.substring(j.indexOf("=")+1,j.length);  
	}
	return paraObj;
}



function JsonParamsToUrl(data){
  var arr = "";
  for(var i in data){
	arr+="&"+(i + "=" + data[i]);
  }
  return arr.replace(/&/,"?");
}














