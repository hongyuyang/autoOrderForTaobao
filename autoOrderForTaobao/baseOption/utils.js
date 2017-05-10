extUtils = {
	simulateClick:{
		autoClickById :function(id){
			if (!document.getElementById(id)) return;

		    var e = document.createEvent("MouseEvents");
		    e.initEvent("click", true, true);
		    document.getElementById(id).dispatchEvent(e);
		},
		autoClickByCss0 :function(css){
			if (!document.getElementsByClassName(css)) return;
		    var e = document.createEvent("MouseEvents");
			e.initEvent("click", true, true);
			document.getElementsByClassName(css)[0].dispatchEvent(e);
		},
		autoClickByCss :function(css,index){
			if (!document.getElementsByClassName(css)[index]) return;
		    var e = document.createEvent("MouseEvents");
			e.initEvent("click", true, true);
			document.getElementsByClassName(css)[index].dispatchEvent(e);
		},
		autoClickByDom:function(dom)
		{
			var e = document.createEvent("MouseEvents");
			e.initEvent("click", true, true);
			dom.dispatchEvent(e);
		},
		getElementByAttrs:function (tag,attr,value,index)
		{
		    var aElements=document.getElementsByTagName(tag);
		    var aEle=[];
		    for(var i=0;i<aElements.length;i++)
		    {
		        if(aElements[i].getAttribute(attr)==value)
		            aEle.push( aElements[i] );
		    }
		    return aEle[index];
		}

	},
	simulateHtmlEvents:{
		trigger:function(domCss0,eventName)
		{
			if (!document.getElementsByClassName(domCss0)) return;
		    var e = document.createEvent("HTMLEvents");
			e.initEvent(eventName, true, true);
			document.getElementsByClassName(domCss0)[0].dispatchEvent(e);
		}
	},
	chrome:{
		varBridge:function(topName)
		{
			var e=document.createElement("script"); 
			e.innerHTML="localStorage['"+topName+"']=JSON.stringify("+topName+")";
			
			e.setAttribute("charset","utf-8") ;
			document.body.appendChild(e);
			return JSON.parse(localStorage[topName]);
		}
	},
	http:{
		 getQueryString:function(name) { 
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
			var r = window.location.search.substr(1).match(reg); 
			if (r != null) return unescape(r[2]); return null; 
		},
		urlToHttp:function(url)
		{
				if (url.indexOf("//")==0)
		  		{
		  			url = "https:"+url;
		  		}
		  		return url;
		}
	},
	debug:{
		d:function(msg)
		{
			console.log(msg);
		}
	}
	
}
q={
	d:function(msg,obj)
	{
		extUtils.debug.d(msg);
		if (obj)
		extUtils.debug.d(obj);
	},
	clickDom:function(dom)
	{
		extUtils.simulateClick.autoClickByDom(dom);
	}
}