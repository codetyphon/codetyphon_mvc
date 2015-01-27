var http = require('http');
var url = require("url");
fs = require('fs');

var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var config='';
var db_url = '';
//
//重新载入配置文件
function reload_config(){
	try{
		var config_str='config=';
		config_str += fs.readFileSync('./config.json');
		eval(config_str);
		//配置数据库链接
		db_url = 'mongodb://'+config.mongo_db_host+':'+config.mongo_db_port+'/'+config.mongo_db_name;
		console.dir(config)
	}catch(err){
		console.log("load config error");
	}
}


var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insert([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the document collection");
    callback(result);
  });
}
//
var updateDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Update document where a is 2, set b equal to 1
  collection.update({ a : 2 }
    , { $set: { b : 1 } }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the document with the field a equal to 2");
    callback(result);
  });  
}
//
var removeDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.remove({ a : 3 }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });    
}
//



var db_query=function(table,obj,callback,err_callback){
	try{
		MongoClient.connect(db_url, function(err, db) {
		  //assert.equal(null, err);
		  
		  if(err===null){
		  	
		  	console.log("Connected correctly to server");
			var collection = db.collection(table);
			collection.find(obj).toArray(function(err, docs) {
			   	callback(docs);
			   	//console.dir(docs);
			   	db.close();
			}); 
		  }else{
			console.log(err);
			//err_callback(err+"");
			err_callback('数据库连接超时');
		  }
 
		});
	}catch(err){
		err_callback(err+"");
	}
}
//mongoDB数据库操作方法结束
var out_html=function(res,header,actname,viewname,argsstr){
	var data="";
	//得到html文件内容
	data = getContext(viewname);
	console.log("grgs: "+argsstr);
	//
	try{
		//尝试使用控制器
		var actiondata="";
		var actionpath="act/"+actname+".js";
		//得到控制器内容，以读取方式用于热部署
		actiondata += fs.readFileSync(actionpath);
		//console.log(actiondata);
		eval(actiondata);//执行处理器
	}catch(err){
		console.log("action error");
		res.writeHead(header.code,header.text);
		res.write("action error");
		res.end();
	}
	//渲染器
	function render(){
		res.writeHead(header.code,header.text);
		res.write(data);
		res.end();
	}
}
//字符串替换
String.prototype.setValue = function ( hash ) {
    var str = this, key;
    for ( key in hash ) {
        if ( Object.prototype.hasOwnProperty.call( hash, key ) ) {
            str = str.replace( new RegExp( key, 'g' ), hash[ key ] );
        }
    }
    return str;
};
//获得资源文件 css js png 等
function getRes(name){
	var data="";
	try{
		data = fs.readFileSync(name);
	}catch(err){
		name="view/404.html";
		data=getRes(name);
	}
	console.log("request resname:"+name);
	console.log("open file: "+name);
	return data;
}
//得到模板文件内容
function getContext(view){
	var data="";
	var filepath="view/"+view+".html";
	try{
		data = fs.readFileSync(filepath);
	}catch(err){
		filepath="view/404.html";
		data=out(filepath);
	}
	data+="";
	console.log("request actname:"+filepath);
	console.log("open file: "+filepath);
	return data;
}

http.createServer(function (req, res) {
	var header={
		"code":200,
		"text":{'Content-Type': 'text/html;charset=utf-8'}
	};
	var get=req.url;
	var pathname = url.parse(req.url).pathname;
	var argsstr = url.parse(req.url).query;
	var actname='';//控制器文件名
	var viewname='';//模板文件名
	//

	var acts=pathname.split('/');
	//得到名称
	var act=pathname.split('/')[1];
	var resfile="";//资源文件
	for(var i=2;i<acts.length;i++){
	  	//console.log(acts[i]);
	  	resfile+="/"+acts[i];
	}
	//优先处理资源请求
	switch(act){
	  	case 'img':
	  		resfile="res/img"+resfile;
	  		header={
				"code":200,
				"text":{'Content-Type': 'image/x-png;charset=utf-8'}
			};
	  		break;
	  	case 'css':
	  		resfile="res/css"+resfile;
	  		header={
				"code":200,
				"text":{'Content-Type': 'text/css;charset=utf-8'}
			};
	  		break;
	  	case 'js':
	  		resfile="res/js"+resfile;
	  		header={
				"code":200,
				"text":{'Content-Type': 'text/javascript;charset=utf-8'}
			};
	  		break;
	  	case 'blog':
	  		resfile="blog"+resfile;
	  		header={
				"code":200,
				"text":{'Content-Type': 'text/html;charset=utf-8'}
			};
	  		break;
	  	default:
	  		//处理控制器
	  		try{
				router = eval(fs.readFileSync("./router.json")+"");
				var i=0;
				for(i=0;i<router.length;i++){
					console.log(act+"---"+router[i][0]);
					if(act===router[i][0]){
						actname=router[i][1];
						viewname=router[i][2];
					}
				}
			}catch(err){
				//路由文件错误
				res.writeHead(header.code,header.text);
				res.write("router error");
				res.end();
				//
			}
	  		//如果不在路由之中：
	  		header={
				"code":404,
				"text":{'Content-Type': 'text/html;charset=utf-8'}
			};
	}
	//
	reload_config();
	if(viewname===''){
		//输出资源
		res.writeHead(header.code,header.text);
		res.write(getRes(resfile));
		res.end();
	}else{
		//输出页面
		out_html(res,header,actname,viewname,argsstr);
	}
	//console.log(pathname.split('/')+argsstr);
	
}).listen(process.env.PORT || 80, null);
