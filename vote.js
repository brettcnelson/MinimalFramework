function Graph(graph,total) {
	var highest = graph[0][1];
	return C('div', {style:{display:'grid', gridGap:'.5em', padding:'.5em', borderTop:'2px solid black'}}, 
		graph.map((c,i) => {
			var style = {textAlign:'right'};
			return C('div', {style:{display:'grid', gridGap:'1%', gridTemplateColumns: '50px auto'}}, [
				C('p', { style }, [c[0]]),
				C('div', {style:{color:'gray', background:'black', width:`${c[1]*100/highest}%`, display:'grid', gridTemplateColumns:'1fr 1fr'}}, [
					C('p', {style:{textAlign:'left', paddingLeft:'.5em'}}, [''+(c[1]*100/total)+'%']),
					C('p', {style:{textAlign:'right', padding:'0 .5em'}}, [c[1]])
				])
			]);
		})
	);
}

function Fluid(b) {
	var tbs = 0;
	var graphs = [];
	var rounds = [];
	var template = {};
	b[0].forEach(c=>template[c] = 0);
	(function roundTally() {
		var round = Object.assign({}, template);
		b.forEach(ballot => {
			var i = 0;
			while (template[ballot[i]] === undefined) {i++}
			round[ballot[i]]++;
		});
		rounds.push(round);
		var graph = Object.keys(round).map(c=>[c,round[c]]).sort((a,b)=>b[1]-a[1]);
		var last = graph[graph.length-1];
		if (last[1] === 0) {
			graph = graph.filter(v=>{
				if (!v[1]) {
					delete template[v[0]];
					return false;
				}
				return true;
			});
			last = graph[graph.length-1];
		}
		var loser = last[0];
		var index = graph.length-2;
		if (last[1] === graph[index][1]) {
			var losers = [last];
			while (index > -1 && graph[index][1] === last[1]) {
				losers.push(graph[index--]);
			}
			loser = tiebreak(losers);
			if (last[0] !== loser) {
				graph.push(graph.splice(graph.indexOf(graph.find(v=>v[0]===loser)),1)[0]);
			}
		}
		if (Object.keys(template).length > 2) {
			delete template[loser];
			roundTally();
		}
		graphs.push(graph);
	}());

	function tiebreak(losers) {
		return all(breaker(losers),losers);
		function all(broken,losers) {
			tbs++;
			if (broken.length === 1) {
				return broken[0][0];
			}
			if (broken.length < losers.length) {
				return all(breaker(broken),broken);
			}
			return all(series(broken),broken);
		}

		function series(losers) {
			for (var i = rounds.length-1 ; i > -1 ; i--) {
				var round = {};
				losers.forEach(l=>round[l[0]] = rounds[i][l[0]]);
				var roundArray = makeArray(round);
				if (roundArray.length < losers.length) {
					return roundArray;
				}
			}
			round = {};
			losers.forEach(l=>round[l[0]] = 0);
			b.forEach(ballot => {
				ballot.forEach((c,i) => {
					if (round[c] !== undefined) {
						round[c] += ballot.length-i;
					}
				});
			});
			var ranked = makeArray(round);
			return ranked.length < losers.length ? ranked : [losers[Math.floor(Math.random()*losers.length)]];
		}

		function breaker(losers) {
			var tally = {};
			losers.forEach(l=>tally[l[0]]=0);
			b.forEach(ballot => {
				var i = 0;
				while (tally[ballot[i]] === undefined) {i++}
				tally[ballot[i]]++;
			});
			return makeArray(tally);
		}

		function makeArray(obj) {
			return Object.keys(obj).map(c=>[c,obj[c]]).sort((a,b)=>b[1]-a[1]).filter((c,i,a)=>c[1] === a[a.length-1][1]);
		}
	}

	return C('div', {style:{background:'orange'}}, [
		C('div', {style:{paddingTop:'.5em', textAlign:'center'}}, [`FLUID - ${rounds.length} rounds (${tbs} TB)`]),
		...graphs.map((g,i)=>C('div', {}, [
			C('div', {style:{textAlign:'center'}}, ['ROUND ' + (graphs.length-i)]),
			Graph(g,b.length)
		]))
	]);
}

function Ranked(b) {
	var tally = {};
	b.forEach(ballot=> {
		ballot.forEach((v,i) => {
			if (!tally[v]) {tally[v] = 0}
			tally[v] += ballot.length-i;
		});
	});
	var graph = [];
	for (var key in tally) {
		graph.push([key,tally[key]]);
	}
	graph.sort((a,b)=>b[1]-a[1]);
	var one = 1;
	for (var i = 1 ; i < b[0].length ; i++) {
		one += i+1;
	}
	var total = b.length*one;


	return C('div', {style:{background:'blue'}}, [
		C('div', {style:{paddingTop:'.5em', textAlign:'center'}}, ['RANKED - ' + total]),
		Graph(graph,total)
	]);
}

function Single(b,cands) {
	var tally = {};
	cands.forEach(c=>tally[c]=0);
	b.forEach(v=> {
		tally[v]++;
	});
	var graph = [];
	for (var key in tally) {
		graph.push([key,tally[key]]);
	}
	graph.sort((a,b)=>b[1]-a[1]);

	return C('div', {style:{background:'red'}}, [
		C('div', {style:{paddingTop:'.5em', textAlign:'center'}}, [`SINGLE - ${b.length} voters - ${cands.length} candidates`]),
		Graph(graph,b.length)
	]);
}

var App = (function() {
	var cands = ['trump', 'clinton', 'johnson', 'stein', 'sanders']
	.concat('a b c d e f g h i j k l m n o p q r s t'.split(' '));
	var voters = [];
	for (var i = 0 ; i < 1000 ; i++) {
		voters.push(shuffle(cands));
	}
	function shuffle(a) {
		var slice = a.slice()
		slice.forEach((c,i,a)=>a.push(a.splice(Math.random()*(a.length-i),1)[0]));
		return slice;
	}

	return function() {
		return C('div', {style:{background:'gray' ,padding:'1em', display:'grid', gridGap:'1em'}}, [
			Single(voters.map(b=>b[0]), cands),
			Ranked(voters),
			Fluid(voters)
		]);
	}
}());

C.attach(App,document.getElementById('root'));
