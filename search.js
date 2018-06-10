function Names(feed,children) {
	return C('div', {style: {display:'grid', gridTemplateColumns:'repeat(5,1fr)', gridGap: '1em', padding: '1em', background: 'black'}}, 
		feed.names.filter(name=>~name.indexOf(feed.search)).map(n=>C('div', {style: {overflow: 'scroll', border: '1px solid black', background: 'blue', textAlign: 'center', padding: '2em'}}, [n]))
	);
}

function Search(feed,children) {
	return C('div', {style: {textAlign: 'center', padding: '1em', background: 'red'}}, [
		C('input', {style: {width: '25%'}, listeners: {onkeyup:feed.changeSearch}, type:'text', placeholder: 'search here', autofocus:true})
	]);
}

var App = (function() {
	var names = 'aaron barbara chloe david edwardo frank george hannah iris joey kristin louis mary nick oliver patrick quincy roger sabrina teresa ulysses veronica william xavier yeren zack'.split(' ');
	var search = '';
	function changeSearch(e) {
		search = e.target.value;
		C.sync();
	}
	return function() {
		return C('div', [
			Search({changeSearch:changeSearch}),
			Names({names:names, search:search})
		]);
	}
}());

C.attach(App, document.getElementById('root'));
