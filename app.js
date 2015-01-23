var http = require('http');
var url = require("url");
fs = require('fs');
var router=require('./router');
if(process.env.PORT==undefined){
	process.env.PORT=80;
}
function out(name){
	var data="";
	try{
		data = fs.readFileSync(name);
	}catch(err){
		name="view/404.html";
		data=out(name);
	}
	return data;
}
function act(actname){
	var data="";
	actname="view/"+actname+".html";
	try{
		data = fs.readFileSync(actname);
	}catch(err){
		actname="view/404.html";
		data=out(actname);
	}
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
	name='';
	router.rout(pathname,function(){
			res.writeHead(header.code,header.text);
			res.write(act(name));
			//console.log(pathname.split('/')+argsstr);
			res.end();
	},function(){
			var acts=pathname.split('/');
	  		var act=pathname.split('/')[1];
	  		var file="";
	  		for(var i=2;i<acts.length;i++){
	  			//console.log(acts[i]);
	  			file+="/"+acts[i];
	  		}
	  		//console.log(file);
	  		name="view/404.html";
	  		switch(act){
	  			case 'img':
	  				file="img"+file;
	  				header={
						"code":200,
						"text":{'Content-Type': 'image/x-png;charset=utf-8'}
					};
					name="res/"+file;
	  				break;
	  			case 'css':
	  				file="css"+file;
	  				header={
						"code":200,
						"text":{'Content-Type': 'text/css;charset=utf-8'}
					};
	  				name="res/"+file;
	  				break;
	  			case 'js':
	  				file="js"+file;
	  				header={
						"code":200,
						"text":{'Content-Type': 'text/javascript;charset=utf-8'}
					};
	  				name="res/"+file;
	  				break;
	  			case 'blog':
	  				file="blog"+file;
	  				header={
						"code":200,
						"text":{'Content-Type': 'text/html;charset=utf-8'}
					};
	  				name=file;
	  				break;
	  			default:
	  				header={
						"code":404,
						"text":{'Content-Type': 'text/html;charset=utf-8'}
					};
			  		name="view/404.html";
			}
			res.writeHead(header.code,header.text);
			res.write(out(name));
			console.log(pathname.split('/')+argsstr);
			res.end();
			console.log(file);
	});
	console.log("name:"+name);

}).listen(process.env.PORT || 1337, null);