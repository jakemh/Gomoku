var Board = function () {

	var _this = this;
	var _rows = 0;
	var _pieceArray = [];
	this.squareArray = [];
	var _active = true;

	this.active = function(){
		return _active;
	};

	this.setRows = function(rows){
		_rows = rows;
	};

	this.getRows = function(){
		return _rows;
	}

	this.getSquare = function(x,y){

	};

	this.squareEmpty = function(x, y){

	};

	this.boardEmpty = function(){
		if (_pieceArray.length === 0){
			return true;
		} else return false;
	};

	this.clearPieces = function(){
		_pieceArray = []
	}

	this.moveCount = function(){
		return _pieceArray.length;
	}

	this.addPiece = function(element){
		_pieceArray.push(element);
	};

	this.addWhitePiece = function(){

	};

	this.addBlackPiece = function(){

	};

	this.enable = function(){
		_active = true;
	};

	this.disable = function(){
		_active = false;
	};
};