var express = require('express'),
	bodyParser = require('body-parser'),
	http = require('http');

var	 app = express();

app.set('port', process.env.POTR || 3000);
app.set('views', __dirname + "/views");
app.set("view engine", "jade");
// app.use(express.static(__dirname + '/publice'));
app.use('/publice', express.static(__dirname + "/publice"));
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/404', function(req, res) {
	res.send(404, 'not found');
});

app.get('/json', function(req, res) {
	res.json({massage: "something"});
});

app.get('/image', function(req, res) {
	// res.type('image/png').send('this is a picture');
	var image = __dirname + "/publice/ice_cream.png";
	console.log(image);
	// res.type('image/png').send(image);
	res.send(image);
	//this is not work because after send has no bites, no picture it is plane texts
});


// sent deferent types of content dependes of headers for example
// sent deferent types of content dependes of whot you wont
app.get('/format', function(req, res) {
	res.format({
		html: function () {res.send('<h1> Body </h1>');},
		json: function () {res.json({massage: "something"});},
		text: function () {res.send('body');}
	});
});


// app.get('/home', function(req, res) {
// 	res.redirect('/');
// });

// app.get('/home', function(req, res) {
// 	res.redirect(302, '/');
// });

app.get('/home', function(req, res) {
	res.status(302).redirect('/');
	// res.set ot res.header  = are equal
});

app.get('/', function(req, res) {
	res.send('redirect from home');
});

app.get('/jade', function(req, res) {
	 res.render("home");
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
