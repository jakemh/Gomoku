class Game < ActiveRecord::Base
	serialize :p2_moves
	serialize :board
	serialize :win_chain_array
end
