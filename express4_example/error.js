var express = require('express'),
	http = require('http'),
	bodyParser = require('body-parser');

var	app = express();
	router = express.Router();

app.set('port', process.env.POTR || 3000);
app.set('views', __dirname + "/views");
app.set("view engine", "jade");
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(express.static(__dirname + '/publice'));

app.get('/', function (req, res){
	res.send('index');
});

// first way for specific error message
app.get('/users/:username', function (req, res, next){
	if(req.params.username ===  'andrew'){
		var err = new Error('User does not exist');
		next(err);
	}else{

		res.send(req.params.username +"'s profile");
	}

	res.send(req.user + "'s profile");
});


// second way for specific error message
app.param('countryname', function (req, res, next, countryname){
	if(countryname !==  'Atlantida'){
		req.country = countryname;
		next();
	}else{
		next(new Error('no country found'));
	}
});

app.get('/country/:countryname', function (req, res, next){

	res.send(req.country + "'s page");
});


//send error if try to get non existing url
app.use(function (req, res){
	res.send(404, 'four-oh-four');
});

// specific error handler
app.use(function (err, req, res, next){
	res.status(err.status || 404);
	res.send(err.message);
});
http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
