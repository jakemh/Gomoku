require 'java'

module AI

  java_import Java::Java.lang::Integer

  def self.mainMultiAgent
    @mainMultiAgent
  end

  VERSION = 2

  if VERSION == 1
    java_import Java::Gomokuproj::Board
    java_import Java::Gomokuproj::MultiAgentSearch
    java_import Java::Gomokuproj::Constants
  elsif VERSION == 2
    java_import Java::Gomokuproj2::Board
    java_import Java::Gomokuproj2::MultiAgentSearch
    java_import Java::Gomokuproj2::Constants
  end

  def self.to_a_2D(array)
    array = array.to_a
    array.map! { |a| a.to_a }
    array;
  end

  def self.board_obj_to_array_grid(board)
    to_a_2D(board.toBasicString)
  end

  def self.array_grid_to_board_obj(array_grid, win_chain)
    board = Board.new(array_grid.length, win_chain)
    Board.gridFrom2DStringArray(array_grid.transpose, board)
    board
  end

  def self.game_over(board, player, p2_moves)
    puts "GAME OVER"
    chain = board.sortList(board.chainLists.get(player)).get(0).getPieceCoords(board)
    chain_array = []
    chain.to_ary.each { |c| chain_array.push([c.x, c.y]) }
    { p2_moves: p2_moves, status: player == 0 ? 'black_winner' : 'white_winner', win_chain_array: chain_array }
   end


   def self.optionsHash(depth, this_game)
    { 'maxDepth' => java.lang.Integer.new(depth),
     'movesConsidered' => java.lang.Integer.new(this_game.moves_considered),
     'aggressiveness' => java.lang.Integer.new(this_game.aggressiveness),
     'defensiveness' => java.lang.Integer.new(this_game.defensiveness),
     'timeLimit' =>  java.lang.Integer.new(this_game.time_limit)
    }
  end

  def self.get_board_from_game_obj(this_game)
    board0_json = this_game.board
    board0 = JSON.parse(this_game.board)
    board = array_grid_to_board_obj(board0, this_game.win_chain)
    board
  end

  def self.get_move_pair(multiAgent, board)
    multiAgent.negaMaxWithTimer(board, 1, 1, -999999, 999999)
  end

  def update_board
    board0 = JSON.parse(this_game.board)
    yield
    board0[move_array[0]][move_array[1]] = 'O'

  end

  def self.move_pair(board, this_game) # get data from java code
    backupPair = nil, backupMove = nil
    board_copy = Board.new(board)

    @mainMultiAgent = MultiAgentSearch.new(board, optionsHash(this_game.depth, this_game))
    backupMultiAgent = MultiAgentSearch.new(board_copy, optionsHash(4, this_game))

    movePair = get_move_pair(@mainMultiAgent, board)

    print '*$*move pair*$* ', movePair
    if @mainMultiAgent.didTimeExpire == true
      backupPair = get_move_pair(backupMultiAgent, board_copy)
      backupMove = [backupPair.coord.x, backupPair.coord.y]
      print 'Backup move:', backupMove
      this_game.update_attributes({ backup_move: { backup: backupMove }.to_json })
      movePair = backupPair
      puts '**TIME EXPIRED**'

    end
    movePair
  end

  def self.game_data(this_game, win_chain)

    board0 = this_game.board
    board = array_grid_to_board_obj(board0, win_chain)
    p2_moves = this_game.p2_moves || []
    puts "BOARD1"
    board.print

    return {status: 'tie' } if board.boardFull
    return game_over(board, 0,  p2_moves.push(nil)) if board.isLose
    # board = Board.buildFromInput("gomokuproj2/input/", "3")
    movePair = move_pair(board, this_game) # getting key data
    move_array = [movePair.coord.x, movePair.coord.y]
    score = movePair.score
    board0[move_array[0]][move_array[1]] = 'O'
    board2 = array_grid_to_board_obj(board0, win_chain)
    board2.print
    return  {status: 'tie', board: board0, white_score: score, p2_moves: p2_moves.push(move_array) } if board2.boardFull
    return game_over(board2, 1, p2_moves.push(move_array)) if board2.isWin
    puts "NOT GAME OVER "
    return { board: board0, white_score: score, p2_moves: p2_moves.push(move_array),
             status: 'in_progress' }
     end

   end
