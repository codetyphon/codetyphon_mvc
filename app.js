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

/* 插入数据 */
var db_insert=function(table,obj,callback,err_callback){
	try{
		MongoClient.connect(db_url, function(err, db) {
		  //assert.equal(null, err);
		  if(err===null){
		  	console.log("Connected correctly to server");
			var collection = db.collection(table);
			//
			collection.insert(obj, function(err, docs) {
			  	if(err===null){
					try{
						callback(docs);
						db.close();
					}catch(e){
						try{
							err_callback(e+'');	
						}catch(e){
							console.log('error on error_callback');
						}
					}
				}else{
					//
					try{
						err_callback(err+'');	
					}catch(e){
						console.log('error on error_callback');
					}
					//
				}
			});
			//
		  }else{
			console.log(err);
			//err_callback(err+"");
				try{
					err_callback('数据库连接超时');	
				}catch(e){
					console.log('error on error_callback');
				}
		  }
 		  
		});
	}catch(err){
		err_callback(err+"");
	}
}
/* 查询数据 */
var db_query=function(table,obj,callback,err_callback){
	try{
		MongoClient.connect(db_url, function(err, db) {
		  //assert.equal(null, err);
		  if(err===null){
		  	console.log("Connected correctly to server");
			var collection = db.collection(table);
			collection.find(obj).toArray(function(err, docs) {
				if(err===null){
					try{
						callback(docs);
						db.close();
					}catch(e){
						try{
							err_callback(e+'');	
						}catch(e){
							console.log('error on error_callback');
						}
					}
				}else{
					//
					try{
						err_callback(err+'');	
					}catch(e){
						console.log('error on error_callback');
					}
					//
				}
			}); 
		  }else{
			console.log(err);
			//err_callback(err+"");
				try{
					err_callback('数据库连接超时');	
				}catch(e){
					console.log('error on error_callback');
				}
		  }
 		  
		});
	}catch(err){
		err_callback(err+"");
	}
}
/* 更新数据 */
var db_update=function(table,obj,newObj,callback,err_callback){
	console.log("执行数据库更新程序");
	try{
		MongoClient.connect(db_url, function(err, db) {
		  //assert.equal(null, err);
		  if(err===null){
		  	
		  	console.log("10 数据库连接正常");
			var collection = db.collection(table);
			//
			collection.update(obj,{ $set:newObj }, function(err, docs) {
				if(err===null){
					console.log("20 数据更新正常");
					try{
						callback(docs);
						db.close();
					}catch(e){
						console.log("30 数据更新异常");
						try{
							console.log("40 返回注入错误函数异常");
							err_callback(e+'');	
						}catch(e){
							console.log('error on error_callback');
						}
					}
				}else{
					//
					console.log("20 数据更新异常");
					try{
						err_callback(err+'');	
					}catch(e){
						console.log('error on error_callback');
					}
					//
				}
			});  
			//
		  }else{
			console.log("10 数据库连接异常");
			//err_callback(err+"");
			err_callback('数据库连接超时');
		  }
		  db.close();
 
		});
	}catch(err){
		err_callback(err+"");
	}
}
/* 删除数据 */
var db_remove=function(table,obj,callback,err_callback){
	try{
		MongoClient.connect(db_url, function(err, db) {
		  //assert.equal(null, err);
		  if(err===null){
		  	console.log("Connected correctly to server");
			var collection = db.collection(table);
			collection.remove(obj,function(err, docs) {
				if(err===null){
					console.log('已经删除');
					try{
						callback(docs);
						db.close();
					}catch(e){
						try{
							err_callback(e+'');	
						}catch(e){
							console.log('error on error_callback');
						}
					}
				}else{
					//
					try{
						err_callback(err+'');	
					}catch(e){
						console.log('error on error_callback');
					}
					//
				}
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
		console.log("执行控制器");
		var actiondata="";
		var actionpath="act/"+actname+".js";
		//得到控制器内容，以读取方式用于热部署
		actiondata += fs.readFileSync(actionpath);
		//console.log(actiondata);
		eval(actiondata);//执行处理器
	}catch(err){
		console.log("控制器异常："+err);
		res.writeHead(header.code,header.text);
		res.write("控制器错误");
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
