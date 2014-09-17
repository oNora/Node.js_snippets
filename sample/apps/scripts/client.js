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
				console.log('data');
				console.log(data);
				console.log('error');
				console.log(error);
		});
	}



	clientjs.nextQuestion = nextQuestion;
	clientjs.seeAnswers = seeAnswers;
})(clientjs || (clientjs = {}),$);