var App = (function() {
	
	function Child(feed,children) {
		return C('div', {id:'change',listeners:{onclick:(e)=>feed.changeName(e)},style:{fontSize:'5em',padding:'2em'}}, [`name=${feed.name}`,
			C('code', {style:{fontSize:'.5em',display:'block'}}, ['click on this <div> to change the name'])
		]);
	}

	function changeName(e) {
		name = prompt('change the name to:');
		C.sync();
	}

	function rgb() {
		return Math.floor(Math.random()*256);
	}

	var name = 'C';

	return function() {
		return C('div', {style:{textAlign:'center',background:`rgb(${rgb()},${rgb()},${rgb()})`}}, [
			Child({name:name,changeName:changeName})
		]);
	}
}());

C.attach(App, document.getElementById('root'));
