var express = require('express'),
	http = require('http');

var	 app = express();

app.configure(function() {
	app.set('port', process.env.POTR || 3000);
	app.set('views', __dirname + "/views");
	app.set("view engine", "jade");
	

	app.use(app.router);
	app.use(express.static(__dirname + '/publice'));

});

var count = 0;

app.get('/hallo.txt', function(req, res, next) {
	count++;
	console.log('coun in hallo');
	console.log(count);
	next();
});

app.get('/count', function(req, res) {
	console.log('coun in get count');
	console.log(count);
	res.send('' + count + 'Views');
});


console.log('coun ');
console.log(count);

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});