var Game = function (id) {

	this.id = id;
	this.currentPlayer = null;
	this.winChain = null;
	this.forceMove = false;
	var _depth;

	this.setDepth = function(depth){
		_depth = depth; 
	}

	this.getDepth = function(){
		return _depth;
	}
};