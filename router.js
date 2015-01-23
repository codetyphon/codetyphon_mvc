function Rout(pathname,act,res){
	/*
	var jsstr="";
	try{
		jsstr = fs.readFileSync("./router.json");
		var cmd="switch('"+pathname+"'){";
		var routers=eval(jsstr.toString());
		for (var i =0;i< routers.length - 1;i++) {
			cmd+="case '"+routers[i][0]+"':name='view/"+routers[i][1]+".html';break;";
		};
		cmd+="default:x()}";
		eval(cmd);
	}catch(err){
		//console.log(err);
	}
	console.log(cmd)
	/**/
	switch(pathname){

		case '/':
	  		name='index';
	  		act();
	  		break;
  		case '/index':
	  		name='index';
	  		act();
	  		break;
	  	case '/about':
	  		name='about';
	  		act();
	  		break;
	  	case '/blogs':
	  		name='blogs';
	  		act();
	  		break;
	  	default:
	  		res();
	}
	//console.log("!name"+name)
}

exports.rout=Rout;