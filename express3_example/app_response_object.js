var express = require('express'),
	http = require('http');

var	 app = express();

app.configure(function() {
	app.set('port', process.env.POTR || 3000);
	app.set('views', __dirname + "/views");
	app.set("view engine", "jade");
	app.use(express.bodyParser());
});


app.get('/404', function(req, res) {
	res.send(404, 'not found');
});

app.get('/sent-json', function(req, res) {
	res.json({message: "something"});
});

app.get('/res-type', function(req, res) {
	res.type('image/png').send('this is a picture');
	//this is not work because after send has no bites, no picture it is plane texts
});


// sent deferent types of content dependes of headers for example
// sent deferent types of content dependes of whot you wont
app.get('/format', function(req, res) {
	res.format({
		html: function () {res.send('<h1> Body </h1>');},
		json: function () {res.json({message: "monething"});},
		text: function () {res.send('body');}
	});
});


app.get('/home', function(req, res) {
	res.redirect('/');
});

app.get('/', function(req, res) {
	res.send("home redirect");
});

// app.get('/home', function(req, res) {
// 	res.redirect(302, '/');
// });


// app.get('/home', function(req, res) {
// 	res.status(302).redirect('/');
// 	// res.set ot res.header  = are equal
// });

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});