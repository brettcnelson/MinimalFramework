var App = (function() {

	var data = {
		bars: 1,
		up: true,
		stop: false,
		total: 46
	};

	function stopStart() {
		data.stop = !data.stop;
		C.sync();
	}

	function graphName() {
		var str = 'abcdefghijklmnopqrstuvwxyz0123456789';
		var name = '_id=';
		for (var i = 0 ; i < 20 ; i++) {
			var char = str[Math.floor(Math.random()*str.length)]
			if (Math.random() < .5) {char = char.toUpperCase()}
			name += char;
		}
		return name;
	}

	function updateBars(a) {
		data.up ? data.bars < data.total ? data.bars++ : (data.bars-- && (data.up=false)) : data.bars < 2 ? (data.bars++ && (data.up=true)) : data.bars--;
		if (!data.stop) {
			C.sync();
		}
	}

	return function() {
		if (!data.stop) {
			setTimeout(updateBars,150);
		}

		return C('div', {id:'App',style:{background:randomBackground(),padding:'1%'}}, [
			GraphText({name:graphName()}),
			C('button', {listeners:{onclick:stopStart}}, [data.stop ? 'start' : 'stop']),
			Graph({data:data})
		])
	}
}());

C.attach(App, document.getElementById('root'));


//************ other components
function Graph(f,c) {
	var bars = new Array(f.data.bars).fill(1).map(x=>Math.ceil(Math.random()*100));
	// ,gridGap:'.1em'
	return C('div', {style:{border:'1px solid rgb(1,1,1)',padding:'1%',display:'grid',gridAutoRows:'1.5vh',gridGap:'.5vh',background:randomBackground()}}, bars.map((c,i)=>Bar({val:c, name:i})));
}

function GraphText(f,c) {
	return C('div', {class:'graph-text',style:{textAlign:'center'}},[f.name]);
}

function Bar(f,c) {
	function background() {
		return `rgba(${random(255)},${random(255)},${random(255)},1)`;
	}
	// borderRadius:`${Math.floor(Math.random()*101)}%`,
	return C('div', {style:{borderRadius:`${Math.floor(Math.random()*101)}%`,width:f.val.toString()+'%',background:background()}}, [
		C('div', {}, [])
	]);
}


// ***************** helpers
function randomBackground() {
	return `rgba(${random(255)},${random(255)},${random(255)},${random(10)/10})`;
}

function random(n) {
	return Math.floor(Math.random()*(n+1));
}
