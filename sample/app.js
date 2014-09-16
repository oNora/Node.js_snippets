var express = require('express'),
	http = require('http'),
	bodyParser = require('body-parser');
	// var path = require('path');

var	app = express(),
	router = express.Router();

app.set('port', process.env.POTR || 3000);
app.use(bodyParser.urlencoded({
	extended: true
}));

//db simulation
// var q2Text = ['Which word doesn\'t fit?', 'pear', 'apple', 'stone'];
var q2Text = {
	question: 'Which word doesn\'t fit?',
	questionNumber: '2',
	a: 'pear',
	b: 'apple',
	c:'stone'
};
// var q3Text = ['Coffee is to cup, what cake is to...', 'fork', 'napkin', 'plate'];
var q3Text = {
	question: 'Coffee is to cup, what cake is to...',
	questionNumber: '3',
	a: 'fork',
	b: 'napkin',
	c:'plate'
};
var correctAnswer = {
	q1: 'television',
	q2: 'stone',
	q3: 'fork'
}
var saveAnswers = {
	q1: '',
	q2: '',
	q3: ''
};

function nextQuestion(req, res){
	console.log("body");
	console.log(req.body);

	var body = req.body;
	var questionNumber = body.q_number;
	var qNumber = parseInt(questionNumber,10);
	var questionVersion = 'q'+qNumber;

	saveAnswers[questionVersion] = body[questionVersion];

	qNumber++;
	// console.log('qNumber');
	// console.log(qNumber);

	switch(qNumber) {
    case 2:
        console.log('2 e');
        res.send(q2Text);
        break;
    case 3:
        console.log('3 e');
        res.send(q3Text);
        break;
	}

	// res.send("ima psot");
	console.log('saveAnswers');
	console.log(saveAnswers);
}

	// console.log('saveAnswers');
	// console.log(saveAnswers);

app.get(["/", '/index'], function(req, res) {
	res.sendFile(__dirname + "/apps/veiws/index.html");
});


app.post('/nextQuestion', nextQuestion);

// for static files in html
app.use(/^(.+)$/, function(req, res){
	res.sendFile( __dirname + req.params[0]);
});

//send error if try to get no existing url
app.use(function(err, req, res, next) {
	res.status(404).send('four-oh-four');
});
http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

