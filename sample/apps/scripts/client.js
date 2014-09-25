var clientjs;
(function (clientjs, $) {

	function nextQuestion(){
		if($( "input:checked" ).length){
			$.post('/nextQuestion', $('form').serialize()).done(function(data, error){
				// console.log('data');
				// console.log(data);
				// console.log('error');
				// console.log(error);

				if (error == 'success') {
					updateHtml(data);
				}
			});
		}
	}

	function updateHtml (dataHtml){
		$('input[type="radio"]').attr('checked',false);
		
		if(dataHtml != 'no more questions'){
			var numberQ = 'q'+dataHtml.questionNumber;

			$('ul').html('<li>'+dataHtml.a+'</li><li>'+dataHtml.b+'</li><li>'+dataHtml.c+'</li>');
			$('h3').html(dataHtml.question);
			$('input[type="radio"]').attr('name', numberQ);
			$('.answers_a').val(dataHtml.a);
			$('.answers_b').val(dataHtml.b);
			$('.answers_c').val(dataHtml.c);
			$('input[type="hidden"]').val(dataHtml.questionNumber);
		}else{
			$('form').hide();
			$('h3').hide();
			$('.noMoreQuestions').show();
		}
	}

	function seeAnswers() {
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



	clientjs.nextQuestion = nextQuestion;
	clientjs.seeAnswers = seeAnswers;
})(clientjs || (clientjs = {}),$);