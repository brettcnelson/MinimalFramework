function Node(parent,color,board) {
	this.parent = parent;
	this.color = color;
	this.board = board;
	this.moveNo = 0;
	this.wins = 0;
	this.draws = 0;
	this.losses = 0;
	this.ratio = 0;
	this.castled = false;
	this.check = false;
	this.mate = false;
	this.draw = false;
	this.drawMoves = 0;
	this.moves = [];
}

Node.prototype.train = function() {
	this.draw || this.mate ? this.tally() : this.move().train();
}

Node.prototype.tally = function() {
	if (this.mate) {
		mate(this,this.color);
	}
	else {
		var node = this;
		while (node) {
			node.draws++;
			update(node);
			node = node.parent;
		}
	}
	function mate(node,color) {
		(function mate(node) {
			node.color === color ? node.wins++ : node.losses++;
			update(node);
			if (node.parent) {
				mate(node.parent);
			}
		}(node));
	}
	function update(node) {
		node.ratio = (node.wins-node.losses)/++node.total;
	}
}

Node.prototype.move = function() {
	if (!this.moves.length) {this.createMoves()}
	this.moves.forEach(m=>m.sim());
	return this.pickMove();
}

Node.prototype.pickMove = function() {
	var moves = this.moves.reduce((all,m) => {
		if (!all.length || m.ratio < all[0].ratio) {return [m]}
		if (m.ratio === all[0].ratio) {return all.concat(m)}
		return all;
	},[]);
	return moves[Math.floor(Math.random()*moves.length)];
}

Node.prototype.createMoves = function() {

}

Node.prototype.sim = function() {
	if (!this.moves.length) {
		this.createMoves();
		return this.moves[Math.floor(this.moves.length*Math.random())];
	}
	return this.pickMove();
}

Node.prototype.gameOver = function() {
	return false;
}





function App() {
	return C();
}

C.attach(App,document.getElementById('root'));
