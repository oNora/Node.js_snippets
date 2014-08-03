var express = require('express'),
	http = require('http');

var	 app = express();

app.configure(function() {
	app.set('port', process.env.POTR || 3000);
	app.set('views', __dirname + "/views");
	app.set("view engine", "jade");
	
	app.use(express.cookeiParser());
	app.use(app.router);
	app.use(app.static(__dirname + '/publice'));

});

app.get('/name/:name', function(req, res) {
	res.cookie('name', req.params.name).send('<p>To see the cookie in action, <a href="/name">Go here</a></p>')
});

// app.get('/name', function(req, res) {
// 	res.send(req.cookies.name);
// });

app.get('/name', function(req, res) {
	res.clearCookie('name').send(req.cookies.name);
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});