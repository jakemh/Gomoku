require 'java'
module Gomoku
  module AI

    java_import Java::Java.lang::Integer

    def self.mainMultiAgent
      @mainMultiAgent
    end

      java_import Java::Gomokuproj2::Board
      java_import Java::Gomokuproj2::MultiAgentSearch
      java_import Java::Gomokuproj2::Constants

  # convert java array to ruby array
    def self.to_a_2D(array)
      array = array.to_a
      array.map! { |a| a.to_a }
      array
    end

    def self.board_obj_to_array_grid(board)
      to_a_2D(board.toBasicString)
    end

  # get java board object from ruby aray
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

    def self.get_move_pair(multiAgent, board)
      multiAgent.negaMaxWithTimer(board)
    end

    def self.move_pair(board, this_game) # get data from java code
      board_copy = Board.new(board)

      # this function call can be killed outside of thread
      @mainMultiAgent = MultiAgentSearch.new(board, optionsHash(this_game.depth, this_game))
     
      move_pair = get_move_pair(@mainMultiAgent, board)
      print 'move pair: ', move_pair

    
      if @mainMultiAgent.didTimeExpire == true

        # you SHOULD provide a backup move block
        # it's not NECESSARY because the multiagent will still provide a response
        # but if the call is terminated between depths, the response may be wrong
        if block_given?
          move_pair = yield(board_copy)
        end
      end
      move_pair
    end

    def self.move_pair_with_backup(board, this_game)
    # this is all on the same thread only for simplicity
    # would be more efficient on background thread 
      move_pair(board, this_game) do |board_copy|
        # this call is very fast 
        backup_multi_agent = MultiAgentSearch.new(board_copy, optionsHash(4, this_game))
        backup_move_pair = get_move_pair(backup_multi_agent, board_copy)
        puts '**TIME EXPIRED**'
        return backup_move_pair
      end
    end

    # returns status + relevant game state 
    def self.get_response_data(this_game)
      p this_game
      board0 = this_game.board
      win_chain = this_game.win_chain

      board = array_grid_to_board_obj(board0, win_chain)
      # board = Board.buildFromInput("gomokuproj2/input/", "3")

      p2_moves = this_game.p2_moves || []
      board.printNoTrans

      # we can safely return function before expensive move_pair is called
      
      # condition: tie after p2 move
      return { status: 'tie' } if board.boardFull

      # condition: p1 loses
      return game_over(board, 0,  p2_moves.push(nil)) if board.isLose

      move_pair = move_pair_with_backup(board, this_game) # getting key data      
      move_array = [move_pair.coord.x, move_pair.coord.y]

      score = move_pair.score
      board0[move_array[0]][move_array[1]] = 'O'
      board2 = array_grid_to_board_obj(board0, win_chain)
      board2.printNoTrans

      # condition: tie after p1 move 
      return  {status: 'tie', board: board0, white_score: score, p2_moves: p2_moves.push(move_array) } if board2.boardFull
      
      # condition: p1 wins
      return game_over(board2, 1, p2_moves.push(move_array)) if board2.isWin
      
      # condition: game in progress
      return { board: board0, white_score: score, p2_moves: p2_moves.push(move_array),
               status: 'in_progress', backup_move: { backup: [move_pair.coord.x, move_pair.coord.y] }.to_json  }
    end
  end
end
