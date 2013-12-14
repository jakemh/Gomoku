var Game = function (id) {

	var _id;
	var _depth;
	var _winChain;

	this.setID = function(id){
		_id = id; 
	}

	this.getID = function(){
		return _id;
	}

	this.setDepth = function(depth){
		_depth = depth; 
	}

	this.getDepth = function(){
		return _depth;
	}

	this.setWinChain = function(winChain){
		_winChain = winChain;
	}

	this.getWinChain = function(){
		return _winChain
	}
};