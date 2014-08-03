var express = require('express'),
	http = require('http');

var	 app = express();

app.configure(function() {
	app.set('port', process.env.POTR || 3000);
	app.set('views', __dirname + "/views");
	app.set("view engine", "jade");
	app.use(express.bodyParser());
});


app.get('/user-agent', function(req, res) {
	res.send(req.get('user-agent'));
});

app.get('/accepted', function(req, res) {
	res.send(req.accepted);
});

app.get('/accepts', function(req, res) {
	res.send(req.accepts(['html', 'text', 'json']));
});

app.get('/acceptedChar', function(req, res) {
	res.send(req.acceptedCharsets);
});

app.get('/acceptsCharset', function(req, res) {
	res.send(req.acceptsCharset('utf-8') ? 'yes' : 'no');
});

app.get('/acceptedLanguages', function(req, res) {
	res.send(req.acceptedLanguages);
});

app.get('/acceptsLanguages', function(req, res) {
	res.send(req.acceptsLanguage('fr') ? 'yes' : 'no');
});

app.get('/name/:names', function(req, res) {
	res.send(req.param('names'));
});

app.get('/name2/:name?', function(req, res) {
	res.send(req.param('name', 'default value'));
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});