require 'java'

module AI

java_import Java::Java::lang::Integer

@m = nil

def self.m
  @m
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
		array.map!{|a| a.to_a}
		return array;
	end

	def self.board_obj_to_array_grid(board)
		return self.to_a_2D(board.toBasicString)
	end

	def self.array_grid_to_board_obj(array_grid, win_chain)
		board = Board.new(array_grid.length, win_chain)
		Board.gridFrom2DStringArray(array_grid.transpose, board)
		return board
	end

  def self.gameOver(board, player, move = nil)
    json_chain = []
    chain = board.sortList(board.chainLists.get(player)).get(0).getPieceCoords(board)
    chain.to_ary.each do |c|
      json_chain.push([c.x, c.y]) # transpose
    end
    return { :temp_data => {:status => player == 0 ? "black_winner" : "white_winner", :chain => json_chain, :win_coord => move,
                             :finalBoard => board.printS}.to_json }
  end
	def self.calc_move(this_game, win_chain)
    # [2,4]
    return_data = nil
    # this_game = Game.find(session[:game])
    this_game.update_attributes({:temp_data => nil, :backup_move => nil})

    p2_moves_json = this_game.p2_moves || "[]"
    p2_moves = JSON.parse(p2_moves_json)

    board0_json = this_game.board

    board0 = JSON.parse(this_game.board)

    board = self.array_grid_to_board_obj(board0, win_chain)
    board_copy = Board.new(board)
    if board.boardFull
      print "TIE*****"
      return {:temp_data => { :tie => true, :status => "tie"}}
    elsif board.isLose      
      return self.gameOver(board, 0)
    end

    movePair = nil
    backupPair = nil
    backupMove = nil
    # thisThread = nil

     backupMoveThread =  Thread.new do
        ActiveRecord::Base.connection_pool.with_connection do |conn|
        m = MultiAgentSearch.new(board_copy, {"maxDepth" => java.lang.Integer.new(4), 
                                          "movesConsidered" => java.lang.Integer.new(this_game.moves_considered),
                                          "aggressiveness" => java.lang.Integer.new(this_game.aggressiveness),
                                          "defensiveness" => java.lang.Integer.new(this_game.defensiveness)

                                            })
        # backupPair = m.minMaxAB(board, 1, 1, -999999, 999999)
        backupPair = m.negaMaxWithTimer(board_copy, 1, 1, -99999, 999999)

        backupMove = [backupPair.coord.x, backupPair.coord.y]
        print "Backup move:", backupMove

        this_game.update_attributes({:backup_move => {:backup => backupMove}.to_json})
        end
      end
    @m = MultiAgentSearch.new(board, {"maxDepth" => java.lang.Integer.new(this_game.depth), 
                                      "movesConsidered" => java.lang.Integer.new(this_game.moves_considered),
                                      "aggressiveness" => java.lang.Integer.new(this_game.aggressiveness),
                                      "defensiveness" => java.lang.Integer.new(this_game.defensiveness),
                                      "timeLimit" =>  java.lang.Integer.new(this_game.time_limit)

                                        })
    # movePair = m.minMaxAB(board, 1, 1, -999999, 999999)
    # movePair = @m.minMaxWithTimer(board, 1, 1, -99999, 99999)
    movePair = @m.negaMaxWithTimer(board, 1, 1, -99999, 999999)
    print "*$*move pair*$* ", movePair
    if @m.didTimeExpire == true
      if backupMoveThread.alive?
        puts "***JOINING***"
        backupMoveThread.join
      else
        puts "***BMT DEAD***"

      end
      movePair = backupPair
      puts "**TIME EXPIRED**"
      if backupPair == nil
        puts "*X*X*X*X*X BACKUP MOVE NOT READY*X*X*X*X*X*"
      end
    # else puts "TIME DID NOT EXPIRE"
    end
    # movePair = m.bestMove(1)
    move = movePair.coord
    move_array = [move.x, move.y]
    score = movePair.score
    board0[move_array[0]][move_array[1]] = "O"
    # return_data = 
    # this_game.update_attributes({:board => board0.to_json, :temp_data => move_array.to_json})
      # send_ai_move
      board2 = self.array_grid_to_board_obj(board0, win_chain)
      if board2.boardFull
        print "TIE*****"
        return {:temp_data => { :tie => true}}
      elsif board2.isWin
        print "WHITE WINS*****"
              return self.gameOver(board2, 1, move_array)


      end
      board2.print

    return { :board => board0.to_json, 
      :p2_moves => p2_moves.push(move_array).to_json, 
      
      :temp_data => { :coord => move_array,
                       :score => score, 
                        :p2_moves => p2_moves,
                        :status => "complete"}.to_json}
  end

end
