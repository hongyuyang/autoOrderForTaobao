var present;
var userConfig;
function authorize(nick,rsp){
	chrome.extension.sendRequest({type:"getCookies",cUrl:config.copyUrl+"copy/hello",name:["nick","timeString","randomString"]}, function(cookie){
		callBackCookies(cookie,rsp);
	});
}

function callBackCookies(request,rsp){
	var random = request.randomString;
	var exTime = request.timeString;
	var sendUrl=URL+ "authorize?nick="+encodeURI(encodeURI(nick));
	if(random != null && exTime != null){
		sendUrl+="&random="+random+"&exTime="+exTime;
	}
	chrome.extension.sendRequest({type:"getBackgroundValue",key:"modelType"}, function(response){
		if(response.model == 3){
			sendUrl += "&userType=receverOrder"
		}
		sendAuthorize(sendUrl,rsp);
	});
}

function sendAuthorize(sendUrl,rsp){
	
	chrome.extension.sendRequest({type:"sendMsg",URL:sendUrl}, function(response){
		var rspValue=JSON.parse(response);
		present=rspValue.present;
		userConfig = rspValue.userConfig;
		var fileModifyedTime = rspValue.fileModifyedTime;
		
		chrome.extension.sendRequest({type:"setBackgroundValue",key:"userConfig",value:userConfig}, function(){});

		chrome.extension.sendRequest({type:"getBackgroundValue",key:"fileModifyedTime"}, function(response){
			console.log(response+" : "+fileModifyedTime);
			if(response==null || fileModifyedTime==null || response < fileModifyedTime){
				console.log(response+" "+fileModifyedTime);
				chrome.extension.sendRequest({type:"setBackgroundValue",key:"fileModifyedTime",value:fileModifyedTime}, function(){});
				chrome.extension.sendRequest({type:"clearFileOnService"}, function(){});
			}
			
		});
		rsp(rspValue.value.authorize);
	});	
}