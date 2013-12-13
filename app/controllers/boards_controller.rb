require 'java'
@count = java.util.concurrent.atomic.AtomicInteger.new

class BoardsController < ApplicationController
  before_action :set_board, only: [:show, :edit, :update, :destroy]
  # include AI
  # GET /boards
  # GET /boards.json

  def index
    setup_new_game
  end

  # GET /boards/1
  # GET /boards/1.json
  def show
  end

  def setup_new_game
    # @rows = Defaults::BOARD_SIZE_DEFAULT
    # @win_chain = Defaults::CHAIN_SIZE_DEFAULT
    # @depth = Defaults::DEPTH_DEFAULT
    # @moves_considered = Defaults::MOVES_CONSIDERED

    # # @aggressiveness

    # games = Game.all
    # @game = Game.new({:game_id => (Game.all.length + 1), :rows => @rows , :board => Array.new(@rows){Array.new(@rows){" "}}.transpose.to_json})
    # @game.save
    # session[:game] = @game.game_id
    # session[:data] = {}
    # session[:data][:move_num] = 0



  end

  def start_new_game
    setup_new_game
    respond_to do |format|
       format.json { render json: { game_id: session[:game] } }
     end
  end



  #   puts "TEST"
  #   # respond_to do |format|
  #   #   format.json {render json: {:update => "**gomoku connection established**"} }
  #   # end

  # end




  def black_wins

  end

  def white_wins

  end



  private
    # Use callbacks to share common setup or constraints between actions.
    def set_board
      @board = Board.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def board_params
      params[:board]
    end
end
