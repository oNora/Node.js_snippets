var express = require('express'),
	http = require('http');

var	app = express();

app.configure(function() {
	app.set('port', process.env.POTR || 3000);
	app.set('views', __dirname + "/views");
	app.set("view engine", "jade");
	
	app.use(express.cookieParser());
	app.use(express.session({secret: 'this is a secter'}))
	app.use(app.router);
	app.use(express.static(__dirname + '/publice'));

});

// to set a session hit http://localhost:3000/name/sessionname
// click on 'Go here' -  see the session
app.get('/name/:name', function(req, res) {
	req.session.name = req.params.name;
	res.send('<p>To see the session in action, <a href="/name">Go here</a></p>');
});

// see the session
app.get('/name', function(req, res) {
	res.send(req.session.name);
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
