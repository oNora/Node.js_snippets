var express = require('express'),
	http = require('http');
	bodyParser = require('body-parser'),
	accepts = require('accepts');

var	 app = express();

app.set('port', process.env.POTR || 3300);
app.set('views', __dirname + "/views");
app.set("view engine", "jade");
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/user-agent', function(req, res) {
	res.send(req.get('user-agent'));
	var encodings = accepts.encodings();
	console.log('encodings');
	console.log(encodings);
});

app.get('/accepted', function(req, res) {
	var accept = accepts(req);
	res.send(accept.types());
});

app.get('/accepts', function(req, res) {
	res.send(req.accepts(['html', 'text', 'json']));
});

app.get('/languages', function(req, res) {
	var accept = accepts(req);
	res.send(accept.languages());
});

app.get('/charsets', function(req, res) {
	var accept = accepts(req);
	res.send(accept.charsets());
});

app.get('/name/:name', function(req, res) {
	res.send(req.param('name'));
});

app.get('/name1/:name?', function(req, res) {
	res.send(req.param('name', 'default value'));
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});