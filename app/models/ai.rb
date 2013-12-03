require 'java'

module AI


java_import Java::Gomokuproj::Tuple
java_import Java::Gomokuproj::Board
java_import Java::Gomokuproj::MultiAgentSearch
java_import Java::Gomokuproj::Constants

a = java.util.ArrayList.new [:a, :b, "c", "d"]
tup = Tuple.new(2, 0)

a.add(tup)
puts a  # => [a, b, c, d, e, #<Fun:0x6e511470>, test]

b = []
# board = Board.buildFromInput("3")
# print board.print
b = Board.new(4,3)
# b.print

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
    chain = board.chainLists.get(player).get(0).getPieceCoords(board)
    chain.to_ary.each do |c|
      json_chain.push([c.x, c.y]) # transpose
    end
    return { :temp_data => { player.to_s => json_chain, "winCoord" => move}.to_json }
  end
	def self.calc_move(this_game, win_chain)
    # [2,4]
    return_data = nil
    # this_game = Game.find(session[:game])
    this_game.update_attributes(:temp_data => nil)

    p2_moves_json = this_game.p2_moves || "[]"
    p2_moves = JSON.parse(p2_moves_json)

    board0_json = this_game.board

    board0 = JSON.parse(this_game.board)

    board = self.array_grid_to_board_obj(board0, win_chain)
    if board.boardFull
      print "TIE*****"
      return {:temp_data => { :tie => true}}
    elsif board.isWin
      puts "BLACK WINS*****"
      return self.gameOver(board, 0)
    end

    m = MultiAgentSearch.new(board, {"maxDepth" => java.lang.Integer.new(this_game.depth), "movesConsidered" => java.lang.Integer.new(this_game.moves_considered)})
    # movePair = m.minMaxAB(board, 1, 1, -999999, 999999)
    movePair = m.bestMove(1)
    move = movePair.coord
    move_array = [move.x, move.y]
    print "MOVE ARRAY: ", move_array
    score = movePair.score
    print "SCORE: ", score
    board0[move_array[0]][move_array[1]] = "O"
    # return_data = 
    # this_game.update_attributes({:board => board0.to_json, :temp_data => move_array.to_json})
      # send_ai_move
      board2 = self.array_grid_to_board_obj(board0, win_chain)
      if board2.boardFull
        print "TIE*****"
        return {:temp_data => { :tie => true}}
      elsif board2.isLose
        print "WHITE WINS*****"
              return self.gameOver(board2, 1, move_array)


      end
      board2.print

    return { :board => board0.to_json, 
      :p2_moves => p2_moves.push(move_array).to_json, 
      :temp_data => { :coord => move_array,
                       :score => score, 
                        :p2_moves => p2_moves}.to_json}
  end

end
