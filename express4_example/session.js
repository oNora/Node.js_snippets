var express = require('express'),
	http = require('http');
	cookeiParser = require('cookie-parser');

var	 app = express();


	app.set('port', process.env.POTR || 3000);
	app.set('views', __dirname + "/views");
	app.set("view engine", "jade");
	
	app.use(cookeiParser());
	app.use(express.session({secret: 'this is a secter'}))
	app.use(app.router);
	app.use(app.static(__dirname + '/publice'));


app.get('/name/:name', function(req, res) {
	req.session.name = req.arams.name;
	res.send('<p>To see the session in action, <a href="/name">Go here</a></p>');
});

// app.get('/name', function(req, res) {
// 	res.send(req.cookies.name);
// });

app.get('/name', function(req, res) {
	res.send(req.session.name);
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});