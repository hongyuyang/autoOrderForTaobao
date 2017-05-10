htmlDB={
	 openDB :function(name,version,cb) {
            var version=version || 1;
            var request=window.indexedDB.open(name,version);
            request.onerror=function(e){
                console.log(e.currentTarget.error.message);
            };
            request.onsuccess=function(e){
                cb(e.target.result);
            };
            request.onupgradeneeded=function(e){
                var db=e.target.result;
                if(!db.objectStoreNames.contains('order')){
                    var store=db.createObjectStore('order',{keyPath: 'id',autoIncrement: true});
                    store.createIndex('SIdIndex','SId',{unique:true}); 
                    store.createIndex('BIdIndex','BId',{unique:true}); 
                    store.createIndex('statusIndex','status',{unique:false}); 
                }
                if(!db.objectStoreNames.contains('pendingOrder')){
                    var store=db.createObjectStore('pendingOrder',{keyPath: 'AOrderId'});
                }
                if(!db.objectStoreNames.contains('notPaidOrder')){
                    var store=db.createObjectStore('notPaidOrder',{keyPath: 'SOrderId'});
                }
                if(!db.objectStoreNames.contains('orderInfo')){
                    var store=db.createObjectStore('orderInfo',{keyPath: 'SOrderId'});
                }
                console.log('DB version changed to '+version);
            };
        },
    addObjs :function (db,storeName,objs){

            var transaction=db.transaction(storeName,'readwrite'); 
            var store=transaction.objectStore(storeName); 
            q.d(storeName+"插入对象s");
            q.d(objs);
            for(var i=0;i<objs.length;i++){
                store.add(objs[i]);
            }
        },
    addObj :function (db,storeName,obj){
        var transaction=db.transaction(storeName,'readwrite'); 
        var store=transaction.objectStore(storeName); 
        store.add(obj);
                q.d(storeName+"插入对象");
                q.d(obj);
    },
    clearObjectStore:function (db,storeName){
            var transaction=db.transaction(storeName,'readwrite'); 
            var store=transaction.objectStore(storeName); 
            store.clear();
    },
    getDataByKey :function (db,storeName,value,cb){
            var transaction=db.transaction(storeName,'readwrite'); 
            var store=transaction.objectStore(storeName); 
            var request=store.get(value); 
            request.onsuccess=function(e){ 
                var result=e.target.result; 
                cb(result);
            };
    },
    getDataByIndex:function (db,storeName,index,value,cb){
            var transaction=db.transaction(storeName);
            var store=transaction.objectStore(storeName);
            var index = store.index(index);
            index.get(value).onsuccess=function(e){
                var result=e.target.result; 
                cb(result);
            }
        },
     getDataByKey:function (db,storeName,value,cb){
        var transaction=db.transaction(storeName);
        var store=transaction.objectStore(storeName);
        store.get(value).onsuccess=function(e){
            var result=e.target.result; 
            cb(result);
        }
    },
    updateDataByIndex:function (db,storeName,index,value,cb){
            var transaction=db.transaction(storeName,'readwrite'); 
            var store=transaction.objectStore(storeName); 
            var request=store.index(index).get(value); 
            request.onsuccess=function(e){ 
                var result=e.target.result; 
                store.put(cb(result)); 
            };
    },
    updateDataByKey:function (db,storeName,id,obj,cb){
       
        var transaction = db.transaction(storeName, "readwrite");  
        var store = transaction.objectStore(storeName);  
        var request = store.put(obj,id);  
        request.onsuccess = function(){  
            q.d("ok");
        };  
        request.onerror = function(event){  
            q.d(event);  
        } 
            
    },
    fetchStoreByCursor:function (db,storeName,cb){
            var transaction=db.transaction(storeName);
            var store=transaction.objectStore(storeName);
             var request=store.openCursor();
            var results = [];
            request.onsuccess=function(e){
                
                 cursor=e.target.result;
               
                if(cursor){
                    results.push(cursor.value);
                    console.log(cursor);
                    cursor.continue();
                    
                }
                else
                {
                    q.d("查询数据库列表");
                    q.d(results);
                     cb(results);
                }
               
            };

        }
}
// var obj = {};
// obj.BId = 123;
// obj.orderUrl = "https://orderurl";
// obj.orderSku={color:'hei',size:18};
// obj.orderNum = 10;
// obj.orderNote = 'qu';
// obj.SId = 456;
// obj.mailUrl = "https://mailurl";
// obj.mailName = "shunfeng";
// obj.status="SEND";
// htmlDB.openDB("db",1,function(db)
// {
//     htmlDB.addObj(db,"order",obj);
// });