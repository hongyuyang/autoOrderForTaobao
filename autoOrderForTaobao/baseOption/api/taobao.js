taobaoAPI = {
	customerOrder:{
		url:"https://buyertrade.taobao.com/trade/itemlist/asyncBought.htm?action=itemlist/BoughtQueryAction&event_submit_do_query=1&_input_charset=utf8",

		param:{
			action:"itemlist/BoughtQueryAction",
			event_submit_do_query:"1",
			_input_charset:"utf8"
		},
		data:{
			buyerNick:"",
			dateBegin:0,
			dateEnd:0,
			lastStartRow:"",
			logisticsService:"",
			options:0,
			orderStatus:"SEND",
			pageNum:1,
			pageSize:15,
			queryBizType:"",
			queryOrder:"desc",
			rateStatus:"",
			refund:"",
			sellerNick:"",
			auctionStatus:"SEND",
			prePageNo:1
		}

	},
	detailOrder:{
		baseUrl:"https://trade.taobao.com/trade/detail/trade_order_detail.htm",
		param:{
			"biz_order_id":""
		},
		getUrlByOrderId:function(orderId)
		{
			this.param.biz_order_id = orderId;
			return this.getUrl(this.baseUrl,this.param);
		},
		getUrl:function(url,params)
		{
			
			if (params)
			{
				url += "?";
				for ( key in params)
				{
					url += key+"="+params[key]+"&";
				}
				url = url.substr(0,url.length-1);
			}
			return url;
		}
	},
	address:
	{
		outputAddressTownArray:"https://lsp.wuliu.taobao.com/locationservice/addr/output_address_town_array.do"
	},
	order:{
		baseUrl:"https://buyertrade.taobao.com/trade/itemlist/asyncBought.htm",
		baseData:{
			buyerNick:"",
			dateBegin:0,
			dateEnd:0,
			lastStartRow:"",
			logisticsService:"",
			options:0,
			orderStatus:"NOT_PAID",
			pageNum:1,
			pageSize:15,
			queryBizType:"",
			queryOrder:"desc",
			rateStatus:"",
			refund:"",
			sellerNick:"",
			auctionStatus:"NOT_PAID",
			prePageNo:1
		},
		getUrlByPage:function(index)
		{
			
			return this.getUrl({
				"action":"itemlist/BoughtQueryAction",
				"event_submit_do_query":index,
				"_input_charset":"utf8"
			})
		},
		getNotPaidData:function()
		{
			this.baseData.auctionStatus = "NOT_PAID";
			this.baseData.orderStatus = "NOT_PAID";
			return this.baseData;
		},
		getSendData:function()
		{
			this.baseData.auctionStatus = "SEND";
			this.baseData.orderStatus = "SEND";
			return this.baseData;
		},
		getUrl:function(params)
		{
			var url = this.baseUrl;
			if (params)
			{
				url += "?";
				for ( key in params)
				{
					url += key+"="+params[key]+"&";
				}
				url = url.substr(0,url.length-1);
			}
			return url;
		}
	},
	notPaidOrder:{
		baseUrl:"https://buyertrade.taobao.com/trade/itemlist/asyncBought.htm",
		baseData:{
			buyerNick:"",
			dateBegin:0,
			dateEnd:0,
			lastStartRow:"",
			logisticsService:"",
			options:0,
			orderStatus:"NOT_PAID",
			pageNum:1,
			pageSize:15,
			queryBizType:"",
			queryOrder:"desc",
			rateStatus:"",
			refund:"",
			sellerNick:"",
			auctionStatus:"NOT_PAID",
			prePageNo:1
		},
		getUrlByPage:function(index)
		{
			
			return this.getUrl({
				"action":"itemlist/BoughtQueryAction",
				"event_submit_do_query":index,
				"_input_charset":"utf8"
			})
		},
		getUrl:function(params)
		{
			var url = this.baseUrl;
			if (params)
			{
				url += "?";
				for ( key in params)
				{
					url += key+"="+params[key]+"&";
				}
				url = url.substr(0,url.length-1);
			}
			return url;
		}
	}
}