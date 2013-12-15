class Game < ActiveRecord::Base
	serialize :p1_moves
	serialize :p2_moves
	serialize :board
	serialize :win_chain_array

	def add_x_at_coord(coord)
		board = self.board
		board[coord[0].to_i][coord[1].to_i] = 'X'
		if (self.update_attributes(board: board))
		  # send_ai_move
		end
	end
end
