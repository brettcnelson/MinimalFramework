var Radio = (function() {
	var val = 1;
	var radioStyle = {style:{display:'inline-block'}};
	function changeRadio(e) {
		val = Number(e.target.value);
		C.sync();
	}

	function submit(e) {
		e.preventDefault();
		// console.log(e)
		C.sync();
	}

	return function Radio(feed,children) {
		return C('form', [
			C('div', ['this is the radio form']),
			C('div', radioStyle, [
				C('label', [1]),
				C('input', {type:'radio',value:1,checked:val===1,listeners:{onchange:(e)=>changeRadio(e)}})
			]),
			C('div', radioStyle, [
				C('label', [2]),
				C('input', {type:'radio',value:2,checked:val===2,listeners:{onchange:(e)=>changeRadio(e)}})
			]),
			C('div', radioStyle, [
				C('label', [3]),
				C('input', {type:'radio',value:3,checked:val===3,listeners:{onchange:(e)=>changeRadio(e)}})
			]),
			C('button', {id:'button',listeners:{onclick:(e)=>submit(e)}})
		]);
	}
}());

var App = (function() {
	var text = 1;
	return function() {
		return C('div', [text++,
			Radio()
		]);
	}
}())

C.attach(App,document.getElementById('root'));
