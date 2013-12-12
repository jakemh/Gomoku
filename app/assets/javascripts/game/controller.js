GameController = function () {
	var _this = this;
	var view, board, menu;
	var id = null;

	var ViewDelegate;
	ViewDelegate = function () {};

	function init(){
		_this.delegate = new ViewDelegate();
		view = new View(_this.delegate);
		board = new Board();
		menu = new Menu();
		board.setRows($(".outer").data("rows"));

	}
	
	var ajax = new Ajax();

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
		view.addTitleButtonLoadBackground();
		_this.startNewGame();
		view.$board.empty();
		view.squareArray = new Array(board.getRows());
		view.renderBoard(board.getRows());
		view.addLoader();
	};

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
	view.squareArray[coord[0]][coord[1]].children('.white-stone').hide().fadeIn("slow");
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
ViewDelegate.prototype.getRows = function(){
	return board.getRows();
}

this.startNewGame = function () {
	ajax.startNewGame().done(function (data) {
		view.$outer.data({
			"rows": data.rows,
			"win_chain": data.win_chain,
			"game_id": data.game_id
		});
	}).always(function () {
		view.removeTitleLoadingBackground();
	});
};

ViewDelegate.prototype.sendOptions = function (id, opt) {

	var options = opt || {};
	var sendData = $(".edit_game").serialize();
	ajax.sendOptions(view.$outer.data("game_id"), sendData).done(function (data) {}).fail(function (data) {}).always(function (data) {
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
		try {
			if (data !== null) {
				if ("status" in data){
					var status = data["status"];
					console.log(status)
					// view.textBox.text(status + "\n" + view.textBox.val())
					if (status == "complete"){
						_this.checkMoveCount(data, function(){
							_this.addWhitePiece( data.coord);
							board.enable();
							view.removeSpinner();
							view.textBox.text("White: " + JSON.stringify(data.coord) + "\n" + view.textBox.val())		

						});
					}else if (status == "processing"){
						_this.getAIMoveWithTimer('/get_ai_move_retry/', count + 1);
					}else if (status == "established"){
						_this.getAIMoveWithTimer('/get_ai_move_retry/', count + 1);
					}else if (status == "black_winner"){
						view.win(data["chain"]);
					}else if (status == "white_winner"){
						_this.addWhitePiece(data.win_coord);
						view.win(data["chain"]);
					}else if (status == "tie"){
						view.removeSpinner();
					}else if (status == "error"){

					}
				} else {
					console.log("data does not provide a status")
				}
			} else { // data is null
				console.log("data null");
				_this.getAIMoveWithTimer('/get_ai_move_retry/', count + 1);
			}
		} catch (e) {
			if (e instanceof TypeError) {
				console.log(e)
				console.log("***ERROR***");
				console.log(data);
				_this.getAIMoveWithTimer('/get_ai_move_retry/', count + 1);
			}
		}
	};

	this.checkMoveCount = function(data, callback){
		if (data.p2_moves.length > ((board.moveCount() - 1) / 2)) {
			callback()
		} else {
			console.log("RETURNED WRONG MOVE, KEEP CHECKING");
			_this.getAIMoveWithTimer('/get_ai_move_retry/', count + 1);
		}
	}

	init()

};