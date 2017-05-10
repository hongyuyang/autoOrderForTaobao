
getConfigOnService(getTabMsg);
function getTabMsg(){
	var tabUrl = window.location.href;
	var baseUrlPos = tabUrl.indexOf("?");
	if(baseUrlPos!=-1){
		tabUrl = tabUrl.substring(0,baseUrlPos);
	}
	
	
	chrome.extension.sendRequest({type:"getBackgroundValue",key:"fileBuffer"}, function(fileBuffer){
		if(fileBuffer==null){
			fileBuffer={};
		}
		addJsFiles(tabUrl,fileBuffer);
	});
	
}

function addJsFiles(tabUrl,fileBuffer){
	if(fileBuffer[tabUrl] != null){
		executePage(fileBuffer[tabUrl]);
		return;
	}else{
		var sendUrl = URL+"GetJsFilesForUrl?url="+encodeURIComponent(encodeURIComponent(tabUrl));
		chrome.extension.sendRequest({type:"sendMsg",URL:sendUrl}, function(response){
			var matchedJson = JSON.parse(response);
			executePage(matchedJson);
			fileBuffer[tabUrl]=matchedJson;
			
			chrome.extension.sendRequest({type:"setBackgroundValue",key:"fileBuffer",value:fileBuffer}, function(fileBuffer){});
		});
	}
}

function executePage(matchedJson){
	
	for(var i = 0;i<matchedJson.cssFile.length;i++){
		var code = matchedJson.cssFile[i];
		chrome.extension.sendRequest({type:"insertCSS",inputCss:code}, function(response){});
	}
	for(var i = 0;i<matchedJson.jsFile.length;i++){
		var code = matchedJson.jsFile[i];
		chrome.extension.sendRequest({type:"executeScript",inputScript:code}, function(response){});
	}
}