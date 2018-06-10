function Square(feed,children) {
	function color() {
		return Math.floor(Math.random()*256);
		// return 255;
	}
	return C('div', {style:{height:'100%', width:'100%', background:`rgba(${color()},${color()},${color()},${Math.random()})`}});
}

var Row = (function() {
	return function Row(feed,children) {
		return C('div', {style:{height:`${(100/feed.row.length)*(feed.cols/feed.rows)}%`, padding:'.125%', gridColumnGap:'.25%', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(1px,1fr))'}},
			feed.row.map(s=>Square())
		);
	}
}());

var App = (function() {
	var grid = [[]];
	var c = 100;
	var r = 100;
	var delay = 0;

	return function() {
		if (grid[grid.length-1].length < c) {
			grid[grid.length-1].push(1);
		}
		else if (grid.length < r) {
			grid.push([1]);
		}
		setTimeout(C.sync,delay);
		
		return C('div', {style:{background:'rgb(0,0,0)',height:'100vh', padding:'1%', width:'100vw'}},
			grid.map(row=>Row({row:row,rows:r,cols:c}))
		);
	}
}());

C.attach(App, document.getElementById('root'));
