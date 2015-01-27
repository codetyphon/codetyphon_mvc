var http = require('http');
var url = require("url");
fs = require('fs');
if(process.env.PORT==undefined){
	process.env.PORT=80;
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
//处理资源文件 css js png 等
function out(name){
	var data="";
	try{
		data = fs.readFileSync(name);
	}catch(err){
		name="view/404.html";
		data=out(name);
	}
	console.log("request resname:"+name);
	console.log("open file: "+name);
	return data;
}
//获得资源文件 css js png 等
function getRes(name){
	var data="";
	try{
		data = fs.readFileSync(name);
	}catch(err){
		name="view/404.html";
		data=out(name);
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
//处理控制器
function actexec(actname,viewname,argsstr){
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
	}
	//
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
	var actname='';
	var viewname='';
	//

	var acts=pathname.split('/');
	//得到名称
	var act=pathname.split('/')[1];
	var resfile="";
	for(var i=2;i<acts.length;i++){
	  	//console.log(acts[i]);
	  	resfile+="/"+acts[i];
	}
	//优先处理资源请求
	switch(act){
	  	case 'img':
	  		resfile="img"+resfile;
	  		header={
				"code":200,
				"text":{'Content-Type': 'image/x-png;charset=utf-8'}
			};
			name="res/"+resfile;
	  		break;
	  	case 'css':
	  		resfile="css"+resfile;
	  		header={
				"code":200,
				"text":{'Content-Type': 'text/css;charset=utf-8'}
			};
	  		name="res/"+resfile;
	  		break;
	  	case 'js':
	  		resfile="js"+resfile;
	  		header={
				"code":200,
				"text":{'Content-Type': 'text/javascript;charset=utf-8'}
			};
	  		name="res/"+resfile;
	  		break;
	  	case 'blog':
	  		resfile="blog"+resfile;
	  		header={
				"code":200,
				"text":{'Content-Type': 'text/html;charset=utf-8'}
			};
	  		name=resfile;
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
			}
	  		//如果不在路由之中：
	  		header={
				"code":404,
				"text":{'Content-Type': 'text/html;charset=utf-8'}
			};
	}
	//
	res.writeHead(header.code,header.text);
	
	if(viewname===''){
		res.write(getRes(name));
	}else{
		res.write(actexec(actname,viewname,argsstr));
	}
	//console.log(pathname.split('/')+argsstr);
	res.end();
}).listen(process.env.PORT || 1337, null);
