require 'spec_helper'

describe Game do
	before(:each) do
	    @game = Game.new({ 
		      rows: 3,
		      board: Array.new(3) { Array.new(3) { ' ' } }.transpose,
		      win_chain: 3,
		      moves_considered: 3,
		      depth: 3,
		      time_limit: 100,
		      defensiveness: 2,
		      aggressiveness:1})
	end

  	it "should be saved successfully" do
	    @game.save 
	    @game.should be_persisted
  	end

  	it "should be able to add an X" do
	    @game.add_x_at_coord([1,1])
	    @game.board[1][1].should == "X"
  	end

  	describe Gomoku::AI do
		it "should be able to add a response" do
			@game.add_x_at_coord([1,1])
			response = Gomoku::AI.get_response_data(@game)[:p2_moves].last
			@game.board[response[0]][response[1]].should == "O"
		end

		it "should be able to stop a threat" do
		    @game.add_x_at_coord([1,1])
		    @game.add_x_at_coord([1,0])
		    Gomoku::AI.get_response_data(@game)
		    @game.board[1][2].should == "O"
		end

		it "should be able to stop another threat" do
		    @game.add_x_at_coord([0,0])
		    @game.add_x_at_coord([1,0])
		    Gomoku::AI.get_response_data(@game)
		    @game.board[2][0].should == "O"
		end

		it "should be able to stop yet another threat" do
		    @game.add_x_at_coord([0,0])
		    @game.add_x_at_coord([2,2])
		    Gomoku::AI.get_response_data(@game)
		    @game.board[1][1].should == "O"
		end

		it "should be able to produce a winner" do
		    @game.add_o_at_coord([1,1])
		    @game.add_o_at_coord([1,0])
		    response = Gomoku::AI.get_response_data(@game)
		    response[:status].should == "white_winner"
		end

		it "should be able to produce a tie" do
		    @game.add_x_at_coord([0,0])
		    @game.add_o_at_coord([0,1])
		    @game.add_o_at_coord([0,2])
		    @game.add_o_at_coord([1,0])
		    @game.add_x_at_coord([1,1])
		    @game.add_o_at_coord([1,2])
		    @game.add_x_at_coord([2,0])
		    @game.add_o_at_coord([2,1])

		    response = Gomoku::AI.get_response_data(@game)
		    response[:status].should == "tie"
		end
	end
end