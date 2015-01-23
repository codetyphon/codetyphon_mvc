function Rout(pathname,x){
	console.log("!"+pathname)
	switch(pathname){
		/* router begin u can code here*/
		case '/':
	  		name='view/index.html';
	  		break;
  		case '/index':
	  		name='view/index.html';
	  		break;
	  	case '/about':
	  		name='view/about.html';
	  		break;
	  	case '/blogs':
	  		name='view/blogs.html';
	  		break;
	  	/* router end */
	  	default:
	  		x();
	}
	console.log("!name"+name)
}
exports.rout=Rout;