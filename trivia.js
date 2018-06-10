function Sims(sims) {
	return C('div', {}, [
		`remaining SIMS: ${sims.length}`,
		C('div', {style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(10px,1fr))'}}, 
			sims.map(sim=>C('div',{style:{border:'1px solid black', textAlign:'center'}}, [sim]))
		)
	]);
}

var App = (function() {
	var before = true;
	var simsNum = 243;
	var sims = [];
	for (var i = 0 ; i < simsNum ; i++) {
		sims.push(0);
	}

	return function() {
		return C('div', {style:{padding:'1em'}}, [
			Sims(sims,before),

		]);
	}
}());

C.attach(App,document.getElementById('root'));