var clientjs;
(function (clientjs, $) {

	var questionsTemplate = $('#questionsTemplate').html();
	var tmpQuestions = Handlebars.compile(questionsTemplate);

	function loadQuestions(){
		$.get('/loadQuestions').success(function (data) {

			data.numberQ = 'q'+data.questionNumber;
			$('form').html(tmpQuestions(data));

		});
	}

	function nextQuestion(){
		if($( "input:checked" ).length){
			$.post('/nextQuestion', $('form').serialize()).done(function(data, error){

				if (error == 'success') {
					updateHtml(data);
				}
			});
		}
	}

	function updateHtml (dataHtml){
		$('input[type="radio"]').attr('checked',false);

		if(dataHtml != 'no more questions'){
			dataHtml.numberQ = 'q'+dataHtml.questionNumber;

			$('form').html(tmpQuestions(dataHtml));

		}else{
			$('form').hide();
			$('h3').hide();
			$('.noMoreQuestions').show();
		}
	}

	function seeAnswers() {
		console.log('$(form).serialize()');
		console.log($('form').serialize());
		$.post('/seeAnswers', $('form').serialize()).done(function(data, error){

				if (error == 'success') {
					$('.yourAnswers_1').append(data.q1Answers);
					// $('.yourAnswers_1').append(data.q1Answers + '<span class="'+ (data.q1Answers == data.q1Currect? "currect":"wrong") +'"></span>');
					$('.yourAnswers_1 span').addClass(data.q1Answers == data.q1Currect? "currect":"wrong");
					$('.currectAnswers_1').html(data.q1Currect);

					$('.yourAnswers_2').append(data.q2Answers);
					$('.yourAnswers_2 span').addClass(data.q2Answers == data.q2Currect? "currect":"wrong");
					$('.currectAnswers_2').html(data.q2Currect);

					$('.yourAnswers_3').append(data.q3Answers);
					$('.yourAnswers_3 span').addClass(data.q3Answers == data.q3Currect? "currect":"wrong");
					$('.currectAnswers_3').html(data.q3Currect);

					$('table').show();
					$('.noMoreQuestions').hide();
				}
		});
	}

	loadQuestions();

	clientjs.nextQuestion = nextQuestion;
	clientjs.seeAnswers = seeAnswers;
})(clientjs || (clientjs = {}),$);