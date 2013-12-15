GameController = function () {
	var _this = this;
	var view, board, menu, slider, ajax, ViewDelegate, game;
	ajax = new Ajax();

	ViewDelegate = function () {};

	function init(){
		_this.delegate = new ViewDelegate();
		view = new View(_this.delegate);
		board = new Board();
		game = new Game(); 
		game.setDepth($(".board").data("depth"))
		game.setID($(".board").data("id"))
		menu = new Menu(_this.delegate);
		slider = new Slider(_this.delegate);
		board.setRows($(".board").data("rows"));
	}
	

/************
view requires: 
	sendHumanMove()
	startNewGame()
	sendOptions()
	getRows()
	*************/
	
	ViewDelegate.prototype.newGame = function(){
		game = new Game(); 
		board.clearPieces()
		board.enable()
	
		view.clearMenuTextBox();
		_this.startNewGame();
		view.removeSpinner();
		view.$board.empty();
		view.squareArray = new Array(board.getRows());
		view.renderBoard(board.getRows());
		view.addLoader();
	};

	ViewDelegate.prototype.forceMoveButton = function(){
		view.forceMove = true;
	}

	ViewDelegate.prototype.makeMove = function () {
		if (board.active() === true) {
			$square = $(this);
			coord = $square.data("coord");
			console.log(coord);
      // var isNewGame = boardEmpty();
      if (_this.addBlackPiece(coord) === true) {
      	view.applyLoader = true;

      	_this.sendHumanMove({
      		"coord": coord
      	});
      	board.disable();
      } else {

      }
  }
};

ViewDelegate.prototype.board = board;

this.addPiece = function(coord, element){
	view.squareArray[coord[0]][coord[1]].append(element);
	board.addPiece(element);
}

this.addWhitePiece = function (coord) {
	console.log("COORD: " + coord);
	_this.addPiece(coord, view.$whiteStone.clone());
	view.squareArray[coord[0]][coord[1]].children('.white-stone').css({
      opacity: 0,
      display: 'inline-block',
      boxShadow: '0 0 30px rgba(255, 255, 255, 0.75)'
    	}).fadeIn("slow").animate({opacity: 1,
    	boxShadow: '0 0 5px rgba(255, 255, 255, 0.75)'}, 750);;
};


this.addBlackPiece = function (coord) {
	if (view.squareArray[coord[0]][coord[1]].children(".stone").length > 0) {
	    // alert("NOT EMPTY" + squareArray[coord[0]][coord[1]].children())
	    return false;

	} else {
		_this.addPiece(coord, view.$blackStone.clone());
		return true;
	}

};

this.sendHumanMove = function (opt) {
	options = opt || {};
	view.forceMove = false;
	view.textBox.text("Black: " + JSON.stringify(opt.coord) + "\n" + view.textBox.val());	

	setTimeout(function () {
		view.startSpinner();
	}, 300);

	Ajax.sendHumanMove(options).done(function (data) {
		_this.getAIMove('/get_ai_move/', 0);
	});
};

ViewDelegate.prototype.getRows = function(){
	return board.getRows();
}
ViewDelegate.prototype.getDepth = function(){
	return game.getDepth();
}

this.startNewGame = function () {
	ajax.startNewGame().done(function (data) {
		game.setDepth(data.depth);

		game.setID(data.game_id)
		board.setRows(data.rows)
		game.setWinChain(data.win_chain)
		view.$outer.data({
			"rows": data.rows,
			"win_chain": data.win_chain,
			"game_id": data.game_id
		});
	}).always(function () {
		view.removeTitleLoadingBackground();
	});
};

ViewDelegate.prototype.updateDepth = function(depth){
	$('input[name="game[depth]"]').val(depth)
	_this.delegate.sendOptions()
}

ViewDelegate.prototype.sendOptions = function (id, opt) {
	var options = opt || {};
	var sendData = $(".edit_game").serialize();
	ajax.sendOptions(game.getID(), sendData).done(function (data) {}).fail(function (data) {}).always(function (data) {
		view.$outer.data({
			"rows": data.rows
		});
		board.setRows(data.rows)
	});
};

this.getAIMove = function (path, count) {
	opt = {
		force: view.forceMove
	};
	$.ajax({
		url: path,
		type: 'put',
		async: true,
		data: $.param(opt),
		timeout: 99999999,
		dataType: 'json',
		beforeSend: function (xhr) {
				// xhr.setRequestHeader("Accept", "application/json");
				xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
			}
		}).always(function (data, xhr, jqXHR) {
			_this.aiMoveCallback(data, count);
		});
	};

	this.getAIMoveWithTimer = function (path, count) {
		setTimeout(function () {
			_this.getAIMove(path, count);
		}, 1000 * count / 4);
	};

	this.aiMoveCallback = function (data, count) {
		xmlhttp = new XMLHttpRequest();
			if (data !== null) {
				console.log(data);
				if (data["status"] !== undefined){
					var status = data["status"];
					console.log(status)
					// view.textBox.text(status + "\n" + view.textBox.val())
					if (status == "in_progress"){
						_this.checkMoveCount(data, count, function(){
							_this.addWhitePiece(data.coord);
							board.enable();
							view.removeSpinner();
							view.textBox.text("White: " + JSON.stringify(data.coord) + "\n" + view.textBox.val())		

						});
					}else if (status == "processing"){
						_this.getAIMoveWithTimer('/get_ai_move_retry/', count + 1);
					}else if (status == "established"){
						_this.getAIMoveWithTimer('/get_ai_move_retry/', count + 1);
					}else if (status == "black_winner"){
						view.win(data["win_chain_array"]);
					}else if (status == "white_winner"){
						_this.addWhitePiece(data.coord);
						view.win(data["win_chain_array"]);
					}else if (status == "tie"){
						view.tie();
					}else if (status == "error"){

					}
				} else {
					console.log("data does not provide a status")
					_this.getAIMoveWithTimer('/get_ai_move_retry/', count + 1);

				}
			} else { // data is null
				console.log("data null");
				_this.getAIMoveWithTimer('/get_ai_move_retry/', count + 1);
			}
	};

	this.checkMoveCount = function(data, count, callback){
		console.log("MOVE COUNT0: " + board.moveCount());
		if (data.p2_moves.length > ((board.moveCount() - 1) / 2)) {
			callback()
			console.log("MOVE COUNT1: " + board.moveCount());

		} else {
			console.log("RETURNED WRONG MOVE, KEEP CHECKING");
			_this.getAIMoveWithTimer('/get_ai_move_retry/', count + 1);
		}
	}

	init()

};